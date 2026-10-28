import type { ContentBlock, Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 4. Los bloques `extra` (ejemplos
// cotidianos o clásicos), `deepDive` (ampliaciones) y `recall` (repasos de lo previo) no son de la
// guía y se muestran rotulados; las cifras de las ampliaciones se verifican en tools/expansion-numbers.ts.
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
      {
        type: 'recall',
        items: [
          {
            question: '¿Qué diferencia había entre correlación y causalidad?',
            answer: t`Que dos variables se muevan juntas no implica que una cause la otra: puede haber una **variable de confusión** que empuja a las dos, como el calor con los helados y los ahogamientos. Lo viste en Módulo 3.2.`,
          },
          {
            question: '¿Qué hacía el término de error $u$ en un modelo?',
            answer: t`Reúne todo lo que afecta a $y$ y no está en el modelo. Si está relacionado con las variables explicativas, los coeficientes quedan sesgados como medida de **efecto causal**. Lo viste en Módulo 3.3 y en Módulo 3.7.`,
          },
        ],
      },
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
        type: 'deepDive',
        title: 'Predecir no es lo mismo que explicar',
        text: t`En el Módulo 3 la pregunta era **"¿qué pasa con $y$ si cambio $x$?"**, y por eso preocupaba tanto la variable omitida. En minería de datos la pregunta suele ser otra: **"¿qué valor va a tener $y$ en un caso nuevo?"**. Son preguntas distintas, y un buen modelo para una puede ser inútil para la otra.

**Un predictor excelente que no sirve para decidir.** Las ventas de helado predicen muy bien los ahogamientos: si un día se vendieron muchos helados, es buena apuesta que hubo más ahogamientos. Para un hospital que quiere saber cuántos guardavidas reforzar, ese modelo sirve. Pero si alguien concluyera "prohibamos los helados para salvar vidas", se equivocaría: el calor empuja a las dos cosas. **Para predecir alcanza con que la relación sea estable; para intervenir, hace falta que sea causal.**

**Por qué eso cambia cómo se evalúa.** En econometría se juzga un modelo por si sus coeficientes son creíbles (¿se cumple MLR.4?). En minería de datos se lo juzga por cuánto acierta con datos **que no vio**: por eso este módulo insiste tanto en separar entrenamiento y prueba. Ninguno de los dos criterios reemplaza al otro.`,
        sources: ['Breiman, "Statistical Modeling: The Two Cultures", *Statistical Science* (2001)', 'Shmueli, "To Explain or to Predict?", *Statistical Science* (2010)'],
      },
    ],
  },
  {
    id: '4.2',
    moduleId: 4,
    title: 'Preprocesamiento',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: '¿Qué escalas de medición había y qué permitía cada una?',
            answer: t`**Nominal** (solo etiquetas), **ordinal** (orden sin distancias iguales), **intervalo** (diferencias iguales, cero arbitrario) y **razón** (con cero verdadero). Asignar $1, 2, 3$ a una variable nominal le inventa un orden. Lo viste en Módulo 2.3.`,
          },
          {
            question: '¿Qué decía el puntaje $z$?',
            answer: t`A cuántas desviaciones típicas de la media está un valor: $z = (x - \bar{x})/s$. Pone variables con unidades distintas en la misma escala. Lo viste en Módulo 2.4.`,
          },
          {
            question: '¿Por qué importaba el motivo por el que faltan datos?',
            answer: t`Porque si faltan por azar solo se pierde precisión, pero si faltan por el propio valor (los que más ganan no declaran), lo que queda está torcido. Lo viste en Módulo 2.3.`,
          },
        ],
      },
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
        type: 'extra',
        text: t`Si comparas dos personas por altura (en metros: 1.70 y 1.80) y peso (en kilos: 60 y 90), la diferencia de peso (30) aplasta a la de altura (0.10) al calcular distancias, solo por las unidades. Con min-max, si las alturas van de 1.50 a 2.00 y los pesos de 50 a 100, la altura 1.70 pasa a $(1.70-1.50)/0.50 = 0.4$ y el peso 60 a $(60-50)/50 = 0.2$: ahora ambas variables pesan parecido.`,
      },
      {
        type: 'deepDive',
        title: 'La maldición de la dimensionalidad, con números',
        text: t`**Los vecinos dejan de estar cerca.** Imaginá datos repartidos de manera uniforme en un cuadrado de lado 1, y que querés mirar "los vecinos" de un punto: un 10 % de los datos a su alrededor. En una dimensión (un segmento) alcanza con un tramo de largo $0.1$. En dos dimensiones hace falta un cuadrado de lado $\sqrt{0.1} \approx 0.316$. En diez dimensiones, un cubo de lado $0.1^{1/10} \approx 0.794$: para juntar apenas el 10 % de los datos hay que abarcar casi el 80 % del rango de **cada** atributo. Ese "vecindario" ya no es local, y los "vecinos" se parecen poco al punto.

**Por qué importa.** Los métodos que se basan en distancias (el agrupamiento de la sección 4.5, por ejemplo) suponen que los puntos cercanos se parecen. Con muchos atributos, todos los puntos quedan más o menos igual de lejos y esa idea se rompe. Por eso se eliminan atributos redundantes o irrelevantes antes de usarlos.

**Un detalle del escalado: min-max se deja arrastrar por un extremo.** Con ingresos entre $10\,000$ y $50\,000$, el valor $20\,000$ pasa a $0.25$. Pero si en los datos aparece un único ingreso de $1\,000\,000$, el mismo $20\,000$ pasa a $(20 - 10)/(1000 - 10) \approx 0.0101$, y casi todos los demás quedan apretados cerca de $0$. La estandarización sufre menos ese problema, y es otra razón para revisar los valores atípicos **antes** de escalar.`,
        sources: ['Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 2.5 (maldición de la dimensionalidad)'],
      },
    ],
  },
  {
    id: '4.3',
    moduleId: 4,
    title: 'Clasificación predictiva',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: '¿Qué decía el test médico de Bayes?',
            answer: t`Con una enfermedad del 1 %, un test que detecta al 90 % de los enfermos y da falso positivo en el 5 % de los sanos deja solo $0.154$ de probabilidad de estar enfermo tras un positivo: los sanos son tantos que sus pocos errores superan a los aciertos. Lo viste en Módulo 0.2.`,
          },
          {
            question: '¿Qué era una probabilidad condicional?',
            answer: t`$P(A \mid B)$: la probabilidad de $A$ mirando solo los casos donde ocurrió $B$. Precisión y recall son probabilidades condicionales, con condiciones distintas. Lo viste en Módulo 0.2.`,
          },
          {
            question: t`¿Qué hacía $\log_2$?`,
            answer: t`Es el logaritmo en base 2: responde "¿a qué potencia hay que elevar 2 para obtener $x$?". Por ejemplo, $\log_2 8 = 3$. Funciona igual que el logaritmo natural que viste en Módulo 0.5, solo que con base 2 en lugar de $e$.`,
          },
        ],
      },
      {
        type: 'paragraph',
        text: t`**Clasificar** es asignar cada registro a una **clase predefinida**. Se aprende de ejemplos con la clase conocida y se aplica a registros nuevos.`,
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
        text: t`**No se evalúa con lo que ya estudió.** Si estudiás con los mismos ejercicios que después te toman, sacás 10 aunque hayas memorizado las respuestas, y te va mal con ejercicios nuevos. Por eso los datos se separan en un grupo de **entrenamiento** y un grupo de **prueba** que el modelo nunca vio. Cuando rinde muy bien en el primero y mal en el segundo, hay **sobreajuste**: aprendió el ruido en vez del patrón.`,
      },
      {
        type: 'deepDive',
        title: 'La filtración: cuando la prueba deja de ser un examen sorpresa',
        text: t`El conjunto de prueba sirve solo si es de verdad **nuevo** para el modelo. Cualquier información de la prueba que llegue al entrenamiento (se dice que se **filtra**) hace que el resultado parezca mejor de lo que va a ser con casos reales.

**La filtración sutil.** Si imputás la edad faltante con la mediana de **todos** los datos, esa mediana ya "vio" a los pasajeros de prueba. El efecto suele ser chico, pero es el mismo error que conocer de antemano una pregunta del examen. Por eso cada transformación se aprende solo con el entrenamiento y después se **aplica** a la prueba, sin recalcularla.

**La filtración grosera.** Un banco quiere predecir qué clientes van a cerrar su cuenta, y entre las columnas está "fecha del último reclamo por la baja". El modelo acierta casi el 100 %, porque esa columna solo existe **después** de que el cliente decidió irse. En producción, cuando hay que predecir, ese dato todavía no existe. Si un modelo rinde sospechosamente bien, lo primero que hay que preguntarse es **qué columna sabe algo del futuro**.

**Por qué estratificar.** Si en el Titanic sobrevivió el 38.4 %, una partición al azar podría dejar, por mala suerte, bastantes menos sobrevivientes en la prueba que en el entrenamiento. Estratificar asegura que las dos partes tengan la misma proporción, así la prueba mide al modelo y no a la suerte de la partición.`,
        sources: ['Kaufman y otros, "Leakage in Data Mining", *ACM TKDD* (2012)'],
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
        type: 'deepDive',
        title: 'Qué mide la entropía: preguntas de sí o no',
        text: t`**Un bit es una pregunta de sí o no.** Si hay 2 opciones igual de probables, necesitás una pregunta para saber cuál es: $\log_2 2 = 1$ bit. Con 4 opciones iguales, dos preguntas ("¿está en la primera mitad?", y otra más): $\log_2 4 = 2$ bits. La entropía cuenta, en promedio, cuántas preguntas de sí o no te faltan para conocer la clase.

**La sorpresa de cada resultado.** Un resultado con probabilidad $p$ aporta $-\log_2 p$ bits de sorpresa: lo seguro ($p = 1$) no sorprende nada, y lo raro sorprende mucho. En el nodo de la guía, que alguien pague ($p = 0.6$) sorprende $-\log_2 0.6 \approx 0.737$ bits, y que no pague ($p = 0.4$), $-\log_2 0.4 \approx 1.322$ bits. La entropía es la sorpresa **promedio**: $0.6 \times 0.737 + 0.4 \times 1.322 \approx 0.971$, el mismo número de la guía.

**Por qué el árbol busca bajarla.** Una buena pregunta deja grupos donde ya casi sabés la respuesta: la sorpresa que queda es poca. La ganancia de información mide justamente cuánta sorpresa te ahorró la pregunta. El Gini mide algo muy parecido sin logaritmos (la probabilidad de equivocarte si etiquetás al azar según las proporciones del nodo), y en la práctica los dos suelen elegir las mismas divisiones.`,
        sources: ['Cover y Thomas, *Elements of Information Theory*, cap. 2 (entropía)'],
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
        text: t`**Variables categóricas y continuas.** El árbol también decide *cómo* cortar cada tipo de variable. Con una variable **categórica** de varias categorías (clase 1, 2 o 3), prueba separaciones binarias de las categorías: por ejemplo, {1.ª y 2.ª} contra {3.ª}, o {1.ª} contra {2.ª y 3.ª}. Con una variable **continua** (edad), ordena los valores y prueba los **puntos de corte** posibles (por ejemplo, 10, 24.5 o 38.5 años); se queda con el umbral que deja los grupos más puros.`,
      },
      {
        type: 'intuition',
        title: 'Dónde cortar una fila ordenada',
        text: t`**Dónde cortar una fila ordenada.** Imaginá a los pasajeros formados en una fila ordenada por edad. El árbol prueba cortar la fila en cada lugar posible (entre el de 9 y el de 10 años, entre el de 24 y el de 25...) y se queda con el corte que deja a cada lado lo más parecido posible en cuanto a quién sobrevivió. Con una variable de categorías, como la clase del pasajero, no hay fila que cortar: prueba repartir las categorías en dos bolsas, por ejemplo {1.ª y 2.ª} contra {3.ª}, y se queda con el reparto más puro.`,
      },
      { type: 'miniCheck', questionIds: ['m4-q19'] },
      {
        type: 'paragraph',
        text: t`**El árbol del Titanic (ejemplo de clase, profundidad 3).** La raíz contiene los 623 pasajeros de entrenamiento (239 sobrevivieron, $38.4\,\%$) y pregunta "¿es mujer?". Para clasificar a un pasajero se sigue **un único camino** desde la raíz hasta una hoja: por ejemplo, un hombre de 3.ª clase responde "¿es mujer?" $\to$ no, "¿clase = 3?" $\to$ sí, y llega a una hoja con **baja** probabilidad de sobrevivir; una mujer de 1.ª clase llega a una hoja con probabilidad alta. Los componentes son el **nodo raíz** (primera pregunta), los **nodos internos**, las **ramas** (respuestas) y las **hojas** (predicción: la proporción de sobrevivientes del entrenamiento que cayó en ellas). Un árbol no usa una fórmula única: toma decisiones a partir de preguntas sucesivas.`,
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
        type: 'deepDive',
        title: 'Precisión y recall son el test médico de Bayes',
        text: t`Las métricas de esta sección no son nuevas: son las del Módulo 0.2 con otros nombres.

**Recall** = sensibilidad = $P(\text{predice positivo} \mid \text{es positivo})$: lo que el test "sabe hacer" con los enfermos.

**Especificidad** = $P(\text{predice negativo} \mid \text{es negativo})$: uno menos la tasa de falsos positivos.

**Precisión** = $P(\text{es positivo} \mid \text{predice positivo})$: la pregunta "dado que dio positivo, ¿qué tan probable es que lo sea?", que es justo la que respondía Bayes.

**La precisión depende de qué tan frecuentes son los positivos.** En el ejemplo, el modelo tiene recall $0.80$ y especificidad $0.80$, y 10 de cada 100 pacientes están enfermos: la precisión es $0.08/(0.08 + 0.18) \approx 0.31$. **Con el mismo modelo**, si la mitad de los pacientes estuviera enferma, la precisión sería $0.40/(0.40 + 0.10) = 0.80$. El modelo no cambió: cambió la población. Por eso un modelo que funciona bien en un hospital especializado puede generar muchísimas falsas alarmas aplicado a toda la población.

**Por qué la $F_1$ usa la media armónica.** Con precisión $0.31$ y recall $0.80$, el promedio común daría alrededor de $0.55$, pero la $F_1$ da $0.44$: la media armónica castiga que una de las dos sea baja. El caso extremo lo muestra: un modelo que dice "positivo" a todos tiene recall $1$ y, con 10 % de positivos, precisión $0.10$. El promedio común le daría $0.55$, como si fuera aceptable. La $F_1$ le da $\approx 0.18$.`,
        sources: ['Fawcett, "An Introduction to ROC Analysis", *Pattern Recognition Letters* (2006)'],
      },
      {
        type: 'paragraph',
        text: t`**Qué priorizar:** si un falso negativo es muy costoso (no detectar un cáncer), importa el **recall**; si lo costoso es un falso positivo (bloquear a un cliente legítimo), importa la **precisión**.`,
      },
      {
        type: 'paragraph',
        text: t`**El umbral cambia las métricas, no el modelo.** Un modelo que entrega probabilidades se convierte en clasificador al fijar un **umbral** $t$: se predice positivo si $\hat{p} \ge t$. Con el mismo modelo, subir $t$ lo vuelve más exigente (sube la precisión y la especificidad, pero puede bajar el recall) y bajarlo hace lo contrario. *Ejemplo ilustrativo (cifras inventadas):* 8 pasajeros con probabilidades estimadas $0.95,\allowbreak\ 0.85,\allowbreak\ 0.60,\allowbreak\ 0.55,\allowbreak\ 0.45,\allowbreak\ 0.35,\allowbreak\ 0.20,\allowbreak\ 0.10$; sobrevivieron 5 de ellos (los de probabilidad $0.95$, $0.85$, $0.55$, $0.45$ y $0.20$).`,
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
        type: 'recall',
        items: [
          {
            question: '¿Qué significaba que dos eventos sean independientes?',
            answer: t`Que saber que ocurrió uno no cambia la probabilidad del otro, y entonces $P(A \text{ y } B) = P(A) \cdot P(B)$. El lift compara lo observado con ese producto. Lo viste en Módulo 0.2.`,
          },
          {
            question: t`¿Qué era $P(B \mid A)$?`,
            answer: t`La probabilidad de $B$ mirando solo los casos donde ocurrió $A$: $P(A \text{ y } B)/P(A)$. La confianza de una regla es exactamente eso. Lo viste en Módulo 0.2.`,
          },
        ],
      },
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
      { type: 'paragraph', text: '**Tres medidas:**' },
      {
        type: 'list',
        items: [
          t`**Soporte** de un conjunto: fracción de transacciones que lo contienen. Mide **qué tan frecuente** es.`,
          t`**Confianza** de $A \rightarrow B$: $\dfrac{\text{soporte}(A\cup B)}{\text{soporte}(A)}$ $= P(B \mid A)$. De los que compran $A$, ¿qué fracción compra también $B$?`,
          t`**Lift** de $A \rightarrow B$: $\dfrac{\text{confianza}(A\rightarrow B)}{\text{soporte}(B)}$. Compara con lo que se esperaría **si $A$ y $B$ fueran independientes**: $>1$ asociación positiva; $=1$ independientes; $<1$ asociación negativa. La confianza sola engaña: si casi todos compran $B$, cualquier regla hacia $B$ tendrá confianza alta sin ser informativa.`,
        ],
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
        type: 'paragraph',
        text: t`Con los conjuntos frecuentes se generan reglas y se filtran por confianza y lift. *Advertencia:* una regla describe **co-ocurrencia**, no causalidad: no implica que comprar pañales cause comprar cerveza.`,
      },
      {
        type: 'deepDive',
        title: 'El lift es una prueba de independencia, y con pocos datos es frágil',
        text: t`**Otra forma de escribir el lift.** Reemplazando la confianza por su definición, $\text{lift} = \dfrac{P(A \text{ y } B)}{P(A) \cdot P(B)}$. Arriba está lo que **pasó**; abajo, lo que pasaría **si fueran independientes**. Para pañales y cerveza: $0.6/(0.8 \times 0.6) = 1.25$. Aparecen juntos un 25 % más seguido de lo que daría la casualidad.

**Con 5 tickets, un solo cliente cambia la conclusión.** Si el cliente del ticket 1, que llevó solo pan y leche, hubiera agregado una cerveza, la cerveza estaría en 4 tickets y el lift bajaría a $0.6/(0.8 \times 0.8) \approx 0.94$: la asociación desaparece. Si en cambio el cliente del ticket 5 no hubiera llevado pañales, el lift subiría a $0.6/(0.6 \times 0.6) \approx 1.67$. Con tan pocos datos, el lift salta de un lado a otro por un solo ticket. Es el mismo problema del error estándar del Módulo 2.5: un número calculado con pocos datos es poco confiable. Por eso, además del lift, se exige un **soporte mínimo**.

**Por qué hace falta Apriori: el número de combinaciones.** Con $n$ productos hay $2^n - 1$ conjuntos posibles. Con apenas 20 productos ya son $1\,048\,575$. En el ejemplo de la guía, descartar huevos y cola en el primer nivel dejó solo 6 pares para contar, en lugar de los 15 que se pueden formar con 6 productos.`,
        sources: ['Tan, Steinbach y Kumar, *Introduction to Data Mining* (análisis de asociación)'],
      },
    ],
  },
  {
    id: '4.5',
    moduleId: 4,
    title: 'Agrupamiento (clustering) y DBSCAN',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: '¿Para qué se escalaban los atributos?',
            answer: t`Para que una variable con números grandes (ingresos en pesos) no aplaste a otra con números chicos (edad en años) al calcular distancias, solo por las unidades. Lo viste en Módulo 4.2.`,
          },
          {
            question: '¿Qué era la maldición de la dimensionalidad?',
            answer: t`Con muchos atributos, los datos quedan ralos y todos los puntos parecen igual de lejos, así que las distancias pierden sentido. Lo viste en Módulo 4.2.`,
          },
        ],
      },
      {
        type: 'paragraph',
        text: t`El **agrupamiento** es una tarea **no supervisada** (no hay clase conocida): se busca organizar los registros en **grupos** de modo que los de un mismo grupo se parezcan entre sí y se diferencien de los otros. Para decir "se parecen" se necesita una **medida de distancia**; la más común es la **distancia euclídea** (la recta entre dos puntos): en 2D, entre $(1,2)$ y $(4,6)$ es $\sqrt{3^2+4^2} = 5$.`,
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
        type: 'extra',
        text: t`Mira un mapa nocturno de las luces de una región: las ciudades se ven como manchas densas de puntos separadas por zonas oscuras, y alguna casa aislada en el campo. Eso es un agrupamiento por densidad: las manchas son los grupos y la casa suelta es el ruido. K-Means, en cambio, necesitaría que le digas de antemano cuántas ciudades hay.`,
      },
      {
        type: 'deepDive',
        title: 'Sin escalar, la distancia la decide una sola variable',
        text: t`Tres clientes, con edad en años e ingreso mensual en pesos:

**A:** 30 años, $50\,000$. **B:** 60 años, $51\,000$. **C:** 31 años, $60\,000$.

A y B tienen 30 años de diferencia; A y C, uno solo. Pero la distancia euclídea entre A y B es $\sqrt{30^2 + 1000^2} \approx 1000.45$, y entre A y C, $\sqrt{1^2 + 10\,000^2} \approx 10\,000$. Para el algoritmo, A se parece **diez veces más** a B que a C. Los 30 años de diferencia casi no cuentan: la distancia la decide el ingreso, simplemente porque se mide en números más grandes.

Si se estandarizan las dos variables, cada una pasa a medirse en "desviaciones típicas" y pesan parecido. Elegir **cómo** escalar es elegir qué significa "parecerse", y conviene decidirlo a conciencia antes de agrupar.`,
        sources: ['Tan, Steinbach y Kumar, *Introduction to Data Mining* (medidas de similitud y escalado)'],
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
        type: 'paragraph',
        text: t`**Ventajas:** encuentra grupos de **formas arbitrarias** (anillos, espirales), **no necesita fijar** el número de grupos y **separa el ruido** en lugar de forzarlo a pertenecer a un grupo. **Limitaciones:** es sensible a la elección de Eps y MinPts; tiene dificultades cuando los grupos tienen **densidades muy distintas**; y en dimensiones altas las distancias pierden significado.`,
      },
      {
        type: 'deepDive',
        title: 'Cómo se elige Eps: mirar la distancia al vecino',
        text: t`Con MinPts $= 3$, un punto es núcleo si tiene al menos **otros 2** puntos dentro del radio Eps. Eso equivale a mirar, para cada punto, la distancia a su **segundo vecino más cercano**: si es menor o igual que Eps, es núcleo.

Con los puntos de la guía:

$1 \to 1$, $\ 1.5 \to 0.5$, $\ 2 \to 0.5$, $\ 2.5 \to 0.9$, $\ 3.4 \to 1.4$, $\ 8 \to 1$, $\ 8.4 \to 0.6$, $\ 9 \to 1$, $\ 20 \to 11.6$.

Con Eps $= 1$, son núcleo los que tienen una distancia de $1$ o menos: todos menos el $3.4$ y el $20$, exactamente como dice la guía.

**El truco práctico.** Se ordenan esas distancias de menor a mayor: $0.5, 0.5, 0.6, 0.9, 1, 1, 1, 1.4, 11.6$. Casi todas son chicas y, de golpe, aparece un salto enorme (de $1.4$ a $11.6$): ese es el ruido. Un buen Eps está justo antes del salto, en el "codo" del gráfico. Con datos reales se dibujan esas distancias ordenadas y se busca el punto donde la curva se dispara. Si los grupos tienen densidades muy distintas, no hay un único codo, y esa es justamente la limitación de DBSCAN que menciona la guía.`,
        sources: ['Ester, Kriegel, Sander y Xu, "A Density-Based Algorithm for Discovering Clusters", *KDD-96* (1996)'],
      },
    ],
  },
]
