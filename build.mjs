import autoprefixer from "autoprefixer";
import esbuild from "esbuild";
import postcss from "postcss";
import postcssPresetEnv from "postcss-preset-env";
import { sassPlugin } from "esbuild-sass-plugin";
import * as fs from "node:fs";

// check if --watch flag is present
const serve = process.argv.includes("--serve");
const watch = process.argv.includes("--watch") || serve;

const buildOptions = {
    bundle: true,
    entryPoints: ["src/styles/index.scss", "src/index.ts"],
    loader: { ".jpeg": "file", ".jpg": "file", ".png": "file", ".webp": "file" },
    minify: true,
    outdir: "build",
    publicPath: "",
    sourcemap: true,
    plugins: [
        sassPlugin({
            transform: async (contents) => {
                console.log("Running postcss...");
                const { css } = await postcss([
                    postcssPresetEnv({ stage: 0 }),
                    autoprefixer,
                ]).process(contents, { from: undefined });
                return css;
            },
        }),
        {
            name: "Copy HTML and Audio",
            setup(build) {
                build.onEnd(() => {
                    fs.copyFileSync("src/index.html", "build/index.html");
                    fs.cpSync("src/audio", "build/audio", { recursive: true })
                });
            },
        },
    ],
};

if (!watch) {
    console.log("Building...");
    esbuild.build(buildOptions).then(() => console.log("Build complete"));
} else {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log("Watching...");

    if (serve) {
        const { host, port } = await ctx.serve({
            servedir: "build",
        });
        console.log(`Serving on http://${host}:${port}`);
    }
}
