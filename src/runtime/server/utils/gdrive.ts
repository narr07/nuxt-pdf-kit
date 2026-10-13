/** Google Drive file IDs only use letters, digits, `-` and `_` */
const FILE_ID = /^[\w-]{10,200}$/

/** Content types Google Drive serves a PDF with */
const PDF_TYPES = ['application/pdf', 'application/octet-stream', 'binary/octet-stream']

export interface GdriveError {
  status: number
  statusText: string
}

export interface GdrivePdf {
  body: ReadableStream<Uint8Array>
  headers: Record<string, string>
}

/**
 * Read the file ID from a `/pdf-proxy/gdrive/:id(.pdf)` path.
 * Returns `null` for anything that is not a plain Drive ID, so the value is
 * safe to place in the upstream URL and in response headers.
 */
export function extractFileId(pathname: string): string | null {
  const segment = pathname.split('?')[0]!.split('/').filter(Boolean).pop() ?? ''
  const fileId = segment.replace(/\.pdf$/i, '').trim()
  return FILE_ID.test(fileId) ? fileId : null
}

/**
 * Fetch a PDF from Google Drive for the given request path.
 * Errors are produced through `fail` so each server runtime can throw its own
 * HTTP error type.
 */
export async function fetchGdrivePdf(pathname: string, fail: (error: GdriveError) => Error): Promise<GdrivePdf> {
  const fileId = extractFileId(pathname)
  if (!fileId) {
    throw fail({ status: 400, statusText: 'Google Drive file ID is missing or invalid' })
  }

  let response: Response
  try {
    response = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`, {
      headers: {
        // Drive blocks requests that do not look like a browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      redirect: 'follow',
    })
  }
  catch (error) {
    throw fail({ status: 502, statusText: `Could not reach Google Drive: ${(error as Error).message}` })
  }

  if (!response.ok) {
    throw fail({ status: response.status, statusText: `Google Drive Error: ${response.statusText}` })
  }

  const contentType = (response.headers.get('content-type') || '').split(';')[0]!.trim().toLowerCase()

  // Drive answers with an HTML page for virus scan warnings and exceeded quotas
  if (contentType === 'text/html') {
    throw fail({
      status: 502,
      statusText: 'Google Drive returned HTML instead of PDF. This usually means the file triggered a virus scan warning or quota was exceeded. Try downloading the file directly or use a smaller file.',
    })
  }

  // Only relay PDFs, so the route cannot be used to proxy arbitrary Drive files
  if (contentType && !PDF_TYPES.includes(contentType)) {
    throw fail({ status: 415, statusText: `Google Drive file is not a PDF (${contentType})` })
  }

  if (!response.body) {
    throw fail({ status: 500, statusText: 'Empty response body from Google Drive' })
  }

  return {
    body: response.body,
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Content-Disposition': `inline; filename="${fileId}.pdf"`,
    },
  }
}
