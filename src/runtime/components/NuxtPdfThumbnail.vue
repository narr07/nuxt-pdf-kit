<template>
  <div
    class="npk-thumbnail"
    :class="{ 'npk-thumbnail--active': isActive }"
    @click="handleClick"
  >
    <div class="npk-thumbnail__preview">
      <canvas
        ref="thumbnailCanvasRef"
        class="npk-thumbnail__canvas"
      />
    </div>
    <div class="npk-thumbnail__label">
      {{ pageNumber }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

// Use inferred type from getPage to avoid strict type mismatches
type PDFPage = Awaited<ReturnType<PDFDocumentProxy['getPage']>>

interface Props {
  page: PDFPage | null
  pageNumber: number
  isActive?: boolean
  maxWidth?: number
}

interface Emits {
  (e: 'click', pageNumber: number): void
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  maxWidth: 150,
})

const emit = defineEmits<Emits>()

const thumbnailCanvasRef = ref<HTMLCanvasElement | null>(null)

const renderThumbnail = async () => {
  if (!props.page || !thumbnailCanvasRef.value) return

  const canvas = thumbnailCanvasRef.value
  const context = canvas.getContext('2d')
  if (!context) return

  // Get viewport at a smaller scale for thumbnail
  const viewport = props.page.getViewport({ scale: 1.0 })
  const scale = props.maxWidth / viewport.width
  const thumbnailViewport = props.page.getViewport({ scale })

  canvas.width = thumbnailViewport.width
  canvas.height = thumbnailViewport.height

  try {
    await props.page.render({
      canvasContext: context,
      viewport: thumbnailViewport,
      canvas: canvas,
    }).promise
  }
  catch (error) {
    console.error(`Error rendering thumbnail for page ${props.pageNumber}:`, error)
  }
}

const handleClick = () => {
  emit('click', props.pageNumber)
}

watch(() => props.page, () => {
  renderThumbnail()
}, { immediate: true })

onMounted(() => {
  renderThumbnail()
})
</script>

<style scoped>
.npk-thumbnail {
  margin-bottom: 0.75rem;
  cursor: pointer;
  border-width: 2px;
  border-color: transparent;
  border-radius: 0.375rem;
  padding: 0.5rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.npk-thumbnail:hover {
  background-color: color-mix(in srgb, var(--ui-primary) 10%, transparent);
}

.npk-thumbnail--active {
  border-color: var(--ui-primary);
  background-color: color-mix(in srgb, var(--ui-primary) 15%, transparent);
}

.npk-thumbnail__preview {
  position: relative;
  background-color: var(--ui-bg);
  border-width: 1px;
  border-color: var(--ui-border);
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  overflow: hidden;
}

.npk-thumbnail__canvas {
  display: block;
  width: 100%;
  height: auto;
}

.npk-thumbnail__label {
  margin-top: 0.375rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--ui-text-muted);
}

.npk-thumbnail--active .npk-thumbnail__label {
  color: var(--ui-primary);
  font-weight: 500;
}
</style>
