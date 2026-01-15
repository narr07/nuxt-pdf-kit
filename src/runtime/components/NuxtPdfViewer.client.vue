<template>
  <div
    ref="containerRef"
    class="npk-viewer"
    :data-theme="isDark ? 'dark' : 'light'"
  >
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center h-full gap-4 bg-gray-50 dark:bg-gray-900"
    >
      <slot name="loader">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 text-primary animate-spin"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">Loading PDF...</span>
      </slot>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center h-full gap-3 bg-gray-50 dark:bg-gray-900"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle"
        class="w-12 h-12 text-error"
      />
      <span class="text-sm text-error font-medium">{{ error }}</span>
    </div>

    <!-- Main Viewer -->
    <div
      v-else
      class="npk-container"
    >
      <!-- Toolbar -->
      <div
        class="npk-toolbar flex items-center justify-between px-2 h-12 border-b bg-default border-default"
      >
        <!-- Mobile Layout (< 1024px) -->
        <div class="npk-toolbar-mobile items-center justify-between w-full">
          <!-- Left: Menu Button -->
          <UDropdownMenu
            :items="mobileMenuItems"
            :portal="!isFullscreen"
          >
            <UButton
              icon="i-heroicons-bars-3"
              color="primary"
              variant="ghost"
            />
          </UDropdownMenu>

          <!-- Center: Page Navigation -->
          <div
            v-if="toolbarConfig.pageNavigation"
            class="flex items-center gap-1"
          >
            <UButton
              icon="i-heroicons-chevron-left"
              color="primary"
              variant="ghost"
              size="sm"
              :disabled="currentPage <= 1"
              @click="prevPage"
            />
            <span class="text-sm whitespace-nowrap font-medium text-highlighted">
              {{ currentPage }} / {{ pages.length }}
            </span>
            <UButton
              icon="i-heroicons-chevron-right"
              color="primary"
              variant="ghost"
              size="sm"
              :disabled="currentPage >= pages.length"
              @click="nextPage"
            />
          </div>

          <!-- Right: Search & More -->
          <div
            v-if="toolbarConfig.search"
            class="flex items-center gap-1"
          >
            <ToolSearch
              :search-query="searchQuery"
              :current-match-index="currentSearchMatch"
              :total-matches="searchMatches.length"
              :has-matches="searchMatches.length > 0"
              :is-searching="isSearching"
              :case-sensitive="searchCaseSensitive"
              :whole-words="searchWholeWords"
              :is-dark="isDark"
              :is-fullscreen="isFullscreen"
              @search="handleSearch"
              @next-match="handleNextMatch"
              @prev-match="handlePrevMatch"
              @clear="handleClearSearch"
              @toggle-case-sensitive="handleToggleCaseSensitive"
              @toggle-whole-words="handleToggleWholeWords"
            />
          </div>
        </div>

        <!-- Desktop Layout (>= 1024px) -->
        <!-- Left Section -->
        <div class="npk-toolbar-desktop items-center gap-1">
          <!-- Thumbnail Toggle -->
          <slot
            v-if="toolbarConfig.sidebar"
            name="thumbnail-tool"
          >
            <UButton
              :icon="sidebarVisible ? 'i-heroicons-book-open-solid' : 'i-heroicons-book-open'"
              color="primary"
              variant="ghost"
              :title="t('toggleSidebar')"
              :active="sidebarVisible"
              @click="toggleSidebar"
            />
          </slot>

          <div
            v-if="toolbarConfig.sidebar && toolbarConfig.pageNavigation"
            class="w-px h-6 mx-1 bg-border"
          />

          <!-- Page Navigation -->
          <slot
            v-if="toolbarConfig.pageNavigation"
            name="page-navigation-tool"
          >
            <div class="flex items-center gap-1">
              <UButton
                icon="i-heroicons-chevron-left"
                color="primary"
                variant="ghost"
                :disabled="currentPage <= 1"
                :title="t('prevPage')"
                @click="prevPage"
              />
              <UInput
                type="number"
                size="sm"
                class="w-16"
                :model-value="currentPage"
                min="1"
                :max="pages.length"
                @update:model-value="onPageInputUpdate"
                @keydown.enter="onPageInputEnter"
              />
              <span class="text-sm whitespace-nowrap px-1 font-medium text-highlighted">
                / {{ pages.length }}
              </span>
              <UButton
                icon="i-heroicons-chevron-right"
                color="primary"
                variant="ghost"
                :disabled="currentPage >= pages.length"
                :title="t('nextPage')"
                @click="nextPage"
              />
            </div>
          </slot>
        </div>

        <!-- Center Section (Desktop only) -->
        <div class="npk-toolbar-desktop items-center gap-1">
          <!-- Search Tool -->
          <ToolSearch
            v-if="toolbarConfig.search"
            :search-query="searchQuery"
            :current-match-index="currentSearchMatch"
            :total-matches="searchMatches.length"
            :has-matches="searchMatches.length > 0"
            :is-searching="isSearching"
            :case-sensitive="searchCaseSensitive"
            :whole-words="searchWholeWords"
            :is-dark="isDark"
            :is-fullscreen="isFullscreen"
            @search="handleSearch"
            @next-match="handleNextMatch"
            @prev-match="handlePrevMatch"
            @clear="handleClearSearch"
            @toggle-case-sensitive="handleToggleCaseSensitive"
            @toggle-whole-words="handleToggleWholeWords"
          />

          <div
            v-if="toolbarConfig.search && toolbarConfig.zoom"
            class="w-px h-6 mx-1 bg-border"
          />

          <!-- Zoom Controls -->
          <slot
            v-if="toolbarConfig.zoom"
            name="zoom-tool"
          >
            <ToolZoom
              :scale="scale"
              :zoom-mode="zoomMode"
              :min-scale="0.25"
              :max-scale="10.0"
              :container-width="containerWidth"
              :container-height="containerHeight"
              :page-width="pageWidth"
              :page-height="pageHeight"
              :is-dark="isDark"
              :is-fullscreen="isFullscreen"
              @update:scale="handleScaleUpdate"
              @update:zoom-mode="handleZoomModeUpdate"
              @zoom-in="zoomIn"
              @zoom-out="zoomOut"
            />
          </slot>

          <div
            v-if="toolbarConfig.zoom && toolbarConfig.rotate"
            class="w-px h-6 mx-1 bg-border"
          />

          <!-- Rotate -->
          <UButton
            v-if="toolbarConfig.rotate"
            icon="i-heroicons-arrow-path"
            color="primary"
            variant="ghost"
            :title="t('rotateClockwise')"
            @click="rotateRight"
          />
        </div>

        <!-- Right Section (Desktop only) -->
        <div class="npk-toolbar-desktop items-center gap-1">
          <!-- Open File -->
          <UButton
            v-if="toolbarConfig.openFile"
            icon="i-heroicons-folder-open"
            color="primary"
            variant="ghost"
            :title="t('openFile')"
            @click="openFile"
          />
          <input
            ref="fileInput"
            type="file"
            accept=".pdf"
            style="display: none"
            @change="onFileChange"
          >

          <!-- Print -->
          <UButton
            v-if="toolbarConfig.print"
            icon="i-heroicons-printer"
            color="primary"
            variant="ghost"
            :title="t('print')"
            @click="printFile"
          />

          <!-- Download -->
          <UButton
            v-if="toolbarConfig.download"
            icon="i-heroicons-arrow-down-tray"
            color="primary"
            variant="ghost"
            :title="t('download')"
            @click="downloadFile"
          />

          <div
            v-if="(toolbarConfig.openFile || toolbarConfig.print || toolbarConfig.download) && (toolbarConfig.themeToggle || toolbarConfig.fullscreen || toolbarConfig.moreOptions)"
            class="w-px h-6 mx-1 bg-border"
          />

          <!-- Theme Toggle -->
          <UButton
            v-if="toolbarConfig.themeToggle"
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            color="primary"
            variant="ghost"
            :title="t('toggleTheme')"
            @click="toggleTheme"
          />

          <!-- Fullscreen -->
          <UButton
            v-if="toolbarConfig.fullscreen"
            :icon="isFullscreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
            color="primary"
            variant="ghost"
            :title="isFullscreen ? t('exitFullscreen') : t('fullscreen')"
            @click="toggleFullscreen"
          />

          <!-- More Options Menu -->
          <UDropdownMenu
            v-if="toolbarConfig.moreOptions"
            :items="moreOptionsItems"
            :portal="!isFullscreen"
          >
            <UButton
              icon="i-heroicons-ellipsis-horizontal"
              color="primary"
              variant="ghost"
            />
          </UDropdownMenu>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="npk-main">
        <!-- Sidebar with Thumbnails -->
        <NuxtPdfThumbnails
          :pdf-doc="pdfDoc"
          :current-page="currentPage"
          :is-open="sidebarVisible"
          :is-dark="isDark"
          @page-change="goToPageAndScroll"
          @close="toggleSidebar"
        />

        <!-- PDF Content -->
        <div
          ref="contentRef"
          class="npk-content"
          :class="[
            `npk-content--view-${viewMode}`,
            `npk-content--scroll-${scrollMode}`,
            { 'npk-content--with-sidebar': sidebarVisible },
            { 'npk-content--virtual': useVirtualScrolling },
          ]"
        >
          <!-- Virtual scroll spacer for total height -->
          <div
            v-if="useVirtualScrolling"
            class="npk-virtual-spacer"
            :style="{ height: `${virtualScrollState.totalHeight.value}px` }"
          />

          <!-- Pages container with offset for virtual scrolling -->
          <div
            class="npk-pages"
            :class="`npk-pages--${scrollMode}`"
            :style="useVirtualScrolling ? { transform: `translateY(${virtualScrollState.offsetTop.value}px)` } : {}"
          >
            <NuxtPdfPage
              v-for="pageNum in visiblePages"
              :key="pageNum"
              :page-number="pageNum"
              :doc="pdfDoc"
              :scale="scale"
              :rotation="rotation"
              :search-query="searchQuery"
              :case-sensitive="searchCaseSensitive"
              :current-match-page="currentMatchPage"
              :current-match-index-in-page="currentMatchIndexInPage"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden Print Container -->
    <div
      v-if="isPrinting"
      ref="printContainerRef"
      class="npk-print-container"
    >
      <NuxtPdfPage
        v-for="pageNum in pages"
        :key="`print-${pageNum}`"
        :page-number="pageNum"
        :doc="pdfDoc"
        :scale="1.5"
        :rotation="rotation"
        class="npk-print-page"
      />
    </div>

    <!-- Document Properties Modal -->
    <UModal
      v-model:open="showDocumentProperties"
      :portal="!isFullscreen"
    >
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">
                Document Properties
              </h3>
              <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="showDocumentProperties = false"
              />
            </div>
          </template>

          <div
            v-if="documentProperties"
            class="space-y-3 text-sm"
          >
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Title:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.title }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Author:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.author }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Subject:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.subject }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Keywords:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.keywords }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Creator:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.creator }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Producer:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.producer }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Created:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.creationDate }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Modified:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.modDate }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 dark:text-gray-400">Pages:</span>
              <span class="col-span-2 font-medium">{{ documentProperties.pageCount }}</span>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UButton
                label="Close"
                color="neutral"
                variant="soft"
                @click="showDocumentProperties = false"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useFullscreen, useLocalStorage, onKeyStroke, useDevicePixelRatio, useElementSize, useDebounceFn } from '@vueuse/core'
