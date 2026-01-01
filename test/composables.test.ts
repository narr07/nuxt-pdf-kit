import { describe, it, expect } from 'vitest'

// Unit tests for composables
// These test the composable logic in isolation

describe('usePdfKitZoom composable', () => {
  it('should be importable', async () => {
    const { usePdfKitZoom } = await import('../src/runtime/composables/usePdfKitZoom')
    expect(usePdfKitZoom).toBeDefined()
    expect(typeof usePdfKitZoom).toBe('function')
  })

  it('should return zoom controls', async () => {
    const { usePdfKitZoom } = await import('../src/runtime/composables/usePdfKitZoom')
    const { scale, zoomIn, zoomOut, setZoom, zoomMode } = usePdfKitZoom()

    expect(scale).toBeDefined()
    expect(zoomIn).toBeDefined()
    expect(zoomOut).toBeDefined()
    expect(setZoom).toBeDefined()
    expect(zoomMode).toBeDefined()
  })

  it('should initialize with default scale', async () => {
    const { usePdfKitZoom } = await import('../src/runtime/composables/usePdfKitZoom')
    const { scale } = usePdfKitZoom({ initialScale: 1.5 })

    expect(scale.value).toBe(1.5)
  })

  it('should zoom in correctly', async () => {
    const { usePdfKitZoom } = await import('../src/runtime/composables/usePdfKitZoom')
    const { scale, zoomIn } = usePdfKitZoom({ initialScale: 1.0 })

    zoomIn()
    expect(scale.value).toBeGreaterThan(1.0)
  })

  it('should zoom out correctly', async () => {
    const { usePdfKitZoom } = await import('../src/runtime/composables/usePdfKitZoom')
    const { scale, zoomOut } = usePdfKitZoom({ initialScale: 1.0 })

    zoomOut()
    expect(scale.value).toBeLessThan(1.0)
  })

  it('should respect min/max scale bounds', async () => {
    const { usePdfKitZoom } = await import('../src/runtime/composables/usePdfKitZoom')
    const { scale, setZoom } = usePdfKitZoom({
      initialScale: 1.0,
      minScale: 0.5,
      maxScale: 2.0,
    })

    setZoom(0.1) // Below min
    expect(scale.value).toBeGreaterThanOrEqual(0.5)

    setZoom(10) // Above max
    expect(scale.value).toBeLessThanOrEqual(2.0)
  })
})

describe('usePdfKitViewMode composable', () => {
  it('should be importable', async () => {
    const { usePdfKitViewMode } = await import('../src/runtime/composables/usePdfKitViewMode')
    expect(usePdfKitViewMode).toBeDefined()
    expect(typeof usePdfKitViewMode).toBe('function')
  })

  it('should return view mode controls', async () => {
    const { usePdfKitViewMode } = await import('../src/runtime/composables/usePdfKitViewMode')
    const { viewMode, scrollMode, setViewMode, setScrollMode } = usePdfKitViewMode()

    expect(viewMode).toBeDefined()
    expect(scrollMode).toBeDefined()
    expect(setViewMode).toBeDefined()
    expect(setScrollMode).toBeDefined()
  })

  it('should initialize with default values', async () => {
    const { usePdfKitViewMode } = await import('../src/runtime/composables/usePdfKitViewMode')
    const { viewMode, scrollMode } = usePdfKitViewMode()

    expect(viewMode.value).toBe('single')
    expect(scrollMode.value).toBe('vertical')
  })

  it('should change view mode', async () => {
    const { usePdfKitViewMode } = await import('../src/runtime/composables/usePdfKitViewMode')
    const { viewMode, setViewMode } = usePdfKitViewMode()

    setViewMode('dual')
    expect(viewMode.value).toBe('dual')
  })

  it('should change scroll mode', async () => {
    const { usePdfKitViewMode } = await import('../src/runtime/composables/usePdfKitViewMode')
    const { scrollMode, setScrollMode } = usePdfKitViewMode()

    setScrollMode('horizontal')
    expect(scrollMode.value).toBe('horizontal')
  })
})

