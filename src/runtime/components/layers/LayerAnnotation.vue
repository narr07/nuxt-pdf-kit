<template>
  <div
    ref="annotationLayerRef"
    class="npk-layer-annotation"
    :style="annotationLayerStyle"
  />
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api'

const props = defineProps<{
  page: PDFPageProxy | null
  scale: number
  rotation: number
}>()

const annotationLayerRef = ref<HTMLDivElement | null>(null)
const annotationLayerStyle = ref<Record<string, string>>({})

const render = async () => {
  if (!props.page || !annotationLayerRef.value) return

  const annotationLayer = annotationLayerRef.value
  annotationLayer.innerHTML = ''

  const viewport = props.page.getViewport({
    scale: props.scale,
    rotation: props.rotation,
  })

  annotationLayerStyle.value = {
    width: `${viewport.width}px`,
    height: `${viewport.height}px`,
  }

  try {
    const annotations = await props.page.getAnnotations()

    if (annotations.length === 0) return

    // Render annotations (simplified version)
    // Full implementation would use AnnotationLayer from PDF.js
    for (const annotation of annotations) {
      if (annotation.subtype === 'Link' && annotation.url) {
        const link = document.createElement('a')
        link.href = annotation.url
        link.target = '_blank'
        link.className = 'npk-annotation-link'

        // Position the link
        const rect = annotation.rect
        const [x1, y1, x2, y2] = rect
        link.style.cssText = `
          left: ${Math.min(x1, x2)}px;
          top: ${Math.min(y1, y2)}px;
          width: ${Math.abs(x2 - x1)}px;
          height: ${Math.abs(y2 - y1)}px;
        `

        annotationLayer.appendChild(link)
      }
    }
  }
  catch (error) {
    console.error('Annotation layer rendering error:', error)
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

defineExpose({
  render,
})
</script>

<style scoped>
.npk-layer-annotation {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}

.npk-layer-annotation :deep(.npk-annotation-link) {
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
  background-color: rgb(250 204 21 / 0.1);
  border: 1px solid rgb(250 204 21 / 0.3);
}

.npk-layer-annotation :deep(.npk-annotation-link):hover {
  background-color: rgb(250 204 21 / 0.2);
}
</style>
