import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils/e2e'

await setup({
  rootDir: fileURLToPath(new URL('../fixtures/gdrive', import.meta.url)),
  setupTimeout: 120_000,
})

// The module route runs the Nitro v2 entry on this host, the `/portable` route
// runs the `nuxt/server` entry. Both must behave the same.
describe.each([
  ['nitro2 entry', '/pdf-proxy/gdrive'],
  ['nuxt/server entry', '/portable/gdrive'],
])('Google Drive proxy (%s)', (_name, base) => {
  it('streams the PDF with its headers', async () => {
    const res = await fetch(`${base}/abcdefghijkl.pdf`)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('application/pdf')
    expect(res.headers.get('content-disposition')).toBe('inline; filename="abcdefghijkl.pdf"')
    expect(await res.text()).toBe('%PDF-1.7 abcdefghijkl')
  })

  it('does not open the proxy to other origins', async () => {
    const res = await fetch(`${base}/abcdefghijkl.pdf`)

    expect(res.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('accepts an ID without the .pdf suffix', async () => {
    const res = await fetch(`${base}/abcdefghijkl`)

    expect(res.status).toBe(200)
    expect(await res.text()).toBe('%PDF-1.7 abcdefghijkl')
  })

  it('rejects an ID carrying extra query parameters', async () => {
    const res = await fetch(`${base}/abcdefghijkl&export=view.pdf`)

    expect(res.status).toBe(400)
  })

  it('answers 502 when Drive returns an HTML page', async () => {
    const res = await fetch(`${base}/virus-scan-warning.pdf`)

    expect(res.status).toBe(502)
  })
})
