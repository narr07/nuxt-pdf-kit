# Providers

Nuxt PDF Kit loads PDFs from different sources through its provider system. The provider is selected with the `provider` prop; the value must be one of `'url' | 'gdrive' | 'custom'`.

## URL Provider (Default)

Loads PDFs from direct URLs — local files in `/public` or any publicly accessible URL with proper CORS headers.

```vue
<template>
  <NuxtPdfKit src="/sample.pdf" />
</template>
```

## Google Drive Provider

Loads PDFs directly from Google Drive without manual server routes.

```vue
<template>
  <NuxtPdfKit provider="gdrive" src="1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu" />
</template>
```

**How to get a Google Drive File ID:**

1. Open the file in Google Drive
2. Click "Share" → "Get link"
3. Copy the ID from the URL: `https://drive.google.com/file/d/FILE_ID_HERE/view`
4. Pass that ID as the `src` prop

**Features:**

- Automatic CORS handling
- Built-in caching (24 hours)
- Virus scan warning detection
- No manual server routes needed

**Important:**

- Google Drive may show a virus scan warning for files larger than 100MB. For large files, consider a direct URL or custom CDN.
- The proxy route is `/pdf-proxy/gdrive/**` and is registered automatically by the module (both `/pdf-proxy/gdrive/ID` and `/pdf-proxy/gdrive/ID.pdf`).

## Custom Provider

Use `provider="custom"` for custom sources, combined with `providerConfig`.

```vue
<template>
  <NuxtPdfKit
    provider="custom"
    src="some-identifier"
    :provider-config="{
      baseUrl: 'https://cdn.example.com/pdf-proxy',
    }"
  />
</template>
```

### ProviderConfig

| Option | Type | Description |
|--------|------|-------------|
| `baseUrl` | `string` | Base URL for the custom provider |
| `transform` | `(src: string) => string` | Custom transform function for `src` |
| `cache` | `boolean` | Enable caching |
| `maxAge` | `number` | Cache max age in seconds |
| `[key: string]` | `unknown` | Additional provider-specific options |

## Contributing New Providers

Adding a new provider (OneDrive, Dropbox, S3, etc.) involves three steps:

1. **Add the provider type** in `src/runtime/types.ts` (e.g. extend `PdfProvider`).
2. **Create the transformation logic** in `src/runtime/composables/usePdfKitProvider.ts`.
3. **Add a server route** (if needed for CORS/authentication), e.g. a Nitro handler under `src/runtime/server/routes/pdf-proxy/<provider>/`.

Reference implementation pattern (from the docs):

```typescript
function transformOneDrive(src: string, config?: ProviderConfig): string {
  const shareId = src.trim()
  const proxyRoute = config?.baseUrl || '/pdf-proxy/onedrive'
  return `${proxyRoute}/${shareId}.pdf`
}
