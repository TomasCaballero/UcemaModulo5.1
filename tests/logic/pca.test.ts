import { describe, expect, it } from 'vitest'
import {
  componentsForVariance,
  cumulativeVariance,
  eigenvalueFromShare,
  explainedVariance,
  kaiserCount,
  symmetric2x2Eigenvalues,
} from '@/logic/statistics/pca'

describe('PCA: varianza explicada y criterios de retención', () => {
  const eigenvalues = [2.8, 0.9, 0.2, 0.1]

  it('reparte la varianza total entre los componentes', () => {
    const shares = explainedVariance(eigenvalues)
    expect(shares[0]).toBeCloseTo(0.7, 10)
    expect(shares.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10)
  })

  it('acumula la varianza: 70 % con uno y 92.5 % con dos', () => {
    const cumulative = cumulativeVariance(eigenvalues)
    expect(cumulative[0]).toBeCloseTo(0.7, 10)
    expect(cumulative[1]).toBeCloseTo(0.925, 10)
    expect(cumulative[3]).toBeCloseTo(1, 10)
  })

  it('Kaiser-Guttman conserva los autovalores mayores que 1', () => {
    expect(kaiserCount(eigenvalues)).toBe(1)
    expect(kaiserCount([2.6, 1.3, 0.6, 0.3, 0.2])).toBe(2)
    expect(kaiserCount([1, 1, 1])).toBe(0)
  })

  it('cuenta los componentes que hacen falta para llegar a un umbral de varianza', () => {
    expect(componentsForVariance(eigenvalues, 0.7)).toBe(1)
    expect(componentsForVariance(eigenvalues, 0.8)).toBe(2)
    expect(componentsForVariance(eigenvalues, 1)).toBe(4)
  })

  it('con matriz de correlación el autovalor es la proporción por el número de variables', () => {
    expect(eigenvalueFromShare(0.65, 8)).toBeCloseTo(5.2, 10)
    expect(eigenvalueFromShare(0.83 - 0.72, 5)).toBeCloseTo(0.55, 10)
  })

  it('el caso de los gorriones: Kaiser retiene 1 y la regla del 80 % pide 2', () => {
    const sparrows = [eigenvalueFromShare(0.72, 5), eigenvalueFromShare(0.11, 5)]
    expect(kaiserCount(sparrows)).toBe(1)
    expect(componentsForVariance([0.72, 0.11, 0.17], 0.8)).toBe(2)
  })

  it('autovalores de una matriz simétrica 2×2: con correlación r son 1 + r y 1 - r', () => {
    const [first, second] = symmetric2x2Eigenvalues(1, 0.9, 1)
    expect(first).toBeCloseTo(1.9, 10)
    expect(second).toBeCloseTo(0.1, 10)
    expect(symmetric2x2Eigenvalues(4, 0, 1)).toEqual([4, 1])
  })
})