import { useRuntimeConfig, useColorMode } from '#imports'
import type * as PDFJS from 'pdfjs-dist'
import { usePdfKitViewMode } from '../composables/usePdfKitViewMode'
import { usePdfKitSearch } from '../composables/usePdfKitSearch'
import { usePdfKitZoom, type ZoomLevel } from '../composables/usePdfKitZoom'
import { usePdfKitProvider } from '../composables/usePdfKitProvider'
import type { PdfProvider, ProviderConfig } from '../types'
import ToolSearch from './tools/ToolSearch.vue'
import ToolZoom from './tools/ToolZoom.vue'
import NuxtPdfThumbnails from './NuxtPdfThumbnails.client.vue'
import NuxtPdfPage from './NuxtPdfPage.client.vue'
import { usePdfKitVirtualScroll } from '../composables/usePdfKitVirtualScroll'

// Toolbar options interface
interface ToolbarOptions {
  sidebar?: boolean
  pageNavigation?: boolean
  zoom?: boolean
  search?: boolean
  rotate?: boolean
  openFile?: boolean
  print?: boolean
  download?: boolean
  fullscreen?: boolean
  themeToggle?: boolean
  moreOptions?: boolean
}

/** Document properties that can be overridden via props */
interface DocumentPropertiesOptions {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
}

