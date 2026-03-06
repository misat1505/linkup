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

async function runLighthouseAfterLogin(mode) {
  try {
    const chrome = await launch({ chromeFlags: ["--headless"] });

    // podłącz puppeteer do tego samego chrome
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

    const options = {
      port: chrome.port,
      output: "json",
      throttlingMethod: "provided",
      formFactor: "desktop",
      screenEmulation: { disabled: true },
    };

    const url = "http://localhost:3000/posts";

    const waitUntil = mode === "react" ? "networkidle0" : "domcontentloaded";

    await page.goto(url, {
      waitUntil,
    });

    console.log(`\nRunning lighthouse on ${page.url()} in ${mode} mode.\n`);

    console.log("Running warmup...");
    await lighthouse(url, options);

    console.log("Running benchmark...");
    const runnerResult = await lighthouse(url, options);

    await fs.mkdir(debugDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    const html = await page.content();
    await fs.writeFile(
      path.join(debugDir, `after-lighthouse-${mode}.html`),
      html,
      "utf-8",
    );

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

    await fs.writeFile(
      path.join(outputDir, `${mode}.json`),
      JSON.stringify(results, null, 2),
      "utf-8",
    );

    console.table(results);

    await browser.disconnect();
    chrome.kill();
  } catch (e) {
    console.log(e);
  }
}

runLighthouseAfterLogin("nextjs");
