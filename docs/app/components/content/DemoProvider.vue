<template>
  <div class="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden relative">
    <ClientOnly>
      <NuxtPdfKit
        provider="gdrive"
        src="1kgN3QYrPhgeyoIehoTcarfwcIikKHIvE"
        :toolbar="{
          themeToggle: true,
          download: true,
          print: true,
        }"
      />
      <template #fallback>
        <div class="flex items-center justify-center h-full bg-gray-50 text-gray-400">
          Loading PDF Viewer from Google Drive...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
</script>
