<template>
  <div style="height: 100vh; width: 100vw; display: flex; flex-direction: column;">
    <!-- Book Selector -->
    <div class="p-3 bg-gray-100 dark:bg-gray-800 border-b flex items-center gap-3">
      <label class="text-sm font-medium">Pilih Buku:</label>
      <select
        v-model="selectedBookIndex"
        class="px-3 py-1.5 rounded border bg-white dark:bg-gray-700"
      >
        <option
          v-for="(buku, index) in daftarBuku"
          :key="index"
          :value="index"
        >
          {{ buku.judul }}
        </option>
      </select>
    </div>

    <!-- PDF Viewer -->
    <div style="flex: 1; overflow: hidden;">
      <NuxtPdfKit
        :src="bukuTerpilih.fileUrl"
        :title="bukuTerpilih.judul"
        :author="bukuTerpilih.penulis"
        :subject="bukuTerpilih.kategori"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Daftar buku
const daftarBuku = ref([
  {
    judul: 'Trace Monkey - JavaScript Tracing',
    penulis: 'Mozilla Research',
    kategori: 'Programming',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    judul: 'PDF.js Example Document',
    penulis: 'PDF.js Team',
    kategori: 'Documentation',
    fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  },
])

const selectedBookIndex = ref(0)

const bukuTerpilih = computed(() => daftarBuku.value[selectedBookIndex.value])
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}
</style>
