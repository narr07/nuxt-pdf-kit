import { ref, computed } from 'vue'

export type ZoomLevel = 'auto' | 'page-fit' | 'page-width' | number

export interface UsePdfKitZoomOptions {
  initialScale?: number | ZoomLevel
  minScale?: number
  maxScale?: number
  scaleDelta?: number
}

export function usePdfKitZoom(options: UsePdfKitZoomOptions = {}) {
  const {
    initialScale = 1.0,
    minScale = 0.25,
    maxScale = 10.0,
    scaleDelta = 1.1,
  } = options

  const scale = ref<number>(
    typeof initialScale === 'number' ? initialScale : 1.0,
  )
  const zoomMode = ref<ZoomLevel>(initialScale)

  const zoomIn = () => {
    scale.value = Math.min(maxScale, scale.value * scaleDelta)
    zoomMode.value = scale.value
  }

  const zoomOut = () => {
    scale.value = Math.max(minScale, scale.value / scaleDelta)
    zoomMode.value = scale.value
  }

  const setZoom = (value: number | ZoomLevel) => {
    zoomMode.value = value
    if (typeof value === 'number') {
      scale.value = Math.max(minScale, Math.min(maxScale, value))
    }
    // For 'auto', 'page-fit', 'page-width' - will be calculated based on viewport
  }

  const zoomPercentage = computed(() => Math.round(scale.value * 100))

  // Preset zoom levels
  const zoomPresets = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0]

  return {
    scale,
    zoomMode,
    zoomIn,
    zoomOut,
    setZoom,
    zoomPercentage,
    zoomPresets,
  }
}
