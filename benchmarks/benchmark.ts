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

// Paths to benchmark — extend this array to add more routes
const PATHS_TO_BENCHMARK = ["/", "/chats/6360af6a-6c04-4339-aafc-819261079290"];

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

interface PathResult {
  path: string;
  profiles: ProfileResult[];
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
  routeSlug: string,
  mode: Mode,
): Promise<Record<MetricKey, MetricResult>> {
  const client = await page.createCDPSession();
  await client.send("Network.clearBrowserCache");
  await client.detach();

  const runnerResult = await lighthouse(url, flags);
  if (!runnerResult) throw new Error("Lighthouse run returned no result");

  const { lhr } = runnerResult;

  if (lhr.finalUrl !== lhr.requestedUrl) {
    console.warn(
      `  ⚠️  redirect detected: ${lhr.requestedUrl} → ${lhr.finalUrl}`,
    );
  }

  const results = {} as Record<MetricKey, MetricResult>;
  for (const metric of importantMetrics) {
    const audit = lhr.audits[metric];
    results[metric] = {
      value: audit?.numericValue ?? null,
      display: audit?.displayValue ?? null,
      score: audit?.score ?? null,
    };
  }

  await page.goto(lhr.finalUrl!, { waitUntil: "networkidle0" });
  await page.screenshot({
    path: path.join(
      debugDir,
      `screenshot-${MODE}-${routeSlug}-${profileId}-run${index}.png`,
    ),
    fullPage: true,
  });

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
  routePath: string,
  routeSlug: string,
): Promise<ProfileResult> {
  const url = getFrontendUrlBase(mode) + routePath;
  const flags = buildFlags(profile, chromePort, cookieHeader);

  banner(`${profile.emoji}  Starting: ${profile.label}  [${routePath}]`, "·");
  console.log(`   ${profile.description}`);

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
      routeSlug,
      mode,
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

/**
 * Builds a "combined" output JSON that averages all per-metric means across
 * all measured paths, grouped by profile. Useful for a single at-a-glance
 * comparison between the two modes.
 */
function buildCombinedStats(pathResults: PathResult[]): object {
  // profileId -> metricKey -> all mean values (one per path)
  const accumulator: Record<string, Record<MetricKey, number[]>> = {};

  for (const pr of pathResults) {
    for (const profileResult of pr.profiles) {
      const pid = profileResult.profile.id;
      if (!accumulator[pid]) {
        accumulator[pid] = {} as Record<MetricKey, number[]>;
      }
      for (const metric of importantMetrics) {
        if (!accumulator[pid][metric]) accumulator[pid][metric] = [];
        const mean = profileResult.stats[metric].mean;
        if (mean !== null) accumulator[pid][metric].push(mean);
      }
    }
  }

  const combined: Record<
    string,
    {
      label: string;
      stats: Record<
        MetricKey,
        { combinedMean: number | null; display: string }
      >;
    }
  > = {};

  for (const pr of pathResults) {
    for (const profileResult of pr.profiles) {
      const pid = profileResult.profile.id;
      if (combined[pid]) continue; // already filled

      combined[pid] = {
        label: profileResult.profile.label,
        stats: {} as Record<
          MetricKey,
          { combinedMean: number | null; display: string }
        >,
      };

      for (const metric of importantMetrics) {
        const means = accumulator[pid]![metric] ?? [];
        if (means.length === 0) {
          combined[pid].stats[metric] = { combinedMean: null, display: "-" };
          continue;
        }
        const avg = parseFloat(
          (means.reduce((a, b) => a + b, 0) / means.length).toFixed(2),
        );
        combined[pid].stats[metric] = {
          combinedMean: avg,
          display: ms(avg),
        };
      }
    }
  }

  return combined;
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
    `🚀  Lighthouse Benchmark  |  mode: ${MODE}  |  ${ITERATIONS} runs × ${activeProfiles.length} profiles × ${PATHS_TO_BENCHMARK.length} paths`,
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
    const allPathResults: PathResult[] = [];

    for (const routePath of PATHS_TO_BENCHMARK) {
      // slug used in filenames, e.g. "/" -> "root", "/chats" -> "chats"
      const routeSlug =
        routePath === "/"
          ? "root"
          : routePath.replace(/^\//, "").replace(/\//g, "-");

      banner(`📂  Path: ${routePath}`, "═");

      const profileResults: ProfileResult[] = [];

      for (const profile of activeProfiles) {
        const result = await runProfile(
          profile,
          page,
          chrome.port,
          cookieHeader,
          MODE,
          ITERATIONS,
          routePath,
          routeSlug,
        );
        profileResults.push(result);
      }

      printComparisonSummary(profileResults);
      allPathResults.push({ path: routePath, profiles: profileResults });

      // Per-path JSON output
      const perPathFile = path.join(
        outputDir,
        `${MODE}-benchmark-${routeSlug}.json`,
      );
      await fs.writeFile(
        perPathFile,
        JSON.stringify(
          {
            mode: MODE,
            path: routePath,
            iterations: ITERATIONS,
            generatedAt: new Date().toISOString(),
            profiles: profileResults.map((r) => ({
              profileId: r.profile.id,
              label: r.profile.label,
              durationMs: parseFloat(r.durationMs.toFixed(0)),
              stats: r.stats,
            })),
            raw: profileResults.map((r) => ({
              profileId: r.profile.id,
              runs: r.iterations,
            })),
          },
          null,
          2,
        ),
        "utf-8",
      );
      console.log(`\n   ✅  Saved: ${perPathFile}`);
    }

    const totalMs = performance.now() - totalStart;

    // Combined JSON — averages across all paths
    const combinedStats = buildCombinedStats(allPathResults);
    const combinedFile = path.join(
      outputDir,
      `${MODE}-benchmark-combined.json`,
    );
    await fs.writeFile(
      combinedFile,
      JSON.stringify(
        {
          mode: MODE,
          paths: PATHS_TO_BENCHMARK,
          iterations: ITERATIONS,
          generatedAt: new Date().toISOString(),
          totalDurationMs: parseFloat(totalMs.toFixed(0)),
          description:
            "combinedMean is the arithmetic mean of per-path means for each metric",
          combined: combinedStats,
        },
        null,
        2,
      ),
      "utf-8",
    );

    banner(`✅  Done in ${(totalMs / 1000 / 60).toFixed(1)} min`, "═");
    console.log(`   Per-path files : ${MODE}-benchmark-{root,chats}.json`);
    console.log(`   Combined file  : ${combinedFile}\n`);

    await browser.disconnect();
  } finally {
    chrome.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
