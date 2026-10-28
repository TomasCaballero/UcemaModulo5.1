import { describe, expect, it } from 'vitest'
import {
  agnosticSampleSize,
  consistentProbability,
  hoeffdingSampleSize,
  intervalLabelings,
  normalSampleSize,
  offTrainingError,
  realizableSampleSize,
  sauerBound,
  thresholdLabelings,
} from '@/logic/statistics/pac'
import { ridgeMean } from '@/logic/statistics/learning'

describe('teoría del aprendizaje: tamaños de muestra y capacidad', () => {
  it('clase finita: reproduce los 231 y 9765 datos de la guía', () => {
    expect(realizableSampleSize(1000, 0.05, 0.01)).toBe(231)
    expect(agnosticSampleSize(1000, 0.05, 0.01)).toBe(9765)
    // Pedir la mitad de error duplica (realizable) o cuadruplica (agnóstico) los datos.
    expect(realizableSampleSize(1000, 0.025, 0.01)).toBe(461)
    expect(agnosticSampleSize(1000, 0.025, 0.01)).toBe(39060)
  })

  it('un solo modelo: Hoeffding pide más que la Normal', () => {
    expect(hoeffdingSampleSize(0.05, 0.05)).toBe(738)
    expect(normalSampleSize(0.05, 1.96)).toBe(385)
  })

  it('una hipótesis mala sobrevive a m datos con probabilidad (1 - ε)^m', () => {
    expect(consistentProbability(0.05, 0)).toBe(1)
    expect(consistentProbability(0.05, 20)).toBeCloseTo(0.3585, 4)
    expect(1000 * consistentProbability(0.05, 231)).toBeLessThan(0.01)
  })

  it('cuenta etiquetados de umbrales e intervalos, y la cota de Sauer', () => {
    expect(thresholdLabelings(1)).toBe(2)
    expect(thresholdLabelings(10)).toBe(11)
    expect(intervalLabelings(2)).toBe(4)
    expect(intervalLabelings(3)).toBe(7)
    expect(intervalLabelings(10)).toBe(56)
    expect(sauerBound(10, 2)).toBe(56)
    expect(sauerBound(10, 1)).toBe(11)
    expect(sauerBound(3, 5)).toBe(8)
  })

  it('No-Free-Lunch: cualquier predicción acierta la mitad en promedio', () => {
    expect(offTrainingError([1, 1])).toBe(0.5)
    expect(offTrainingError([0, 1, 0, 1, 1, 0, 0, 0, 1, 1])).toBe(0.5)
  })

  it('la media penalizada se encoge y se mueve menos', () => {
    expect(ridgeMean(Array(10).fill(6), 0)).toBe(6)
    expect(ridgeMean(Array(10).fill(6), 10)).toBe(3)
    expect(ridgeMean([0, ...Array(9).fill(6)], 10)).toBeCloseTo(2.7, 10)
  })
})
