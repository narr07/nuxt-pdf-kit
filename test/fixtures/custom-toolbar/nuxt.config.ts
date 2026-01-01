import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  // Custom toolbar configuration - disable some features
  pdfKit: {
    toolbar: {
      sidebar: false,
      pageNavigation: true,
      zoom: true,
      search: false,
      rotate: false,
      openFile: true,
      print: false,
      download: true,
      fullscreen: false,
      themeToggle: false,
      moreOptions: false,
    },
  },
})