interface Props {
  src: string
  /** Provider type for file source */
  provider?: PdfProvider
  /** Provider-specific configuration */
  providerConfig?: ProviderConfig
  theme?: 'light' | 'dark'
  initialViewMode?: 'single' | 'dual' | 'dual-cover'
  initialScrollMode?: 'vertical' | 'horizontal' | 'wrapped' | 'page'
  /** Enable virtual scrolling for large documents */
  virtualScroll?: boolean
  /** Threshold of pages to enable virtual scrolling automatically */
  virtualScrollThreshold?: number
  /** Enable responsive mode - auto fit page width to container */
  responsive?: boolean
  /** Toolbar options - override module config */
  toolbar?: ToolbarOptions
  /** Document title - overrides PDF metadata */
  title?: string
  /** Document author - overrides PDF metadata */
  author?: string
  /** Document subject - overrides PDF metadata */
  subject?: string
  /** Document keywords - overrides PDF metadata */
  keywords?: string
  /** Document creator - overrides PDF metadata */
  creator?: string
  /** Document producer - overrides PDF metadata */
  producer?: string
  /** Document properties object - alternative to individual props */
  documentInfo?: DocumentPropertiesOptions
}

const props = withDefaults(defineProps<Props>(), {
  provider: 'url',
  theme: 'light',
  initialViewMode: 'single',
  initialScrollMode: 'vertical',
  virtualScroll: true,
  virtualScrollThreshold: 10,
  responsive: true,
})

// Get toolbar config from runtime config (module options)
const runtimeConfig = useRuntimeConfig()
const moduleToolbarConfig = (runtimeConfig.public.pdfKit as { toolbar?: ToolbarOptions } | undefined)?.toolbar || {}

// Merge: module config -> props (props override module config)
const toolbarConfig = computed<ToolbarOptions>(() => ({
  sidebar: props.toolbar?.sidebar ?? moduleToolbarConfig.sidebar ?? true,
  pageNavigation: props.toolbar?.pageNavigation ?? moduleToolbarConfig.pageNavigation ?? true,
  zoom: props.toolbar?.zoom ?? moduleToolbarConfig.zoom ?? true,
  search: props.toolbar?.search ?? moduleToolbarConfig.search ?? true,
  rotate: props.toolbar?.rotate ?? moduleToolbarConfig.rotate ?? true,
  openFile: props.toolbar?.openFile ?? moduleToolbarConfig.openFile ?? false,
  print: props.toolbar?.print ?? moduleToolbarConfig.print ?? true,
  download: props.toolbar?.download ?? moduleToolbarConfig.download ?? true,
  fullscreen: props.toolbar?.fullscreen ?? moduleToolbarConfig.fullscreen ?? true,
  themeToggle: props.toolbar?.themeToggle ?? moduleToolbarConfig.themeToggle ?? true,
  moreOptions: props.toolbar?.moreOptions ?? moduleToolbarConfig.moreOptions ?? true,
}))

// Transform src based on provider
const transformedSrc = computed(() => {
  return usePdfKitProvider(
    props.provider,
    props.src,
    props.providerConfig,
  )
})

// State
const loading = ref(true)
const error = ref<string | null>(null)
const pdfDoc = shallowRef<PDFJS.PDFDocumentProxy | null>(null)
const pages = ref<number[]>([])
const currentPage = ref(1)
const rotation = ref(0)
const isPrinting = ref(false)
const printContainerRef = ref<HTMLDivElement | null>(null)

// Document Properties Modal
const showDocumentProperties = ref(false)
const documentProperties = ref<{
  title: string
  author: string
  subject: string
  keywords: string
  creator: string
  producer: string
  creationDate: string
  modDate: string
  pageCount: number
  fileSize: string
  pdfVersion: string
} | null>(null)

// Helper: Get default title from filename
const getDefaultTitleFromSrc = (src: string): string => {
  try {
    const url = new URL(src, window.location.origin)
    const pathname = url.pathname
    const filename = pathname.split('/').pop() || ''
    // Remove .pdf extension and decode URI
    const nameWithoutExt = decodeURIComponent(filename.replace(/\\.pdf$/i, ''))
    // Convert kebab-case or snake_case to Title Case
    return nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\\b\\w/g, c => c.toUpperCase())
      .trim() || 'PDF Document'
  }
  catch {
    return 'PDF Document'
  }
}

