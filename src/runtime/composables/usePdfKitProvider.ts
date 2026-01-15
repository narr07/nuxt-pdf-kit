import type { ProviderConfig, PdfProvider } from '../types'

/**
 * Transform Google Drive file ID to proxy URL
 */
function transformGoogleDrive(src: string, config?: ProviderConfig): string {
  // Clean the ID (remove .pdf extension if present)
  const fileId = src.replace(/\.pdf$/i, '').trim()

  // Get proxy route from config or use default
  const proxyRoute = config?.baseUrl || '/pdf-proxy/gdrive'

  return `${proxyRoute}/${fileId}.pdf`
}

/**
 * Transform using custom provider config
 */
function transformCustom(src: string, config?: ProviderConfig): string {
  // If custom transform function provided, use it
  if (config?.transform) {
    return config.transform(src)
  }

  // Otherwise use baseUrl
  const baseUrl = config?.baseUrl || ''
  const cleanSrc = src.replace(/\.pdf$/i, '').trim()

  return `${baseUrl}/${cleanSrc}.pdf`
}

/**
 * Composable for transforming PDF source based on provider
 *
 * @param provider - Provider type ('url', 'gdrive', 'custom')
 * @param src - Source file ID or URL
 * @param config - Provider-specific configuration
 * @returns Transformed URL ready for PDF.js
 *
 * @example
 * ```ts
 * // Google Drive
 * const url = usePdfKitProvider('gdrive', '1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu')
 * // Returns: '/pdf-proxy/gdrive/1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu.pdf'
 *
 * // Custom provider
 * const url = usePdfKitProvider('custom', 'file-123', { baseUrl: '/cdn' })
 * // Returns: '/cdn/file-123.pdf'
 *
 * // Direct URL (default)
 * const url = usePdfKitProvider('url', '/sample.pdf')
 * // Returns: '/sample.pdf'
 * ```
 */
export function usePdfKitProvider(
  provider: PdfProvider = 'url',
  src: string,
  config?: ProviderConfig,
): string {
  if (!src) {
    console.warn('[nuxt-pdf-kit] Empty src provided to usePdfKitProvider')
    return ''
  }

  switch (provider) {
    case 'gdrive':
      return transformGoogleDrive(src, config)
    case 'custom':
      return transformCustom(src, config)
    case 'url':
    default:
      // Return as-is for direct URLs
      return src
  }
}
