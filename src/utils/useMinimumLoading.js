//Katinka
//3 sekunders loading til at visualisere Loading Skeleton
//Fået hjælp af AI
import { useState, useEffect } from "react";

function useMinimumLoading(isLoading, ms = 3000) {
  const [showSkeleton, setShowSkeleton] = useState(true); //initialt true

  useEffect(() => {
    if (!isLoading) {
      // Data færdig med at loade, start timer for minimum loading tid
      const timer = setTimeout(() => setShowSkeleton(false), ms);
      return () => clearTimeout(timer);
    } else {
      // Hvis loading starter igen: vis skeleton med det samme
      setShowSkeleton(true);
    }
  }, [isLoading, ms]);

  return showSkeleton;
}

export default useMinimumLoading;
