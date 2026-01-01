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
  llms: {
    domain: 'https://nuxtpdfkit.permadi.dev/',
    title: 'Nuxt PDF Kit',
    description: 'A Nuxt module to easily embed PDF viewers with customizable toolbars in your Nuxt applications.',
    full: {
      title: 'Nuxt PDF Kit',
      description: 'A Nuxt module to easily embed PDF viewers with customizable toolbars in your Nuxt applications.',
    },
  },
  // OG Image for Cloudflare Pages - use Satori renderer
  // ogImage: {
  //   compatibility: {
  //     runtime: {
  //       resvg: false, // Disable resvg (native module not compatible with CF)
  //     },
  //   },
  // },
})
