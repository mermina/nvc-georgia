// NVC Georgia — Eleventy build. Content lives in src/_data (page texts) and src/content (team, materials, news),
// which the team edits in Pages CMS (.pages.yml). Every edit triggers .github/workflows/deploy.yml.
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "." });
  eleventyConfig.addPassthroughCopy({ "src/options.html": "options.html" });

  const byOrder = (a, b) => (a.data.order ?? 0) - (b.data.order ?? 0);
  eleventyConfig.addCollection("team", api => api.getFilteredByGlob("src/content/team/*.md").sort(byOrder));
  eleventyConfig.addCollection("materials", api => api.getFilteredByGlob("src/content/materials/*.md").sort(byOrder));
  eleventyConfig.addCollection("news", api => api.getFilteredByGlob("src/content/news/*.md").sort(byOrder));

  // cache-busting version for styles.css / app.js (changes on every build)
  eleventyConfig.addGlobalData("build", { v: Date.now().toString(36) });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
  };
}
