<script setup lang="ts">
const pdfViewer = ref()

const controls = computed(() => pdfViewer.value?.controls)
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        icon="i-lucide-chevron-left"
        label="Prev"
        color="neutral"
        variant="outline"
        @click="controls?.pageControl.prevPage()"
      />
      <UButton
        trailing-icon="i-lucide-chevron-right"
        label="Next"
        color="neutral"
        variant="outline"
        @click="controls?.pageControl.nextPage()"
      />
      <UButton
        label="Go to page 5"
        color="neutral"
        variant="outline"
        @click="controls?.pageControl.goToPage(5)"
      />
      <UButton
        icon="i-lucide-zoom-in"
        aria-label="Zoom in"
        color="neutral"
        variant="outline"
        @click="controls?.zoomControl.zoomIn()"
      />
      <UButton
        icon="i-lucide-zoom-out"
        aria-label="Zoom out"
        color="neutral"
        variant="outline"
        @click="controls?.zoomControl.zoomOut()"
      />
      <UButton
        icon="i-lucide-rotate-cw"
        aria-label="Rotate"
        color="neutral"
        variant="outline"
        @click="controls?.rotateControl.rotateClockwise()"
      />
    </div>

    <div class="h-[480px] overflow-hidden rounded-md border border-default">
      <NuxtPdfKit
        ref="pdfViewer"
        src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
        :toolbar="{ sidebar: false, search: false, print: false, download: false }"
      />
    </div>
  </div>
</template>
