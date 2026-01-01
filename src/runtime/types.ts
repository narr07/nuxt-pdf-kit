// Types for nuxt-pdf-kit module

import type { ToolbarOptions } from '../module'

export interface PdfKitRuntimeConfig {
  toolbar: Required<ToolbarOptions>
}

// Re-export types for convenience
export type { ToolbarOptions }

// Document properties interface
export interface DocumentProperties {
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
}

// Props for document info override
export interface DocumentPropertiesOptions {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
}

// Zoom levels
export type ZoomLevel = 'auto' | 'page-fit' | 'page-width' | number

// View modes
export type ViewMode = 'single' | 'dual' | 'dual-cover'

// Scroll modes
export type ScrollMode = 'vertical' | 'horizontal' | 'wrapped' | 'page'

// Search match interface
export interface SearchMatch {
  pageIndex: number
  matchIndex: number
  text: string
}

// PDF Viewer control APIs
export interface PdfViewerControls {
  pageControl: {
    goToPage: (page: number) => void
    prevPage: () => void
    nextPage: () => void
    readonly currentPage: number
    readonly totalPages: number
  }
  zoomControl: {
    zoomIn: () => void
    zoomOut: () => void
    setZoom: (value: ZoomLevel) => void
    readonly scale: number
    readonly zoomMode: ZoomLevel
  }
  rotateControl: {
    rotateClockwise: () => void
    rotateCounterclockwise: () => void
    readonly rotation: number
  }
  searchControl: {
    search: (query: string) => void
    nextMatch: () => void
    prevMatch: () => void
    clearSearch: () => void
    readonly query: string
    readonly matches: SearchMatch[]
    readonly currentMatchIndex: number
  }
  printControl: {
    print: () => void
  }
  downloadControl: {
    download: () => void
  }
  viewControl: {
    setViewMode: (mode: ViewMode) => void
    setScrollMode: (mode: ScrollMode) => void
    toggleSidebar: () => void
    toggleFullscreen: () => void
    readonly viewMode: ViewMode
    readonly scrollMode: ScrollMode
    readonly isFullscreen: boolean
    readonly isSidebarVisible: boolean
  }
  themeControl: {
    toggleTheme: () => void
    readonly isDark: boolean
  }
}
