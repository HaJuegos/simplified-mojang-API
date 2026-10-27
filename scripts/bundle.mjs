import { build } from "esbuild";

await build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    format: "esm",
    platform: "neutral",
    target: "es2020",
    sourcemap: true,
    packages: "external",
});
