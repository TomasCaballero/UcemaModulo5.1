import type { ContentBlock, Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 4. Los bloques extra son ejemplos
// agregados (cotidianos o clásicos): no son de la guía y se muestran rotulados.
const t = String.raw

/** Apertura del módulo, previa a la sección 4.1. */
export const module4Intro: ContentBlock[] = [
  {
    type: 'paragraph',
    text: t`La **minería de datos** combina informática y estadística para **extraer patrones útiles de grandes volúmenes de datos**. A diferencia de la econometría (Módulo 3), que busca sobre todo **explicar y estimar efectos causales**, aquí el foco suele estar en **predecir y descubrir estructura**, aunque no siempre sepamos "por qué".`,
  },
  { type: 'paragraph', text: '**Vocabulario base:**' },
  {
    type: 'list',
    items: [
      t`**Registro** (o instancia, observación): una fila de datos (un cliente, una transacción).`,
      t`**Atributo** (o variable, característica): una columna (edad, monto de compra).`,
      t`**Clase** (o etiqueta): el atributo que queremos predecir (¿pagó el crédito? sí/no).`,
    ],
  },
  { type: 'paragraph', text: '**Dos familias de tareas:**' },
  {
    type: 'list',
    items: [
      t`**Predictivas** (hay una variable objetivo): clasificación (predecir una categoría) y regresión (predecir un número).`,
      t`**Descriptivas** (no hay objetivo; se busca estructura): asociación (qué cosas ocurren juntas), agrupamiento o *clustering* (qué registros se parecen) y detección de anomalías.`,
    ],
  },
]

export const module4Sections: Section[] = [
  {
    id: '4.1',
    moduleId: 4,
    title: 'El proceso KDD (Knowledge Discovery in Databases)',
    blocks: [
      { type: 'paragraph', text: 'Extraer conocimiento no es "correr un algoritmo": es un ciclo completo.' },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**Preprocesamiento**: limpiar, integrar y transformar los datos brutos. Suele ser la etapa que **más tiempo consume**.`,
          t`**Minería de datos**: aplicar los algoritmos que extraen patrones.`,
          t`**Postprocesamiento**: interpretar, evaluar, visualizar y decidir si los patrones son útiles, nuevos y válidos.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Cocinar con datos: preparar, cocinar y probar',
        text: t`**No es "apretar un botón".** Sacar conocimiento de los datos es un proceso con tres etapas, y se parece mucho a preparar una comida para invitados.

**Primero, preparar los ingredientes:** comprar, lavar, pelar y cortar. Con datos es limpiar, unir tablas, corregir errores y rellenar lo que falta. Casi siempre es lo que **más tiempo lleva**, y si se saltea, el mejor cocinero no salva la comida.

**Segundo, cocinar:** aplicar los algoritmos que encuentran patrones. Es la parte que todos imaginan, pero es la más corta.

**Tercero, probar y ajustar:** ver si el plato sirve. Con datos es interpretar los resultados y decidir si los patrones son útiles, nuevos y válidos.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* un banco quiere detectar fraudes. (1) Une las tablas de transacciones y clientes, corrige errores y rellena faltantes. (2) Entrena un clasificador. (3) Revisa cuántos fraudes detecta y cuántas falsas alarmas genera, y lo presenta al equipo de riesgo.`,
      },
      {
        type: 'intuition',
        title: 'Un ejemplo con el banco',
        text: t`**Un ejemplo.** Un banco quiere detectar fraudes. Primero junta las tablas de transacciones y de clientes, y arregla errores. Después entrena un modelo. Al final revisa cuántos fraudes detecta y cuántas falsas alarmas genera, y se lo presenta al equipo de riesgo. Ninguna de las tres etapas sobra.`,
      },
      {
        type: 'extra',
        text: t`Es como preparar una comida para invitados. Primero compras, lavas, pelas y cortas los ingredientes (preprocesamiento: casi siempre lo que más tiempo lleva). Después cocinas (minería de datos). Y al final pruebas el plato, ajustas la sal y decides si está listo para servir (postprocesamiento). Si omites la primera etapa, el mejor cocinero no salva la comida.`,
      },
    ],
  },
  {
    id: '4.2',
    moduleId: 4,
    title: 'Preprocesamiento',
    blocks: [
      {
        type: 'list',
        items: [
          t`**Limpieza**: tratar duplicados, errores, valores atípicos y faltantes (Módulo 2.3).`,
          t`**Agregación**: combinar registros en uno solo (ventas por día en lugar de por ticket); reduce volumen y suaviza el ruido.`,
          t`**Muestreo**: trabajar con un subconjunto representativo cuando los datos completos son demasiados. Debe ser aleatorio (o estratificado) para que la muestra conserve la composición de la población.`,
          t`**Reducción de dimensionalidad**: la **dimensión** es el número de atributos. Con muchos atributos, los datos se vuelven "ralos": hay poquísimos registros por cada región del espacio y las distancias pierden sentido (la llamada **maldición de la dimensionalidad**). Se reduce eliminando atributos redundantes o irrelevantes, o combinándolos en un número menor de atributos nuevos.`,
          t`**Discretización**: convertir un atributo continuo en categorías. *Ejemplo:* edad → Joven (< 30), Adulto (30-59), Mayor (≥ 60).`,
          t`**Binarización y codificación *one-hot***: convertir una categoría en columnas 0/1. *Ejemplo:* el atributo "color" con valores {rojo, azul, verde} pasa a tres columnas "es_rojo", "es_azul", "es_verde", donde solo una vale 1. Muchos algoritmos exigen números, y asignar 1, 2, 3 a categorías sugeriría un orden que no existe.`,
          t`**Escalado de atributos**: poner variables en escalas comparables, importante en métodos basados en distancias.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Dejar los datos listos: limpiar, simplificar y traducir a números',
        text: t`**Limpiar y simplificar.** Antes de nada se quitan duplicados, errores y faltantes. Después, si hay demasiado, se pueden juntar registros (ventas por día en vez de por ticket) o trabajar con una muestra bien elegida, aleatoria, para que conserve la composición del total.

**Demasiadas columnas estorban.** Con muchísimos atributos, los datos quedan "ralos": hay muy pocos registros para cada rincón del espacio y las distancias pierden sentido. Es como buscar a una persona en una ciudad enorme con muy pocos datos de cada una. Por eso se reducen atributos eliminando los repetidos o inútiles, o combinándolos en menos.

**Traducir a números sin inventar órdenes.** Muchos algoritmos solo entienden números. Si asignás 1, 2, 3 al estado civil (soltero, casado, viudo), el modelo creería que "viudo" vale el triple que "soltero". La solución es una columna de sí/no para cada categoría (*one-hot*): solo una vale 1. También se puede agrupar un número continuo en categorías: edad en Joven, Adulto o Mayor.`,
      },
      {
        type: 'list',
        items: [
          t`**Min-max**: $x' = \dfrac{x - x_{\min}}{x_{\max} - x_{\min}}$ lleva los valores a $[0,1]$. *Ejemplo:* ingresos entre 10 000 y 50 000: el valor 20 000 pasa a $(20-10)/(50-10) = 0.25$.`,
          t`**Estandarización** (puntaje $z$, Módulo 2.4): $z = (x-\bar{x})/s$ deja media 0 y desviación 1.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Poner todo en la misma escala',
        text: t`**Poner todo en la misma escala.** Si comparás a dos personas por altura en metros (1.70 y 1.80) y por peso en kilos (60 y 90), la diferencia de peso (30) aplasta a la de altura (0.10) solo por las unidades. El escalado lo corrige para que ambas pesen parecido. Una forma (min-max) lleva todo a una escala de 0 a 1: un ingreso de 20 000 entre 10 000 y 50 000 pasa a $0.25$. Otra (estandarización) deja la media en 0 y la dispersión en 1.`,
      },
      {
        type: 'extra',
        text: t`Si comparas dos personas por altura (en metros: 1.70 y 1.80) y peso (en kilos: 60 y 90), la diferencia de peso (30) aplasta a la de altura (0.10) al calcular distancias, solo por las unidades. Con min-max, si las alturas van de 1.50 a 2.00 y los pesos de 50 a 100, la altura 1.70 pasa a $(1.70-1.50)/0.50 = 0.4$ y el peso 60 a $(60-50)/50 = 0.2$: ahora ambas variables pesan parecido. Y para one-hot, el "estado civil" {soltero, casado, viudo} se vuelve tres columnas 0/1; si lo codificaras 1, 2, 3, el modelo creería que viudo "vale el triple" que soltero.`,
      },
    ],
  },
  {
    id: '4.3',
    moduleId: 4,
    title: 'Clasificación predictiva',
    blocks: [
      {
        type: 'paragraph',
        text: t`**Clasificar** es asignar cada registro a una **clase predefinida**. Se aprende de ejemplos con la clase conocida y se aplica a registros nuevos.`,
      },
      {
        type: 'intuition',
        title: 'Aprender de ejemplos con respuesta',
        text: t`**Aprender de ejemplos con respuesta.** Clasificar es asignar cada caso a una categoría que ya conocemos (¿paga el crédito o no?). Se aprende de casos pasados, cuya respuesta se sabe, y se aplica a casos nuevos.`,
      },
      {
        type: 'paragraph',
        text: t`**Entrenamiento y prueba.** Un modelo no debe evaluarse con los mismos datos con que se construyó, porque un modelo puede **memorizar** esos datos y fallar con datos nuevos. Por eso se separan:`,
      },
      {
        type: 'list',
        items: [
          t`**Conjunto de entrenamiento**: se usa para construir el modelo.`,
          t`**Conjunto de prueba**: datos que el modelo **nunca vio**, usados solo para medir su rendimiento real.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Cuando un modelo rinde muy bien en entrenamiento y mal en prueba, hay **sobreajuste** (*overfitting*): aprendió el ruido en lugar del patrón.`,
      },
      {
        type: 'paragraph',
        text: t`**Partición estratificada.** Al separar entrenamiento y prueba conviene **estratificar** por la variable objetivo: las dos partes conservan la misma proporción de cada clase. *Ejemplo de clase (Titanic, Kaggle: 891 pasajeros, de los que sobrevivió el 38.4 %):* se usó el 70 % para entrenar (623 pasajeros) y el 30 % para probar (268). Toda transformación que se aprende de los datos (por ejemplo, imputar la edad faltante con la **mediana**) se calcula **solo con el entrenamiento** y después se aplica a la prueba; si no, información de la prueba se "filtra" al modelo y la evaluación queda optimista.`,
      },
      {
        type: 'intuition',
        title: 'No se evalúa con lo que ya estudió',
        text: t`**No se evalúa con lo que ya estudió.** Si estudiás con los mismos ejercicios que después te toman, sacás 10 aunque hayas memorizado las respuestas, y te va mal con ejercicios nuevos. Por eso los datos se separan en un grupo de **entrenamiento** y un grupo de **prueba** que el modelo nunca vio. Cuando rinde muy bien en el primero y mal en el segundo, hay **sobreajuste**: aprendió el ruido en vez del patrón. Y si se separan los grupos, conviene que ambos mantengan la misma proporción de cada clase (partición estratificada). Además, cualquier ajuste que se aprende de los datos (como rellenar edades con la mediana) debe calcularse solo con el entrenamiento, para que información de la prueba no se "filtre".`,
      },
      {
        type: 'extra',
        text: t`Es la diferencia entre estudiar con los mismos ejercicios que después te toman y rendir un examen con ejercicios nuevos. Si memorizaste las respuestas del cuadernillo, sacas 10 en la práctica y te va mal en el examen real. El conjunto de prueba es el examen con preguntas que no viste.`,
      },
      { type: 'miniCheck', questionIds: ['m4-q08'] },
      { type: 'subheading', text: 'Árboles de decisión' },
      {
        type: 'paragraph',
        text: t`Un **árbol de decisión** clasifica mediante una secuencia de preguntas sobre los atributos:`,
      },
      {
        type: 'list',
        items: [
          t`**Nodo interno**: una pregunta ("¿ingreso > 3000?").`,
          t`**Rama**: cada respuesta posible.`,
          t`**Hoja**: la clase asignada.`,
        ],
      },
      { type: 'paragraph', text: t`Ventaja principal: son **interpretables** (se leen como reglas "si... entonces...").` },
      {
        type: 'paragraph',
        text: t`**¿Cómo elige el árbol qué pregunta hacer?** Busca la división que deja **grupos lo más "puros" posible** (donde casi todos los registros son de la misma clase).`,
      },
      {
        type: 'analogy',
        text: t`**Analogía de las 20 preguntas:** para adivinar un animal, la primera pregunta eficiente no es "¿es un caniche?", sino "¿es un vertebrado?", porque divide el conjunto en grupos muy distintos. Las mejores preguntas son las que más reducen la incertidumbre.`,
      },
      {
        type: 'paragraph',
        text: t`La **impureza** de un nodo se mide con dos criterios habituales. Si $p_c$ es la proporción de la clase $c$ en el nodo:`,
      },
      {
        type: 'list',
        items: [
          t`**Entropía**: $H = -\sum_c p_c \log_2 p_c$ (en bits). Vale $0$ en un nodo puro y es máxima cuando las clases están parejas.`,
          t`**Índice Gini**: $G = 1 - \sum_c p_c^2$. También vale $0$ en un nodo puro.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`La **ganancia de información** de una división es la entropía del nodo padre **menos** la entropía promedio de los hijos, ponderada por su tamaño. Se elige la división con mayor ganancia.`,
      },
      {
        type: 'paragraph',
        text: t`**Ejemplo con números.** Un nodo con 10 clientes: 6 pagan y 4 no ($p = 0.6$ y $0.4$).`,
      },
      {
        type: 'list',
        items: [t`Entropía: $-(0.6\log_2 0.6 + 0.4\log_2 0.4) \approx 0.971$. Gini: $1 - (0.36+0.16) = 0.48$.`],
      },
      { type: 'paragraph', text: 'Una pregunta lo divide así:' },
      {
        type: 'list',
        items: [
          t`Hijo izquierdo: 5 clientes (4 pagan, 1 no): entropía $\approx 0.722$; Gini $= 0.32$.`,
          t`Hijo derecho: 5 clientes (2 pagan, 3 no): entropía $\approx 0.971$; Gini $= 0.48$.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Entropía ponderada de los hijos: $0.5\times0.722 + 0.5\times0.971 \approx 0.847$. **Ganancia de información** $= 0.971 - 0.847 \approx 0.12$. (En Gini, la reducción es $0.48 - 0.40 = 0.08$.) El árbol probaría todas las preguntas candidatas y se quedaría con la de mayor ganancia, y repetiría el proceso en cada hijo.`,
      },
      {
        type: 'intuition',
        title: 'Árbol de decisión: el juego de las veinte preguntas',
        text: t`**Árbol de decisión: el juego de las veinte preguntas.** Para adivinar un animal, la primera pregunta eficiente no es "¿es un caniche?", sino "¿es un vertebrado?", porque separa el conjunto en grupos muy distintos. El árbol hace lo mismo: elige la pregunta que deja los grupos lo más **"puros"** posible, es decir, donde casi todos son de la misma clase. Las medidas de pureza (entropía y Gini) valen cero en un grupo puro. En el ejemplo de la guía, partir 10 clientes con 6 que pagan y 4 que no, en dos grupos, reduce la entropía de $0.971$ a $0.847$: una ganancia de aproximadamente $0.12$. Se prueban todas las preguntas y se queda con la mejor.`,
      },
      {
        type: 'extra',
        text: t`La entropía mide cuánta sorpresa hay: una moneda justa tiene entropía de 1 bit (no puedes anticipar el resultado). Una moneda cargada que cae cara el 90 % de las veces tiene $-(0.9\log_2 0.9 + 0.1\log_2 0.1) \approx 0.469$ bits: ya casi sabes qué va a pasar. Para un árbol que decide "¿llevo paraguas?", una buena primera pregunta es "¿el cielo está cubierto?", porque separa los días mayormente secos de los mayormente lluviosos y baja la entropía de cada grupo.`,
      },
      {
        type: 'paragraph',
        text: t`**Comparar dos preguntas con el Gini ponderado.** Para elegir la pregunta, se calcula el Gini de cada hijo y se promedian ponderando por su tamaño. *Ejemplo de clase (Titanic, entrenamiento: 623 pasajeros, 239 sobrevivieron):*`,
      },
      {
        type: 'list',
        items: [
          t`Opción A, "¿es mujer?": 217 mujeres (163 sobrevivieron, 54 no), Gini $\approx 0.374$; 406 hombres (76 sobrevivieron, 330 no), Gini $\approx 0.304$. Gini ponderado $= \tfrac{217}{623}\cdot 0.374 + \tfrac{406}{623}\cdot 0.304 \approx 0.329$.`,
          t`Opción B, "¿viaja en 3.ª clase?": 346 pasajeros (86 sobrevivieron, 260 no), Gini $\approx 0.374$; 277 pasajeros (153 sobrevivieron, 124 no), Gini $\approx 0.495$. Gini ponderado $\approx 0.427$.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Como $0.329 < 0.427$, el árbol abre con "¿es mujer?": la división que deja los hijos más puros.`,
      },
      {
        type: 'paragraph',
        text: t`**El árbol del Titanic (ejemplo de clase, profundidad 3).** La raíz contiene los 623 pasajeros de entrenamiento (239 sobrevivieron, $38.4\,\%$) y pregunta "¿es mujer?". Para clasificar a un pasajero se sigue **un único camino** desde la raíz hasta una hoja: por ejemplo, un hombre de 3.ª clase responde "¿es mujer?" $\to$ no, "¿clase = 3?" $\to$ sí, y llega a una hoja con **baja** probabilidad de sobrevivir; una mujer de 1.ª clase llega a una hoja con probabilidad alta. Los componentes son el **nodo raíz** (primera pregunta), los **nodos internos**, las **ramas** (respuestas) y las **hojas** (predicción: la proporción de sobrevivientes del entrenamiento que cayó en ellas). Un árbol no usa una fórmula única: toma decisiones a partir de preguntas sucesivas.`,
      },
      {
        type: 'intuition',
        title: 'El caso del Titanic',
        text: t`**El caso del Titanic.** La mejor primera pregunta resultó ser "¿es mujer?", porque deja los dos grupos más puros que otras opciones. Para clasificar a un pasajero se sigue un único camino de preguntas hasta una hoja, y la predicción es la proporción de sobrevivientes del entrenamiento que cayó ahí.`,
      },
      { type: 'miniCheck', questionIds: ['m4-q14'] },
      {
        type: 'paragraph',
        text: t`**Sobreajuste y poda.** Si el árbol sigue dividiendo hasta que cada hoja tenga un solo registro, memoriza el entrenamiento. Se controla **limitando la profundidad**, exigiendo un mínimo de registros por hoja, o **podando** ramas que no mejoran el rendimiento en datos de validación.`,
      },
      {
        type: 'paragraph',
        text: t`**¿Un árbol más grande es siempre mejor? (ejemplo de clase).** No. Al crecer, el AUC en entrenamiento sube casi siempre, pero el AUC en prueba mejora solo hasta cierto punto. En el Titanic de la clase (variables sexo, edad y clase), con max_depth de 1 a 5 el AUC de entrenamiento fue $0.771$, $0.821$, $0.863$, $0.884$ y $0.900$, y el árbol sin límite (107 hojas) llegó a $0.958$. En prueba, el mejor valor apareció con max_depth = 3 ($0.833$); con más profundidad no se recuperó ($0.793$ y $0.804$) y el árbol completo cayó a $0.768$: **más complejidad puede mejorar el entrenamiento y empeorar la prueba**. Los hiperparámetros que se suelen ajustar son max_depth (profundidad máxima), min_samples_split (mínimo de observaciones para dividir un nodo), min_samples_leaf (mínimo permitido en una hoja), max_leaf_nodes (límite de hojas) y ccp_alpha (poda). La proporción de sobrevivientes de entrenamiento que cayó en una hoja es la **probabilidad estimada** para los pasajeros nuevos que lleguen a ella.`,
      },
      {
        type: 'intuition',
        title: 'Un árbol más grande no es mejor',
        text: t`**Un árbol más grande no es mejor.** Si dejás que pregunte hasta tener una pregunta por registro, memoriza. En el ejemplo de clase, el rendimiento en entrenamiento sube siempre al agrandar el árbol, pero en prueba el mejor resultado aparece con profundidad 3 y después empeora. Se evita limitando la profundidad, exigiendo un mínimo de casos por hoja o podando ramas.`,
      },
      { type: 'subheading', text: 'Evaluación: la matriz de confusión' },
      {
        type: 'paragraph',
        text: t`Para una clasificación de dos clases (positivo/negativo), cada predicción cae en una de cuatro celdas:`,
      },
      {
        type: 'table',
        headers: ['', 'Predicho **positivo**', 'Predicho **negativo**'],
        rows: [
          ['**Real positivo**', '**VP** (verdadero positivo)', '**FN** (falso negativo)'],
          ['**Real negativo**', '**FP** (falso positivo)', '**VN** (verdadero negativo)'],
        ],
      },
      { type: 'paragraph', text: 'Métricas derivadas:' },
      {
        type: 'list',
        items: [
          t`**Exactitud** (*accuracy*) $= \dfrac{VP+VN}{\text{total}}$: proporción de aciertos.`,
          t`**Precisión** (*precision*) $= \dfrac{VP}{VP+FP}$: de todo lo que **predije** como positivo, ¿cuánto lo era realmente?`,
          t`**Exhaustividad / Sensibilidad** (*recall*) $= \dfrac{VP}{VP+FN}$: de todos los positivos **reales**, ¿cuántos detecté?`,
          t`**Especificidad** (*specificity*) $= \dfrac{VN}{VN+FP}$: de todos los negativos **reales**, ¿cuántos identifiqué correctamente como negativos?`,
          t`**$F_1$** $= \dfrac{2\cdot\text{precisión}\cdot\text{recall}}{\text{precisión}+\text{recall}}$: un solo número que equilibra las dos.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Cómo medir aciertos y errores',
        text: t`**Cómo medir los aciertos y errores.** Hay cuatro tipos de respuesta: acertar enfermos (VP), acertar sanos (VN), decir "enfermo" a un sano (FP) y decir "sano" a un enfermo (FN). De ahí salen varias medidas, y cada una responde una pregunta distinta:

**Exactitud:** ¿cuántas veces acerté en total? **Precisión:** de todos los que marqué como positivos, ¿cuántos lo eran? **Recall:** de todos los positivos reales, ¿a cuántos encontré? **Especificidad:** de todos los negativos reales, ¿a cuántos identifiqué bien?`,
      },
      {
        type: 'workedExample',
        title: t`**Ejemplo.** De 100 pacientes, 10 están enfermos. El modelo da: $VP=8$, $FN=2$, $FP=18$, $VN=72$.`,
        steps: [
          t`Exactitud: $(8+72)/100 = 0.80$.`,
          t`Precisión: $8/(8+18) \approx 0.31$. Recall: $8/(8+2) = 0.80$. Especificidad: $72/(72+18) = 0.80$.`,
        ],
        result: t`$F_1 \approx 0.44$`,
      },
      { type: 'miniCheck', questionIds: ['m4-q05'] },
      {
        type: 'paragraph',
        text: t`**¿Por qué la exactitud puede engañar?** Un modelo que dice "nadie está enfermo" acierta en 90 de los 100: **exactitud del 90 %**, pero **recall $=0$**: no detecta a ningún enfermo. Cuando una clase es rara (fraude, enfermedades), la exactitud es una mala métrica. Además, la **precisión baja** del ejemplo es la misma intuición del test médico del Módulo 0.2 (Bayes): cuando los positivos son pocos, aun un buen test genera muchos falsos positivos en términos relativos.`,
      },
      {
        type: 'intuition',
        title: 'Por qué la exactitud puede engañar',
        text: t`**Por qué la exactitud puede engañar.** Con 100 pacientes y 10 enfermos, un modelo que dice "nadie está enfermo" acierta 90 de 100 (exactitud de 90 %) pero no detecta a nadie (recall igual a 0). Cuando lo que buscás es raro, la exactitud es mala medida. En el ejemplo de la guía, la precisión baja ($0.31$) es el mismo fenómeno que viste con el test médico del módulo 0: cuando hay pocos positivos, hasta un buen test genera muchos falsos positivos en proporción.`,
      },
      {
        type: 'paragraph',
        text: t`**Qué priorizar:** si un falso negativo es muy costoso (no detectar un cáncer), importa el **recall**; si lo costoso es un falso positivo (bloquear a un cliente legítimo), importa la **precisión**.`,
      },
      {
        type: 'paragraph',
        text: t`**El umbral cambia las métricas, no el modelo.** Un modelo que entrega probabilidades se convierte en clasificador al fijar un **umbral** $t$: se predice positivo si $\hat{p} \ge t$. Con el mismo modelo, subir $t$ lo vuelve más exigente (sube la precisión y la especificidad, pero puede bajar el recall) y bajarlo hace lo contrario. *Ejemplo ilustrativo (cifras inventadas):* 8 pasajeros con probabilidades estimadas $0.95, 0.85, 0.60, 0.55, 0.45, 0.35, 0.20, 0.10$; sobrevivieron 5 de ellos (los de probabilidad $0.95$, $0.85$, $0.55$, $0.45$ y $0.20$).`,
      },
      {
        type: 'table',
        illustrative: true,
        headers: ['Umbral', 'VP', 'FP', 'FN', 'VN', 'Recall', 'Precisión', 'Especificidad'],
        rows: [
          ['$0.30$', '4', '2', '1', '1', '$0.80$', '$0.67$', '$0.33$'],
          ['$0.50$', '3', '1', '2', '2', '$0.60$', '$0.75$', '$0.67$'],
          ['$0.70$', '2', '0', '3', '3', '$0.40$', '$1.00$', '$1.00$'],
        ],
      },
      {
        type: 'paragraph',
        text: t`**No existe un umbral universalmente óptimo:** la elección es una decisión posterior al modelo y depende del **costo de cada error**. Si un falso negativo es muy caro (medicina: dejar pasar a un paciente enfermo), conviene un umbral más bajo para ganar recall. Si lo caro es el falso positivo (fraude: bloquear clientes legítimos), conviene uno más alto para ganar precisión y especificidad; en riesgo crediticio el corte equilibra la mora esperada con el negocio aprobado. El mejor punto de corte no es el que maximiza una métrica por definición, sino el que mejor representa el objetivo y el costo de los errores. **Buena práctica:** elegirlo con entrenamiento y validación (o repitiendo la validación sobre distintas particiones de los datos) y reservar la **prueba** para la evaluación final.`,
      },
      {
        type: 'intuition',
        title: 'Qué cuidar depende de qué cuesta más',
        text: t`**Qué cuidar depende de qué cuesta más.** Si no detectar un cáncer es gravísimo, importa el recall. Si bloquear a un cliente legítimo es lo caro, importa la precisión. Y el **umbral** (qué tan seguro debe estar el modelo para decir "positivo") se elige según ese costo: subirlo lo vuelve más exigente, bajarlo lo vuelve más permisivo. Es una decisión posterior al modelo, no una propiedad del modelo.`,
      },
      { type: 'miniCheck', questionIds: ['m4-q15'] },
      {
        type: 'extra',
        text: t`Un filtro de spam sobre 100 correos, de los cuales 20 son spam: detecta 15 ($VP=15$), deja pasar 5 ($FN=5$), marca por error 4 correos buenos ($FP=4$) y acierta 76 correos buenos ($VN=76$). Exactitud $=(15+76)/100 = 0.91$; precisión $=15/19 \approx 0.79$ (de lo que marcó como spam, el 79 % lo era); recall $=15/20 = 0.75$ (detectó tres cuartos del spam); $F_1 = 2\cdot15/(2\cdot15+4+5) \approx 0.77$. Aquí un falso positivo duele (perder un correo importante), así que se cuida la precisión.`,
      },
    ],
  },
  {
    id: '4.4',
    moduleId: 4,
    title: 'Análisis de asociación y algoritmo Apriori',
    blocks: [
      {
        type: 'paragraph',
        text: t`Busca **qué elementos suelen aparecer juntos** (análisis de la cesta de la compra). Vocabulario:`,
      },
      {
        type: 'list',
        items: [
          t`**Transacción**: un conjunto de ítems comprados juntos.`,
          t`**Conjunto de ítems** (*itemset*): un grupo de ítems, por ejemplo $\{\text{pan, leche}\}$.`,
          t`**Regla de asociación** $A \rightarrow B$: "quien compra $A$ suele comprar $B$".`,
        ],
      },
      {
        type: 'intuition',
        title: 'La pregunta del supermercado',
        text: t`**La pregunta del supermercado.** ¿Qué cosas suelen aparecer juntas en el mismo ticket? Eso es analizar "la cesta de la compra". Una regla como "pañales → cerveza" dice: quienes compran pañales suelen comprar también cerveza.`,
      },
      { type: 'paragraph', text: '**Tres medidas:**' },
      {
        type: 'list',
        items: [
          t`**Soporte** de un conjunto: fracción de transacciones que lo contienen. Mide **qué tan frecuente** es.`,
          t`**Confianza** de $A \rightarrow B$: $\dfrac{\text{soporte}(A\cup B)}{\text{soporte}(A)}$ $= P(B \mid A)$. De los que compran $A$, ¿qué fracción compra también $B$?`,
          t`**Lift** de $A \rightarrow B$: $\dfrac{\text{confianza}(A\rightarrow B)}{\text{soporte}(B)}$. Compara con lo que se esperaría **si $A$ y $B$ fueran independientes**: $>1$ asociación positiva; $=1$ independientes; $<1$ asociación negativa. La confianza sola engaña: si casi todos compran $B$, cualquier regla hacia $B$ tendrá confianza alta sin ser informativa.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Tres medidas con palabras de todos los días',
        text: t`**Tres medidas, con palabras de todos los días.**

**Soporte:** qué tan frecuente es un combo. Si 3 de 5 tickets llevan pañales y cerveza, el soporte es $3/5 = 0.6$.

**Confianza:** de los que compraron lo primero, ¿qué fracción compró también lo segundo? De 4 tickets con pañales, 3 llevan cerveza: $0.75$.

**Lift:** compara esa confianza con lo que pasaría si las dos cosas no tuvieran nada que ver. Mayor que 1, hay asociación real; igual a 1, son independientes; menor que 1, se evitan entre sí.`,
      },
      { type: 'paragraph', text: '**Ejemplo con 5 transacciones:**' },
      {
        type: 'table',
        headers: ['N.º', 'Ítems'],
        rows: [
          ['1', 'pan, leche'],
          ['2', 'pan, pañales, cerveza, huevos'],
          ['3', 'leche, pañales, cerveza, cola'],
          ['4', 'pan, leche, pañales, cerveza'],
          ['5', 'pan, leche, pañales, cola'],
        ],
      },
      {
        type: 'list',
        items: [
          t`Soporte$\{\text{pañales, cerveza}\} = 3/5 = 0.6$; soporte$\{\text{pañales}\} = 4/5$; soporte$\{\text{cerveza}\} = 3/5$.`,
          t`Regla pañales $\rightarrow$ cerveza: confianza $= 3/4 = 0.75$; lift $= 0.75/0.6 = 1.25$ (asociación positiva moderada).`,
          t`Regla pan $\rightarrow$ leche: soporte$\{\text{pan, leche}\} = 3/5$; confianza $= 3/4 = 0.75$; lift $= 0.75/0.8 = 0.94$ (ligeramente por debajo de 1: **no** hay asociación real, aunque la confianza sea alta).`,
        ],
      },
      {
        type: 'intuition',
        title: 'Por qué la confianza sola engaña',
        text: t`**Por qué la confianza sola engaña.** Si casi todos compran pan, cualquier regla que termine en "pan" va a tener confianza alta, sin aportar información: aunque el queso no tenga nada que ver con el pan, casi todos los que compran queso llevan pan simplemente porque el pan está en casi todos los carritos. El lift pone la confianza en contexto. En el ejemplo de la guía, "pan → leche" tiene confianza $0.75$ pero un lift de $0.94$, ligeramente por debajo de 1: no hay asociación real.`,
      },
      {
        type: 'extra',
        text: t`Sobre 100 tickets de un supermercado, 90 llevan pan y 20 llevan queso; 18 llevan los dos. La regla queso $\rightarrow$ pan tiene confianza $18/20 = 0.90$, que suena muy alta. Pero el pan está en el 90 % de todos los tickets, así que el lift es $0.90/0.90 = 1$: saber que alguien compró queso no cambia la probabilidad de que compre pan. La confianza sola engaña; el lift la pone en contexto.`,
      },
      {
        type: 'paragraph',
        text: t`**El problema computacional.** Con 1000 ítems existen más de $2^{1000}$ combinaciones posibles: es imposible evaluarlas todas.`,
      },
      { type: 'miniCheck', questionIds: ['m4-q07'] },
      {
        type: 'paragraph',
        text: t`**Algoritmo Apriori.** Se apoya en la propiedad: **si un conjunto de ítems es infrecuente, todos los conjuntos que lo contienen (sus superconjuntos) también lo son**. (Si pocos compran pan y cerveza juntos, menos aún comprarán pan, cerveza *y* pañales.) Así, se avanza **por niveles** y se **descarta sin contar**.`,
      },
      {
        type: 'paragraph',
        text: t`*Con soporte mínimo $= 3$ transacciones (0.6):*`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**Ítems individuales.** Conteos: pan 4, leche 4, pañales 4, cerveza 3, huevos 1, cola 2. Quedan los frecuentes: pan, leche, pañales, cerveza. **Huevos y cola se descartan** y con ellos todos los conjuntos que los contengan, sin evaluarlos.`,
          t`**Pares** (solo con ítems frecuentes): $\{\text{pan, leche}\}$ 3 ✓; $\{\text{pan, pañales}\}$ 3 ✓; $\{\text{pan, cerveza}\}$ 2 ✗; $\{\text{leche, pañales}\}$ 3 ✓; $\{\text{leche, cerveza}\}$ 2 ✗; $\{\text{pañales, cerveza}\}$ 3 ✓.`,
          t`**Tríos:** el único candidato cuyos subconjuntos son todos frecuentes es $\{\text{pan, leche, pañales}\}$, y tiene conteo 2 ✗. Todos los demás tríos contienen un par infrecuente y se descartan sin contarlos.`,
        ],
      },
      {
        type: 'intuition',
        title: 'El truco para no revisar millones de combinaciones',
        text: t`**El truco para no revisar millones de combinaciones.** Con 1000 productos hay más de $2^{1000}$ combos posibles: es imposible mirarlos todos. El algoritmo Apriori usa una idea lógica: **si un combo es raro, cualquier combo más grande que lo incluya también lo es**. Si pocos compran pan y cerveza juntos, menos aún comprarán pan, cerveza y pañales. Entonces se avanza por niveles: primero productos sueltos, se descarta lo infrecuente y solo se arman combos con lo que sobrevivió.`,
      },
      {
        type: 'paragraph',
        text: t`Con los conjuntos frecuentes se generan reglas y se filtran por confianza y lift. *Advertencia:* una regla describe **co-ocurrencia**, no causalidad: no implica que comprar pañales cause comprar cerveza.`,
      },
      {
        type: 'intuition',
        title: 'Una advertencia: co-ocurrencia no es causa',
        text: t`**Una advertencia.** Las reglas describen cosas que ocurren juntas, no que una cause la otra. Comprar pañales no hace comprar cerveza.`,
      },
    ],
  },
  {
    id: '4.5',
    moduleId: 4,
    title: 'Agrupamiento (clustering) y DBSCAN',
    blocks: [
      {
        type: 'paragraph',
        text: t`El **agrupamiento** es una tarea **no supervisada** (no hay clase conocida): se busca organizar los registros en **grupos** de modo que los de un mismo grupo se parezcan entre sí y se diferencien de los otros. Para decir "se parecen" se necesita una **medida de distancia**; la más común es la **distancia euclídea** (la recta entre dos puntos): en 2D, entre $(1,2)$ y $(4,6)$ es $\sqrt{3^2+4^2} = 5$.`,
      },
      {
        type: 'intuition',
        title: 'Agrupar sin etiquetas',
        text: t`**Sin respuestas conocidas.** Acá nadie te dice qué grupo es cuál: la máquina tiene que descubrir qué registros se parecen. Para eso necesita una forma de medir cercanía. La más común es la distancia en línea recta entre dos puntos: entre $(1,2)$ y $(4,6)$ es $5$.`,
      },
      { type: 'paragraph', text: 'Hay dos enfoques típicos:' },
      {
        type: 'list',
        items: [
          t`**Basados en prototipos** (como **K-Means**): cada grupo se representa por un "centro", y cada punto va al centro más cercano. Funcionan bien con grupos compactos y redondeados, y exigen decidir de antemano **cuántos** grupos hay.`,
          t`**Basados en densidad** (**DBSCAN**): un grupo es una **región continua de alta densidad** rodeada de regiones de baja densidad.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Dos maneras de pensar un grupo',
        text: t`**Dos maneras de pensar un grupo.** Una es elegir un "centro" por grupo y mandar cada punto al más cercano (hay que decidir de antemano cuántos grupos hay). La otra, la de DBSCAN, mira **densidad**: un grupo es una región llena de puntos rodeada de zonas casi vacías.`,
      },
      {
        type: 'extra',
        text: t`Mira un mapa nocturno de las luces de una región: las ciudades se ven como manchas densas de puntos separadas por zonas oscuras, y alguna casa aislada en el campo. Eso es un agrupamiento por densidad: las manchas son los grupos y la casa suelta es el ruido. K-Means, en cambio, necesitaría que le digas de antemano cuántas ciudades hay.`,
      },
      {
        type: 'intuition',
        title: 'El mapa nocturno de luces',
        text: t`**El mapa nocturno.** Imaginá una región de noche vista desde el espacio. Las ciudades se ven como manchas densas de luces, separadas por oscuridad, y alguna casa aislada en el campo. Las manchas son los grupos; la casa suelta es el ruido. Y no necesitás saber cuántas ciudades hay para verlas.`,
      },
      { type: 'subheading', text: 'DBSCAN' },
      { type: 'paragraph', text: 'Usa dos parámetros:' },
      {
        type: 'list',
        items: [
          t`**Eps**: radio de "vecindad".`,
          t`**MinPts**: número mínimo de puntos (contando el propio) que debe haber dentro de ese radio.`,
        ],
      },
      { type: 'miniCheck', questionIds: ['m4-q10'] },
      { type: 'paragraph', text: 'Y clasifica cada punto en tres tipos:' },
      {
        type: 'list',
        items: [
          t`**Punto núcleo** (*core*): tiene al menos MinPts puntos dentro de su radio Eps. Está en el "interior" de una zona densa.`,
          t`**Punto borde** (*border*): **no** es núcleo, pero cae dentro del radio de **algún** punto núcleo. Está en la frontera del grupo.`,
          t`**Punto ruido** (*noise*): ni núcleo ni borde. Es un punto aislado.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Cómo decide DBSCAN: dos perillas y tres tipos de punto',
        text: t`**Cómo decide DBSCAN, con dos perillas.** Una es el radio de "vecindad" (qué tan cerca es cerca) y la otra es la cantidad mínima de vecinos para considerar que una zona es densa. Con eso clasifica cada punto en uno de tres tipos:

**Núcleo:** tiene suficientes vecinos a su alrededor, está en el centro de una zona densa. **Borde:** no tiene suficientes vecinos, pero está al alcance de un núcleo, en la frontera del grupo. **Ruido:** no es ninguno de los anteriores, está aislado.`,
      },
      { type: 'paragraph', text: 'Un grupo se forma conectando puntos núcleo cercanos entre sí, más sus puntos borde.' },
      {
        type: 'paragraph',
        text: t`**Ejemplo en una dimensión.** Puntos: $1,\ 1.5,\ 2,\ 2.5,\ 3.4,\ 8,\ 8.4,\ 9,\ 20$ con $\text{Eps}=1$ y $\text{MinPts}=3$.`,
      },
      {
        type: 'list',
        items: [
          t`$1, 1.5, 2, 2.5$ tienen al menos 3 puntos en su vecindad: son **núcleo** y forman el **Grupo A**.`,
          t`$3.4$ solo tiene 2 puntos a menos de 1 (él mismo y $2.5$): no es núcleo, pero está dentro del radio de $2.5$, que sí lo es: **borde** del Grupo A.`,
          t`$8, 8.4, 9$ son núcleo: **Grupo B**.`,
          t`$20$ no tiene vecinos: **ruido**.`,
        ],
      },
      {
        type: 'intuition',
        title: 'Un ejemplo con números',
        text: t`**Ejemplo.** Con los puntos de la guía, $1, 1.5, 2$ y $2.5$ son núcleo y forman un grupo. El $3.4$ solo está cerca de $2.5$: es borde de ese grupo. $8, 8.4$ y $9$ forman otro grupo. El $20$ no tiene a nadie cerca: es ruido.`,
      },
      {
        type: 'paragraph',
        text: t`**Ventajas:** encuentra grupos de **formas arbitrarias** (anillos, espirales), **no necesita fijar** el número de grupos y **separa el ruido** en lugar de forzarlo a pertenecer a un grupo. **Limitaciones:** es sensible a la elección de Eps y MinPts; tiene dificultades cuando los grupos tienen **densidades muy distintas**; y en dimensiones altas las distancias pierden significado.`,
      },
      {
        type: 'intuition',
        title: 'Fortalezas y límites',
        text: t`**Fortalezas y límites.** Encuentra grupos de cualquier forma, no necesita saber cuántos hay y deja el ruido afuera en lugar de forzarlo a un grupo. Pero es sensible a cómo elijas las dos perillas, le cuesta cuando los grupos tienen densidades muy distintas y, con muchísimas columnas, las distancias pierden significado.`,
      },
    ],
  },
]
