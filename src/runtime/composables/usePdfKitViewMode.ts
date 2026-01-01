import { ref, computed } from 'vue'

export type PdfKitViewMode = 'single' | 'dual' | 'dual-cover'
export type PdfKitScrollMode = 'vertical' | 'horizontal' | 'wrapped' | 'page'

export interface UsePdfKitViewModeOptions {
  initialViewMode?: PdfKitViewMode
  initialScrollMode?: PdfKitScrollMode
}

export function usePdfKitViewMode(options: UsePdfKitViewModeOptions = {}) {
  const {
    initialViewMode = 'single',
    initialScrollMode = 'vertical',
  } = options

  const viewMode = ref<PdfKitViewMode>(initialViewMode)
  const scrollMode = ref<PdfKitScrollMode>(initialScrollMode)

  const setViewMode = (mode: PdfKitViewMode) => {
    viewMode.value = mode
  }

  const setScrollMode = (mode: PdfKitScrollMode) => {
    scrollMode.value = mode
  }

  // Determine how many pages to display at once
  const pagesPerView = computed(() => {
    switch (viewMode.value) {
      case 'single':
        return 1
      case 'dual':
      case 'dual-cover':
        return 2
      default:
        return 1
    }
  })

  // Determine if first page should be alone (for dual-cover)
  const isDualCover = computed(() => viewMode.value === 'dual-cover')

  // Calculate visible pages based on current page and view mode
  const getVisiblePages = (currentPage: number, totalPages: number): number[] => {
    if (viewMode.value === 'single') {
      return [currentPage]
    }

    if (viewMode.value === 'dual-cover') {
      // First page alone
      if (currentPage === 1) {
        return [1]
      }
      // Subsequent pages in pairs (2-3, 4-5, etc.)
      const isEven = currentPage % 2 === 0
      if (isEven) {
        return [currentPage, Math.min(currentPage + 1, totalPages)]
      }
      else {
        return [Math.max(currentPage - 1, 2), currentPage]
      }
    }

    // Standard dual mode
    const isEven = currentPage % 2 === 0
    if (isEven) {
      return [currentPage, Math.min(currentPage + 1, totalPages)]
    }
    else {
      if (currentPage === 1) {
        return [1, Math.min(2, totalPages)]
      }
      return [Math.max(currentPage - 1, 1), currentPage]
    }
  }

  return {
    viewMode,
    scrollMode,
    pagesPerView,
    isDualCover,
    setViewMode,
    setScrollMode,
    getVisiblePages,
  }
}
