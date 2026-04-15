import { useEffect } from "react";

export default function useDelay(cb: () => void, delay: number) {
  useEffect(() => {
    setTimeout(cb, delay);
  });
}
