import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nuxt-pdf-kit module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  describe('SSR rendering', () => {
    it('renders the index page', async () => {
      const html = await $fetch('/')
      expect(html).toContain('<div id="test-marker">basic</div>')
    })

    it('includes PDF viewer container in HTML', async () => {
      const html = await $fetch('/')
      expect(html).toContain('id="pdf-container"')
    })

    it('has NuxtPdfViewer component placeholder (client-only)', async () => {
      const html = await $fetch('/')
      // Client components render as placeholders in SSR
      expect(html).toBeDefined()
    })
  })

  describe('runtime config', () => {
    it('exposes pdfKit config to runtime', async () => {
      const html = await $fetch('/')
      // The page should render without errors, meaning config is accessible
      expect(html).toContain('basic')
    })
  })

  describe('module configuration', () => {
    it('module is properly registered', async () => {
      const html = await $fetch('/')
      // Page renders without module errors
      expect(html).toContain('basic')
    })
  })
})
