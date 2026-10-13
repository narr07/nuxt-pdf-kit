<script setup lang="ts">
const { rotation, rotateClockwise, rotateCounterclockwise, setRotation } = usePdfKitRotation()
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex items-center gap-2">
      <UButton
        icon="i-lucide-rotate-ccw"
        color="neutral"
        variant="outline"
        aria-label="Rotate counterclockwise"
        @click="rotateCounterclockwise"
      />
      <span class="w-14 text-center tabular-nums">{{ rotation }}°</span>
      <UButton
        icon="i-lucide-rotate-cw"
        color="neutral"
        variant="outline"
        aria-label="Rotate clockwise"
        @click="rotateClockwise"
      />
      <UButton
        label="Reset"
        color="neutral"
        variant="ghost"
        @click="setRotation(0)"
      />
    </div>

    <div class="flex h-40 w-full items-center justify-center overflow-hidden rounded-md border border-default">
      <div
        class="flex h-24 w-16 items-start justify-center rounded-sm border border-default bg-elevated pt-2 text-xs transition-transform"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        Top
      </div>
    </div>
  </div>
</template>
