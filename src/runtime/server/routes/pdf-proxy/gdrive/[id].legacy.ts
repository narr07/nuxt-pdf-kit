import { createError, defineEventHandler, sendStream, setResponseHeaders } from 'h3'
import { fetchGdrivePdf } from '../../../utils/gdrive'

// Nitro v2 / h3 v1 entry for the Google Drive PDF proxy, see `[id].ts`
export default defineEventHandler(async (event) => {
  const { body, headers } = await fetchGdrivePdf(
    event.path || '',
    ({ status, statusText }) => createError({ statusCode: status, statusMessage: statusText }),
  )

  setResponseHeaders(event, headers)
  return sendStream(event, body)
})
