import { gzipSync } from 'node:zlib'

/** Presupuesto de descarga inicial (JS + CSS + HTML, comprimido): 300 KB (RNF-05). */
export const INITIAL_BUDGET_BYTES = 300 * 1024

/** Archivos que descarga la página de inicio: scripts, hojas de estilo y precargas de módulos. */
export function initialAssetPaths(html: string): string[] {
  const paths = new Set<string>()
  for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g)) paths.add(match[1] as string)
  for (const match of html.matchAll(/<link[^>]+rel="(?:stylesheet|modulepreload)"[^>]*href="([^"]+)"/g)) paths.add(match[1] as string)
  for (const match of html.matchAll(/<link[^>]+href="([^"]+)"[^>]*rel="(?:stylesheet|modulepreload)"/g)) paths.add(match[1] as string)
  return [...paths].filter((path) => !/^https?:/.test(path)).map((path) => path.replace(/^\//, ''))
}

export const gzipBytes = (content: Buffer | string): number => gzipSync(content).length

export interface BundleReport {
  files: { path: string; bytes: number }[]
  totalBytes: number
  withinBudget: boolean
}

/** Calcula el peso comprimido de la descarga inicial; `read` devuelve el contenido de un archivo de `dist`. */
export function measureInitialBundle(html: string, read: (path: string) => Buffer): BundleReport {
  const files = [
    { path: 'index.html', bytes: gzipBytes(html) },
    ...initialAssetPaths(html).map((path) => ({ path, bytes: gzipBytes(read(path)) })),
  ]
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0)
  return { files, totalBytes, withinBudget: totalBytes <= INITIAL_BUDGET_BYTES }
}
