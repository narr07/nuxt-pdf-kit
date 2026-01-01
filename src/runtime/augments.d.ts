// Type augmentation for nuxt-pdf-kit module
// This file augments Nuxt's types to provide autocomplete for runtime config

import type { ToolbarOptions } from '../module'

interface PdfKitPublicRuntimeConfig {
  toolbar: Required<ToolbarOptions>
}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    pdfKit: PdfKitPublicRuntimeConfig
  }
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    pdfKit: PdfKitPublicRuntimeConfig
  }
}

export {}
