<template>
  <div>
    <div id="test-marker">
      basic
    </div>

    <!-- Test PDF Viewer Component -->
    <div
      id="pdf-container"
      style="height: 600px;"
    >
      <NuxtPdfKit
        src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
        title="Test Document"
        author="Test Author"
      />
    </div>
  </div>
</template>

<script setup>
// Composables are auto-imported in Nuxt
