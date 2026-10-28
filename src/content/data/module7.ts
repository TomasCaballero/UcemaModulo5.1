import type { ContentBlock, Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 7. Los bloques `extra` (ejemplos
// cotidianos o clásicos), `deepDive` (ampliaciones) y `recall` (repasos de lo previo) no son de la
// guía y se muestran rotulados; las cifras de las ampliaciones se verifican en tools/expansion-numbers.ts.
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
        type: 'recall',
        items: [
          {
            question: t`¿Qué era el sobreajuste?`,
            answer: t`Un modelo que rinde muy bien con los datos con que se construyó y mal con datos nuevos, porque aprendió el ruido junto con el patrón. Por eso se lo evalúa con datos que no vio. Lo viste en Módulo 4.3.`,
          },
          {
            question: t`¿Por qué el error de entrenamiento es optimista?`,
            answer: t`Porque el modelo eligió sus parámetros mirando esos mismos datos, ruido incluido. Con datos nuevos, el mismo modelo se equivoca más, y la brecha crece con la flexibilidad. Lo viste en Módulo 6.1.`,
          },
        ],
      },
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
      {
        type: 'deepDive',
        title: t`Memorizar con criterio: el vecino más cercano`,
        text: t`La función memoria no es la única regla que saca cero errores en el entrenamiento. Mirá esta otra: **para un caso nuevo, copiar la etiqueta del caso visto que tenga más cerca**. Se llama el *vecino más cercano*. En el entrenamiento también acierta todo, porque cada punto es su propio vecino más cercano.

Supongamos que viste cuatro casos sobre una recta: $x = 1$ y $x = 2$ con etiqueta 0, y $x = 7$ y $x = 8$ con etiqueta 1. Llega un caso nuevo en $x = 6.5$.

**La función memoria** no lo vio nunca y contesta 0.

**El vecino más cercano** encuentra el 7, a $0.5$ de distancia (el 2 está a $4.5$), y contesta 1.

Las dos reglas tienen el mismo error de entrenamiento, cero, y sin embargo se comportan muy distinto con lo nuevo. La diferencia no está en los datos sino en una **suposición**: que los casos parecidos tienen etiquetas parecidas. La memoria no supone nada y por eso no puede decir nada; el vecino apuesta a la cercanía y por eso generaliza.

La apuesta puede salir mal. Si la etiqueta dependiera de que el número sea par o impar, mirar al vecino sería una pésima idea: el 3 está pegado al 2 y tiene la paridad contraria. Más adelante en este módulo esa suposición previa tiene nombre, y resulta que sin alguna no se puede aprender.`,
        sources: [
          'Cover y Hart, "Nearest neighbor pattern classification", *IEEE Transactions on Information Theory* (1967)',
          'Shalev-Shwartz y Ben-David, *Understanding Machine Learning*, cap. 2 y 19',
          'Cifras inventadas para el ejemplo',
        ],
      },
    ],
  },
  {
    id: '7.2',
    moduleId: 7,
    title: 'Riesgo real, riesgo empírico y minimización del riesgo empírico (ERM)',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Cómo se calcula la probabilidad de que pasen varias cosas independientes?`,
            answer: t`Se multiplican las probabilidades de cada una: dos caras seguidas con una moneda es $\tfrac{1}{2} \times \tfrac{1}{2} = \tfrac{1}{4}$. Lo viste en Módulo 0.2.`,
          },
          {
            question: t`¿Qué hace un logaritmo con un número muy grande?`,
            answer: t`Lo achica muchísimo: convierte productos en sumas, así que multiplicar un número por mil solo le suma una cantidad fija a su logaritmo. Por eso algo que crece "en forma logarítmica" crece muy despacio. Lo viste en Módulo 0.5.`,
          },
          {
            question: t`¿Qué hacía el descenso por gradiente?`,
            answer: t`Busca el mínimo de una función dando pasos en la dirección en que más baja, como quien baja una montaña con niebla tanteando la pendiente. Para eso la función tiene que tener pendiente: no sirve si es una escalera de saltos. Lo viste en Módulo 0.4.`,
          },
          {
            question: t`¿Qué era el margen de una SVM?`,
            answer: t`La distancia entre la frontera y los puntos más cercanos de cada clase. Se elige la frontera que lo hace más ancho, y con margen blando se tolera que algunos puntos lo violen. Lo viste en Módulo 6.6.`,
          },
        ],
      },
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
        type: 'intuition',
        title: 'La nota del simulacro y la nota del examen real',
        text: t`**Dos errores distintos.** Un alumno que sacó 10 en todos los simulacros porque tenía las respuestas tiene un error de simulacro de cero (el **riesgo empírico**: el error que medimos con los datos que tenemos). El día del examen real le tocan preguntas distintas y su nota refleja lo que realmente entendió (el **riesgo real**: el error con datos nuevos). Lo que importa es el examen real, pero solo podemos medir los simulacros.`,
      },
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
      {
        type: 'deepDive',
        title: t`Por qué alcanzan 231 ejemplos: la cuenta detrás de la fórmula`,
        text: t`La fórmula sale de preguntarse **qué tan probable es que una hipótesis mala pase desapercibida**. Con los números de la guía: $|\mathcal{H}| = 1000$, $\epsilon = 0.05$ y $\delta = 0.01$.

**Una hipótesis mala.** Llamemos "mala" a una con error real mayor que $0.05$. En el caso realizable, la ERM elige una hipótesis que no se equivoca en ningún dato del entrenamiento. Para que elija una mala, esa mala tiene que acertar los $m$ datos de casualidad. En cada dato acierta con probabilidad menor que $0.95$, y como los datos son independientes, las probabilidades se multiplican: acierta los $m$ con probabilidad menor que $0.95^m$.

Con 20 datos, $0.95^{20} \approx 0.358$: una mala sobrevive en más de un tercio de las muestras. Con 231 datos, $0.95^{231} \approx 0.0000071$: unas 7 veces en un millón.

**Todas las malas a la vez.** Puede haber hasta 1000 malas, y alcanza con que sobreviva una para que la ERM se equivoque. La probabilidad de que sobreviva alguna es, como mucho, la suma de las probabilidades de cada una: $1000 \times 0.0000071 \approx 0.0071$, menor que el $\delta = 0.01$ pedido. Esa suma se llama **cota de la unión**: es pesimista (cuenta dos veces los casos en que sobreviven dos), pero vale siempre.

**De ahí, la fórmula.** Como $(1 - \epsilon)^m \le e^{-\epsilon m}$, alcanza con pedir $|\mathcal{H}|\, e^{-\epsilon m} \le \delta$. Tomando logaritmos y despejando:

$m \ge \dfrac{\ln(|\mathcal{H}|/\delta)}{\epsilon}$

Ahora se ve por qué el tamaño de la clase entra con un logaritmo: duplicar $|\mathcal{H}|$ solo suma $\ln 2/0.05 \approx 13.9$ ejemplos. En cambio $\epsilon$ divide: pedir la mitad de error, $0.025$, duplica la cuenta a $461$.`,
        sources: [
          'Shalev-Shwartz y Ben-David, *Understanding Machine Learning*, cap. 2 (clases finitas)',
          'Valiant, "A theory of the learnable", *Communications of the ACM* (1984)',
        ],
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
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué dice un intervalo de confianza del 95 %?`,
            answer: t`Es la estimación más y menos $1.96$ errores estándar. El 95 % no habla de este intervalo en particular: es la proporción de muestras en las que el procedimiento atrapa el valor verdadero. Lo viste en Módulo 2.6.`,
          },
          {
            question: t`¿Cómo baja el error estándar con más datos?`,
            answer: t`Como $1/\sqrt{n}$: para reducirlo a la mitad hacen falta cuatro veces más datos. Lo viste en Módulo 2.5.`,
          },
          {
            question: t`¿Qué decía el equilibrio sesgo-varianza?`,
            answer: t`Un modelo rígido se equivoca de forma sistemática (sesgo); uno muy flexible cambia mucho según la muestra (varianza). Al ganar flexibilidad uno baja y el otro sube, y el error de prueba es mínimo en un punto intermedio. Lo viste en Módulo 6.2.`,
          },
        ],
      },
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
      {
        type: 'deepDive',
        title: t`Evaluar un solo modelo: cuántos casos de prueba hacen falta`,
        text: t`Empecemos por algo más modesto que aprender: tenés **un** modelo ya armado y querés estimar su error real con casos nuevos. Es una encuesta: cada caso es un "votante" que el modelo acierta o no, y la proporción de errores en la prueba estima el error real.

**Con el intervalo de confianza clásico**, el margen es $1.96$ errores estándar, y el error estándar de una proporción es $\sqrt{p(1-p)/m}$. En el peor caso, $p(1-p) = 0.25$. Para un margen de $0.05$ con 95 % de confianza: $m \ge (1.96 \times 0.5 / 0.05)^2 \approx 384.2$, o sea $385$ casos.

**Con la desigualdad de Hoeffding**, la herramienta de la teoría del aprendizaje, la probabilidad de que la proporción observada se aleje más de $\epsilon$ de la real es como mucho $2e^{-2m\epsilon^2}$. Pidiendo que eso no pase de $\delta$:

$m \ge \dfrac{\ln(2/\delta)}{2\epsilon^2}$

Con $\epsilon = \delta = 0.05$: $\ln(40)/0.005 \approx 737.8$, o sea $738$ casos, casi el doble.

**¿Por qué pide más?** El intervalo usa la aproximación Normal del Teorema del Límite Central, que es muy buena pero es una aproximación. Hoeffding es una **cota**: vale para cualquier $m$ y cualquier error real, sin aproximar nada. La teoría PAC promete garantías "para cualquier distribución", y eso se paga con cuentas más conservadoras.

Fijate también en el $\epsilon^2$: para la mitad de margen hacen falta cuatro veces más casos, igual que con el error estándar, que baja con $\sqrt{m}$.`,
        sources: [
          'Hoeffding, "Probability inequalities for sums of bounded random variables", *Journal of the American Statistical Association* (1963)',
          'Shalev-Shwartz y Ben-David, *Understanding Machine Learning*, cap. 4 y apéndice B',
        ],
      },
      { type: 'paragraph', text: '**Caso realizable vs. agnóstico:**' },
      {
        type: 'list',
        items: [
          t`**Realizable:** se supone que **en $\mathcal{H}$ existe** una hipótesis con error real 0 (la regla verdadera está en la clase).`,
          t`**PAC agnóstico:** versión **realista**, sin esa suposición. Los datos pueden tener ruido o la regla real puede no estar en $\mathcal{H}$. Entonces no se exige error $\le\epsilon$, sino error **cercano al mejor posible dentro de $\mathcal{H}$**: $L_{\mathcal{D}}(h) \le \min_{h'\in\mathcal{H}} L_{\mathcal{D}}(h') + \epsilon$. Para clase finita basta con $m \ge 2\ln(2|\mathcal{H}|/\delta)/\epsilon^2$ (con los números del ejemplo anterior, unos 9765 datos; exigir menos supuestos **cuesta más datos**).`,
        ],
      },
      {
        type: 'deepDive',
        title: t`De un modelo a toda la clase: de dónde salen los 9765 datos`,
        text: t`La ERM no evalúa un modelo: compara **todos** los de la clase y se queda con el de menor error en el entrenamiento. Para que esa comparación sea confiable, la "encuesta" tiene que salir bien con todas las hipótesis a la vez. La fórmula agnóstica de la guía sale de la de Hoeffding con dos ajustes.

**Primer ajuste: repartir la confianza.** Si cada una de las $|\mathcal{H}|$ hipótesis puede fallar con probabilidad $\delta/|\mathcal{H}|$, la probabilidad de que falle alguna es, como mucho, la suma: $\delta$. Es la cota de la unión de la sección 7.2. En la fórmula, $\ln(2/\delta)$ pasa a ser $\ln(2|\mathcal{H}|/\delta)$.

**Segundo ajuste: la mitad del margen para cada una.** Supongamos que todas las estimaciones quedan a menos de $\epsilon/2$ de su error real, y llamemos $h^*$ a la mejor de la clase. El error real de la elegida es como mucho su error de entrenamiento más $\epsilon/2$; su error de entrenamiento es como mucho el de $h^*$ (por eso la eligió la ERM); y el de entrenamiento de $h^*$ es como mucho su error real más $\epsilon/2$. Sumando, la elegida queda a menos de $\epsilon$ de la mejor. Poner $\epsilon/2$ en Hoeffding multiplica por 4 y da la fórmula de la guía: $m \ge 2\ln(2|\mathcal{H}|/\delta)/\epsilon^2$.

Con los números de la guía, $\ln(200\,000) \approx 12.21$ y $2 \times 12.21/0.0025 \approx 9765$.

**Por qué el agnóstico cuesta tanto más.** En el caso realizable alcanza con **descartar** hipótesis: una mala se delata en cuanto comete un error, y eso pasa enseguida (por eso $1/\epsilon$). En el agnóstico todas se equivocan alguna vez y hay que **medir** cuánto, con la precisión de una encuesta (por eso $1/\epsilon^2$). La diferencia se nota al exigir más: con $\epsilon = 0.025$ el caso realizable pasa de 231 a 461 datos, y el agnóstico, de 9765 a unos $39\,060$.`,
        sources: [
          'Shalev-Shwartz y Ben-David, *Understanding Machine Learning*, cap. 4 (convergencia uniforme)',
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
        type: 'recall',
        items: [
          {
            question: t`¿Qué es un hiperplano?`,
            answer: t`Una superficie plana que parte el espacio en dos lados: una recta en el plano, un plano en tres dimensiones. Un clasificador lineal dice "sí" de un lado y "no" del otro. Lo viste en Módulo 0.3.`,
          },
          {
            question: t`¿Cómo dependían los datos necesarios del tamaño de una clase finita?`,
            answer: t`A través de un logaritmo: $m \ge \ln(|\mathcal{H}|/\delta)/\epsilon$, así que una clase mucho más grande pide apenas algunos datos más. El problema es que, con una clase infinita, esa cuenta no sirve. Lo viste en Módulo 7.2.`,
          },
        ],
      },
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
      {
        type: 'intuition',
        title: 'Medir la flexibilidad de un modelo',
        text: t`**Medir la flexibilidad.** Con infinitas opciones (todas las rectas del plano), no podés medir la flexibilidad contándolas. La **dimensión VC** la mide con un juego: ¿cuántos puntos puede "dominar" el modelo, acomodándose para reproducir **cualquier** combinación de sí y no que le pidas? Ese tamaño máximo es la dimensión.`,
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
        type: 'intuition',
        title: 'Un cartel en una puerta',
        text: t`**Un cartel en una puerta.** Un cartel que dice "se admiten personas entre $a$ y $b$ años" es un intervalo. Con dos personas (de 30 y 50 años) podés lograr cualquiera de las cuatro combinaciones sí/no ajustando $a$ y $b$. Pero con tres personas de 20, 40 y 60 no podés admitir a la de 20 y a la de 60 y dejar afuera a la de 40, porque un rango continuo no tiene huecos. Por eso la dimensión de los intervalos es $2$. Con un umbral ("sí si $x$ es mayor que $a$") solo se domina un punto: dimensión $1$.`,
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
        type: 'deepDive',
        title: t`Por qué alcanza con que la dimensión VC sea finita`,
        text: t`La fórmula para clases finitas usa $\ln|\mathcal{H}|$, y con infinitas rectas o intervalos eso no sirve. Pero hay una observación que lo salva: **sobre una muestra concreta, una clase infinita se comporta como una finita**. Lo que importa no es cuántas hipótesis hay, sino cuántos **etiquetados distintos** pueden producir sobre los $m$ puntos que tenés.

**Los intervalos sobre 10 puntos.** Hay $2^{10} = 1024$ formas de etiquetar 10 puntos con sí y no. Un intervalo solo logra las que tienen los "sí" todos seguidos: elegir dónde empieza y dónde termina el bloque de "sí" (55 formas), más la de ningún "sí". En total, $56$ de $1024$. Con 100 puntos, $5051$ contra un número de 31 cifras.

**El lema de Sauer** dice que esto no es casualidad: si la dimensión VC es $d$, sobre $m$ puntos se logran como mucho $\binom{m}{0} + \binom{m}{1} + \dots + \binom{m}{d}$ etiquetados. Para los intervalos ($d = 2$) con 10 puntos: $1 + 10 + 45 = 56$, justo lo que contamos. Esa suma crece como $m^d$, una potencia, y no como $2^m$.

**Por qué eso alcanza.** La demostración del teorema usa esa cantidad en lugar de $|\mathcal{H}|$ (con algunos ajustes técnicos). Su logaritmo crece como $d \ln m$, muy despacio, así que con suficientes datos la cuenta cierra, y los datos necesarios quedan proporcionales a $d$. En cambio, la función memoria logra los $2^m$ etiquetados para cualquier $m$: su logaritmo crece al mismo ritmo que $m$, los datos nunca alcanzan a pagarlo, y por eso no es aprendible.`,
        sources: [
          'Vapnik y Chervonenkis, "On the uniform convergence of relative frequencies of events to their probabilities", *Theory of Probability and Its Applications* (1971)',
          'Sauer, "On the density of families of sets", *Journal of Combinatorial Theory, Series A* (1972)',
          'Shalev-Shwartz y Ben-David, *Understanding Machine Learning*, cap. 6',
        ],
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
        type: 'recall',
        items: [
          {
            question: t`¿Qué era el sesgo inductivo?`,
            answer: t`La suposición previa sobre cómo es el mundo que se impone al restringir la clase de hipótesis (solo rectas, solo árboles chicos). Es lo que permite generalizar. Lo viste en Módulo 7.2.`,
          },
          {
            question: t`¿Qué hacía la validación cruzada?`,
            answer: t`Parte los datos en $k$ grupos; cada grupo sirve una vez de prueba mientras el modelo se entrena con el resto, y se promedian los $k$ errores. Así estima el error con datos nuevos sin gastar un conjunto de prueba aparte. Lo viste en Módulo 6.3.`,
          },
        ],
      },
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
      {
        type: 'deepDive',
        title: t`Por qué ningún algoritmo gana en promedio`,
        text: t`Hay una versión del teorema, la de Wolpert, que se entiende con un ejemplo chiquito. En el mundo hay cuatro casos posibles y viste dos con su etiqueta. Faltan dos que nunca viste. ¿Qué etiquetas tienen? Cualquier combinación es compatible con lo que viste: 00, 01, 10 u 11. Son cuatro "mundos" posibles.

Supongamos que tu algoritmo predice 1 y 1 para los dos casos nuevos. En el mundo 11 acierta los dos; en el 01 y en el 10 se equivoca en uno; en el 00, en los dos. Sumando, $0 + 1 + 1 + 2 = 4$ errores en $8$ predicciones: un $50$ %. Probá con cualquier otra predicción y da lo mismo. Con 10 casos sin ver hay $1024$ mundos posibles, y el promedio sigue siendo $50$ %.

**Promediando sobre todas las reglas posibles, en lo que no viste ningún algoritmo le gana a tirar una moneda.** Lo que viste no dice nada sobre lo que no viste, salvo que supongas algo que los conecte.

Por eso un algoritmo solo puede ganar en unos problemas a costa de perder en otros, y la única salida es **apostar**: suponer que algunas reglas son más probables que otras (que los casos parecidos se parecen, que la relación es lineal, que la regla es corta). Eso es el sesgo inductivo. El teorema no dice que aprender sea imposible; dice que es imposible **sin una apuesta**, y que la calidad de la apuesta la pone el conocimiento del problema.`,
        sources: [
          'Wolpert, "The lack of a priori distinctions between learning algorithms", *Neural Computation* (1996)',
          'Shalev-Shwartz y Ben-David, *Understanding Machine Learning*, cap. 5',
          'Cifras inventadas para el ejemplo',
        ],
      },
    ],
  },
  {
    id: '7.6',
    moduleId: 7,
    title: 'Regularización, estabilidad y la navaja de Ockham',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué mide la entropía en bits?`,
            answer: t`Cuántas preguntas de sí o no hacen falta, en promedio, para averiguar una respuesta. Vale $0$ si ya sabés la respuesta y $1$ bit si es una moneda equilibrada. Lo viste en Módulo 4.3.`,
          },
          {
            question: t`¿Qué hacía Ridge y qué controlaba $\lambda$?`,
            answer: t`Suma a los errores al cuadrado una penalización $\lambda \sum \beta^2$ que encoge los coeficientes hacia cero. Con $\lambda$ grande, coeficientes más chicos: más sesgo y menos varianza. Lo viste en Módulo 6.4.`,
          },
          {
            question: t`¿Cómo se pasaba de garantizar un modelo a garantizar toda la clase?`,
            answer: t`Repartiendo la confianza: si cada hipótesis puede fallar con probabilidad $\delta/|\mathcal{H}|$, la probabilidad de que falle alguna es como mucho $\delta$ (la cota de la unión). Lo viste en Módulo 7.3.`,
          },
        ],
      },
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
      {
        type: 'deepDive',
        title: t`Estabilidad con números: cuánto mueve un solo dato`,
        text: t`Tomá el modelo más simple posible: predecir siempre con un único número $b$. Sin penalización, el mejor $b$ es el promedio. Con una penalización como la de Ridge se minimiza $\sum (x_i - b)^2 + \lambda b^2$, y derivando e igualando a cero queda:

$b = \dfrac{\sum x_i}{n + \lambda}$

Es el promedio, pero con $\lambda$ "datos fantasma" iguales a cero en el denominador.

Supongamos $n = 10$ datos, todos entre $0$ y $10$. **¿Cuánto puede mover $b$ un solo dato?** Cambiar un dato mueve la suma como mucho $10$, así que $b$ se mueve como mucho $10/(n + \lambda)$: $10/10 = 1$ sin penalización y $10/20 = 0.5$ con $\lambda = 10$. La penalización **cortó a la mitad** la influencia de cada dato.

**El precio.** Si los diez datos valen $6$, sin penalización $b = 6$, que es lo correcto. Con $\lambda = 10$, $b = 60/20 = 3$: se quedó corto a la mitad. Y si cambiás uno de esos seises por un $0$, $b$ pasa de $6$ a $5.4$ sin penalización, pero solo de $3$ a $2.7$ con ella.

En el otro extremo está la función memoria: cambiar un dato cambia por completo su respuesta en ese punto. Es el algoritmo más inestable posible, y por eso no generaliza. Menos influencia de cada dato es menos varianza; encogerse hacia cero es más sesgo: el equilibrio de la sección, con números.`,
        sources: [
          'Bousquet y Elisseeff, "Stability and generalization", *Journal of Machine Learning Research* (2002)',
          'Shalev-Shwartz y Ben-David, *Understanding Machine Learning*, cap. 13',
          'Cifras inventadas para el ejemplo',
        ],
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
        type: 'intuition',
        title: 'Tu auto no arranca: la navaja de Ockham',
        text: t`**Tu auto no arranca.** Una explicación: "la batería está descargada". Otra: "falló el motor de arranque, a la vez se cortó un cable y además hay un problema en la bomba de combustible". Si ambas explican igual de bien los síntomas, conviene empezar por la corta. Es la **navaja de Ockham**, y la teoría la vuelve precisa: cuanto más cortos sean los bits que hacen falta para describir una regla, mejor es la garantía de que generalice.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo numérico* ($m=1000$, $\delta=0.05$): una hipótesis de **50 bits** tiene un margen de error de $\sqrt{(50+3.69)/2000} \approx 0.16$; una de **500 bits**, de $\sqrt{(500+3.69)/2000} \approx 0.50$. Con igual error en entrenamiento, **la más simple tiene una garantía mucho mejor**.`,
      },
      {
        type: 'deepDive',
        title: t`De dónde sale la cota de Ockham: repartir la confianza`,
        text: t`Es la idea de la sección 7.3 con un reparto distinto. Allá, para que la encuesta saliera bien con todas las hipótesis a la vez, se le daba a cada una la misma parte de la probabilidad de fallar: $\delta/|\mathcal{H}|$. Acá la clase puede ser infinita, así que no se puede repartir en partes iguales.

**El reparto desigual.** A cada regla $h$ se le da una parte $\delta \cdot 2^{-|h|}$: una regla de $10$ bits recibe $2^{-10}$ de $\delta$, alrededor de una milésima; una de 50 bits, una parte muchísimo menor. Si el lenguaje no tiene ambigüedades (ninguna descripción es el comienzo de otra), todas esas partes suman como mucho $\delta$, así que la probabilidad de que falle alguna sigue acotada.

**El margen de cada regla.** Hoeffding con confianza $\delta \cdot 2^{-|h|}$ da un margen $\sqrt{\ln(2^{|h|} \cdot 2/\delta)/(2m)}$. Como $\ln(2^{|h|}) = |h| \ln 2$ y $\ln 2 \approx 0.69$ es menor que $1$, ese margen es como mucho el de la guía: $\sqrt{(|h| + \ln(2/\delta))/(2m)}$.

Ahí está la navaja de Ockham, sin filosofía: las reglas cortas reciben más confianza y por eso pagan un margen más chico. No es que el mundo sea simple; es que **apostaste** por las reglas cortas antes de ver los datos, y la cota te cobra menos cuando la apuesta coincide con lo que encontrás.`,
        sources: [
          "Blumer, Ehrenfeucht, Haussler y Warmuth, \"Occam's razor\", *Information Processing Letters* (1987)",
          'Shalev-Shwartz y Ben-David, *Understanding Machine Learning*, cap. 7',
        ],
      },
      {
        type: 'paragraph',
        text: t`**Principio MDL:** elegir la hipótesis que minimiza (error en entrenamiento) + (término de complejidad). Es otra forma de **regularización**.`,
      },
      {
        type: 'deepDive',
        title: t`MDL con bits: el mejor modelo es el que mejor comprime`,
        text: t`El principio MDL tiene una lectura muy concreta. Imaginá que tenés que **mandarle a otra persona** las etiquetas (sí o no) de $1000$ casos, y que ella ya tiene los datos de entrada. El mensaje tiene dos partes: la regla, y la lista de casos en que la regla se equivoca. El mejor modelo es el que da el mensaje más corto.

**Sin modelo (memorizar):** mandás cada etiqueta, $1$ bit por caso: $1000$ bits. Cero errores y cero compresión.

**Regla simple:** se describe con $20$ bits y se equivoca en el $5$ % de los casos. Para señalar los errores alcanza, en promedio, con la entropía de una moneda que sale "error" el 5 % de las veces: $H(0.05) \approx 0.286$ bits por caso, unos $286$ bits en total. Mensaje: unos $306$ bits.

**Regla compleja:** $400$ bits y se equivoca solo en el $1$ %: $H(0.01) \approx 0.081$ bits por caso, unos $81$ bits. Mensaje: unos $481$ bits.

Gana la regla simple aunque se equivoca cinco veces más: lo que ahorra al describirse vale más de lo que gasta en corregirse. La compleja le gana a memorizar, pero pierde contra la simple.

Es la misma estructura que la cota de la sección: bits de la regla más error en el entrenamiento. Y conecta con la entropía de los árboles: medir cuántas preguntas de sí o no hacen falta es lo mismo que medir cuántos bits cuesta mandar la respuesta.`,
        sources: [
          'Rissanen, "Modeling by shortest data description", *Automatica* (1978)',
          'Grünwald, *The Minimum Description Length Principle*, MIT Press (2007)',
          'Cover y Thomas, *Elements of Information Theory*',
          'Cifras inventadas para el ejemplo',
        ],
      },
      {
        type: 'paragraph',
        text: t`*Salvedad:* la longitud de descripción depende del **lenguaje** elegido; no existe una noción absoluta de "simplicidad". Esa elección es otra forma de sesgo inductivo.`,
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
      {
        type: 'intuition',
        title: 'Un mismo dilema con muchos nombres',
        text: t`**Un mismo dilema con muchos nombres.** Casi todo lo que viste en este módulo es una versión del mismo problema: ajustarse a los datos que tenés sin pasarte de flexible. En el módulo 6 lo viste como sesgo y varianza; acá lo ves como error de aproximación y error de estimación.

**Lo que te llevás.** Un modelo bueno no es el que mejor explica lo que ya pasó, sino el que mejor se prepara para lo que todavía no viste. Todo el curso, desde la nota del simulacro hasta la regularización, trata de eso.`,
      },
    ],
  },
]
