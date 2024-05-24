import autoprefixer from "autoprefixer";
import esbuild from "esbuild";
import postcss from "postcss";
import postcssPresetEnv from "postcss-preset-env";
import { sassPlugin } from "esbuild-sass-plugin";
import copyStaticFiles from "esbuild-copy-static-files";

// check if --watch flag is present
const watch = process.argv.includes("--watch");
const serve = process.argv.includes("--serve");

const buildOptions = {
    bundle: true,
    entryPoints: ["assets/styles/index.scss"],
    loader: { ".jpeg": "file", ".jpg": "file", ".png": "file" },
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
        copyStaticFiles({
            src: "./",
            dest: "build",
            filter: (file) => {
                console.log(file)
                return file.includes("html");
            },
        }),
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