// Helper: Format PDF date
const formatPdfDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  try {
    // PDF date format: D:YYYYMMDDHHmmSS
    if (dateStr.startsWith('D:')) {
      const year = dateStr.slice(2, 6)
      const month = dateStr.slice(6, 8)
      const day = dateStr.slice(8, 10)
      const hour = dateStr.slice(10, 12) || '00'
      const minute = dateStr.slice(12, 14) || '00'
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
    return new Date(dateStr).toLocaleString()
  }
  catch {
    return dateStr
  }
}

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)

// VueUse: Fullscreen
const { isFullscreen, toggle: toggleFullscreenFn } = useFullscreen(containerRef)

// Nuxt Color Mode - sync with global color mode
const colorMode = useColorMode()

// VueUse: Local Storage for preferences
const storedSidebarVisible = useLocalStorage('npk-sidebar-visible', false)
const storedZoomLevel = useLocalStorage('npk-zoom-level', 1.0)

// VueUse: Device Pixel Ratio for HiDPI rendering
const { pixelRatio: _pixelRatio } = useDevicePixelRatio()

// VueUse: Element size for responsive handling
const { width: containerWidth, height: containerHeight } = useElementSize(containerRef)

// UI State with persistence
const sidebarVisible = ref(storedSidebarVisible.value)
const menuVisible = ref(false)

// View & Scroll Mode
const {
  viewMode,
  scrollMode,
  setViewMode,
  setScrollMode,
  getVisiblePages,
} = usePdfKitViewMode({
  initialViewMode: props.initialViewMode,
  initialScrollMode: props.initialScrollMode,
})

// Zoom
const {
  scale,
  zoomMode,
  zoomIn,
  zoomOut,
  setZoom,
} = usePdfKitZoom({
  initialScale: 1.0,
})

// Search
const {
  searchQuery,
  matches: searchMatches,
  currentMatchIndex: currentSearchMatch,
  isSearching,
  searchOptions,
  search: performSearch,
  nextMatch,
  prevMatch,
  clearSearch,
  toggleCaseSensitive,
  toggleWholeWords,
} = usePdfKitSearch()

const searchCaseSensitive = computed(() => searchOptions.value.caseSensitive || false)
const searchWholeWords = computed(() => searchOptions.value.wholeWords || false)

// Compute current match page and index within that page for highlighting
const currentMatchPage = computed(() => {
  if (currentSearchMatch.value < 0 || !searchMatches.value.length) return -1
  const match = searchMatches.value[currentSearchMatch.value]
  return match ? match.pageIndex + 1 : -1 // Convert to 1-based page number
})

const currentMatchIndexInPage = computed(() => {
  if (currentSearchMatch.value < 0 || !searchMatches.value.length) return -1
  const match = searchMatches.value[currentSearchMatch.value]
  if (!match) return -1

  // Count how many matches are on the same page before this one
  let indexInPage = 0
  for (let i = 0; i < currentSearchMatch.value; i++) {
    const prevMatch = searchMatches.value[i]
    if (prevMatch && prevMatch.pageIndex === match.pageIndex) {
      indexInPage++
    }
  }
  return indexInPage
})

const t = (key: string) => {
  const translations: Record<string, string> = {
    toggleSidebar: 'Toggle sidebar',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    rotateClockwise: 'Rotate clockwise',
    openFile: 'Open file',
    print: 'Print',
    download: 'Download',
    toggleTheme: 'Toggle theme',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    moreOptions: 'More options',
  }
  return translations[key] || key
}

// Computed
const isDark = computed(() => colorMode.value === 'dark')

// Page dimensions (default A4 page: 612 x 792 points)
const pageWidth = ref(612)
const pageHeight = ref(792)

// Update page dimensions when first page loads
watch(pdfDoc, async (doc) => {
  if (doc) {
    try {
      const firstPage = await doc.getPage(1)
      const viewport = firstPage.getViewport({ scale: 1.0 })
      pageWidth.value = viewport.width
      pageHeight.value = viewport.height

      // Apply initial responsive fit if enabled
      if (props.responsive) {
        applyResponsiveFit()
      }
    }
    catch (e) {
      console.warn('Could not get page dimensions', e)
    }
  }
})

// Responsive: Auto-fit page width to container
const applyResponsiveFit = () => {
  if (!props.responsive || !containerWidth.value || !pageWidth.value) return

  const padding = 40 // padding around the page
  const sidebarWidth = sidebarVisible.value ? 200 : 0
  const availableWidth = containerWidth.value - sidebarWidth - padding

  // Calculate scale to fit page width
  const fitScale = availableWidth / pageWidth.value

  // Clamp scale between 0.25 and 10
  const newScale = Math.max(0.25, Math.min(10, fitScale))

  // Only update if significantly different (avoid jitter)
  if (Math.abs(scale.value - newScale) > 0.01) {
    setZoom(newScale)
  }
}

// Watch container width for responsive resizing
const debouncedResponsiveFit = useDebounceFn(applyResponsiveFit, 150)

watch(containerWidth, () => {
  if (props.responsive && pdfDoc.value) {
    debouncedResponsiveFit()
  }
})

// Watch sidebar visibility for responsive resizing
watch(sidebarVisible, () => {
  if (props.responsive && pdfDoc.value) {
    // Small delay to let sidebar animation complete
    setTimeout(applyResponsiveFit, 200)
  }
})

// Estimated page height for virtual scrolling (will be refined)
const estimatedPageHeight = computed(() => {
  // Use actual page height if available
  return Math.round(pageHeight.value * scale.value) + 16 // +16 for margin
})

// Check if virtual scrolling should be enabled
const useVirtualScrolling = computed(() => {
  return props.virtualScroll && pages.value.length >= props.virtualScrollThreshold
})

