import type { Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 2. Los strings llevan LaTeX
// (barras invertidas), por eso se escriben con String.raw. Un `$` literal va como `\$`.
// Los bloques `deepDive` (ampliaciones) y `recall` (repasos de lo previo) no son de la guía y se
// muestran rotulados; las cifras de las ampliaciones se verifican en tools/expansion-numbers.ts.
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
        type: 'intuition',
        title: 'La olla y la cucharada de sopa',
        text: t`**La olla y la cucharada.** La **población** es la olla entera: todo lo que nos interesa. La **muestra** es la cucharada que probás. Casi nunca podés tomarte la olla completa, así que probás una cucharada y, a partir de ella, opinás sobre el total. Eso es la estadística inferencial.`,
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
      {
        type: 'intuition',
        title: 'Parámetro y estadístico: lo que no vemos y lo que medimos',
        text: t`**Dos tipos de números.** Un **parámetro** es una característica verdadera de la olla (por ejemplo, su verdadero nivel de sal), que casi nunca conocés. Un **estadístico** es lo que medís en tu cucharada. Se usa para adivinar el parámetro. Para no confundirlos: letras griegas ($\mu$, $\sigma$) para la olla, letras comunes ($\bar{x}$, $s$) para la cucharada.`,
      },
      { type: 'paragraph', text: 'Con esto se definen las dos grandes ramas:' },
      {
        type: 'list',
        items: [
          t`**Estadística descriptiva**: resume los datos que **tienes** (tablas, promedios, gráficos). Es sacar una fotografía del grupo y medir su estatura promedio.`,
          t`**Estadística inferencial**: usa la muestra para sacar conclusiones sobre una **población que no puedes medir entera**. Es probar una cucharada de sopa para decidir si a toda la olla le falta sal. La condición es que la cucharada esté bien revuelta, es decir, que la muestra sea **representativa** (idealmente elegida al azar).`,
        ],
      },
      {
        type: 'deepDive',
        title: 'Por qué una muestra chica bien elegida le gana a una gigante mal elegida',
        text: t`Es tentador pensar que con más datos siempre se acierta más. No es así: **el tamaño reduce el error por azar, pero no corrige una muestra torcida**.

El caso clásico es el de la revista *Literary Digest* en la elección presidencial de Estados Unidos de 1936. Mandó millones de encuestas a personas que sacó de guías telefónicas y de registros de autos, y pronosticó una derrota clara de Roosevelt. Roosevelt ganó por amplio margen. En plena crisis, tener teléfono o auto era cosa de gente con más dinero, que votaba distinto del resto: la cucharada se había sacado solo de la superficie de la olla. Al mismo tiempo, George Gallup acertó con una muestra muchísimo más chica, pero elegida para parecerse a la población.

Este error se llama **sesgo de selección**, y tiene una propiedad incómoda: **no se ve en los datos**. Una muestra torcida de un millón de personas da resultados muy precisos... alrededor del número equivocado. Por eso, antes de mirar cuántos datos hay, conviene preguntarse **cómo se eligieron**.`,
        sources: ['Freedman, Pisani y Purves, *Statistics*, cap. 19 (el caso *Literary Digest*)'],
      },
    ],
  },
  {
    id: '2.2',
    moduleId: 2,
    title: 'Medidas de tendencia central y de dispersión',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué significaban $\sum$ y $\bar{x}$?`,
            answer: t`$\sum$ (sumatoria) es la instrucción "sumá todos los términos": $\sum_{i=1}^{3} x_i = 4 + 7 + 9 = 20$. $\bar{x}$ es el promedio: esa suma dividida por la cantidad de datos $n$. Lo viste en Módulo 0.1.`,
          },
          {
            question: '¿Qué significaba que el promedio "minimiza los cuadrados"?',
            answer: t`Entre todos los números posibles, el promedio es el que hace más chica la suma de las distancias al cuadrado a los datos. Lo viste en Módulo 0.4, y acá va a explicar por qué la varianza se divide por $n-1$.`,
          },
        ],
      },
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
      {
        type: 'intuition',
        title: 'Tres formas de elegir "el centro"',
        text: t`**Tres formas de elegir "el centro".** Imaginá las edades de un grupo de personas en una sala.

La **media** es el punto de equilibrio: si la lista fuera una balanza, es donde se apoyaría sin caerse. La **mediana** es la persona del medio cuando se ponen todos en fila por edad: la mitad queda de un lado y la mitad del otro. La **moda** es la edad que más se repite.`,
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
      {
        type: 'deepDive',
        title: t`Por qué se eleva al cuadrado y por qué se divide por $n-1$`,
        text: t`**Los desvíos siempre suman cero.** En el ejemplo, $-3 - 1 - 1 + 1 + 4 = 0$. No es casualidad: la media es el punto de equilibrio, así que lo que sobra de un lado compensa exactamente lo que falta del otro. Si promediaras los desvíos tal cual, la dispersión de **cualquier** lista daría $0$. Elevarlos al cuadrado los vuelve todos positivos. (Se podría usar el valor absoluto, pero los cuadrados tienen propiedades matemáticas mucho más cómodas, y son los mismos cuadrados que minimiza la regresión.)

**Por qué $n-1$: la media de la muestra "hace trampa".** Ya viste (Módulo 0.4) que el promedio es el número que **minimiza** la suma de distancias al cuadrado. Eso significa que, medidos desde $\bar{x}$, los datos parecen **más juntos** de lo que están en realidad alrededor de la verdadera $\mu$. Por ejemplo, si la verdadera media de la población fuera $6$, la suma de cuadrados de los mismos datos alrededor de $6$ sería $16 + 4 + 4 + 0 + 9 = 33$, más que los $28$ medidos desde $\bar{x} = 5$. Medir desde $\bar{x}$ siempre da lo mínimo posible, así que subestima. Dividir por un número algo más chico ($n - 1$ en lugar de $n$) corrige ese achicamiento en promedio.

**La otra mirada: los grados de libertad.** Como los desvíos suman cero, si conocés cuatro de ellos ($-3, -1, -1, 1$), el quinto queda obligado a ser $4$. Solo hay $n-1$ desvíos que aportan información "libre": por eso se divide por $n-1$. Vas a ver esta idea muchas veces: cada cosa que estimás con los datos te cuesta un grado de libertad.`,
        sources: ['Wackerly, Mendenhall y Scheaffer, *Estadística matemática con aplicaciones*, cap. 8 (estimador insesgado de la varianza)'],
      },
      { type: 'miniCheck', questionIds: ['m2-q12'] },
      {
        type: 'paragraph',
        text: t`**Valores atípicos (*outliers*).** Cambia el $9$ por un $90$: los datos son $2, 4, 4, 6, 90$. La media salta a $21.2$, pero la mediana sigue siendo $4$. **La mediana es robusta a valores extremos; la media no.** Por eso, con ingresos o precios de viviendas (muy sesgados), se suele reportar la mediana.`,
      },
      {
        type: 'intuition',
        title: 'Por qué la mediana aguanta mejor',
        text: t`**El millonario que entra a un bar.** Si entra al bar alguien con una fortuna enorme, el ingreso **promedio** de los clientes se dispara, aunque nadie más se haya vuelto rico. El cliente "del medio", en cambio, sigue siendo el mismo. La media reparte el valor extremo entre todos; a la mediana solo le importa quién queda en el centro de la fila.`,
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
      {
        type: 'intuition',
        title: 'Los números no son todos iguales: las cuatro escalas',
        text: t`**Los números no son todos iguales.** Pensá en los números de las camisetas de un equipo de fútbol. Son números, pero promediarlos no tiene ningún sentido: el "promedio de camisetas" no dice nada del equipo. Son solo **etiquetas** (escala nominal). Las posiciones de llegada de una carrera (1.º, 2.º, 3.º) sí tienen orden, pero el 1.º puede haberle sacado un segundo al 2.º y diez minutos al 3.º (escala ordinal). Antes de calcular algo, preguntate qué significa realmente la distancia entre dos valores.`,
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
      {
        type: 'deepDive',
        title: 'Por qué importa *por qué* faltan los datos',
        text: t`**Rellenar con la media no es inocente.** Tomemos los datos del ejemplo de la sección anterior, $2, 4, 4, 6, 9$, y supongamos que el $9$ no se registró. Si se rellena con la media de los demás ($4$), quedan $2, 4, 4, 6, 4$: la media baja de $5$ a $4$ y la varianza se desploma de $7$ a $s^2 = 8/4 = 2$. Agregar un valor "promedio" achica artificialmente la dispersión, y con ella todos los márgenes de error que vas a calcular después.

**Lo que más importa es el motivo.** Hay tres situaciones típicas:

**Faltan por puro azar** (se perdió una planilla). Los datos que quedan siguen siendo una muestra representativa, solo que más chica: se pierde precisión, pero no se tuercen los resultados.

**Faltan por algo que sí observaste** (los más jóvenes responden menos, y la edad la tenés). Se puede corregir usando esa información, por ejemplo imputando con un modelo que tenga en cuenta la edad.

**Faltan por el propio valor que falta** (los que ganan mucho no declaran su ingreso). Es el caso peligroso: los datos que quedan están torcidos, y ningún relleno lo arregla del todo, porque lo que necesitarías saber es justamente lo que no tenés. En el ejemplo, eso es lo que pasó con el $9$: faltaba el valor más alto, y la media de los que quedaban subestimaba la verdadera.`,
        sources: ['Little y Rubin, *Statistical Analysis with Missing Data*, cap. 1 (tipos de datos faltantes)', 'Datos del ejemplo de la guía (sección 2.2), modificados'],
      },
    ],
  },
  {
    id: '2.4',
    moduleId: 2,
    title: 'Distribuciones de probabilidad',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: '¿Qué eran una variable aleatoria, su esperanza y su varianza?',
            answer: t`Una variable aleatoria es un número que depende del azar (lo que sale al tirar un dado). Su **esperanza** es el promedio de largo plazo ($3.5$ para el dado) y su **varianza**, el promedio de las distancias al cuadrado a ese centro. Lo viste en Módulo 0.2.`,
          },
          {
            question: '¿Qué significaba que dos sucesos sean independientes?',
            answer: t`Que saber que ocurrió uno no cambia la probabilidad del otro. Entonces la probabilidad de que ocurran ambos es el producto: $P(A \text{ y } B) = P(A)\cdot P(B)$. La binomial y la Poisson lo suponen. Lo viste en Módulo 0.2.`,
          },
          {
            question: t`¿Qué era $e$ y la exponencial $e^x$?`,
            answer: t`$e \approx 2.718$ es una constante especial, y $e^x$ siempre da un número positivo, con $e^0 = 1$. Aparece en la fórmula de la Poisson y en la de la Normal. Lo viste en Módulo 0.5.`,
          },
        ],
      },
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
      {
        type: 'deepDive',
        title: 'La Poisson es una binomial con muchísimos intentos',
        text: t`¿Por qué la Poisson sirve para "eventos raros"? Pensá en las llamadas a la central como una binomial: cada minuto hay muchísimas personas que **podrían** llamar, pero cada una lo hace con una probabilidad minúscula. Por ejemplo, $600$ personas, cada una con probabilidad $0.005$ de llamar en un minuto dado. En promedio llaman $600 \times 0.005 = 3$, como en el ejemplo.

Con la binomial, la probabilidad de que no llame nadie es $0.995^{600} \approx 0.0494$; con la Poisson de $\lambda = 3$, $e^{-3} \approx 0.0498$. Casi idénticas. Cuando $n$ es muy grande y $p$ muy chica, la binomial se vuelve una Poisson con $\lambda = np$, y ya no hace falta saber ni $n$ ni $p$: alcanza con el promedio. Por eso la Poisson es tan práctica: casi nunca sabés cuántas personas *podrían* llamar, pero sí cuántas llaman en promedio.`,
        sources: ['Ross, *A First Course in Probability*, cap. 4 (la Poisson como límite de la binomial)'],
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
      {
        type: 'deepDive',
        title: t`De dónde sale el $1.96$ que vas a ver en todas partes`,
        text: t`La regla "95 % a menos de 2 desviaciones" está redondeada. El valor exacto es $1.96$: en una Normal, el 95 % del área queda entre $-1.96$ y $+1.96$ desviaciones típicas de la media, y queda un $2.5$ % en cada cola. Ese $1.96$ es el que aparece en los intervalos de confianza de la sección 2.6.

**El puntaje $z$ convierte cualquier Normal en una sola.** Una estatura en centímetros y un coeficiente intelectual no se pueden comparar directamente. Pero si a cada valor le restás su media y lo dividís por su desviación típica, todos quedan en la misma escala: "a cuántas desviaciones del centro estás". Así, con una sola tabla (la de la Normal estándar, con media $0$ y desviación $1$) se responde cualquier pregunta. Por ejemplo, el ~2.3 % de la guía para $z = 2$ es el área a la derecha de $2$ en esa curva: $1 - 0.977 \approx 0.023$.

**Por qué aparece tanto.** Una variable que es la suma de muchas causas chicas e independientes tiende a la campana, porque los empujones hacia arriba y hacia abajo se compensan casi siempre y solo rara vez se suman todos para el mismo lado. Por eso los valores extremos son raros. La sección 2.5 lleva esta idea a los promedios.`,
        sources: ['Freedman, Pisani y Purves, *Statistics*, cap. 5 (la curva Normal)'],
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
      {
        type: 'deepDive',
        title: t`La $t$, la $\chi^2$ y la $F$: para qué vas a usar cada una`,
        text: t`Estas tres distribuciones no describen datos del mundo (estaturas, llamadas), sino **estadísticos**: números que calculás con una muestra para tomar decisiones. Cada una responde a una pregunta distinta.

**La $t$: "¿qué tan lejos está mi estimación, contando que el margen de error también es estimado?"** Si conocieras $\sigma$, la distancia de $\bar{x}$ al valor de la hipótesis, medida en errores estándar, seguiría una Normal. Pero casi siempre usás $s$, que también varía de muestra en muestra, y eso agrega incertidumbre: las colas se engordan. Con pocos datos, mucho: para dejar un 2.5 % en cada cola hay que irse a $3.18$ con 3 grados de libertad, a $2.03$ con 35, y con muchos datos se llega al $1.96$ de la Normal. La vas a usar para decidir si **un** coeficiente o **una** media difieren de un valor.

**La $\chi^2$: "¿qué tan grande es esta suma de cuadrados?"** Como es una suma de Normales al cuadrado, aparece cada vez que sumás desvíos al cuadrado, que es exactamente lo que hace la varianza. Sirve para sacar conclusiones sobre una varianza y para comparar conteos observados con los esperados en una tabla.

**La $F$: "¿esta variabilidad es más grande que esta otra, más de lo que daría el azar?"** Es el cociente de dos $\chi^2$, o sea, de dos varianzas. Si las dos miden lo mismo, el cociente ronda $1$; si el numerador es mucho mayor, algo lo está inflando. En la regresión vas a comparar la variabilidad que explica un **grupo** de variables con la que queda sin explicar: si el cociente es grande, ese grupo aporta. Es la pregunta de la $t$, pero para varias cosas juntas.`,
        sources: ['Wooldridge, *Introducción a la econometría*, apéndice B (distribuciones $t$, $\chi^2$ y $F$)'],
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
        type: 'recall',
        items: [
          {
            question: '¿Qué diferencia había entre un parámetro y un estadístico?',
            answer: t`El **parámetro** describe a la población y casi siempre es desconocido ($\mu$, $\sigma$). El **estadístico** se calcula con la muestra ($\bar{x}$, $s$) y sirve para estimarlo. Lo viste en Módulo 2.1.`,
          },
          {
            question: '¿Qué medía la desviación típica?',
            answer: t`Cuánto se alejan, típicamente, los datos de su media, en las mismas unidades que los datos. Lo viste en Módulo 2.2.`,
          },
          {
            question: '¿Qué decía la regla 68-95-99.7?',
            answer: t`En una Normal, alrededor del 68 % de los valores está a menos de 1 desviación típica de la media, el 95 % a menos de 2 (exactamente, $1.96$) y el 99.7 % a menos de 3. Lo viste en Módulo 2.4.`,
          },
        ],
      },
      {
        type: 'paragraph',
        text: t`Si tomas una muestra y calculas $\bar{x}$, y luego tomas **otra** muestra, obtienes otra $\bar{x}$ distinta. La $\bar{x}$ **varía de muestra en muestra**. Su distribución se llama **distribución muestral de la media**.`,
      },
      {
        type: 'intuition',
        title: 'Cada muestra da un promedio distinto',
        text: t`**Cada muestra da un promedio distinto.** Si repetís el sondeo con otras personas, el promedio cambia un poco. Es como pesar varias veces distintos puñados de arroz de la misma bolsa: cada puñado da un promedio algo diferente. La forma en que esos promedios se reparten es la **distribución muestral**.`,
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
      {
        type: 'deepDive',
        title: 'Desviación típica y error estándar: la confusión más común',
        text: t`**Miden cosas distintas.** La desviación típica ($\sigma = 600$ en el ejemplo) dice cuánto se alejan **las personas** del promedio: una persona cualquiera gana fácilmente 600 más o menos que la media. El error estándar ($60$) dice cuánto se aleja **el promedio de una muestra** del verdadero promedio. Tomando 100 personas al azar, el promedio casi nunca se aleja más de unos 120 de la verdad, aunque cada persona varíe muchísimo.

**Por qué se divide por $\sqrt{n}$ y no por $n$.** Al promediar, los que ganan de más y los que ganan de menos se compensan en parte, pero no del todo: la compensación es imperfecta y aleatoria. La cuenta exacta dice que la varianza del promedio es $\sigma^2/n$, así que su desviación es $\sigma/\sqrt{n}$. Con los números del ejemplo:

$n = 25$: error estándar $= 600/5 = 120$.

$n = 100$: error estándar $= 600/10 = 60$.

$n = 400$: error estándar $= 600/20 = 30$.

Cada vez que se cuadruplica la muestra, el error se reduce a la mitad. Por eso los primeros datos rinden mucho y los siguientes cada vez menos.

**Por qué es la pieza central de lo que sigue.** Intervalos de confianza, contrastes, el $t$ de una regresión: todo se mide **en errores estándar**. Cuando más adelante leas "el error estándar está mal calculado", significa que la regla con la que medís "lejos" o "cerca" está mal graduada.`,
        sources: ['Freedman, Pisani y Purves, *Statistics*, cap. 17 (el error estándar del promedio)'],
      },
    ],
  },
  {
    id: '2.6',
    moduleId: 2,
    title: 'Estimación: intervalos de confianza y máxima verosimilitud',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: '¿Qué era el error estándar?',
            answer: t`La desviación típica de un estimador: cuánto variaría, por ejemplo, $\bar{x}$ de muestra en muestra. Para la media vale $\sigma/\sqrt{n}$ y se estima con $s/\sqrt{n}$. Lo viste en Módulo 2.5.`,
          },
          {
            question: t`¿De dónde salía el $1.96$?`,
            answer: t`En una Normal, el 95 % de los valores queda a menos de $1.96$ desviaciones típicas de la media. Lo viste en Módulo 2.4.`,
          },
          {
            question: '¿Cómo se encontraba el máximo o el mínimo de una función?',
            answer: t`Buscando el punto donde la derivada (la pendiente) vale cero: en la cima o en el fondo del valle, la curva está plana. Lo viste en Módulo 0.4.`,
          },
          {
            question: '¿Qué propiedad estrella tenía el logaritmo?',
            answer: t`Convierte productos en sumas: $\ln(a \cdot b) = \ln(a) + \ln(b)$. Lo viste en Módulo 0.5.`,
          },
        ],
      },
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
      {
        type: 'deepDive',
        title: t`De dónde sale "$\pm 1.96$ errores estándar"`,
        text: t`**Dar vuelta la frase.** Por el TLC, $\bar{x}$ cae a menos de $1.96$ errores estándar de $\mu$ en el 95 % de las muestras. Pero "$\bar{x}$ está cerca de $\mu$" es lo mismo que "$\mu$ está cerca de $\bar{x}$": la distancia es la misma, se mire desde donde se mire. Entonces, si a cada $\bar{x}$ le sumás y restás $1.96$ errores estándar, el rango que armás alcanza a $\mu$ en el 95 % de las muestras. Eso es el intervalo, y por eso el 95 % habla del método y no de un intervalo en particular (el aro y la estaca).

**Cada ingrediente de la fórmula explica qué lo ensancha.** En $\bar{x} \pm z^* \cdot s/\sqrt{n}$:

**Más confianza:** para atrapar a $\mu$ el 99 % de las veces hay que abrir más el aro, con $z^* = 2.576$ en lugar de $1.96$. Con los datos del ejemplo, $1050 \pm 2.576\times60 \approx 1050 \pm 154.6$, es decir, $[895.4 ;\ 1204.6]$, contra $[932.4 ;\ 1167.6]$ al 95 %. Más seguridad cuesta precisión.

**Más dispersión ($s$):** datos más desparramados dan promedios más inestables.

**Menos datos ($n$):** el error estándar crece, aunque solo con la raíz de $n$.`,
        sources: ['Freedman, Pisani y Purves, *Statistics*, cap. 21 (intervalos de confianza)'],
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
      {
        type: 'deepDive',
        title: t`Cómo se encuentra el máximo, y por qué con logaritmos`,
        text: t`**Probar valores a mano.** Con 7 caras en 10 tiros: $L(0.6) = 0.6^7 \cdot 0.4^3 \approx 0.00179$, $L(0.7) \approx 0.00222$ y $L(0.8) = 0.8^7 \cdot 0.2^3 \approx 0.00168$. La curva sube hasta $0.7$ y después baja: el máximo está en la cima, donde la pendiente es cero (Módulo 0.4).

**Por qué se usa el logaritmo.** La verosimilitud es un **producto** de una probabilidad por cada dato. Con 1000 datos serían 1000 números menores que 1 multiplicados entre sí, un número tan chico que la computadora ni lo puede guardar. El logaritmo convierte ese producto en una **suma**, $\ln L = 7\ln p + 3\ln(1-p)$, que es fácil de manejar. Y como el logaritmo siempre crece cuando crece su argumento, el máximo está en el mismo $p$.

**La cuenta.** Derivando, $\dfrac{7}{p} - \dfrac{3}{1-p} = 0$, o sea, $7(1-p) = 3p$, y queda $p = 0.7$: la proporción observada. El método confirma lo que dice la intuición, pero su valor está en que funciona igual cuando la intuición no alcanza: con muchos parámetros, la computadora busca la cima por pasos (como el descenso por gradiente del Módulo 0.4). Muchos de los modelos que vienen más adelante se estiman así.`,
        sources: ['Wackerly, Mendenhall y Scheaffer, *Estadística matemática con aplicaciones*, cap. 9 (máxima verosimilitud)'],
      },
    ],
  },
  {
    id: '2.7',
    moduleId: 2,
    title: 'Contraste de hipótesis y tamaño del efecto',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: '¿Qué era el error estándar?',
            answer: t`Cuánto variaría una estimación (como $\bar{x}$) de muestra en muestra: $s/\sqrt{n}$ para la media. Es la "regla" con la que se mide si un resultado está lejos o cerca. Lo viste en Módulo 2.5.`,
          },
          {
            question: t`¿Por qué la $t$ de Student tiene colas más pesadas que la Normal?`,
            answer: t`Porque se usa cuando la desviación se estima con la propia muestra ($s$), lo que agrega incertidumbre, sobre todo con pocos datos. Con muchos datos se parece a la Normal. Lo viste en Módulo 2.4.`,
          },
          {
            question: '¿Qué significaba "95 % de confianza"?',
            answer: t`Que el método de construir el intervalo atrapa al verdadero parámetro en el 95 % de las muestras (el aro y la estaca). Lo viste en Módulo 2.6.`,
          },
          {
            question: '¿Qué hacía el teorema de Bayes?',
            answer: t`Daba vuelta una probabilidad condicional: de $P(B \mid A)$ a $P(A \mid B)$. En el test médico, que el test detecte al 90 % de los enfermos no significa que un positivo tenga 90 % de chance de estar enfermo: con una enfermedad rara, era apenas $0.154$. Lo viste en Módulo 0.2.`,
          },
        ],
      },
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
        type: 'deepDive',
        title: 'Por qué el p-valor no es "la probabilidad de que $H_0$ sea cierta"',
        text: t`Es la confusión más común, y la diferencia es la misma que en el test médico del Módulo 0.2: no es lo mismo $P(\text{datos así} \mid H_0)$ que $P(H_0 \mid \text{datos así})$.

**Un ejemplo con mil hipótesis.** Supongamos que un laboratorio pone a prueba $1000$ ideas, y que solo $100$ de ellas son efectos reales (las otras $900$ no hacen nada). Usan $\alpha = 0.05$ y sus estudios tienen una potencia de $0.8$:

De las $100$ reales, detectan $100 \times 0.8 = 80$.

De las $900$ falsas, igual salen "significativas" por azar $900 \times 0.05 = 45$.

En total hay $125$ resultados significativos, y $45$ de ellos son falsas alarmas: $45/125 = 36$ %. Aunque cada uno tenga $p < 0.05$, más de un tercio de los "descubrimientos" no son reales. Cuánto creerle a un resultado significativo depende de qué tan probable era la idea **antes** de probarla, igual que en Bayes dependía de qué tan rara era la enfermedad.

**Qué sí dice el p-valor.** Si $H_0$ fuera cierta, qué tan raro sería ver datos como estos. Es una medida de sorpresa, no la probabilidad de que la hipótesis sea verdadera o falsa.`,
        sources: ['Ioannidis, "Why Most Published Research Findings Are False", *PLoS Medicine* (2005)', 'Cifras inventadas para el ejemplo'],
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
        type: 'deepDive',
        title: t`De dónde sale el $0.053$, y por qué el intervalo dice lo mismo`,
        text: t`**El p-valor es un área.** Si las baterías duraran de verdad 100 horas, el estadístico $t$ seguiría una $t$ de Student con 35 grados de libertad. El p-valor es la probabilidad de caer **tan lejos o más** que lo observado, en cualquiera de las dos direcciones porque $H_a$ es "distinto de 100". Es el área de la curva más allá de $-2$ sumada al área más allá de $+2$: alrededor de $2.7$ % de cada lado, y en total $\approx 0.053$.

**El contraste y el intervalo son dos caras de lo mismo.** El intervalo al 95 % para la duración media es $96 \pm 2.03 \times 2$, es decir, $[91.94 ;\ 100.06]$. Contiene al $100$, así que $100$ es un valor plausible, y por eso no se rechaza $H_0$. En general, un contraste a dos colas al 5 % rechaza $H_0$ exactamente cuando el valor de $H_0$ queda **fuera** del intervalo al 95 %. El intervalo además te dice algo que el p-valor no: el rango completo de duraciones compatibles con los datos.`,
        sources: ['Wooldridge, *Introducción a la econometría*, apéndice C (contrastes e intervalos)'],
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
      {
        type: 'deepDive',
        title: 'Por qué con muestras enormes todo sale significativo',
        text: t`El estadístico $t$ y la $d$ de Cohen están conectados por una cuenta simple: $t = d \times \sqrt{n}$. El $t$ mide la diferencia en errores estándar, y el error estándar es $s/\sqrt{n}$; la $d$ la mide en desviaciones típicas. La diferencia entre las dos es justamente el factor $\sqrt{n}$.

**Con las baterías:** $d \approx -0.33$ y $\sqrt{36} = 6$, así que $t = -0.33 \times 6 \approx -2$, el mismo valor de la guía.

**Con la muestra gigante:** $d = 0.5/12 \approx 0.04$, un efecto mínimo, pero $\sqrt{100\,000} \approx 316$, así que $t \approx 0.0417 \times 316 \approx 13.2$.

El tamaño del efecto queda fijo, pero el $t$ crece sin límite con la muestra. Con datos suficientes, **cualquier** diferencia distinta de cero termina siendo "significativa". Por eso el p-valor responde "¿hay algo?" y la $d$ responde "¿cuánto?". Son preguntas distintas y hacen falta las dos.`,
        sources: ['Cohen, *Statistical Power Analysis for the Behavioral Sciences*, cap. 1'],
      },
    ],
  },
]
