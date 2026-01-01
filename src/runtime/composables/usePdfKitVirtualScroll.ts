import { ref, computed, watch, type Ref } from 'vue'
import { useScroll, useElementSize, useThrottleFn } from '@vueuse/core'

export interface PdfKitVirtualScrollOptions {
  /** Total number of items */
  totalItems: Ref<number>
  /** Estimated height of each item (page) */
  itemHeight: Ref<number>
  /** Number of extra items to render above/below viewport */
  overscan?: number
  /** Reference to the scrollable container */
  containerRef: Ref<HTMLElement | null>
}

export interface PdfKitVirtualScrollReturn {
  /** Array of item indices to render */
  visibleItems: Ref<number[]>
  /** The first visible item index */
  startIndex: Ref<number>
  /** The last visible item index */
  endIndex: Ref<number>
  /** Current scroll position */
  scrollTop: Ref<number>
  /** Container scroll handler */
  onScroll: () => void
  /** Total scrollable height */
  totalHeight: Ref<number>
  /** Offset for positioning the visible items */
  offsetTop: Ref<number>
  /** Scroll to a specific item */
  scrollToItem: (index: number) => void
  /** Current visible page (1-indexed) */
  currentVisiblePage: Ref<number>
}

export function usePdfKitVirtualScroll(options: PdfKitVirtualScrollOptions): PdfKitVirtualScrollReturn {
  const {
    totalItems,
    itemHeight,
    overscan = 2,
    containerRef,
  } = options

  const startIndex = ref(0)
  const endIndex = ref(0)
  const scrollTop = ref(0)
  const currentVisiblePage = ref(1)

  // Use VueUse's useElementSize for container dimensions
  const { height: containerHeight } = useElementSize(containerRef)

  // Use VueUse's useScroll for scroll position
  const { y: scrollY } = useScroll(containerRef)

  // Total height of all items
  const totalHeight = computed(() => totalItems.value * itemHeight.value)

  // Calculate visible range
  const calculateVisibleRange = useThrottleFn(() => {
    if (!containerRef.value) return

    const scrollPosition = scrollY.value
    scrollTop.value = scrollPosition

    // Calculate start index based on scroll position
    const rawStartIndex = Math.floor(scrollPosition / itemHeight.value)
    startIndex.value = Math.max(0, rawStartIndex - overscan)

    // Calculate how many items fit in the viewport
    const visibleCount = Math.ceil(containerHeight.value / itemHeight.value)

    // Calculate end index
    const rawEndIndex = rawStartIndex + visibleCount
    endIndex.value = Math.min(totalItems.value - 1, rawEndIndex + overscan)

    // Calculate current visible page (centered in viewport)
    const centerIndex = rawStartIndex + Math.floor(visibleCount / 2)
    currentVisiblePage.value = Math.min(Math.max(1, centerIndex + 1), totalItems.value)
  }, 16) // ~60fps

  // Visible items array (1-indexed page numbers)
  const visibleItems = computed(() => {
    const items: number[] = []
    for (let i = startIndex.value; i <= endIndex.value; i++) {
      items.push(i + 1) // Convert to 1-indexed page numbers
    }
    return items
  })

  // Offset for positioning
  const offsetTop = computed(() => startIndex.value * itemHeight.value)

  // Scroll to a specific item
  const scrollToItem = (index: number) => {
    if (!containerRef.value) return
    const targetScroll = index * itemHeight.value
    containerRef.value.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }

  // Watch for scroll changes
  watch(scrollY, calculateVisibleRange, { immediate: true })

  // Watch for container size changes
  watch(containerHeight, calculateVisibleRange)

  // Watch for item height or total items changes
  watch([itemHeight, totalItems], calculateVisibleRange)

  // Initial calculation
  const onScroll = () => {
    calculateVisibleRange()
  }

  return {
    visibleItems,
    startIndex,
    endIndex,
    scrollTop,
    onScroll,
    totalHeight,
    offsetTop,
    scrollToItem,
    currentVisiblePage,
  }
}
