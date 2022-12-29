import type { UserConfig } from "vite";
import copy from "rollup-plugin-copy";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "unplugin-vue-components/vite";

const config: UserConfig = {
  plugins: [
    vue(),
    Components({
      dts: "src/components.d.ts",
    }),
    // @ts-ignore
    copy({
      targets: [
        {
          src: "package.json",
          dest: "dist/",
          rename: "package.json",
          transform: (contents) => {
            // @ts-ignore
            let _contents = contents.toString().replaceAll("./dist/", "./");
            _contents = _contents.replaceAll("dist/", "");
            //_contents = _contents.replaceAll("types.ts", "types.d.ts");

            _contents = _contents
              .toString()
              .replaceAll(
                /"devDependencies": {([\S\s]+)}/gm,
                '"devDependencies": {}\n}'
              );
            _contents = _contents
              .toString()
              .replaceAll(/"scripts": {([\S\s]+)}/gm, '"scripts": {}\n}');
            return _contents;
          },
        },
        { src: "README.md", dest: "dist/", rename: "README.md" },
      ],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@fy-/w3",
      formats: ["es", "cjs"],
      fileName: (format) => `fyw3.${format}.js`,
    },
    rollupOptions: {
      external: [
        "vue",
        "@vue/compiler-dom",
        "vue-router",
        "pinia",
        "ethers",
        "@fy-/core",
      ],
      output: {
        exports: "named",
        sourcemap: true,
        dir: "./dist/",
        globals: {
          vue: "Vue",
          "@vue/compiler-dom": "VueCompilerDOM",
          pinia: "pinia",
          ethers: "ethers",
          "@fy-/core": "fyCore",
        },
      },
    },
    emptyOutDir: false,
  },
};

export default config;
