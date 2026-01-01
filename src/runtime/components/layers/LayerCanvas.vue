<template>
  <canvas
    ref="canvasRef"
    class="npk-layer-canvas"
    :style="canvasStyle"
  />
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import type { PDFPageProxy } from 'pdfjs-dist'

interface Props {
  page: PDFPageProxy | null
  scale: number
  rotation: number
}

const props = defineProps<Props>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasStyle = ref<Record<string, string>>({})
let renderTask: ReturnType<PDFPageProxy['render']> | null = null

const render = async () => {
  if (!props.page || !canvasRef.value) return

  // Cancel previous render
  if (renderTask) {
    renderTask.cancel()
    renderTask = null
  }

  const canvas = canvasRef.value
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) return

  const viewport = props.page.getViewport({
    scale: props.scale,
    rotation: props.rotation,
  })

  // Set canvas size with device pixel ratio for sharp rendering
  const devicePixelRatio = window.devicePixelRatio || 1
  canvas.width = viewport.width * devicePixelRatio
  canvas.height = viewport.height * devicePixelRatio

  // Set display size
  canvas.style.width = `${viewport.width}px`
  canvas.style.height = `${viewport.height}px`

  canvasStyle.value = {
    width: `${viewport.width}px`,
    height: `${viewport.height}px`,
  }

  // Scale context to match device pixel ratio
  context.scale(devicePixelRatio, devicePixelRatio)

  try {
    renderTask = props.page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    })

    await renderTask.promise
    renderTask = null
  }
  catch (error: unknown) {
    if (error instanceof Error && error.name !== 'RenderingCancelledException') {
      console.error('Canvas rendering error:', error)
    }
  }
}

watch(
  () => [props.page, props.scale, props.rotation],
  async () => {
    await nextTick()
    render()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (renderTask) {
    renderTask.cancel()
    renderTask = null
  }
})

defineExpose({
  render,
})
</script>

<style scoped>
.npk-layer-canvas {
  display: block;
  image-rendering: optimizeQuality;
}
</style>
