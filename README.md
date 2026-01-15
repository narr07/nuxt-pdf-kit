# Nuxt PDF Kit

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A feature-rich PDF viewer module for Nuxt with **Nuxt UI** and **Tailwind CSS v4**.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
  <!-- - [🏀 Online playground](https://stackblitz.com/github/user/nuxt-pdf-kit?file=playground%2Fapp.vue) -->
  <!-- - [📖 &nbsp;Documentation](https://nuxt-pdf-kit.nuxt.dev) -->

## Why?

Building a PDF viewer in Nuxt requires dealing with PDF.js complexity, SSR issues, and creating a good UI from scratch. **Nuxt PDF Kit** provides:

- 🎨 **Beautiful UI** - Beautiful, responsive interface with dark/light mode
- ⚡ **SSR Compatible** - Works out of the box with Nuxt's server-side rendering
- 🔧 **Zero Config** - Auto-installs dependencies (@nuxt/ui, @vueuse/nuxt)
- 📱 **Responsive** - Mobile-friendly with adaptive toolbar
- 🎯 **Feature Complete** - Search, zoom, rotate, print, download, and more

## Features

- 📄 **PDF Rendering** - High-quality rendering with PDF.js
- 🔍 **Text Search** - Full-text search with highlighting and navigation
- 🔎 **Zoom Controls** - Zoom in/out, fit page, fit width, custom percentage
- 🔄 **Rotation** - Rotate documents clockwise
- 📱 **View Modes** - Single page, dual page, dual with cover
- 📜 **Scroll Modes** - Vertical, horizontal, wrapped, page-by-page
- 🖼️ **Thumbnails** - Sidebar with page thumbnails
- ⌨️ **Keyboard Shortcuts** - Navigate with arrow keys, zoom with +/-
- 🌙 **Dark Mode** - Built-in theme toggle with persistence
- 🖨️ **Print & Download** - Native print and download support
- 📊 **Virtual Scrolling** - Efficient rendering for large documents
- 📐 **Responsive Mode** - Auto-fit pages to container width

## Quick Setup

Install the module to your Nuxt application:

```bash
npx nuxi module add nuxt-pdf-kit
```

Or manually:

```bash
npm install nuxt-pdf-kit
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxt-pdf-kit"],
});
```

## Usage

```vue
<template>
  <NuxtPdfKit src="/sample.pdf" />
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
  />
</template>
```

### Programmatic Control

```vue
<template>
  <NuxtPdfKit ref="pdfViewer" src="/document.pdf" />
  <button @click="pdfViewer?.goToPage(5)">Go to Page 5</button>
</template>

<script setup>
const pdfViewer = ref(null);
</script>
```

### File Providers

Load PDFs from different sources:

```vue
<template>
  <!-- Direct URL (default) -->
  <NuxtPdfKit src="/sample.pdf" />

  <!-- Google Drive -->
  <NuxtPdfKit provider="gdrive" src="1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu" />

  <!-- Custom CDN/Proxy -->
  <NuxtPdfKit
    provider="custom"
    src="file-123"
    :provider-config="{ baseUrl: '/cdn' }"
  />
</template>
```

**Supported Providers:**

- `url` - Direct URLs (default)
- `gdrive` - Google Drive files
- `custom` - Custom CDN or proxy server

See [Provider Documentation](./docs/content/en/5.advanced/1.providers.md) for more details.

## Configuration

Configure the module in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ["nuxt-pdf-kit"],
  pdfKit: {
    // Auto-install @nuxt/ui (default: true)
    ui: true,
    // Auto-install @vueuse/nuxt (default: true)
    vueuse: true,
    // Toolbar configuration
    toolbar: {
      sidebar: true, // Thumbnail sidebar toggle
      pageNavigation: true, // Page navigation controls
      zoom: true, // Zoom controls
      search: true, // Search tool
      rotate: true, // Rotate button
      openFile: false, // Open file button
      print: true, // Print button
      download: true, // Download button
      fullscreen: true, // Fullscreen button
      themeToggle: true, // Theme toggle button
      moreOptions: true, // More options menu
    },
  },
});
```

## Props

| Prop                     | Type                                                | Default      | Description                           |
| ------------------------ | --------------------------------------------------- | ------------ | ------------------------------------- |
| `src`                    | `string`                                            | required     | URL or path to PDF file               |
| `theme`                  | `'light' \| 'dark'`                                 | `'light'`    | Initial theme                         |
| `responsive`             | `boolean`                                           | `true`       | Auto-fit pages to container width     |
| `initialViewMode`        | `'single' \| 'dual' \| 'dual-cover'`                | `'single'`   | Initial view mode                     |
| `initialScrollMode`      | `'vertical' \| 'horizontal' \| 'wrapped' \| 'page'` | `'vertical'` | Initial scroll mode                   |
| `virtualScroll`          | `boolean`                                           | `true`       | Enable virtual scrolling              |
| `virtualScrollThreshold` | `number`                                            | `10`         | Pages threshold for virtual scrolling |
| `toolbar`                | `ToolbarOptions`                                    | -            | Override toolbar config               |

## Composables

All composables are prefixed with `usePdfKit` following Nuxt module best practices:

| Composable                | Description                           |
| ------------------------- | ------------------------------------- |
| `usePdfKitDocument`       | PDF document loading and management   |
| `usePdfKitZoom`           | Zoom controls and scale management    |
| `usePdfKitSearch`         | Text search with highlighting         |
| `usePdfKitViewMode`       | View mode and scroll mode             |
| `usePdfKitVirtualScroll`  | Virtual scrolling for large documents |
| `usePdfKitRotation`       | Document rotation                     |
| `usePdfKitPageNavigation` | Page navigation utilities             |

## Keyboard Shortcuts

| Key            | Action                         |
| -------------- | ------------------------------ |
| `←` `↑`        | Previous page                  |
| `→` `↓`        | Next page                      |
| `+` `=`        | Zoom in                        |
| `-`            | Zoom out                       |
| `Ctrl/Cmd + F` | Focus search                   |
| `Escape`       | Exit fullscreen / Clear search |

## Requirements

- Nuxt >= 3.0.0
- Node.js >= 18

## Contribution

<details>
  <summary>Local development</summary>

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

</details>

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-pdf-kit/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-pdf-kit
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-pdf-kit.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-pdf-kit
[license-src]: https://img.shields.io/npm/l/nuxt-pdf-kit.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-pdf-kit
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
