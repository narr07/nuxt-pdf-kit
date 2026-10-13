// Stand-in for Google Drive so the fixture needs no network access
export default () => {
  const realFetch = globalThis.fetch

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    if (url.startsWith('https://drive.google.com/uc')) {
      const id = new URL(url).searchParams.get('id')

      if (id === 'virus-scan-warning') {
        return new Response('<html>warning</html>', { headers: { 'content-type': 'text/html; charset=utf-8' } })
      }
      return new Response(`%PDF-1.7 ${id}`, { headers: { 'content-type': 'application/pdf' } })
    }

    return realFetch(input, init)
  }) as typeof fetch
}
