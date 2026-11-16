// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "@nuxt/image"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core"],
    },
  },

  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/confirm",
      exclude: ["/auth/*", "/"],
      saveRedirectToCookie: true,
    },
  },

  routeRules: {
    // Set layout for specific route
    "/admin/**": { appLayout: "admin" },
    // Set layout for multiple routes
    "/": { appLayout: "header" },
  },
});
