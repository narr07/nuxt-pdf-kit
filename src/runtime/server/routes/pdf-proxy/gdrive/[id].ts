import { createError, defineEventHandler } from 'nuxt/server'
import { fetchGdrivePdf } from '../../../utils/gdrive'

/**
 * Google Drive PDF Proxy Route
 *
 * Proxies PDF files from Google Drive to handle CORS and virus scan warnings
 *
 * Route: /pdf-proxy/gdrive/:id.pdf
 * Example: /pdf-proxy/gdrive/1kgN3QYrPhgeyoIehoTcarfwcIikKHIvE.pdf
 */
export default defineEventHandler(async (event) => {
  const pathname = new URL(event.req.url).pathname
  const { body, headers } = await fetchGdrivePdf(pathname, createError)

  return new Response(body, { headers })
})
