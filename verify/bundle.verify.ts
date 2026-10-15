import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { INITIAL_BUDGET_BYTES, measureInitialBundle } from '../tools/bundle'

const DIST = resolve(__dirname, '..', 'dist')

// RNF-05 / AC-59: la descarga inicial (JS + CSS + HTML, comprimida) pesa 300 KB o menos.
describe('RNF-05: presupuesto de descarga inicial', () => {
  it.skipIf(!existsSync(resolve(DIST, 'index.html')))('el build de producción está dentro del presupuesto', () => {
    const html = readFileSync(resolve(DIST, 'index.html'), 'utf8')
    const report = measureInitialBundle(html, (path) => readFileSync(resolve(DIST, path)))
    console.table(report.files.map((f) => ({ archivo: f.path, 'KB comprimidos': (f.bytes / 1024).toFixed(1) })))
    console.log(`\nTotal inicial: ${(report.totalBytes / 1024).toFixed(1)} KB de ${INITIAL_BUDGET_BYTES / 1024} KB`)
    expect(report.totalBytes).toBeLessThanOrEqual(INITIAL_BUDGET_BYTES)
  })
})
