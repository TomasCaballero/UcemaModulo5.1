import type { Component } from 'vue'
import MiniCheckBlock from '@/components/assessment/MiniCheckBlock.vue'
import SimulationBlock from '@/components/simulations/SimulationBlock.vue'
import type { BlockType } from '@/content/types'
import AnalogyBlock from './AnalogyBlock.vue'
import CalloutBlock from './CalloutBlock.vue'
import ExtraExampleBlock from './ExtraExampleBlock.vue'
import FormulaBlock from './FormulaBlock.vue'
import IntuitionBlock from './IntuitionBlock.vue'
import ListBlock from './ListBlock.vue'
import ParagraphBlock from './ParagraphBlock.vue'
import SubheadingBlock from './SubheadingBlock.vue'
import TableBlock from './TableBlock.vue'
import WorkedExampleBlock from './WorkedExampleBlock.vue'

/**
 * Componente que dibuja cada tipo de bloque. Agregar un tipo = registrar acá su
 * componente, sin tocar SectionRenderer.
 */
export const blockComponents: Record<BlockType, Component> = {
  paragraph: ParagraphBlock,
  subheading: SubheadingBlock,
  list: ListBlock,
  formula: FormulaBlock,
  callout: CalloutBlock,
  analogy: AnalogyBlock,
  extra: ExtraExampleBlock,
  intuition: IntuitionBlock,
  table: TableBlock,
  miniCheck: MiniCheckBlock,
  simulation: SimulationBlock,
  workedExample: WorkedExampleBlock,
}
