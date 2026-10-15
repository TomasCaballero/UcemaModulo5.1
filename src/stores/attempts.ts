import { defineStore } from 'pinia'
import { attemptsOfModule, type AttemptRecord } from '@/logic/assessment/attempt'
import { useUserDataStore } from './userData'

/** Historial de intentos de evaluación (RF-36, RF-37). */
export const useAttemptsStore = defineStore('attempts', () => {
  const userData = useUserDataStore()

  /** Intentos de un módulo, del más viejo al más nuevo. */
  function attemptsOf(moduleId: number): AttemptRecord[] {
    return attemptsOfModule(userData.data.attempts, moduleId)
  }

  function recordAttempt(attempt: AttemptRecord): void {
    userData.update((data) => ({ ...data, attempts: [...data.attempts, attempt] }))
  }

  return { attemptsOf, recordAttempt }
})
