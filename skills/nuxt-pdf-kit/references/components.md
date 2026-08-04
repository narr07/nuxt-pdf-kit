# Components

The `NuxtPdfKit` component is the main PDF viewer. It is registered with `mode: 'client'`, so it works with SSR out of the box.

## NuxtPdfKit

### Basic Usage

```vue
<template>
  <NuxtPdfKit src="/document.pdf" />
</template>
```

### With Options

```vue
<template>
  <NuxtPdfKit
    src="/document.pdf"
    theme="dark"
    :responsive="true"
    initial-view-mode="single"
    initial-scroll-mode="vertical"
    :virtual-scroll="true"
    :virtual-scroll-threshold="10"
    :toolbar="{
      sidebar: true,
      pageNavigation: true,
      zoom: true,
      search: true,
      rotate: true,
      openFile: false,
      print: true,
      download: true,
      fullscreen: true,
      themeToggle: true,
      moreOptions: true,
    }"
  />
</template>
```

### Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | URL or path to PDF file |
| `provider` | `'url' \| 'gdrive' \| 'custom'` | `'url'` | File source provider |
| `providerConfig` | `ProviderConfig` | - | Provider-specific configuration |
| `theme` | `'light' \| 'dark'` | `'light'` | Initial theme |
| `responsive` | `boolean` | `true` | Auto-fit pages to container |
| `initialViewMode` | `'single' \| 'dual' \| 'dual-cover'` | `'single'` | Initial view mode |
| `initialScrollMode` | `'vertical' \| 'horizontal' \| 'wrapped' \| 'page'` | `'vertical'` | Initial scroll mode |
| `virtualScroll` | `boolean` | `true` | Enable virtual scrolling |
| `virtualScrollThreshold` | `number` | `10` | Pages threshold for virtual scroll |
| `toolbar` | `ToolbarOptions` | - | Override toolbar config |
| `title` | `string` | - | Override document title |
| `author` | `string` | - | Override document author |
| `subject` | `string` | - | Override document subject |
| `keywords` | `string` | - | Override document keywords |
| `creator` | `string` | - | Override document creator |
| `producer` | `string` | - | Override document producer |
| `documentInfo` | `DocumentPropertiesOptions` | - | Override multiple document properties at once |

### Programmatic Control (Methods)

Attach a template ref and access the `controls` object:

```vue
<template>
  <NuxtPdfKit ref="pdfViewer" src="/document.pdf" />
  <button @click="pdfViewer?.controls.pageControl.goToPage(5)">Go to Page 5</button>
</template>

<script setup>
const pdfViewer = ref(null)
</script>
```

Available control groups:

| Group | Methods / Properties |
|-------|----------------------|
| `pageControl` | `goToPage(page)`, `prevPage()`, `nextPage()`, `currentPage` (ro), `totalPages` (ro) |
| `zoomControl` | `zoomIn()`, `zoomOut()`, `setZoom(level)`, `scale` (ro), `zoomMode` (ro) |
| `rotateControl` | `rotateClockwise()`, `rotateCounterclockwise()`, `rotation` (ro) |
| `searchControl` | `search(query)`, `nextMatch()`, `prevMatch()`, `clearSearch()`, `query` (ro), `matches` (ro), `currentMatchIndex` (ro) |
| `printControl` | `print()` |
| `downloadControl` | `download()` |
| `viewControl` | `setViewMode(mode)`, `setScrollMode(mode)`, `toggleSidebar()`, `toggleFullscreen()`, `viewMode` (ro), `scrollMode` (ro), `isFullscreen` (ro), `isSidebarVisible` (ro) |
| `themeControl` | `toggleTheme()`, `isDark` (ro) |

## NuxtPdfKitPage

Renders a single PDF page. Registered with `mode: 'client'`.

## NuxtPdfKitThumbnail

Renders a single page thumbnail. Not client-only (registered without `mode: 'client'`).

## NuxtPdfKitThumbnails

Renders a sidebar collection of thumbnails. Registered with `mode: 'client'`.

## SSR Notes

- `NuxtPdfKit`, `NuxtPdfKitPage`, and `NuxtPdfKitThumbnails` are client-only components. They are safe to use in SSR pages without manual `ClientOnly` wrapping.
- `pdfjs-dist` is auto-transpiled and added to Vite `optimizeDeps.include`, so no manual build config is required.
