<script setup lang="ts">
const totalPages = 12

const {
  currentPage,
  nextPage,
  prevPage,
  firstPage,
  lastPage,
  goToPage,
  canGoNext,
  canGoPrev,
} = usePdfKitPageNavigation({ totalPages })
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex items-center gap-2">
      <UButton
        icon="i-lucide-chevrons-left"
        color="neutral"
        variant="outline"
        aria-label="First page"
        :disabled="!canGoPrev"
        @click="firstPage"
      />
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="outline"
        aria-label="Previous page"
        :disabled="!canGoPrev"
        @click="prevPage"
      />
      <span class="w-24 text-center tabular-nums">Page {{ currentPage }} / {{ totalPages }}</span>
      <UButton
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="outline"
        aria-label="Next page"
        :disabled="!canGoNext"
        @click="nextPage"
      />
      <UButton
        icon="i-lucide-chevrons-right"
        color="neutral"
        variant="outline"
        aria-label="Last page"
        :disabled="!canGoNext"
        @click="lastPage"
      />
    </div>

    <div class="flex flex-wrap justify-center gap-1">
      <UButton
        v-for="page in totalPages"
        :key="page"
        :label="String(page)"
        size="xs"
        :color="page === currentPage ? 'primary' : 'neutral'"
        :variant="page === currentPage ? 'solid' : 'outline'"
        @click="goToPage(page)"
      />
    </div>
  </div>
</template>
