import { modules } from './data/guide'
import { glossary } from './data/glossary'
import { simulations } from './data/simulations'
import { module0Sections } from './data/module0'
import { module0Questions } from './data/module0-questions'
import { module1Sections } from './data/module1'
import { module1Questions } from './data/module1-questions'
import { module2Sections } from './data/module2'
import { module2Questions } from './data/module2-questions'
import { module3Sections } from './data/module3'
import { module3Questions } from './data/module3-questions'
import { module4Sections } from './data/module4'
import { module4Questions } from './data/module4-questions'
import { module5Sections } from './data/module5'
import { module5Questions } from './data/module5-questions'
import { module6Sections } from './data/module6'
import { module6Questions } from './data/module6-questions'
import { module7Sections } from './data/module7'
import { module7Questions } from './data/module7-questions'
import { createCourseIndex } from './navigation'
import type { CourseContent } from './types'

export { studyAdvice, usageGuide } from './data/guide'

export const courseContent: CourseContent = {
  modules,
  sections: [
    ...module0Sections,
    ...module1Sections,
    ...module2Sections,
    ...module3Sections,
    ...module4Sections,
    ...module5Sections,
    ...module6Sections,
    ...module7Sections,
  ],
  glossary,
  questions: [
    ...module0Questions,
    ...module1Questions,
    ...module2Questions,
    ...module3Questions,
    ...module4Questions,
    ...module5Questions,
    ...module6Questions,
    ...module7Questions,
  ],
  simulations,
}

export const courseIndex = createCourseIndex(courseContent)
