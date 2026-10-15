import type { ContentBlock, Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 7. Los bloques `extra` son ejemplos
// agregados (cotidianos o clásicos): no son de la guía y se muestran rotulados.
const t = String.raw

/** Apertura del módulo, previa a la sección 7.1. */
export const module7Intro: ContentBlock[] = [
  {
    type: 'paragraph',
    text: t`Los módulos anteriores enseñan **qué algoritmos usar**. Este explica **cuándo y por qué se puede confiar en ellos**: bajo qué condiciones matemáticas un algoritmo que ve unos pocos ejemplos puede garantizar buen desempeño con datos nuevos. Es el módulo más abstracto, pero muchas de sus ideas ya las usaste de forma intuitiva (sobreajuste, sesgo-varianza, regularización).`,
  },
  { type: 'paragraph', text: '**Notación de este módulo** (es la habitual en los libros de teoría):' },
  {
    type: 'list',
    items: [
      t`$\mathcal{X}$: el conjunto de posibles entradas; $\mathcal{Y}$: el de posibles etiquetas (por ejemplo $\{0,1\}$).`,
      t`$\mathcal{D}$: la **distribución de probabilidad (desconocida)** que genera los datos del mundo real.`,
      t`$S$: la **muestra de entrenamiento**, de tamaño $m$ (aquí se usa $m$ en lugar de $n$), sacada de $\mathcal{D}$ de forma independiente.`,
      t`$h$: una **hipótesis** (un predictor concreto, una función $h:\mathcal{X}\to\mathcal{Y}$).`,
      t`$\mathcal{H}$: la **clase de hipótesis** (el conjunto de predictores entre los que el algoritmo puede elegir: todas las rectas, todos los árboles de profundidad 3…).`,
      t`$A(S)$ o $h_S$: la hipótesis que el algoritmo elige al ver $S$.`,
    ],
  },
]

export const module7Sections: Section[] = [
  {
    id: '7.1',
    moduleId: 7,
    title: 'Aprender es inducir, no memorizar',
    blocks: [
      {
        type: 'paragraph',
        text: t`Un algoritmo que **memoriza** guarda todos los datos de entrenamiento y responde bien si le preguntan por uno de ellos, pero **no tiene nada que decir de un dato nuevo**. Aprender de verdad es **inducir**: extraer reglas generales a partir de ejemplos para acertar en casos futuros no vistos.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* una "función memoria" que, si ve un punto del entrenamiento, devuelve su etiqueta, y en cualquier otro caso devuelve 0. Su error en el entrenamiento es **cero**, pero con datos nuevos se limita a decir "0" siempre.`,
      },
      {
        type: 'extra',
        text: t`Un chico que se aprende de memoria la tabla del 7 hasta $7\times10$ puede responder "¿cuánto es $7\times8$?" sin dudar, pero no sabe qué hacer con $7\times11$. Otro que entendió que multiplicar es sumar repetidamente el mismo número resuelve también las cuentas que nunca vio. El primero memorizó; el segundo indujo la regla.`,
      },
    ],
  },
  {
    id: '7.2',
    moduleId: 7,
    title: 'Riesgo real, riesgo empírico y minimización del riesgo empírico (ERM)',
    blocks: [
      { type: 'miniCheck', questionIds: ['m7-q01'] },
      { type: 'paragraph', text: 'El **error** de una hipótesis puede medirse de dos formas:' },
      {
        type: 'list',
        items: [
          t`**Riesgo real** (o error verdadero) $L_{\mathcal{D}}(h)$: la probabilidad de que $h$ **se equivoque en un dato nuevo** sacado de $\mathcal{D}$. Es lo que realmente nos importa, pero **no se puede calcular**, porque $\mathcal{D}$ es desconocida.`,
          t`**Riesgo empírico** $L_S(h)$: la **proporción de errores en la muestra de entrenamiento**:`,
        ],
      },
      { type: 'formula', latex: t`L_S(h) = \frac{1}{m}\,\bigl|\{\, i : h(x_i) \neq y_i \,\}\bigr|` },
      { type: 'paragraph', text: t`Es lo único que se puede medir (es el "error de entrenamiento" del Módulo 6.1).` },
      {
        type: 'paragraph',
        text: t`**ERM (*Empirical Risk Minimization*)**: elegir la hipótesis de $\mathcal{H}$ con **menor riesgo empírico**. Es la estrategia más natural, **pero si $\mathcal{H}$ es demasiado flexible, falla**:`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* los datos se distribuyen uniformemente en un cuadrado, y la etiqueta real es 1 dentro de un cuadrado interior que ocupa **la mitad** del área, y 0 afuera. La "función memoria" del 7.1 tiene $L_S = 0$ pero $L_{\mathcal{D}} = 1/2$: dice 0 en todos los puntos nuevos y se equivoca en toda la región interior. **El mejor ajuste en entrenamiento puede ser inútil en el mundo real.**`,
      },
      {
        type: 'paragraph',
        text: t`**Solución:** **restringir la clase $\mathcal{H}$** (por ejemplo, solo rectángulos, solo rectas, solo árboles de profundidad limitada). Esa restricción es una **suposición previa sobre cómo es el mundo**, el llamado **sesgo inductivo**, y es la que permite generalizar (ver 7.5).`,
      },
      {
        type: 'extra',
        text: t`Piensa en un alumno que calificó 10 en todos los simulacros porque tenía las respuestas: su riesgo empírico es 0. El día del examen real (datos nuevos), le tocan preguntas distintas y su nota refleja lo que realmente entendió: el riesgo real. Lo que importa es la nota del examen real, pero solo podemos medir la de los simulacros.`,
      },
      { type: 'subheading', text: 'Clase finita: cuántos datos hacen falta' },
      {
        type: 'paragraph',
        text: t`Si $\mathcal{H}$ es **finita** (tiene $|\mathcal{H}|$ hipótesis) y existe en ella una hipótesis perfecta, la ERM funciona si el número de datos satisface:`,
      },
      { type: 'formula', latex: t`m \;\ge\; \frac{\ln(|\mathcal{H}|/\delta)}{\epsilon}` },
      {
        type: 'paragraph',
        text: t`Entonces, con probabilidad al menos $1-\delta$, el error real de la hipótesis elegida es como máximo $\epsilon$. (Qué son $\epsilon$ y $\delta$: ver 7.3.)`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* $|\mathcal{H}| = 1000$, $\epsilon = 0.05$, $\delta = 0.01$: $m \ge \ln(1000/0.01)/0.05 = 11.51/0.05 \approx 231$ ejemplos. Dos observaciones: **más datos permiten error menor**, y una clase **más grande** requiere más datos, pero solo en forma **logarítmica**.`,
      },
      {
        type: 'extra',
        text: t`Si el acertijo es adivinar la regla entre $|\mathcal{H}| = 100$ reglas candidatas, con $\epsilon = 0.1$ y $\delta = 0.05$: $m \ge \ln(100/0.05)/0.1 = \ln(2000)/0.1 \approx 7.60/0.1 \approx 76.01$, o sea, 77 ejemplos. Y si la lista de candidatas fuera cien veces más grande ($|\mathcal{H}|=10\,000$), harían falta $\ln(200\,000)/0.1 \approx 122$: cien veces más reglas no piden cien veces más datos, solo unos 46 más.`,
      },
      { type: 'subheading', text: 'Pérdidas alternativas: la pérdida hinge' },
      {
        type: 'paragraph',
        text: t`Contar errores (pérdida 0-1) es difícil de minimizar computacionalmente. Se reemplaza por una **pérdida convexa** que se puede minimizar con descenso por gradiente (Módulo 0.4). Para etiquetas $y\in\{-1,+1\}$ y un modelo lineal $\langle w,x\rangle$:`,
      },
      { type: 'formula', latex: t`\ell_{\text{hinge}}(w,(x,y)) = \max\{0,\; 1 - y\langle w, x\rangle\}` },
      {
        type: 'paragraph',
        text: t`Vale 0 si el punto está **bien clasificado con margen** ($y\langle w,x\rangle \ge 1$) y crece linealmente al empeorar. *Ejemplo con $y=+1$:* si $\langle w,x\rangle = 2$, pérdida $0$; si $0.5$, pérdida $0.5$; si $-1$ (clasificación errónea), pérdida $2$. Es la pérdida de las SVM (Módulo 6.6).`,
      },
    ],
  },
  {
    id: '7.3',
    moduleId: 7,
    title: 'Aprendizaje PAC (Probably Approximately Correct)',
    blocks: [
      { type: 'paragraph', text: 'El marco PAC define con precisión qué significa "es posible aprender". Dos tolerancias:' },
      {
        type: 'list',
        items: [
          t`**$\epsilon$ (exactitud):** cuánto error real toleramos. *Aproximadamente correcto*: el predictor no tiene que ser perfecto, sí tener error $\le \epsilon$.`,
          t`**$\delta$ (confianza):** la probabilidad de fallar que toleramos. *Probablemente*: puede tocar una muestra **mala por casualidad** (por ejemplo, con pocos puntos poco representativos), y no se puede evitar ese riesgo, solo acotarlo.`,
        ],
      },
      {
        type: 'extra',
        text: t`Las encuestas electorales usan exactamente estas dos tolerancias: "margen de error de ±3 puntos con 95 % de confianza" significa $\epsilon = 0.03$ y $\delta = 0.05$. El margen de error dice cuán cerca está el resultado de la verdad; el 95 % reconoce que, por mala suerte, una de cada veinte encuestas puede tocar una muestra poco representativa y errar por más.`,
      },
      {
        type: 'paragraph',
        text: t`**Definición (versión intuitiva).** Una clase $\mathcal{H}$ es **PAC-aprendible** si existe un algoritmo y una función $m_{\mathcal{H}}(\epsilon,\delta)$ tales que, para **cualquier** $\epsilon,\delta \in (0,1)$ y **cualquier** distribución $\mathcal{D}$, si se le entregan al menos $m_{\mathcal{H}}(\epsilon,\delta)$ ejemplos, devuelve **con probabilidad $\ge 1-\delta$** una hipótesis con riesgo real $L_{\mathcal{D}}(h) \le \epsilon$.`,
      },
      {
        type: 'paragraph',
        text: t`Puntos clave: la garantía vale **sin importar cuál sea $\mathcal{D}$** (no hay que conocerla) y el número de datos depende de $\epsilon$, $\delta$ y de la clase, pero **no de $\mathcal{D}$**.`,
      },
      { type: 'paragraph', text: '**Caso realizable vs. agnóstico:**' },
      {
        type: 'list',
        items: [
          t`**Realizable:** se supone que **en $\mathcal{H}$ existe** una hipótesis con error real 0 (la regla verdadera está en la clase).`,
          t`**PAC agnóstico:** versión **realista**, sin esa suposición. Los datos pueden tener ruido o la regla real puede no estar en $\mathcal{H}$. Entonces no se exige error $\le\epsilon$, sino error **cercano al mejor posible dentro de $\mathcal{H}$**: $L_{\mathcal{D}}(h) \le \min_{h'\in\mathcal{H}} L_{\mathcal{D}}(h') + \epsilon$. Para clase finita basta con $m \ge 2\ln(2|\mathcal{H}|/\delta)/\epsilon^2$ (con los números del ejemplo anterior, unos 9765 datos; exigir menos supuestos **cuesta más datos**).`,
        ],
      },
      { type: 'paragraph', text: t`**Descomposición del error (conexión con el sesgo-varianza del Módulo 6.2):**` },
      {
        type: 'formula',
        latex: t`L_{\mathcal{D}}(h_S) = \underbrace{\min_{h\in\mathcal{H}} L_{\mathcal{D}}(h)}_{\text{error de aproximación (sesgo)}} + \underbrace{\Bigl(L_{\mathcal{D}}(h_S) - \min_{h\in\mathcal{H}} L_{\mathcal{D}}(h)\Bigr)}_{\text{error de estimación (varianza)}}`,
      },
      {
        type: 'list',
        items: [
          t`**Error de aproximación:** lo mejor que se puede lograr con la clase elegida. **Baja** si la clase es **más rica**.`,
          t`**Error de estimación:** cuánto nos alejamos de ese mejor por tener **pocos datos**. **Sube** si la clase es **más rica**.`,
        ],
      },
      { type: 'paragraph', text: t`Elegir $\mathcal{H}$ es **equilibrar** ambos. Es exactamente el mismo dilema que sesgo-varianza.` },
    ],
  },
  {
    id: '7.4',
    moduleId: 7,
    title: 'Dimensión VC y el Teorema Fundamental',
    blocks: [
      {
        type: 'paragraph',
        text: t`Para clases **infinitas** (por ejemplo, todas las rectas del plano) $|\mathcal{H}|$ no sirve como medida de tamaño. La **dimensión de Vapnik-Chervonenkis (VC)** mide la **capacidad o flexibilidad** de una clase.`,
      },
      {
        type: 'paragraph',
        text: t`**Fragmentar (*shattering*).** Un conjunto de $k$ puntos es **fragmentado** por $\mathcal{H}$ si, para **cada una de las $2^k$ asignaciones posibles de etiquetas**, existe alguna hipótesis de $\mathcal{H}$ que la reproduce exactamente.`,
      },
      {
        type: 'paragraph',
        text: t`**Dimensión VC** de $\mathcal{H}$: el tamaño del **mayor conjunto de puntos** que $\mathcal{H}$ puede fragmentar (infinita si no hay tope). Para probar que $\text{VCdim}=d$ hay que (i) **exhibir un conjunto de $d$ puntos** fragmentado y (ii) **demostrar que ningún conjunto de $d+1$ puntos** lo puede ser.`,
      },
      { type: 'miniCheck', questionIds: ['m7-q14'] },
      { type: 'paragraph', text: '**Ejemplos en una dimensión:**' },
      {
        type: 'list',
        items: [
          t`**Umbrales** ("1 si $x \ge a$, 0 en caso contrario"). Con **1 punto** se logran las dos etiquetas posibles. Con **2 puntos** $x_1 < x_2$, es imposible la combinación "$x_1$ positivo y $x_2$ negativo". $\Rightarrow \text{VCdim} = 1$.`,
          t`**Intervalos** ("1 si $a \le x \le b$"). Con 2 puntos se logran las 4 combinaciones. Con **3 puntos**, la combinación "positivo, negativo, positivo" es imposible (un intervalo es continuo). $\Rightarrow \text{VCdim} = 2$.`,
        ],
      },
      {
        type: 'extra',
        text: t`Un cartel que diga "se admiten personas entre $a$ y $b$ años" es un intervalo. Con dos personas (por ejemplo de 30 y 50 años) puedes lograr cualquiera de las cuatro combinaciones sí/no ajustando $a$ y $b$. Pero con tres personas de 20, 40 y 60 años no puedes admitir a la de 20 y a la de 60 y dejar afuera a la de 40: un rango continuo no tiene "huecos". Por eso los intervalos fragmentan 2 puntos y no 3: VCdim $=2$.`,
      },
      { type: 'paragraph', text: '**Otros resultados:**' },
      {
        type: 'list',
        items: [
          t`**Rectas (semiplanos) en el plano:** VCdim $=3$. Tres puntos no alineados se fragmentan, pero **ningún conjunto de 4** (basta la configuración tipo "X": dos opuestos de una clase y dos opuestos de otra, no separables con una recta).`,
          t`**Clasificadores lineales en $\mathbb{R}^d$** (con constante): VCdim $= d+1$. Crece con el número de variables.`,
          t`**Clase finita:** VCdim $\le \log_2|\mathcal{H}|$.`,
          t`**Clase de todas las funciones sobre un dominio infinito** (como la función memoria): VCdim **infinita**.`,
          t`**Advertencia:** la dimensión VC **no es** el número de parámetros. Existe una familia con un solo parámetro ($\text{sign}(\sin(ax))$) con VC infinita.`,
        ],
      },
      {
        type: 'callout',
        kind: 'salvedad',
        text: t`**Teorema Fundamental del Aprendizaje Estadístico** (clasificación binaria, pérdida 0-1): una clase $\mathcal{H}$ es PAC-aprendible **si y solo si su dimensión VC es finita**. Además, la ERM la aprende, y el número de datos necesarios crece en **proporción a $d$** (la dimensión VC), del orden de $d/\epsilon$ (realizable) o $d/\epsilon^2$ (agnóstico), más un término que depende de $\delta$.`,
      },
      {
        type: 'paragraph',
        text: t`**Interpretación práctica:** a mayor flexibilidad ($d$ alta), **más datos se necesitan** para garantizar generalización. Esto explica formalmente por qué conviene tener muchas más observaciones que variables, y por qué los modelos muy flexibles sobreajustan con pocos datos. (Los métodos modernos como las SVM con kernel RBF, de VC infinita, se justifican con otras garantías, basadas en el **margen** y en el **tamaño de los coeficientes**.)`,
      },
    ],
  },
  {
    id: '7.5',
    moduleId: 7,
    title: 'Teorema No-Free-Lunch (sin almuerzo gratis)',
    blocks: [
      {
        type: 'paragraph',
        text: t`**Enunciado informal:** **ningún algoritmo de aprendizaje es el mejor para todos los problemas.** Para cualquier algoritmo y cualquier tamaño de muestra menor a la mitad del dominio, existe una distribución y una regla verdadera (aprendible con error 0) para las cuales el algoritmo **falla con probabilidad apreciable** (el resultado formal: con probabilidad al menos $1/7$ el error real es al menos $1/8$).`,
      },
      {
        type: 'paragraph',
        text: t`*Intuición.* Te dan $2, 4, 6, 8$ y te piden el siguiente. Hay infinitas reglas compatibles con esos datos (pares ascendentes, un polinomio extraño que da 7…). Elegir "10" requiere una **preferencia previa por reglas simples**. Sin ella, los datos solos no deciden.`,
      },
      {
        type: 'extra',
        text: t`Un clásico: te dan $1, 2, 4, 8$ y te piden el siguiente. "16", responde casi todo el mundo (se duplica). Pero hay un problema geométrico real cuyos primeros términos son exactamente $1, 2, 4, 8, 16$ y luego da $31$: es el número máximo de regiones en que quedan divididos un círculo al unir con cuerdas $n$ puntos de su borde. Los datos eran compatibles con las dos reglas; elegir "16" fue una preferencia por la regla simple.`,
      },
      { type: 'paragraph', text: '**Consecuencias:**' },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Aprender **exige** un **sesgo inductivo**: restringir la clase $\mathcal{H}$ o preferir ciertas hipótesis, basándose en **conocimiento del dominio**.`,
          t`**No hay un "mejor modelo universal"**: un modelo funciona bien cuando su sesgo coincide con la estructura del problema. Por eso se comparan varios modelos con validación cruzada.`,
          t`Es coherente con el 7.4: una clase de VC infinita (todas las funciones) no es aprendible.`,
        ],
      },
    ],
  },
  {
    id: '7.6',
    moduleId: 7,
    title: 'Regularización, estabilidad y la navaja de Ockham',
    blocks: [
      { type: 'subheading', text: 'Minimización regularizada del riesgo (RLM)' },
      {
        type: 'paragraph',
        text: t`En lugar de limitar rígidamente $\mathcal{H}$, se **penaliza la complejidad**: se elige la hipótesis que minimiza`,
      },
      { type: 'formula', latex: t`L_S(h) + \text{penalización}(h)` },
      {
        type: 'paragraph',
        text: t`El caso típico es **Ridge**: $L_S(w) + \lambda\lVert w\rVert^2$ (Módulo 6.4). La penalización **inclina la balanza** hacia modelos simples y **controla el sobreajuste**. $\lambda$ regula el equilibrio entre ajuste (sesgo) y simplicidad (varianza).`,
      },
      { type: 'subheading', text: 'Estabilidad algorítmica' },
      {
        type: 'paragraph',
        text: t`Un algoritmo es **estable** si **cambiar un solo dato de entrenamiento** altera poco su predicción. Resultado formal: **un algoritmo estable generaliza** (su riesgo real no puede ser mucho mayor que el empírico: la brecha esperada está acotada por el grado de inestabilidad). Intuitivamente: si el modelo no depende de ningún dato individual, no puede haber "memorizado" ninguno.`,
      },
      { type: 'miniCheck', questionIds: ['m7-q12'] },
      {
        type: 'paragraph',
        text: t`La **regularización produce estabilidad**: con $\lambda$ **grande** el modelo apenas cambia al modificar un dato (menos varianza), pero se ajusta peor (más sesgo). Otra vez el mismo equilibrio.`,
      },
      { type: 'subheading', text: 'Navaja de Ockham y longitud de descripción mínima (MDL)' },
      {
        type: 'paragraph',
        text: t`**Navaja de Ockham:** entre explicaciones con similar ajuste, **preferir la más simple**. La teoría lo vuelve preciso: si cada hipótesis se describe con una cantidad de bits $|h|$ (en algún lenguaje fijado de antemano), con probabilidad al menos $1-\delta$, **para todas** las hipótesis de la clase:`,
      },
      {
        type: 'formula',
        latex: t`L_{\mathcal{D}}(h) \;\le\; L_S(h) + \sqrt{\frac{|h| + \ln(2/\delta)}{2m}}`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo numérico* ($m=1000$, $\delta=0.05$): una hipótesis de **50 bits** tiene un margen de error de $\sqrt{(50+3.69)/2000} \approx 0.16$; una de **500 bits**, de $\sqrt{(500+3.69)/2000} \approx 0.50$. Con igual error en entrenamiento, **la más simple tiene una garantía mucho mejor**.`,
      },
      {
        type: 'paragraph',
        text: t`**Principio MDL:** elegir la hipótesis que minimiza (error en entrenamiento) + (término de complejidad). Es otra forma de **regularización**.`,
      },
      {
        type: 'paragraph',
        text: t`*Salvedad:* la longitud de descripción depende del **lenguaje** elegido; no existe una noción absoluta de "simplicidad". Esa elección es otra forma de sesgo inductivo.`,
      },
      {
        type: 'extra',
        text: t`Tu auto no arranca. Una explicación: "la batería está descargada" (corta y simple). Otra: "falló el motor de arranque, a la vez se cortó un cable y además hay un problema en la bomba de combustible" (larga y compleja). Si ambas explican igual de bien los síntomas, conviene empezar por la corta: es la navaja de Ockham, y la cota dice por qué: con $m=1000$ casos, una regla de apenas 10 bits tiene un margen de error de $\sqrt{(10+3.69)/2000} \approx 0.083$, mucho mejor que el $0.16$ de una de 50 bits.`,
      },
    ],
  },
  {
    id: '7.7',
    moduleId: 7,
    title: 'Cómo se conecta todo',
    blocks: [
      {
        type: 'table',
        headers: ['Concepto de la teoría', 'Lo que ya conoces en la práctica'],
        rows: [
          ['Error de aproximación vs. estimación', 'Sesgo vs. varianza (6.2)'],
          ['ERM con clase muy rica', 'Sobreajuste (4.3, 6.2)'],
          ['Riesgo real', 'Error de prueba, que se estima con validación cruzada u OOB (6.3, 6.5)'],
          ['Dimensión VC', 'Flexibilidad del modelo; necesidad de más datos'],
          ['Regularización / estabilidad', 'Ridge, Lasso, poda de árboles (4.3, 6.4)'],
          ['Pérdida hinge', 'SVM (6.6)'],
          ['*No-Free-Lunch*', 'Probar varios modelos; usar conocimiento del dominio'],
          ['Navaja de Ockham / MDL', 'Preferir modelos más simples a igual desempeño'],
        ],
      },
    ],
  },
]
