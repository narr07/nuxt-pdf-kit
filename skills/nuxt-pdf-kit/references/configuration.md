# Configuration

## Module Options (Global)

Configure globally in `nuxt.config.ts` under the `pdfKit` key.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['nuxt-pdf-kit'],
  pdfKit: {
    toolbar: {
      // toolbar options
    },
  },
})
```

### Default Values

All toolbar options are enabled by default except `openFile`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['nuxt-pdf-kit'],
  pdfKit: {
    toolbar: {
      sidebar: true,
      pageNavigation: true,
      zoom: true,
      search: true,
      rotate: true,
      openFile: false,    // Disabled by default
      print: true,
      download: true,
      fullscreen: true,
      themeToggle: true,
      moreOptions: true,
    },
  },
})
```

## Toolbar Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sidebar` | `boolean` | `true` | Thumbnail sidebar toggle |
| `pageNavigation` | `boolean` | `true` | Page navigation controls |
| `zoom` | `boolean` | `true` | Zoom controls |
| `search` | `boolean` | `true` | Search tool |
| `rotate` | `boolean` | `true` | Rotate button |
| `openFile` | `boolean` | `false` | Open file button |
| `print` | `boolean` | `true` | Print button |
| `download` | `boolean` | `true` | Download button |
| `fullscreen` | `boolean` | `true` | Fullscreen button |
| `themeToggle` | `boolean` | `true` | Theme toggle button |
| `moreOptions` | `boolean` | `true` | More options menu |

## Per-Instance Config

Override toolbar options per component instance via the `toolbar` prop:

```vue
<template>
  <NuxtPdfKit
    src="/document.pdf"
    :toolbar="{
      search: true,
      download: false,
      themeToggle: false,
    }"
  />
</template>
```

## Runtime Config

The module exposes merged options through `runtimeConfig.public.pdfKit` (type `PdfKitRuntimeConfig`). The runtime config is augmented via a generated type template, so `useRuntimeConfig().public.pdfKit` is typed.

## TypeScript

Types are exported from `nuxt-pdf-kit`:

```ts
import type { ToolbarOptions, ModuleOptions } from 'nuxt-pdf-kit'
```

The `ModuleOptions` interface only exposes `toolbar` today, but the `agents`/future fields are reserved for extensibility.
