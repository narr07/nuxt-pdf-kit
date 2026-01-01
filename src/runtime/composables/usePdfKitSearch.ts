import { ref, computed } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

export interface PdfKitSearchMatch {
  pageIndex: number
  matchIndex: number
  text: string
}

export interface PdfKitSearchOptions {
  caseSensitive?: boolean
  wholeWords?: boolean
}

export function usePdfKitSearch() {
  const searchQuery = ref('')
  const matches = ref<PdfKitSearchMatch[]>([])
  const currentMatchIndex = ref(-1)
  const isSearching = ref(false)
  const searchOptions = ref<PdfKitSearchOptions>({
    caseSensitive: false,
    wholeWords: false,
  })

  const totalMatches = computed(() => matches.value.length)
  const hasMatches = computed(() => totalMatches.value > 0)
  const currentMatch = computed(() => {
    if (currentMatchIndex.value >= 0 && currentMatchIndex.value < matches.value.length) {
      return matches.value[currentMatchIndex.value]
    }
    return null
  })

  const search = async (pdfDoc: PDFDocumentProxy | null, query: string, options: PdfKitSearchOptions = {}) => {
    if (!pdfDoc || !query.trim()) {
      clearSearch()
      return
    }

    isSearching.value = true
    searchQuery.value = query
    searchOptions.value = { ...searchOptions.value, ...options }
    matches.value = []

    try {
      const numPages = pdfDoc.numPages
      let searchText = query

      // Prepare search pattern
      if (!searchOptions.value.caseSensitive) {
        searchText = searchText.toLowerCase()
      }

      // Search through all pages
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum)
        const textContent = await page.getTextContent()

        let pageText = textContent.items
          .map(item => 'str' in item ? item.str : '')
          .join(' ')

        if (!searchOptions.value.caseSensitive) {
          pageText = pageText.toLowerCase()
        }

        // Find all matches in this page
        if (searchOptions.value.wholeWords) {
          const regex = new RegExp(`\\b${escapeRegExp(searchText)}\\b`, searchOptions.value.caseSensitive ? 'g' : 'gi')
          let match
          let matchIndex = 0
          while ((match = regex.exec(pageText)) !== null) {
            matches.value.push({
              pageIndex: pageNum - 1,
              matchIndex: matchIndex++,
              text: match[0],
            })
          }
        }
        else {
          let index = pageText.indexOf(searchText)
          let matchIndex = 0
          while (index !== -1) {
            matches.value.push({
              pageIndex: pageNum - 1,
              matchIndex: matchIndex++,
              text: searchText,
            })
            index = pageText.indexOf(searchText, index + 1)
          }
        }
      }

      // Set current match to first result
      if (matches.value.length > 0) {
        currentMatchIndex.value = 0
      }
    }
    catch (error) {
      console.error('Search error:', error)
    }
    finally {
      isSearching.value = false
    }
  }

  const nextMatch = () => {
    if (matches.value.length === 0) return
    currentMatchIndex.value = (currentMatchIndex.value + 1) % matches.value.length
  }

  const prevMatch = () => {
    if (matches.value.length === 0) return
    currentMatchIndex.value = currentMatchIndex.value <= 0
      ? matches.value.length - 1
      : currentMatchIndex.value - 1
  }

  const clearSearch = () => {
    searchQuery.value = ''
    matches.value = []
    currentMatchIndex.value = -1
    isSearching.value = false
  }

  const toggleCaseSensitive = () => {
    searchOptions.value.caseSensitive = !searchOptions.value.caseSensitive
  }

  const toggleWholeWords = () => {
    searchOptions.value.wholeWords = !searchOptions.value.wholeWords
  }

  return {
    searchQuery,
    matches,
    currentMatchIndex,
    currentMatch,
    totalMatches,
    hasMatches,
    isSearching,
    searchOptions,
    search,
    nextMatch,
    prevMatch,
    clearSearch,
    toggleCaseSensitive,
    toggleWholeWords,
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
