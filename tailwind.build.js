const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const inputPath = "./src/styles/tailwind.input.css";
const outputPath = "./src/styles/tailwind.css";
const assetOutputPath = "./src/webparts/mgStore/assets/tailwind.css";
const scopeSelector = '.mgStore, [class*="mgStore_"]';

const scopePlugin = () => {
  return {
    postcssPlugin: "mg-store-tailwind-scope",
    Once(root) {
      root.walkRules((rule) => {
        const parent = rule.parent;
        if (
          parent &&
          parent.type === "atrule" &&
          (parent.name === "keyframes" || parent.name === "font-face")
        ) {
          return;
        }

        rule.selectors = rule.selectors.map((selector) => {
          const trimmed = selector.trim();

          if (
            trimmed.startsWith(scopeSelector) ||
            trimmed === ":root" ||
            trimmed === ".dark" ||
            trimmed.startsWith(":root") ||
            trimmed.startsWith(".dark") ||
            trimmed.startsWith("::") ||
            trimmed.startsWith(":where(") ||
            trimmed.startsWith(":is(")
          ) {
            return selector;
          }

          if (trimmed.startsWith("*") || trimmed.startsWith("html") || trimmed.startsWith("body")) {
            return `${scopeSelector} ${trimmed}`;
          }

          return `${scopeSelector} ${trimmed}`;
        });
      });
    },
  };
};

scopePlugin.postcss = true;

postcss([tailwindcss, autoprefixer, scopePlugin])
  .process(fs.readFileSync(inputPath, "utf8"), { from: inputPath })
  .then((result) => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result.css);
    fs.mkdirSync(path.dirname(assetOutputPath), { recursive: true });
    fs.writeFileSync(assetOutputPath, result.css);
    console.log("Tailwind built and scoped for mgStore");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
