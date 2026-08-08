"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hides the header while scrolling down past `threshold`, reveals it again
 * as soon as the user scrolls up (or is near the top of the page).
 */
export function useHideOnScroll(threshold = 80) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const goingDown = y > lastY.current;

      if (y < threshold) {
        setHidden(false);
      } else if (goingDown) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
