export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  extends: ['docus'],
  site: {
    name: 'Nuxt PDF Kit',
    url: 'https://nuxtpdfkit.permadi.dev',
  },
  ogImage: {
    zeroRuntime: true,
  },
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
  i18n: {
    defaultLocale: 'en',
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'id', name: 'Indonesia', file: 'id.json' },
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
