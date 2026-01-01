<template>
  <div class="flex items-center gap-1">
    <!-- First Page -->
    <UButton
      icon="i-heroicons-chevron-double-left"
      color="neutral"
      variant="ghost"
      size="sm"
      :disabled="!canGoPrev"
      :title="t('firstPage')"
      @click="handleFirstPage"
    />

    <!-- Previous Page -->
    <UButton
      icon="i-heroicons-chevron-left"
      color="neutral"
      variant="ghost"
      size="sm"
      :disabled="!canGoPrev"
      :title="t('previousPage')"
      @click="handlePrevPage"
    />

    <!-- Page Input -->
    <div class="flex items-center gap-1">
      <UInput
        ref="pageInputRef"
        type="number"
        size="sm"
        class="w-14"
        :model-value="currentPage"
        :min="1"
        :max="totalPages"
        @input="handlePageInput"
        @keydown.enter="handlePageSubmit"
        @blur="handlePageSubmit"
      />
      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">/ {{ totalPages }}</span>
    </div>

    <!-- Next Page -->
    <UButton
      icon="i-heroicons-chevron-right"
      color="neutral"
      variant="ghost"
      size="sm"
      :disabled="!canGoNext"
      :title="t('nextPage')"
      @click="handleNextPage"
    />

    <!-- Last Page -->
    <UButton
      icon="i-heroicons-chevron-double-right"
      color="neutral"
      variant="ghost"
      size="sm"
      :disabled="!canGoNext"
      :title="t('lastPage')"
      @click="handleLastPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  pageLabels?: string[]
}

interface Emits {
  (e: 'update:currentPage' | 'goto', value: number): void
  (e: 'first' | 'last' | 'prev' | 'next'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const pageInputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref(props.currentPage)

const canGoPrev = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < props.totalPages)

const t = (key: string) => {
  const translations: Record<string, string> = {
    firstPage: 'First page',
    lastPage: 'Last page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
  }
  return translations[key] || key
}

const handleFirstPage = () => {
  emit('update:currentPage', 1)
  emit('first')
  emit('goto', 1)
}

const handleLastPage = () => {
  emit('update:currentPage', props.totalPages)
  emit('last')
  emit('goto', props.totalPages)
}

const handlePrevPage = () => {
  if (canGoPrev.value) {
    const newPage = props.currentPage - 1
    emit('update:currentPage', newPage)
    emit('prev')
    emit('goto', newPage)
  }
}

const handleNextPage = () => {
  if (canGoNext.value) {
    const newPage = props.currentPage + 1
    emit('update:currentPage', newPage)
    emit('next')
    emit('goto', newPage)
  }
}

const handlePageInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  inputValue.value = Number.parseInt(target.value) || props.currentPage
}

const handlePageSubmit = () => {
  let page = inputValue.value

  if (page < 1) page = 1
  if (page > props.totalPages) page = props.totalPages

  if (page !== props.currentPage) {
    emit('update:currentPage', page)
    emit('goto', page)
  }
}
</script>
