"use client";

import { useEffect } from "react";
import { onCLS, onLCP, onINP, onFCP, onTTFB } from "web-vitals";

export default function ReportWebVitals() {
  useEffect(() => {
    onCLS(console.log);
    onLCP(console.log);
    onINP(console.log);
    onFCP(console.log);
    onTTFB(console.log);
  }, []);

  return null;
}
