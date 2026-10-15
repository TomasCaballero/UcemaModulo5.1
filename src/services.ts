import { SystemClock, type Clock } from '@/core/clock'
import { MathRandom, type Random } from '@/core/random'
import { createBrowserStorage } from '@/core/storage'
import { DataRepository } from '@/logic/persistence/repository'
import { LeitnerStrategy, type SchedulingStrategy } from '@/logic/review/scheduler'

/** Dependencias de infraestructura que usan los stores y las pantallas. */
export interface Services {
  clock: Clock
  random: Random
  repository: DataRepository
  scheduler: SchedulingStrategy
}

let current: Services | undefined

export function createDefaultServices(): Services {
  return {
    clock: new SystemClock(),
    random: new MathRandom(),
    repository: new DataRepository(createBrowserStorage()),
    scheduler: new LeitnerStrategy(),
  }
}

export function useServices(): Services {
  current ??= createDefaultServices()
  return current
}

/** Reemplaza las dependencias (tests); sin argumento vuelve a las reales. */
export function provideServices(services?: Services): void {
  current = services
}
