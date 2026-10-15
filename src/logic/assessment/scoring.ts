/** Porcentaje entero (0 a 100). */
export function percentOf(correct: number, total: number): number {
  if (total <= 0) throw new RangeError(`total debe ser positivo: ${total}`)
  return Math.round((correct / total) * 100)
}

export type CalibrationVerdict = 'overestimated' | 'underestimated' | 'calibrated'

/** Estimación previa del usuario frente al resultado real (RF-31, descalibración). */
export interface Calibration {
  estimate: number
  obtained: number
  /** Diferencia absoluta en puntos porcentuales. */
  difference: number
  verdict: CalibrationVerdict
}

export function calibration(estimate: number, correct: number, total: number): Calibration {
  const obtained = percentOf(correct, total)
  const gap = estimate - obtained
  const verdict: CalibrationVerdict = gap > 0 ? 'overestimated' : gap < 0 ? 'underestimated' : 'calibrated'
  return { estimate, obtained, difference: Math.abs(gap), verdict }
}

export function calibrationMessage(result: Calibration): string {
  const unit = result.difference === 1 ? 'punto' : 'puntos'
  return `Estimaste ${result.estimate} %, obtuviste ${result.obtained} % (diferencia: ${result.difference} ${unit})`
}

export const VERDICT_TEXT: Record<CalibrationVerdict, string> = {
  overestimated: 'Sobreestimaste tu dominio: conviene repasar antes de dar el tema por sabido.',
  underestimated: 'Subestimaste tu dominio: sabés más de lo que creías.',
  calibrated: 'Tu estimación fue exacta.',
}
