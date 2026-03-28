import { useEffect, useRef } from "react";

export function useScrollTriggerOnDemand() {
  const activeRef = useRef(false);
  const startScrollY = useRef(0);
  const scrollThreshold = useRef(0);
  const callbackRef = useRef(null);
  const triggeredRef = useRef(false);

  const activate = (percentOfViewport, callback) => {
    startScrollY.current = window.scrollY;
    scrollThreshold.current = (percentOfViewport / 100) * window.innerHeight;
    callbackRef.current = callback;
    triggeredRef.current = false;
    activeRef.current = true;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!activeRef.current || triggeredRef.current) return;

      const currentY = window.scrollY;
      const delta = Math.abs(currentY - startScrollY.current);
      // console.log("Delta scrolled:", delta);
      // console.log("Threshold:", scrollThreshold.current);

      if (delta >= scrollThreshold.current) {
        triggeredRef.current = true;
        callbackRef.current?.();
        // console.log("Callback triggered");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return activate;
}
