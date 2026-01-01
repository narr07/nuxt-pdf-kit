<template>
  <div class="inline-flex">
    <UButton
      icon="i-heroicons-folder-open"
      color="neutral"
      variant="ghost"
      size="sm"
      :title="t('openFile')"
      @click="triggerFileInput"
    />
    <input
      ref="fileInputRef"
      type="file"
      accept=".pdf,application/pdf"
      style="display: none"
      @change="handleFileChange"
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'fileSelected', file: File): void
}

const emit = defineEmits<Emits>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const t = (key: string) => {
  const translations: Record<string, string> = {
    openFile: 'Open file',
  }
  return translations[key] || key
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.type === 'application/pdf') {
    emit('fileSelected', file)
  }

  // Reset input
  if (target) {
    target.value = ''
  }
}

defineExpose({
  triggerFileInput,
})
</script>