// Virtual scroll composable (only used when virtual scrolling is enabled)
const virtualScrollState = usePdfKitVirtualScroll({
  totalItems: computed(() => pages.value.length),
  itemHeight: estimatedPageHeight,
  overscan: 2,
  containerRef: contentRef,
})

// Visible pages - uses virtual scrolling for large documents
const visiblePages = computed(() => {
  if (!pdfDoc.value) return []

  // Use virtual scrolling for large documents
  if (useVirtualScrolling.value) {
    return virtualScrollState.visibleItems.value
  }

  // For vertical/horizontal/wrapped scroll modes, show all pages (user can scroll)
  if (scrollMode.value === 'vertical' || scrollMode.value === 'horizontal' || scrollMode.value === 'wrapped') {
    return pages.value
  }

  // For "page" scroll mode or single/dual view, show specific pages
  return getVisiblePages(currentPage.value, pages.value.length)
})

// Sync current page with virtual scroll position
watch(() => virtualScrollState.currentVisiblePage.value, (newPage) => {
  if (useVirtualScrolling.value && newPage !== currentPage.value) {
    currentPage.value = newPage
  }
})

// Scroll to page when currentPage changes
const scrollToPage = (pageNum: number) => {
  if (!contentRef.value) return

  // Find the page element
  const pageElement = contentRef.value.querySelector(`[data-page-number="${pageNum}"]`) as HTMLElement
  if (pageElement) {
    // Calculate scroll position relative to container
    const containerRect = contentRef.value.getBoundingClientRect()
    const pageRect = pageElement.getBoundingClientRect()
    const scrollTop = contentRef.value.scrollTop + (pageRect.top - containerRect.top) - 20 // 20px padding

    contentRef.value.scrollTo({
      top: scrollTop,
      behavior: 'smooth',
    })
  }
}

// NOTE: We do NOT watch currentPage for auto-scroll anymore
// Scroll only happens when explicitly called via goToPageAndScroll

// More options dropdown items for Nuxt UI v3
const moreOptionsItems = computed(() => [
  [
    {
      label: 'Single page',
      icon: 'i-heroicons-square-2-stack',
      color: 'primary',
      type: 'checkbox' as const,
      checked: viewMode.value === 'single',
      onSelect: (e: Event) => {
        e.preventDefault()
        handleMenuAction('view-single')
      },
    },
    {
      label: 'Dual page',
      icon: 'i-heroicons-squares-2x2',
      color: 'primary',
      type: 'checkbox' as const,
      checked: viewMode.value === 'dual',
      onSelect: (e: Event) => {
        e.preventDefault()
        handleMenuAction('view-dual')
      },
    },
  ],
  [
    {
      label: 'Vertical scrolling',
      icon: 'i-heroicons-arrows-up-down',
      color: 'primary',
      type: 'checkbox' as const,
      checked: scrollMode.value === 'vertical',
      onSelect: (e: Event) => {
        e.preventDefault()
        handleMenuAction('scroll-vertical')
      },
    },
    {
      label: 'Horizontal scrolling',
      icon: 'i-heroicons-arrows-right-left',
      color: 'primary',
      type: 'checkbox' as const,
      checked: scrollMode.value === 'horizontal',
      onSelect: (e: Event) => {
        e.preventDefault()
        handleMenuAction('scroll-horizontal')
      },
    },
    {
      label: 'Wrapped scrolling',
      icon: 'i-heroicons-squares-2x2',
      color: 'primary',
      type: 'checkbox' as const,
      checked: scrollMode.value === 'wrapped',
      onSelect: (e: Event) => {
        e.preventDefault()
        handleMenuAction('scroll-wrapped')
      },
    },
  ],
  [
    {
      label: 'Rotate counterclockwise',
      icon: 'i-heroicons-arrow-uturn-left',
      color: 'primary',
      onSelect: () => handleMenuAction('rotate-ccw'),
    },
    {
      label: 'Document properties',
      icon: 'i-heroicons-information-circle',
      color: 'primary',
      onSelect: () => handleMenuAction('document-properties'),
    },
  ],
])

