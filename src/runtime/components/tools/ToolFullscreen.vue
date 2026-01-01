<template>
  <UButton
    :icon="isFullscreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
    color="neutral"
    variant="ghost"
    size="sm"
    :title="isFullscreen ? t('exitFullscreen') : t('enterFullscreen')"
    @click="handleToggle"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Emits {
  (e: 'toggle', isFullscreen: boolean): void
}

const emit = defineEmits<Emits>()

const isFullscreen = ref(false)

const t = (key: string) => {
  const translations: Record<string, string> = {
    enterFullscreen: 'Enter fullscreen',
    exitFullscreen: 'Exit fullscreen',
  }
  return translations[key] || key
}

const handleToggle = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Fullscreen error: ${err.message}`)
    })
  }
  else {
    document.exitFullscreen()
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
  emit('toggle', isFullscreen.value)
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>
