import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import fs from "fs/promises";
import path from "path";

const importantMetrics = [
  "largest-contentful-paint",
  "first-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "max-potential-fid",
  "cumulative-layout-shift",
  "interactive",
  "server-response-time",
];

const debugDir = path.join("debug");
const outputDir = path.join("benchmark-output");

async function runSingleLighthouse(page, url, mode, options) {
  const runnerResult = await lighthouse(url, options);
  const { audits } = runnerResult.lhr;

  const results = {};
  for (const metric of importantMetrics) {
    const audit = audits[metric];
    results[metric] = {
      value: audit.numericValue ?? null,
      display: audit.displayValue ?? null,
      score: audit.score ?? null,
    };
  }

  const html = await page.content();
  await fs.writeFile(
    path.join(debugDir, `after-lighthouse-${mode}.html`),
    html,
    "utf-8",
  );

  return results;
}

async function runLighthouseAfterLogin(mode, iterations = 10) {
  try {
    await fs.mkdir(debugDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    const chrome = await launch({ chromeFlags: ["--headless"] });
    const browser = await puppeteer.connect({
      browserURL: `http://localhost:${chrome.port}`,
    });
    const page = await browser.newPage();

    console.log("Opening login page...");

    await page.goto("http://localhost:3000/login", {
      waitUntil: "networkidle0",
    });
    await page.type('input[name="login"]', "login6");
    await page.type('input[name="password"]', "pass6");

    await Promise.all([
      page.click("button[type=submit]"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    await new Promise((res) => setTimeout(res, 1000));
    console.log("Logged in");

    const url = "http://localhost:3000/posts";
    const waitUntil = mode === "react" ? "networkidle0" : "domcontentloaded";
    await page.goto(url, { waitUntil });

    const options = {
      port: chrome.port,
      output: "json",
      throttlingMethod: "provided",
      formFactor: "desktop",
      screenEmulation: { disabled: true },
    };

    console.log("\nRunning warmup...");
    await lighthouse(url, options); // warmup

    console.log(
      `\nRunning ${iterations} Lighthouse benchmarks on ${mode}...\n`,
    );

    const allResults = [];

    for (let i = 0; i < iterations; i++) {
      console.log(`Running test #${i + 1}...`);
      const start = performance.now();
      const result = await runSingleLighthouse(page, url, mode, options);
      const durationMs = performance.now() - start;
      console.log(`Done in ${(durationMs / 1000).toFixed(2)} s\n`);
      allResults.push(result);
    }

    const avgResults = {};
    for (const metric of importantMetrics) {
      let sum = 0;
      let count = 0;
      for (const r of allResults) {
        if (r[metric].value !== null) {
          sum += r[metric].value;
          count++;
        }
      }
      avgResults[metric] = {
        value: count ? sum / count : null,
        display: count ? `${(sum / count).toFixed(2)} ms` : null,
      };
    }

    await fs.writeFile(
      path.join(outputDir, `${mode}-all.json`),
      JSON.stringify(allResults, null, 2),
      "utf-8",
    );
    await fs.writeFile(
      path.join(outputDir, `${mode}-avg.json`),
      JSON.stringify(avgResults, null, 2),
      "utf-8",
    );

    console.log("\nŚrednie wyniki:");
    console.table(avgResults);

    await browser.disconnect();
    chrome.kill();
  } catch (e) {
    console.log(e);
  }
}

runLighthouseAfterLogin("nextjs", 10);