// Mobile menu items - includes all tools (filtered by toolbarConfig)
const mobileMenuItems = computed(() => {
  const items: Array<Array<{ label: string, icon: string, onSelect?: (e?: Event) => void, disabled?: boolean, type?: 'checkbox', checked?: boolean }>> = []

  // Sidebar toggle
  if (toolbarConfig.value.sidebar) {
    items.push([
      {
        label: sidebarVisible.value ? 'Hide thumbnails' : 'Show thumbnails',
        icon: sidebarVisible.value ? 'i-heroicons-book-open-solid' : 'i-heroicons-book-open',
        onSelect: () => toggleSidebar(),
      },
    ])
  }

  // Zoom controls
  if (toolbarConfig.value.zoom) {
    items.push([
      {
        label: 'Zoom in',
        icon: 'i-heroicons-magnifying-glass-plus',
        onSelect: () => zoomIn(),
      },
      {
        label: 'Zoom out',
        icon: 'i-heroicons-magnifying-glass-minus',
        onSelect: () => zoomOut(),
      },
      {
        label: `Zoom: ${Math.round(scale.value * 100)}%`,
        icon: 'i-heroicons-magnifying-glass',
        disabled: true,
      },
    ])
  }

  // View modes (always show if more options is enabled)
  if (toolbarConfig.value.moreOptions) {
    items.push([
      {
        label: 'Single page',
        icon: 'i-heroicons-square-2-stack',
        type: 'checkbox' as const,
        checked: viewMode.value === 'single',
        onSelect: (e?: Event) => {
          e?.preventDefault()
          handleMenuAction('view-single')
        },
      },
      {
        label: 'Dual page',
        icon: 'i-heroicons-squares-2x2',
        type: 'checkbox' as const,
        checked: viewMode.value === 'dual',
        onSelect: (e?: Event) => {
          e?.preventDefault()
          handleMenuAction('view-dual')
        },
      },
    ])
  }

  // Rotate
  if (toolbarConfig.value.rotate) {
    items.push([
      {
        label: 'Rotate',
        icon: 'i-heroicons-arrow-path',
        onSelect: () => rotateRight(),
      },
    ])
  }

  // File operations
  const fileOps: Array<{ label: string, icon: string, onSelect: () => void }> = []
  if (toolbarConfig.value.openFile) {
    fileOps.push({
      label: 'Open file',
      icon: 'i-heroicons-folder-open',
      onSelect: () => openFile(),
    })
  }
  if (toolbarConfig.value.download) {
    fileOps.push({
      label: 'Download',
      icon: 'i-heroicons-arrow-down-tray',
      onSelect: () => downloadFile(),
    })
  }
  if (toolbarConfig.value.print) {
    fileOps.push({
      label: 'Print',
      icon: 'i-heroicons-printer',
      onSelect: () => printFile(),
    })
  }
  if (fileOps.length > 0) {
    items.push(fileOps)
  }

  // Theme & Fullscreen
  const utilOps: Array<{ label: string, icon: string, onSelect: () => void }> = []
  if (toolbarConfig.value.themeToggle) {
    utilOps.push({
      label: isDark.value ? 'Light mode' : 'Dark mode',
      icon: isDark.value ? 'i-heroicons-sun' : 'i-heroicons-moon',
      onSelect: () => toggleTheme(),
    })
  }
  if (toolbarConfig.value.fullscreen) {
    utilOps.push({
      label: 'Fullscreen',
      icon: 'i-heroicons-arrows-pointing-out',
      onSelect: () => toggleFullscreen(),
    })
  }
  if (utilOps.length > 0) {
    items.push(utilOps)
  }

  return items
})

// PDF.js library
let pdfjsLib: typeof PDFJS | null = null

// Functions
const loadPdf = async (url: string) => {
  if (!pdfjsLib) return

  loading.value = true
  error.value = null
  try {
    const loadingTask = pdfjsLib.getDocument(url)
    const doc = await loadingTask.promise
    pdfDoc.value = doc
    pages.value = Array.from({ length: doc.numPages }, (_, i) => i + 1)

    // Auto-populate document properties with props fallback
    await populateDocumentProperties(doc, url)
  }
  catch (err: unknown) {
    console.error('Error loading PDF:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load PDF'
  }
  finally {
    loading.value = false
  }
}

// Populate document properties from PDF metadata with props fallback
const populateDocumentProperties = async (doc: PDFJS.PDFDocumentProxy, srcUrl: string) => {
  try {
    const metadata = await doc.getMetadata()
    // Type assertion for PDF metadata info object
    const info = (metadata.info || {}) as Record<string, string | undefined>

    // Priority: props > documentInfo prop > PDF metadata > filename default
    const docInfo = props.documentInfo || {}
    const defaultTitle = getDefaultTitleFromSrc(srcUrl)

    documentProperties.value = {
      title: props.title || docInfo.title || info.Title || defaultTitle,
      author: props.author || docInfo.author || info.Author || '-',
      subject: props.subject || docInfo.subject || info.Subject || '-',
      keywords: props.keywords || docInfo.keywords || info.Keywords || '-',
      creator: props.creator || docInfo.creator || info.Creator || '-',
      producer: props.producer || docInfo.producer || info.Producer || '-',
      creationDate: formatPdfDate(info.CreationDate || ''),
      modDate: formatPdfDate(info.ModDate || ''),
      pageCount: doc.numPages,
      fileSize: '-', // Would need file size from fetch
      pdfVersion: info.PDFFormatVersion || '-',
    }
  }
  catch (err) {
    // Fallback if metadata retrieval fails
    const docInfo = props.documentInfo || {}
    const defaultTitle = getDefaultTitleFromSrc(srcUrl)

    documentProperties.value = {
      title: props.title || docInfo.title || defaultTitle,
      author: props.author || docInfo.author || '-',
      subject: props.subject || docInfo.subject || '-',
      keywords: props.keywords || docInfo.keywords || '-',
      creator: props.creator || docInfo.creator || '-',
      producer: props.producer || docInfo.producer || '-',
      creationDate: '-',
      modDate: '-',
      pageCount: doc.numPages,
      fileSize: '-',
      pdfVersion: '-',
    }
    console.warn('Error getting document metadata:', err)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    nextTick(() => scrollToPage(currentPage.value))
  }
}

const nextPage = () => {
  if (currentPage.value < pages.value.length) {
    currentPage.value++
    nextTick(() => scrollToPage(currentPage.value))
  }
}

// Go to page and scroll (used by thumbnail, input, etc.)
const goToPageAndScroll = (page: number) => {
  if (page >= 1 && page <= pages.value.length) {
    currentPage.value = page
    nextTick(() => scrollToPage(page))
  }
}

// Go to page without scroll (for internal updates like scroll position sync)
const goToPage = (page: number) => {
  if (page >= 1 && page <= pages.value.length) {
    currentPage.value = page
  }
}

const rotateRight = () => {
  rotation.value = (rotation.value + 90) % 360
}
const rotateLeft = () => {
  rotation.value = (rotation.value - 90 + 360) % 360
}

// Search handlers
const handleSearch = (query: string) => {
  performSearch(pdfDoc.value, query, searchOptions.value)
}

const handleNextMatch = () => {
  nextMatch()
  // Navigate to page with current match
  const match = searchMatches.value[currentSearchMatch.value]
  if (currentSearchMatch.value >= 0 && match) {
    goToPageAndScroll(match.pageIndex + 1)
  }
}

const handlePrevMatch = () => {
  prevMatch()
  // Navigate to page with current match
  const match = searchMatches.value[currentSearchMatch.value]
  if (currentSearchMatch.value >= 0 && match) {
    goToPageAndScroll(match.pageIndex + 1)
  }
}

const handleClearSearch = () => {
  clearSearch()
}

const handleToggleCaseSensitive = () => {
  toggleCaseSensitive()
  if (searchQuery.value) {
    handleSearch(searchQuery.value)
  }
}

const handleToggleWholeWords = () => {
  toggleWholeWords()
  if (searchQuery.value) {
    handleSearch(searchQuery.value)
  }
}

// Zoom handlers
const handleScaleUpdate = (newScale: number) => {
  setZoom(newScale)
}

const handleZoomModeUpdate = (mode: 'auto' | 'page-actual' | 'page-fit' | 'page-width' | number) => {
  // Map 'page-actual' to scale 1.0, others pass through
  if (mode === 'page-actual') {
    setZoom(1.0)
  }
  else {
    setZoom(mode as ZoomLevel)
  }
}

// Page input handlers for Nuxt UI v3
const onPageInputUpdate = (value: string | number) => {
  const page = typeof value === 'string' ? Number.parseInt(value) : value
  if (!Number.isNaN(page) && page >= 1 && page <= pages.value.length) {
    goToPageAndScroll(page)
  }
}

const onPageInputEnter = (e: KeyboardEvent) => {
  const value = Number.parseInt((e.target as HTMLInputElement).value)
  if (value >= 1 && value <= pages.value.length) {
    goToPageAndScroll(value)
  }
}

const openFile = () => {
  fileInput.value?.click()
}
const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    const fileUrl = URL.createObjectURL(files[0])
    loadPdf(fileUrl)
  }
}

