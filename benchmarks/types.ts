export type Mode = "react" | "nextjs";

export type MetricKey =
  | "largest-contentful-paint"
  | "first-contentful-paint"
  | "speed-index"
  | "total-blocking-time"
  | "max-potential-fid"
  | "cumulative-layout-shift"
  | "interactive"
  | "server-response-time";

export type MetricResult = {
  value: number | null;
  display: string | null;
  score: number | null;
};
