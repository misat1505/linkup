import type { Flags } from "lighthouse";

export interface ThrottlingConfig {
	name: string;
	rttMs: number;
	throughputKbps: number;
	requestLatencyMs: number;
	downloadThroughputKbps: number;
	uploadThroughputKbps: number;
}

export interface ScreenConfig {
	name: string;
	mobile: boolean;
	width: number;
	height: number;
	deviceScaleFactor: number;
	cpuSlowdownMultiplier: number;
}

export interface BenchmarkProfile {
	id: string;
	label: string;
	description: string;
	emoji: string;
	screen: ScreenConfig;
	throttling: ThrottlingConfig;
	lighthouseFlags: Partial<Flags>;
}

const screens = {
	desktop: {
		name: "desktop",
		mobile: false,
		width: 1920,
		height: 1080,
		deviceScaleFactor: 1,
		cpuSlowdownMultiplier: 1, // full-power desktop CPU
	},
	laptop: {
		name: "laptop",
		mobile: false,
		width: 1366,
		height: 768,
		deviceScaleFactor: 1,
		cpuSlowdownMultiplier: 2, // slightly slower than desktop
	},
	tablet: {
		name: "tablet",
		mobile: true,
		width: 768,
		height: 1024,
		deviceScaleFactor: 2,
		cpuSlowdownMultiplier: 3, // mid-range ARM chip
	},
	mobileMid: {
		name: "mid-range phone",
		mobile: true,
		width: 390,
		height: 844,
		deviceScaleFactor: 3,
		cpuSlowdownMultiplier: 4, // iPhone 12 / Pixel 6a class
	},
	mobileLow: {
		name: "budget phone",
		mobile: true,
		width: 360,
		height: 780,
		deviceScaleFactor: 2,
		cpuSlowdownMultiplier: 6, // budget Android, slow SoC
	},
} satisfies Record<string, ScreenConfig>;

// Values based on WebPageTest / Chrome DevTools presets
const networks = {
	// No throttling - local dev machine
	unthrottled: {
		name: "unthrottled",
		rttMs: 0,
		throughputKbps: 0,
		requestLatencyMs: 0,
		downloadThroughputKbps: 0,
		uploadThroughputKbps: 0,
	},
	// Fiber / WiFi 5GHz - ~100 Mbps
	fiber: {
		name: "fiber",
		rttMs: 4,
		throughputKbps: 100_000,
		requestLatencyMs: 4,
		downloadThroughputKbps: 100_000,
		uploadThroughputKbps: 50_000,
	},
	// Cable / WiFi 2.4GHz - ~25 Mbps
	cable: {
		name: "cable",
		rttMs: 28,
		throughputKbps: 25_000,
		requestLatencyMs: 28,
		downloadThroughputKbps: 25_000,
		uploadThroughputKbps: 5_000,
	},
	// 4G LTE - ~20 Mbps, ~70 ms RTT
	lte: {
		name: "LTE",
		rttMs: 70,
		throughputKbps: 20_000,
		requestLatencyMs: 70,
		downloadThroughputKbps: 20_000,
		uploadThroughputKbps: 8_000,
	},
	// 3G - Lighthouse "Slow 3G" equivalent
	slow3g: {
		name: "slow 3G",
		rttMs: 400,
		throughputKbps: 400,
		requestLatencyMs: 400,
		downloadThroughputKbps: 400,
		uploadThroughputKbps: 400,
	},
	// Edge / 2G - brutal
	edge: {
		name: "edge 2G",
		rttMs: 840,
		throughputKbps: 240,
		requestLatencyMs: 840,
		downloadThroughputKbps: 240,
		uploadThroughputKbps: 120,
	},
} satisfies Record<string, ThrottlingConfig>;

function makeFlags(
	port: number,
	screen: ScreenConfig,
	throttling: ThrottlingConfig,
	cookieHeader: string,
): Flags {
	const isUnthrottled = throttling.rttMs === 0 && throttling.throughputKbps === 0;

	return {
		port,
		output: "json",
		throttlingMethod: isUnthrottled ? "provided" : "devtools",
		formFactor: screen.mobile ? "mobile" : "desktop",
		screenEmulation: {
			mobile: screen.mobile,
			width: screen.width,
			height: screen.height,
			deviceScaleFactor: screen.deviceScaleFactor,
			disabled: false,
		},
		throttling: {
			...throttling,
			cpuSlowdownMultiplier: screen.cpuSlowdownMultiplier,
		},
		extraHeaders: { Cookie: cookieHeader },
		maxWaitForLoad: 1_000_000,
		maxWaitForFcp: 1_000_000,
	};
}

