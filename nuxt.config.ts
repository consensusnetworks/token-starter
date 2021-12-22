import { defineNuxtConfig } from "nuxt3";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["@/assets/css/tailwind.css"],
  build: {
    transpile: ["@ethersproject"],
    postcss: {
      postcssOptions: require("./postcss.config.js"),
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        "bn.js/lib/bn.js",
        "@ethersproject/keccak256/node_modules/js-sha3",
        "hash.js",
        "aes-js",
        "scrypt-js",
        "bech32",
      ],
    },
  }
});
