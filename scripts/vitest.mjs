// scripts/vitest.mjs
// Normalizes Windows drive letter to uppercase BEFORE vitest starts.
// Fixes: vitest#10812, vitest#10692, vitest#5251
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const isWindows = process.platform === 'win32'

function normalizeWindowsCwd(cwd) {
  if (!isWindows) return cwd
  // C:\foo → C:\foo (already OK)
  // c:\foo → C:\foo (fix lowercase drive letter)
  return cwd.replace(/^([a-z]):/i, (_, letter) => letter.toUpperCase() + ':')
}

const rawCwd = process.cwd()
const normalCwd = normalizeWindowsCwd(rawCwd)

if (rawCwd !== normalCwd) {
  // Drive letter is lowercase → re-spawn this same script with correct cwd
  // so that when vitest loads, process.cwd() AND import.meta.url are uppercase
  console.log(`[vitest-wrapper] Normalizing drive letter: ${rawCwd} → ${normalCwd}`)

  const result = spawnSync(
    process.execPath, // same node binary
    [fileURLToPath(import.meta.url), ...process.argv.slice(2)], // re-run this script
    {
      cwd: normalCwd, // ← UPPERCASE cwd from the start
      stdio: 'inherit',
      env: process.env,
    },
  )
  process.exit(result.status ?? 1)
}
else {
  // cwd already normalized → run vitest directly
  const vitestBin = resolve(normalCwd, 'node_modules', 'vitest', 'vitest.mjs')
  const args = process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : ['run'] // default: vitest run

  const result = spawnSync(
    process.execPath,
    [vitestBin, ...args],
    {
      cwd: normalCwd,
      stdio: 'inherit',
      env: process.env,
    },
  )
  process.exit(result.status ?? 1)
}
