/** Fuente de tiempo inyectable (la repetición espaciada depende de ella). */
export interface Clock {
  /** Milisegundos desde epoch. */
  now(): number
}

export class SystemClock implements Clock {
  now(): number {
    return Date.now()
  }
}

/** Reloj controlable para tests. */
export class FixedClock implements Clock {
  constructor(private current: number) {}

  now(): number {
    return this.current
  }

  set(timestamp: number): void {
    this.current = timestamp
  }

  advance(milliseconds: number): void {
    this.current += milliseconds
  }
}
