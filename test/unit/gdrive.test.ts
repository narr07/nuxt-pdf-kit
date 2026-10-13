import { afterEach, describe, expect, it, vi } from 'vitest'
import { extractFileId, fetchGdrivePdf } from '../../src/runtime/server/utils/gdrive'

const fail = ({ status, statusText }: { status: number, statusText: string }) =>
  Object.assign(new Error(statusText), { status })

const mockFetch = (response: Response) => {
  const spy = vi.fn(async (_url: string | URL | Request) => response)
  vi.stubGlobal('fetch', spy)
  return spy
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('extractFileId', () => {
  it('reads the ID with or without the .pdf suffix', () => {
    expect(extractFileId('/pdf-proxy/gdrive/1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu.pdf')).toBe('1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu')
    expect(extractFileId('/pdf-proxy/gdrive/1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu')).toBe('1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu')
    expect(extractFileId('/pdf-proxy/gdrive/1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu.pdf?v=2')).toBe('1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu')
  })

  it('rejects anything that is not a plain Drive ID', () => {
    expect(extractFileId('/pdf-proxy/gdrive/')).toBeNull()
    expect(extractFileId('/pdf-proxy/gdrive/short')).toBeNull()
    expect(extractFileId('/pdf-proxy/gdrive/abcdefghijkl&export=view')).toBeNull()
    expect(extractFileId('/pdf-proxy/gdrive/abcdefghijkl%22%0d%0aX-Injected.pdf')).toBeNull()
    expect(extractFileId('/pdf-proxy/gdrive/abcdefghijkl".pdf')).toBeNull()
  })
})

describe('fetchGdrivePdf', () => {
  it('fails with 400 before any request is made for an invalid ID', async () => {
    const spy = mockFetch(new Response('unused'))

    await expect(fetchGdrivePdf('/pdf-proxy/gdrive/bad&id=1', fail)).rejects.toMatchObject({ status: 400 })
    expect(spy).not.toHaveBeenCalled()
  })

  it('relays a PDF with the response headers', async () => {
    const spy = mockFetch(new Response('%PDF-1.7', { headers: { 'content-type': 'application/pdf' } }))

    const { body, headers } = await fetchGdrivePdf('/pdf-proxy/gdrive/abcdefghijkl.pdf', fail)

    expect(String(spy.mock.calls[0]![0])).toBe('https://drive.google.com/uc?export=download&id=abcdefghijkl')
    expect(await new Response(body).text()).toBe('%PDF-1.7')
    expect(headers['Content-Type']).toBe('application/pdf')
    expect(headers['Content-Disposition']).toBe('inline; filename="abcdefghijkl.pdf"')
  })

  it('accepts the generic binary type Drive uses for downloads', async () => {
    mockFetch(new Response('%PDF-1.7', { headers: { 'content-type': 'application/octet-stream' } }))

    await expect(fetchGdrivePdf('/pdf-proxy/gdrive/abcdefghijkl', fail)).resolves.toBeDefined()
  })

  it('fails with 502 when Drive answers with an HTML page', async () => {
    mockFetch(new Response('<html>', { headers: { 'content-type': 'text/html; charset=utf-8' } }))

    await expect(fetchGdrivePdf('/pdf-proxy/gdrive/abcdefghijkl', fail)).rejects.toMatchObject({ status: 502 })
  })

  it('refuses files that are not PDFs', async () => {
    mockFetch(new Response('data', { headers: { 'content-type': 'video/mp4' } }))

    await expect(fetchGdrivePdf('/pdf-proxy/gdrive/abcdefghijkl', fail)).rejects.toMatchObject({ status: 415 })
  })

  it('passes on the upstream status when Drive rejects the request', async () => {
    mockFetch(new Response('gone', { status: 404, statusText: 'Not Found' }))

    await expect(fetchGdrivePdf('/pdf-proxy/gdrive/abcdefghijkl', fail)).rejects.toMatchObject({ status: 404 })
  })
})
