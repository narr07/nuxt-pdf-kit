import { ref } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import type * as PDFJS from 'pdfjs-dist'

export interface UsePdfKitDocumentOptions {
  onLoad?: (doc: PDFDocumentProxy) => void
  onError?: (error: Error) => void
  onProgress?: (progress: number) => void
}

export function usePdfKitDocument(options: UsePdfKitDocumentOptions = {}) {
  const pdfDoc = ref<PDFDocumentProxy | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)
  const numPages = ref(0)

  let pdfjsLib: typeof PDFJS | null = null

  const loadPdf = async (src: string | { url: string, data?: Uint8Array }) => {
    if (!pdfjsLib) {
      try {
        pdfjsLib = await import('pdfjs-dist')
        if (typeof window !== 'undefined') {
          pdfjsLib.GlobalWorkerOptions.workerSrc
            = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
        }
      }
      catch (e) {
        error.value = 'Failed to load PDF.js library'
        options.onError?.(e as Error)
        return
      }
    }

    loading.value = true
    error.value = null
    progress.value = 0

    try {
      const source = typeof src === 'string' ? src : src
      const loadingTask = pdfjsLib.getDocument(source)

      loadingTask.onProgress = (progressData: { loaded: number, total: number }) => {
        if (progressData.total > 0) {
          progress.value = (progressData.loaded / progressData.total) * 100
          options.onProgress?.(progress.value)
        }
      }

      const doc = await loadingTask.promise
      pdfDoc.value = doc
      numPages.value = doc.numPages
      options.onLoad?.(doc)
    }
    catch (err: unknown) {
      console.error('Error loading PDF:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF'
      error.value = errorMessage
      options.onError?.(err instanceof Error ? err : new Error(errorMessage))
    }
    finally {
      loading.value = false
    }
  }

  const getPage = async (pageNumber: number) => {
    if (!pdfDoc.value) return null
    try {
      return await pdfDoc.value.getPage(pageNumber)
    }
    catch (err) {
      console.error(`Error getting page ${pageNumber}:`, err)
      return null
    }
  }

  const destroy = () => {
    if (pdfDoc.value) {
      pdfDoc.value.destroy()
      pdfDoc.value = null
    }
  }

  return {
    pdfDoc,
    loading,
    error,
    progress,
    numPages,
    loadPdf,
    getPage,
    destroy,
  }
}
