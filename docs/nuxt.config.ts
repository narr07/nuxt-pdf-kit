export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  site: {
    name: 'Nuxt PDF Kit',
    url: 'https://nuxtpdfkit.permadi.dev',
  },
  nitro: {
    preset: 'cloudflare-pages',
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'id', name: 'Indonesia' },
    ],
  },
  // OG Image for Cloudflare Pages - use Satori renderer
  ogImage: {
    compatibility: {
      runtime: {
        resvg: false, // Disable resvg (native module not compatible with CF)
      },
    },
  },
})
