<template>
  <UButton
    :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
    color="neutral"
    variant="ghost"
    size="sm"
    :title="t('toggleTheme')"
    @click="handleToggle"
  />
</template>

<script setup lang="ts">
interface Props {
  isDark: boolean
}

interface Emits {
  (e: 'toggle'): void
}

const _props = defineProps<Props>()
const emit = defineEmits<Emits>()

const t = (key: string) => {
  const translations: Record<string, string> = {
    toggleTheme: 'Toggle theme',
  }
  return translations[key] || key
}

const handleToggle = () => {
  emit('toggle')
}
</script>
