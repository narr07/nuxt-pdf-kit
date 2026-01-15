// server/routes/pdf-proxy/gdrive/[id].ts
import { createError, defineEventHandler, sendStream, setResponseHeader } from 'h3'

/**
 * Google Drive PDF Proxy Route
 *
 * Proxies PDF files from Google Drive to handle CORS and virus scan warnings
 *
 * Route: /pdf-proxy/gdrive/:id.pdf
 * Example: /pdf-proxy/gdrive/1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu.pdf
 */
export default defineEventHandler(async (event) => {
  // 1. Get and clean the file ID from the URL path
  // URL format: /pdf-proxy/gdrive/1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu.pdf
  const path = event.path || event.node.req.url || ''

  // Extract ID from path: remove /pdf-proxy/gdrive/ prefix and .pdf suffix
  const match = path.match(/\/pdf-proxy\/gdrive\/([^/]+?)(?:\.pdf)?$/)
  const rawId = match ? match[1] : ''

  // Debug logging
  console.log('[nuxt-pdf-kit] Debug - event.path:', path)
  console.log('[nuxt-pdf-kit] Debug - extracted rawId:', rawId)

  // Clean ID: remove any remaining .pdf extension and trim whitespace
  const fileId = rawId.replace(/\.pdf$/i, '').trim()

  if (!fileId) {
    console.error('[nuxt-pdf-kit] File ID is empty after extraction')
    throw createError({
      statusCode: 400,
      statusMessage: 'Google Drive file ID is missing',
    })
  }

  console.log('[nuxt-pdf-kit] Final fileId:', fileId)

  // 2. Construct Google Drive download URL
  const googleUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

  try {
    // 3. Fetch from Google Drive
    const response = await fetch(googleUrl, {
      method: 'GET',
      headers: {
        // User-Agent is important to avoid being blocked as a bot
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      redirect: 'follow',
    })

    // 4. Check for Google Drive errors
    if (!response.ok) {
      console.error('[nuxt-pdf-kit] Google Drive error:', response.status, response.statusText)
      throw createError({
        statusCode: response.status,
        statusMessage: `Google Drive Error: ${response.statusText}`,
      })
    }

    // 5. Check Content-Type
    const contentType = response.headers.get('content-type')

    // If Google returns HTML instead of PDF, it's usually a virus scan warning or quota exceeded
    if (contentType && contentType.includes('text/html')) {
      console.error('[nuxt-pdf-kit] Google Drive returned HTML (likely virus scan warning or quota exceeded)')

      // Try to get the response text for debugging
      const text = await response.text()
      console.log('[nuxt-pdf-kit] Response preview:', text.substring(0, 200))

      throw createError({
        statusCode: 502,
        statusMessage: 'Google Drive returned HTML instead of PDF. This usually means the file triggered a virus scan warning or quota was exceeded. Try downloading the file directly or use a smaller file.',
      })
    }

    // 6. Set response headers
    setResponseHeader(event, 'Content-Type', 'application/pdf')
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400') // Cache for 24 hours
    setResponseHeader(event, 'Access-Control-Allow-Origin', '*')
    setResponseHeader(event, 'Content-Disposition', `inline; filename="${fileId}.pdf"`)

    // 7. Stream the response
    if (!response.body) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Empty response body from Google Drive',
      })
    }

    return sendStream(event, response.body)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error('[nuxt-pdf-kit] Server error:', error.message)

    // Re-throw if it's already a createError
    if (error.statusCode) {
      throw error
    }

    // Otherwise create a generic error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal Server Error while fetching from Google Drive',
    })
  }
})
