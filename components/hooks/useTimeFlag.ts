import { useEffect, useState } from "react";

export const useTimeFlag = (time?: Date) => {
  const [reached, setReached] = useState(time && Date.now() > time.getTime());

  useEffect(() => {
    setReached(time && Date.now() > time.getTime());
  }, [time]);

  useEffect(() => {
    if (time && !reached) {
      const remaining = time.getTime() - Date.now();
      const timeout = setTimeout(() => setReached(true), remaining);
      return () => clearTimeout(timeout);
    }
  }, [reached, time]);

  return reached;
};
