<template>
  <div
    class="npk-pdf-page"
    :data-page-number="pageNumber"
    :style="pageStyle"
  >
    <div
      ref="pageContentRef"
      class="npk-page-content"
    >
      <!-- Canvas Layer -->
      <LayerCanvas
        ref="canvasLayerRef"
        :page="page"
        :scale="scale"
        :rotation="rotation"
      />

      <!-- Text Layer -->
      <LayerText
        v-if="textLayer"
        ref="textLayerRef"
        :page="page"
        :scale="scale"
        :rotation="rotation"
        :search-query="searchQuery"
        :case-sensitive="caseSensitive"
        :page-number="pageNumber"
        :current-match-page="currentMatchPage"
        :current-match-index-in-page="currentMatchIndexInPage"
      />

      <!-- Annotation Layer -->
      <LayerAnnotation
        ref="annotationLayerRef"
        :page="page"
        :scale="scale"
        :rotation="rotation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed, watch, onMounted } from 'vue'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api'
import LayerCanvas from './layers/LayerCanvas.vue'
import LayerText from './layers/LayerText.vue'
import LayerAnnotation from './layers/LayerAnnotation.vue'

interface Props {
  pageNumber: number
  doc: PDFDocumentProxy | null
  scale?: number
  rotation?: number
  textLayer?: boolean
  searchQuery?: string
  caseSensitive?: boolean
  currentMatchPage?: number
  currentMatchIndexInPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  scale: 1.0,
  rotation: 0,
  textLayer: true,
  searchQuery: '',
  caseSensitive: false,
  currentMatchPage: -1,
  currentMatchIndexInPage: -1,
})

// Use shallowRef to prevent Vue from making PDF.js objects deeply reactive
// This avoids "Cannot read private member" errors with PDF.js internal fields
const page = shallowRef<PDFPageProxy | null>(null)
const pageContentRef = shallowRef<HTMLDivElement | null>(null)
const canvasLayerRef = shallowRef<InstanceType<typeof LayerCanvas> | null>(null)
const textLayerRef = shallowRef<InstanceType<typeof LayerText> | null>(null)
const annotationLayerRef = shallowRef<InstanceType<typeof LayerAnnotation> | null>(null)

const pageStyle = computed(() => {
  if (!page.value) return {}

  const viewport = page.value.getViewport({
    scale: props.scale,
    rotation: props.rotation,
  })

  return {
    width: `${viewport.width}px`,
    height: `${viewport.height}px`,
  }
})

const loadPage = async () => {
  if (!props.doc) return

  try {
    const rawPage = await props.doc.getPage(props.pageNumber)
    // shallowRef prevents Vue from making the PDF.js object deeply reactive
    // This avoids "Cannot read private member" errors with PDF.js internal fields
    page.value = rawPage
  }
  catch (error) {
    console.error(`Error loading page ${props.pageNumber}:`, error)
  }
}

watch(
  () => [props.doc, props.pageNumber],
  () => {
    loadPage()
  },
  { immediate: true },
)

onMounted(() => {
  loadPage()
})

defineExpose({
  page,
  canvasLayerRef,
  textLayerRef,
  annotationLayerRef,
})
</script>

<style scoped>
.npk-pdf-page {
  position: relative;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.dark .npk-pdf-page {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5);
}

.npk-page-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
