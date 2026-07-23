import { useCallback, useLayoutEffect, useRef, useState } from "react";

const MIN_TABLE_HEIGHT = 240;

/**
 * Sets height so an element fills from its top edge to the viewport bottom.
 * Avoids h-screen on nested content (which causes a page-level scrollbar).
 */
export function useFillViewportHeight(bottomOffset = 16, enabled = true) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const measure = useCallback(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    const top = el.getBoundingClientRect().top;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const next = Math.floor(viewportHeight - top - bottomOffset);
    setHeight(Math.max(next, MIN_TABLE_HEIGHT));
  }, [bottomOffset, enabled]);

  useLayoutEffect(() => {
    if (!enabled) {
      setHeight(null);
      return undefined;
    }

    // Defer one frame so header/layout settle before measuring
    const raf = window.requestAnimationFrame(() => measure());

    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);

    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);

    let node = ref.current?.parentElement;
    while (node) {
      ro.observe(node);
      node = node.parentElement;
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [enabled, measure]);

  return { ref, height };
}
