<template>
  <div class="flex items-center gap-1">
    <!-- Zoom Out -->
    <UButton
      icon="i-heroicons-minus"
      color="neutral"
      variant="ghost"
      size="sm"
      :title="t('zoomOut')"
      :disabled="scale <= minScale"
      @click="handleZoomOut"
    />

    <!-- Zoom Input / Dropdown -->
    <UPopover
      :open="isDropdownOpen"
      @update:open="isDropdownOpen = $event"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        class="min-w-[100px] justify-between px-2"
      >
        <template v-if="isEditing">
          <input
            ref="inputRef"
            v-model="inputValue"
            type="text"
            class="w-14 bg-transparent text-center text-sm outline-none"
            @keydown.enter="applyCustomZoom"
            @keydown.escape="cancelEdit"
            @blur="applyCustomZoom"
          >
        </template>
        <template v-else>
          <span
            class="truncate cursor-pointer"
            @click.stop="startEdit"
          >{{ displayValue }}</span>
        </template>
        <UIcon
          name="i-heroicons-chevron-down"
          class="size-4 shrink-0"
        />
      </UButton>

      <template #content>
        <div class="p-1 min-w-[160px]">
          <!-- Special Modes -->
          <div class="border-b border-gray-200 dark:border-gray-700 pb-1 mb-1">
            <button
              v-for="mode in specialModes"
              :key="mode.value"
              class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="handleSelectMode(mode.value)"
            >
              <UIcon
                v-if="isActiveMode(mode.value)"
                name="i-heroicons-check"
                class="size-4 text-primary"
              />
              <span
                v-else
                class="size-4"
              />
              <span>{{ mode.label }}</span>
            </button>
          </div>

          <!-- Percentage Presets -->
          <div>
            <button
              v-for="preset in presets"
              :key="preset"
              class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="handleSelectPreset(preset)"
            >
              <UIcon
                v-if="isActivePreset(preset)"
                name="i-heroicons-check"
                class="size-4 text-primary"
              />
              <span
                v-else
                class="size-4"
              />
              <span>{{ (preset * 100).toFixed(0) }}%</span>
            </button>
          </div>
        </div>
      </template>
    </UPopover>

    <!-- Zoom In -->
    <UButton
      icon="i-heroicons-plus"
      color="neutral"
      variant="ghost"
      size="sm"
      :title="t('zoomIn')"
      :disabled="scale >= maxScale"
      @click="handleZoomIn"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

type ZoomMode = 'auto' | 'page-actual' | 'page-fit' | 'page-width' | number

interface Props {
  scale: number
  zoomMode?: ZoomMode
  presets?: number[]
  minScale?: number
  maxScale?: number
  containerWidth?: number
  containerHeight?: number
  pageWidth?: number
  pageHeight?: number
}

interface Emits {
  (e: 'update:scale', value: number): void
  (e: 'update:zoomMode', value: ZoomMode): void
  (e: 'zoomIn' | 'zoomOut'): void
}

const props = withDefaults(defineProps<Props>(), {
  zoomMode: 1.0,
  presets: () => [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0],
  minScale: 0.25,
  maxScale: 10.0,
  containerWidth: 800,
  containerHeight: 600,
  pageWidth: 612,
  pageHeight: 792,
})

const emit = defineEmits<Emits>()

const isDropdownOpen = ref(false)
const isEditing = ref(false)
const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const specialModes = [
  { value: 'page-actual' as const, label: 'Actual Size' },
  { value: 'page-fit' as const, label: 'Page Fit' },
  { value: 'page-width' as const, label: 'Page Width' },
  { value: 'auto' as const, label: 'Automatic Zoom' },
]

const displayValue = computed(() => {
  if (typeof props.zoomMode === 'string') {
    const mode = specialModes.find(m => m.value === props.zoomMode)
    return mode?.label || `${Math.round(props.scale * 100)}%`
  }
  return `${Math.round(props.scale * 100)}%`
})

const isActiveMode = (mode: string) => {
  return props.zoomMode === mode
}

const isActivePreset = (preset: number) => {
  return typeof props.zoomMode === 'number'
    && Math.abs(props.scale - preset) < 0.01
}

const t = (key: string) => {
  const translations: Record<string, string> = {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
  }
  return translations[key] || key
}

const startEdit = () => {
  isEditing.value = true
  inputValue.value = `${Math.round(props.scale * 100)}`
  nextTick(() => {
    inputRef.value?.select()
  })
}

const cancelEdit = () => {
  isEditing.value = false
  inputValue.value = ''
}

const applyCustomZoom = () => {
  isEditing.value = false
  const numValue = Number.parseFloat(inputValue.value.replace('%', '').trim())
  if (!Number.isNaN(numValue) && numValue > 0) {
    // Clamp value to min/max range
    const clampedValue = Math.max(props.minScale * 100, Math.min(props.maxScale * 100, numValue))
    const newScale = clampedValue / 100
    emit('update:scale', newScale)
    emit('update:zoomMode', newScale)
  }
  inputValue.value = ''
}

const handleZoomIn = () => {
  emit('zoomIn')
}

const handleZoomOut = () => {
  emit('zoomOut')
}

const handleSelectMode = (mode: 'auto' | 'page-actual' | 'page-fit' | 'page-width') => {
  isDropdownOpen.value = false

  // Calculate scale based on mode
  let newScale = props.scale
  const padding = 40 // padding around the page

  switch (mode) {
    case 'page-actual':
      newScale = 1.0
      break
    case 'page-fit': {
      // Fit entire page in view
      const fitWidth = (props.containerWidth - padding) / props.pageWidth
      const fitHeight = (props.containerHeight - padding) / props.pageHeight
      newScale = Math.min(fitWidth, fitHeight)
      break
    }
    case 'page-width': {
      // Fit page width
      newScale = (props.containerWidth - padding) / props.pageWidth
      break
    }
    case 'auto': {
      // Auto zoom - fit width but not exceed 100%
      const autoWidth = (props.containerWidth - padding) / props.pageWidth
      newScale = Math.min(autoWidth, 1.0)
      break
    }
  }

  // Clamp to min/max
  newScale = Math.max(props.minScale, Math.min(props.maxScale, newScale))

  emit('update:scale', newScale)
  emit('update:zoomMode', mode)
}

const handleSelectPreset = (preset: number) => {
  isDropdownOpen.value = false
  emit('update:scale', preset)
  emit('update:zoomMode', preset)
}
</script>

<style scoped></style>
