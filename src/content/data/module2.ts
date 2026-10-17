import type { Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 2. Los strings llevan LaTeX
// (barras invertidas), por eso se escriben con String.raw. Un `$` literal va como `\$`.
const t = String.raw

export const module2Sections: Section[] = [
  {
    id: '2.1',
    moduleId: 2,
    title: 'Vocabulario base: población, muestra, parámetro, estadístico',
    blocks: [
      {
        type: 'list',
        items: [
          t`**Población**: el conjunto completo que nos interesa (todos los clientes de un banco, todos los votantes del país).`,
          t`**Muestra**: un subconjunto de la población que sí podemos observar.`,
          t`**Variable**: una característica que se mide en cada individuo (edad, ingreso, si compró o no).`,
          t`**Parámetro**: un número que describe a la **población** y casi siempre es **desconocido** (la media poblacional $\mu$, la desviación típica poblacional $\sigma$).`,
          t`**Estadístico (o estimador)**: un número calculado a partir de la **muestra** (la media muestral $\bar{x}$, la desviación típica muestral $s$). Se usa para **estimar** el parámetro.`,
        ],
      },
      {
        type: 'table',
        headers: ['', 'Población', 'Muestra'],
        rows: [
          ['Media', t`$\mu$ (desconocida)`, t`$\bar{x}$ (calculable)`],
          ['Desviación típica', t`$\sigma$`, t`$s$`],
          ['Tamaño', t`$N$`, t`$n$`],
        ],
      },
      { type: 'paragraph', text: 'Con esto se definen las dos grandes ramas:' },
      {
        type: 'list',
        items: [
          t`**Estadística descriptiva**: resume los datos que **tienes** (tablas, promedios, gráficos). Es sacar una fotografía del grupo y medir su estatura promedio.`,
          t`**Estadística inferencial**: usa la muestra para sacar conclusiones sobre una **población que no puedes medir entera**. Es probar una cucharada de sopa para decidir si a toda la olla le falta sal. La condición es que la cucharada esté bien revuelta, es decir, que la muestra sea **representativa** (idealmente elegida al azar).`,
        ],
      },
    ],
  },
  {
    id: '2.2',
    moduleId: 2,
    title: 'Medidas de tendencia central y de dispersión',
    blocks: [
      {
        type: 'paragraph',
        text: t`Para resumir una lista de datos se usan números de **posición** (dónde está el centro) y de **dispersión** (cuánto se esparcen).`,
      },
      { type: 'paragraph', text: '**Tendencia central**' },
      {
        type: 'list',
        items: [
          t`**Media** ($\bar{x}$): suma de los valores dividida por $n$. Es el "punto de equilibrio".`,
          t`**Mediana**: el valor central cuando los datos están ordenados (con cantidad par, el promedio de los dos centrales). La mitad de los datos queda por debajo y la mitad por encima.`,
          t`**Moda**: el valor que **más se repite**.`,
        ],
      },
      { type: 'paragraph', text: '**Dispersión**' },
      {
        type: 'list',
        items: [
          t`**Varianza muestral** ($s^2$): promedio de las desviaciones al cuadrado respecto a la media. Se divide por $n-1$ y no por $n$:`,
        ],
      },
      { type: 'formula', latex: t`s^2 = \frac{\sum_{i=1}^{n}(x_i - \bar{x})^2}{n-1}` },
      {
        type: 'paragraph',
        text: t`*Por qué $n-1$:* la media $\bar{x}$ se calculó con los mismos datos, así que los datos están, en promedio, más cerca de $\bar{x}$ que de la verdadera $\mu$. Dividir por $n$ subestimaría la varianza; $n-1$ lo corrige.`,
      },
      {
        type: 'list',
        items: [t`**Desviación típica** ($s$): $\sqrt{s^2}$. Está en las mismas unidades que los datos.`],
      },
      {
        type: 'workedExample',
        title: t`**Ejemplo con números.** Datos: $2, 4, 4, 6, 9$ ($n=5$).`,
        steps: [
          t`Media: $25/5 = 5$. Mediana: $4$. Moda: $4$.`,
          t`Desviaciones respecto a la media: $-3, -1, -1, 1, 4$. Al cuadrado: $9, 1, 1, 1, 16$; suma $= 28$.`,
        ],
        result: t`$s^2 = 28/4 = 7$; $s = \sqrt{7} \approx 2.65$.`,
      },
      { type: 'miniCheck', questionIds: ['m2-q12'] },
      {
        type: 'paragraph',
        text: t`**Valores atípicos (*outliers*).** Cambia el $9$ por un $90$: los datos son $2, 4, 4, 6, 90$. La media salta a $21.2$, pero la mediana sigue siendo $4$. **La mediana es robusta a valores extremos; la media no.** Por eso, con ingresos o precios de viviendas (muy sesgados), se suele reportar la mediana.`,
      },
      {
        type: 'paragraph',
        text: t`**Metáfora del abanico.** La media indica hacia dónde apunta el mango del abanico; la desviación típica indica cuánto se abre la tela. Desviación pequeña: datos agrupados. Desviación grande: datos dispersos.`,
      },
    ],
  },
  {
    id: '2.3',
    moduleId: 2,
    title: 'Escalas de medición (Stevens) y calidad de datos',
    blocks: [
      {
        type: 'paragraph',
        text: t`No todos los datos se miden igual, y el tipo de escala determina **qué cálculos tienen sentido**:`,
      },
      {
        type: 'table',
        headers: ['Escala', 'Qué permite', 'Ejemplo', 'Resumen válido'],
        rows: [
          ['**Nominal**', 'Solo clasificar, sin orden', 'Estado civil, marca de auto', 'Moda, frecuencias'],
          [
            '**Ordinal**',
            'Ordenar, pero la distancia entre valores no es uniforme',
            'Satisfacción: bajo / medio / alto',
            'Mediana, percentiles',
          ],
          [
            '**Intervalo**',
            'Ordenar y las diferencias son constantes, pero el **cero es arbitrario**',
            'Temperatura en °C, año calendario',
            'Media, desviación típica',
          ],
          [
            '**Razón**',
            'Todo lo anterior y **tiene un cero absoluto** (ausencia total)',
            'Salario, peso, edad',
            'Todo, incluyendo cocientes',
          ],
        ],
      },
      { type: 'paragraph', text: '*Claves para recordar:*' },
      {
        type: 'list',
        items: [
          t`20 °C **no** es "el doble de caliente" que 10 °C (el cero de Celsius es arbitrario), pero un salario de \$2000 sí es el doble que uno de \$1000.`,
          t`Promediar una escala ordinal ("bajo=1, medio=2, alto=3") es discutible, porque nada garantiza que el salto de 1 a 2 valga lo mismo que de 2 a 3.`,
        ],
      },
      { type: 'paragraph', text: '**Calidad de datos.** Antes de analizar, conviene revisar:' },
      {
        type: 'list',
        items: [
          t`**Ruido**: variación aleatoria que distorsiona la señal (un sensor impreciso).`,
          t`**Valores atípicos**: ¿son errores de carga o casos reales?`,
          t`**Datos faltantes (*missing values*)**: se pueden eliminar, imputar (rellenar con la media, la mediana o con un modelo) o marcar. La decisión depende de *por qué* faltan.`,
          t`**Redondeo y cifras significativas**: no reportes resultados con más precisión que la de tu instrumento de medición (si mides con regla en milímetros, no informes 12.34567 mm).`,
        ],
      },
    ],
  },
  {
    id: '2.4',
    moduleId: 2,
    title: 'Distribuciones de probabilidad',
    blocks: [
      {
        type: 'paragraph',
        text: t`Una **distribución** describe **qué valores puede tomar una variable aleatoria y con qué probabilidad**.`,
      },
      {
        type: 'list',
        items: [
          t`Si la variable es **discreta** (valores contables: 0, 1, 2…), se da la probabilidad de cada valor.`,
          t`Si es **continua** (cualquier valor en un intervalo: estatura, tiempo), se usa una **curva de densidad**, y la **probabilidad de un rango es el área bajo la curva** en ese rango. (La probabilidad de un valor exacto es 0.)`,
          t`Las **colas** son los extremos de la distribución. Una distribución de "colas pesadas" da más probabilidad a valores extremos.`,
        ],
      },
      { type: 'subheading', text: 'Binomial' },
      {
        type: 'paragraph',
        text: t`Cuenta el número de **éxitos** en $n$ ensayos independientes, cada uno con probabilidad de éxito $p$ (cara/cruz, compra/no compra).`,
      },
      {
        type: 'formula',
        latex: t`P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}, \qquad \binom{n}{k} = \frac{n!}{k!\,(n-k)!}`,
      },
      { type: 'paragraph', text: t`Media $= np$; varianza $= np(1-p)$.` },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* 10 tiradas de moneda, ¿probabilidad de exactamente 3 caras? $\binom{10}{3}(0.5)^{10} = 120/1024 \approx 0.117$.`,
      },
      { type: 'subheading', text: 'Poisson' },
      {
        type: 'paragraph',
        text: t`Cuenta cuántas veces ocurre un **evento raro** en un intervalo de tiempo o espacio, si ocurre a una tasa media $\lambda$ y de forma independiente.`,
      },
      { type: 'formula', latex: t`P(X=k) = \frac{e^{-\lambda}\lambda^k}{k!}` },
      { type: 'paragraph', text: t`Media $= \lambda$ y varianza $= \lambda$.` },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* una central recibe en promedio $\lambda = 3$ llamadas por minuto. Probabilidad de **ninguna** llamada: $e^{-3} \approx 0.050$. De **exactamente 2**: $e^{-3}\cdot 9/2 \approx 0.224$.`,
      },
      { type: 'subheading', text: 'Normal (la campana de Gauss)' },
      {
        type: 'paragraph',
        text: t`Se escribe $N(\mu, \sigma)$. Es simétrica y queda definida por su media y su desviación típica. Aparece de forma natural cuando una variable es **la suma de muchos pequeños factores independientes** (estatura, errores de medición). Regla práctica:`,
      },
      {
        type: 'list',
        items: [
          '~68 % de los datos está a menos de **1** desviación típica de la media,',
          '~95 % a menos de **2**,',
          '~99.7 % a menos de **3**.',
        ],
      },
      {
        type: 'paragraph',
        text: t`**Estandarización (puntaje $z$):** $z = (x-\mu)/\sigma$ dice a cuántas desviaciones típicas de la media está un valor. *Ejemplo:* si el coeficiente intelectual tiene $\mu=100$ y $\sigma=15$, un valor de 130 tiene $z=2$, y solo ~2.3 % de la gente lo supera.`,
      },
      { type: 'subheading', text: t`$t$ de Student` },
      {
        type: 'paragraph',
        text: t`Parece una Normal, pero con **colas más pesadas**. Aparece cuando hay que **estimar la desviación típica con la propia muestra** ($s$ en vez de $\sigma$), lo que agrega incertidumbre extra, sobre todo con muestras pequeñas. Depende de los **grados de libertad** ($gl = n-1$ en el caso de la media); cuando $n$ crece, se parece cada vez más a la Normal.`,
      },
      { type: 'subheading', text: t`Chi-cuadrado ($\chi^2$)` },
      {
        type: 'paragraph',
        text: t`Es la distribución de la **suma de $k$ variables Normales estándar elevadas al cuadrado** ($k$ = grados de libertad). Solo toma valores positivos. Se usa para inferir sobre **varianzas** y en pruebas sobre **tablas de contingencia** (tablas que cruzan los conteos de dos variables categóricas, por ejemplo género × marca preferida).`,
      },
      { type: 'subheading', text: t`$F$ de Fisher-Snedecor` },
      {
        type: 'paragraph',
        text: t`Es el **cociente entre dos $\chi^2$**, cada una dividida por sus grados de libertad. Sirve para **comparar variabilidades**: por ejemplo, en el análisis de varianza (**ANOVA**, que compara las medias de varios grupos mediante la relación entre la variabilidad *entre* grupos y *dentro* de los grupos) y en la regresión, para decidir si un modelo explica algo en conjunto.`,
      },
      { type: 'paragraph', text: '**Resumen:**' },
      {
        type: 'table',
        headers: ['Distribución', '¿Cuándo aparece?'],
        rows: [
          ['Binomial', t`Contar éxitos en $n$ ensayos`],
          ['Poisson', 'Contar eventos raros en un intervalo'],
          ['Normal', 'Sumas/promedios de muchos factores; errores'],
          [t`$t$`, t`Inferir la media con $\sigma$ desconocida (muestras chicas)`],
          [t`$\chi^2$`, 'Varianzas; tablas de contingencia'],
          [t`$F$`, 'ANOVA; comparar modelos o varianzas'],
        ],
      },
    ],
  },
  {
    id: '2.5',
    moduleId: 2,
    title: 'Distribución muestral y Teorema del Límite Central (TLC)',
    blocks: [
      {
        type: 'paragraph',
        text: t`Si tomas una muestra y calculas $\bar{x}$, y luego tomas **otra** muestra, obtienes otra $\bar{x}$ distinta. La $\bar{x}$ **varía de muestra en muestra**. Su distribución se llama **distribución muestral de la media**.`,
      },
      {
        type: 'paragraph',
        text: t`**Teorema del Límite Central.** Si la población tiene media $\mu$ y varianza finita $\sigma^2$, entonces para $n$ suficientemente grande la distribución de $\bar{x}$ es **aproximadamente Normal**, **sin importar la forma de la población original**:`,
      },
      { type: 'formula', latex: t`\bar{x} \;\approx\; N\!\left(\mu,\; \frac{\sigma}{\sqrt{n}}\right)` },
      {
        type: 'list',
        items: [
          t`La desviación típica de $\bar{x}$, $\sigma/\sqrt{n}$, se llama **error estándar**. En la práctica se estima con $s/\sqrt{n}$.`,
          t`"Suficientemente grande" suele indicarse como $n \ge 30$, pero es una **regla práctica**: si la población es muy asimétrica puede hacer falta más.`,
          t`El teorema habla de **promedios (y sumas)**, no de los datos individuales.`,
        ],
      },
      { type: 'simulation', simulationId: 'IN-21' },
      {
        type: 'workedExample',
        title: t`*Ejemplo:* ingresos de una población muy sesgada con $\mu = 1000$ y $\sigma = 600$. Se toman muestras de $n=100$.`,
        steps: [t`El error estándar es $600/10 = 60$.`],
        result: t`Aproximadamente el 95 % de las medias muestrales cae en $1000 \pm 2\times60$, es decir, entre 880 y 1120, aunque los ingresos individuales estén muy dispersos.`,
      },
      { type: 'miniCheck', questionIds: ['m2-q05'] },
      { type: 'paragraph', text: '**Dos consecuencias clave:**' },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Más datos $\Rightarrow$ menos error: para **reducir el error estándar a la mitad** hay que **cuadruplicar** $n$.`,
          t`Gracias al TLC se pueden construir intervalos de confianza y contrastes de hipótesis sobre medias sin saber cómo se distribuye la población.`,
        ],
      },
    ],
  },
  {
    id: '2.6',
    moduleId: 2,
    title: 'Estimación: intervalos de confianza y máxima verosimilitud',
    blocks: [
      {
        type: 'paragraph',
        text: t`Un **estimador** es una regla para calcular, desde la muestra, un valor que aproxime un parámetro. Un estimador es **insesgado** si, en promedio sobre muchas muestras, acierta al parámetro (por ejemplo, $\bar{x}$ es insesgado para $\mu$).`,
      },
      { type: 'subheading', text: 'Intervalo de confianza' },
      {
        type: 'paragraph',
        text: t`Una estimación puntual (un solo número) casi nunca da en el blanco. Un **intervalo de confianza** da un rango. Para la media, con muestra grande:`,
      },
      { type: 'formula', latex: t`\bar{x} \;\pm\; z^{*}\cdot\frac{s}{\sqrt{n}}` },
      {
        type: 'paragraph',
        text: t`donde $z^{*} = 1.96$ para un 95 % de confianza (con muestras pequeñas se usa el valor de la $t$ en lugar de $z^*$).`,
      },
      {
        type: 'workedExample',
        title: t`*Ejemplo:* $n=100$, $\bar{x} = 1050$, $s = 600$.`,
        steps: [t`Error estándar $= 60$.`, t`Intervalo al 95 %: $1050 \pm 1.96\times60 = 1050 \pm 117.6$.`],
        result: t`**[932.4 ; 1167.6]**`,
      },
      { type: 'miniCheck', questionIds: ['m2-q06'] },
      {
        type: 'paragraph',
        text: t`**Interpretación correcta (la que más se confunde).** El parámetro $\mu$ es un valor **fijo** (desconocido); lo que **varía** es el intervalo, porque depende de la muestra. "95 % de confianza" significa que **si repitieras el procedimiento muchas veces, el 95 % de los intervalos construidos así contendría el verdadero $\mu$**.`,
      },
      {
        type: 'analogy',
        text: t`**Analogía del aro y la estaca.** La estaca (el parámetro) está clavada en el suelo y no se mueve. Tú lanzas un aro (el intervalo) una y otra vez con una técnica que atrapa la estaca el 95 % de las veces. Cada lanzamiento concreto la atrapa o no; no sabes cuál ocurrió. Por eso **no es correcto** decir "hay un 95 % de probabilidad de que $\mu$ esté en [932.4 ; 1167.6]": en ese intervalo ya calculado, $\mu$ está o no está. El 95 % describe la **fiabilidad del método**.`,
      },
      {
        type: 'paragraph',
        text: t`**Qué hace al intervalo más ancho:** mayor confianza (99 % > 95 %), mayor variabilidad ($s$) y menos datos ($n$).`,
      },
      { type: 'subheading', text: 'Función de verosimilitud y máxima verosimilitud (MLE)' },
      {
        type: 'paragraph',
        text: t`Supón que tiras una moneda 10 veces y obtienes **7 caras**. ¿Qué valor de $p$ (probabilidad de cara) hace **más plausibles** estos datos?`,
      },
      {
        type: 'paragraph',
        text: t`La **verosimilitud** es la probabilidad de los datos observados, vista **como función del parámetro**:`,
      },
      { type: 'formula', latex: t`L(p) = p^{7}(1-p)^{3}` },
      {
        type: 'list',
        items: [
          t`$L(0.5) = 0.5^{10} \approx 0.00098$`,
          t`$L(0.7) = 0.7^{7}\cdot0.3^{3} \approx 0.00222$ (más del doble)`,
        ],
      },
      {
        type: 'paragraph',
        text: t`El **estimador de máxima verosimilitud (MLE)** es el valor del parámetro que **maximiza** $L$. Es más cómodo maximizar el **logaritmo** ($\ln L = 7\ln p + 3\ln(1-p)$, ver Módulo 0.5): al derivar e igualar a cero se obtiene $\hat{p} = 7/10 = 0.7$.`,
      },
      {
        type: 'callout',
        kind: 'ojo',
        text: t`la verosimilitud **no** es la probabilidad de que el parámetro valga tal cosa; es la probabilidad de los **datos** dado el parámetro.`,
      },
      {
        type: 'paragraph',
        text: t`La máxima verosimilitud es un método general de estimación: sirve siempre que se pueda escribir la probabilidad de los datos en función de un parámetro, no solo para una moneda.`,
      },
    ],
  },
  {
    id: '2.7',
    moduleId: 2,
    title: 'Contraste de hipótesis y tamaño del efecto',
    blocks: [
      { type: 'paragraph', text: t`El contraste de hipótesis se parece a un **juicio**:` },
      {
        type: 'table',
        headers: ['En el juicio', 'En estadística'],
        rows: [
          ['Presunción de inocencia', t`**Hipótesis nula $H_0$**: la postura por defecto ("no hay efecto", "$\mu = 100$")`],
          ['La acusación', t`**Hipótesis alternativa $H_a$**: "sí hay efecto"`],
          ['Las pruebas', 'Los datos de la muestra'],
          ['El veredicto', t`Rechazar o **no** rechazar $H_0$`],
        ],
      },
      { type: 'paragraph', text: '**Pasos:**' },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Plantear $H_0$ y $H_a$.`,
          t`Fijar el **nivel de significación $\alpha$** (casi siempre $0.05$): la probabilidad de equivocarse al rechazar una $H_0$ verdadera que estamos dispuestos a tolerar.`,
          t`Calcular un **estadístico de contraste**: un número que mide cuán lejos están los datos de lo que predice $H_0$, en unidades de error estándar. Para una media: $t = \dfrac{\bar{x} - \mu_0}{s/\sqrt{n}}$.`,
          t`Calcular el **p-valor** y decidir.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`**P-valor (definición correcta):** es la probabilidad, **suponiendo que $H_0$ es cierta**, de obtener un resultado **tan extremo o más** que el observado. Si $p < \alpha$, se rechaza $H_0$.`,
      },
      {
        type: 'paragraph',
        text: t`Lo que el p-valor **no** es: no es la probabilidad de que $H_0$ sea cierta, ni la probabilidad de que el resultado sea fruto del azar.`,
      },
      {
        type: 'workedExample',
        title: t`**Ejemplo completo.** Un fabricante dice que sus baterías duran 100 horas. Pruebas $n=36$ y obtienes $\bar{x} = 96$, $s=12$.`,
        steps: [
          t`$H_0: \mu = 100$; $H_a: \mu \neq 100$.`,
          t`Error estándar $= 12/\sqrt{36} = 2$.`,
          t`$t = (96-100)/2 = -2$, con $gl = 35$.`,
          t`El valor crítico de la $t$ para $\alpha = 0.05$ (dos colas) es aprox. $2.03$, y $|-2| < 2.03$. El p-valor es aproximadamente $0.053$.`,
        ],
        result: t`**Decisión:** como $p > 0.05$, **no se rechaza $H_0$**. (Si hubieras obtenido $\bar{x}=95$, $t=-2.5$ y $p \approx 0.017$, y sí se rechazaría.)`,
      },
      {
        type: 'paragraph',
        text: t`**Importante:** "no rechazar $H_0$" **no** significa "demostrar que $H_0$ es cierta"; significa que **no hay evidencia suficiente** en su contra, igual que "no culpable" no es "inocente probado". Por eso se evita decir "aceptar $H_0$". Además, $0.05$ es una convención, y $p=0.053$ y $p=0.049$ son evidencias casi idénticas.`,
      },
      { type: 'miniCheck', questionIds: ['m2-q09'] },
      { type: 'subheading', text: 'Errores posibles' },
      {
        type: 'table',
        headers: ['Realidad', t`No rechazar $H_0$`, t`Rechazar $H_0$`],
        rows: [
          [
            t`**$H_0$ verdadera** (inocente)`,
            'Decisión correcta',
            t`**Error Tipo I** ($\alpha$): condenar a un inocente (falso positivo)`,
          ],
          [
            t`**$H_0$ falsa** (culpable)`,
            t`**Error Tipo II** ($\beta$): liberar a un culpable (falso negativo)`,
            t`**Potencia** ($1-\beta$): decisión correcta`,
          ],
        ],
      },
      {
        type: 'list',
        items: [
          t`La **potencia** es la probabilidad de detectar un efecto real cuando existe. Aumenta con más datos, con efectos más grandes y con menor variabilidad.`,
          t`Reducir $\alpha$ (ser más exigente para condenar) **aumenta $\beta$** si no cambias $n$: hay un equilibrio entre ambos errores.`,
        ],
      },
      { type: 'subheading', text: 'Tamaño del efecto' },
      {
        type: 'paragraph',
        text: t`El p-valor dice si hay evidencia de un efecto, **no si ese efecto importa**. Con una muestra enorme, hasta una diferencia ínfima resulta "significativa". Para medir la **magnitud práctica** se usa, por ejemplo, la **$d$ de Cohen**:`,
      },
      { type: 'formula', latex: t`d = \frac{\text{diferencia entre medias}}{\text{desviación típica}}` },
      {
        type: 'paragraph',
        text: t`Es una diferencia expresada en "desviaciones típicas". Guía orientativa de Cohen: $0.2$ pequeño, $0.5$ mediano, $0.8$ grande. En el ejemplo de las baterías: $d = (96-100)/12 \approx -0.33$ (efecto entre pequeño y mediano).`,
      },
      {
        type: 'paragraph',
        text: t`*Contraste:* con $n = 100\,000$, una diferencia de solo $0.5$ horas ($s=12$) daría $t \approx 13$ (muy significativa), pero $d \approx 0.04$ (irrelevante en la práctica). **Siempre hay que mirar el p-valor y el tamaño del efecto.**`,
      },
    ],
  },
]
