import { defineStore } from 'pinia'
import { computed } from 'vue'
import { courseIndex } from '@/content'
import type { ModuleId, Section } from '@/content/types'
import { completion, markCompleted, visitSection, type Completion } from '@/logic/progress/progress'
import { useUserDataStore } from './userData'

/** Secciones vistas y última visitada (RF-32 a 35). */
export const useProgressStore = defineStore('progress', () => {
  const userData = useUserDataStore()

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

  function markSectionCompleted(sectionId: string): void {
    if (!courseIndex.hasSection(sectionId)) return
    userData.update((data) => {
      const next = markCompleted(data.progress, sectionId)
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

  return { completedIds, overall, continueSection, isCompleted, moduleCompletion, markSectionCompleted, visit }
})
