# Composables

All `usePdfKit*` composables are **auto-imported** by the module — no manual import needed. They follow Nuxt module best practices and are prefixed with `usePdfKit`.

## Overview

| Composable | Description |
|------------|-------------|
| `usePdfKitDocument` | PDF document loading and management |
| `usePdfKitZoom` | Zoom controls and scale management |
| `usePdfKitSearch` | Text search with highlighting |
| `usePdfKitViewMode` | View mode and scroll mode |
| `usePdfKitPageNavigation` | Page navigation utilities |
| `usePdfKitRotation` | Document rotation |
| `usePdfKitVirtualScroll` | Virtual scrolling for large documents |

## usePdfKitSearch

Provides full-text search with match highlighting.

```ts
const {
  searchQuery,
  matches,
  currentMatchIndex,
  currentMatch,
  totalMatches,
  hasMatches,
  isSearching,
  searchOptions,
  search,
  nextMatch,
  prevMatch,
  clearSearch,
  toggleCaseSensitive,
  toggleWholeWords,
} = usePdfKitSearch()
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `searchQuery` | `Ref<string>` | Current search query |
| `matches` | `Ref<SearchMatch[]>` | Array of search matches |
| `currentMatchIndex` | `Ref<number>` | Index of current match (`-1` when none) |
| `currentMatch` | `ComputedRef<SearchMatch \| null>` | Current match object |
| `totalMatches` | `ComputedRef<number>` | Total number of matches |
| `hasMatches` | `ComputedRef<boolean>` | Whether any match exists |
| `isSearching` | `Ref<boolean>` | Search in progress |
| `searchOptions` | `Ref<SearchOptions>` | Current search options |
| `search` | `(pdfDoc, query, options?) => Promise<void>` | Perform search on a PDF document |
| `nextMatch` | `() => void` | Go to next match |
| `prevMatch` | `() => void` | Go to previous match |
| `clearSearch` | `() => void` | Clear search results |
| `toggleCaseSensitive` | `() => void` | Toggle case sensitivity |
| `toggleWholeWords` | `() => void` | Toggle whole words |

### SearchMatch Interface

```ts
interface SearchMatch {
  pageIndex: number
  matchIndex: number
  text: string
}
```

## usePdfKitPageNavigation

```ts
const { currentPage, nextPage, prevPage } = usePdfKitPageNavigation({ totalPages: 100 })
```

## usePdfKitZoom

```ts
const { scale, zoomIn, zoomOut } = usePdfKitZoom()
```

## usePdfKitDocument

Manages PDF document loading. Returns document state and loading helpers (see `UsePdfKitDocumentOptions`).

## usePdfKitViewMode

Manages `viewMode` (`'single' | 'dual' | 'dual-cover'`) and `scrollMode` (`'vertical' | 'horizontal' | 'wrapped' | 'page'`).

## usePdfKitRotation

Manages document rotation in 90° increments (`0 | 90 | 180 | 270`).

## usePdfKitVirtualScroll

Efficient rendering for large documents; used automatically when `virtualScroll` is enabled on `NuxtPdfKit`.

## TypeScript

Import types when needed:

```ts
import type { ZoomLevel, ViewMode, ScrollMode, SearchMatch } from 'nuxt-pdf-kit'
```

Exported types include: `DocumentProperties`, `DocumentPropertiesOptions`, `ZoomLevel`, `ViewMode`, `ScrollMode`, `SearchMatch`, `PdfViewerControls`, `ToolbarOptions`, `PdfProvider`, `ProviderConfig`, `PdfKitRuntimeConfig`.
