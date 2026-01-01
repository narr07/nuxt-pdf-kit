<template>
  <UButton
    icon="i-heroicons-arrow-down-tray"
    color="neutral"
    variant="ghost"
    size="sm"
    :title="t('download')"
    @click="handleDownload"
  />
</template>

<script setup lang="ts">
interface Emits {
  (e: 'download'): void
}

const emit = defineEmits<Emits>()

const t = (key: string) => {
  const translations: Record<string, string> = {
    download: 'Download',
  }
  return translations[key] || key
}

const handleDownload = () => {
  emit('download')
}
</script>
