import { defineStore } from 'pinia'
import { computed } from 'vue'
import { courseIndex } from '@/content'
import type { ModuleId, Section } from '@/content/types'
import {
  completion,
  isExplicitlyUnmarked,
  markCompleted,
  unmarkCompleted,
  visitSection,
  type Completion,
} from '@/logic/progress/progress'
import { useServices } from '@/services'
import { useUserDataStore } from './userData'

/** Secciones vistas y última visitada (RF-32 a 35). */
export const useProgressStore = defineStore('progress', () => {
  const userData = useUserDataStore()
  const { clock } = useServices()

  const progress = computed(() => userData.data.progress)
  const allSectionIds = courseIndex.sectionIds()

  const completedIds = computed(() => new Set(progress.value.completedSections))

  const overall = computed<Completion>(() => completion(progress.value, allSectionIds))

  /** Sección donde se retoma el estudio, si la última visitada sigue existiendo. */
  const continueSection = computed<Section | undefined>(() => {
    const last = progress.value.lastSectionId
    return last === null ? undefined : courseIndex.getSection(last)
  })

  function isCompleted(sectionId: string): boolean {
    return completedIds.value.has(sectionId)
  }

  function moduleCompletion(moduleId: ModuleId): Completion {
    return completion(
      progress.value,
      courseIndex.sectionsOf(moduleId).map((section) => section.id),
    )
  }

  function now(): string {
    return new Date(clock.now()).toISOString()
  }

  /**
   * Marca la sección como vista. Con `auto` (al llegar al final de la página) respeta que el
   * usuario la haya desmarcado a propósito; solo el botón puede volver a marcarla.
   */
  function markSectionCompleted(sectionId: string, { auto = false }: { auto?: boolean } = {}): void {
    if (!courseIndex.hasSection(sectionId)) return
    userData.update((data) => {
      if (auto && isExplicitlyUnmarked(data.progress, sectionId)) return data
      const next = markCompleted(data.progress, sectionId, now())
      return next === data.progress ? data : { ...data, progress: next }
    })
  }

  function unmarkSectionCompleted(sectionId: string): void {
    if (!courseIndex.hasSection(sectionId)) return
    userData.update((data) => {
      const next = unmarkCompleted(data.progress, sectionId, now())
      return next === data.progress ? data : { ...data, progress: next }
    })
  }

  function visit(sectionId: string): void {
    if (!courseIndex.hasSection(sectionId)) return
    userData.update((data) => {
      const next = visitSection(data.progress, sectionId)
      return next === data.progress ? data : { ...data, progress: next }
    })
  }

  return {
    completedIds,
    overall,
    continueSection,
    isCompleted,
    moduleCompletion,
    markSectionCompleted,
    unmarkSectionCompleted,
    visit,
  }
})