function smartCapitalize(str: string): string {
	return str
		.split(" ")
		.map((word) => {
			if (word.toUpperCase() === word) return word; // keep LTE, 3G
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

function makeLabel(screen: ScreenConfig, network: ThrottlingConfig) {
	return `${smartCapitalize(screen.name)} - ${smartCapitalize(network.name)}`;
}

function cpuThrottleMessage(throttle: number): string {
	if (throttle === 1) return "no CPU throttle";
	return `${throttle}× CPU slowdown`;
}

function networkMessage(throttling: ThrottlingConfig): string {
	const { downloadThroughputKbps, uploadThroughputKbps, rttMs } = throttling;

	if (downloadThroughputKbps === 0 && rttMs === 0) return "no network throttle";

	function formatBandwidth(kbps: number): string {
		return kbps >= 1_000 ? `${(kbps / 1_000).toFixed(0)} Mbps` : `${kbps} kbps`;
	}

	const down = formatBandwidth(downloadThroughputKbps);
	const up = formatBandwidth(uploadThroughputKbps);

	return `↓ ${down} / ↑ ${up}, RTT ${rttMs} ms`;
}

function makeDescription(...args: string[]): string {
	return args.join(", ");
}

export const profiles: BenchmarkProfile[] = [
	{
		id: `${screens.desktop.name}-${networks.unthrottled.name}`,
		label: makeLabel(screens.desktop, networks.unthrottled),
		description: makeDescription(
			"Absolute best case - local dev server",
			networkMessage(networks.unthrottled),
			cpuThrottleMessage(screens.desktop.cpuSlowdownMultiplier),
		),
		emoji: "⚡",
		screen: screens.desktop,
		throttling: networks.unthrottled,
		lighthouseFlags: {},
	},
	{
		id: `${screens.desktop.name}-${networks.fiber.name}`,
		label: makeLabel(screens.desktop, networks.fiber),
		description: makeDescription(
			"High-end workstation",
			networkMessage(networks.fiber),
			cpuThrottleMessage(screens.desktop.cpuSlowdownMultiplier),
		),
		emoji: "🖥️",
		screen: screens.desktop,
		throttling: networks.fiber,
		lighthouseFlags: {},
	},
	{
		id: `${screens.laptop.name}-${networks.cable.name}`,
		label: makeLabel(screens.laptop, networks.cable),
		description: makeDescription(
			"Office laptop",
			networkMessage(networks.cable),
			cpuThrottleMessage(screens.laptop.cpuSlowdownMultiplier),
		),
		emoji: "💻",
		screen: screens.laptop,
		throttling: networks.cable,
		lighthouseFlags: {},
	},

	{
		id: `${screens.tablet.name}-${networks.lte.name}`,
		label: makeLabel(screens.tablet, networks.lte),
		description: makeDescription(
			"iPad-class device on 4G LTE",
			networkMessage(networks.lte),
			cpuThrottleMessage(screens.tablet.cpuSlowdownMultiplier),
		),
		emoji: "📱",
		screen: screens.tablet,
		throttling: networks.lte,
		lighthouseFlags: {},
	},
	{
		id: `${screens.mobileMid.name}-${networks.lte.name}`,
		label: makeLabel(screens.mobileMid, networks.lte),
		description: makeDescription(
			"iPhone 14-class phone",
			networkMessage(networks.lte),
			cpuThrottleMessage(screens.mobileMid.cpuSlowdownMultiplier),
		),
		emoji: "📲",
		screen: screens.mobileMid,
		throttling: networks.lte,
		lighthouseFlags: {},
	},
	{
		id: `${screens.mobileMid.name}-${networks.slow3g.name}`,
		label: makeLabel(screens.mobileMid, networks.slow3g),
		description: makeDescription(
			"Realistic Polish rural / subway scenario",
			networkMessage(networks.slow3g),
			cpuThrottleMessage(screens.mobileMid.cpuSlowdownMultiplier),
		),
		emoji: "🐌",
		screen: screens.mobileMid,
		throttling: networks.slow3g,
		lighthouseFlags: {},
	},
	{
		id: `${screens.mobileLow.name}-${networks.slow3g.name}`,
		label: makeLabel(screens.mobileLow, networks.slow3g),
		description: makeDescription(
			"Low-end Android, poor signal",
			"worst realistic case",
			networkMessage(networks.slow3g),
			cpuThrottleMessage(screens.mobileLow.cpuSlowdownMultiplier),
		),
		emoji: "🪦",
		screen: screens.mobileLow,
		throttling: networks.slow3g,
		lighthouseFlags: {},
	},
	{
		id: `${screens.mobileLow.name}-${networks.edge.name}`,
		label: makeLabel(screens.mobileLow, networks.edge),
		description: makeDescription(
			"True worst case - 2G network",
			"minimal CPU",
			"stress test",
			networkMessage(networks.edge),
			cpuThrottleMessage(screens.mobileLow.cpuSlowdownMultiplier),
		),
		emoji: "💀",
		screen: screens.mobileLow,
		throttling: networks.edge,
		lighthouseFlags: {},
	},
];

export function buildFlags(
	profile: BenchmarkProfile,
	chromePort: number,
	cookieHeader: string,
): Flags {
	return {
		...makeFlags(chromePort, profile.screen, profile.throttling, cookieHeader),
		...profile.lighthouseFlags,
	};
}
