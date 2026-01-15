export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'gray',
    },
  },

  seo: {
    // Default to package.json name
    title: 'Nuxt PDF Kit',
    // Default to package.json description
    description: 'A Nuxt module to easily embed PDF viewers with customizable toolbars in your Nuxt applications.',
  },
  header: {
    // Title to display if no logo
    title: 'Nuxt PDF Kit',
    // Logo configuration
    // logo: {
    //   alt: 'Nuxt PDF Kit Logo',
    //   // Light mode
    //   light: '/npk.svg',
    //   // Dark mode
    //   dark: '/npk.svg'
    // },
  },
})
