import { useEffect, useState } from "react";

export const useScrollExceeds = (breakpoint: number) => {
  const [exceeds, setExceeds] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const _exceeds = window.scrollY >= breakpoint;
      if (exceeds !== _exceeds) setExceeds(_exceeds);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [breakpoint, exceeds]);

  return exceeds;
};
