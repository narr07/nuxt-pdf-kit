import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

// setup() registers beforeAll/afterAll hooks at the file level, so it must
// run at top level (NOT inside describe) to build + start the Nuxt server.
await setup({
  rootDir: fileURLToPath(new URL('../fixtures/custom-toolbar', import.meta.url)),
  // Building + starting the Nuxt server for the fixture can take a while,
  // so give the internal beforeAll an explicit long timeout.
  setupTimeout: 120_000,
})

describe('custom toolbar configuration', () => {
  it('renders the page with custom toolbar config', async () => {
    const html = await $fetch('/')
    expect(html).toContain('id="test-marker"')
    expect(html).toContain('custom-toolbar')
  })

  it('module accepts custom toolbar options without errors', async () => {
    const html = await $fetch('/')
    // If page renders, custom config was accepted
    expect(html).toContain('custom-toolbar')
  })

  it('includes PDF container', async () => {
    const html = await $fetch('/')
    expect(html).toContain('id="pdf-container"')
  })
})
