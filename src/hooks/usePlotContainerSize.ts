import { useEffect, useRef, useState } from 'react';

/**
 * Tracks content-box size for Plotly (needs numeric width/height when autosizing).
 */
export function usePlotContainerSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(0, Math.floor(rect.width));
      const h = Math.max(0, Math.floor(rect.height));
      setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, ...size };
}
