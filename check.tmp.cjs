const puppeteer = require("puppeteer-core");
(async () => {
  const browser = await puppeteer.launch({ executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 1000 });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", protocolTimeout: 120000 });
  await page.evaluate(() => localStorage.setItem("sh_welcome_seen_v1","1"));
  await new Promise(r => setTimeout(r, 4000));
  await page.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: process.env.TEMP + "\\opencode\\grid-after-1.png" });
  await page.evaluate(() => window.scrollBy(0, 950));
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: process.env.TEMP + "\\opencode\\grid-after-2.png" });
  await browser.close();
})().catch(e => { console.error("ERR", e.message); process.exit(1); });
