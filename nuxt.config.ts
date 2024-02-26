// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.bootcdn.net/ajax/libs/font-awesome/6.1.0/css/all.min.css",
    },
  ],
  nitro: {
    plugins: ["~/server/index.ts"],
  },
});
