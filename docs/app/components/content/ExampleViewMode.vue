<script setup lang="ts">
const totalPages = 8
const currentPage = ref(1)

const { viewMode, pagesPerView, setViewMode, getVisiblePages } = usePdfKitViewMode()

const modes = ['single', 'dual', 'dual-cover'] as const
const visiblePages = computed(() => getVisiblePages(currentPage.value, totalPages))
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex flex-wrap items-center justify-center gap-2">
      <UButton
        v-for="mode in modes"
        :key="mode"
        :label="mode"
        :color="mode === viewMode ? 'primary' : 'neutral'"
        :variant="mode === viewMode ? 'solid' : 'outline'"
        @click="setViewMode(mode)"
      />
    </div>

    <div class="flex items-center gap-2">
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="outline"
        aria-label="Previous page"
        :disabled="currentPage <= 1"
        @click="currentPage--"
      />
      <span class="w-40 text-center tabular-nums">Current page {{ currentPage }} of {{ totalPages }}</span>
      <UButton
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="outline"
        aria-label="Next page"
        :disabled="currentPage >= totalPages"
        @click="currentPage++"
      />
    </div>

    <div class="flex h-32 w-full items-center justify-center gap-2 rounded-md border border-default">
      <div
        v-for="page in visiblePages"
        :key="page"
        class="flex h-24 w-16 items-center justify-center rounded-sm border border-default bg-elevated text-sm"
      >
        {{ page }}
      </div>
    </div>

    <p class="text-sm text-muted">
      {{ pagesPerView }} page(s) per view, showing {{ visiblePages.join(' and ') }}
    </p>
  </div>
</template>
