import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

// Normalize drive letter to uppercase (E:\ -> E:\) to avoid the
// Windows drive-letter case mismatch that breaks the vitest worker state.
const normalizeDrive = (p: string) => p.replace(/^([a-z]):/, (_, d) => `${d.toUpperCase()}:`)

const playgroundDir = normalizeDrive(fileURLToPath(new URL('./playground', import.meta.url)))

export default defineConfig({
  // Fix #1 — bun:test cannot be bundled (nuxt/test-utils#1490)
  // @nuxt/test-utils ships Bun support via `await import('bun:test')` in a shared module.
  // Vite 8 (via vitest 4) tries to statically bundle it in the client environment and crashes,
  // so we intercept the id and mark it external before Vite gets a chance to bundle it.
  plugins: [
    {
      name: 'ignore-bun-test',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'bun:test') {
          return { id: 'bun:test', external: true }
        }
      },
    },
  ],
  test: {
    root: normalizeDrive(fileURLToPath(new URL('./', import.meta.url))),
    projects: [
      // Node project: pure unit tests (composable logic, utils)
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      // Fix #2 — E2E tests MUST run in node, NOT nuxt.
      // setup() from @nuxt/test-utils/e2e launches a Nuxt server, which cannot run
      // inside the nuxt (browser sandbox) environment.
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/*.{test,spec}.ts'],
          environment: 'node',
          // setup() from @nuxt/test-utils/e2e builds + starts a Nuxt server
          // before tests run, so give it generous timeouts.
          testTimeout: 60_000,
          hookTimeout: 120_000,
        },
      },
      // Nuxt runtime project: tests that need Nuxt composables/components
      // (use mountSuspended / renderSuspended here — NOT setup() from @nuxt/test-utils/e2e)
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: playgroundDir,
            },
          },
        },
      }),
    ],
  },
})
