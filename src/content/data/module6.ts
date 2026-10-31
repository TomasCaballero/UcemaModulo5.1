import type { ContentBlock, Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 6. Los bloques `extra` (ejemplos
// cotidianos o clásicos), `deepDive` (ampliaciones) y `recall` (repasos de lo previo) no son de la
// guía y se muestran rotulados; las cifras de las ampliaciones se verifican en tools/expansion-numbers.ts.
const t = String.raw

/** Apertura del módulo, previa a la sección 6.1. */
export const module6Intro: ContentBlock[] = [
  {
    type: 'paragraph',
    text: t`El **aprendizaje estadístico** reúne los métodos para construir modelos que **predigan bien datos que nunca vieron**. Todo el módulo gira alrededor de una tensión: un modelo demasiado simple no capta los patrones, y uno demasiado flexible memoriza el ruido.`,
  },
]

export const module6Sections: Section[] = [
  {
    id: '6.1',
    moduleId: 6,
    title: 'Aprendizaje supervisado y no supervisado',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué era el sobreajuste?`,
            answer: t`Un modelo que rinde muy bien con los datos con que se construyó y mal con datos nuevos: aprendió el ruido en lugar del patrón. Por eso los datos se separan en entrenamiento y prueba. Lo viste en Módulo 4.3.`,
          },
          {
            question: t`¿Qué buscaba el agrupamiento?`,
            answer: t`Organizar los registros en grupos de parecidos **sin una clase conocida**; para decir "se parecen" hace falta una medida de distancia. DBSCAN, por ejemplo, arma los grupos por densidad. Lo viste en Módulo 4.5.`,
          },
          {
            question: t`¿Por qué la varianza muestral divide por $n-1$?`,
            answer: t`Porque los desvíos se miden respecto de $\bar{x}$, que se calculó con los mismos datos y queda "pegada" a ellos: los cuadrados suman menos que alrededor de la media verdadera. Dividir por $n-1$ compensa esa ventaja. Lo viste en Módulo 2.2.`,
          },
        ],
      },
      {
        type: 'list',
        items: [
          t`**Supervisado**: para cada entrada $x_i$ se conoce una respuesta $y_i$. Se busca una función $f$ tal que $Y = f(X) + \epsilon$, donde $\epsilon$ es el **error irreducible** (variación de $Y$ que ninguna función de $X$ puede explicar). Si $Y$ es un número, es **regresión**; si es una categoría, **clasificación** (Módulos 3 a 5).`,
          t`**No supervisado**: solo se observan las entradas $x_i$, sin respuesta. Se busca **estructura**: grupos (*clustering*) o direcciones de variación (PCA).`,
        ],
      },
      {
        type: 'intuition',
        title: 'Con respuestas y sin respuestas, y el error que no se puede evitar',
        text: t`**Con respuestas y sin respuestas.** Aprendizaje **supervisado** es estudiar con un libro de ejercicios que trae las soluciones al final: para cada caso tenés la respuesta correcta y aprendés la relación. Aprendizaje **no supervisado** es ordenar tu discoteca por "parecido" sin que nadie te diga las categorías: descubrís los grupos por tu cuenta. Si lo que predecís es un número, es regresión; si es una categoría, clasificación.

**El error que no se puede evitar.** Aun el mejor modelo del mundo no puede explicar todo, porque siempre hay variación que depende de cosas que no están en los datos. Ese piso se llama **error irreducible**.`,
      },
      {
        type: 'paragraph',
        text: t`**Medir el error en regresión.** El **error cuadrático medio** (MSE) es el promedio de los errores al cuadrado: $\text{MSE} = \frac{1}{n}\sum (y_i - \hat{y}_i)^2$. Se distinguen dos versiones:`,
      },
      {
        type: 'intuition',
        title: 'Cómo se mide el error',
        text: t`**Cómo se mide el error.** El error cuadrático medio (MSE) es el promedio de los errores elevados al cuadrado. Con temperaturas reales de $(20, 22, 25)$ y predicciones de $(19, 24, 22)$, los errores son $1, -2, 3$ y el MSE es aproximadamente $4.67$.`,
      },
      {
        type: 'list',
        items: [
          t`**Error de entrenamiento**: calculado con los datos usados para ajustar el modelo. Casi siempre es optimista.`,
          t`**Error de prueba**: calculado con datos **nuevos**. Es el que realmente importa.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Un modelo más flexible **tiende a bajar siempre el error de entrenamiento**, pero el error de prueba no necesariamente.`,
      },
      {
        type: 'deepDive',
        title: t`Por qué el error de entrenamiento es optimista`,
        text: t`El modelo eligió sus parámetros **mirando esos mismos datos**, ruido incluido, así que se acomoda a ellos mejor que a cualquier dato nuevo. Se ve hasta con el modelo más simple de todos: predecir siempre con el promedio $\bar{y}$.

**En entrenamiento**, cada dato tiró del promedio hacia sí mismo al calcularlo. Es lo mismo que pasaba con la varianza muestral: alrededor de $\bar{y}$ los cuadrados suman menos que alrededor de la media verdadera. En promedio, el error cuadrático de entrenamiento es $\tfrac{n-1}{n}\,\sigma^2$, donde $\sigma^2$ es la varianza del ruido.

**En prueba**, el dato nuevo no participó del cálculo. Su error suma dos cosas: el ruido propio del dato, $\sigma^2$, y lo que se equivoca el promedio por haber salido de una muestra, $\sigma^2/n$. Total: $\left(1 + \tfrac{1}{n}\right)\sigma^2$.

Con $n = 5$ y $\sigma^2 = 4$, el error de entrenamiento esperado es $\tfrac{4}{5} \times 4 = 3.2$ y el de prueba, $\tfrac{6}{5} \times 4 = 4.8$: la misma regla, medida dos veces, da un 50 % más de error con datos nuevos. Y la brecha crece con la flexibilidad: un modelo con tantos parámetros como datos puede llevar el error de entrenamiento a cero sin haber aprendido nada.`,
        sources: [
          'Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 7.4 (el optimismo del error de entrenamiento)',
          'James, Witten, Hastie y Tibshirani, *An Introduction to Statistical Learning*, cap. 2.2',
          'Cifras inventadas para el ejemplo',
        ],
      },
    ],
  },
  {
    id: '6.2',
    moduleId: 6,
    title: 'El equilibrio sesgo-varianza',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué significaban "insesgado" y "eficiente"?`,
            answer: t`Un estimador es insesgado si, en promedio sobre muchas muestras, da el valor verdadero; entre los insesgados, el eficiente es el de menor varianza. Uno habla del centro de la distribución de resultados; el otro, de su ancho. Lo viste en Módulo 3.6.`,
          },
          {
            question: t`¿Cuánto varía el promedio de una muestra?`,
            answer: t`Su varianza es $\sigma^2/n$ y su desviación típica, el error estándar $\sigma/\sqrt{n}$: con más datos, el promedio cambia menos de una muestra a otra. Lo viste en Módulo 2.5.`,
          },
        ],
      },
      { type: 'paragraph', text: 'Para un punto nuevo, el error de prueba esperado se descompone en tres partes:' },
      {
        type: 'formula',
        latex: t`\text{Error esperado} = \underbrace{\text{Sesgo}^2}_{\text{por simplificar}} + \underbrace{\text{Varianza}}_{\text{por sensibilidad a los datos}} + \underbrace{\text{Error irreducible}}_{\text{no se puede evitar}}`,
      },
      {
        type: 'list',
        items: [
          t`**Sesgo**: error por suponer un modelo demasiado simple (ajustar una recta a una curva). Produce **subajuste** (*underfitting*).`,
          t`**Varianza**: cuánto cambiaría el modelo si se entrenara con **otra muestra** distinta. Un modelo muy flexible cambia mucho y memoriza el ruido: **sobreajuste** (*overfitting*).`,
          t`**Error irreducible**: el piso, no se puede bajar con ningún modelo.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Dos formas de fallar: el tiro al blanco',
        text: t`**Dos formas de fallar.** Un modelo puede errar por ser **demasiado simple** (sesgo) o por ser **demasiado sensible a los datos que vio** (varianza). Es como el tiro al blanco. Un tirador con **sesgo alto y varianza baja** pone todos los dardos juntos pero lejos del centro: es consistente, pero consistentemente equivocado. Uno con **sesgo bajo y varianza alta** acierta en promedio al centro, pero sus dardos quedan desparramados.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q02'] },
      {
        type: 'paragraph',
        text: t`**Metáfora de la regla y la cuerda de hule.** Un modelo de alto sesgo es una **regla rígida de madera**: no se dobla para seguir el terreno real. Uno de alta varianza es una **cuerda de hule** muy flexible que se amolda a cada grano de polvo y pierde la forma general.`,
      },
      {
        type: 'table',
        headers: ['Propiedad', 'Modelo rígido', 'Modelo balanceado', 'Modelo muy flexible'],
        rows: [
          ['Sesgo', 'Alto', 'Bajo', 'Muy bajo'],
          ['Varianza', 'Baja', 'Moderada', 'Muy alta'],
          ['Ajuste', 'Subajuste', 'Óptimo', 'Sobreajuste'],
          ['Error de entrenamiento', 'Alto', 'Bajo', '**Casi cero**'],
          ['Error de prueba', 'Alto', '**Mínimo**', 'Alto (curva en U)'],
        ],
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo ilustrativo (cifras inventadas):* ajustando polinomios a 10 puntos, el error de entrenamiento baja con el grado, pero el de prueba hace una **U**:`,
      },
      {
        type: 'table',
        headers: ['Grado del polinomio', 'Error de entrenamiento', 'Error de prueba'],
        rows: [
          ['1', '9.0', '10.2'],
          ['3', '2.5', '**3.1**'],
          ['9', '**0.0**', '25.0'],
        ],
        illustrative: true,
      },
      {
        type: 'paragraph',
        text: t`El grado 9 pasa por todos los puntos de entrenamiento y falla con datos nuevos.`,
      },
      {
        type: 'intuition',
        title: 'El que memoriza',
        text: t`**El que memoriza.** Quien se aprende de memoria las respuestas de exámenes de años anteriores tiene error casi cero en esos ejercicios y se desorienta con una pregunta nueva: es el polinomio de grado 9 de la tabla.`,
      },
      {
        type: 'paragraph',
        text: t`**El objetivo no es minimizar el error de entrenamiento, sino hallar el punto de equilibrio** con menor error de prueba. Las secciones siguientes son herramientas para encontrarlo y controlarlo.`,
      },
      {
        type: 'deepDive',
        title: t`La descomposición con números: cuándo conviene aceptar sesgo`,
        text: t`Para un estimador $\hat\theta$ de un valor $\theta$, el error cuadrático medio se parte en dos: $E[(\hat\theta - \theta)^2] = \text{Sesgo}^2 + \text{Varianza}$, donde el sesgo es $E(\hat\theta) - \theta$. Es la fórmula de la sección sin el error irreducible: acá no hay un dato nuevo con ruido propio, solo un valor que estimar.

**Un estimador insesgado no siempre es el mejor.** Para estimar una media $\mu$ con $\bar{x}$, supongamos que $\text{Var}(\bar{x}) = 4$. Como $\bar{x}$ es insesgado, su error es solo la varianza: $4$.

Ahora probá un estimador "encogido" hacia cero: $0.8\,\bar{x}$. Su varianza baja a $0.8^2 \times 4 = 2.56$, pero aparece un sesgo: en promedio da $0.8\mu$ y se queda corto en $0.2\mu$.

**Si $\mu = 2$**, el sesgo es $0.4$ y su cuadrado, $0.16$. Error total: $0.16 + 2.56 = 2.72$, **mejor que el 4 del insesgado**.

**Si $\mu = 10$**, el sesgo es $2$ y su cuadrado, $4$. Error total: $4 + 2.56 = 6.56$, peor.

Encoger conviene cuando la varianza que ahorra es mayor que el sesgo que agrega: cuando los datos son ruidosos y el valor verdadero no está lejos de donde se encoge. Más adelante en este módulo vas a ver métodos que aplican esta idea a los coeficientes de una regresión.`,
        sources: [
          'Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 7.3 (descomposición sesgo-varianza)',
          'Cifras inventadas para el ejemplo',
        ],
      },
    ],
  },
  {
    id: '6.3',
    moduleId: 6,
    title: 'Remuestreo: validación cruzada y bootstrap',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué era la filtración?`,
            answer: t`Que información del conjunto de prueba llegue al entrenamiento, por ejemplo al imputar con la mediana de todos los datos: la evaluación queda optimista. Cada transformación se aprende solo con el entrenamiento y después se aplica a la prueba. Lo viste en Módulo 4.3.`,
          },
          {
            question: t`¿Cómo se calculaba la probabilidad de que pasen dos cosas independientes?`,
            answer: t`Multiplicando: dos caras seguidas es $0.5 \times 0.5 = 0.25$. Así se calcula, por ejemplo, la chance de que un dato no salga en ninguna de varias extracciones. Lo viste en Módulo 0.2.`,
          },
        ],
      },
      {
        type: 'paragraph',
        text: t`Como no siempre hay un conjunto de prueba aparte, se **reutilizan** los datos de forma inteligente.`,
      },
      {
        type: 'paragraph',
        text: t`**Parámetros e hiperparámetros.** Los **parámetros** (los $\beta$) se aprenden de los datos. Los **hiperparámetros** (profundidad de un árbol, $\lambda$ de regularización, número de vecinos) **se fijan antes** y controlan la flexibilidad. Elegirlos bien es la tarea típica de la validación cruzada.`,
      },
      { type: 'paragraph', text: t`**Validación cruzada de $k$ particiones (*$k$-fold CV*):**` },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Se dividen los datos al azar en $k$ partes iguales (*folds*).`,
          t`Se entrena con $k-1$ partes y se evalúa en la parte restante.`,
          t`Se repite $k$ veces, rotando la parte de evaluación, y se **promedian** los $k$ errores.`,
        ],
      },
      { type: 'miniCheck', questionIds: ['m6-q03'] },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* con $n=100$ y $k=5$, cada ajuste usa 80 datos para entrenar y 20 para evaluar, y se hacen 5 ajustes. Se suele usar $k = 5$ o $10$. El caso extremo $k=n$ es *leave-one-out*, más costoso. Se elige el hiperparámetro con **menor error de validación cruzada**.`,
      },
      {
        type: 'intuition',
        title: 'Validación cruzada: rotar al evaluador',
        text: t`**Validación cruzada: rotar al evaluador.** Ensayás una presentación frente a cinco amigos. Un día la hacés frente a cuatro y la evalúa el quinto. Al día siguiente rotás, hasta que los cinco hayan sido evaluadores una vez. Promediando los cinco comentarios te formás una idea más justa que con un solo oyente. Sirve especialmente para elegir los "diales" del modelo (los hiperparámetros, que se fijan antes de entrenar), probando varios valores y quedándose con el de menor error.`,
      },
      {
        type: 'paragraph',
        text: t`**Bootstrap.** Una muestra *bootstrap* se obtiene **sacando $n$ datos con reemplazo** de los $n$ originales (un mismo dato puede repetirse y otros quedar afuera). *Ejemplo:* de $\{1,2,3,4,5\}$ podría salir $\{2,2,4,5,1\}$. Permite simular "otras muestras" a partir de una sola y estimar la variabilidad de cualquier estadístico.`,
      },
      {
        type: 'paragraph',
        text: t`Un dato dado queda **fuera** de una muestra bootstrap con probabilidad $(1-1/n)^n \to 1/e \approx 0.368$. Es decir, **cada muestra bootstrap contiene en promedio ~63 % de los datos distintos y deja ~37 % afuera**. Esto se usa en el bagging.`,
      },
      {
        type: 'extra',
        text: t`El bootstrap es sacar bolillas de una bolsa devolviéndolas cada vez. Con 10 bolillas numeradas, una en particular queda fuera de una muestra de 10 extracciones con probabilidad $(1-1/10)^{10} = 0.9^{10} \approx 0.349$, ya muy cerca del límite de 0.368.`,
      },
      {
        type: 'deepDive',
        title: t`El bootstrap sin azar: todas las muestras posibles de tres datos`,
        text: t`Con pocos datos se pueden escribir **todas** las muestras bootstrap en lugar de sortearlas. Con los datos $(2, 4, 9)$, cada una de las 3 extracciones puede dar cualquiera de los 3 valores: hay $3^3 = 27$ muestras posibles, todas igual de probables. Algunas: $(2, 2, 2)$ con media $2$, $(2, 4, 9)$ con media $5$ y $(9, 9, 4)$ con media $7.33$.

**El error estándar sale de mirar cuánto varían esas 27 medias.** Su promedio es $5$, la media original. Su desviación típica es $\approx 1.70$, que es exactamente $\sqrt{(26/3)/3}$: la varianza de los tres datos tratados como si fueran toda la población ($26/3$), dividida por $n = 3$. Es la fórmula $\sigma^2/n$ del error estándar, con la muestra en el lugar de la población.

**Por qué entonces sortear.** Con 3 datos alcanza con 27 casos; con 20 datos serían $20^{20}$, un número de 27 cifras. Sortear unas mil muestras da casi el mismo resultado. Y la ventaja es que sirve para cualquier número que calcules (una mediana, un AUC), aunque no tenga una fórmula de error estándar.

**El 37 % aparece contando.** El dato $2$ queda afuera en las muestras armadas solo con $4$ y $9$: son $2^3 = 8$ de las 27, o sea $(2/3)^3 \approx 0.296$. Con 10 datos la chance era $0.349$, y con muchos se acerca a $0.368$.`,
        sources: [
          'Efron y Tibshirani, *An Introduction to the Bootstrap*, cap. 6 (el error estándar bootstrap)',
          'Cifras inventadas para el ejemplo',
        ],
      },
    ],
  },
  {
    id: '6.4',
    moduleId: 6,
    title: 'Regularización y reducción de dimensión',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué era la colinealidad perfecta?`,
            answer: t`Que una columna se obtenga combinando otras ("edad en años" y "edad en meses"). Entonces no hay una única forma de repartir el efecto entre ellas: muchos juegos de coeficientes dan las mismas predicciones. Lo viste en Módulo 0.3.`,
          },
          {
            question: t`¿Qué hacían L1, L2 y el parámetro C en la regresión logística?`,
            answer: t`Le sumaban al error una penalización por coeficientes grandes: L2 los modera y L1 puede dejar algunos en cero. En *scikit-learn*, C es el **inverso** de la fuerza (C chico, regularización fuerte). Acá la fuerza se escribe $\lambda$ y va al revés: $\lambda$ grande, castigo fuerte. Lo viste en Módulo 5.2.`,
          },
          {
            question: t`¿Qué hacía la estandarización?`,
            answer: t`Restar la media y dividir por la desviación típica, $z = (x - \bar{x})/s$: todas las variables quedan con media 0 y desviación 1, sin importar sus unidades. Lo viste en Módulo 4.2.`,
          },
        ],
      },
      {
        type: 'paragraph',
        text: t`Cuando hay **muchas variables** (incluso más variables que observaciones, $p > n$), OLS tiene alta varianza o directamente no tiene solución única. La idea de la **regularización** es **aceptar un poco de sesgo a cambio de bajar mucho la varianza**, penalizando coeficientes grandes.`,
      },
      {
        type: 'paragraph',
        text: t`Recordemos que OLS minimiza la suma de residuos al cuadrado (RSS). Los métodos regularizados le suman una **penalización**:`,
      },
      {
        type: 'list',
        items: [
          t`**Ridge** ($L_2$): minimiza $\text{RSS} + \lambda\sum_j \beta_j^2$. **Encoge** todos los coeficientes hacia cero, pero **ninguno llega a ser exactamente cero**.`,
          t`**Lasso** ($L_1$): minimiza $\text{RSS} + \lambda\sum_j |\beta_j|$. Además de encoger, **lleva a cero** algunos coeficientes: hace **selección automática de variables** y produce modelos más simples de interpretar.`,
        ],
      },
      {
        type: 'intuition',
        title: 'La valija con límite de peso: Ridge y Lasso',
        text: t`**La valija.** Armar una valija con límite de peso. **Lasso** es dejar cosas en casa: decidís qué no llevar (el peso queda exactamente en cero) y el resto pasa tal cual. **Ridge** es llevar un poco menos de cada cosa: todo viaja, pero más liviano. Lasso sirve para elegir variables y hacer un modelo más fácil de leer; Ridge sirve para estabilizar sin descartar nada.`,
      },
      { type: 'paragraph', text: '*Detalles que importan:*' },
      {
        type: 'list',
        items: [
          t`$\lambda \ge 0$ es un **hiperparámetro** (se elige por validación cruzada). Con $\lambda = 0$ se obtiene OLS; con $\lambda \to \infty$ todos los coeficientes tienden a 0 (solo queda la constante).`,
          t`Hay que **estandarizar las variables** antes (Módulo 4.2), porque la penalización depende de la escala de cada una.`,
          t`Intuición geométrica: la penalización $L_1$ define una región con "esquinas" en los ejes y el óptimo suele caer en una esquina (coeficiente $=0$); la $L_2$ define un círculo sin esquinas.`,
          t`*Elastic net* combina ambas penalizaciones.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo ilustrativo (cifras inventadas) de coeficientes al aumentar $\lambda$:*`,
      },
      {
        type: 'table',
        headers: [t`$\lambda$`, t`$\beta_1$ (Ridge)`, t`$\beta_2$ (Ridge)`, t`$\beta_3$ (Ridge)`, t`$\beta_1$ (Lasso)`, t`$\beta_2$ (Lasso)`, t`$\beta_3$ (Lasso)`],
        rows: [
          ['0', '3.0', '1.5', '0.4', '3.0', '1.5', '0.4'],
          ['1', '2.4', '1.2', '0.3', '2.5', '1.0', '**0**'],
          ['10', '1.1', '0.6', '0.1', '1.2', '**0**', '**0**'],
        ],
        illustrative: true,
      },
      {
        type: 'deepDive',
        title: t`Por qué Lasso pone ceros y Ridge no`,
        text: t`Se ve con el caso más simple: **una sola variable**, estandarizada de modo que $\sum x_i^2 = 1$, y sin constante. Llamemos $\hat\beta$ al coeficiente de mínimos cuadrados (el de $\lambda = 0$). Desarrollando el cuadrado, el RSS queda, salvo una constante, $\beta^2 - 2\hat\beta\beta$, y a eso se le suma la penalización.

**Ridge** minimiza $\beta^2 - 2\hat\beta\beta + \lambda\beta^2$. Derivando e igualando a cero (Módulo 0.4), $2\beta - 2\hat\beta + 2\lambda\beta = 0$, o sea:

$\beta_{\text{Ridge}} = \dfrac{\hat\beta}{1 + \lambda}$

Ridge **divide**: achica todo en la misma proporción, y una división nunca da exactamente cero.

**Lasso** minimiza $\beta^2 - 2\hat\beta\beta + \lambda|\beta|$. Para $\beta > 0$, la derivada es $2\beta - 2\hat\beta + \lambda$, que se anula en $\beta = \hat\beta - \lambda/2$. Lasso **resta** una cantidad fija, y si $\hat\beta$ no alcanza a cubrirla, el mínimo queda clavado en la punta del valor absoluto: $\beta = 0$.

**Con $\lambda = 2$:** si $\hat\beta = 3$, Ridge da $3/3 = 1$ y Lasso $3 - 1 = 2$. Si $\hat\beta = 0.5$, Ridge da $0.5/3 \approx 0.167$ y Lasso da **exactamente 0**, porque $0.5$ no llega a cubrir el $1$ que hay que restar.

Fijate el contraste: con el coeficiente grande, Lasso castigó menos que Ridge; con el chico, lo eliminó. Es la "esquina" de la intuición geométrica de arriba, vista en una sola dimensión.`,
        sources: [
          'Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 3.4 (Ridge y Lasso con variables ortonormales)',
          'Tibshirani (1996), "Regression Shrinkage and Selection via the Lasso", *Journal of the Royal Statistical Society B*',
          'Cifras inventadas para el ejemplo',
        ],
      },
      {
        type: 'subheading',
        text: 'PCA: Análisis de Componentes Principales (reducción de dimensión, no regularización)',
      },
      {
        type: 'paragraph',
        text: t`PCA es una técnica **no supervisada** (no usa la respuesta). Transforma las variables originales, correlacionadas, en **nuevas variables llamadas componentes principales**, que son:`,
      },
      {
        type: 'list',
        items: [
          t`**combinaciones lineales** de las originales (Módulo 0.3),`,
          t`**no correlacionadas** entre sí,`,
          t`ordenadas por **cuánta varianza capturan**: la primera componente es la dirección con la mayor variación posible, la segunda es la mayor variación restante en dirección perpendicular, etc.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Matemáticamente, las componentes son los **vectores propios** de la matriz de covarianza, y la varianza de cada una es su **valor propio**.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* si "estatura" y "peso" están muy correlacionados, la primera componente se parece a un índice de "tamaño corporal" y captura casi toda la variación; la segunda, lo que queda (más bien "complexión").`,
      },
      {
        type: 'paragraph',
        text: t`*Con 4 variables estandarizadas* (varianza total $=4$), si los valores propios son $2.8,\ 0.9,\ 0.2,\ 0.1$, la primera componente explica $2.8/4 = 70\,\%$ de la varianza y las dos primeras $3.7/4 = 92.5\,\%$. Se podría trabajar con 2 componentes en lugar de 4 variables perdiendo poca información.`,
      },
      {
        type: 'intuition',
        title: 'PCA: un talle en lugar de tres medidas',
        text: t`**PCA: un talle en lugar de tres medidas.** Es una técnica distinta, que no mira la respuesta. Los talles de ropa son una "primera componente" casual: en vez de dar altura, peso y contorno por separado, el talle (S, M, L) resume en una sola dimensión lo que más varía entre las personas. Se pierde algo (dos personas del mismo talle pueden tener proporciones distintas), pero se conserva lo esencial con mucho menos información.`,
      },
      {
        type: 'paragraph',
        text: t`*Usos:* reducir dimensión, visualizar datos, eliminar colinealidad y alimentar otros modelos (regresión sobre componentes principales). *Advertencia:* se deben **estandarizar** las variables antes (si no, domina la de mayor escala), y como PCA **ignora $Y$**, las componentes con más varianza no tienen por qué ser las más útiles para predecir.`,
      },
    ],
  },
  {
    id: '6.5',
    moduleId: 6,
    title: 'Métodos de ensamble',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Por qué un árbol de decisión sobreajusta con facilidad?`,
            answer: t`Si se lo deja dividir hasta que cada hoja tenga un solo registro, memoriza el entrenamiento. Se controla limitando la profundidad, exigiendo un mínimo de registros por hoja o podando ramas. Lo viste en Módulo 4.3.`,
          },
          {
            question: t`¿Qué calculaba la distribución binomial?`,
            answer: t`La probabilidad de obtener $k$ éxitos en $n$ intentos independientes, cada uno con probabilidad $p$: $\binom{n}{k} p^k (1-p)^{n-k}$. Sirve para contar cuántos de varios modelos aciertan a la vez. Lo viste en Módulo 2.4.`,
          },
        ],
      },
      {
        type: 'paragraph',
        text: t`Un **ensamble** combina muchos modelos "débiles" para obtener uno fuerte. Los modelos base casi siempre son **árboles de decisión** (Módulo 4.3), que tienen la desventaja de ser **inestables**: un pequeño cambio en los datos puede cambiar mucho el árbol (alta varianza).`,
      },
      { type: 'miniCheck', questionIds: ['m6-q08'] },
      {
        type: 'paragraph',
        text: t`**Por qué promediar ayuda.** Si se promedian $B$ modelos, cada uno con varianza $\sigma^2$ y correlación $\rho$ entre sí, la varianza del promedio es:`,
      },
      { type: 'formula', latex: t`\rho\,\sigma^2 + \frac{1-\rho}{B}\,\sigma^2` },
      {
        type: 'paragraph',
        text: t`Si fueran independientes ($\rho=0$) la varianza caería a $\sigma^2/B$. Pero si están muy correlacionados, **promediar no ayuda**: el primer término queda. *Ejemplo:* $\sigma^2=4$, $B=100$. Con $\rho=0$, varianza $=0.04$. Con $\rho=0.5$, varianza $= 2 + 0.02 = 2.02$. **Hay que lograr modelos distintos entre sí.**`,
      },
      {
        type: 'extra',
        text: t`La sabiduría de las multitudes es el ejemplo clásico: en 1906, Francis Galton analizó las estimaciones que unas 800 personas hicieron en una feria sobre el peso de un buey; ninguna fue exacta, pero el promedio quedó a menos del 1 % del peso real. Funciona porque los errores individuales, si son independientes, se compensan. Si todos copiaran la respuesta del vecino (correlación alta), el promedio sería tan malo como cada uno.`,
      },
      {
        type: 'deepDive',
        title: t`El voto de mayoría: cuándo suma y cuándo resta`,
        text: t`La fórmula de arriba mira el promedio de números. Para clasificar, los árboles **votan**, y ahí se ve lo mismo contando.

**Cinco clasificadores independientes**, cada uno con 70 % de acierto, votan y gana la mayoría. El voto acierta cuando aciertan al menos 3 de los 5. Con la binomial:

$P(3) = 10 \times 0.7^3 \times 0.3^2 \approx 0.309$

$P(4) = 5 \times 0.7^4 \times 0.3 \approx 0.360$

$P(5) = 0.7^5 \approx 0.168$

En total, el comité acierta el **83.7 %**: bastante más que cualquiera de sus miembros. Los errores de cada uno caen en casos distintos, y casi siempre quedan en minoría.

**Si los cinco se copian**, aciertan y se equivocan juntos, y el voto acierta el 70 %: lo mismo que uno solo. Es el término $\rho\,\sigma^2$ de la fórmula, que no baja por más modelos que se agreguen.

**Y si cada uno es peor que tirar una moneda**, el voto empeora las cosas: con 45 % de acierto individual, el comité acierta el 40.7 %. Votar amplifica lo que hay. Por eso un ensamble necesita modelos **distintos entre sí y mejores que el azar**, aunque sea por poco.`,
        sources: [
          'Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 8.7 (bagging y la sabiduría de las multitudes) y cap. 15',
          'Kuncheva, *Combining Pattern Classifiers* (voto de mayoría)',
          'Cifras inventadas para el ejemplo',
        ],
      },
      { type: 'subheading', text: 'Bagging (Bootstrap Aggregation)' },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Generar $B$ muestras *bootstrap* (6.3).`,
          t`Entrenar un **árbol profundo** (poco sesgo, mucha varianza) en cada una.`,
          t`**Combinar:** promedio (regresión) o voto mayoritario (clasificación).`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Reduce la **varianza** sin aumentar apreciablemente el sesgo, a costa de perder la interpretabilidad de un único árbol.`,
      },
      {
        type: 'paragraph',
        text: t`**Estimación Out-Of-Bag (OOB).** Como cada árbol ve solo ~63 % de los datos, **el ~37 % restante son datos que ese árbol "no vio"**. Para cada observación se promedian las predicciones de los árboles que **no la usaron** y se compara con el valor real. El error OOB resultante es una **estimación honesta del error de prueba, sin necesidad de validación cruzada**.`,
      },
      { type: 'subheading', text: 'Bosques aleatorios (Random Forests)' },
      {
        type: 'paragraph',
        text: t`Mejoran el bagging **descorrelacionando** los árboles. En **cada división** de cada árbol, solo se considera un **subconjunto aleatorio de $m$ variables** de las $p$ disponibles (típicamente $m \approx \sqrt{p}$ para clasificación). Si $m = p$, es bagging.`,
      },
      {
        type: 'paragraph',
        text: t`*Por qué funciona:* si hay una variable muy fuerte, **todos** los árboles del bagging la usan arriba y se parecen mucho ($\rho$ alta, el promedio ayuda poco). Al prohibir esa variable en muchas divisiones, se **fuerza la diversidad**.`,
      },
      {
        type: 'analogy',
        text: t`**Metáfora del comité:** si en un panel de médicos hay un especialista muy dominante, todos los diagnósticos se parecerán. Si a cada médico se le permite consultar solo un grupo aleatorio de síntomas, las opiniones se diversifican y el voto del comité es más robusto.`,
      },
      {
        type: 'paragraph',
        text: t`Agregar más árboles **no causa sobreajuste**: la varianza se estabiliza.`,
      },
      {
        type: 'paragraph',
        text: t`**Dos fuentes de diversidad.** (1) **Bootstrap de las observaciones:** cada árbol se entrena con una muestra del entrenamiento hecha **con reemplazo**, así que algunos pasajeros aparecen más de una vez en una muestra y otros no aparecen. (2) **Variables aleatorias en cada nodo:** en cada división el árbol solo evalúa un subconjunto aleatorio de variables. Con ambas, los árboles se parecen menos entre sí y al promediarlos el modelo suele ser más robusto.`,
      },
      {
        type: 'paragraph',
        text: t`**Cómo se obtiene la predicción final.** Cada árbol entrega una **probabilidad**; el bosque **promedia esas probabilidades** y luego aplica un umbral. *Ejemplo de clase (5 árboles, para un hombre de 30 años en 3.ª clase):* probabilidades $0.125, 0.500, 0.333, 0.143$ y $0.000$; promedio $= 1.101/5 \approx 0.220$; con umbral $0.50$, $0.220 < 0.50$ y la predicción es "no sobrevive". En la práctica se usan muchos más árboles (por ejemplo, 100).`,
      },
      { type: 'miniCheck', questionIds: ['m6-q18'] },
      {
        type: 'paragraph',
        text: t`**Ajuste de hiperparámetros del bosque.** Hay hiperparámetros **del bosque** (n_estimators: cantidad de árboles; max_features: cuántas variables se evalúan en cada nodo; bootstrap: si cada árbol usa una muestra con reemplazo) e hiperparámetros **de cada árbol** (max_depth, min_samples_split, min_samples_leaf). Para elegir la combinación: (1) se define una **grilla** de valores; (2) se prueban las combinaciones solo sobre el entrenamiento; (3) se usa **validación cruzada estratificada** (por ejemplo, 3 folds); (4) se elige la de mayor AUC promedio; y (5) se reentrena con todo el entrenamiento y recién entonces se evalúa en la prueba. *Ejemplo de clase (Titanic):* la mejor combinación fue n_estimators=100, max_features=1, max_depth=None, min_samples_split=2, min_samples_leaf=5 y bootstrap=True, con AUC promedio de validación cruzada de $0.861$. **No se busca el bosque más grande, sino la combinación que mejor generaliza.**`,
      },
      {
        type: 'paragraph',
        text: t`**Comparación final (ejemplo de clase, Titanic, prueba).** Con la misma partición y las mismas variables (sexo, edad imputada y clase), los tres modelos dieron: regresión logística, AUC $0.838$, accuracy $0.780$, precisión $0.700$, recall $0.748$; árbol de decisión (max_depth=None, min_samples_leaf=5), AUC $0.837$, accuracy $0.813$, precisión $0.752$, recall $0.767$; bosque aleatorio, AUC $0.856$, accuracy $0.802$, precisión $0.755$, recall $0.718$. **Si se prioriza el AUC, el mejor fue el bosque; si se miran accuracy y recall, el árbol tuvo los valores más altos:** el "mejor" modelo depende de la métrica elegida.`,
      },
      { type: 'subheading', text: 'Explicabilidad frente a capacidad predictiva' },
      {
        type: 'paragraph',
        text: t`Al elegir una técnica hay que equilibrar dos fuerzas contrapuestas: **explicabilidad** (poder decir *por qué* el modelo decidió algo) y **capacidad predictiva**. Con los tres modelos de la comparación anterior:`,
      },
      {
        type: 'list',
        items: [
          t`**Regresión logística** (modelo "blanco"): es transparente. Entrega una ecuación con coeficientes interpretables (*odds ratios*, Módulo 5.2) y permite inferencia formal (p-valores, intervalos de confianza).`,
          t`**Árbol de decisión**: si se mantiene pequeño (profundidad de hasta 3), se puede seguir el camino gráfico de la decisión y presentarlo a directivos o reguladores.`,
          t`**Bosque aleatorio** ("caja negra"): es un enjambre de cientos de árboles promediados. Suele predecir mejor con grandes volúmenes de datos, pero **no hay una ecuación única ni un gráfico sencillo** que explique por qué se clasificó a un cliente de cierta manera.`,
        ],
      },
      {
        type: 'analogy',
        text: t`**Analogía de la receta y el comité:** la regresión logística es una receta con cantidades exactas: puedes explicar cada ingrediente. El árbol chico es un diagrama de flujo que se sigue con el dedo. El bosque es un comité de cien médicos que vota: acierta más, pero nadie puede resumir en una frase por qué votó así el comité.`,
      },
      {
        type: 'intuition',
        title: 'Qué se gana y qué se pierde al elegir un bosque',
        text: t`**Qué se gana y qué se pierde.** Más potencia para predecir se paga con menos capacidad de explicar. Si un banco te rechaza un crédito, tiene que poder decirte por qué. Con una regresión logística, señala los coeficientes. Con un árbol chico, muestra el camino de preguntas. Con un bosque, no puede mostrar los cálculos de 500 árboles. En el ejemplo del Titanic, el bosque ganó en AUC ($0.856$), pero la regresión logística quedó muy cerca ($0.838$) y se puede explicar de punta a punta: a veces esa diferencia no compensa perder la explicación.`,
      },
      {
        type: 'paragraph',
        text: t`**SHAP.** En sectores muy regulados (banca, seguros, salud) hay que justificar, por ejemplo, por qué se rechazó un crédito. Como no se puede mostrar el cálculo de 500 árboles, se usan herramientas de explicabilidad válidas para cualquier modelo, como **SHAP** (*SHapley Additive exPlanations*): analizan cómo cambia la predicción al alterar las variables de un individuo, para medir qué variables aportaron más a su decisión.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q20'] },
      {
        type: 'paragraph',
        text: t`**Deriva de datos y de concepto (*drift*).** Los modelos basados en árboles afinan patrones muy finos; si la realidad cambia, su rendimiento puede deteriorarse rápido (la regresión logística suele ser más estable en el tiempo). Hay dos tipos de cambio:`,
      },
      {
        type: 'list',
        items: [
          t`**Deriva de datos** (*data drift*): cambia la distribución de las variables de entrada (por ejemplo, los clientes pasan de comprar por la web a comprar por la aplicación móvil).`,
          t`**Deriva de concepto** (*concept drift*): cambia la relación entre las variables y la respuesta (por ejemplo, tras una crisis económica, un nivel de ingresos que antes era seguro pasa a ser de alto riesgo).`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Por eso, en empresas de gran escala (bancos, tarjetas de crédito, plataformas de comercio electrónico) estos modelos se **monitorean** y se **reentrenan periódicamente** (en la clase se mencionó cada 6 a 12 meses).`,
      },
      {
        type: 'intuition',
        title: 'El mapa que envejece',
        text: t`**El mapa que envejece.** Un modelo es como un mapa de la ciudad dibujado con datos de hace años. En la **deriva de datos** cambió quién usa la ciudad: llega gente que antes no venía, o por otro medio (de la web a la app). En la **deriva de concepto** cambiaron las calles: lo que antes era un buen indicio ya no lo es (un ingreso que era seguro ahora es de riesgo). En los dos casos el mapa viejo guía mal, y por eso se vigila el rendimiento y se vuelve a dibujar cada tanto.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q21'] },
      { type: 'subheading', text: 'Boosting' },
      {
        type: 'paragraph',
        text: t`A diferencia del bagging (árboles independientes en paralelo), el **boosting** entrena árboles **en secuencia**, cada uno **corrigiendo los errores del anterior**:`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Empezar con una predicción inicial y calcular los **residuos** (lo que falta explicar).`,
          t`Ajustar un **árbol pequeño** (poco profundo, un "aprendiz débil") a esos residuos.`,
          t`Sumar ese árbol al modelo, multiplicado por una **tasa de aprendizaje $\lambda$** pequeña (0.01-0.1).`,
          t`Recalcular los residuos y repetir $B$ veces.`,
        ],
      },
      { type: 'paragraph', text: t`El modelo final es la suma de todos los árboles pequeños. Aprende **despacio** a propósito.` },
      {
        type: 'paragraph',
        text: t`*Caricatura numérica:* si $y=100$, la predicción inicial es $0$, cada árbol predice justo el residuo actual y $\lambda=0.1$: tras un paso el residuo es $100\times0.9 = 90$, tras tres pasos $100 \times 0.9^3 = 72.9$, tras 50 pasos casi $0.5$. Avanza por pasos pequeños en lugar de saltar al valor final.`,
      },
      {
        type: 'intuition',
        title: 'Boosting: el simulacro de examen',
        text: t`**Boosting: el simulacro de examen.** Tras cada simulacro revisás solo lo que fallaste y estudiás eso, sin repasar lo que ya sabías. Cada ronda corrige los errores de la anterior, y el conocimiento final es la suma de todas esas correcciones pequeñas.`,
      },
      {
        type: 'paragraph',
        text: t`Hiperparámetros: número de árboles $B$ (aquí **sí** puede haber sobreajuste si es excesivo), $\lambda$ y la profundidad de cada árbol.`,
      },
      {
        type: 'list',
        items: [
          t`**AdaBoost** (clasificación): da **más peso a las observaciones mal clasificadas** en cada ronda, de modo que el siguiente aprendiz se concentre en lo difícil. El resultado final es un voto **ponderado** (los aprendices más precisos pesan más).`,
          t`**Gradient Boosting**: generaliza la idea a cualquier **función de pérdida** (una función que mide el costo de un error: el error cuadrático en regresión, la log-verosimilitud negativa en el logit). Cada árbol se ajusta al **gradiente negativo** de la pérdida (Módulo 0.4: la dirección de máximo descenso). Con pérdida cuadrática, ese gradiente negativo es justamente el **residuo**, por lo que es una **generalización del procedimiento anterior**.`,
          t`**BART** (*Bayesian Additive Regression Trees*): suma de muchos árboles pequeños, pero con un enfoque **bayesiano**: cada árbol se actualiza aleatoriamente de forma repetida (mediante **MCMC**, un algoritmo que genera muestras de una distribución de probabilidad compleja dando pasos aleatorios, donde cada paso depende solo del anterior) con una distribución a priori que mantiene los árboles pequeños. El resultado es una **distribución** de predicciones, lo que permite cuantificar la **incertidumbre**.`,
        ],
      },
      {
        type: 'table',
        headers: ['', 'Bagging / Random Forest', 'Boosting'],
        rows: [
          ['Entrenamiento', 'Paralelo, árboles independientes', 'Secuencial, cada árbol corrige al anterior'],
          ['Árboles', 'Profundos', 'Pequeños'],
          ['Reduce principalmente', '**Varianza**', 'Sesgo (y también varianza)'],
          ['Riesgo de sobreajuste con más árboles', 'No', '**Sí**'],
          ['Sensibilidad a los hiperparámetros', 'Baja', 'Alta'],
        ],
      },
    ],
  },
  {
    id: '6.6',
    moduleId: 6,
    title: 'Máquinas de Vectores de Soporte (SVM)',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué era un hiperplano?`,
            answer: t`La frontera $w \cdot x + b = 0$: una recta en el plano, un plano en el espacio. El signo de $w \cdot x + b$ dice de qué lado cae cada punto, y $w \cdot x$ es un producto interno: multiplicar posición por posición y sumar. Lo viste en Módulo 0.3.`,
          },
          {
            question: t`¿Qué hacía el parámetro C en la regresión logística de scikit-learn?`,
            answer: t`Era el inverso de la fuerza de la regularización: C chico, modelo más moderado. En las SVM de *scikit-learn* se mantiene esa convención, que es la opuesta a la del libro. Lo viste en Módulo 5.2.`,
          },
        ],
      },
      { type: 'paragraph', text: t`Las SVM son clasificadores que buscan **la mejor frontera lineal** entre dos clases.` },
      {
        type: 'paragraph',
        text: t`**Hiperplano separador** (Módulo 0.3): una recta en 2D (o un plano en 3D) $w_1x_1 + w_2x_2 + b = 0$ que parte el espacio. Un punto cae de un lado u otro según el signo de $w \cdot x + b$.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q12'] },
      {
        type: 'paragraph',
        text: t`**Clasificador de margen máximo.** Si las clases son **separables** con una recta, hay infinitas rectas posibles. Se elige la que **maximiza el margen**: la distancia entre la frontera y los puntos más cercanos de cada clase. Esos puntos más cercanos son los **vectores de soporte**: **solo ellos definen la frontera**, y eliminar cualquier otro punto no la cambiaría.`,
      },
      {
        type: 'intuition',
        title: 'El pasillo más ancho entre dos cursos',
        text: t`**La mejor frontera es la que deja más espacio.** Imaginá un salón con alumnos de dos cursos que deben quedar en lados opuestos. En vez de trazar el pasillo en cualquier lugar, buscás el pasillo **más ancho posible** entre los dos grupos. Los alumnos que quedan pegados al borde del pasillo son los **vectores de soporte**: si alguien del fondo se cambia de silla, el pasillo no se mueve; si se mueve uno de los pegados al borde, sí.`,
      },
      {
        type: 'paragraph',
        text: t`**Margen blando (*support vector classifier*).** Con clases que se solapan no existe una recta perfecta. Se permite que algunos puntos queden **dentro del margen o del lado equivocado**, midiendo cuánto se pasan con **variables de holgura** $\xi_i$ y controlando la tolerancia con un hiperparámetro:`,
      },
      {
        type: 'list',
        items: [
          t`Más tolerancia: margen ancho, más puntos "violan", **mayor sesgo y menor varianza**.`,
          t`Menos tolerancia: margen angosto, ajuste ceñido a los datos, **menor sesgo y mayor varianza**.`,
        ],
      },
      {
        type: 'callout',
        kind: 'cuidado',
        text: t`con la notación del parámetro $C$. En el libro *An Introduction to Statistical Learning* $C$ es un "presupuesto" de violaciones (**más $C$ = más tolerancia**). En muchas librerías (por ejemplo, scikit-learn) $C$ es el **peso de la penalización** de las violaciones (**más $C$ = menos tolerancia**). Son opuestos: verifica siempre la definición de tu herramienta.`,
      },
      {
        type: 'paragraph',
        text: t`**El truco del kernel (*kernel trick*).** Para fronteras **no lineales**, se transforman los datos a un espacio de **mayor dimensión** donde sí sean separables linealmente.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo en 1D:* la clase $+$ en $x = -3$ y $x = 3$, y la clase $-$ en $x=-1,\,0,\,1$. No existe un único umbral que las separe. Pero si agregamos la variable $x^2$, los puntos pasan a ser $+$: $(-3, 9)$ y $(3, 9)$; $-$: $(-1, 1)$, $(0, 0)$, $(1, 1)$, y la **recta horizontal** $x^2 = 5$ las separa.`,
      },
      {
        type: 'intuition',
        title: 'El truco de mirar desde otra altura: el kernel',
        text: t`**El truco de mirar desde otra altura.** Imaginá una pista circular de patinaje con los buenos en el centro y los novatos en un anillo alrededor. Ninguna recta los separa sobre el mapa. Pero si, en vez de la posición, usás la **distancia al centro** de la pista, los dos grupos quedan de un lado y del otro de un umbral. Eso es el truco del *kernel*: cambiar la forma de mirar los datos para que una frontera recta sirva.`,
      },
      {
        type: 'paragraph',
        text: t`Lo notable: el algoritmo de la SVM solo necesita **productos internos** entre pares de puntos (Módulo 0.3). Una **función kernel** $K(x, x')$ calcula directamente el producto interno que habría en el espacio ampliado, **sin construir esas nuevas variables**, lo que lo hace eficiente incluso con espacios de dimensión enorme. El **Teorema de Mercer** da la condición para que una función $K$ sea un kernel válido (que corresponda a un producto interno en algún espacio).`,
      },
      {
        type: 'list',
        items: [
          t`**Kernel polinómico**: $K(x,x') = (1 + \langle x, x' \rangle)^d$. El grado $d$ controla la flexibilidad.`,
          t`**Kernel radial (RBF)**: $K(x,x') = \exp(-\gamma\,\lVert x-x'\rVert^2)$. Mide **similitud local**: vale 1 si los puntos coinciden y decae hacia 0 al alejarse. Con $\gamma$ **grande**, la influencia de cada punto es muy local y la frontera se vuelve muy irregular (**sobreajuste**); con $\gamma$ **pequeño**, la frontera es suave.`,
        ],
      },
      {
        type: 'deepDive',
        title: t`El truco del kernel con números`,
        text: t`**El producto interno sin construir las variables.** En el plano, tomá la transformación que arma todos los productos de grado 2: $\varphi(x_1, x_2) = (x_1^2,\ \sqrt{2}\,x_1x_2,\ x_2^2)$. Para $x = (1, 2)$ y $z = (3, 1)$:

**Por el camino largo**, $\varphi(x) = (1,\ 2\sqrt{2},\ 4)$ y $\varphi(z) = (9,\ 3\sqrt{2},\ 1)$. Su producto interno es $9 + 12 + 4 = 25$.

**Por el atajo**, $x \cdot z = 3 + 2 = 5$, y $5^2 = 25$. Lo mismo, sin pasar por el espacio de tres dimensiones.

Pasa siempre: $(x \cdot z)^2 = \varphi(x) \cdot \varphi(z)$ (es el kernel polinómico de la lista, sin el $1$). Con 100 variables y grado 2, el espacio ampliado tendría 5050 coordenadas, pero el atajo sigue siendo un producto interno de 100 términos y un cuadrado. Como la SVM solo usa productos internos, nunca necesita las coordenadas nuevas.

**La escala del kernel radial.** Para dos puntos a distancia 1, $K = e^{-\gamma}$. Con $\gamma = 1$, $K = e^{-1} \approx 0.368$: todavía se "ven" bastante. Con $\gamma = 10$, $K = e^{-10} \approx 0.00005$: para el kernel ya casi no tienen nada que ver. Por eso un $\gamma$ grande deja que cada punto influya solo en su vecindad inmediata, y la frontera se arruga alrededor de cada uno.`,
        sources: [
          'Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 12.3 (SVM y kernels)',
          'Schölkopf y Smola, *Learning with Kernels*, cap. 2',
          'Cifras inventadas para el ejemplo',
        ],
      },
      {
        type: 'paragraph',
        text: t`Para más de dos clases, se combinan varias SVM binarias (una contra todas, o una contra una). Los hiperparámetros ($C$, $\gamma$, $d$) se eligen por validación cruzada.`,
      },
    ],
  },
  {
    id: '6.7',
    moduleId: 6,
    title: 'Agrupamiento no supervisado: K-Means y clustering jerárquico',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué valor minimiza la suma de los cuadrados de las distancias a unos datos?`,
            answer: t`El promedio; con valor absoluto, en cambio, gana la mediana. Por eso el centro de cada grupo de esta sección es un promedio. Lo viste en Módulo 0.4.`,
          },
          {
            question: t`¿Por qué hay que escalar antes de agrupar?`,
            answer: t`Porque la distancia euclídea suma diferencias en las unidades de cada variable: un ingreso en pesos aplasta a una edad en años. Elegir cómo escalar es elegir qué significa "parecerse". Lo viste en Módulo 4.5.`,
          },
          {
            question: t`¿Qué le pasa al promedio con un valor atípico, y qué le pasa a la mediana?`,
            answer: t`El promedio se desplaza hacia el valor extremo; la mediana, que es el valor del medio, casi no se mueve. Por eso la mediana es más robusta. Lo viste en Módulo 2.2.`,
          },
        ],
      },
      { type: 'paragraph', text: 'Complementa el agrupamiento por densidad del Módulo 4.5.' },
      { type: 'subheading', text: 'K-Means' },
      {
        type: 'paragraph',
        text: t`Divide los datos en **$K$ grupos** (con $K$ fijado de antemano). Cada grupo se representa por su **centroide** (el promedio de sus puntos). **Algoritmo:**`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Elegir $K$ centroides iniciales (al azar).`,
          t`**Asignar** cada punto al centroide más cercano.`,
          t`**Recalcular** cada centroide como el promedio de sus puntos.`,
          t`Repetir 2 y 3 hasta que las asignaciones dejen de cambiar.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Busca minimizar la **suma de errores al cuadrado (SSE)**: la suma de los cuadrados de las distancias de cada punto a su centroide. (Recuerda el Módulo 0.4: **el promedio es el valor que minimiza la suma de cuadrados**, por eso el paso 3 usa el promedio.)`,
      },
      {
        type: 'intuition',
        title: 'K-Means: ubicar estaciones de servicio',
        text: t`**K-Means: ubicar estaciones de servicio.** Elegís cuántos grupos querés ($K$) y ubicás $K$ "estaciones" (centroides) en la ciudad de datos. Cada conductor va a la más cercana. Después movés cada estación al centro de los conductores que la usan, y repetís hasta que nadie cambie de estación.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo en 1D, $K=2$:* puntos $1, 2, 4, 10, 11, 13$, con centroides iniciales $1$ y $10$.`,
      },
      {
        type: 'list',
        items: [
          t`Asignación: $\{1,2,4\}$ al primero y $\{10,11,13\}$ al segundo.`,
          t`Nuevos centroides: $7/3 \approx 2.33$ y $34/3 \approx 11.33$.`,
          t`Se reasigna: nada cambia, el algoritmo termina. $\text{SSE} \approx 4.67 + 4.67 = 9.33$.`,
        ],
      },
      { type: 'simulation', simulationId: 'IN-58' },
      {
        type: 'paragraph',
        text: t`*Analogía:* ubicar $K$ estaciones de servicio en una ciudad para minimizar la distancia promedio que recorre cada conductor hasta la más cercana.`,
      },
      {
        type: 'paragraph',
        text: t`**Limitaciones:** hay que **elegir $K$** (el SSE siempre baja al aumentar $K$, así que no sirve minimizarlo; se usa el **método del codo**: graficar el SSE contra $K$ y buscar donde la mejora se aplana); el resultado depende de la **inicialización** (se prueban varios arranques y se elige el mejor); asume grupos **compactos y redondeados**; es sensible a **valores atípicos** y a la **escala** de las variables (estandarizar primero).`,
      },
      {
        type: 'deepDive',
        title: t`Por qué K-Means siempre baja la SSE, y aun así puede quedarse en un mal lugar`,
        text: t`**Cada paso solo puede bajar la SSE.** Al **asignar**, cada punto se va al centroide más cercano: su distancia al cuadrado no puede subir. Al **recentrar**, cada centroide pasa al promedio de su grupo, y el promedio es el valor que hace mínima la suma de cuadrados: tampoco puede subir. En el ejemplo de la guía, con los centroides iniciales en $1$ y $10$, la SSE de la primera asignación es $(0 + 1 + 9) + (0 + 1 + 9) = 20$; al mover los centroides a $2.33$ y $11.33$ baja a $9.33$, y ahí se detiene.

**Pero baja hasta el valle más cercano, no hasta el más profundo.** Tomá cuatro puntos en las esquinas de un rectángulo ancho y bajo, $(0, 0)$, $(10, 0)$, $(0, 1)$ y $(10, 1)$, con $K = 2$. Los grupos naturales son "izquierda" y "derecha", con SSE $= 4 \times 0.5^2 = 1$.

Si los centroides arrancan en $(0, 0)$ y $(0, 1)$, el punto $(10, 0)$ está a distancia al cuadrado $100$ del primero y $101$ del segundo, así que se va con el primero. Quedan los grupos "abajo" y "arriba", con centroides $(5, 0)$ y $(5, 1)$. Cada punto está a $25$ de su centroide y a $26$ del otro: nadie cambia, y el algoritmo termina con SSE $= 4 \times 25 = 100$, **cien veces peor** que la solución natural.

El algoritmo no tiene cómo salir de ahí: con esos centroides nadie quiere cambiar de grupo, y sin cambios los centroides no se mueven. Por eso se prueban varios arranques y se elige el de menor SSE.`,
        sources: [
          'Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 14.3.6 (K-medias)',
          'Lloyd (1982), "Least squares quantization in PCM", *IEEE Transactions on Information Theory*',
          'Cifras inventadas para el ejemplo',
        ],
      },
      {
        type: 'extra',
        text: t`Una verdulería quiere agrupar a sus clientes por cuánto gastan al mes y con qué frecuencia vienen. Con $K=3$ podría encontrar un grupo de "compradores grandes y frecuentes", otro de "ocasionales de poco gasto" y otro intermedio, y los centroides serían el gasto y la frecuencia promedio de cada grupo. Si el gasto está en pesos y la frecuencia en visitas por mes, hay que estandarizar antes: si no, el gasto (miles) dominaría las distancias.`,
      },
      { type: 'subheading', text: 'Otras distancias' },
      { type: 'paragraph', text: t`Además de la euclídea, en dos puntos $(x_1,y_1)$ y $(x_2,y_2)$:` },
      {
        type: 'list',
        items: [
          t`**Manhattan** (*city block*): $|x_2-x_1| + |y_2-y_1|$. Es el recorrido por las calles de una cuadrícula.`,
          t`**Chebyshev**: $\max(|x_2-x_1|, |y_2-y_1|)$. Cuenta solo la mayor diferencia en una dimensión.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* entre $(1,2)$ y $(4,6)$: euclídea $5$, Manhattan $3+4=7$, Chebyshev $\max(3,4)=4$.`,
      },
      {
        type: 'intuition',
        title: 'Tres formas de medir el camino',
        text: t`**Tres formas de medir el camino.** La euclídea es la distancia en línea recta, como vuela un pájaro. Manhattan es la que camina una persona por las manzanas de una ciudad: solo puede ir en horizontal y en vertical, y suma los tramos. Chebyshev se queda con el tramo más largo, como el rey de ajedrez, que se mueve una casilla en cualquier dirección y llega en tantos pasos como la mayor diferencia entre columnas o filas. Con los puntos $(1,2)$ y $(4,6)$ dan $5$, $7$ y $4$.`,
      },
      { type: 'subheading', text: 'Variantes robustas: K-Medianas y K-Medoides (PAM)' },
      {
        type: 'paragraph',
        text: t`Como el centroide de K-Means es un **promedio**, un solo valor extremo lo arrastra (un cliente multimillonario entre ingresos medios). Dos variantes lo evitan:`,
      },
      {
        type: 'list',
        items: [
          t`**K-Medianas:** el centro es la **mediana** de cada variable y se usa la distancia Manhattan. Un atípico apenas lo mueve.`,
          t`**K-Medoides (PAM):** el centro debe ser un **dato real** de la muestra, el **medoide**. Permite presentar a un cliente concreto como representante del grupo y admite cualquier distancia (por ejemplo, coseno).`,
        ],
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* en el grupo $\{1,2,3,4,100\}$ la media es $22$ (no se parece a ningún miembro), mientras que la mediana y el medoide valen $3$.`,
      },
      {
        type: 'intuition',
        title: 'Promedio, mediana y representante real',
        text: t`**Promedio, mediana y representante real.** Si en una sala hay cuatro personas con ingresos normales y entra un billonario, el ingreso *promedio* de la sala se dispara y ya no describe a nadie. La *mediana* (la persona del medio) casi no se mueve. Y el *medoide* va un paso más allá: elige a una persona concreta de la sala como la representante del grupo. Con $\{1,2,3,4,100\}$ el promedio es $22$, pero la mediana y el medoide son $3$.`,
      },
      {
        type: 'table',
        headers: ['', 'K-Means', 'K-Medianas', 'K-Medoides (PAM)'],
        rows: [
          ['Centro', 'promedio (punto abstracto)', 'mediana (punto abstracto)', 'dato real'],
          ['Distancia', 'euclídea', 'Manhattan', 'cualquiera'],
          ['Sensibilidad a atípicos', 'alta', 'baja', 'muy baja'],
          ['Costo', t`$O(nKp)$ por iteración`, t`$O(nKp)$ por iteración`, t`$O(K(n-K)^2)$`],
          ['Escala a bases grandes', 'muy bien', 'bien', 'mal'],
        ],
      },
      {
        type: 'paragraph',
        text: t`El costo de PAM viene de que necesita la **matriz de distancias entre todos los pares** de puntos: con $10.000$ filas son $10^8$ distancias, y la memoria se agota mucho antes de llegar a bases grandes. Con $n$ grande hace falta submuestrear antes.`,
      },
      {
        type: 'deepDive',
        title: t`Por qué K-Medianas usa la mediana: cada centro minimiza una pérdida distinta`,
        text: t`**El promedio hace mínima la suma de cuadrados; la mediana, la suma de valores absolutos.** Tomá el grupo $\{1,2,3,4,100\}$, con promedio $22$ y mediana $3$.

Alrededor del promedio, la suma de cuadrados es $441 + 400 + 361 + 324 + 6084 = 7610$; alrededor de la mediana, $4 + 1 + 0 + 1 + 9409 = 9415$. Con cuadrados gana el promedio. Alrededor del promedio, la suma de distancias absolutas es $21 + 20 + 19 + 18 + 78 = 156$; alrededor de la mediana, $2 + 1 + 0 + 1 + 97 = 101$. Con valores absolutos gana la mediana.

**Elevar al cuadrado le da una voz enorme al atípico.** Del total de $9415$ cuadrados alrededor de la mediana, $9409$ los pone el punto $100$ solo. Al minimizar cuadrados (K-Means) el centro se corre hacia ese punto para achicar su aporte; al minimizar distancias absolutas (K-Medianas, con la distancia Manhattan) el punto pesa $97$ de $101$ y el centro no necesita moverse.`,
        sources: [
          'Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 14.3 (K-medias y K-medoides)',
          'Kaufman y Rousseeuw, *Finding Groups in Data* (1990), cap. 2 (el algoritmo PAM)',
          'Cifras inventadas para el ejemplo',
        ],
      },
      { type: 'miniCheck', questionIds: ['m6-q27'] },
      {
        type: 'paragraph',
        text: t`**Muchas columnas.** Con decenas o cientos de variables, las distancias entre puntos se vuelven casi iguales (maldición de la dimensionalidad, Módulo 4). La práctica habitual es **reducir primero** con PCA (continuas), ACM (categóricas) o FAMD (mixtas) y luego aplicar K-Means sobre los primeros ejes.`,
      },
      {
        type: 'extra',
        text: t`Una cadena de kioscos quiere elegir tres locales "modelo" para mostrar a un nuevo franquiciado. Con K-Means obtendría tres perfiles promedio que no coinciden con ningún local real (por ejemplo, "34,5 empleados y facturación de \$43.210"). Con K-Medoides cada grupo queda representado por un kiosco que existe, y se puede visitar. Pero si la cadena tuviera cientos de miles de locales, calcular las distancias entre todos los pares sería inviable, y haría falta tomar una muestra primero.`,
      },
      { type: 'subheading', text: 'Clustering jerárquico y dendrogramas' },
      { type: 'paragraph', text: t`No exige fijar $K$ de antemano. En la versión **aglomerativa**:` },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Cada punto empieza como su propio grupo.`,
          t`Se **fusionan** los dos grupos más cercanos.`,
          t`Se repite hasta quedar un único grupo.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`El historial de fusiones se dibuja como un **dendrograma** (árbol). **Cortando** el dendrograma a cierta altura se obtiene el número de grupos que se desee.`,
      },
      {
        type: 'paragraph',
        text: t`Falta definir qué es "distancia entre grupos". Es el criterio de **enlace (*linkage*)**:`,
      },
      {
        type: 'list',
        items: [
          t`**Simple (*single*)**: distancia **mínima** entre puntos de ambos grupos. Tiende a formar grupos alargados en "cadena".`,
          t`**Completo (*complete*)**: distancia **máxima**. Forma grupos compactos.`,
          t`**Promedio (*average*)**: promedio de **todas** las distancias entre pares.`,
          t`**Ward**: fusiona los grupos cuya unión **aumenta menos la varianza interna total**.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo con los mismos puntos:* tras fusionar $\{1,2,4\}$ y $\{10,11,13\}$, la distancia entre ambos grupos es **6** con enlace simple ($10-4$), **12** con enlace completo ($13-1$) y **9** con enlace promedio (promedio de las 9 distancias entre pares). La elección del enlace puede cambiar el resultado.`,
      },
      {
        type: 'extra',
        text: t`Un dendrograma se parece a un árbol genealógico o a la clasificación de los seres vivos: primero se juntan los individuos más parecidos (dos gatos domésticos), luego esos grupos se unen con otros cercanos (felinos), y así hasta que todo queda en un solo árbol. Elegir dónde cortar es elegir cuántos grupos quieres: un corte bajo da muchos grupos muy parecidos por dentro; uno alto, pocos grupos amplios.`,
      },
    ],
  },
  {
    id: '6.8',
    moduleId: 6,
    title: 'PCA en profundidad y análisis de correspondencias',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué medían la covarianza y la correlación?`,
            answer: t`La covarianza dice si dos variables suben y bajan juntas, pero depende de las unidades; la correlación la divide por las dos desviaciones típicas y queda entre $-1$ y $1$. Lo viste en Módulo 0.3.`,
          },
          {
            question: t`¿Qué era el puntaje $z$?`,
            answer: t`Cuántas desviaciones típicas se aleja un valor de la media: $z = (x - \mu)/\sigma$. Estandarizar todas las variables así es lo que hace el PCA con la matriz de correlación. Lo viste en Módulo 2.4.`,
          },
          {
            question: t`¿Por qué la colinealidad vuelve inestables los coeficientes?`,
            answer: t`Si dos variables casi se repiten, hay muchos repartos del efecto entre ellas que predicen casi igual, y un cambio chico en los datos hace saltar de un reparto a otro. Lo viste en Módulo 0.3.`,
          },
          {
            question: t`¿Qué comprueba la prueba de $\chi^2$ sobre una tabla de contingencia?`,
            answer: t`Si las dos variables categóricas están asociadas o si las diferencias entre celdas podrían ser puro azar. Es el control previo a cualquier mapa de correspondencias. Lo viste en Módulo 2.4.`,
          },
        ],
      },
      {
        type: 'paragraph',
        text: t`Amplía el PCA del Módulo 6.4 con lo trabajado en la clase de aprendizaje no supervisado: por qué hace falta, cómo se interpreta, cuántos componentes conservar y qué hacer cuando las variables son categóricas.`,
      },
      { type: 'subheading', text: 'Por qué hace falta: variabilidad y multicolinealidad' },
      {
        type: 'paragraph',
        text: t`En la clase se mostró, con un archivo de departamentos (se quería explicar el precio), qué pasa cuando las columnas no aportan información, en cuatro pasos:`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**Columnas constantes.** Si todos los departamentos tienen 10 años de antigüedad y el mismo código de tipo (99), el modelo da $R^2 = 0$, pendiente cero y se reduce al promedio del precio. **Sin variabilidad no hay información:** una columna que no cambia (varianza $=0$) no distingue entre observaciones.`,
          t`**Constante más variable.** Al sumar la superficie en $m^2$ (que sí varía) a la antigüedad constante, $R^2 = 0.69$ y la antigüedad recibe coeficiente cero: agregarla es peso muerto.`,
          t`**Variables idénticas.** Con dos predictoras iguales ($X_1 = X_2$) hay dependencia lineal perfecta: no se puede invertir la matriz y el programa anula una de las dos (coeficiente $0$).`,
          t`**Variables casi iguales.** Con la superficie real y la superficie redondeada, $R^2 = 0.70$, pero la ecuación fue $\text{Precio} = 1741 - 150\times\text{Superficie real} + 152\times\text{Superficie redondeada}$: dice a la vez que más superficie *baja* el precio y que lo *sube*.`,
        ],
      },
      {
        type: 'analogy',
        text: t`**Analogía del velocímetro trabado:** evaluar el rendimiento de un auto con un velocímetro clavado en 60 km/h, esté frenado en un semáforo o a fondo en la pista, no aporta ningún dato: lo que no cambia no informa.`,
      },
      {
        type: 'paragraph',
        text: t`Esto es la **multicolinealidad** (Módulo 3; el VIF del Módulo 5.2 la mide). Los coeficientes se vuelven **inestables** (mover un solo dato puede cambiarles el signo), se pierde la capacidad de explicar ("¿esta variable ayuda o perjudica?") y, con 100 o 500 columnas, no se detecta mirando correlaciones de a pares, porque una columna puede ser combinación de otras tres o cuatro a la vez. El PCA ataca justamente este problema: reemplaza las columnas redundantes por pocas variables nuevas que no están correlacionadas.`,
      },
      {
        type: 'intuition',
        title: 'Dos termómetros pegados',
        text: t`**Dos termómetros pegados.** Si colgás dos termómetros casi idénticos en la misma pared y le pedís al modelo cuánto de la temperatura de la habitación se debe a cada uno, no tiene cómo repartirlo: puede decir "+152 el primero y −150 el segundo" y el resultado total sigue dando bien. La predicción puede ser buena, pero los coeficientes individuales no significan nada. Y una columna que no cambia nunca (el velocímetro clavado) no ayuda a distinguir un caso de otro.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q24'] },
      { type: 'subheading', text: 'De la dimensión observada a la dimensión verdadera' },
      {
        type: 'paragraph',
        text: t`En datos reales se observan muchas columnas (500 en una aseguradora, 5000 en genética), pero muchas miden aspectos repetidos del mismo fenómeno. La **dimensión verdadera** (o latente) es el número reducido de ejes independientes que realmente gobiernan la variación. En muchos problemas prácticos, pasar de 500 variables a 10 o 20 componentes conserva más del 75-80 % de la información útil.`,
      },
      {
        type: 'intuition',
        title: 'Muchas columnas, pocas ideas',
        text: t`**Muchas columnas, pocas ideas.** En una tabla de una aseguradora, "edad del conductor", "años de carnet" y "antigüedad como cliente" dicen casi lo mismo con palabras distintas. Detrás de cientos de columnas suele haber unas pocas ideas de fondo (la experiencia del conductor, el valor del auto...). Esas ideas de fondo son la dimensión verdadera, y el PCA las busca.`,
      },
      { type: 'paragraph', text: '*Historia breve:*' },
      {
        type: 'list',
        items: [
          t`**Karl Pearson (1901):** primera versión, geométrica, buscando rectas y planos de mejor ajuste.`,
          t`**Charles Spearman (1904):** Análisis Factorial (AF), en psicología. Diferencia clave: el PCA busca explicar la **varianza total**; el AF, solo la **varianza compartida** (comunalidad) mediante factores latentes no observados.`,
          t`**Harold Hotelling (1933):** formulación matricial moderna, con valores y vectores propios; los componentes resultan ortogonales (no correlacionados).`,
        ],
      },
      {
        type: 'paragraph',
        text: t`**Intuición geométrica.** Una nube de puntos con variables muy correlacionadas no es redonda como una pelota de fútbol: está alargada en diagonal, como una pelota de rugby.`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`El **primer componente** ($CP_1$) es la recta que atraviesa la nube a lo largo de su lado más largo: la dirección de máxima varianza.`,
          t`El **segundo componente** ($CP_2$) es un eje a $90^\circ$ del primero (ortogonal), que captura la mayor variabilidad restante.`,
          t`En lugar de describir los puntos con los ejes originales (correlacionados), el PCA **rota el sistema de coordenadas** hasta alinearlo con los ejes naturales de la nube. En el sistema nuevo, $CP_1$ y $CP_2$ tienen correlación exactamente igual a cero.`,
        ],
      },
      {
        type: 'analogy',
        text: t`**Analogía de la sombra de la estatua:** para fotografiar una escultura 3D en una página plana, si la fotografías desde el costado correcto, la sombra conserva casi todos los detalles; desde un ángulo ciego solo ves un círculo sin forma. El PCA busca el ángulo de la mejor "sombra" de tus datos.`,
      },
      {
        type: 'intuition',
        title: 'Girar el mapa hasta que las calles queden derechas',
        text: t`**Girar el mapa.** Rotar los ejes es como girar un mapa hasta que la avenida principal quede horizontal. Los datos son los mismos, pero ahora el primer eje sigue la dirección en que más se extienden, y el segundo mide lo que se desvía de ella. Como los dos ejes son perpendiculares, ya no se pisan: mover un punto a lo largo de uno no dice nada sobre el otro (correlación cero).`,
      },
      {
        type: 'paragraph',
        text: t`Cada componente $CP_k$ tiene asociado un **autovalor** (o valor propio) $\lambda_k$: la cantidad de varianza que captura. Se ordenan $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_p > 0$, y su suma es la varianza total de los datos originales. La proporción de varianza que explica cada componente es:`,
      },
      {
        type: 'formula',
        latex: t`\text{Varianza explicada por } CP_k = \frac{\lambda_k}{\lambda_1 + \lambda_2 + \dots + \lambda_p}`,
      },
      {
        type: 'deepDive',
        title: t`Dos variables con correlación $r$: el PCA hecho a mano`,
        text: t`Con dos variables estandarizadas, la matriz de correlación tiene unos en la diagonal y la correlación $r$ afuera. Sus autovalores son $1 + r$ y $1 - r$, y se puede comprobar sin fórmulas: multiplicar la matriz por la dirección $(1, 1)$ da $(1 + r,\ r + 1)$, la misma dirección estirada por $1 + r$; multiplicarla por $(1, -1)$ da $(1 - r,\ r - 1)$, estirada por $1 - r$. Eso es ser un vector propio: la matriz no lo gira, solo lo estira.

**Los componentes son la suma y la diferencia.** El primero va en la dirección $(1, 1)$: lo que las dos variables tienen en común. El segundo, en $(1, -1)$: en qué se diferencian.

**Con $r = 0.9$** (los dos termómetros casi pegados), los autovalores son $1.9$ y $0.1$, y la varianza total es $2$. El primer componente explica $1.9/2 = 95$ %: casi toda la información está en el promedio de los dos. El segundo explica apenas el 5 %.

**Con $r = 0$**, los dos autovalores valen $1$ y cada componente explica el 50 %: no hay nada que resumir, porque cada variable aporta algo propio. El PCA rinde más cuanto más se repiten las variables.`,
        sources: [
          'Jolliffe, *Principal Component Analysis*, cap. 1 y 2',
          'Johnson y Wichern, *Applied Multivariate Statistical Analysis*, cap. 8 (componentes principales)',
          'Cifras inventadas para el ejemplo',
        ],
      },
      { type: 'subheading', text: 'Cargas factoriales y círculo de correlaciones' },
      {
        type: 'paragraph',
        text: t`Las **cargas factoriales** (*loadings*) son números entre $-1$ y $+1$ que miden la correlación simple entre cada variable original $X_j$ y un componente $CP_k$. Sirven para **ponerle nombre** a los componentes. *Ejemplo:* si con las notas de 5 materias el $CP_1$ tiene cargas altas y positivas ($+0.85$) en Matemática y en Física, se lo puede llamar "aptitud cuantitativa general".`,
      },
      { type: 'paragraph', text: t`En el **círculo de correlaciones** cada variable es una flecha:` },
      {
        type: 'list',
        items: [
          t`**Ángulo pequeño** ($\theta \approx 0^\circ$): variables con fuerte correlación positiva (avanzan juntas).`,
          t`**Ángulo recto** ($\theta = 90^\circ$): variables no correlacionadas.`,
          t`**Flechas opuestas** ($\theta = 180^\circ$): fuerte correlación negativa.`,
          t`**Flecha que llega al borde del círculo**: la variable está bien representada en ese plano.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Las flechas como manecillas de reloj',
        text: t`**Las flechas como manecillas de reloj.** Dos manecillas que apuntan casi al mismo lado se mueven juntas: son variables que suben y bajan a la vez. Dos manecillas a las 12 y a las 3 no tienen relación entre sí. Dos manecillas opuestas, a las 12 y a las 6, se mueven en sentido contrario: cuando una sube, la otra baja. Una manecilla larga, que llega al borde de la esfera, está bien representada; una corta se pierde en el centro.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q26'] },
      { type: 'subheading', text: 'Covarianza o correlación: ¿hay que estandarizar?' },
      { type: 'paragraph', text: t`Un paso metodológico crítico es decidir sobre qué matriz se aplica el PCA:` },
      {
        type: 'list',
        items: [
          t`**Matriz de covarianza** ($S$, PCA no estandarizado): solo si todas las variables están en las **mismas unidades** y con escalas comparables.`,
          t`**Matriz de correlación** ($R$, PCA estandarizado): cuando las unidades son distintas (años, pesos, mmHg, miligramos frente a toneladas). Si no se estandariza, la variable con números más grandes (por ejemplo, ingresos de \$500.000) domina los primeros componentes por una cuestión de escala y no porque contenga más información.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Con la matriz de correlación, cada variable original aporta $1$ unidad de varianza, así que la varianza total es igual al número de variables $p$.`,
      },
      {
        type: 'extra',
        text: t`Con la edad de los clientes (desvío típico de unos 10 años, o sea varianza $100$) y su ingreso en pesos (desvío típico de unos $100.000$, o sea varianza $10^{10}$), el PCA sin estandarizar daría un primer componente que es casi puro ingreso: la edad no pesaría nada. Con la matriz de correlación, las dos variables arrancan con varianza $1$ y compiten en igualdad.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q25'] },
      { type: 'subheading', text: '¿Cuántos componentes retener?' },
      {
        type: 'paragraph',
        text: t`Al pasar de $p$ variables a $p$ componentes hay que decidir con cuántos ($k<p$) quedarse y cuáles descartar como ruido:`,
      },
      {
        type: 'table',
        headers: ['Criterio', 'Regla de decisión'],
        rows: [
          [t`**Varianza acumulada**`, t`Retener los primeros $k$ componentes que acumulen entre el $70\,\%$ y el $80\,\%$ de la varianza total.`],
          [t`**Regla de Kaiser-Guttman**`, t`Con la matriz de correlación, conservar solo los componentes con $\lambda > 1$: los que aportan más información que una variable original aislada.`],
          [t`**Gráfico de sedimentación** (*scree plot*)`, t`Graficar los autovalores en orden decreciente y buscar el "codo", donde la curva se aplana; retener los componentes anteriores al codo.`],
          [t`**Análisis paralelo de Horn**`, t`Simular (Monte Carlo) conjuntos de ruido aleatorio con las mismas dimensiones; retener solo los componentes reales cuyo autovalor supera al del ruido. Se lo considera el estándar de oro.`],
        ],
      },
      {
        type: 'paragraph',
        text: t`Los criterios pueden no coincidir. *Ejemplo con los valores propios $2.8,\ 0.9,\ 0.2,\ 0.1$ del Módulo 6.4 (4 variables estandarizadas):* Kaiser retiene solo el primero ($2.8>1$); la varianza acumulada es $70\,\%$ con uno y $92.5\,\%$ con dos. Por eso conviene **triangular**: usar varios criterios y decidir con criterio.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q22'] },
      { type: 'subheading', text: 'Casos de la clase: pizzas y gorriones' },
      {
        type: 'list',
        items: [
          t`**Pizzas.** 71 muestras de masa de pizza analizadas en laboratorio, con 8 propiedades químicas continuas (pH, grasa, proteína, ceniza, sodio, calorías, entre otras). El $CP_1$ explicó el $65\,\%$ de la varianza y el $CP_2$ el $29\,\%$: entre los dos, el $94\,\%$. El espacio de 8 dimensiones era en realidad una nube casi plana de 2 dimensiones.`,
          t`**Gorriones.** 49 gorriones con 5 medidas morfológicas (largo total, extensión de las alas, largo de la quilla, entre otras), para estudiar su supervivencia tras una tormenta. El $CP_1$ explicó el $72\,\%$ (asociado al tamaño general del ave) y los dos primeros, el $83\,\%$ acumulado.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`*Aplicando Kaiser a estas cifras (suponiendo matriz de correlación, con la varianza total igual a $p$ y los porcentajes redondeados):* en las pizzas, $\lambda_1 \approx 0.65 \times 8 = 5.2$ y $\lambda_2 \approx 0.29 \times 8 = 2.32$; el $6\,\%$ restante ($0.48$) se reparte entre 6 componentes, ninguno con $\lambda>1$: Kaiser retiene 2. En los gorriones, $\lambda_1 \approx 0.72 \times 5 = 3.6$ y $\lambda_2 \approx (0.83 - 0.72) \times 5 = 0.55 < 1$: Kaiser retendría 1, mientras que la regla del $80\,\%$ pide 2.`,
      },
      {
        type: 'intuition',
        title: 'Una hoja de papel en una habitación',
        text: t`**Una hoja de papel en una habitación.** Una hoja de papel flotando en el aire se puede ubicar con 3 coordenadas, pero en realidad es plana: tiene solo 2 dimensiones reales. Las pizzas son parecidas: se midieron 8 propiedades, pero casi todo lo que varía entre una masa y otra cabe en 2 ejes, que juntos cuentan el $94\,\%$ de la historia.`,
      },
      { type: 'subheading', text: 'Valores atípicos y limitaciones' },
      { type: 'paragraph', text: t`El PCA permite detectar dos tipos de observaciones atípicas:` },
      {
        type: 'list',
        items: [
          t`**Distancia de puntaje** (*score distance*): puntos dentro del plano de los componentes retenidos, pero muy alejados del centro (puntos de apalancamiento).`,
          t`**Distancia ortogonal** (*orthogonal distance*): puntos que se disparan en una dimensión perpendicular, la que el modelo descartó (atípicos reales).`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Un solo atípico severo puede "tirar de la cuerda" y rotar indebidamente los ejes; conviene correr el análisis con y sin los atípicos para ver si los ejes son estables.`,
      },
      { type: 'paragraph', text: t`*Limitaciones y cuidados:*` },
      {
        type: 'list',
        items: [
          t`**Solo variables numéricas continuas.** Convertir una variable categórica (por ejemplo, estado civil $=1,2,3$) a números y meterla en un PCA es un error grave que distorsiona los resultados.`,
          t`**Solo estructuras lineales.** El PCA usa combinaciones lineales y rotaciones rígidas. Si los datos siguen formas curvas (como un pastel arrollado, el *Swiss roll*), falla y hace falta una variante como el **Kernel PCA**.`,
          t`**Explicar frente a predecir.** El PCA resuelve la multicolinealidad y permite modelos predictivos estables (regresión sobre componentes principales), pero para explicar el modelo a personas no técnicas hay que traducir las cargas de vuelta a las variables originales.`,
        ],
      },
      {
        type: 'intuition',
        title: 'El imán cerca de la brújula',
        text: t`**El imán cerca de la brújula.** Un solo dato muy extraño puede desviar los ejes como un imán desvía una brújula: el PCA gira para acomodarlo y deja de reflejar a los demás. Por eso se prueba con y sin él. Y con las categorías numeradas (1 = soltero, 2 = casado, 3 = divorciado) pasa algo parecido: el programa cree que "divorciado" es tres veces "soltero" y construye un eje con una distancia que no existe.`,
      },
      { type: 'subheading', text: 'Análisis de correspondencias simples (ACS)' },
      {
        type: 'paragraph',
        text: t`Cuando las variables no son números continuos sino **categóricas** (región del vino, plato elegido), se usa el **análisis de correspondencias**, el equivalente del PCA para este caso:`,
      },
      {
        type: 'table',
        headers: ['', 'PCA', 'Análisis de correspondencias'],
        rows: [
          ['Variables', 'Continuas', 'Categóricas'],
          ['Datos', 'Tabla de observaciones por variables', 'Tabla de contingencia (cruce de filas y columnas)'],
          ['Distancia', 'Euclídea', t`Chi-cuadrado ($\chi^2$)`],
          ['Variabilidad', 'Varianza total', '**Inercia total**'],
        ],
      },
      {
        type: 'callout',
        kind: 'advertencia',
        text: t`**Regla de oro:** nunca hagas un análisis de correspondencias sin comprobar antes, con una prueba de $\chi^2$ sobre la tabla de contingencia (Módulo 2.4), que las variables están estadísticamente asociadas.`,
      },
      {
        type: 'paragraph',
        text: t`*Demostración de la clase* (400 clientes que eligen vino y plato): en la tabla **sin asociación real**, todos los puntos del mapa se amontonaron en el centro, y interpretar distancias ahí era inventar historias sobre la nada misma; en la tabla **con asociación significativa**, platos y vinos se separaron con claridad (el tinto de Burdeos cerca de las carnes rojas, el blanco cerca de los pescados).`,
      },
      {
        type: 'intuition',
        title: 'Ver figuras en las nubes',
        text: t`**Ver figuras en las nubes.** Con ruido puro el ojo siempre encuentra algo: un conejo, un barco. Un mapa de correspondencias hecho sobre una tabla sin asociación real es lo mismo: los puntos caen en algún lugar y uno se inventa un relato. La prueba de $\chi^2$ es el control previo que dice si hay algo para ver. Si no hay asociación, no se dibuja el mapa.`,
      },
      {
        type: 'extra',
        text: t`Una cadena de supermercados cruza "provincia" con "marca de yerba preferida". Antes de dibujar el mapa, hace la prueba de $\chi^2$ sobre esa tabla: si el p-valor da alto, las preferencias no dependen de la provincia y cualquier "cercanía" en el mapa sería un espejismo; si da muy bajo, hay asociación y el mapa sí puede mostrar qué marcas "pertenecen" a qué provincias.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q23'] },
      { type: 'subheading', text: 'Análisis de correspondencias múltiple (ACM / MCA)' },
      {
        type: 'paragraph',
        text: t`El análisis simple cruza **dos** variables categóricas en una tabla de doble entrada. Con tres o más (cuatro, diez, veinte) los datos forman un "cubo" de muchas dimensiones imposible de tabular, y se usa el **análisis de correspondencias múltiple (ACM)**, en inglés *MCA*.`,
      },
      {
        type: 'list',
        items: [
          t`**Matriz de Burt.** Es una supertabla simétrica que cruza todas las categorías de todas las variables entre sí. En su diagonal cada variable se cruza **consigo misma**, y eso agrega inercia artificial.`,
          t`**Inercia inflada.** Por esa diagonal, los porcentajes brutos de los primeros ejes **subestiman** lo que realmente explican: puede parecer que la técnica sirve poco cuando sí funciona. Los programas corrigen esto con dos ajustes: **Benzécri** reajusta los autovalores quitando el efecto de la diagonal; **Greenacre** ajusta además el porcentaje acumulado usando el número real de variables y de categorías.`,
        ],
      },
      {
        type: 'analogy',
        text: t`**Analogía del micrófono con eco:** analizar la matriz de Burt sin corregir es cantar con el eco al máximo: tu propia voz rebotando tapa la melodía. Las correcciones actúan como un filtro que quita ese eco.`,
      },
      {
        type: 'workedExample',
        title: 'Ejemplo didáctico: corregir los porcentajes con Benzécri (cifras construidas para ilustrar, no son resultados de la clase)',
        steps: [
          t`Con $Q=4$ variables y $J=12$ categorías en total, la inercia total de la tabla indicadora es $J/Q-1 = 2$ y el autovalor medio es $1/Q = 0.25$. Supongamos que solo dos autovalores superan $1/Q$: $\lambda_1 = 0.50$ y $\lambda_2 = 0.40$.`,
          t`**Sin corregir:** $0.50/2 = 25\,\%$ y $0.40/2 = 20\,\%$. Parece poco.`,
          t`**Benzécri:** $\lambda^{*}_k = \left(\dfrac{Q}{Q-1}\right)^{2} \left(\lambda_k - \dfrac{1}{Q}\right)^{2}$, es decir $\tfrac{16}{9}(0.25)^2 \approx 0.111$ y $\tfrac{16}{9}(0.15)^2 = 0.040$.`,
          t`Repartiendo entre los dos: $0.111/0.151 \approx 73.5\,\%$ y $26.5\,\%$.`,
        ],
        result: t`Los dos ejes explican casi todo lo que hay para explicar, aunque sin corregir parecían explicar menos de la mitad.`,
      },
      {
        type: 'paragraph',
        text: t`*Caso de la clase (vinos).* 200 vinos simulados con cuatro variables categóricas (región: Bordeaux, Loire, Burgundy, Rhône; color; cuerpo: ligero, medio, robusto; crianza en barrica sí/no), 12 categorías en total. En el mapa, el primer eje separa a **Loire con cuerpo ligero** de **Bordeaux con cuerpo robusto y color tinto**, y el segundo eje aísla a **Burgundy**.`,
      },
      {
        type: 'paragraph',
        text: t`*Caso de la clase (negocio).* Con 10.000 comercios minoristas de Tucumán con heladeras entregadas en comodato, el mapa separó dos perfiles: kioscos periféricos de bajo volumen con atrasos en el pago, y bares y restaurantes céntricos de alta rotación y pago al día. La decisión fue reubicar las heladeras desde los primeros hacia los segundos.`,
      },
      {
        type: 'paragraph',
        text: t`Aplicaciones clásicas: Bourdieu cartografió el "espacio social" francés (educación, consumo cultural, clase social). Software: FactoMineR en R y prince en Python.`,
      },
      {
        type: 'intuition',
        title: 'Muchas preguntas de encuesta a la vez',
        text: t`**Muchas preguntas de encuesta a la vez.** El análisis simple mira cómo se relacionan dos preguntas (por ejemplo, vino y plato). El múltiple mira diez preguntas juntas y dibuja un solo mapa donde las respuestas parecidas quedan cerca. Un detalle técnico hace que, sin corregir, los primeros ejes parezcan explicar poco (como si el eco de la propia voz tapara la melodía); las correcciones de Benzécri y Greenacre quitan ese eco y muestran cuánto explican en realidad.`,
      },
      {
        type: 'extra',
        text: t`Un gimnasio encuesta a sus socios con cuatro preguntas de opción: turno preferido (mañana, tarde, noche), actividad (pesas, clases grupales, natación), frecuencia (baja, media, alta) y si compró un plan anual (sí, no). Un ACM podría mostrar, por ejemplo, que "tarde + clases grupales + frecuencia alta" quedan juntas y lejos de "noche + pesas + frecuencia baja", y que "plan anual: sí" cae cerca del primer grupo. Antes de interpretar el mapa conviene ver los porcentajes corregidos de los primeros ejes, no los brutos.`,
      },
      {
        type: 'deepDive',
        title: t`De dónde sale la corrección: el autovalor medio del ACM es $1/Q$`,
        text: t`**La tabla indicadora tiene inercia $J/Q - 1$.** Con las $Q = 4$ variables y las $J = 12$ categorías del ejemplo, $12/4 - 1 = 2$. Esa inercia se reparte entre las dimensiones útiles, que son $J - Q = 8$, así que cada una aporta en promedio $2/8 = 0.25$, que es justamente $1/Q$.

**Un eje por debajo de $1/Q$ explica menos que el promedio.** No supera lo que se obtendría sin ninguna estructura. Benzécri toma ese umbral como punto de partida: resta $1/Q$ a cada autovalor, lo eleva al cuadrado y lo multiplica por $\left(	frac{Q}{Q-1}ight)^2$. Por eso un eje con autovalor $0.20$ desaparece del reparto, y uno de $0.50$ queda muy por encima: la diferencia con el umbral, $0.50 - 0.25 = 0.25$, es lo que cuenta.`,
        sources: [
          'Greenacre, *Correspondence Analysis in Practice* (3.ª ed.), capítulos sobre análisis de correspondencias múltiple',
          'Abdi y Valentin (2007), "Multiple correspondence analysis", *Encyclopedia of Measurement and Statistics*',
          'Cifras inventadas para el ejemplo',
        ],
      },
      { type: 'miniCheck', questionIds: ['m6-q29'] },
      { type: 'subheading', text: 'Datos mixtos: FAMD' },
      {
        type: 'paragraph',
        text: t`Las tablas reales suelen mezclar variables continuas (edad, ingreso) y categóricas (estado civil, nivel de riesgo). El PCA no puede tratar categorías, y el ACM obligaría a convertir las continuas en rangos y perder precisión. El **análisis factorial de datos mixtos (FAMD)** (Escofier, 1979, con el nombre francés AFDM) resuelve esto:`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`Las categóricas se pasan a columnas de $0$ y $1$ (*dummies*).`,
          t`Se **equilibra** el peso de cada tipo: las continuas se estandarizan (cada una aporta $1$ de varianza) y las categóricas se ponderan para que una variable con muchas categorías no domine a una continua, ni al revés. Así, la inercia total es $p + J - Q$, con $p$ variables continuas y $Q$ categóricas que suman $J$ categorías.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo de la clase:* 100 vinos con $p=6$ continuas (pH, grado alcohólico, acidez, taninos, puntuación de calidad, intensidad de aroma) y $Q=2$ categóricas (suelo: volcánico o gravoso, 2 categorías; origen: Bordeaux, Burgundy o Loire, 3 categorías; $J=5$). Inercia total: $6 + 5 - 2 = 9$. El mapa permite ver juntas las categorías y las variables numéricas (por ejemplo, el suelo volcánico asociado a pH y grado alcohólico altos).`,
      },
      {
        type: 'callout',
        kind: 'advertencia',
        text: t`No usar FAMD por comodidad si todas las variables son del mismo tipo. Con solo continuas corresponde el PCA; con solo categóricas, el ACM. La herramienta más compleja sobre datos simples introduce distorsiones innecesarias.`,
      },
      {
        type: 'intuition',
        title: 'Pesar en la misma balanza',
        text: t`**Pesar en la misma balanza.** Mezclar edad (un número) con estado civil (una etiqueta) es como comparar kilos con colores. El FAMD convierte las etiquetas en columnas de sí/no y las pesa de modo que ningún tipo de variable "grite más fuerte" que el otro: cada variable continua aporta $1$ unidad de varianza y cada categórica aporta según sus categorías. Después es un PCA común sobre esa tabla ya balanceada.`,
      },
      {
        type: 'extra',
        text: t`La ficha de un cliente de un banco tiene edad y saldo promedio (continuas) más tipo de tarjeta y provincia (categóricas). Para dibujar un solo mapa de clientes, FAMD usa todo junto: no hace falta partir la edad en "joven/adulto/mayor" ni descartar la provincia. Si en cambio la ficha tuviera solo edad, saldo y antigüedad (todo numérico), alcanzaría con un PCA.`,
      },
      { type: 'miniCheck', questionIds: ['m6-q30'] },
      { type: 'subheading', text: 'Mapa de decisión y lista de verificación' },
      { type: 'paragraph', text: t`Para reducir dimensión:` },
      {
        type: 'list',
        items: [
          t`Si las variables son **continuas**: si tienen unidades o escalas distintas, PCA con la matriz de correlación ($R$); si no, con la de covarianza ($S$). En ambos casos, elegir los componentes con el gráfico de sedimentación, Kaiser ($\lambda>1$) y el análisis paralelo de Horn.`,
          t`Si las variables son **categóricas**: comprobar la asociación con $\chi^2$. Si **no** hay asociación significativa, no hacer el mapa. Si la hay, análisis de correspondencias simple (dos variables) o múltiple (tres o más), mirando los porcentajes corregidos.`,
          t`Si hay **ambos tipos**: FAMD.`,
        ],
      },
      { type: 'paragraph', text: t`Lista de verificación para el analista:` },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**Garantizar variabilidad:** comprobar que ninguna columna sea constante antes de modelar.`,
          t`**Eliminar la multicolinealidad:** usar PCA o regresión sobre componentes cuando haya variables muy correlacionadas.`,
          t`**Estandarizar** (matriz $R$) si las unidades de medida son heterogéneas.`,
          t`**Validar la cantidad de ejes** triangulando codo, Kaiser y análisis paralelo.`,
          t`**No forzar métodos:** PCA para continuas, análisis de correspondencias para categóricas asociadas, FAMD solo si hay mezcla.`,
        ],
      },
    ],
  },
]
