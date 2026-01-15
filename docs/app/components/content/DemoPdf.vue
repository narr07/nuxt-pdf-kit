<template>
  <div class="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden relative">
    <ClientOnly>
      <NuxtPdfKit
        src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
        :toolbar="{
          themeToggle: true,
          download: true,
          print: true,
        }"
      />
      <template #fallback>
        <div class="flex items-center justify-center h-full bg-gray-50 text-gray-400">
          Loading PDF Viewer...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
// Demo component for Nuxt PDF Kit
</script>
