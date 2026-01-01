<template>
  <UButton
    icon="i-heroicons-printer"
    color="neutral"
    variant="ghost"
    size="sm"
    :title="t('print')"
    @click="handlePrint"
  />
</template>

<script setup lang="ts">
interface Emits {
  (e: 'print'): void
}

const emit = defineEmits<Emits>()

const t = (key: string) => {
  const translations: Record<string, string> = {
    print: 'Print',
  }
  return translations[key] || key
}

const handlePrint = () => {
  emit('print')
}
</script>
