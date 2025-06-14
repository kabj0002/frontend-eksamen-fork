//3 sekunders loading til at visualisere Loading Skeleton
//Fået hjælp af AI
import { useState, useEffect } from "react";

/**
 * Hook der sikrer loading i mindst `ms` millisekunder
 * @param {boolean} isLoading - om data stadig loader
 * @param {number} ms - minimum loading tid i ms, fx 3000 for 3 sek
 * @returns {boolean} showSkeleton - om skeleton/loading skal vises
 */
function useMinimumLoading(isLoading, ms = 3000) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      // Data færdig, start timer for minimum loading tid
      const timer = setTimeout(() => setShowSkeleton(false), ms);
      return () => clearTimeout(timer);
    } else {
      // Hvis loading starter igen (fx refetch), vis skeleton med det samme
      setShowSkeleton(true);
    }
  }, [isLoading, ms]);

  return showSkeleton;
}

export default useMinimumLoading;
