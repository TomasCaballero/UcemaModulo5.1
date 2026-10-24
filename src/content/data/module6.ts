import type { ContentBlock, Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 6. Los bloques `extra` son ejemplos
// agregados (cotidianos o clásicos): no son de la guía y se muestran rotulados.
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
        type: 'intuition',
        title: 'La trampa del examen con las mismas preguntas',
        text: t`**La trampa del examen con las mismas preguntas.** Hay dos errores. El **de entrenamiento**, medido con los mismos datos con que se armó el modelo, casi siempre es optimista: es como el puntaje que sacás repitiendo los ejercicios que ya estudiaste. El **de prueba**, medido con datos nuevos, es el que realmente importa. Un modelo más flexible casi siempre mejora el primero, pero el segundo no necesariamente.`,
      },
      {
        type: 'extra',
        text: t`Aprender con respuestas conocidas es como estudiar con un libro de ejercicios con soluciones al final (supervisado: ves la "etiqueta" correcta). Ordenar tu discoteca por "parecido" sin que nadie te diga las categorías es no supervisado: tú descubres los grupos. Y un ejemplo de MSE: si la temperatura real fue $(20, 22, 25)$ y el modelo predijo $(19, 24, 22)$, los errores son $1, -2, 3$ y el MSE es $(1+4+9)/3 \approx 4.67$.`,
      },
    ],
  },
  {
    id: '6.2',
    moduleId: 6,
    title: 'El equilibrio sesgo-varianza',
    blocks: [
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
        type: 'intuition',
        title: 'La regla de madera y la cuerda de hule',
        text: t`**La regla y la cuerda.** Un modelo de sesgo alto es una **regla de madera**: no se dobla, y si el terreno es curvo, no lo sigue (subajuste). Uno de varianza alta es una **cuerda de hule** muy flexible: se amolda a cada grano de polvo y pierde la forma general (sobreajuste).`,
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
        text: t`**El que memoriza.** Quien se aprende de memoria las respuestas de exámenes de años anteriores tiene error casi cero en esos ejercicios y se desorienta con una pregunta nueva. En el ejemplo de la guía, un polinomio de grado 9 pasa por todos los puntos de entrenamiento (error $0.0$) pero falla con datos nuevos (error $25.0$). El de grado 3 es el mejor equilibrio: error de prueba de $3.1$.`,
      },
      {
        type: 'paragraph',
        text: t`**El objetivo no es minimizar el error de entrenamiento, sino hallar el punto de equilibrio** con menor error de prueba. Las secciones siguientes son herramientas para encontrarlo y controlarlo.`,
      },
      {
        type: 'intuition',
        title: 'Lo que importa de verdad',
        text: t`**Lo que importa de verdad.** El objetivo no es bajar el error con el que entrenaste, sino encontrar el punto de equilibrio entre ser demasiado simple y demasiado flexible. La curva del error de prueba tiene forma de U, y el mejor modelo está en el fondo. Las secciones que siguen son herramientas para encontrar ese punto.`,
      },
      {
        type: 'extra',
        text: t`El clásico del tiro al blanco. Un tirador con **sesgo alto y varianza baja** agrupa todos los dardos en el mismo lugar, pero lejos del centro. Uno con **sesgo bajo y varianza alta** acierta en promedio al centro, pero sus dardos quedan esparcidos. Y quien se aprende de memoria las respuestas de los exámenes de años anteriores tiene error de entrenamiento casi cero, pero se desorienta ante preguntas nuevas: sobreajuste.`,
      },
    ],
  },
  {
    id: '6.3',
    moduleId: 6,
    title: 'Remuestreo: validación cruzada y bootstrap',
    blocks: [
      {
        type: 'paragraph',
        text: t`Como no siempre hay un conjunto de prueba aparte, se **reutilizan** los datos de forma inteligente.`,
      },
      {
        type: 'intuition',
        title: 'No siempre hay datos de sobra',
        text: t`**No siempre hay datos de sobra.** Si no podés apartar un grupo de prueba, hay una salida: reutilizar los mismos datos de forma inteligente.`,
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
        text: t`**Validación cruzada: rotar al evaluador.** Ensayás una presentación frente a cinco amigos. Un día la hacés frente a cuatro y la evalúa el quinto. Al día siguiente rotás, hasta que los cinco hayan sido evaluadores una vez. Promediando los cinco comentarios te formás una idea más justa que con un solo oyente. Con datos es igual: se divide en $k$ partes, se entrena con $k-1$ y se evalúa con la que queda, y se repite $k$ veces. Con 100 datos y $k = 5$, cada ajuste usa 80 para entrenar y 20 para evaluar. Sirve especialmente para elegir los "diales" del modelo (los hiperparámetros, que se fijan antes de entrenar), probando varios valores y quedándose con el de menor error.`,
      },
      {
        type: 'extra',
        text: t`Imagina que ensayas una presentación frente a cinco amigos. Un día la haces frente a cuatro y la revisa el quinto; al día siguiente rotas quién es el evaluador, hasta que los cinco hayan sido evaluadores una vez. Promediando los cinco comentarios te formas una idea más justa que con un solo oyente: es lo mismo que la validación cruzada de 5 particiones.`,
      },
      {
        type: 'paragraph',
        text: t`**Bootstrap.** Una muestra *bootstrap* se obtiene **sacando $n$ datos con reemplazo** de los $n$ originales (un mismo dato puede repetirse y otros quedar afuera). *Ejemplo:* de $\{1,2,3,4,5\}$ podría salir $\{2,2,4,5,1\}$. Permite simular "otras muestras" a partir de una sola y estimar la variabilidad de cualquier estadístico.`,
      },
      {
        type: 'intuition',
        title: 'Bootstrap: sacar bolillas devolviéndolas',
        text: t`**Bootstrap: sacar bolillas devolviéndolas.** Imaginá una bolsa con bolillas numeradas. Sacás una, anotás el número y **la devolvés**; así hasta tener tantas como la bolsa original. Algunas bolillas aparecen más de una vez y otras no aparecen. De los datos $\{1,2,3,4,5\}$ podría salir $\{2,2,4,5,1\}$. Así se simulan "otras muestras" a partir de una sola, para ver cuánto varía cualquier número que calcules.`,
      },
      {
        type: 'paragraph',
        text: t`Un dato dado queda **fuera** de una muestra bootstrap con probabilidad $(1-1/n)^n \to 1/e \approx 0.368$. Es decir, **cada muestra bootstrap contiene en promedio ~63 % de los datos distintos y deja ~37 % afuera**. Esto se usa en el bagging.`,
      },
      {
        type: 'intuition',
        title: 'Un dato curioso: el 63 % y el 37 %',
        text: t`**Un dato curioso.** La chance de que un dato quede fuera de una muestra así tiende a $0.368$. Eso significa que cada muestra contiene en promedio cerca del 63 % de los datos distintos y deja afuera el 37 %. Esa parte que queda afuera se aprovecha después, en los ensambles.`,
      },
      {
        type: 'extra',
        text: t`El bootstrap es sacar bolillas de una bolsa devolviéndolas cada vez. Con 10 bolillas numeradas, una en particular queda fuera de una muestra de 10 extracciones con probabilidad $(1-1/10)^{10} = 0.9^{10} \approx 0.349$, ya muy cerca del límite de 0.368.`,
      },
    ],
  },
  {
    id: '6.4',
    moduleId: 6,
    title: 'Regularización y reducción de dimensión',
    blocks: [
      {
        type: 'paragraph',
        text: t`Cuando hay **muchas variables** (incluso más variables que observaciones, $p > n$), OLS tiene alta varianza o directamente no tiene solución única. La idea de la **regularización** es **aceptar un poco de sesgo a cambio de bajar mucho la varianza**, penalizando coeficientes grandes.`,
      },
      {
        type: 'intuition',
        title: 'El problema de tener demasiadas variables',
        text: t`**El problema.** Cuando tenés muchísimas variables, incluso más que observaciones, la recta del módulo 3 se vuelve inestable o directamente no tiene una solución única. La idea de la regularización es **aceptar perder algo de precisión a cambio de ganar estabilidad**, castigando los pesos demasiado grandes.`,
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
        type: 'intuition',
        title: 'El dial lambda',
        text: t`**El dial $\lambda$.** Controla qué tan estricto es el límite de peso. Con $\lambda = 0$ no hay castigo y se vuelve a la recta común. Con $\lambda$ muy grande, todos los pesos tienden a cero. Se elige probando valores con validación cruzada. Antes de aplicar estos métodos conviene poner todas las variables en la misma escala, porque el castigo depende de la escala de cada una.`,
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
        type: 'extra',
        text: t`Armar una valija con límite de peso. **Lasso** es dejar cosas en casa: decides qué no llevar (coeficiente exactamente cero) y el resto pasa tal cual. **Ridge** es llevar un poco menos de cada cosa: todo viaja, pero más liviano. En ambos casos aceptas perder algo (sesgo) a cambio de una valija más manejable (menos varianza).`,
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
        text: t`**PCA: un talle en lugar de tres medidas.** Es una técnica distinta, que no mira la respuesta. Los talles de ropa son una "primera componente" casual: en vez de dar altura, peso y contorno por separado, el talle (S, M, L) resume en una sola dimensión lo que más varía entre las personas. Se pierde algo, pero se conserva lo esencial con mucho menos información. PCA arma nuevas variables que ya no se repiten entre sí, ordenadas de mayor a menor variación. En el ejemplo, la primera de cuatro variables ya explica el 70 % y las dos primeras el 92.5 %, así que se puede trabajar con 2 en vez de 4.`,
      },
      {
        type: 'paragraph',
        text: t`*Usos:* reducir dimensión, visualizar datos, eliminar colinealidad y alimentar otros modelos (regresión sobre componentes principales). *Advertencia:* se deben **estandarizar** las variables antes (si no, domina la de mayor escala), y como PCA **ignora $Y$**, las componentes con más varianza no tienen por qué ser las más útiles para predecir.`,
      },
      {
        type: 'extra',
        text: t`Los talles de ropa son una "primera componente" casual: en vez de dar altura, peso y contorno por separado, el talle (S, M, L) resume en una sola dimensión lo que más varía entre las personas. Se pierde algo (dos personas del mismo talle pueden tener proporciones distintas), pero se conserva lo esencial con mucho menos información.`,
      },
    ],
  },
  {
    id: '6.5',
    moduleId: 6,
    title: 'Métodos de ensamble',
    blocks: [
      {
        type: 'paragraph',
        text: t`Un **ensamble** combina muchos modelos "débiles" para obtener uno fuerte. Los modelos base casi siempre son **árboles de decisión** (Módulo 4.3), que tienen la desventaja de ser **inestables**: un pequeño cambio en los datos puede cambiar mucho el árbol (alta varianza).`,
      },
      {
        type: 'intuition',
        title: 'Muchos modelos mediocres que se corrigen entre sí',
        text: t`**Muchos modelos mediocres que se corrigen entre sí.** Un solo árbol de decisión es inestable: si cambian un poco los datos, puede cambiar mucho. Pero muchos árboles juntos pueden dar una respuesta firme. Es la sabiduría de las multitudes: en una feria, ninguna persona acertó el peso de un buey, pero el promedio de todas estuvo muy cerca. Funciona porque los errores individuales, si son independientes, se compensan.`,
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
        type: 'intuition',
        title: 'La condición oculta: que los modelos sean distintos',
        text: t`**La condición oculta.** Si todos copian la respuesta del vecino, el promedio es tan malo como cada uno. Lo que hace falta son modelos **distintos entre sí**. Con 100 modelos de varianza $4$, si fueran independientes, el promedio tendría varianza de $0.04$. Si se parecen mucho (correlación de $0.5$), la varianza del promedio queda en $2.02$: casi no ayudó.`,
      },
      {
        type: 'extra',
        text: t`La sabiduría de las multitudes es el ejemplo clásico: en 1906, Francis Galton analizó las estimaciones que unas 800 personas hicieron en una feria sobre el peso de un buey; ninguna fue exacta, pero el promedio quedó a menos del 1 % del peso real. Funciona porque los errores individuales, si son independientes, se compensan. Si todos copiaran la respuesta del vecino (correlación alta), el promedio sería tan malo como cada uno.`,
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
      {
        type: 'intuition',
        title: 'Bagging: muchos árboles en paralelo',
        text: t`**Bagging: muchos árboles en paralelo.** Se arman muchas muestras como en el truco de las bolillas, se entrena un árbol profundo en cada una y se combinan: promedio (para números) o voto (para categorías). Reduce la varianza. A cambio, ya no se puede leer un solo árbol. Cada árbol deja cerca del 37 % de los datos sin ver, y esos datos sirven para estimar el error de prueba sin necesidad de validación cruzada (estimación *out-of-bag*).`,
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
      {
        type: 'intuition',
        title: 'Bosque aleatorio: un comité con consultas distintas',
        text: t`**Bosque aleatorio: un comité con consultas distintas.** Si en un panel de médicos hay un especialista muy dominante, todos los diagnósticos se parecen. Si a cada médico solo se le permite consultar un grupo aleatorio de síntomas, las opiniones se diversifican y el voto es más robusto. Eso es un bosque: en cada pregunta de cada árbol, solo se mira una parte de las variables. Agregar más árboles no causa sobreajuste. En el ejemplo, los cinco árboles dieron un promedio de $0.220$, por debajo del umbral $0.50$: la predicción es "no sobrevive".`,
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
        text: t`**Boosting: el simulacro de examen.** Tras cada simulacro revisás solo lo que fallaste y estudiás eso, sin repasar lo que ya sabías. Cada ronda corrige los errores de la anterior, y el conocimiento final es la suma de todas esas correcciones pequeñas. Con datos, se entrenan árboles pequeños **en secuencia**, cada uno ajustándose a lo que el anterior no explicó, y se suma una fracción de cada uno. En la caricatura numérica, el error baja de $100$ a $90$ y luego a $72.9$: avanza de a pasos chicos a propósito.`,
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
      {
        type: 'intuition',
        title: 'Cuál usar',
        text: t`**Cuál usar.** El bosque trabaja en paralelo, con árboles profundos, y es difícil de arruinar. El boosting trabaja en secuencia, con árboles chicos, es más sensible a los ajustes y sí puede sobreajustar si pones demasiados árboles. Y en el ejemplo del Titanic, qué modelo sale "mejor" depende de la métrica que elijas.`,
      },
      {
        type: 'extra',
        text: t`Boosting es como preparar un examen con simulacros: tras cada simulacro revisas solo lo que fallaste y estudias eso, sin repasar de nuevo lo que ya sabías. Cada ronda corrige los errores de la anterior y el conocimiento final es la suma de todas esas correcciones pequeñas. Y la varianza de un promedio de 10 árboles con $\sigma^2=4$ y $\rho=0.2$ es $0.2\cdot4 + 0.8\cdot4/10 = 1.12$: más cerca de lo que permite la correlación que del ideal $0.4$.`,
      },
    ],
  },
  {
    id: '6.6',
    moduleId: 6,
    title: 'Máquinas de Vectores de Soporte (SVM)',
    blocks: [
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
        type: 'extra',
        text: t`Imagina un salón con alumnos de dos cursos que deben quedar en lados opuestos. En vez de trazar el pasillo en cualquier lugar, buscas el pasillo más ancho posible entre los dos grupos. Los alumnos que quedan pegados al borde del pasillo son los vectores de soporte: si alguien del fondo se cambia de silla, el pasillo no se mueve; si se mueve uno de los pegados al borde, sí.`,
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
        type: 'intuition',
        title: 'Cuando los grupos se mezclan un poco',
        text: t`**Cuando los grupos se mezclan un poco.** En la vida real los grupos se solapan. Entonces se tolera que algunos queden dentro del pasillo o del lado equivocado, con una tolerancia que se regula. Más tolerancia: pasillo ancho, más puntos "violan", más sesgo y menos varianza. Menos tolerancia: pasillo angosto, ajuste ceñido, menos sesgo y más varianza.`,
      },
      {
        type: 'callout',
        kind: 'cuidado',
        text: t`con la notación del parámetro $C$. En el libro *An Introduction to Statistical Learning* $C$ es un "presupuesto" de violaciones (**más $C$ = más tolerancia**). En muchas librerías (por ejemplo, scikit-learn) $C$ es el **peso de la penalización** de las violaciones (**más $C$ = menos tolerancia**). Son opuestos: verifica siempre la definición de tu herramienta.`,
      },
      {
        type: 'intuition',
        title: 'Cuidado con el nombre C',
        text: t`**Cuidado con el nombre $C$.** En el libro del curso, $C$ es un "presupuesto" de violaciones (más $C$ = más tolerancia). En muchas librerías es el peso de la penalización (más $C$ = menos tolerancia). Son opuestos: verificá siempre la definición de tu herramienta.`,
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
        text: t`**El truco de mirar desde otra altura.** Imaginá una pista circular de patinaje con los buenos en el centro y los novatos en un anillo alrededor. Ninguna recta los separa sobre el mapa. Pero si, en vez de la posición, usás la **distancia al centro** de la pista, los dos grupos quedan de un lado y del otro de un umbral. Eso es el truco del *kernel*: cambiar la forma de mirar los datos para que una frontera recta sirva. En la guía, el ejemplo es poner $x^2$: los puntos de la clase $+$ en $\pm 3$ pasan a $(\pm 3, 9)$ y los otros a alturas de $0$ y $1$, y la recta $x^2 = 5$ los separa.`,
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
        type: 'intuition',
        title: 'Lo notable: no hace falta construir las variables nuevas',
        text: t`**Lo notable.** El algoritmo no necesita construir esas variables nuevas: solo necesita medir "qué tan parecidos" son dos puntos, y una función llamada kernel lo calcula directamente. Por eso funciona incluso en espacios enormes. El kernel radial mide similitud local: con $\gamma$ grande la influencia de cada punto es muy local y la frontera se vuelve irregular (sobreajuste); con $\gamma$ pequeño, queda suave.`,
      },
      {
        type: 'paragraph',
        text: t`Para más de dos clases, se combinan varias SVM binarias (una contra todas, o una contra una). Los hiperparámetros ($C$, $\gamma$, $d$) se eligen por validación cruzada.`,
      },
      {
        type: 'extra',
        text: t`Para ver el truco en la vida real: en una pista circular de patinaje, los patinadores "buenos" van en el centro y los "novatos" en un anillo alrededor. Ninguna recta separa los dos grupos sobre el mapa. Pero si en lugar de la posición usas la distancia al centro de la pista (una variable nueva), los dos grupos quedan de un lado y del otro de un umbral. Eso es lo que logra un kernel sin tener que construir la variable a mano.`,
      },
    ],
  },
  {
    id: '6.7',
    moduleId: 6,
    title: 'Agrupamiento no supervisado: K-Means y clustering jerárquico',
    blocks: [
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
        text: t`**K-Means: ubicar estaciones de servicio.** Elegís cuántos grupos querés ($K$) y ubicás $K$ "estaciones" (centroides) en la ciudad de datos. Cada conductor va a la más cercana. Después movés cada estación al centro de los conductores que la usan, y repetís hasta que nadie cambie de estación. El centro de cada grupo es el promedio de sus puntos, y se usa el promedio porque, como viste en el módulo 0, es el valor que minimiza la suma de los cuadrados de las distancias.`,
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
      {
        type: 'intuition',
        title: 'K-Means con números',
        text: t`**Con números.** Con los puntos $1, 2, 4, 10, 11, 13$ y dos estaciones iniciales en $1$ y $10$, quedan los grupos $\{1,2,4\}$ y $\{10,11,13\}$, con centros en $2.33$ y $11.33$. Al reasignar no cambia nadie y termina.`,
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
        type: 'intuition',
        title: 'Los límites de K-Means',
        text: t`**Sus límites.** Hay que decidir cuántos grupos de antemano. Como el error siempre baja al sumar grupos, se mira el "codo": el punto donde la mejora se aplana. El resultado depende del arranque (se prueban varios), prefiere grupos compactos y redondeados, y es sensible a los valores raros y a la escala (conviene estandarizar). Con clientes de una verdulería, si el gasto está en miles de pesos y la frecuencia en visitas por mes, el gasto dominaría las distancias si no estandarizás.`,
      },
      {
        type: 'extra',
        text: t`Una verdulería quiere agrupar a sus clientes por cuánto gastan al mes y con qué frecuencia vienen. Con $K=3$ podría encontrar un grupo de "compradores grandes y frecuentes", otro de "ocasionales de poco gasto" y otro intermedio, y los centroides serían el gasto y la frecuencia promedio de cada grupo. Si el gasto está en pesos y la frecuencia en visitas por mes, hay que estandarizar antes: si no, el gasto (miles) dominaría las distancias.`,
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
        type: 'intuition',
        title: 'Clustering jerárquico: un árbol genealógico',
        text: t`**Clustering jerárquico: un árbol genealógico.** No hace falta decidir cuántos grupos antes. Cada punto empieza solo, y se van juntando los dos grupos más cercanos, una y otra vez, hasta formar uno solo. El historial se dibuja como un árbol (dendrograma), y **cortarlo a cierta altura** es elegir cuántos grupos querés: un corte bajo da muchos grupos muy parecidos por dentro; uno alto, pocos y amplios.`,
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
        type: 'intuition',
        title: 'Cuán cerca están dos grupos',
        text: t`**¿Cuán cerca están dos grupos?** Hay que elegir cómo medirlo. Con los mismos puntos de antes, la distancia entre $\{1,2,4\}$ y $\{10,11,13\}$ es $6$ si se mide entre los más cercanos, $12$ si es entre los más lejanos y $9$ si se promedian todos los pares. La elección del criterio puede cambiar el resultado.`,
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
        type: 'intuition',
        title: 'El autovalor como porción de la historia',
        text: t`**El autovalor como porción de la historia.** Si la varianza total es la "historia completa" de los datos, el autovalor de cada componente es el capítulo que cuenta. Con los valores propios $2.8,\ 0.9,\ 0.2,\ 0.1$ del Módulo 6.4 y varianza total $4$, el primer componente cuenta el $70\,\%$ de la historia y los dos primeros, el $92.5\,\%$.`,
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
        type: 'intuition',
        title: 'Metros contra kilómetros',
        text: t`**Metros contra kilómetros.** Si medís una distancia en metros y otra en kilómetros, los números de la primera serán mil veces más grandes y parecerán "variar más", aunque no sea así. Estandarizar es pasar todo a la misma vara (cuántos desvíos se aleja cada dato de su promedio) para que ninguna variable gane solo por sus unidades.`,
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
      {
        type: 'intuition',
        title: 'Resumir una película',
        text: t`**Resumir una película.** Con una frase contás el $70\,\%$ del argumento; con dos, el $92.5\,\%$; lo que sigue es puro detalle. Los criterios te ayudan a decidir cuándo el resumen ya alcanza. El de Horn es el más exigente: compara cada componente con el que saldría de datos inventados al azar, y solo conserva el que le gana al azar.`,
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
      { type: 'subheading', text: 'Mapa de decisión y lista de verificación' },
      { type: 'paragraph', text: t`Para reducir dimensión:` },
      {
        type: 'list',
        items: [
          t`Si las variables son **continuas**: si tienen unidades o escalas distintas, PCA con la matriz de correlación ($R$); si no, con la de covarianza ($S$). En ambos casos, elegir los componentes con el gráfico de sedimentación, Kaiser ($\lambda>1$) y el análisis paralelo de Horn.`,
          t`Si las variables son **categóricas**: comprobar la asociación con $\chi^2$. Si **no** hay asociación significativa, no hacer el mapa. Si la hay, análisis de correspondencias (simple o múltiple).`,
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
          t`**No forzar métodos:** PCA para continuas, análisis de correspondencias para categóricas asociadas.`,
        ],
      },
    ],
  },
]
