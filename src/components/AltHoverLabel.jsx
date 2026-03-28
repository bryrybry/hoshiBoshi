import React, { useState, useEffect, useRef } from "react";
import styles from "../stylesheets/AltHoverLabel.module.css";
import { useScrollTriggerOnDemand } from "../helper/useScrollTriggerOnDemand";

const AltHoverLabel = ({
  children,
  text,
  showText = false,
  bottom = "1rem",
  tabIndex = 0
}) => {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);

  const startScrollWatcher = useScrollTriggerOnDemand();
  const tabPressed = useRef(false);

  let validChild = children;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") tabPressed.current = true;
    };
    const handleMouseDown = () => {
      tabPressed.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("touchstart", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchstart", handleMouseDown);
    };
  }, []);

  if (React.isValidElement(children)) {
    const tag = typeof children.type === 'string' ? children.type : '';
    if (tag === 'img' || tag === 'video') {
      validChild = <span>{children}</span>;
    }
  } else {
    validChild = <span>{children}</span>;
  }

  const isActive = hover || focused || showText;

  const combinedClassName = [
    validChild.props.className,
    styles.hoverLabel,
    isActive ? styles["hoverLabel-active"] : ""
  ].filter(Boolean).join(" ");

  return React.cloneElement(validChild, {
    className: combinedClassName,
    "data-text-content": text,
    style: {
      ...(validChild.props.style || {}),
      "--hover-bottom": bottom,
    },
    onMouseEnter: (e) => {
      setHover(true);
      validChild.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e) => {
      setHover(false);
      validChild.props.onMouseLeave?.(e);
    },
    onTouchStart: (e) => {
      setHover(true);
      validChild.props.onTouchStart?.(e);
      startScrollWatcher(20, () => {
        setHover(false); // after scrolling away 20% of screen height
      });
    },
    onFocus: (e) => {
      if (tabPressed.current) {
        setFocused(true);
      }
      validChild.props.onFocus?.(e);
    },
    onBlur: (e) => {
      setFocused(false);
      validChild.props.onBlur?.(e);
    },
    tabIndex: tabIndex, // ensure focusable if not already
  });
};

export default AltHoverLabel;
