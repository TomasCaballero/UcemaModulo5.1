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
        type: 'paragraph',
        text: t`**Medir el error en regresión.** El **error cuadrático medio** (MSE) es el promedio de los errores al cuadrado: $\text{MSE} = \frac{1}{n}\sum (y_i - \hat{y}_i)^2$. Se distinguen dos versiones:`,
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
        type: 'extra',
        text: t`Aprender con respuestas conocidas es como estudiar con un libro de ejercicios con soluciones al final (supervisado: ves la "etiqueta" correcta). Ordenar tu discoteca por "parecido" sin que nadie te diga las categorías es no supervisado: tú descubres los grupos. Y un ejemplo de MSE: si la temperatura real fue $(20, 22, 25)$ y el modelo predijo $(19, 24, 22)$, los errores son $1, -2, 3$ y el MSE es $(1+4+9)/3 \approx 4.67$.`,
      },
      {
        type: 'intuition',
        title: 'Estudiar con las respuestas al final del libro, o descubrir los grupos solo',
        text: t`**1. Con respuestas y sin respuestas.** Aprendizaje **supervisado** es estudiar con un libro de ejercicios que trae las soluciones al final: para cada caso tenés la respuesta correcta y aprendés la relación. Aprendizaje **no supervisado** es ordenar tu discoteca por "parecido" sin que nadie te diga las categorías: descubrís los grupos por tu cuenta. Si lo que predecís es un número, es regresión; si es una categoría, clasificación.

**2. El error que no se puede evitar.** Aun el mejor modelo del mundo no puede explicar todo, porque siempre hay variación que depende de cosas que no están en los datos. Ese piso se llama **error irreducible**.

**3. Cómo se mide el error.** El error cuadrático medio (MSE) es el promedio de los errores elevados al cuadrado. Con temperaturas reales de $(20, 22, 25)$ y predicciones de $(19, 24, 22)$, los errores son $1, -2, 3$ y el MSE es aproximadamente $4.67$.

**4. La trampa del examen con las mismas preguntas.** Hay dos errores. El **de entrenamiento**, medido con los mismos datos con que se armó el modelo, casi siempre es optimista: es como el puntaje que sacás repitiendo los ejercicios que ya estudiaste. El **de prueba**, medido con datos nuevos, es el que realmente importa. Un modelo más flexible casi siempre mejora el primero, pero el segundo no necesariamente.`,
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
        type: 'paragraph',
        text: t`**El objetivo no es minimizar el error de entrenamiento, sino hallar el punto de equilibrio** con menor error de prueba. Las secciones siguientes son herramientas para encontrarlo y controlarlo.`,
      },
      {
        type: 'extra',
        text: t`El clásico del tiro al blanco. Un tirador con **sesgo alto y varianza baja** agrupa todos los dardos en el mismo lugar, pero lejos del centro. Uno con **sesgo bajo y varianza alta** acierta en promedio al centro, pero sus dardos quedan esparcidos. Y quien se aprende de memoria las respuestas de los exámenes de años anteriores tiene error de entrenamiento casi cero, pero se desorienta ante preguntas nuevas: sobreajuste.`,
      },
      {
        type: 'intuition',
        title: 'La regla de madera, la cuerda de hule y el tiro al blanco',
        text: t`**1. Dos formas de fallar.** Un modelo puede errar por ser **demasiado simple** (sesgo) o por ser **demasiado sensible a los datos que vio** (varianza). Es como el tiro al blanco. Un tirador con **sesgo alto y varianza baja** pone todos los dardos juntos pero lejos del centro: es consistente, pero consistentemente equivocado. Uno con **sesgo bajo y varianza alta** acierta en promedio al centro, pero sus dardos quedan desparramados.

**2. La regla y la cuerda.** Un modelo de sesgo alto es una **regla de madera**: no se dobla, y si el terreno es curvo, no lo sigue (subajuste). Uno de varianza alta es una **cuerda de hule** muy flexible: se amolda a cada grano de polvo y pierde la forma general (sobreajuste).

**3. El que memoriza.** Quien se aprende de memoria las respuestas de exámenes de años anteriores tiene error casi cero en esos ejercicios y se desorienta con una pregunta nueva. En el ejemplo de la guía, un polinomio de grado 9 pasa por todos los puntos de entrenamiento (error $0.0$) pero falla con datos nuevos (error $25.0$). El de grado 3 es el mejor equilibrio: error de prueba de $3.1$.

**4. Lo que importa de verdad.** El objetivo no es bajar el error con el que entrenaste, sino encontrar el punto de equilibrio entre ser demasiado simple y demasiado flexible. La curva del error de prueba tiene forma de U, y el mejor modelo está en el fondo. Las secciones que siguen son herramientas para encontrar ese punto.`,
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
        type: 'extra',
        text: t`Imagina que ensayas una presentación frente a cinco amigos. Un día la haces frente a cuatro y la revisa el quinto; al día siguiente rotas quién es el evaluador, hasta que los cinco hayan sido evaluadores una vez. Promediando los cinco comentarios te formas una idea más justa que con un solo oyente: es lo mismo que la validación cruzada de 5 particiones.`,
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
        type: 'intuition',
        title: 'Ensayar con un amigo distinto cada vez, y sacar bolillas devolviéndolas',
        text: t`**1. No siempre hay datos de sobra.** Si no podés apartar un grupo de prueba, hay una salida: reutilizar los mismos datos de forma inteligente.

**2. Validación cruzada: rotar al evaluador.** Ensayás una presentación frente a cinco amigos. Un día la hacés frente a cuatro y la evalúa el quinto. Al día siguiente rotás, hasta que los cinco hayan sido evaluadores una vez. Promediando los cinco comentarios te formás una idea más justa que con un solo oyente. Con datos es igual: se divide en $k$ partes, se entrena con $k-1$ y se evalúa con la que queda, y se repite $k$ veces. Con 100 datos y $k = 5$, cada ajuste usa 80 para entrenar y 20 para evaluar. Sirve especialmente para elegir los "diales" del modelo (los hiperparámetros, que se fijan antes de entrenar), probando varios valores y quedándose con el de menor error.

**3. Bootstrap: sacar bolillas devolviéndolas.** Imaginá una bolsa con bolillas numeradas. Sacás una, anotás el número y **la devolvés**; así hasta tener tantas como la bolsa original. Algunas bolillas aparecen más de una vez y otras no aparecen. De los datos $\{1,2,3,4,5\}$ podría salir $\{2,2,4,5,1\}$. Así se simulan "otras muestras" a partir de una sola, para ver cuánto varía cualquier número que calcules.

**4. Un dato curioso.** La chance de que un dato quede fuera de una muestra así tiende a $0.368$. Eso significa que cada muestra contiene en promedio cerca del 63 % de los datos distintos y deja afuera el 37 %. Esa parte que queda afuera se aprovecha después, en los ensambles.`,
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
        type: 'paragraph',
        text: t`*Usos:* reducir dimensión, visualizar datos, eliminar colinealidad y alimentar otros modelos (regresión sobre componentes principales). *Advertencia:* se deben **estandarizar** las variables antes (si no, domina la de mayor escala), y como PCA **ignora $Y$**, las componentes con más varianza no tienen por qué ser las más útiles para predecir.`,
      },
      {
        type: 'extra',
        text: t`Los talles de ropa son una "primera componente" casual: en vez de dar altura, peso y contorno por separado, el talle (S, M, L) resume en una sola dimensión lo que más varía entre las personas. Se pierde algo (dos personas del mismo talle pueden tener proporciones distintas), pero se conserva lo esencial con mucho menos información.`,
      },
      {
        type: 'intuition',
        title: 'La valija con límite de peso: aceptar un poco de sesgo para ganar estabilidad',
        text: t`**1. El problema.** Cuando tenés muchísimas variables, incluso más que observaciones, la recta del módulo 3 se vuelve inestable o directamente no tiene una solución única. La idea de la regularización es **aceptar perder algo de precisión a cambio de ganar estabilidad**, castigando los pesos demasiado grandes.

**2. La valija.** Armar una valija con límite de peso. **Lasso** es dejar cosas en casa: decidís qué no llevar (el peso queda exactamente en cero) y el resto pasa tal cual. **Ridge** es llevar un poco menos de cada cosa: todo viaja, pero más liviano. Lasso sirve para elegir variables y hacer un modelo más fácil de leer; Ridge sirve para estabilizar sin descartar nada.

**3. El dial $\lambda$.** Controla qué tan estricto es el límite de peso. Con $\lambda = 0$ no hay castigo y se vuelve a la recta común. Con $\lambda$ muy grande, todos los pesos tienden a cero. Se elige probando valores con validación cruzada. Antes de aplicar estos métodos conviene poner todas las variables en la misma escala, porque el castigo depende de la escala de cada una.

**4. PCA: un talle en lugar de tres medidas.** Es una técnica distinta, que no mira la respuesta. Los talles de ropa son una "primera componente" casual: en vez de dar altura, peso y contorno por separado, el talle (S, M, L) resume en una sola dimensión lo que más varía entre las personas. Se pierde algo, pero se conserva lo esencial con mucho menos información. PCA arma nuevas variables que ya no se repiten entre sí, ordenadas de mayor a menor variación. En el ejemplo, la primera de cuatro variables ya explica el 70 % y las dos primeras el 92.5 %, así que se puede trabajar con 2 en vez de 4.

**5. Una advertencia.** Como PCA no mira lo que se quiere predecir, la variable que más varía no tiene por qué ser la más útil para predecir.`,
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
        type: 'extra',
        text: t`Boosting es como preparar un examen con simulacros: tras cada simulacro revisas solo lo que fallaste y estudias eso, sin repasar de nuevo lo que ya sabías. Cada ronda corrige los errores de la anterior y el conocimiento final es la suma de todas esas correcciones pequeñas. Y la varianza de un promedio de 10 árboles con $\sigma^2=4$ y $\rho=0.2$ es $0.2\cdot4 + 0.8\cdot4/10 = 1.12$: más cerca de lo que permite la correlación que del ideal $0.4$.`,
      },
      {
        type: 'intuition',
        title: 'El comité de médicos, el simulacro de examen y la sabiduría de la multitud',
        text: t`**1. Muchos modelos mediocres que se corrigen entre sí.** Un solo árbol de decisión es inestable: si cambian un poco los datos, puede cambiar mucho. Pero muchos árboles juntos pueden dar una respuesta firme. Es la sabiduría de las multitudes: en una feria, ninguna persona acertó el peso de un buey, pero el promedio de todas estuvo muy cerca. Funciona porque los errores individuales, si son independientes, se compensan.

**2. La condición oculta.** Si todos copian la respuesta del vecino, el promedio es tan malo como cada uno. Lo que hace falta son modelos **distintos entre sí**. Con 100 modelos de varianza $4$, si fueran independientes, el promedio tendría varianza de $0.04$. Si se parecen mucho (correlación de $0.5$), la varianza del promedio queda en $2.02$: casi no ayudó.

**3. Bagging: muchos árboles en paralelo.** Se arman muchas muestras como en el truco de las bolillas, se entrena un árbol profundo en cada una y se combinan: promedio (para números) o voto (para categorías). Reduce la varianza. A cambio, ya no se puede leer un solo árbol. Cada árbol deja cerca del 37 % de los datos sin ver, y esos datos sirven para estimar el error de prueba sin necesidad de validación cruzada (estimación *out-of-bag*).

**4. Bosque aleatorio: un comité con consultas distintas.** Si en un panel de médicos hay un especialista muy dominante, todos los diagnósticos se parecen. Si a cada médico solo se le permite consultar un grupo aleatorio de síntomas, las opiniones se diversifican y el voto es más robusto. Eso es un bosque: en cada pregunta de cada árbol, solo se mira una parte de las variables. Agregar más árboles no causa sobreajuste. En el ejemplo, los cinco árboles dieron un promedio de $0.220$, por debajo del umbral $0.50$: la predicción es "no sobrevive".

**5. Boosting: el simulacro de examen.** Tras cada simulacro revisás solo lo que fallaste y estudiás eso, sin repasar lo que ya sabías. Cada ronda corrige los errores de la anterior, y el conocimiento final es la suma de todas esas correcciones pequeñas. Con datos, se entrenan árboles pequeños **en secuencia**, cada uno ajustándose a lo que el anterior no explicó, y se suma una fracción de cada uno. En la caricatura numérica, el error baja de $100$ a $90$ y luego a $72.9$: avanza de a pasos chicos a propósito.

**6. Cuál usar.** El bosque trabaja en paralelo, con árboles profundos, y es difícil de arruinar. El boosting trabaja en secuencia, con árboles chicos, es más sensible a los ajustes y sí puede sobreajustar si pones demasiados árboles. Y en el ejemplo del Titanic, qué modelo sale "mejor" depende de la métrica que elijas.`,
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
        type: 'paragraph',
        text: t`Para más de dos clases, se combinan varias SVM binarias (una contra todas, o una contra una). Los hiperparámetros ($C$, $\gamma$, $d$) se eligen por validación cruzada.`,
      },
      {
        type: 'extra',
        text: t`Para ver el truco en la vida real: en una pista circular de patinaje, los patinadores "buenos" van en el centro y los "novatos" en un anillo alrededor. Ninguna recta separa los dos grupos sobre el mapa. Pero si en lugar de la posición usas la distancia al centro de la pista (una variable nueva), los dos grupos quedan de un lado y del otro de un umbral. Eso es lo que logra un kernel sin tener que construir la variable a mano.`,
      },
      {
        type: 'intuition',
        title: 'El pasillo más ancho entre dos cursos, y el truco de mirar desde otra altura',
        text: t`**1. La mejor frontera es la que deja más espacio.** Imaginá un salón con alumnos de dos cursos que deben quedar en lados opuestos. En vez de trazar el pasillo en cualquier lugar, buscás el pasillo **más ancho posible** entre los dos grupos. Los alumnos que quedan pegados al borde del pasillo son los **vectores de soporte**: si alguien del fondo se cambia de silla, el pasillo no se mueve; si se mueve uno de los pegados al borde, sí.

**2. Cuando los grupos se mezclan un poco.** En la vida real los grupos se solapan. Entonces se tolera que algunos queden dentro del pasillo o del lado equivocado, con una tolerancia que se regula. Más tolerancia: pasillo ancho, más puntos "violan", más sesgo y menos varianza. Menos tolerancia: pasillo angosto, ajuste ceñido, menos sesgo y más varianza.

**3. Cuidado con el nombre $C$.** En el libro del curso, $C$ es un "presupuesto" de violaciones (más $C$ = más tolerancia). En muchas librerías es el peso de la penalización (más $C$ = menos tolerancia). Son opuestos: verificá siempre la definición de tu herramienta.

**4. El truco de mirar desde otra altura.** Imaginá una pista circular de patinaje con los buenos en el centro y los novatos en un anillo alrededor. Ninguna recta los separa sobre el mapa. Pero si, en vez de la posición, usás la **distancia al centro** de la pista, los dos grupos quedan de un lado y del otro de un umbral. Eso es el truco del *kernel*: cambiar la forma de mirar los datos para que una frontera recta sirva. En la guía, el ejemplo es poner $x^2$: los puntos de la clase $+$ en $\pm 3$ pasan a $(\pm 3, 9)$ y los otros a alturas de $0$ y $1$, y la recta $x^2 = 5$ los separa.

**5. Lo notable.** El algoritmo no necesita construir esas variables nuevas: solo necesita medir "qué tan parecidos" son dos puntos, y una función llamada kernel lo calcula directamente. Por eso funciona incluso en espacios enormes. El kernel radial mide similitud local: con $\gamma$ grande la influencia de cada punto es muy local y la frontera se vuelve irregular (sobreajuste); con $\gamma$ pequeño, queda suave.`,
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
      {
        type: 'intuition',
        title: 'Estaciones de servicio y árboles genealógicos: dos maneras de agrupar',
        text: t`**1. K-Means: ubicar estaciones de servicio.** Elegís cuántos grupos querés ($K$) y ubicás $K$ "estaciones" (centroides) en la ciudad de datos. Cada conductor va a la más cercana. Después movés cada estación al centro de los conductores que la usan, y repetís hasta que nadie cambie de estación. El centro de cada grupo es el promedio de sus puntos, y se usa el promedio porque, como viste en el módulo 0, es el valor que minimiza la suma de los cuadrados de las distancias.

**2. Con números.** Con los puntos $1, 2, 4, 10, 11, 13$ y dos estaciones iniciales en $1$ y $10$, quedan los grupos $\{1,2,4\}$ y $\{10,11,13\}$, con centros en $2.33$ y $11.33$. Al reasignar no cambia nadie y termina.

**3. Sus límites.** Hay que decidir cuántos grupos de antemano. Como el error siempre baja al sumar grupos, se mira el "codo": el punto donde la mejora se aplana. El resultado depende del arranque (se prueban varios), prefiere grupos compactos y redondeados, y es sensible a los valores raros y a la escala (conviene estandarizar). Con clientes de una verdulería, si el gasto está en miles de pesos y la frecuencia en visitas por mes, el gasto dominaría las distancias si no estandarizás.

**4. Clustering jerárquico: un árbol genealógico.** No hace falta decidir cuántos grupos antes. Cada punto empieza solo, y se van juntando los dos grupos más cercanos, una y otra vez, hasta formar uno solo. El historial se dibuja como un árbol (dendrograma), y **cortarlo a cierta altura** es elegir cuántos grupos querés: un corte bajo da muchos grupos muy parecidos por dentro; uno alto, pocos y amplios.

**5. ¿Cuán cerca están dos grupos?** Hay que elegir cómo medirlo. Con los mismos puntos de antes, la distancia entre $\{1,2,4\}$ y $\{10,11,13\}$ es $6$ si se mide entre los más cercanos, $12$ si es entre los más lejanos y $9$ si se promedian todos los pares. La elección del criterio puede cambiar el resultado.`,
      },
    ],
  },
]
