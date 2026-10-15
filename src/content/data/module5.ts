import type { ContentBlock, Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 5. Los bloques `extra` son ejemplos
// agregados (cotidianos o clásicos): no son de la guía y se muestran rotulados.
const t = String.raw

/** Apertura del módulo, previa a la sección 5.1. */
export const module5Intro: ContentBlock[] = [
  {
    type: 'paragraph',
    text: t`Cuando la variable que queremos explicar o predecir es **categórica** (¿se aprueba el crédito?, ¿el cliente compra?, ¿el correo es spam?), la regresión lineal del Módulo 3 deja de ser adecuada. Este módulo presenta los modelos pensados para ese caso. Usa ideas de módulos anteriores: probabilidad condicional y Bayes (0.2), logaritmos y exponenciales (0.5), máxima verosimilitud (2.6) y la matriz de confusión (4.3).`,
  },
  {
    type: 'paragraph',
    text: t`Notación: la variable respuesta es $Y \in \{0, 1\}$ (1 = "éxito": compra, pago, spam) y $X$ representa las variables explicativas. Lo que queremos modelar es la **probabilidad condicional** $p(X) = P(Y=1 \mid X)$.`,
  },
]

export const module5Sections: Section[] = [
  {
    id: '5.1',
    moduleId: 5,
    title: 'El modelo lineal de probabilidad (LPM) y sus límites',
    blocks: [
      { type: 'paragraph', text: t`La idea más simple: aplicar OLS (Módulo 3) directamente a $y$ (que vale 0 o 1):` },
      { type: 'formula', latex: t`y = \beta_0 + \beta_1 x_1 + \dots + \beta_k x_k + u` },
      {
        type: 'paragraph',
        text: t`Como $E(y \mid X) = P(y=1 \mid X)$, el valor predicho $\hat{y}$ se interpreta como una **probabilidad**, y $\beta_j$ como el cambio en esa probabilidad (en puntos de probabilidad) por cada unidad de $x_j$. Es simple y fácil de interpretar, pero tiene **tres problemas**:`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**Probabilidades imposibles.** Nada impide que $\hat{y} < 0$ o $\hat{y} > 1$. *Ejemplo:* si $\hat{y} = -0.1 + 0.25x$, con $x = 5$ (ingreso en miles) se predice $1.15$ ($115\,\%$), y con $x=0$, $-0.10$ ($-10\,\%$).`,
          t`**Efecto constante.** Un aumento de una unidad en $x_j$ siempre mueve la probabilidad en $\beta_j$, sin importar el nivel de partida. Es poco realista: pasar de 0 a 1 hijo no suele afectar la decisión de trabajar igual que pasar de 4 a 5. Y cerca de 0 % o 100 % es imposible seguir sumando.`,
          t`**Heterocedasticidad inherente.** Como $y$ solo toma 0 o 1, la varianza del error es $\text{Var}(u \mid X) = p(X)\,(1-p(X))$, que **cambia con $X$** (vale $0.25$ si $p=0.5$ y solo $0.09$ si $p=0.9$). Se viola MLR.5 (Módulo 3.6), así que hacen falta errores estándar robustos.`,
        ],
      },
      { type: 'miniCheck', questionIds: ['m5-q01'] },
      {
        type: 'paragraph',
        text: t`El LPM se usa a veces en econometría por su simplicidad, pero para predecir o para probabilidades extremas se prefieren los modelos siguientes.`,
      },
      {
        type: 'extra',
        text: t`Imagina que modelas la probabilidad de aprobar un examen según las horas de estudio con $\hat{y} = -0.2 + 0.15\,\text{horas}$. Con 4 horas da $0.40$, razonable. Pero con 9 horas da $-0.2 + 1.35 = 1.15$: una "probabilidad" del 115 %. Y la recta sigue sumando 0.15 por hora aunque la probabilidad ya esté cerca de 100 %, cuando en la realidad cada hora extra aporta cada vez menos.`,
      },
    ],
  },
  {
    id: '5.2',
    moduleId: 5,
    title: 'Regresión logística',
    blocks: [
      {
        type: 'paragraph',
        text: t`**Idea:** en vez de modelar la probabilidad con una recta, se pasa la combinación lineal $z = \beta_0 + \beta_1 X_1 + \dots + \beta_k X_k$ por una función en forma de "S" que **siempre devuelve valores entre 0 y 1**: la **función logística**.`,
      },
      { type: 'formula', latex: t`p(X) = \frac{e^{z}}{1+e^{z}} = \frac{1}{1+e^{-z}}` },
      {
        type: 'table',
        headers: [t`$z$`, t`$-4$`, t`$-2$`, t`$-1$`, t`$0$`, t`$1$`, t`$2$`, t`$4$`],
        rows: [[t`$p$`, '0.018', '0.119', '0.269', '0.500', '0.731', '0.881', '0.982']],
      },
      {
        type: 'paragraph',
        text: t`Cuando $z$ es muy negativo, $p$ se acerca a 0 sin llegar; cuando es muy positivo, se acerca a 1 sin pasarse.`,
      },
      { type: 'subheading', text: 'Probabilidad, odds, log-odds y odds ratio' },
      { type: 'paragraph', text: 'Para interpretar los coeficientes conviene pasar por tres escalas:' },
      { type: 'miniCheck', questionIds: ['m5-q02'] },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**Probabilidad** $p \in [0,1]$.`,
          t`**Odds** (posibilidades): $\text{odds} = \dfrac{p}{1-p}$, cuántas veces es más probable que ocurra a que no ocurra. *Ejemplo:* $p = 0.8 \Rightarrow \text{odds} = 0.8/0.2 = 4$ ("4 a 1"); $p = 0.5 \Rightarrow 1$; $p = 0.2 \Rightarrow 0.25$. Se recupera la probabilidad con $p = \text{odds}/(1+\text{odds})$.`,
          t`**Log-odds (logit)**: el logaritmo natural de los odds. En la regresión logística es **exactamente la combinación lineal**:`,
        ],
      },
      { type: 'formula', latex: t`\ln\!\left(\frac{p(X)}{1-p(X)}\right) = \beta_0 + \beta_1 X_1 + \dots + \beta_k X_k` },
      {
        type: 'paragraph',
        text: t`Es decir: **el modelo es lineal en los log-odds**. Por eso $\beta_1$ es el cambio en el log-odds al aumentar $X_1$ una unidad, manteniendo lo demás constante.`,
      },
      {
        type: 'paragraph',
        text: t`**Odds ratio (OR)**: como los log-odds suben $\beta_1$, los odds se **multiplican por $e^{\beta_1}$**. Ese factor es el *odds ratio* de $X_1$:`,
      },
      {
        type: 'list',
        items: [
          t`$\text{OR} > 1$ ($\beta_1>0$): $X_1$ aumenta los odds.`,
          t`$\text{OR} = 1$ ($\beta_1 = 0$): sin efecto.`,
          t`$\text{OR} < 1$ ($\beta_1<0$): $X_1$ reduce los odds.`,
        ],
      },
      {
        type: 'extra',
        text: t`Las "chances" que se escuchan en las apuestas son odds: un caballo que paga "4 a 1" tiene odds de 4 en contra, es decir, una probabilidad de ganar de $1/(1+4) = 0.2$. Y si el pronóstico dice 75 % de probabilidad de lluvia, los odds de lluvia son $0.75/0.25 = 3$: "3 a 1" a favor de que llueva.`,
      },
      {
        type: 'paragraph',
        text: t`**Ejemplo de interpretación.** Si el coeficiente de "fumar" es $\beta_1 = 0.693$, entonces $\text{OR} = e^{0.693} \approx 2$: los fumadores tienen **el doble de odds** de enfermar que los no fumadores (a igualdad de las demás variables). Cuidado: **doble de odds no es doble de probabilidad**; solo son parecidos cuando el evento es raro.`,
      },
      {
        type: 'paragraph',
        text: t`**Ejemplo numérico completo.** Modelo de morosidad: $\ln(\text{odds}) = -2 + 0.7\,x$, donde $x$ = número de atrasos previos.`,
      },
      {
        type: 'list',
        items: [
          t`$x=0$: $z = -2 \Rightarrow p \approx 0.119$.`,
          t`$x=1$: $z = -1.3 \Rightarrow p \approx 0.214$.`,
          t`$x=2$: $z = -0.6 \Rightarrow p \approx 0.354$.`,
          t`$x=3$: $z = 0.1 \Rightarrow p \approx 0.525$.`,
          t`$\text{OR} = e^{0.7} \approx 2.01$: cada atraso adicional **duplica los odds** de mora.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`**El efecto sobre la probabilidad no es constante.** Los odds se duplican siempre, pero la probabilidad sube $0.095$ al pasar de 0 a 1 atraso y $0.171$ al pasar de 2 a 3. El efecto de $x_j$ sobre $p$ es aproximadamente $\beta_j\, p(1-p)$: **es máximo cerca de $p=0.5$** (ahí vale $\beta_j/4$, regla práctica rápida) y se achata hacia los extremos. Esto resuelve el segundo problema del LPM.`,
      },
      {
        type: 'extra',
        text: t`Volvamos al examen: ahora con un modelo logístico $z = -3 + 0.5\,\text{horas}$. Con 2 horas, $z=-2$ y $p \approx 0.119$; con 4 horas, $z=-1$ y $p \approx 0.269$; con 6 horas, $z=0$ y $p = 0.5$; con 8 horas, $z=1$ y $p \approx 0.731$; con 10 horas, $p \approx 0.881$. Nunca pasa de 1, y las horas que más suben la probabilidad son las del medio (alrededor de 6 horas). Cada hora multiplica los odds por $e^{0.5} \approx 1.65$.`,
      },
      { type: 'subheading', text: 'Estimación: máxima verosimilitud' },
      {
        type: 'paragraph',
        text: t`Los coeficientes no se calculan con una fórmula cerrada como OLS, sino por **máxima verosimilitud (MLE)**, como la moneda del Módulo 2.6, pero ahora con una probabilidad $p_i$ distinta para cada observación. La probabilidad de observar $y_i$ es $p_i^{y_i}(1-p_i)^{1-y_i}$, la verosimilitud es el producto de todas, y se maximiza su logaritmo (suma) con un **algoritmo iterativo** (Newton-Raphson). Para el logit la función a maximizar es cóncava, así que hay un único máximo.`,
      },
      {
        type: 'paragraph',
        text: t`**Clasificar.** El modelo da $\hat{p}$. Para obtener una clase se fija un **umbral**: $\hat{p} > 0.5 \Rightarrow$ clase 1. Subir o bajar el umbral intercambia precisión y recall (Módulo 4.3): un umbral bajo detecta más positivos (más recall), pero con más falsas alarmas.`,
      },
      { type: 'paragraph', text: '**Evaluar el modelo:**' },
      {
        type: 'list',
        items: [
          t`**Test de razón de verosimilitud (LR):** compara un modelo completo con uno restringido: $LR = 2(\ln L_{\text{completo}} - \ln L_{\text{restringido}})$, que bajo $H_0$ sigue una $\chi^2$ con tantos grados de libertad como restricciones (Módulo 2.4). Es el equivalente del test $F$ de la regresión.`,
          t`**Pseudo $R^2$ de McFadden:** $1 - \ln L_{\text{modelo}}/\ln L_{\text{nulo}}$ (el modelo nulo solo tiene constante). *Ejemplo:* $\ln L_{\text{nulo}} = -100$ y $\ln L_{\text{modelo}} = -70 \Rightarrow R^2_{\text{McF}} = 0.30$ (y $LR = 60$). **No es comparable con el $R^2$ de OLS:** valores de 0.2 a 0.4 ya se consideran un buen ajuste.`,
          t`**Curva ROC y AUC:** al variar el umbral de 0 a 1 se grafica la **tasa de verdaderos positivos** (el recall, $VP/(VP+FN)$) contra la **tasa de falsos positivos** ($FP/(FP+VN)$). El **AUC** (área bajo la curva) es la probabilidad de que el modelo asigne mayor $\hat{p}$ a un positivo real elegido al azar que a un negativo real. $0.5$ equivale a azar; $1$ es un clasificador perfecto.`,
        ],
      },
      {
        type: 'extra',
        text: t`El AUC se entiende con un juego: elige al azar a una persona realmente enferma y a otra sana, y fíjate a cuál le asignó el modelo la probabilidad más alta. Un AUC de 0.5 es lo mismo que tirar una moneda para decidir cuál es la enferma; un AUC de 0.9 significa que, en 9 de cada 10 pares así, el modelo pone más arriba a la persona enferma.`,
      },
    ],
  },
  {
    id: '5.3',
    moduleId: 5,
    title: 'Probit y el modelo de variable latente',
    blocks: [
      {
        type: 'paragraph',
        text: t`Tanto logit como probit pueden entenderse con una **variable latente** $y^{*}$: una magnitud **no observable** (la "utilidad neta" de comprar, la "propensión" a enfermar):`,
      },
      {
        type: 'formula',
        latex: t`y^{*} = \beta_0 + X\beta + e, \qquad y = 1 \text{ si } y^{*} > 0,\quad y = 0 \text{ en caso contrario}`,
      },
      {
        type: 'paragraph',
        text: t`Solo observamos si $y^*$ cruzó el umbral 0. La probabilidad de $y=1$ depende de la **distribución que supongamos para el error $e$**:`,
      },
      {
        type: 'list',
        items: [
          t`**Logit:** $e$ sigue una distribución **logística** estándar $\Rightarrow$ $p = 1/(1+e^{-z})$.`,
          t`**Probit:** $e$ sigue una **Normal estándar** $N(0,1)$ $\Rightarrow$ $p = \Phi(z)$, donde $\Phi(z)$ es la **función de distribución acumulada Normal**: la probabilidad de que una Normal estándar sea menor o igual a $z$ (por ejemplo, $\Phi(0) = 0.5$ y $\Phi(1.96) \approx 0.975$).`,
        ],
      },
      { type: 'paragraph', text: '**Comparación práctica:**' },
      {
        type: 'list',
        items: [
          t`Las dos curvas en "S" son casi idénticas; la logística tiene colas algo más pesadas. Con frecuencia dan **las mismas predicciones y conclusiones**.`,
          t`**Escala de los coeficientes:** como la logística tiene mayor dispersión que la Normal estándar, los coeficientes del logit son aproximadamente **1.6 a 1.8 veces mayores** que los del probit. No son comparables directamente. *Ejemplo:* si el logit da $0.8$, el probit rondará $0.5$.`,
          t`**Interpretación:** el logit permite hablar de **odds ratios**. En el probit solo se interpretan el signo, la significación y los efectos marginales sobre la probabilidad. Por eso el logit es más popular.`,
          t`Ambos se estiman por **máxima verosimilitud**.`,
        ],
      },
      {
        type: 'extra',
        text: t`La variable latente es como la "ganas de salir a correr": no se mide, solo observas si finalmente saliste (1) o no (0). Si tus ganas superan el umbral cero, sales. Dos personas pueden describir lo mismo con escalas distintas, como la temperatura en Celsius o en Fahrenheit: el coeficiente 0.8 del logit y el 0.5 del probit cuentan la misma historia en unidades de error diferentes.`,
      },
    ],
  },
  {
    id: '5.4',
    moduleId: 5,
    title: 'Clasificadores generativos: LDA, QDA y Naive Bayes',
    blocks: [
      {
        type: 'paragraph',
        text: t`La regresión logística es un enfoque **discriminativo**: modela directamente $P(Y \mid X)$. Los modelos **generativos** hacen lo opuesto: modelan **cómo se distribuyen las variables $X$ dentro de cada clase** y luego aplican el **Teorema de Bayes** (Módulo 0.2) para obtener la probabilidad de cada clase dada la observación:`,
      },
      {
        type: 'formula',
        latex: t`P(Y=k \mid X=x) = \frac{P(X=x \mid Y=k)\; P(Y=k)}{\sum_{l=1}^{K} P(X=x \mid Y=l)\; P(Y=l)}`,
      },
      { type: 'paragraph', text: 'Cada pieza tiene nombre:' },
      {
        type: 'list',
        items: [
          t`$P(Y=k)$: **probabilidad a priori** (qué proporción de la población pertenece a la clase $k$; se estima con la frecuencia en los datos).`,
          t`$P(X=x \mid Y=k)$: **verosimilitud** (qué tan típico es observar $x$ en la clase $k$; es lo que hay que modelar).`,
          t`$P(Y=k \mid X=x)$: **probabilidad a posteriori** (la que se quiere). Se asigna al registro la clase con **mayor probabilidad posterior**.`,
        ],
      },
      { type: 'miniCheck', questionIds: ['m5-q08'] },
      { type: 'paragraph', text: 'Los tres métodos difieren en **cómo modelan** la verosimilitud.' },
      { type: 'subheading', text: 'LDA: Análisis Discriminante Lineal' },
      {
        type: 'paragraph',
        text: t`Supone que, dentro de cada clase, $X$ sigue una **Normal** con **media propia** $\mu_k$ y una **matriz de covarianza común** $\Sigma$ (Módulo 0.3: la tabla de varianzas y covarianzas entre las variables) **igual para todas las clases**. Con esas suposiciones, la frontera de decisión entre clases es **lineal** (una recta o un hiperplano).`,
      },
      {
        type: 'paragraph',
        text: t`**Ejemplo con una variable.** Dos clases: A con media $\mu_A = 2$ y B con $\mu_B = 6$; ambas con desviación típica $\sigma = 2$.`,
      },
      {
        type: 'list',
        items: [
          t`Con **a priori iguales**, la frontera está en el punto medio: $x = 4$.`,
          t`Para $x = 5$, las verosimilitudes relativas son $e^{-(5-2)^2/8} \approx 0.325$ (A) y $e^{-(5-6)^2/8} \approx 0.883$ (B): probabilidad posterior de B $\approx 0.883/(0.325+0.883) \approx 0.73$.`,
          t`Si las **a priori son desiguales** ($\pi_A = 0.8$, $\pi_B = 0.2$), la frontera se mueve hacia la clase **más rara**: $x = \tfrac{\mu_A+\mu_B}{2} - \dfrac{\sigma^2 \ln(\pi_A/\pi_B)}{\mu_A-\mu_B} \approx 5.39$. Solo se clasifica como B si $x > 5.39$.`,
        ],
      },
      {
        type: 'extra',
        text: t`Para decidir si una fruta es manzana o pera solo por su peso: las manzanas pesan en promedio 150 g, las peras 200 g, y ambas varían con desviación típica de 25 g. Con a priori iguales, la frontera está en el punto medio, 175 g. Una fruta de 190 g: las verosimilitudes relativas son $e^{-(190-150)^2/1250} \approx 0.278$ (manzana) y $e^{-(190-200)^2/1250} \approx 0.923$ (pera), así que la probabilidad de que sea pera es $0.923/(0.278+0.923) \approx 0.77$.`,
      },
      { type: 'subheading', text: 'QDA: Análisis Discriminante Cuadrático' },
      {
        type: 'paragraph',
        text: t`Igual que LDA, pero **cada clase tiene su propia matriz de covarianza** $\Sigma_k$. Las fronteras resultan **cuadráticas** (curvas). Es más flexible, pero **estima muchos más parámetros**. *Ejemplo:* con $p=50$ variables, la matriz de covarianza tiene $50\cdot51/2 = 1275$ parámetros; LDA estima una, y QDA con 3 clases estima $3\times1275 = 3825$. Es el trade-off sesgo-varianza del Módulo 6: **LDA** tiene más sesgo y menos varianza (mejor con pocos datos); **QDA**, menos sesgo y más varianza (mejor con muchos datos y covarianzas realmente distintas).`,
      },
      { type: 'subheading', text: 'Naive Bayes' },
      {
        type: 'paragraph',
        text: t`Supone que, **dentro de cada clase, todas las variables son independientes entre sí**. Eso permite **multiplicar** las verosimilitudes de cada variable, que se estiman de a una (algo muy simple):`,
      },
      { type: 'formula', latex: t`P(X_1,\dots,X_p \mid Y=k) = \prod_{j=1}^{p} P(X_j \mid Y=k)` },
      {
        type: 'workedExample',
        title: t`*Ejemplo (spam).* $P(\text{spam}) = 0.4$. Palabra "oferta": aparece en el $50\,\%$ del spam y en el $5\,\%$ del correo legítimo. Palabra "reunión": $10\,\%$ del spam y $40\,\%$ del legítimo. Para un correo con ambas palabras:`,
        steps: [t`Spam: $0.4 \times 0.5 \times 0.1 = 0.020$`, t`No spam: $0.6 \times 0.05 \times 0.4 = 0.012$`],
        result: t`Probabilidad de spam: $0.020/(0.020+0.012) = 0.625$.`,
      },
      {
        type: 'paragraph',
        text: t`El supuesto es "ingenuo" (las palabras no son realmente independientes), pero **funciona sorprendentemente bien**, sobre todo con muchísimas variables (como el texto), porque para clasificar basta que el **orden** de las probabilidades sea correcto, no que sean exactas. Es rápido, necesita pocos datos y se adapta bien a alta dimensión. *Problema típico:* si una palabra nunca apareció en una clase, su probabilidad es 0 y anula todo el producto; se corrige con **suavizado de Laplace** (sumar una pequeña cantidad a todos los conteos).`,
      },
      {
        type: 'extra',
        text: t`El mismo razonamiento sirve para un diagnóstico casero. De cada 10 consultas, 3 son gripe y 7 resfrío común. La fiebre aparece en el 80 % de las gripes y en el 20 % de los resfríos; el dolor muscular, en el 70 % de las gripes y el 10 % de los resfríos. Para alguien con fiebre y dolor muscular: gripe $= 0.3 \times 0.8 \times 0.7 = 0.168$; resfrío $= 0.7 \times 0.2 \times 0.1 = 0.014$. Probabilidad de gripe: $0.168/(0.168+0.014) \approx 0.92$. Se asume que los dos síntomas son independientes dentro de cada enfermedad, lo cual es la parte "ingenua".`,
      },
      { type: 'subheading', text: '¿Cuál usar?' },
      {
        type: 'table',
        headers: ['Método', 'Enfoque', 'Supone', 'Frontera', 'Útil cuando'],
        rows: [
          ['**Regresión logística**', 'Discriminativo', t`Casi nada sobre la distribución de $X$`, t`Lineal (en $X$)`, 'Quieres odds ratios y robustez'],
          ['**LDA**', 'Generativo', t`$X$ Normal por clase, $\Sigma$ común`, 'Lineal', 'Pocos datos, clases bien separadas, más de 2 clases'],
          ['**QDA**', 'Generativo', t`$X$ Normal por clase, $\Sigma_k$ propias`, 'Cuadrática', 'Muchos datos, covarianzas distintas'],
          ['**Naive Bayes**', 'Generativo', 'Variables independientes dentro de cada clase', 'Depende del tipo', 'Alta dimensión (texto), pocos datos'],
        ],
      },
    ],
  },
]
