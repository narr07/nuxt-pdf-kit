import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import MyModule from '../../../src/module'

// Registers the `nuxt/server` entry on its own. With no `nitro2` variant
// beside it, it is the one that runs, even on a Nitro v2 host.
const portableRoute = defineNuxtModule({
  meta: { name: 'portable-route' },
  setup() {
    const { resolve } = createResolver(import.meta.url)

    addServerHandler({
      route: '/portable/gdrive/**',
      handler: { nuxt: resolve('../../../src/runtime/server/routes/pdf-proxy/gdrive/[id]') },
    })
  },
})

export default defineNuxtConfig({
  modules: [
    MyModule,
    portableRoute,
  ],
})
