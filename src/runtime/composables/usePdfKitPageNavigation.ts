import { ref, computed } from 'vue'

export interface UsePdfKitPageNavigationOptions {
  totalPages: number
  initialPage?: number
}

export function usePdfKitPageNavigation(options: UsePdfKitPageNavigationOptions) {
  const { totalPages, initialPage = 1 } = options

  const currentPage = ref(initialPage)

  const nextPage = () => {
    if (currentPage.value < totalPages) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      currentPage.value = pageNumber
    }
  }

  const firstPage = () => {
    currentPage.value = 1
  }

  const lastPage = () => {
    currentPage.value = totalPages
  }

  const canGoNext = computed(() => currentPage.value < totalPages)
  const canGoPrev = computed(() => currentPage.value > 1)

  return {
    currentPage,
    nextPage,
    prevPage,
    goToPage,
    firstPage,
    lastPage,
    canGoNext,
    canGoPrev,
  }
}
