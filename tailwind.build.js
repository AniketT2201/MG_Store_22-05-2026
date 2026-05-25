const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const inputPath = "./src/styles/tailwind.input.css";
const outputPath = "./src/styles/tailwind.css";

postcss([tailwindcss, autoprefixer])
  .process(fs.readFileSync(inputPath, "utf8"), { from: inputPath })
  .then((result) => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, result.css);

    console.log("Tailwind built successfully");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
