import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('custom toolbar configuration', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/custom-toolbar', import.meta.url)),
  })

  it('renders the page with custom toolbar config', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div id="test-marker">custom-toolbar</div>')
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
