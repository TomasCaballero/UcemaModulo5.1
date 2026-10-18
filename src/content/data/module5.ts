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
        type: 'intuition',
        title: 'La tentación de la recta',
        text: t`**La tentación de la recta.** Si querés predecir algo que solo puede ser "sí" (1) o "no" (0), lo más simple parece ajustar una recta, como en el módulo 3. Y la predicción se lee como una probabilidad. Funciona hasta cierto punto, pero tiene tres problemas.`,
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
      {
        type: 'intuition',
        title: 'Los tres problemas de la recta, en palabras simples',
        text: t`**Probabilidades imposibles.** Una recta no sabe que debe quedarse entre 0 y 1. Con $\hat{y} = -0.1 + 0.25x$ y $x = 5$ predice $1.15$, un 115 %. Y con $x = 0$ predice $-0.10$, un 10 % negativo. Es como una escalera que sigue subiendo después de llegar al techo.

**Siempre suma lo mismo.** La recta dice que cada unidad extra mueve la probabilidad en la misma cantidad, parta de donde parta. Pero no es realista: pasar de 0 a 1 hijo no pesa igual en la decisión de trabajar que pasar de 4 a 5. Y cerca de 0 % o 100 % ya no hay espacio para seguir sumando.

**El error no se reparte parejo.** Como el resultado solo puede ser 0 o 1, el error es más grande cuando la probabilidad ronda $0.5$ (varianza $0.25$) que cuando es alta (varianza $0.09$ con $0.9$). Eso rompe una de las cinco reglas del módulo 3 y obliga a usar errores estándar robustos.`,
      },
      { type: 'miniCheck', questionIds: ['m5-q01'] },
      {
        type: 'paragraph',
        text: t`El LPM se usa a veces en econometría por su simplicidad, pero para predecir o para probabilidades extremas se prefieren los modelos siguientes.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo de clase (Titanic):* si se codifica Survived como $0$ (no sobrevivió) y $1$ (sobrevivió) y se ajusta una recta, las predicciones de tres pasajeros pueden ser $-0.20$, $0.67$ y $1.12$: la recta se sale de $[0,1]$ y dos de esos valores no pueden ser probabilidades. Es el problema que resuelve la función logística de 5.2.`,
      },
      {
        type: 'intuition',
        title: 'Qué hacer',
        text: t`**Qué hacer.** Se usa en economía por su sencillez, pero para predecir, o para probabilidades extremas, se prefieren los modelos que siguen. En el ejemplo del Titanic, la recta daba valores como $-0.20$ y $1.12$, que no pueden ser probabilidades. La solución viene en 5.2.`,
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
      {
        type: 'intuition',
        title: 'Una S que nunca se pasa de 0 ni de 1',
        text: t`**Una S que nunca se pasa de 0 ni de 1.** La regresión logística hace lo mismo que una recta, pero pasa el resultado por una curva con forma de "S" (la función logística). Cuando el valor es muy negativo, la probabilidad se acerca a 0 sin llegar. Cuando es muy positivo, se acerca a 1 sin pasarse. En el medio ($z = 0$) vale justo $0.5$. Por eso nunca produce probabilidades imposibles.`,
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
        type: 'intuition',
        title: 'Probabilidad y chances de apuesta (odds)',
        text: t`**Probabilidad y chances de apuesta (odds).** Si el pronóstico dice 80 % de probabilidad de lluvia, los *odds* son $0.8 / 0.2 = 4$: "4 a 1" a favor. Los odds cuentan cuántas veces es más probable que ocurra a que no ocurra. Los dos números cuentan la misma historia en escalas distintas. El **logaritmo de los odds** (log-odds) es la escala en la que el modelo sí es una suma de ingredientes con pesos, como en el módulo 3.`,
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
        type: 'intuition',
        title: 'El odds ratio: cuánto multiplica una variable las chances',
        text: t`**El odds ratio: cuánto multiplica una variable las chances.** Si un factor suma $\beta$ en esa escala, los odds se **multiplican** por $e^{\beta}$ (el *odds ratio*). Con $\beta = 0.693$, $e^{0.693} \approx 2$: los fumadores tienen **el doble de odds** de enfermar. Ojo: doble de odds no es doble de probabilidad; solo se parecen cuando el evento es raro.`,
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
        type: 'paragraph',
        text: t`**El mismo odds ratio, distinto cambio en probabilidad.** Si una variable multiplica los odds por $\text{OR}$ y la probabilidad inicial era $p_0$, la nueva probabilidad es $p_1 = \dfrac{\text{OR}\cdot p_0}{1-p_0+\text{OR}\cdot p_0}$. *Ejemplo de clase (Titanic, ser mujer, $\text{OR} = e^{2.61} \approx 13.6$):* con $p_0 = 0.10$ los odds pasan de $0.11$ a $0.11 \times 13.6 \approx 1.50$ y $p_1 = 0.60$ (**+50 puntos porcentuales**); con $p_0 = 0.50$ los odds pasan de $1$ a $13.6$ y $p_1 \approx 0.93$ (**+43 puntos**). El OR es el mismo, pero el cambio en probabilidad depende del punto de partida.`,
      },
      {
        type: 'intuition',
        title: 'Por qué la probabilidad no sube parejo',
        text: t`**Por qué la probabilidad no sube parejo.** Los odds se multiplican por lo mismo en cada paso, pero la probabilidad cambia más en el medio de la S y menos en los extremos. En el ejemplo de morosidad, pasar de 0 a 1 atraso sube la probabilidad $0.095$, y pasar de 2 a 3 la sube $0.171$. Es como empujar una pelota en una curva: en la parte empinada avanza más que en las partes planas. Lo mismo vale para el Titanic: con un odds ratio de $13.6$ por ser mujer, la probabilidad pasa de $0.10$ a $0.60$ para quien partía de abajo y de $0.50$ a $0.93$ para quien partía del medio.`,
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
        type: 'intuition',
        title: 'Cómo se encuentran los números del modelo',
        text: t`**Cómo se encuentran los números del modelo.** Se prueban muchos valores y se elige el que hace más creíbles los datos que ya vimos (máxima verosimilitud, igual que con la moneda en el módulo 2, pero ahora con una probabilidad distinta para cada persona). Con cuatro pasajeros, un modelo que acierta con confianza se lleva mejor puntaje que uno que duda: $-0.60$ frente a $-2.42$.`,
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
      {
        type: 'paragraph',
        text: t`**Cómo leer la curva ROC.** Cada punto de la curva corresponde a un **umbral** distinto: el eje vertical es la tasa de verdaderos positivos (recall) y el horizontal la tasa de falsos positivos $= 1-\text{especificidad}$. La diagonal representa el azar (un clasificador sin capacidad de discriminar); cuanto más cerca de la esquina superior izquierda, mejor discrimina el modelo. La ROC mira **todos** los umbrales a la vez; el AUC resume qué tan bien el modelo distingue entre quienes tienen el evento y quienes no. Mover el umbral no cambia el modelo ni su AUC: solo recorre la curva (Módulo 4.3).`,
      },
      {
        type: 'intuition',
        title: 'AUC y ROC: dos maneras de decir qué tan bueno es',
        text: t`**Dos maneras de decir "qué tan bueno es".** El **AUC** responde: "si elijo al azar a un enfermo y a un sano, ¿a cuál le asignó la probabilidad más alta?". Un AUC de $0.5$ es lo mismo que tirar una moneda; $1$ es perfecto. La **curva ROC** muestra todos los umbrales posibles de una vez, y cambiar el umbral solo recorre la curva, no cambia el modelo.`,
      },
      { type: 'subheading', text: 'Un caso completo: el Titanic de la clase' },
      {
        type: 'paragraph',
        text: t`**Los datos.** El archivo train.csv reúne 891 pasajeros y 12 variables. La variable objetivo $Y$ es Survived (0 = no sobrevivió, 549 pasajeros; 1 = sobrevivió, 342) y las variables explicativas $X$ incluyen Pclass (clase), Sex, Age, SibSp, Parch, Fare y Embarked. Es **aprendizaje supervisado**: el algoritmo aprende patrones de casos pasados en los que se conoce el resultado y los aplica a pasajeros nuevos. Y es un problema de **clasificación**, no de regresión: se predice una categoría (sobrevive o no), no un número. En entrenamiento sobrevivió el $75.1\,\%$ de las mujeres (163 de 217) y solo el $18.7\,\%$ de los hombres (76 de 406).`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo de clase (Titanic, Kaggle).* Se parte train.csv (891 pasajeros) en 70 % entrenamiento (623) y 30 % prueba (268), estratificando por Survived. Con **una sola variable** (Female), el modelo estimado fue $\text{logit}(p) = -1.468 + 2.573\cdot\text{Female}$. Para una mujer: $z = -1.468 + 2.573 = 1.105$ y $p = 1/(1+e^{-1.105}) \approx 0.751$, coherente con la tasa observada en entrenamiento (163 de 217 mujeres, 75.1 %).`,
      },
      {
        type: 'paragraph',
        text: t`Con **tres variables** (Female, Age y Pclass como categórica, con la 1.ª clase de referencia) el modelo es $z = 1.4666 + 2.6100\,\text{Female} - 0.0439\,\text{Age} - 1.3946\,\text{Pclass}_2 - 2.5846\,\text{Pclass}_3$:`,
      },
      {
        type: 'table',
        headers: ['Variable', '$\\beta$', 'Odds ratio $e^{\\beta}$', 'Lectura (demás variables constantes)'],
        rows: [
          ['Female (1 = mujer)', '$2.6100$', '$13.6$', 'ser mujer multiplica los odds de sobrevivir por $13.6$'],
          ['Age (años)', '$-0.0439$', '$0.96$', 'cada año adicional multiplica los odds por $0.96$ ($\\approx 4\\,\\%$ menos)'],
          ['Pclass = 2 (vs. 1)', '$-1.3946$', '$0.25$', 'viajar en 2.ª clase multiplica los odds por $0.25$ ($\\approx 75\\,\\%$ menos)'],
          ['Pclass = 3 (vs. 1)', '$-2.5846$', '$0.08$', 'viajar en 3.ª clase multiplica los odds por $0.08$ ($\\approx 92\\,\\%$ menos)'],
        ],
      },
      {
        type: 'paragraph',
        text: t`Con el umbral $0.50$: una mujer de 23 años en 1.ª clase tiene $\hat{p} \approx 0.956$ (se predice "sobrevive"); un hombre de 30 años en 1.ª clase, $\hat{p} \approx 0.537$ ("sobrevive"); y un hombre de 30 años en 3.ª clase, $\hat{p} \approx 0.081$ ("no sobrevive"). El signo de cada $\beta$ indica hacia dónde empuja la probabilidad; el odds ratio dice cuántas veces se multiplican los odds.`,
      },
      {
        type: 'paragraph',
        text: t`Los odds de tres pasajeros del Titanic ilustran la escala: con $\hat{p} = 0.80$, $\text{odds} = 0.80/0.20 = 4.0$ (sobrevivir es 4 veces más probable que no); con $\hat{p} = 0.50$, $\text{odds} = 1.0$ (igual de probable); con $\hat{p} = 0.20$, $\text{odds} = 0.25$ (no sobrevivir es 4 veces más probable).`,
      },
      {
        type: 'paragraph',
        text: t`**De dónde salen los $\beta$ (ejemplo de clase).** Hay muchos $\beta$ posibles y hace falta un criterio: elegir los que mejor explican lo observado. Con 4 pasajeros (A sobrevivió, B no, C sobrevivió, D no), un modelo que asigna $\hat{p} = 0.90, 0.15, 0.80, 0.10$ explica mejor lo ocurrido que otro que asigna $0.60, 0.55, 0.55, 0.40$. La log-verosimilitud $\ell(\beta) = \sum_i [\,y_i \ln p_i + (1-y_i)\ln(1-p_i)\,]$ lo confirma: $\ell \approx -0.60$ para el primero y $\ell \approx -2.42$ para el segundo. Se eligen los $\beta$ que **maximizan** $\ell$ (en OLS, en cambio, se minimizan los errores al cuadrado).`,
      },
      { type: 'miniCheck', questionIds: ['m5-q23'] },
      { type: 'subheading', text: 'Seleccionar variables: forward, backward y stepwise' },
      {
        type: 'paragraph',
        text: t`Más variables no siempre dan un mejor modelo: pueden aportar información, pero también **redundancia** y complejidad innecesaria. Para decidir **qué variables conservar** se sigue un criterio sistemático (no se prueban combinaciones al azar):`,
      },
      {
        type: 'list',
        items: [
          t`**Forward (hacia adelante):** parte del modelo vacío. En cada paso prueba agregar cada variable candidata **por separado** y se queda con la que más mejora el modelo; se detiene cuando ninguna aporta una mejora relevante.`,
          t`**Backward (hacia atrás):** parte del modelo con **todas** las variables y, en cada paso, elimina la que menos aporta; se detiene cuando ninguna de las que quedan cumple el criterio de eliminación.`,
          t`**Stepwise:** combina ambos enfoques: puede agregar variables y también **volver a quitar** alguna que ya estaba y dejó de aportar.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`El **criterio de selección** puede ser estadístico (p-valor, AIC o BIC) o predictivo (por ejemplo, el AUC promedio por validación cruzada: se divide la muestra en partes y cada parte se evalúa con un modelo ajustado con las demás). Lo que distingue a los métodos es el punto de partida y la flexibilidad para agregar o quitar variables. *Ejemplo de clase (Titanic):* con candidatas Female, Age, Pclass, Fare y FamilySize, forward con AUC por validación cruzada de 5 folds incorporó primero Female (AUC CV $0.7708$), luego Pclass ($0.8333$) y luego Age ($0.8466$); Fare y FamilySize quedaron fuera. **Seleccionar variables no es lo mismo que regularizar:** seleccionar decide cuáles se conservan; regularizar cambia cómo se estiman los coeficientes de las que se conservan.`,
      },
      {
        type: 'intuition',
        title: 'Elegir qué variables conservar',
        text: t`**Elegir qué variables conservar.** Más variables no siempre ayudan: pueden aportar repetición y complejidad. *Forward* parte de un modelo vacío y va sumando la que más mejora. *Backward* parte de todas y va sacando la que menos aporta. *Stepwise* hace ambas cosas, puede sumar y también sacar. En el Titanic, forward sumó primero el sexo, luego la clase y luego la edad. Elegir variables no es lo mismo que **regularizar**: lo primero decide cuáles se quedan; lo segundo cambia cómo se calculan los pesos de las que se quedan.`,
      },
      { type: 'miniCheck', questionIds: ['m5-q15'] },
      { type: 'subheading', text: 'Regularización en la regresión logística: L1, L2 y el parámetro C' },
      {
        type: 'paragraph',
        text: t`Sin regularización, los coeficientes se estiman maximizando la log-verosimilitud, es decir, minimizando el **Log Loss**. Regularizar significa **cambiar el criterio de estimación**: se minimiza $\text{Log Loss}(\beta) + \text{penalización}(\beta)$, de modo que el modelo ajuste bien los datos **y** evite coeficientes demasiado grandes.`,
      },
      {
        type: 'list',
        items: [
          t`**L1 (Lasso):** penaliza la suma de valores absolutos, $\lambda\sum_j |\beta_j|$. Puede llevar algunos coeficientes **exactamente a 0**, así que sirve también como selección automática de variables; es útil si se busca parsimonia.`,
          t`**L2 (Ridge):** penaliza la suma de cuadrados, $\lambda\sum_j \beta_j^2$. Tiende a **achicar** todos los coeficientes sin anularlos; es útil si se busca estabilizar los coeficientes.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`En *scikit-learn* se eligen dos cosas: penalty ('l1' o 'l2', el **tipo** de regularización; para L1 se usa el solver 'liblinear') y C, que es el **inverso** de la fuerza de regularización y aplica tanto a L1 como a L2: **C chico = regularización más fuerte; C grande = más débil**. Valores típicos: $0.01$, $0.1$, $1$, $10$, $100$. Primero se elige la penalización y después su intensidad; para elegir C conviene usar entrenamiento con validación cruzada y reservar la prueba para la evaluación final.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo de clase (Titanic, Female, Age y Pclass numérica, L2 con $C=1$):* los coeficientes pasaron de $2.646$, $-0.038$ y $-1.173$ a $2.511$, $-0.037$ y $-1.130$: las mismas variables, pero coeficientes algo más moderados. Aquí la penalización se suma al Log Loss; en una regresión lineal se sumaría a la suma de residuos al cuadrado (RSS).`,
      },
      {
        type: 'intuition',
        title: 'Regularizar es ponerle un freno a los números',
        text: t`**Regularizar es ponerle un freno a los números.** Se agrega un castigo a los pesos demasiado grandes. Hay dos tipos: uno puede llevar algunos pesos exactamente a cero (así elige variables solo), y el otro los achica a todos sin anularlos. El parámetro $C$ dice qué tan fuerte es el freno, pero al revés de lo que parece: **C chico es freno fuerte, C grande es freno suave**.`,
      },
      { type: 'miniCheck', questionIds: ['m5-q16'] },
      { type: 'subheading', text: 'Discriminar bien no es estimar buenas probabilidades: calibración y Hosmer–Lemeshow' },
      {
        type: 'paragraph',
        text: t`**Discriminar** es asignar probabilidades más altas a quienes realmente tienen el evento (se mide con la ROC y el AUC). **Estimar buenas probabilidades** (estar **calibrado**) significa que si el modelo asigna $80\,\%$ a un grupo, aproximadamente el $80\,\%$ de ese grupo debería tener el evento. Un modelo puede ordenar bien a los pasajeros y, aun así, sobreestimar o subestimar las probabilidades: **discriminar bien no implica estar bien calibrado**.`,
      },
      {
        type: 'paragraph',
        text: t`El **test de Hosmer–Lemeshow** evalúa esa calibración (la *bondad de ajuste* de la regresión logística): (1) se ordenan las observaciones según su probabilidad predicha; (2) se dividen en grupos (por ejemplo, 10 deciles); (3) en cada grupo se comparan los casos **observados** con los **esperados**; (4) si las diferencias son pequeñas en la mayoría de los grupos, el ajuste es razonable. Interpretación: $H_0$ = no hay evidencia de falta de ajuste. Un **p-valor grande** (por ejemplo, $>0.05$) indica que no hay evidencia contra el ajuste; un **p-valor chico** indica que las probabilidades predichas no coinciden bien con lo observado. Es una herramienta útil, pero conviene complementarla con otras métricas y con gráficos de calibración. *No mide discriminación (como el AUC): compara probabilidades predichas con frecuencias observadas.*`,
      },
      {
        type: 'intuition',
        title: 'Calibración: ¿las probabilidades son creíbles?',
        text: t`**Calibración: ¿las probabilidades son creíbles?** Es otra pregunta distinta: la **calibración**. Si el modelo dice 80 %, ¿realmente 8 de cada 10 de esas personas lo tienen? Un modelo puede ordenar bien a la gente y aun así dar probabilidades torcidas. El test de Hosmer–Lemeshow lo revisa: un p-valor grande significa que no hay evidencia de mal ajuste.`,
      },
      { type: 'miniCheck', questionIds: ['m5-q17'] },
      { type: 'subheading', text: 'Antes de confiar en el modelo: significancia y multicolinealidad (VIF)' },
      {
        type: 'paragraph',
        text: t`**Significancia de los coeficientes.** Para cada coeficiente se contrasta $H_0:\beta_j = 0$ (la variable no aporta información) contra $H_1:\beta_j \neq 0$ con el estadístico $z = \hat{\beta}_j/\text{ee}(\hat{\beta}_j)$ (coeficiente dividido su error estándar). Si el p-valor es pequeño (por ejemplo, $<0.05$), hay evidencia de que la variable está asociada con la probabilidad del evento, una vez controladas las demás variables. *Ejemplo de clase (Titanic):* Female ($\hat\beta = 2.6100$, ee $= 0.2257$, $z = 11.57$), Age ($-0.0439$, ee $= 0.0093$, $z = -4.72$) y las dos dummies de Pclass ($z = -4.31$ y $-8.22$) tienen p-valor menor que $0.05$.`,
      },
      {
        type: 'paragraph',
        text: t`**Multicolinealidad y VIF.** Ocurre cuando dos o más variables explicativas contienen información muy parecida; los coeficientes se vuelven **inestables**, aumentan sus errores estándar y el modelo es más difícil de interpretar. El **factor de inflación de la varianza** de la variable $X_j$ mide cuánta de su información está explicada por las demás:`,
      },
      { type: 'formula', latex: t`\text{VIF}_j = \frac{1}{1 - R_j^2}` },
      {
        type: 'paragraph',
        text: t`donde $R_j^2$ es el coeficiente de determinación de la regresión de $X_j$ contra las otras variables explicativas. *Ejemplo:* si $R_j^2 = 0.5$, $\text{VIF} = 2$; si $R_j^2 = 0.8$, $\text{VIF} = 5$. **Regla práctica:** un VIF mayor que $5$ suele considerarse una señal de alerta (y valores mucho más altos, un problema serio). En el Titanic de la clase todos los VIF estuvieron entre $1.06$ y $1.85$: sin indicios de multicolinealidad importante.`,
      },
      {
        type: 'intuition',
        title: 'Antes de confiar en el modelo, dos chequeos',
        text: t`**Antes de confiar en el modelo, dos chequeos.** Primero, si cada variable realmente aporta algo (se mira su p-valor). Segundo, que dos variables no cuenten casi lo mismo. Si lo hacen, los pesos se vuelven inestables, como pedirle a alguien que reparta una cuenta entre dos personas que siempre aparecen juntas. Eso se detecta con el VIF, y una regla práctica es desconfiar cuando pasa de $5$. En el Titanic todos quedaron entre $1.06$ y $1.85$: sin problemas.`,
      },
      { type: 'miniCheck', questionIds: ['m5-q18'] },
      { type: 'subheading', text: 'Comparar modelos: ¿qué pasó al agregar variables?' },
      {
        type: 'paragraph',
        text: t`*Ejemplo de clase (Titanic, evaluación en prueba, 268 pasajeros).* Modelos: **Original** (Female, Age, Pclass), **Seleccionado** (agrega FamilySize), **Seleccionado + L2** (el mismo con $C=10$) y **Completo** (agrega también Fare).`,
      },
      {
        type: 'table',
        headers: ['Modelo', 'AUC CV (train)', 'AUC test', 'Log Loss test', 'Accuracy test', 'Hosmer–Lemeshow (p)'],
        rows: [
          ['Original', '$0.8464$', '$0.8361$', '$0.4685$', '$0.7761$', '$0.1363$'],
          ['Seleccionado', '$0.8500$', '$0.8485$', '$0.4534$', '$0.7985$', '$0.6582$'],
          ['Seleccionado + L2', '$0.8502$', '$0.8485$', '$0.4534$', '$0.7985$', '$0.6613$'],
          ['Completo', '$0.8481$', '$0.8503$', '$0.4523$', '$0.7910$', '$0.6419$'],
        ],
      },
      {
        type: 'paragraph',
        text: t`Lectura: el modelo seleccionado mejora al original; la regularización L2 aporta una mejora muy leve en el AUC por validación cruzada; el completo logra el mejor AUC en prueba y el menor Log Loss; y todos los p-valores de Hosmer–Lemeshow son mayores que $0.05$. Más variables no son automáticamente mejores: las diferencias entre los tres últimos son pequeñas.`,
      },
      {
        type: 'intuition',
        title: 'Lo que mostró el Titanic de la clase',
        text: t`**Lo que mostró el Titanic de la clase.** El modelo aprendió que ser mujer, ser más joven y viajar en una clase más alta aumentan los odds de sobrevivir. Y al comparar versiones del modelo, las diferencias entre las más completas fueron pequeñas: más variables no son automáticamente mejores.`,
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
        type: 'intuition',
        title: 'Detrás de cada sí o no hay una sensación que no vemos',
        text: t`**La idea de la variable escondida.** Imaginá las "ganas de salir a correr". No se pueden medir, solo se ve el resultado: salís (1) o no salís (0). Si tus ganas pasan un umbral (el cero), salís. Eso es una **variable latente**: algo que no observamos pero que decide lo que sí vemos.`,
      },
      {
        type: 'list',
        items: [
          t`**Logit:** $e$ sigue una distribución **logística** estándar $\Rightarrow$ $p = 1/(1+e^{-z})$.`,
          t`**Probit:** $e$ sigue una **Normal estándar** $N(0,1)$ $\Rightarrow$ $p = \Phi(z)$, donde $\Phi(z)$ es la **función de distribución acumulada Normal**: la probabilidad de que una Normal estándar sea menor o igual a $z$ (por ejemplo, $\Phi(0) = 0.5$ y $\Phi(1.96) \approx 0.975$).`,
        ],
      },
      {
        type: 'intuition',
        title: 'Logit y probit son dos formas de decir lo mismo',
        text: t`**Logit y probit son dos formas de decir lo mismo.** La diferencia está en cómo suponemos que se reparte lo que no conocemos de esas ganas, el "ruido". El **logit** supone una forma (la logística) y el **probit** supone la campana Normal que ya conocés del módulo 2. Las dos curvas en S resultan casi idénticas y suelen dar las mismas conclusiones.`,
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
        type: 'intuition',
        title: 'Por qué los números parecen distintos, y cuál se usa más',
        text: t`**Por qué los números parecen distintos.** Como si midieras la temperatura en Celsius o en Fahrenheit: los coeficientes del logit son aproximadamente 1.6 a 1.8 veces más grandes que los del probit. Si el logit da $0.8$, el probit andará por $0.5$. No son comparables directamente, pero cuentan la misma historia.

**Cuál se usa más.** El logit, porque permite hablar de odds ratios ("los odds se duplican"). El probit solo permite interpretar el signo, si es significativo y los efectos sobre la probabilidad. Los dos se estiman por máxima verosimilitud.`,
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
        type: 'intuition',
        title: 'Dos maneras de aprender a distinguir',
        text: t`**Dos maneras de aprender a distinguir.** Imaginá que querés distinguir manzanas de peras. La regresión logística mira directamente la frontera entre ambas ("¿de qué lado cae?"). Los modelos **generativos** hacen otra cosa: aprenden cómo es una manzana típica y cómo es una pera típica. Después, ante una fruta nueva, se preguntan cuál de las dos descripciones encaja mejor.`,
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
      {
        type: 'intuition',
        title: 'Bayes decide al final',
        text: t`**Bayes es el que decide al final.** Se combinan dos cosas: qué tan frecuente es cada clase de antemano (a priori) y qué tan típico es lo que vimos dentro de cada una (verosimilitud). El resultado es la probabilidad de cada clase dado lo que viste (a posteriori), y se elige la mayor. Es el mismo razonamiento del test médico del módulo 0.`,
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
        type: 'intuition',
        title: 'LDA: dos montañas con la misma forma',
        text: t`**LDA: dos montañas con la misma forma.** Supone que cada clase es una campana con su propio centro, pero con la misma forma y dispersión para todas. Con eso, la frontera es una línea recta. Si las dos clases son igual de frecuentes, la frontera cae justo en el punto medio, como en el ejemplo de $x = 4$. Y si una clase es más rara, la frontera se corre hacia ella: hay que estar más seguro para decir que es de la rara ($x = 5.39$).`,
      },
      {
        type: 'extra',
        text: t`Para decidir si una fruta es manzana o pera solo por su peso: las manzanas pesan en promedio 150 g, las peras 200 g, y ambas varían con desviación típica de 25 g. Con a priori iguales, la frontera está en el punto medio, 175 g. Una fruta de 190 g: las verosimilitudes relativas son $e^{-(190-150)^2/1250} \approx 0.278$ (manzana) y $e^{-(190-200)^2/1250} \approx 0.923$ (pera), así que la probabilidad de que sea pera es $0.923/(0.278+0.923) \approx 0.77$.`,
      },
      { type: 'subheading', text: 'QDA: Análisis Discriminante Cuadrático' },
      {
        type: 'paragraph',
        text: t`Igual que LDA, pero **cada clase tiene su propia matriz de covarianza** $\Sigma_k$. Las fronteras resultan **cuadráticas** (curvas). Es más flexible, pero **estima muchos más parámetros**. *Ejemplo:* con $p=50$ variables, la matriz de covarianza tiene $50\cdot51/2 = 1275$ parámetros; LDA estima una, y QDA con 3 clases estima $3\times1275 = 3825$. Es un compromiso entre rigidez y flexibilidad (sesgo frente a varianza): **LDA** tiene más sesgo y menos varianza (mejor con pocos datos); **QDA**, menos sesgo y más varianza (mejor con muchos datos y covarianzas realmente distintas).`,
      },
      {
        type: 'intuition',
        title: 'QDA: cada clase con su propia forma',
        text: t`**QDA: cada clase con su propia forma.** Es más flexible y las fronteras son curvas, pero necesita estimar muchísimos más números. Con 50 variables y 3 clases, son 3825 parámetros contra 1275 de LDA. LDA es más rígido y rinde mejor con pocos datos; QDA es más flexible y rinde mejor con muchos datos y clases realmente distintas.`,
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
        type: 'intuition',
        title: 'Naive Bayes: ingenuo pero útil',
        text: t`**Naive Bayes: ingenuo pero útil.** "Ingenuo" porque supone que, dentro de cada clase, las variables no se influyen entre sí (por ejemplo, que las palabras de un correo aparecen independientes unas de otras). Eso no es cierto, pero permite multiplicar las probabilidades de cada una por separado, que es rapidísimo. Con "oferta" y "reunión" en un correo, la cuenta de la guía da una probabilidad de spam de $0.625$. Y funciona bien porque para clasificar alcanza con que el **orden** de las probabilidades sea correcto, no que sean exactas. Un cuidado: si una palabra nunca apareció en una clase, su probabilidad es cero y anula todo el producto. Se arregla sumando una pequeña cantidad a todos los conteos (suavizado de Laplace).`,
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
      {
        type: 'intuition',
        title: '¿Cuál elijo?',
        text: t`**¿Cuál elijo?** Si querés odds ratios y poco supuesto, la logística. Con pocos datos y clases bien separadas, LDA. Con muchos datos y formas distintas, QDA. Con muchísimas variables, como texto, Naive Bayes.`,
      },
    ],
  },
]
