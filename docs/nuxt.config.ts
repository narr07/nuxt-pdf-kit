export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  site: {
    name: 'Nuxt PDF Kit',
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'id', name: 'Indonesia' },
    ],
  },

})
