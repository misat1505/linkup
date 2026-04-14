import type { MetricKey } from "./types.js";
import path from "path";

export const importantMetrics: MetricKey[] = [
  "largest-contentful-paint",
  "first-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "max-potential-fid",
  "cumulative-layout-shift",
  "interactive",
  "server-response-time",
];

export const debugDir = path.join("debug");
export const outputDir = path.join("benchmark-output");
