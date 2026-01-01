<template>
  <div
    ref="textLayerRef"
    class="npk-layer-text"
    :style="textLayerStyle"
  />
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import type { PDFPageProxy, TextContent, TextItem } from 'pdfjs-dist/types/src/display/api'

interface Props {
  page: PDFPageProxy | null
  scale: number
  rotation: number
  searchQuery?: string
  caseSensitive?: boolean
  pageNumber?: number
  currentMatchPage?: number
  currentMatchIndexInPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  caseSensitive: false,
  pageNumber: 0,
  currentMatchPage: -1,
  currentMatchIndexInPage: -1,
})

const textLayerRef = ref<HTMLDivElement | null>(null)
const textLayerStyle = ref<Record<string, string>>({})

const render = async () => {
  if (!props.page || !textLayerRef.value) return

  const container = textLayerRef.value
  container.innerHTML = ''

  const viewport = props.page.getViewport({
    scale: props.scale,
    rotation: props.rotation,
  })

  // Set container dimensions
  textLayerStyle.value = {
    width: `${viewport.width}px`,
    height: `${viewport.height}px`,
  }

  try {
    const textContent: TextContent = await props.page.getTextContent()
    const fragment = document.createDocumentFragment()

    // Track match index within this page for current highlight
    let matchIndexInPage = 0
    const isCurrentPage = props.pageNumber === props.currentMatchPage

    for (const item of textContent.items) {
      if (!('str' in item) || !item.str) continue

      const textItem = item as TextItem
      const span = document.createElement('span')
      span.className = 'npk-text-span'

      // Apply search highlighting
      if (props.searchQuery && props.searchQuery.length > 0) {
        const text = textItem.str
        const query = props.searchQuery
        const flags = props.caseSensitive ? 'g' : 'gi'
        const regex = new RegExp(`(${escapeRegExp(query)})`, flags)

        if (regex.test(text)) {
          regex.lastIndex = 0
          // Replace with highlight, marking current match differently
          let resultHtml = ''
          let lastIndex = 0
          let match
          const searchRegex = new RegExp(`(${escapeRegExp(query)})`, flags)

          while ((match = searchRegex.exec(text)) !== null) {
            // Add text before match
            resultHtml += escapeHtml(text.slice(lastIndex, match.index))

            // Check if this is the current match
            const isCurrent = isCurrentPage && matchIndexInPage === props.currentMatchIndexInPage
            const highlightClass = isCurrent ? 'npk-highlight npk-highlight-current' : 'npk-highlight'

            resultHtml += `<mark class="${highlightClass}">${escapeHtml(match[1])}</mark>`
            lastIndex = searchRegex.lastIndex
            matchIndexInPage++
          }

          // Add remaining text
          resultHtml += escapeHtml(text.slice(lastIndex))
          span.innerHTML = resultHtml
        }
        else {
          span.textContent = text
        }
      }
      else {
        span.textContent = textItem.str
      }

      // Get transform from the text item
      // transform = [scaleX, skewY, skewX, scaleY, translateX, translateY]
      const tx = textItem.transform

      // Calculate font size from the transform matrix
      // For a typical text item, tx[0] and tx[3] represent horizontal and vertical scale factors
      const fontSize = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3])

      // Apply viewport transform to get screen coordinates
      // viewport.transform = [scaleX, skewY, skewX, scaleY, offsetX, offsetY]
      const vt = viewport.transform
      if (!vt || vt.length < 6) continue

      // Transform the PDF text position to viewport position
      // x' = translate_x * vt[0] + translate_y * vt[2] + vt[4]
      // y' = translate_x * vt[1] + translate_y * vt[3] + vt[5]
      const x = tx[4] * vt[0]! + tx[5] * vt[2]! + vt[4]!
      const y = tx[4] * vt[1]! + tx[5] * vt[3]! + vt[5]!

      // Calculate scaled font size
      const scaledFontSize = fontSize * props.scale

      // The y coordinate is at the baseline, so we need to adjust for font height
      const top = y - scaledFontSize

      // Calculate item width in viewport coordinates
      const itemWidth = textItem.width * props.scale

      // Calculate horizontal scaling factor
      // This accounts for stretched/compressed text
      const scaleXFactor = Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1]) / fontSize

      span.style.cssText = `
        left: ${x}px;
        top: ${top}px;
        font-size: ${scaledFontSize}px;
        width: ${itemWidth}px;
        height: ${scaledFontSize * 1.2}px;
        transform: scaleX(${scaleXFactor});
        transform-origin: 0% 0%;
      `

      fragment.appendChild(span)
    }

    container.appendChild(fragment)
  }
  catch (error) {
    console.error('Text layer error:', error)
  }
}

const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const escapeHtml = (str: string) => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  }
  return str.replace(/[&<>"']/g, char => htmlEscapes[char] || char)
}

watch(
  () => [props.page, props.scale, props.rotation, props.searchQuery, props.caseSensitive, props.currentMatchPage, props.currentMatchIndexInPage],
  async () => {
    await nextTick()
    render()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (textLayerRef.value) {
    textLayerRef.value.innerHTML = ''
  }
})

defineExpose({ render })
</script>

<style>
.npk-layer-text {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  user-select: text;
  pointer-events: auto;
  line-height: 1;
  z-index: 2;
}

.npk-layer-text .npk-text-span {
  position: absolute;
  white-space: nowrap;
  color: transparent;
  cursor: text;
  overflow: hidden;
  text-overflow: clip;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  font-family: sans-serif;
  /* Prevent selection from extending beyond bounds */
  -webkit-user-select: text;
  user-select: text;
}

.npk-layer-text .npk-text-span::selection {
  background: rgba(0, 100, 255, 0.4);
}

.npk-layer-text .npk-highlight {
  background: rgba(255, 235, 59, 0.6);
  color: transparent;
  padding: 1px 0;
  border-radius: 2px;
  box-shadow: 0 0 0 2px rgba(255, 235, 59, 0.6);
}

/* Current/active highlight */
.npk-layer-text .npk-highlight.npk-highlight-current {
  background: rgba(255, 152, 0, 0.8);
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.8);
}

.npk-layer-text .npk-highlight::selection {
  background: rgba(0, 100, 255, 0.6);
}
</style>