const downloadFile = () => {
  if (!props.src) return
  const link = document.createElement('a')
  link.href = props.src
  link.download = props.src.split('/').pop() || 'document.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const printFile = async () => {
  if (!pdfDoc.value || pages.value.length === 0) return

  // Show print container and render all pages
  isPrinting.value = true

  // Wait for Vue to render print container
  await nextTick()

  // Wait for all pages to render (give time for canvas rendering)
  const waitForRender = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, pages.value.length * 100 + 500) // Adjust timing based on page count
    })
  }

  await waitForRender()

  // Trigger print
  window.print()

  // Hide print container after print dialog closes
  setTimeout(() => {
    isPrinting.value = false
  }, 1000)
}

// Use VueUse fullscreen
const toggleFullscreen = () => toggleFullscreenFn()

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
  storedSidebarVisible.value = sidebarVisible.value
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleMenuAction = (action: string) => {
  switch (action) {
    case 'view-single':
      setViewMode('single')
      break
    case 'view-dual':
      setViewMode('dual')
      break
    case 'view-dual-cover':
      setViewMode('dual-cover')
      break
    case 'scroll-vertical':
      setScrollMode('vertical')
      break
    case 'scroll-horizontal':
      setScrollMode('horizontal')
      break
    case 'scroll-wrapped':
      setScrollMode('wrapped')
      break
    case 'scroll-page':
      setScrollMode('page')
      break
    case 'rotate-ccw':
      rotateLeft()
      break
    case 'document-properties':
      openDocumentProperties()
      break
  }
  menuVisible.value = false
}

// Document Properties
const openDocumentProperties = async () => {
  if (!pdfDoc.value) return

  // Re-populate to ensure latest props are used (in case they changed)
  await populateDocumentProperties(pdfDoc.value, props.src)
  showDocumentProperties.value = true
}

// Click outside to close menu
const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    menuVisible.value = false
  }
}

// VueUse: Keyboard shortcuts
onKeyStroke('ArrowLeft', (e) => {
  if (!isInputFocused()) {
    e.preventDefault()
    prevPage()
  }
})

onKeyStroke('ArrowRight', (e) => {
  if (!isInputFocused()) {
    e.preventDefault()
    nextPage()
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (!isInputFocused()) {
    e.preventDefault()
    prevPage()
  }
})

onKeyStroke('ArrowDown', (e) => {
  if (!isInputFocused()) {
    e.preventDefault()
    nextPage()
  }
})

onKeyStroke('+', (e) => {
  if (!isInputFocused()) {
    e.preventDefault()
    zoomIn()
  }
}, { dedupe: true })

onKeyStroke('=', (e) => {
  if (!isInputFocused()) {
    e.preventDefault()
    zoomIn()
  }
}, { dedupe: true })

onKeyStroke('-', (e) => {
  if (!isInputFocused()) {
    e.preventDefault()
    zoomOut()
  }
}, { dedupe: true })

onKeyStroke('f', (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    // Focus search input - emit event to ToolSearch
    const searchInput = containerRef.value?.querySelector('.npk-search-input') as HTMLInputElement
    searchInput?.focus()
  }
})

onKeyStroke('Escape', () => {
  if (isFullscreen.value) {
    toggleFullscreen()
  }
  if (searchQuery.value) {
    handleClearSearch()
  }
  menuVisible.value = false
})

// Helper to check if an input element is focused
const isInputFocused = () => {
  const activeEl = document.activeElement
  return activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA'
}

// Persist zoom level
watch(scale, (newScale) => {
  storedZoomLevel.value = newScale
})

