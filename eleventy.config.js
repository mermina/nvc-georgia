// NVC Georgia — Eleventy build. Content lives in src/_data (page texts) and src/content (team, materials, news),
// which the team edits in Pages CMS (.pages.yml). Every edit triggers .github/workflows/deploy.yml.
import { linkPreviewImage } from "./lib/preview.js";

const IMG_RE = /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i;

// Decide what a What's New card shows and what clicking it opens.
// "" (empty) = Automatic. A manual choice with nothing behind it falls back to Automatic.
async function resolveNews(d) {
  const docIsImage = d.document && IMG_RE.test(d.document);
  let picture = "";
  const choice = d.picture_choice || "";
  if (choice === "none") picture = "";
  else if (choice === "picture" && d.image) picture = d.image;
  else if (choice === "document" && docIsImage) picture = d.document;
  else if (choice === "preview" && d.link) picture = await linkPreviewImage(d.link);
  if (!picture && choice !== "none") {
    picture = d.image || (docIsImage ? d.document : "") || (d.link ? await linkPreviewImage(d.link) : "");
  }

  let href = "";
  const click = d.click_choice || "";
  if (click === "none") href = "";
  else if (click === "link" && d.link) href = d.link;
  else if (click === "document" && d.document) href = d.document;
  else if (click === "picture" && (d.image || picture)) href = d.image || picture;
  if (!href && click !== "none") href = d.link || d.document || d.image || "";

  return { picture, href };
}

// For a Materials button: link or uploaded document. "" / "auto" = Automatic (link first, like What's New cards).
function resolveButton(l) {
  if (l.use === "link" && l.url) return l.url;
  if (l.use === "file" && l.file) return l.file;
  return l.url || l.file || "";
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "img": "img" });
  eleventyConfig.addPassthroughCopy({ "files": "files" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "." });
  eleventyConfig.addPassthroughCopy({ "src/options.html": "options.html" });

  const byOrder = (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0);
  eleventyConfig.addCollection("team", api => api.getFilteredByGlob("src/content/team/*.md").sort(byOrder));
  eleventyConfig.addCollection("materials", api => {
    const items = api.getFilteredByGlob("src/content/materials/*.md").sort(byOrder);
    for (const it of items) for (const l of it.data.links || []) l.href = resolveButton(l);
    return items;
  });
  eleventyConfig.addCollection("news", async api => {
    const items = api.getFilteredByGlob("src/content/news/*.md").sort(byOrder);
    for (const it of items) it.data.card = await resolveNews(it.data);
    return items;
  });

  // cache-busting version for styles.css / app.js (changes on every build)
  eleventyConfig.addGlobalData("build", { v: Date.now().toString(36) });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
  };
}
