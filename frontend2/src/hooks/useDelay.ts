import { useEffect } from "react";

export default function useDelay(cb: Function, delay: number) {
  useEffect(() => {
    setTimeout(cb, delay);
  });
}
