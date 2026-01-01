import { ref } from 'vue'

export interface UsePdfKitRotationOptions {
  initialRotation?: number
}

export function usePdfKitRotation(options: UsePdfKitRotationOptions = {}) {
  const { initialRotation = 0 } = options

  const rotation = ref(initialRotation)

  const rotateClockwise = () => {
    rotation.value = (rotation.value + 90) % 360
  }

  const rotateCounterclockwise = () => {
    rotation.value = (rotation.value - 90 + 360) % 360
  }

  const setRotation = (degrees: number) => {
    rotation.value = degrees % 360
  }

  return {
    rotation,
    rotateClockwise,
    rotateCounterclockwise,
    setRotation,
  }
}