describe('usePdfKitRotation composable', () => {
  it('should be importable', async () => {
    const { usePdfKitRotation } = await import('../src/runtime/composables/usePdfKitRotation')
    expect(usePdfKitRotation).toBeDefined()
    expect(typeof usePdfKitRotation).toBe('function')
  })

  it('should return rotation controls', async () => {
    const { usePdfKitRotation } = await import('../src/runtime/composables/usePdfKitRotation')
    const { rotation, rotateClockwise, rotateCounterclockwise, setRotation } = usePdfKitRotation()

    expect(rotation).toBeDefined()
    expect(rotateClockwise).toBeDefined()
    expect(rotateCounterclockwise).toBeDefined()
    expect(setRotation).toBeDefined()
  })

  it('should rotate clockwise by 90 degrees', async () => {
    const { usePdfKitRotation } = await import('../src/runtime/composables/usePdfKitRotation')
    const { rotation, rotateClockwise } = usePdfKitRotation()

    rotateClockwise()
    expect(rotation.value).toBe(90)

    rotateClockwise()
    expect(rotation.value).toBe(180)
  })

  it('should rotate counter-clockwise', async () => {
    const { usePdfKitRotation } = await import('../src/runtime/composables/usePdfKitRotation')
    const { rotation, rotateCounterclockwise } = usePdfKitRotation()

    rotateCounterclockwise()
    expect(rotation.value).toBe(270)
  })

  it('should set rotation directly', async () => {
    const { usePdfKitRotation } = await import('../src/runtime/composables/usePdfKitRotation')
    const { rotation, rotateClockwise, setRotation } = usePdfKitRotation()

    rotateClockwise()
    rotateClockwise()
    setRotation(0)
    expect(rotation.value).toBe(0)
  })
})

describe('usePdfKitPageNavigation composable', () => {
  it('should be importable', async () => {
    const { usePdfKitPageNavigation } = await import('../src/runtime/composables/usePdfKitPageNavigation')
    expect(usePdfKitPageNavigation).toBeDefined()
    expect(typeof usePdfKitPageNavigation).toBe('function')
  })

  it('should return navigation controls', async () => {
    const { usePdfKitPageNavigation } = await import('../src/runtime/composables/usePdfKitPageNavigation')
    const { currentPage, nextPage, prevPage, goToPage } = usePdfKitPageNavigation({ totalPages: 10 })

    expect(currentPage).toBeDefined()
    expect(nextPage).toBeDefined()
    expect(prevPage).toBeDefined()
    expect(goToPage).toBeDefined()
  })

  it('should navigate to next page', async () => {
    const { usePdfKitPageNavigation } = await import('../src/runtime/composables/usePdfKitPageNavigation')
    const { currentPage, nextPage } = usePdfKitPageNavigation({ totalPages: 10 })

    nextPage()
    expect(currentPage.value).toBe(2)
  })

  it('should not go past total pages', async () => {
    const { usePdfKitPageNavigation } = await import('../src/runtime/composables/usePdfKitPageNavigation')
    const { currentPage, goToPage, nextPage } = usePdfKitPageNavigation({ totalPages: 3 })

    goToPage(3)
    nextPage()
    expect(currentPage.value).toBe(3)
  })

  it('should not go before page 1', async () => {
    const { usePdfKitPageNavigation } = await import('../src/runtime/composables/usePdfKitPageNavigation')
    const { currentPage, prevPage } = usePdfKitPageNavigation({ totalPages: 10 })

    prevPage()
    expect(currentPage.value).toBe(1)
  })

  it('should go to first and last page', async () => {
    const { usePdfKitPageNavigation } = await import('../src/runtime/composables/usePdfKitPageNavigation')
    const { currentPage, firstPage, lastPage } = usePdfKitPageNavigation({ totalPages: 10 })

    lastPage()
    expect(currentPage.value).toBe(10)

    firstPage()
    expect(currentPage.value).toBe(1)
  })
})
