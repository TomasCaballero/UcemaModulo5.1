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
      {
        type: 'intuition',
        title: 'Cuando tu tablero dice que todo va bien y no es cierto',
        text: t`**1. Pensar sobre cómo pensás.** La metacognición es la vocecita que se pregunta "¿realmente entendí esto?" o "¿esta forma de estudiar me está sirviendo?". Es como mirar el tablero de un auto: no manejás más rápido por mirarlo, pero te avisa cómo vas.

**2. Cuando el tablero miente.** Si el velocímetro marca 60 y en realidad vas a 120, no frenás en la curva. Con el estudio pasa igual: si tu "sensación de saber" está descalibrada, creés que dominás un tema que no dominás y por eso no te ponés a estudiarlo. También puede pasar al revés: dudar de una respuesta que estaba bien.

**3. Reconocer no es saber.** Releer un capítulo y pensar "esto me suena, lo tengo claro" es como hacer siempre el camino al trabajo con el GPS: te parece conocido, pero el día que lo apagás te perdés. Que algo te resulte familiar no prueba que puedas explicarlo o resolverlo solo.

**4. La prueba para saberlo.** Cerrá el material y explicá el tema en voz alta, o resolvé un ejercicio sin mirar. Si te trabás, el tablero estaba mintiendo. Es incómodo, pero es la única forma de recalibrarlo.`,
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
      {
        type: 'intuition',
        title: 'Las cuatro formas de no saber algo',
        text: t`**1. Hay maneras muy distintas de ignorar.** Armour propone cuatro niveles. Se entienden mejor con un auto.

**Saber (0OI):** sabés manejar y podés hacerlo.

**Saber que no sabés (1OI):** sabés que no sabés cambiar una rueda pinchada. Eso es una buena noticia: ya podés aprender o llamar a alguien.

**No saber que no sabés (2OI):** nunca pensaste en revisar la presión de las gomas y ni siquiera sabés que existe esa tarea. No podés pedir ayuda por un problema que no ves. Este es el nivel más peligroso, y es el que está detrás de la sensación falsa de dominar un tema.

**No tener un método para descubrirlo (3OI):** es no contar con ninguna forma de averiguar qué es lo que no sabés. Por ejemplo, no saber cómo ponerte a prueba.

**2. La buena noticia.** El último nivel es el más fácil de arreglar, porque se arregla con hábitos: autoevaluarte, explicarle el tema a otra persona, resolver problemas sin mirar la solución, pedir que te revisen.

**3. Qué hacer con esto.** El objetivo práctico es llevar lo que no sabés que no sabés a lo que sabés que no sabés (para eso estudiás poniéndote a prueba) y después a lo que sabés. Es como el mecánico que te dice "revisá la presión cada mes": convierte un problema invisible en una tarea con nombre.`,
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
      {
        type: 'intuition',
        title: 'Aprender es subir una escalera con descansos largos',
        text: t`**1. El progreso no es una rampa.** Cuando empezás algo difícil, al principio mejorás rápido. Después parece que te estancás durante semanas: es la "meseta". La imagen correcta es una escalera, con escalones cortos y rellanos largos. En el rellano parece que no pasa nada, pero tu cabeza está acomodando lo aprendido.

**2. Cuatro formas de reaccionar al rellano.** Pensá en alguien que aprende guitarra:

El **Aficionado** se entusiasma, llega al rellano y guarda la guitarra en el armario para probar otra cosa.

El **Hacker** aprende tres acordes, le alcanzan para zafar y no sigue.

El **Obsesivo** quiere resultados ya: practica cinco horas seguidas un domingo, se frustra y se agota.

El **Maestro** entiende que el rellano es parte del camino y sigue practicando un rato todos los días, aunque no note nada.

**3. Qué significa para vos.** Si estudiás mientras trabajás, vas a tener semanas en las que parece que no entendés nada. Es normal, no es una señal de que algo anda mal. Lo que más ayuda es la constancia, no el esfuerzo de un día suelto.`,
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
      {
        type: 'intuition',
        title: 'Cómo arreglar el tablero: ser principiante y hacer la playa grano a grano',
        text: t`**1. Empezar de cero a propósito.** *Shoshin* significa "mente de principiante": asumir que siempre hay algo que no sabés, incluso en lo más básico. Quien cree que ya lo sabe todo no busca el hueco que le falta.

**2. El conocimiento es una playa.** Nadie arma una playa de golpe: se forma grano a grano. Cada vez que estudiás sumás unos pocos granos. Por eso conviene un rato corto todos los días antes que una maratón: la arena se acumula y se queda.

**3. Ponerte a prueba es el truco central.** Explicale el tema a alguien que no sabe nada, sin usar jerga. Los lugares donde te trabás son justo los que todavía no entendés. Si no podés explicarlo con palabras simples, todavía no lo sabés. Esta es la parte incómoda, y también la que más corrige.`,
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
      {
        type: 'intuition',
        title: 'Las herramientas cambian, el criterio se queda',
        text: t`**1. Aprender a aprender.** Hamming pensaba que, como la tecnología cambia tan rápido, memorizar datos que se van a quedar viejos sirve poco. Lo que vale es desarrollar una **manera de pensar** que te deje adaptarte a lo que venga.

**2. La suerte favorece a la mente preparada.** Los grandes descubrimientos casi nunca son accidentes. Les ocurren a quienes llevan mucho tiempo pensando en un problema: cuando aparece la pista, la reconocen. Es como buscar una llave: si sabés bien cómo es, la ves enseguida entre las cosas de un cajón.

**3. Programar se parece más a escribir que a construir un puente.** Dos ingenieros que diseñan el mismo puente con las mismas leyes de la física hacen puentes muy parecidos. Dos personas que resumen la misma película hacen resúmenes distintos, y los dos pueden estar bien. En análisis de datos pasa lo mismo: hay estilo y decisiones, no una única respuesta correcta. Por eso lo que se aprende no es una receta, sino un criterio para decidir.`,
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
      {
        type: 'intuition',
        title: 'Cómo una máquina descubre sus propios errores: la redundancia que sirve',
        text: t`**1. Medir cuánto se parecen dos mensajes.** La distancia de Hamming es simplemente contar en cuántas posiciones dos secuencias son distintas. Los mensajes $10110$ y $11100$ difieren en dos lugares, así que su distancia es $2$. Es como el juego de "encontrá las diferencias" entre dos dibujos.

**2. Separar bien los mensajes válidos.** Si elegís los mensajes permitidos de modo que cualquier par esté al menos a distancia $3$, un solo error no alcanza para confundir un mensaje con otro. Si llega algo raro que está a un paso de un mensaje válido, lo más probable es que fuera ese. Es como tener nombres de calles tan distintos entre sí que, si una letra se borra, igual sabés de cuál se trata.

**3. Detectar o corregir: hay que elegir.** Con ese margen se puede, o bien **corregir** un error, o bien **detectar** hasta dos, pero no las dos cosas a la vez. Si corregís automáticamente cuando hubo dos errores, "corregís" hacia el mensaje equivocado.

**4. Repetir con orden es útil.** Agregar información extra con estructura (como los 3 bits de verificación del código de Hamming por cada 4 de datos) parece un desperdicio, pero es lo que permite arreglar errores. Los dígitos verificadores, como los de un ISBN, hacen algo parecido: si cambiás dos dígitos vecinos, por ejemplo $67$ por $76$, una suma simple no lo nota ($6+7 = 7+6$), pero si cada posición pesa distinto sí cambia el resultado ($1 \times 6 + 2 \times 7 = 20$ frente a $1 \times 7 + 2 \times 6 = 19$). La idea para todo el curso: la repetición con estructura no es un desperdicio, es lo que da capacidad de corrección.`,
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
      {
        type: 'intuition',
        title: 'Muestrear como filmar una rueda, y la red que solo atrapa peces grandes',
        text: t`**1. Fotografiar algo que se mueve.** Para guardar un sonido en una computadora hay que "sacarle fotos" muchas veces por segundo. El teorema dice que hay que sacar **al menos el doble** de fotos por segundo que la frecuencia más alta que tiene la señal. Con menos que eso, la información se estropea.

**2. El efecto de la rueda que gira al revés.** Si las fotos son pocas, algo que se mueve rápido parece moverse lento, o hacia atrás. Es lo que ves en las películas con las ruedas de un carro. Por ejemplo, una señal de 10 Hz fotografiada a solo 12 Hz parece una de $|10 - 12| = 2$ Hz. Los números altos se "disfrazan" de números bajos.

**3. La red de Eddington.** Alguien pesca con una red cuya malla es de 5 cm y concluye que no existen peces más chicos que 5 cm. Los peces chicos existen, pero la red no puede atraparlos. Moraleja: **lo que podés ver depende de tu instrumento**. Si una encuesta o una muestra no representa a quien querés estudiar, las conclusiones salen torcidas. Esto se llama sesgo de selección.

**4. Cómo tomarlo.** El propio curso aclara que este anexo es cultura general. Si se te hace cuesta arriba, podés saltarlo sin perder el hilo.`,
      },
    ],
  },
]
