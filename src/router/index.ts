import { createRouter, createWebHashHistory, type RouteLocationNormalized, type RouterHistory } from 'vue-router'
import { courseIndex } from '@/content'
import HomeView from '@/views/HomeView.vue'

const APP_TITLE = 'Curso de Estadística, Econometría y Ciencia de Datos'

export function routeTitle(route: RouteLocationNormalized): string {
  if (route.name === 'section') {
    const section = courseIndex.getSection(String(route.params.sectionId))
    if (section) return `${section.id} ${section.title} · ${APP_TITLE}`
  }
  if (route.name === 'module') {
    const module = courseIndex.getModule(Number(route.params.moduleId))
    if (module) return `Módulo ${module.id}: ${module.title} · ${APP_TITLE}`
  }
  if (route.name === 'simulation') {
    const simulation = courseIndex.getSimulation(String(route.params.simulationId))
    if (simulation) return `${simulation.id} ${simulation.title} · ${APP_TITLE}`
  }
  if (route.name === 'concepts') return `Mapa de conceptos · ${APP_TITLE}`
  if (route.name === 'synthesis') return `Cuadro síntesis · ${APP_TITLE}`
  if (route.name === 'glossary') return `Glosario · ${APP_TITLE}`
  if (route.name === 'search') return `Búsqueda · ${APP_TITLE}`
  if (route.name === 'review') return `Repaso · ${APP_TITLE}`
  if (route.name === 'assessment') {
    const module = courseIndex.getModule(Number(route.params.moduleId))
    if (module) return `Autoevaluación del Módulo ${module.id} · ${APP_TITLE}`
  }
  return APP_TITLE
}

export function createAppRouter(history: RouterHistory = createWebHashHistory()) {
  const router = createRouter({
    history,
    routes: [
      { path: '/', name: 'home', component: HomeView },
      {
        path: '/modulo/:moduleId',
        name: 'module',
        component: () => import('@/views/ModuleView.vue'),
        props: true,
      },
      {
        path: '/modulo/:moduleId/evaluacion',
        name: 'assessment',
        component: () => import('@/views/AssessmentView.vue'),
        props: true,
      },
      {
        path: '/simulacion/:simulationId',
        name: 'simulation',
        component: () => import('@/views/SimulationView.vue'),
        props: true,
      },
      { path: '/mapa', name: 'concepts', component: () => import('@/views/ConceptMapView.vue') },
      { path: '/sintesis', name: 'synthesis', component: () => import('@/views/SynthesisView.vue') },
      { path: '/glosario', name: 'glossary', component: () => import('@/views/GlossaryView.vue') },
      { path: '/buscar', name: 'search', component: () => import('@/views/SearchView.vue') },
      { path: '/repaso', name: 'review', component: () => import('@/views/ReviewView.vue') },
      {
        path: '/seccion/:sectionId',
        name: 'section',
        component: () => import('@/views/SectionView.vue'),
        props: true,
      },
    ],
    scrollBehavior: () => ({ top: 0 }),
  })
  router.afterEach((to) => {
    document.title = routeTitle(to)
  })
  return router
}

export const router = createAppRouter()
