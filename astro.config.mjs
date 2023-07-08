import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import compress from "astro-compress";
import compressor from "astro-compressor";
import { remarkReadingTime } from "./remark-reading-time.mjs";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.katsick.cloud",
  experimental: {
    assets: true,
  },
  build: {
    inlineStylesheets: "auto",
    format: "file",
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  integrations: [
    expressiveCode(), // https://github.com/expressive-code/expressive-code/blob/1dff49a3dfa1fbdab52be5264e15e76fc9f0cf2e/packages/astro-expressive-code/README.md
    mdx(),
    sitemap(),
    robotsTxt(),
    compress(),
    compressor(),
  ],
});
