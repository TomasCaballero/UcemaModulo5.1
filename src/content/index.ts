import { modules } from './data/guide'
import { glossary } from './data/glossary'
import { simulations } from './data/simulations'
import { module2Sections } from './data/module2'
import { module2Questions } from './data/module2-questions'
import { createCourseIndex } from './navigation'
import type { CourseContent } from './types'

export { studyAdvice } from './data/guide'

export const courseContent: CourseContent = {
  modules,
  sections: [...module2Sections],
  glossary,
  questions: [...module2Questions],
  simulations,
}

export const courseIndex = createCourseIndex(courseContent)
