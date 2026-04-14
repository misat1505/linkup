import { useEffect } from "react";

export default function useChangeTabTitle(title: string) {
  useEffect(() => {
    if (!title) document.title = "LinkUp";
    else document.title = `LinkUp - ${title}`;
  }, []);
}
