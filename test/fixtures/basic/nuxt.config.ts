import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  // Module configuration
  pdfKit: {
    toolbar: {
      sidebar: true,
      pageNavigation: true,
      zoom: true,
      search: true,
      rotate: true,
      openFile: false,
      print: true,
      download: true,
      fullscreen: true,
      themeToggle: true,
      moreOptions: true,
    },
  },
})
