<template>
  <div
    class="npk-thumbnail-sidebar"
    :class="{ 'npk-thumbnail-sidebar--open': isOpen }"
  >
    <div
      v-if="isOpen"
      class="flex flex-col h-full shadow-xl bg-default border-default"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-default">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-squares-2x2"
            class="w-5 h-5 text-primary"
          />
          <h3 class="text-sm font-semibold text-highlighted">
            Thumbnails
          </h3>
        </div>
        <UButton
          icon="i-heroicons-x-mark"
          color="primary"
          variant="ghost"
          size="sm"
          @click="$emit('close')"
        />
      </div>

      <!-- Thumbnail List -->
      <div
        ref="listRef"
        class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[var(--ui-border-accented)]"
      >
        <div
          v-for="pageNum in pages"
          :key="pageNum"
          class="npk-thumbnail-item group"
          :class="{ 'npk-thumbnail-item--active': pageNum === currentPage }"
          :data-page="pageNum"
          @click="$emit('page-change', pageNum)"
        >
          <div class="npk-thumbnail-box bg-elevated border border-default">
            <canvas
              :ref="el => setCanvasRef(el, pageNum)"
              class="npk-thumbnail-canvas"
            />

            <!-- Hover Overlay -->
            <div class="npk-thumbnail-overlay">
              <span class="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full">
                PAGE {{ pageNum }}
              </span>
            </div>
          </div>
          <div
            class="npk-thumbnail-page-num text-muted"
            :class="{ 'text-primary font-bold': pageNum === currentPage }"
          >
            {{ pageNum }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

interface Props {
  pdfDoc: PDFDocumentProxy | null
  currentPage?: number
  isOpen?: boolean
  isDark?: boolean
  thumbnailWidth?: number
}

interface Emits {
  (e: 'page-change', page: number): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  isOpen: false,
  isDark: false,
  thumbnailWidth: 150,
})

const _emit = defineEmits<Emits>()

const listRef = ref<HTMLDivElement | null>(null)
const canvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map())
const renderedPages = ref<Set<number>>(new Set())
const pages = ref<number[]>([])

const setCanvasRef = (el: unknown, pageNum: number) => {
  if (el && el instanceof HTMLCanvasElement) {
    canvasRefs.value.set(pageNum, el)
  }
  else {
    canvasRefs.value.delete(pageNum)
  }
}

watch(() => props.pdfDoc, async (doc) => {
  if (doc) {
    pages.value = Array.from({ length: doc.numPages }, (_, i) => i + 1)
    renderedPages.value.clear()
    canvasRefs.value.clear()
  }
}, { immediate: true })

const renderThumbnail = async (pageNum: number) => {
  if (!props.pdfDoc || renderedPages.value.has(pageNum)) return

  const canvas = canvasRefs.value.get(pageNum)
  if (!canvas) return

  renderedPages.value.add(pageNum)

  try {
    const page = await props.pdfDoc.getPage(pageNum)
    // Get viewport with explicit rotation 0 for thumbnails
    const viewport = page.getViewport({ scale: 1.0, rotation: 0 })
    const scale = props.thumbnailWidth / viewport.width
    const scaledViewport = page.getViewport({ scale, rotation: 0 })

    const devicePixelRatio = window.devicePixelRatio || 1
    canvas.width = scaledViewport.width * devicePixelRatio
    canvas.height = scaledViewport.height * devicePixelRatio
    canvas.style.width = `${scaledViewport.width}px`
    canvas.style.height = `${scaledViewport.height}px`

    const context = canvas.getContext('2d')
    if (!context) {
      renderedPages.value.delete(pageNum)
      return
    }

    context.scale(devicePixelRatio, devicePixelRatio)

    await page.render({
      canvasContext: context,
      viewport: scaledViewport,
      canvas: canvas,
    }).promise
  }
  catch (error) {
    renderedPages.value.delete(pageNum)
    console.error(`Error rendering thumbnail for page ${pageNum}:`, error)
  }
}

let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNum = Number.parseInt(entry.target.getAttribute('data-page') || '0', 10)
          if (pageNum > 0) {
            renderThumbnail(pageNum)
          }
        }
      })
    },
    {
      root: listRef.value,
      rootMargin: '200px 0px',
      threshold: 0,
    },
  )

  if (listRef.value) {
    const items = listRef.value.querySelectorAll('.npk-thumbnail-item')
    items.forEach((item) => {
      observer?.observe(item)
    })
  }
}

const renderVisibleThumbnails = async () => {
  if (!listRef.value || !props.pdfDoc) return

  const container = listRef.value
  const containerTop = container.scrollTop
  const containerBottom = containerTop + container.clientHeight
  const itemHeight = 200
  const buffer = 5

  const firstVisible = Math.max(1, Math.floor(containerTop / itemHeight) - buffer)
  const lastVisible = Math.min(pages.value.length, Math.ceil(containerBottom / itemHeight) + buffer)

  for (let i = firstVisible; i <= lastVisible; i++) {
    await renderThumbnail(i)
  }
}

const scrollToActiveThumbnail = () => {
  if (!listRef.value) return
  // Find active item by data-page attribute
  const items = listRef.value.querySelectorAll('.npk-thumbnail-item')
  const active = Array.from(items).find(item => item.getAttribute('data-page') === props.currentPage?.toString())
  if (active) {
    active.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

watch(() => props.currentPage, () => {
  if (props.isOpen) {
    scrollToActiveThumbnail()
  }
})

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    renderedPages.value.clear()
    canvasRefs.value.clear()
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    setupObserver()
    await renderVisibleThumbnails()
    scrollToActiveThumbnail()
  }
  else {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }
})

let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const handleScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(renderVisibleThumbnails, 100)
}

onMounted(() => {
  if (listRef.value) {
    listRef.value.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  if (listRef.value) {
    listRef.value.removeEventListener('scroll', handleScroll)
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped>
.npk-thumbnail-sidebar {
  width: 0;
  overflow: hidden;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.npk-thumbnail-sidebar--open {
  width: 240px;
}

.npk-thumbnail-item {
  cursor: pointer;
  transition: transform 200ms ease;
}

.npk-thumbnail-item:hover {
  transform: translateY(-2px);
}

.npk-thumbnail-box {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
  transition: all 200ms;
}

.npk-thumbnail-item--active .npk-thumbnail-box {
  border-color: var(--ui-primary);
  box-shadow: 0 0 0 2px var(--ui-primary-20);
}

.npk-thumbnail-canvas {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 0.125rem;
}

.npk-thumbnail-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 0.1);
  opacity: 0;
  transition: opacity 200ms;
}

.npk-thumbnail-item:hover .npk-thumbnail-overlay {
  opacity: 1;
}

.npk-thumbnail-page-num {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  transition: color 200ms;
}

.npk-thumbnail-item:hover .npk-thumbnail-page-num {
  color: var(--ui-primary);
}
</style>
