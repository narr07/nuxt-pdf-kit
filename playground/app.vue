<template>
  <div style="height: 100vh; width: 100vw; display: flex; flex-direction: column;">
    <!-- Provider Selector -->
    <div class="p-3 bg-gray-100 dark:bg-gray-800 border-b flex items-center gap-3">
      <label class="text-sm font-medium">Provider:</label>
      <select
        v-model="selectedProvider"
        class="px-3 py-1.5 rounded border bg-white dark:bg-gray-700"
      >
        <option value="url">
          Direct URL
        </option>
        <option value="gdrive">
          Google Drive
        </option>
      </select>

      <label class="text-sm font-medium ml-4">Pilih Buku:</label>
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
        :provider="selectedProvider"
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

// Selected provider
const selectedProvider = ref('url')

// Daftar buku
const daftarBuku = ref([
  {
    judul: 'Trace Monkey - JavaScript Tracing (Direct URL)',
    penulis: 'Mozilla Research',
    kategori: 'Programming',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    judul: 'Bahasa Indonesia Kelas 1 (Google Drive)',
    penulis: 'Kemendikbud',
    kategori: 'Pendidikan',
    fileUrl: '1bAsv95pTaBiHyGiWFIa-zebT31Al_0tu', // Google Drive ID
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
