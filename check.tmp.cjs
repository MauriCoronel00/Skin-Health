const puppeteer = require("puppeteer-core");
(async () => {
  const browser = await puppeteer.launch({ executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const reqs = {};
  page.on("request", r => { const u = r.url(); if (u.includes("supabase.co/rest")) reqs[u.split("?")[0].split("/rest/v1/")[1]] = (reqs[u.split("?")[0].split("/rest/v1/")[1]]||0)+1; });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", protocolTimeout: 120000 });
  await page.evaluate(() => localStorage.setItem("sh_welcome_seen_v1","1"));
  for (let i=0;i<6;i++){ await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await new Promise(r=>setTimeout(r,1500)); }
  console.log("REQUESTS tras 10s:", JSON.stringify(reqs));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r=>setTimeout(r,800));
  await page.screenshot({ path: process.env.TEMP + "\\opencode\\catalog-top.png" });
  // scroll to catalog grid
  await page.evaluate(() => { const el = document.getElementById("productos") || document.querySelector("#catalogo") || document.querySelector("section"); el && el.scrollIntoView(); });
  await new Promise(r=>setTimeout(r,1200));
  await page.screenshot({ path: process.env.TEMP + "\\opencode\\catalog-grid.png" });
  await browser.close();
})().catch(e => { console.error("ERR", e.message); process.exit(1); });
