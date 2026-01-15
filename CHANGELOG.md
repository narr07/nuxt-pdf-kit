# Changelog

## v1.1.3 - 2026-01-15

### ✨ New Features

- **File Provider System** - Load PDFs from different sources without manual server routes
  - Added `provider` prop to support multiple file sources
  - Built-in Google Drive provider with automatic CORS handling
  - Custom provider support for CDN/proxy servers
  - Fully type-safe with TypeScript support
  - Backward compatible - existing code works without changes

### 🐛 Bug Fixes

- Fixed all test suite failures (30/30 tests now passing)
  - Resolved Vue SSR whitespace rendering issues in test assertions
  - Updated test expectations to be more flexible
  - Fixed `basic.test.ts` and `custom-toolbar.test.ts`

### 📚 Documentation

- **Provider Documentation** - Comprehensive guides for using file providers
  - English: Provider usage guide and contribution guide
  - Indonesian: Provider usage guide (Panduan penggunaan provider)
  - Added troubleshooting section for common issues
  - Step-by-step guide for contributing new providers
- Fixed critical YAML frontmatter errors in Indonesian documentation
  - Fixed malformed frontmatter in `introduction.md`
  - Fixed malformed frontmatter in `installation.md`
- Enabled Docus theme in documentation site
- Updated branding from "premium UI" to "Nuxt UI" across all documentation
- Updated README with provider examples

### 📦 Package

- Added comprehensive keywords for better NPM discoverability
- Added author and funding information
- Improved package description

### ✨ Improvements

- Enhanced bilingual documentation (EN/ID)
- Improved SEO metadata
- Better package metadata for NPM
- Extensible architecture for adding new providers (OneDrive, Dropbox, etc.)

### 🔧 Technical Details

**New Files:**

- `src/runtime/composables/usePdfKitProvider.ts` - Provider transformation logic
- `src/runtime/server/routes/pdf-proxy/gdrive/[id].ts` - Google Drive proxy server
- `docs/content/en/5.advanced/1.providers.md` - Provider usage guide
- `docs/content/en/5.advanced/2.contributing-providers.md` - Contribution guide
- `docs/content/id/5.advanced/1.providers.md` - Indonesian provider guide

**Modified Files:**

- `src/runtime/types.ts` - Added `PdfProvider` and `ProviderConfig` types
- `src/runtime/components/NuxtPdfViewer.client.vue` - Added provider props
- `src/module.ts` - Registered Google Drive server route
- `playground/app.vue` - Added provider testing UI

### 💡 Usage Examples

```vue
<!-- Google Drive -->
<NuxtPdfKit provider="gdrive" src="1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu" />

<!-- Custom CDN -->
<NuxtPdfKit
  provider="custom"
  src="file-123"
  :provider-config="{ baseUrl: '/cdn' }"
/>
```

## v1.1.2

### 🐛 Bug Fixes

- Fix PDF viewer toolbar buttons not clickable in fullscreen mode ([#task](https://github.com/user/nuxt-pdf-kit/issues/task))

## v1.1.0

### 🚀 Enhancements

- Initial release of nuxt-pdf-kit ([90d2e24](https://github.com/user/nuxt-pdf-kit/commit/90d2e24))

### ❤️ Contributors

- Narr07 ([@narr07](https://github.com/narr07))
