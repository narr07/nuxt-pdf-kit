export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  site: {
    name: 'Nuxt PDF Kit',
    url: 'https://nuxtpdfkit.permadi.dev',
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'id', name: 'Indonesia' },
    ],
  },
  // Disable OG Image for Cloudflare Pages compatibility
  ogImage: {
    enabled: false,
  },
  nitro: {
    preset: 'cloudflare-pages',
  },
})
