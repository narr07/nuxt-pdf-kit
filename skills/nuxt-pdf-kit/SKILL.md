---
name: nuxt-pdf-kit
description: Use when working with nuxt-pdf-kit in a Nuxt project - provides the module API surface (components, props, composables, methods, providers, and configuration) so you do not rediscover the project details every session. Covers NuxtPdfKit, NuxtPdfKitPage, NuxtPdfKitThumbnail(s), toolbar options, SSR notes, and the gdrive proxy.
license: MIT
---

# Nuxt PDF Kit

A feature-rich PDF viewer module for Nuxt, built with **Nuxt UI** and **Tailwind CSS v4**, powered by [PDF.js](https://mozilla.github.io/pdf.js/).

This skill is the single source of truth for the `nuxt-pdf-kit` module API. Load the matching reference for the task, then apply module-owned conventions. Do not guess API names — verify against these references.

## When to Use

- Adding, editing, or debugging a PDF viewer in a Nuxt app
- Using `NuxtPdfKit` components, props, or exposed controls
- Using `usePdfKit*` composables (document, zoom, search, view mode, page navigation, rotation, virtual scroll)
- Configuring `pdfKit` module options or per-instance toolbar
- Loading PDFs through providers (`url`, `gdrive`, `custom`)
- Debugging SSR or hydration around the client-only viewer

## Quick Facts

- **Install:** `npx nuxi module add nuxt-pdf-kit` or add `'nuxt-pdf-kit'` to `modules` in `nuxt.config.ts`.
- **Config key:** `pdfKit` (global module options).
- **Components:** `NuxtPdfKit` (main), `NuxtPdfKitPage`, `NuxtPdfKitThumbnail`, `NuxtPdfKitThumbnails`.
- **Auto-imports:** all `usePdfKit*` composables are auto-imported; types are exported from `nuxt-pdf-kit`.
- **SSR:** viewer components are registered with `mode: 'client'` so they work out of the box with SSR — no manual `ClientOnly` wrapping needed.
- **Dependencies:** auto-installs `@nuxt/ui` and `@vueuse/nuxt`; `pdfjs-dist` is auto-transpiled and pre-bundled.

## Loading References

Load **only** the reference relevant to the current task:

| Task | Reference |
| ---- | --------- |
| `NuxtPdfKit` usage, props, exposed `controls` | [components.md](references/components.md) |
| `usePdfKit*` composables and their return values | [composables.md](references/composables.md) |
| Module options, toolbar options, per-instance config | [configuration.md](references/configuration.md) |
| `url` / `gdrive` / `custom` providers, contributing new ones | [providers.md](references/providers.md) |

## Core Rules

1. **Use the component, not raw PDF.js.** All rendering, search, zoom, rotation, and scrolling go through `NuxtPdfKit` and the `usePdfKit*` composables.
2. **Programmatic control via `ref` + `controls`:** attach `ref="pdfViewer"` to `NuxtPdfKit` and call `pdfViewer.value?.controls.<group>.<method>()`.
3. **Composables are stateful per call site:** create them inside the component that owns the state (e.g. `usePdfKitSearch()` inside the component using search).
4. **Google Drive IDs are opaque:** pass the file ID (not the full URL) as `src` with `provider="gdrive"`.
5. **Do not reinvent SSR handling:** components are already client-only; keep them out of server-only logic.

## Verification Checklist

Before finishing work that touches this module, confirm:

- [ ] Component name and props match the reference tables exactly
- [ ] Provider value is one of `'url' | 'gdrive' | 'custom'`
- [ ] Toolbar option names match `ToolbarOptions` (camelCase, e.g. `themeToggle`, `pageNavigation`)
- [ ] Composables are auto-imported (no manual import needed)
- [ ] Any gdrive usage relies on the built-in `/pdf-proxy/gdrive/**` server route
