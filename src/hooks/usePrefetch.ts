import { useEffect, useRef } from "react";

/**
 * Hook to prefetch a component when hovering over a trigger element
 */
export function usePrefetch(
  prefetchFn: () => Promise<any>,
  enabled: boolean = true
) {
  const prefetchedRef = useRef(false);

  const handleMouseEnter = () => {
    if (!prefetchedRef.current && enabled) {
      prefetchFn();
      prefetchedRef.current = true;
    }
  };

  return { onMouseEnter: handleMouseEnter };
}

