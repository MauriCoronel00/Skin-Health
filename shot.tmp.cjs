const puppeteer = require("puppeteer-core");
(async () => {
  const browser = await puppeteer.launch({ executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const reqs = {};
  const jsErrors = [];
  page.on("request", r => { const u = r.url(); if (u.includes("localhost:3000") || u.includes("supabase")) reqs[u] = (reqs[u]||0)+1; });
  page.on("console", m => { if (m.type() === "error") jsErrors.push(m.text().slice(0,200)); });
  page.on("pageerror", e => jsErrors.push("PAGEERROR: " + String(e).slice(0,300)));
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", protocolTimeout: 120000 });
  await page.evaluate(() => localStorage.setItem("sh_welcome_seen_v1","1"));
  await new Promise(r => setTimeout(r, 8000));
  // scroll to bottom repeatedly to trigger lazy content
  for (let i=0;i<5;i++){ await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await new Promise(r=>setTimeout(r,1500)); }
  const counts = Object.fromEntries(Object.entries(reqs).sort((a,b)=>b[1]-a[1]).slice(0,15));
  const spinners = await page.evaluate(() => {
    const els = [...document.querySelectorAll("*")].filter(e => {
      const s = getComputedStyle(e);
      return (s.animationName && s.animationName !== "none" && /spin|pulse|bounce|loading/i.test(s.animationName)) || (e.className && typeof e.className === "string" && /animate-spin|loading|skeleton/i.test(e.className));
    });
    return els.slice(0,20).map(e => ({ tag: e.tagName, cls: (typeof e.className==="string"?e.className:"").slice(0,90), rect: JSON.parse(JSON.stringify(e.getBoundingClientRect().toJSON())) }));
  });
  console.log("TOP REQUESTS:", JSON.stringify(counts, null, 1));
  console.log("JS ERRORS:", JSON.stringify(jsErrors.slice(0,10), null, 1));
  console.log("SPINNERS:", JSON.stringify(spinners, null, 1));
  await page.screenshot({ path: process.env.TEMP + "\\opencode\\bottom-check.png" });
  await browser.close();
})().catch(e => { console.error("ERR", e.message); process.exit(1); });
