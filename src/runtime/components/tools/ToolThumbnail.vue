<template>
  <UButton
    :icon="sidebarVisible ? 'i-heroicons-book-open-solid' : 'i-heroicons-book-open'"
    color="neutral"
    variant="ghost"
    size="sm"
    :active="sidebarVisible"
    :title="t('toggleSidebar')"
    @click="handleToggle"
  />
</template>

<script setup lang="ts">
interface Props {
  sidebarVisible: boolean
}

interface Emits {
  (e: 'toggle'): void
}

const _props = defineProps<Props>()
const emit = defineEmits<Emits>()

const t = (key: string) => {
  const translations: Record<string, string> = {
    toggleSidebar: 'Toggle sidebar',
  }
  return translations[key] || key
}

const handleToggle = () => {
  emit('toggle')
}
</script>
