import { FixedClock } from '@/core/clock'
import { SeededRandom } from '@/core/random'
import { MemoryStorage } from '@/core/storage'
import { DataRepository } from '@/logic/persistence/repository'
import { LeitnerStrategy } from '@/logic/review/scheduler'
import { provideServices, type Services } from '@/services'

export const START_TIME = Date.UTC(2026, 9, 14, 12, 0, 0)

export interface TestServices extends Services {
  storage: MemoryStorage
  clock: FixedClock
}

/** Instala dependencias de prueba: almacenamiento en memoria, reloj fijo y azar con semilla. */
export function installTestServices(storage = new MemoryStorage(true)): TestServices {
  const services: TestServices = {
    storage,
    clock: new FixedClock(START_TIME),
    random: new SeededRandom(2026),
    repository: new DataRepository(storage),
    scheduler: new LeitnerStrategy(),
  }
  provideServices(services)
  return services
}
