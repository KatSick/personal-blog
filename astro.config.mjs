import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import compress from "astro-compress";
// TODO: mixed content error with HTTPS with prefetch. Need to debug and raise issue https://github.com/withastro/astro/issues?q=%40astrojs%2Fprefetch+https
// import prefetch from "@astrojs/prefetch";
import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.katsick.cloud",
  experimental: {
    assets: true,
  },
  build: {
    inlineStylesheets: "auto",
  },
  integrations: [
    mdx(),
    sitemap(),
    robotsTxt(),
    compress(),
    // prefetch(),
    compressor(),
  ],
});
