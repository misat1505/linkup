import { useEffect } from "react";

export default function useClickOutside(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: React.RefObject<any>,
  cb: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        cb();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, cb]);
}
