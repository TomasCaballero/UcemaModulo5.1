import type { Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 1. Los bloques `extra` son ejemplos
// agregados (cotidianos o clásicos): no son de la guía y se muestran rotulados.
const t = String.raw

export const module1Sections: Section[] = [
  {
    id: '1.1',
    moduleId: 1,
    title: 'Metacognición y descalibración metacognitiva',
    blocks: [
      {
        type: 'paragraph',
        text: t`La **metacognición** es la capacidad de monitorear y controlar nuestros propios procesos de pensamiento: "pensar sobre cómo pensamos". Incluye preguntas como "¿entendí esto de verdad?", "¿estoy usando una buena estrategia para estudiar?".`,
      },
      {
        type: 'paragraph',
        text: t`Cuando ese monitoreo falla, aparece la **descalibración metacognitiva**: la persona **cree que domina** un tema que en realidad desconoce, o duda de una respuesta que en realidad era correcta.`,
      },
      {
        type: 'paragraph',
        text: t`**Analogía del velocímetro estropeado.** Imagina conducir con un velocímetro que marca 60 km/h cuando en realidad vas a 120. Como confías en el tablero, no frenas y tomas la curva a exceso de velocidad. La descalibración actúa igual: da una falsa sensación de control que te impide frenar a estudiar.`,
      },
      { type: 'paragraph', text: '**Cómo se ve en la práctica:**' },
      {
        type: 'list',
        items: [
          t`Releer un capítulo y pensar "esto lo tengo claro" solo porque te resulta **familiar** (reconocer no es lo mismo que poder explicar o resolver).`,
          t`Frases como *"esa materia no tiene nada nuevo que enseñarme"* o *"el examen estaba mal planteado porque yo domino el tema"*.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`**Cómo detectarla:** cierra el material e intenta **explicar el tema en voz alta o resolver un ejercicio sin mirar**. Si no puedes, tu "sensación de saber" estaba descalibrada. Por eso esta guía incluye autoevaluaciones.`,
      },
      {
        type: 'extra',
        text: t`Si siempre vas al trabajo con el GPS, el trayecto te resulta familiar y sientes que lo conoces. Apaga el GPS un día y verás si de verdad puedes llegar solo: reconocer la ruta no es lo mismo que poder recorrerla sin ayuda. Con un tema de estudio pasa igual: que te suene conocido no prueba que puedas explicarlo.`,
      },
    ],
  },
  {
    id: '1.2',
    moduleId: 1,
    title: 'Los órdenes de ignorancia (modelo de Phillip Armour)',
    blocks: [
      { type: 'miniCheck', questionIds: ['m1-q01'] },
      { type: 'paragraph', text: t`Armour clasificó el conocimiento según **cómo nos relacionamos con lo que ignoramos**:` },
      {
        type: 'table',
        headers: ['Orden', 'Nombre', 'Qué significa', 'Ejemplo'],
        rows: [
          ['**0OI**', 'Conocimiento', 'Sabes algo y puedes ejecutarlo o explicarlo', 'Sabes andar en bicicleta'],
          ['**1OI**', 'Ignorancia consciente', 'Sabes **qué** no sabes', '"Sé que no sé hablar alemán"'],
          ['**2OI**', 'Ignorancia inconsciente', '**No sabes que no sabes**', 'Crees dominar un tema y te falta una parte entera'],
          ['**3OI**', 'Falta de proceso', 'No tienes un **método** para descubrir tu 2OI', 'No sabes cómo poner a prueba lo que sabes'],
        ],
      },
      {
        type: 'list',
        items: [
          t`El **2OI** es el estado más peligroso y es la raíz de la descalibración metacognitiva.`,
          t`El **3OI** es el que más se puede arreglar: la solución es tener un proceso (autoevaluación, explicar a otros, resolver problemas sin ayuda, pedir revisión).`,
        ],
      },
      {
        type: 'paragraph',
        text: t`**Objetivo práctico de estudio:** transformar 2OI en 1OI (descubrir qué te falta), y luego 1OI en 0OI (aprenderlo).`,
      },
      {
        type: 'extra',
        text: t`Sabes manejar (0OI) y sabes que no sabes cambiar una rueda pinchada (1OI): puedes aprender o llamar a alguien. Ahora imagina que nunca revisaste la presión de las gomas y ni siquiera sabes que hay que hacerlo (2OI): no puedes buscar ayuda para un problema que no ves. Un mecánico que te dice "revisa la presión cada mes" convierte tu 2OI en 1OI, y practicarlo lo vuelve 0OI.`,
      },
    ],
  },
  {
    id: '1.3',
    moduleId: 1,
    title: 'Los perfiles de aprendizaje de George Leonard',
    blocks: [
      {
        type: 'paragraph',
        text: t`Al aprender una habilidad compleja, el progreso **no es una línea recta ascendente**: es una **escalera de mesetas**. Hay breves saltos de mejora seguidos de largos periodos donde parece que no avanzas, pero en los que tu mente está asimilando. Leonard describe cuatro reacciones típicas:`,
      },
      {
        type: 'list',
        items: [
          t`**El Aficionado (*Dabbler*)**: se entusiasma al empezar, pero en cuanto llega a la primera meseta abandona y busca otra novedad.`,
          t`**El Hacker**: aprende lo mínimo para salir del paso y se niega a profundizar.`,
          t`**El Obsesivo**: exige resultados inmediatos; en la meseta se exige el doble, se frustra y se agota.`,
          t`**El Maestro**: valora la meseta. Entiende que el aprendizaje real ocurre en el trabajo silencioso y constante.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`**Aplicación:** si estudias un posgrado a la vez que trabajas, vas a vivir mesetas (semanas en que parece que no entiendes nada de probabilidad condicional, por ejemplo). Eso es normal. Lo que más ayuda es la **constancia**, más que la intensidad de un día aislado.`,
      },
      {
        type: 'extra',
        text: t`Aprender guitarra: las primeras semanas el progreso es enorme (de no tocar nada a sacar tres acordes). Después viene la meseta de los cambios de acorde, donde durante semanas "no pasa nada". El Aficionado guarda la guitarra en el armario; el Hacker se queda con tres acordes y canciones fáciles; el Obsesivo practica cinco horas seguidas un domingo y se lesiona o se harta; el Maestro practica 20 minutos todos los días, aunque no note la mejora.`,
      },
    ],
  },
  {
    id: '1.4',
    moduleId: 1,
    title: 'Estrategias de recalibración',
    blocks: [
      { type: 'paragraph', text: 'Para corregir la descalibración y pasar de 2OI a 1OI:' },
      {
        type: 'list',
        items: [
          t`**Mente de principiante (*Shoshin*)**: asumir que siempre hay algo nuevo por aprender, incluso en lo elemental.`,
          t`**Construir la playa grano a grano**: el conocimiento no se adquiere de golpe; se acumula como una playa, grano por grano. Cada sesión de estudio agrega unos pocos granos.`,
          t`**Poner a prueba lo que crees saber**: autoevaluación, explicar a otra persona, resolver ejercicios sin mirar la solución. **Si no puedes explicarlo con palabras simples, todavía no lo sabes.**`,
        ],
      },
      {
        type: 'extra',
        text: t`Veinte minutos por día durante 30 días suman $20 \times 30 = 600$ minutos, es decir, 10 horas de práctica repartidas: más que una maratón de un fin de semana, y con mucha mejor retención. Y la prueba clásica de Feynman: intenta explicarle el tema a alguien que no sabe nada de él, sin jerga; los lugares donde te trabas son los que todavía no entiendes.`,
      },
    ],
  },
  {
    id: '1.5',
    moduleId: 1,
    title: 'La filosofía de Richard Hamming: aprender a aprender',
    blocks: [
      {
        type: 'paragraph',
        text: t`Richard Hamming (matemático e ingeniero, 1915-1998) sostenía que, con la tecnología cambiando tan rápido, la educación no debería centrarse en memorizar contenidos que quedarán viejos, sino en adquirir un **estilo de pensamiento** que te permita adaptarte.`,
      },
      { type: 'analogy', text: '"La suerte favorece a la mente preparada." — Louis Pasteur' },
      {
        type: 'paragraph',
        text: t`Los grandes descubrimientos no son accidentes aleatorios: suelen ocurrirle a quienes llevan mucho tiempo **pensando en un problema** y tienen la mente "saturada" de él, de modo que reconocen la oportunidad cuando aparece.`,
      },
      {
        type: 'paragraph',
        text: t`**Programar se parece más a escribir que a construir puentes.** Dos ingenieros que diseñan el mismo puente bajo las mismas leyes de la física llegarán a estructuras muy parecidas. Pero si pides a dos novelistas que escriban sobre la grandeza humana, o a dos programadores que resuelvan un problema complejo, obtendrás obras y códigos muy distintos. Esto significa que en programación y análisis de datos **hay estilo y decisiones de diseño**, no una única respuesta correcta.`,
      },
      {
        type: 'extra',
        text: t`Piensa en pedirles a dos amigos que resuman la misma película en tres frases: los dos resúmenes serán correctos y muy distintos. Algo parecido pasa cuando dos analistas reciben la misma tabla de ventas: uno puede agrupar por mes y otro por región, y ambos llegar a conclusiones útiles. Las herramientas cambian rápido; el criterio para elegir cómo mirar los datos es lo que se queda.`,
      },
    ],
  },
  {
    id: '1.6',
    moduleId: 1,
    title: 'Distancia de Hamming y códigos de corrección de errores',
    blocks: [
      {
        type: 'paragraph',
        text: t`Hamming trabajó en telecomunicaciones y se preguntó cómo hacer que una máquina **detecte y corrija sus propios errores** de transmisión sin intervención humana. Hay dos ideas distintas, que conviene no mezclar:`,
      },
      { type: 'miniCheck', questionIds: ['m1-q04'] },
      { type: 'subheading', text: 'a) Distancia de Hamming' },
      {
        type: 'paragraph',
        text: t`La **distancia de Hamming** entre dos secuencias de igual longitud es **el número de posiciones en las que difieren**.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* $10110$ y $11100$ difieren en la posición 2 y en la 4, así que su distancia es $2$.`,
      },
      {
        type: 'paragraph',
        text: t`Si se diseña un conjunto de mensajes válidos de modo que **cualquier par esté a distancia al menos 3**, entonces:`,
      },
      {
        type: 'list',
        items: [
          t`un error de 1 bit deja el mensaje recibido "más cerca" del mensaje original que de cualquier otro, así que se **puede corregir**;`,
          t`alternativamente, se pueden **detectar** hasta 2 errores (sin corregirlos). Con distancia 3 se elige una de las dos opciones, no ambas a la vez: un error de 2 bits corregido "automáticamente" llevaría a un mensaje equivocado.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`El **código de Hamming (7,4)** aplica esta idea: a cada 4 bits de datos se agregan 3 bits de verificación y el receptor puede corregir automáticamente un error de un solo bit.`,
      },
      { type: 'subheading', text: 'b) Dígitos verificadores (idea relacionada, pero distinta)' },
      {
        type: 'paragraph',
        text: t`Al transcribir números, los humanos solemos **trasponer dígitos adyacentes** (escribir 76 en vez de 67). Una suma simple de dígitos no lo detecta: $6+7 = 7+6 = 13$. En cambio, si se **ponderan las posiciones** (por ejemplo, $1\times6 + 2\times7 = 20$ frente a $1\times7 + 2\times6 = 19$) la transposición cambia el resultado y se detecta. Así funcionan los dígitos verificadores de códigos como el ISBN de los libros.`,
      },
      {
        type: 'paragraph',
        text: t`**Idea general (para todo el curso):** agregar **redundancia estructurada** permite detectar y corregir errores. Conviene retener esta idea de "redundancia útil": repetir con estructura no es desperdicio, es lo que da capacidad de corregir.`,
      },
      {
        type: 'extra',
        text: t`El ejemplo más simple de redundancia útil es el bit de paridad. Para enviar los 7 bits $1011001$ (cuatro unos) se agrega un octavo bit que haga par la cantidad de unos: aquí $0$, y se envía $10110010$. Si en el camino se invierte un bit, el receptor cuenta una cantidad impar de unos y sabe que hubo un error. Pero no sabe cuál bit falló, así que detecta sin poder corregir; para corregir hace falta más redundancia, como en el código de Hamming.`,
      },
    ],
  },
  {
    id: '1.7',
    moduleId: 1,
    title: 'Anexo opcional: muestreo de Nyquist-Shannon y la red de Eddington',
    optional: true,
    blocks: [
      {
        type: 'callout',
        kind: 'salvedad',
        text: t`estos dos temas son tangenciales para data science. Úsalos como cultura general, no como prioridad de estudio.`,
      },
      {
        type: 'paragraph',
        text: t`**Teorema de Nyquist-Shannon.** Para digitalizar una señal que varía en el tiempo (por ejemplo, sonido) hay que **tomar muestras** a intervalos regulares; la **frecuencia de muestreo** es cuántas muestras se toman por segundo. Para no perder información, debe ser **al menos el doble de la frecuencia máxima** de la señal:`,
      },
      { type: 'formula', latex: t`f_s \ge 2 f_{\text{máx}}` },
      {
        type: 'paragraph',
        text: t`Si se muestrea por debajo de ese límite ocurre el *aliasing*: las frecuencias altas se "disfrazan" de frecuencias bajas. *Ejemplo:* una señal de 10 Hz muestreada a 12 Hz (menos de los 20 Hz necesarios) se ve como una señal de $|10-12| = 2$ Hz. Es el mismo efecto por el que en las películas las ruedas de un carro parecen girar hacia atrás.`,
      },
      {
        type: 'extra',
        text: t`Por eso los CD de música se graban a 44 100 muestras por segundo: el oído humano llega hasta unos 20 000 Hz y el doble de eso son 40 000, así que 44 100 alcanza con margen.`,
      },
      {
        type: 'paragraph',
        text: t`**La red de pescar de Eddington.** Un científico pesca con una red de malla de 5 cm y concluye que "no existen peces más pequeños de 5 cm". Moraleja: **nuestras herramientas de medición determinan lo que podemos ver**. Un modelo o un muestreo solo detecta los patrones para los que fue diseñado. Es una versión del *sesgo de selección*: si la muestra o el instrumento no son representativos de lo que se quiere estudiar, las conclusiones salen distorsionadas.`,
      },
      {
        type: 'extra',
        text: t`Un clásico del sesgo de selección: en 1936 una revista estadounidense encuestó a más de dos millones de lectores, sobre todo por listas de teléfonos y de dueños de autos, y predijo que ganaría Landon. Ganó Roosevelt por amplio margen: en plena crisis económica, la red de la encuesta dejaba pasar a quienes no tenían teléfono ni auto.`,
      },
    ],
  },
]
