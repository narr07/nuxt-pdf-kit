<script setup lang="ts">
const { scale, zoomPercentage, zoomIn, zoomOut, setZoom } = usePdfKitZoom({
  minScale: 0.5,
  maxScale: 3,
})
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex items-center gap-2">
      <UButton
        icon="i-lucide-zoom-out"
        color="neutral"
        variant="outline"
        aria-label="Zoom out"
        @click="zoomOut"
      />
      <span class="w-14 text-center tabular-nums">{{ zoomPercentage }}%</span>
      <UButton
        icon="i-lucide-zoom-in"
        color="neutral"
        variant="outline"
        aria-label="Zoom in"
        @click="zoomIn"
      />
      <UButton
        label="Reset"
        color="neutral"
        variant="ghost"
        @click="setZoom(1)"
      />
    </div>

    <div class="flex h-48 w-full items-center justify-center overflow-hidden rounded-md border border-default">
      <div
        class="flex h-16 w-12 items-center justify-center rounded-sm border border-default bg-elevated text-xs transition-transform"
        :style="{ transform: `scale(${scale})` }"
      >
        Page
      </div>
    </div>
  </div>
</template>
