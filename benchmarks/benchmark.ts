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
const PATHS_TO_BENCHMARK = ["/", "/chats/c6ebfe7c-4616-439f-9871-c82247e150fb"];

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
	const stddev = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length);
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

	if (lhr.finalDisplayedUrl !== lhr.requestedUrl) {
		console.warn(`  ⚠️  redirect detected: ${lhr.requestedUrl} → ${lhr.finalDisplayedUrl}`);
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

	await page.goto(lhr.finalDisplayedUrl!, { waitUntil: "networkidle0" });
	await page.screenshot({
		path: path.join(debugDir, `prod-screenshot-${MODE}-${routeSlug}-${profileId}-run${index}.png`),
		fullPage: true,
	});

	return results;
}

function aggregateResults(allResults: Record<MetricKey, MetricResult>[]): ProfileStats {
	const stats = {} as ProfileStats;

	for (const metric of importantMetrics) {
		const values = allResults.map((r) => r[metric].value).filter((v): v is number => v !== null);

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
	mode: Mode,
	iterations: number,
	routePath: string,
	routeSlug: string,
): Promise<ProfileResult> {
	// Fresh Chrome instance per profile to guarantee a clean session
	const chrome = await launch({ chromeFlags: ["--headless"] });

	try {
		const browser = await puppeteer.connect({
			browserURL: `http://localhost:${chrome.port}`,
		});

		const page = await browser.newPage();

		const cookieHeader = await login(page);
		const url = getFrontendUrlBase(mode) + routePath;
		const flags = buildFlags(profile, chrome.port, cookieHeader);

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
			process.stdout.write(` ${elapsed}s (${new Date().toLocaleTimeString()})\n`);
			allResults.push(result);
		}

		const durationMs = performance.now() - profileStart;
		const stats = aggregateResults(allResults);
		printProfileStats(profile, stats);

		await browser.disconnect();

		return { profile, iterations: allResults, stats, durationMs };
	} finally {
		chrome.kill();
	}
}

function getFrontendUrlBase(mode: Mode): string {
	if (mode === "react") return "https://linkup-frontend-xaom.onrender.com";
	return "https://linkup-web-next.vercel.app";

	// const common = "http://localhost:";
	// if (mode === "nextjs") return `${common}${3000}`;
	// else if (mode === "react") return `${common}${3001}`;
	// throw new Error(`Unknown mode: ${mode}`);
}

function buildMergedProfiles(pathResults: PathResult[]): any[] {
	const map: Record<
		string,
		{
			profile: BenchmarkProfile;
			allIterations: Record<MetricKey, MetricResult>[];
			totalDurationMs: number;
		}
	> = {};

	for (const pr of pathResults) {
		for (const p of pr.profiles) {
			const id = p.profile.id;

			if (!map[id]) {
				map[id] = {
					profile: p.profile,
					allIterations: [],
					totalDurationMs: 0,
				};
			}

			map[id].allIterations.push(...p.iterations);
			map[id].totalDurationMs += p.durationMs;
		}
	}

	return Object.values(map).map((entry) => ({
		profileId: entry.profile.id,
		label: entry.profile.label,
		durationMs: Math.round(entry.totalDurationMs),
		stats: aggregateResults(entry.allIterations),
	}));
}

async function login(page: Page) {
	const base = getFrontendUrlBase(MODE);
	const waitUntil = MODE === "react" ? "networkidle0" : "domcontentloaded";

	console.log(`\nOpening login page at ${base}/login...`);
	await page.goto(`${base}/login`, { waitUntil });
	await page.waitForSelector('input[name="login"]', { timeout: 10000 });
	await page.type('input[name="login"]', "login1");
	await page.type('input[name="password"]', "pass1");
	await page.click("button[type=submit]");
	await new Promise((res) => setTimeout(res, 1500));

	const cookies = await page.browser().cookies();

	const refreshToken = cookies.find((c) => c.name === "refresh-token")?.value;
	if (!refreshToken) throw new Error("No refresh-token cookie after login");

	const cookieHeader = `refresh-token=${refreshToken}`;

	console.log("Refreshed session ✓");
	return cookieHeader;
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
	console.log(`Start time: ${new Date().toLocaleTimeString()}`);

	await fs.mkdir(debugDir, { recursive: true });
	await fs.mkdir(outputDir, { recursive: true });

	const totalStart = performance.now();
	const allPathResults: PathResult[] = [];

	for (const routePath of PATHS_TO_BENCHMARK) {
		// slug used in filenames, e.g. "/" -> "root", "/chats" -> "chats"
		const routeSlug = routePath === "/" ? "root" : routePath.replace(/^\//, "").replace(/\//g, "-");

		banner(`📂  Path: ${routePath}`, "═");

		const profileResults: ProfileResult[] = [];

		for (const profile of activeProfiles) {
			const result = await runProfile(profile, MODE, ITERATIONS, routePath, routeSlug);
			profileResults.push(result);
		}

		printComparisonSummary(profileResults);
		allPathResults.push({ path: routePath, profiles: profileResults });

		// Per-path JSON output
		const perPathFile = path.join(outputDir, `prod-${MODE}-benchmark-${routeSlug}.json`);
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
	const combinedStats = buildMergedProfiles(allPathResults);
	const combinedFile = path.join(outputDir, `prod-${MODE}-benchmark-combined.json`);
	await fs.writeFile(
		combinedFile,
		JSON.stringify(
			{
				mode: MODE,
				paths: PATHS_TO_BENCHMARK,
				iterations: ITERATIONS,
				generatedAt: new Date().toISOString(),
				totalDurationMs: parseFloat(totalMs.toFixed(0)),
				description: "combinedMean is the arithmetic mean of per-path means for each metric",
				profiles: combinedStats,
			},
			null,
			2,
		),
		"utf-8",
	);

	banner(`✅  Done in ${(totalMs / 1000 / 60).toFixed(1)} min`, "═");
	console.log(`   Per-path files : prod-${MODE}-benchmark-{root,chats}.json`);
	console.log(`   Combined file  : ${combinedFile}\n`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
