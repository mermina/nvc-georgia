// Finds the "preview picture" of a web page (the og:image / twitter:image that messengers show),
// used on What's New cards that have a link but no picture of their own.
// Runs at build time. Any problem (site blocks it, timeout, no picture) → "" and the card stays plain.
const cache = new Map();

export function extractPreview(html, pageUrl) {
  const metas = html.match(/<meta\b[^>]*>/gi) || [];
  const want = ["og:image:secure_url", "og:image", "og:image:url", "twitter:image", "twitter:image:src"];
  const found = {};
  for (const m of metas) {
    const key = (m.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i) || [])[1];
    const val = (m.match(/\bcontent\s*=\s*["']([^"']+)["']/i) || [])[1];
    if (key && val && !found[key.toLowerCase()]) found[key.toLowerCase()] = val.replace(/&amp;/g, "&").trim();
  }
  for (const k of want) {
    if (found[k]) {
      try { return new URL(found[k], pageUrl).href; } catch { /* bad URL */ }
    }
  }
  return "";
}

export async function linkPreviewImage(url) {
  if (!/^https?:\/\//i.test(url || "")) return "";
  if (cache.has(url)) return cache.get(url);
  let img = "";
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; NVCGeorgiaSiteBuild/1.0; link preview)", "accept": "text/html" },
    });
    if (res.ok && (res.headers.get("content-type") || "").includes("html")) {
      const html = (await res.text()).slice(0, 400000);
      img = extractPreview(html, res.url || url);
    }
  } catch { img = ""; }
  if (img) console.log(`[preview] ${url} → ${img}`);
  else console.log(`[preview] ${url} → no preview picture (card stays plain)`);
  cache.set(url, img);
  return img;
}
