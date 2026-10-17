import { describe, expect, it } from 'vitest'
import { courseIndex } from '@/content'
import { sectionCatalog } from '@/content/data/concepts'
import { commonErrors, ladder, techniques } from '@/content/data/synthesis'
import { richTextToPlain } from '@/content/plainText'

describe('cuadro síntesis (AC-13)', () => {
  it('la escalera tiene 8 niveles, del 7 al 0', () => {
    expect(ladder.map((l) => l.moduleId)).toEqual([7, 6, 5, 4, 3, 2, 1, 0])
    for (const level of ladder) {
      expect(level.name.trim()).not.toBe('')
      expect(level.summary.trim()).not.toBe('')
    }
  })

  it('la tabla de técnicas tiene 8 filas con módulos válidos', () => {
    expect(techniques).toHaveLength(8)
    for (const row of techniques) {
      expect(row.modules.length, row.goal).toBeGreaterThan(0)
      for (const moduleId of row.modules) expect(courseIndex.getModule(moduleId), row.goal).toBeDefined()
    }
  })

  it('hay 11 errores comunes, cada uno con sus secciones', () => {
    expect(commonErrors).toHaveLength(11)
    for (const error of commonErrors) {
      expect(error.references.length, error.text).toBeGreaterThan(0)
      for (const ref of error.references) {
        expect(sectionCatalog.some((s) => s.id === ref), `${error.text} → ${ref}`).toBe(true)
      }
    }
  })

  it('conserva datos de la guía', () => {
    expect(commonErrors[9]?.references).toEqual(['4.2', '6.4'])
    expect(richTextToPlain(commonErrors[1]?.text ?? '')).toContain('probabilidad de que mu esté adentro')
    expect(techniques[2]?.modules).toEqual([4, 5, 6])
    expect(ladder[0]?.name).toBe('Teoría PAC / Dimensión VC')
  })
})

describe('catálogo de secciones', () => {
  it('los títulos de las secciones cargadas coinciden con el catálogo', () => {
    for (const section of courseIndex.sectionIds().map((id) => courseIndex.getSection(id))) {
      if (section?.optional) continue // los anexos opcionales no tienen número en el catálogo
      const entry = sectionCatalog.find((s) => s.id === section?.id)
      expect(richTextToPlain(section?.title ?? ''), section?.id).toBe(entry?.title)
    }
  })

  it('todas las secciones cargadas están en el catálogo, salvo los anexos opcionales', () => {
    for (const id of courseIndex.sectionIds()) {
      if (courseIndex.getSection(id)?.optional) continue
      expect(sectionCatalog.some((s) => s.id === id), id).toBe(true)
    }
  })
})
