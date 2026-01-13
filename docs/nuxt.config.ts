export default defineNuxtConfig({
  // extends: ['docus'],
  modules: ['@nuxtjs/i18n', 'nuxt-studio'],

  site: {
    name: 'Nuxt PDF Kit',
    url: 'https://nuxtpdfkit.permadi.dev',
  },

  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  i18n: {
    // Force build trigger
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

  mcp: {
    enabled: false,
  },

  ogImage: {
    zeroRuntime: true,
  },

  studio: {
    repository: {
      provider: 'github', // 'github' or 'gitlab'
      owner: 'narr07',
      repo: 'nuxt-pdf-kit',
      branch: 'master',
    },
  },
})
