export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-01-01',
  pdfKit: {
    toolbar: {
      openFile: false, // Hide open file button
      // sidebar: true,   // Show sidebar (default: true)
      // pageNavigation: true,
      // zoom: true,
      // search: true,
      // rotate: true,
      // print: true,
      // download: true,
      // fullscreen: true,
      // themeToggle: true,
      // moreOptions: true,
    },
  },
})