// Expose control APIs
const controls = {
  pageControl: {
    goToPage,
    prevPage,
    nextPage,
    get currentPage() { return currentPage.value },
    get totalPages() { return pages.value.length },
  },
  zoomControl: {
    zoomIn,
    zoomOut,
    setZoom,
    get scale() { return scale.value },
    get zoomMode() { return zoomMode.value },
  },
  rotateControl: {
    rotateClockwise: rotateRight,
    rotateCounterclockwise: rotateLeft,
    get rotation() { return rotation.value },
  },
  searchControl: {
    search: handleSearch,
    nextMatch: handleNextMatch,
    prevMatch: handlePrevMatch,
    clearSearch: handleClearSearch,
    get query() { return searchQuery.value },
    get matches() { return searchMatches.value },
    get currentMatchIndex() { return currentSearchMatch.value },
  },
  printControl: {
    print: printFile,
  },
  downloadControl: {
    download: downloadFile,
  },
  viewControl: {
    setViewMode,
    setScrollMode,
    toggleSidebar,
    toggleFullscreen,
    get viewMode() { return viewMode.value },
    get scrollMode() { return scrollMode.value },
    get isFullscreen() { return isFullscreen.value },
    get isSidebarVisible() { return sidebarVisible.value },
  },
  themeControl: {
    toggleTheme,
    get isDark() { return isDark.value },
  },
}

defineExpose({
  controls,
  pdfDoc,
  currentPage,
  pages,
  scale,
  rotation,
  goToPage,
  goToPageAndScroll,
})

onMounted(async () => {
  try {
    const lib = await import('pdfjs-dist')
    pdfjsLib = lib

    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
    }

    if (transformedSrc.value) {
      loadPdf(transformedSrc.value)
    }

    document.addEventListener('click', handleClickOutside)
  }
  catch (e) {
    console.error('Failed to load pdfjs-dist', e)
    error.value = 'Failed to initialize PDF library'
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => transformedSrc.value, (newSrc) => {
  if (newSrc && pdfjsLib) {
    currentPage.value = 1
    loadPdf(newSrc)
  }
})
</script>

<style scoped>
.npk-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-family: system-ui, sans-serif;
  overflow: hidden;
  background-color: var(--ui-bg);
}

.npk-viewer:fullscreen {
  background-color: var(--ui-bg);
}

.npk-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Responsive toolbar */
.npk-toolbar {
  position: relative;
  z-index: 10;
}

.npk-toolbar-mobile {
  display: flex;
}

.npk-toolbar-desktop {
  display: none;
}

@media (min-width: 1024px) {
  .npk-toolbar-mobile {
    display: none;
  }

  .npk-toolbar-desktop {
    display: flex;
  }
}

.npk-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.npk-content {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: var(--ui-bg-muted);
}

.npk-pages {
  display: flex;
  max-width: 100%;
  gap: 1rem;
}

/* View Modes - Single */
.npk-content--view-single .npk-pages {
  flex-direction: column;
  align-items: center;
}

/* Scroll Modes */
.npk-pages--vertical {
  flex-direction: column;
}

.npk-pages--horizontal {
  flex-direction: row;
  align-items: flex-start;
}

.npk-pages--wrapped {
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1400px;
}

/* View Modes - Dual (must be after scroll modes to override) */
.npk-content--view-dual .npk-pages,
.npk-content--view-dual-cover .npk-pages,
.npk-content--view-dual .npk-pages.npk-pages--vertical,
.npk-content--view-dual-cover .npk-pages.npk-pages--vertical,
.npk-content--view-dual .npk-pages.npk-pages--horizontal,
.npk-content--view-dual-cover .npk-pages.npk-pages--horizontal {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap !important;
  align-items: flex-start !important;
  justify-content: center !important;
  gap: 1rem !important;
}

/* Dual page: 2 pages per row - target child component */
.npk-content--view-dual :deep(.npk-pdf-page),
.npk-content--view-dual-cover :deep(.npk-pdf-page) {
  flex: 0 0 auto !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.npk-pages--page {
  flex-direction: column;
}

/* Horizontal scroll */
.npk-content--scroll-horizontal {
  overflow-x: auto;
  overflow-y: hidden;
}

/* Page mode */
.npk-content--scroll-page {
  overflow: hidden;
}

/* Wrapped scroll */
.npk-content--scroll-wrapped .npk-pages {
  display: grid;
  gap: 1.5rem;
  justify-items: center;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

/* Virtual Scrolling */
.npk-content--virtual {
  position: relative;
}

.npk-virtual-spacer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.npk-content--virtual .npk-pages {
  position: relative;
  will-change: transform;
}

/* Dropdown Menu Icons - Use Primary Color */
.npk-viewer :deep([role="menuitemcheckbox"] .iconify),
.npk-viewer :deep([role="menuitem"] .iconify) {
  color: var(--ui-primary) !important;
}

.npk-viewer :deep([role="menuitemcheckbox"]:hover .iconify),
.npk-viewer :deep([role="menuitem"]:hover .iconify) {
  color: var(--ui-primary) !important;
}

/* Print Container - Hidden on screen */
.npk-print-container {
  display: none;
}

.npk-print-page {
  page-break-after: always;
  margin: 0;
  padding: 0;
}

.npk-print-page:last-child {
  page-break-after: auto;
}

/* Print Styles */
@media print {
  /* Hide everything except print container */
  body * {
    visibility: hidden;
  }

  .npk-print-container,
  .npk-print-container * {
    visibility: visible;
  }

  .npk-print-container {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  .npk-print-page {
    width: 100%;
    margin: 0 auto;
    box-shadow: none !important;
  }

  /* Hide viewer UI during print */
  .npk-viewer .npk-toolbar,
  .npk-viewer .npk-main,
  .npk-viewer .npk-container {
    display: none !important;
  }

  /* Ensure overflow is visible */
  html, body {
    overflow: visible !important;
    height: auto !important;
  }
}
</style>
