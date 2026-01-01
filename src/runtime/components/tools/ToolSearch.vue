<template>
  <UPopover
    v-model:open="isPopoverOpen"
    :content="{ side: 'bottom', align: 'center', sideOffset: 8 }"
  >
    <!-- Trigger Button -->
    <UButton
      icon="i-heroicons-magnifying-glass"
      color="primary"
      variant="ghost"
      :title="t('search')"
    />

    <!-- Search Panel Content -->
    <template #content>
      <div class="flex items-center gap-1 p-2 min-w-[320px]">
        <!-- Search Input -->
        <UInput
          v-model="localSearchQuery"
          size="sm"
          class="flex-1"
          icon="i-heroicons-magnifying-glass"
          :placeholder="t('searchPlaceholder')"
          @keydown.enter="handleSearch"
        />

        <!-- Search Button -->
        <UButton
          icon="i-heroicons-magnifying-glass"
          color="primary"
          variant="ghost"
          size="sm"
          :title="t('search')"
          @click="handleSearch"
        />

        <div class="w-px h-5 bg-gray-300" />

        <!-- Navigation Prev/Next -->
        <UButton
          icon="i-heroicons-chevron-left"
          color="primary"
          variant="ghost"
          size="sm"
          :disabled="!hasMatches"
          :title="t('previousMatch')"
          @click="handlePrevMatch"
        />
        <UButton
          icon="i-heroicons-chevron-right"
          color="primary"
          variant="ghost"
          size="sm"
          :disabled="!hasMatches"
          :title="t('nextMatch')"
          @click="handleNextMatch"
        />

        <div class="w-px h-5 bg-gray-300" />

        <!-- Options Popover (nested) -->
        <UPopover :content="{ side: 'bottom', align: 'end', sideOffset: 8 }">
          <UButton
            icon="i-heroicons-adjustments-horizontal"
            color="primary"
            variant="ghost"
            size="sm"
            :title="t('searchOptions')"
          />

          <template #content>
            <div class="p-3 space-y-2 min-w-[180px]">
              <div class="text-xs font-medium text-gray-500 mb-2">
                {{ t('searchOptions') }}
              </div>
              <UCheckbox
                :model-value="caseSensitive"
                :label="t('caseSensitive')"
                @update:model-value="handleToggleCaseSensitive"
              />
              <UCheckbox
                :model-value="wholeWords"
                :label="t('wholeWords')"
                @update:model-value="handleToggleWholeWords"
              />
            </div>
          </template>
        </UPopover>

        <!-- Close Button -->
        <UButton
          icon="i-heroicons-x-mark"
          color="primary"
          variant="ghost"
          size="sm"
          :title="t('close')"
          @click="handleClose"
        />
      </div>

      <!-- Match Counter -->
      <div
        v-if="localSearchQuery"
        class="px-3 pb-2 text-xs"
        :class="hasMatches ? 'text-gray-500' : 'text-red-500'"
      >
        <template v-if="isSearching">
          {{ t('searching') }}
        </template>
        <template v-else-if="hasMatches">
          {{ currentMatchIndex + 1 }} / {{ totalMatches }} {{ t('matches') }}
        </template>
        <template v-else>
          {{ t('noMatches') }}
        </template>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  searchQuery?: string
  currentMatchIndex?: number
  totalMatches?: number
  hasMatches?: boolean
  isSearching?: boolean
  caseSensitive?: boolean
  wholeWords?: boolean
  isDark?: boolean
}

interface Emits {
  (e: 'search', query: string): void
  (e: 'nextMatch' | 'prevMatch' | 'clear' | 'toggleCaseSensitive' | 'toggleWholeWords'): void
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  currentMatchIndex: -1,
  totalMatches: 0,
  hasMatches: false,
  isSearching: false,
  caseSensitive: false,
  wholeWords: false,
  isDark: false,
})

const emit = defineEmits<Emits>()

const localSearchQuery = ref(props.searchQuery)
const isPopoverOpen = ref(false)

// Translations
const t = (key: string) => {
  const translations: Record<string, string> = {
    search: 'Search',
    searchPlaceholder: 'Search in document...',
    clear: 'Clear search',
    previousMatch: 'Previous match',
    nextMatch: 'Next match',
    searchOptions: 'Search options',
    caseSensitive: 'Case sensitive',
    wholeWords: 'Whole words',
    close: 'Close search',
    noMatches: 'No matches found',
    matches: 'matches',
    searching: 'Searching...',
  }
  return translations[key] || key
}

// Sync external searchQuery with local
watch(() => props.searchQuery, (newQuery) => {
  localSearchQuery.value = newQuery
})

const handleSearch = () => {
  if (localSearchQuery.value.trim()) {
    emit('search', localSearchQuery.value)
  }
}

const handleNextMatch = () => {
  emit('nextMatch')
}

const handlePrevMatch = () => {
  emit('prevMatch')
}

const handleToggleCaseSensitive = () => {
  emit('toggleCaseSensitive')
  // Re-search with new option
  if (localSearchQuery.value.trim()) {
    emit('search', localSearchQuery.value)
  }
}

const handleToggleWholeWords = () => {
  emit('toggleWholeWords')
  // Re-search with new option
  if (localSearchQuery.value.trim()) {
    emit('search', localSearchQuery.value)
  }
}

const handleClose = () => {
  emit('clear')
  localSearchQuery.value = ''
  isPopoverOpen.value = false
}
</script>

<style scoped>
/* All styling handled by Nuxt UI components and Tailwind classes */
</style>
