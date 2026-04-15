import { useEffect, useState } from "react";

export const useLocalStorageAnimation = (
  name: string,
  interval: number
): boolean => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const checkAnimation = () => {
      const storedDate = window.localStorage.getItem(name);

      if (!storedDate) {
        window.localStorage.setItem(name, new Date().toISOString());
        setShouldAnimate(true);
        return;
      }

      const date = new Date(storedDate);
      const now = Date.now();

      if (now - date.getTime() < interval) {
        setShouldAnimate(false);
      } else {
        window.localStorage.setItem(name, new Date().toISOString());
        setShouldAnimate(true);
      }
    };

    checkAnimation();
  }, [name, interval]);

  return shouldAnimate;
};
