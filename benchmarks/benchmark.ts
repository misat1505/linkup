import { launch } from "chrome-launcher";
import fs from "fs/promises";
import lighthouse, { Flags } from "lighthouse";
import path from "path";
import puppeteer, { type Page } from "puppeteer-core";
import { debugDir, importantMetrics, outputDir } from "./constants";
import { type BenchmarkProfile, buildFlags, profiles } from "./profiles";
import type { MetricKey, MetricResult, Mode } from "./types";

const args = process.argv.slice(2);
const getArg = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : undefined;
};

const MODE: Mode = (getArg("--mode") as Mode | undefined) ?? "react";
const ITERATIONS = parseInt(getArg("--iterations") ?? "5", 10);
const PROFILE_FILTER = getArg("--profile");

interface MetricStats {
  mean: number | null;
  stddev: number | null;
  min: number | null;
  max: number | null;
  display: string | null;
}

type ProfileStats = Record<MetricKey, MetricStats>;

interface ProfileResult {
  profile: BenchmarkProfile;
  iterations: Record<MetricKey, MetricResult>[];
  stats: ProfileStats;
  durationMs: number;
}

function calcStats(values: number[]): {
  mean: number;
  stddev: number;
  min: number;
  max: number;
} {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stddev = Math.sqrt(
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length,
  );
  return {
    mean,
    stddev,
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

function scoreToLabel(score: number | null): string {
  if (score === null) return "-";
  if (score >= 0.9) return "🟢";
  if (score >= 0.5) return "🟡";
  return "🔴";
}

function ms(value: number | null): string {
  if (value === null) return "-";
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
  return `${value.toFixed(0)} ms`;
}

function banner(text: string, char = "─") {
  const width = 72;
  const pad = Math.max(0, width - text.length - 4);
  const left = Math.floor(pad / 2);
  const right = pad - left;
  console.log(`\n${char.repeat(left + 2)} ${text} ${char.repeat(right + 2)}`);
}

async function runSingleLighthouse(
  page: Page,
  url: string,
  flags: Flags,
  profileId: string,
  index: number,
): Promise<Record<MetricKey, MetricResult>> {
  // Clear cache before every run for isolation
  const client = await page.createCDPSession();
  await client.send("Network.clearBrowserCache");
  await client.detach();

  const runnerResult = await lighthouse(url, flags);
  if (!runnerResult) throw new Error("Lighthouse run returned no result");

  const { audits } = runnerResult.lhr;
  const results = {} as Record<MetricKey, MetricResult>;

  for (const metric of importantMetrics) {
    const audit = audits[metric];
    results[metric] = {
      value: audit?.numericValue ?? null,
      display: audit?.displayValue ?? null,
      score: audit?.score ?? null,
    };
  }

  // Save page snapshot for debugging
  const html = await page.content();
  await fs.writeFile(
    path.join(debugDir, `snapshot-${profileId}-run${index}.html`),
    html,
    "utf-8",
  );

  return results;
}

function aggregateResults(
  allResults: Record<MetricKey, MetricResult>[],
): ProfileStats {
  const stats = {} as ProfileStats;

  for (const metric of importantMetrics) {
    const values = allResults
      .map((r) => r[metric].value)
      .filter((v): v is number => v !== null);

    if (values.length === 0) {
      stats[metric] = {
        mean: null,
        stddev: null,
        min: null,
        max: null,
        display: null,
      };
      continue;
    }

    const s = calcStats(values);
    const lastScore = allResults[allResults.length - 1]?.[metric].score;

    stats[metric] = {
      mean: parseFloat(s.mean.toFixed(2)),
      stddev: parseFloat(s.stddev.toFixed(2)),
      min: parseFloat(s.min.toFixed(2)),
      max: parseFloat(s.max.toFixed(2)),
      display: `${scoreToLabel(lastScore!)} ${ms(s.mean)}  ±${ms(s.stddev)}  [${ms(s.min)} - ${ms(s.max)}]`,
    };
  }

  return stats;
}

function printProfileStats(profile: BenchmarkProfile, stats: ProfileStats) {
  banner(`${profile.emoji}  ${profile.label}`);
  console.log(`   ${profile.description}\n`);

  const rows: Record<string, string> = {};
  for (const metric of importantMetrics) {
    rows[metric] = stats[metric].display ?? "-";
  }
  console.table(rows);
}

function printComparisonSummary(results: ProfileResult[]) {
  banner("📊  COMPARISON SUMMARY", "═");

  const keyMetrics: MetricKey[] = [
    "largest-contentful-paint",
    "first-contentful-paint",
    "total-blocking-time",
    "interactive",
  ];

  for (const metric of keyMetrics) {
    console.log(`\n  ${metric.toUpperCase()}`);

    const rows = results.map((r) => {
      const s = r.stats[metric];
      return {
        profile: `${r.profile.emoji} ${r.profile.label}`,
        mean: ms(s.mean),
        "±stddev": ms(s.stddev),
        min: ms(s.min),
        max: ms(s.max),
      };
    });

    console.table(rows);
  }
}

async function runProfile(
  profile: BenchmarkProfile,
  page: Page,
  chromePort: number,
  cookieHeader: string,
  mode: Mode,
  iterations: number,
): Promise<ProfileResult> {
  const url = getFrontendUrlBase(mode);
  const flags = buildFlags(profile, chromePort, cookieHeader);

  banner(`${profile.emoji}  Starting: ${profile.label}`, "·");
  console.log(`   ${profile.description}`);

  // 2 warmup runs per profile
  console.log("   Warming up (2 runs)...");
  for (let i = 0; i < 2; i++) {
    await lighthouse(url, flags);
  }

  const allResults: Record<MetricKey, MetricResult>[] = [];
  const profileStart = performance.now();

  for (let i = 0; i < iterations; i++) {
    process.stdout.write(`   Run ${i + 1}/${iterations}...`);
    const start = performance.now();
    const result = await runSingleLighthouse(
      page,
      url,
      flags,
      profile.id,
      i + 1,
    );
    const elapsed = ((performance.now() - start) / 1000).toFixed(1);
    process.stdout.write(` ${elapsed}s\n`);
    allResults.push(result);
  }

  const durationMs = performance.now() - profileStart;
  const stats = aggregateResults(allResults);
  printProfileStats(profile, stats);

  return { profile, iterations: allResults, stats, durationMs };
}

function getFrontendUrlBase(mode: Mode): string {
  const common = "http://localhost:";
  if (mode === "nextjs") return `${common}${3000}`;
  else if (mode === "react") return `${common}${3001}`;
  throw new Error(`Unknown mode: ${mode}`);
}

async function main() {
  const activeProfiles = PROFILE_FILTER
    ? profiles.filter((p) => p.id === PROFILE_FILTER)
    : profiles;

  if (activeProfiles.length === 0) {
    console.error(`No profile found matching: "${PROFILE_FILTER}"`);
    process.exit(1);
  }

  banner(
    `🚀  Lighthouse Benchmark  |  mode: ${MODE}  |  ${ITERATIONS} runs × ${activeProfiles.length} profiles`,
    "═",
  );

  await fs.mkdir(debugDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  const chrome = await launch({ chromeFlags: ["--headless"] });

  try {
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${chrome.port}`,
    });

    const page = await browser.newPage();

    console.log(`\nOpening login page at ${getFrontendUrlBase(MODE)}/login...`);
    await page.goto(`${getFrontendUrlBase(MODE)}/login`, {
      waitUntil: "networkidle0",
    });
    await page.type('input[name="login"]', "login1");
    await page.type('input[name="password"]', "pass1");
    await Promise.all([
      page.click("button[type=submit]"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
    await new Promise((res) => setTimeout(res, 1000));

    const cookies = await page.cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    const waitUntil = MODE === "react" ? "networkidle0" : "domcontentloaded";
    await page.goto(getFrontendUrlBase(MODE), { waitUntil });
    console.log("Logged in ✓");

    const totalStart = performance.now();
    const allProfileResults: ProfileResult[] = [];

    for (const profile of activeProfiles) {
      const result = await runProfile(
        profile,
        page,
        chrome.port,
        cookieHeader,
        MODE,
        ITERATIONS,
      );
      allProfileResults.push(result);
    }

    const totalMs = performance.now() - totalStart;

    printComparisonSummary(allProfileResults);

    const summary = allProfileResults.map((r) => ({
      profileId: r.profile.id,
      label: r.profile.label,
      durationMs: parseFloat(r.durationMs.toFixed(0)),
      stats: r.stats,
    }));

    const outputFile = path.join(outputDir, `${MODE}-benchmark.json`);
    await fs.writeFile(
      outputFile,
      JSON.stringify(
        {
          mode: MODE,
          iterations: ITERATIONS,
          generatedAt: new Date().toISOString(),
          totalDurationMs: parseFloat(totalMs.toFixed(0)),
          profiles: summary,
          raw: allProfileResults.map((r) => ({
            profileId: r.profile.id,
            runs: r.iterations,
          })),
        },
        null,
        2,
      ),
      "utf-8",
    );

    banner(`✅  Done in ${(totalMs / 1000 / 60).toFixed(1)} min`, "═");
    console.log(`   Results saved to: ${outputFile}\n`);

    await browser.disconnect();
  } finally {
    chrome.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
