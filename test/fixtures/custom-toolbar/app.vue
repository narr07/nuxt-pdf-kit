<template>
  <div>
    <div id="test-marker">
      custom-toolbar
    </div>

    <div
      id="pdf-container"
      style="height: 600px;"
    >
      <NuxtPdfKit
        src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
      />
    </div>
  </div>
</template>
