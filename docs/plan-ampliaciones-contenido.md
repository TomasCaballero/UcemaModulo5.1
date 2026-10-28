# Plan de ampliaciones de contenido por módulo

Documento de trabajo para mejorar la experiencia de lectura del curso, módulo por módulo. Está pensado para que cualquier sesión (humana o de un agente) pueda **retomar sin el contexto de la conversación original**: primero las reglas y el procedimiento, después el estado de cada módulo y el plan concreto de los que faltan.

> **Cómo usarlo:** leé las secciones 1 a 4 una vez. Para trabajar un módulo, andá a su sección en "5. Plan por módulo", seguí la lista de verificación de la sección 4 y, al terminar, actualizá la tabla de estado (sección 3).

---

## 1. El problema y la decisión

**Lo que reportó el usuario (2026-10-28):** el curso se sentía plano, aburrido y poco didáctico. Al leer el Módulo 3 aparecían conceptos que "seguro había visto" pero no recordaba (por ejemplo, qué eran los contrastes $t$ y $F$), y se perdía en el contenido.

**Diagnóstico:**

1. **Repetía en vez de profundizar.** Casi todos los temas aparecían dos o tres veces con el mismo ejemplo: párrafo técnico, después una intuición ("En palabras simples") que decía lo mismo, y a veces un "Ejemplo extra" con el mismo caso.
2. **Daba por sabido lo anterior.** Usaba etiquetas ("falla MLR.5", "como en el Módulo 0.3") sin recordar qué eran.
3. **Decía consecuencias sin explicar por qué** ("los errores estándar son incorrectos, así que los contrastes no son confiables").
4. **Tenía huecos reales.** Por ejemplo, el contraste $F$ en regresión no se explicaba en ningún lado: el Módulo 2 decía "no hace falta memorizarla" y el Módulo 3 la usaba.

**Decisión (aprobada por el usuario):** el curso puede **ir más allá de la guía**, porque lo importante es entender los conceptos y no la fidelidad literal ("no me van a evaluar en el posgrado de esa forma"). Pero con dos capas separadas y visibles:

- **Capa de la guía:** el texto original, intacto y verificado (RNF-17/18).
- **Capa de ampliación:** contenido propio, rotulado, con fuentes y con cifras verificadas por tests (RNF-24).

El usuario confirmó el resultado del piloto del Módulo 3: "Me encantó así como lo hiciste".

---

## 2. Reglas (no negociables)

Fuente de verdad: `PRD.md` (RNF-24, AC-65) y `AGENTS.md`.

### 2.1 Qué se puede tocar

| Contenido | ¿Se puede modificar? |
| :--- | :--- |
| Texto y cifras de la guía (`paragraph`, `list`, `formula`, `table`, `workedExample`, `callout`, `analogy` que vienen de la guía) | **No** (RNF-17/18). Excepción ya usada: agregar palabras a un encabezado de tabla que era solo una fórmula, por accesibilidad. |
| Bloques `intuition` | Sí: no son de la guía. Se **quitan** si repiten el párrafo técnico con el mismo ejemplo; se **conservan** (o se recortan) si aportan otro ángulo. |
| Bloques `extra` | Sí: no son de la guía. Se quitan si duplican una intuición o el texto; se conservan si traen un ejemplo distinto. |
| Bloques `deepDive` y `recall` | Se agregan (la capa nueva). |

### 2.2 Los dos bloques nuevos

Definidos en `src/content/types.ts`, dibujados por `DeepDiveBlock.vue` y `RecallBlock.vue`.

```ts
// Ampliación: el porqué, un ejemplo numérico, una conexión. Siempre con fuentes.
{ type: 'deepDive', title: RichText, text: RichText, sources: RichText[] }

// "¿Te acordás?": repaso de conceptos previos, al inicio de la sección.
{ type: 'recall', items: [{ question: RichText, answer: RichText }] }
```

**Reglas de escritura:**

- **Tono:** voseo argentino ("fijate", "podés"), como las intuiciones existentes. Explicar el **porqué**, idealmente con un **ejemplo numérico chico**.
- **Formato del `text`:** párrafos separados por una línea en blanco. RichText **solo** soporta `**negrita**`, `*cursiva*`, `$fórmula inline$` y referencias "Módulo N.M". **No** hay listas, tablas ni `$$...$$` dentro de un bloque: para una lista se usan párrafos que empiezan con `**Etiqueta:**`; para una fórmula destacada, un párrafo que contiene solo `$...$` (sirve `\dfrac`).
- **`sources`:** al menos una (el validador lo exige). Bibliografía estándar real (Wooldridge, Freedman-Pisani-Purves, Angrist-Pischke, Hastie-Tibshirani-Friedman, Ross, Stewart, Strang, Tan-Steinbach-Kumar, Cover-Thomas, artículos clásicos). Si no estás seguro del capítulo, no lo pongas. Si el ejemplo usa datos inventados, agregá `'Cifras inventadas para el ejemplo'`.
- **`recall`:** al inicio de la sección (primer bloque). Cada respuesta termina con **"Lo viste en Módulo N.M."**, que se convierte en link. Solo a secciones **anteriores**, o anteriores dentro del mismo módulo.
- **Sin referencias hacia adelante:** no nombrar módulos posteriores ("Módulo 6") ni usar términos que se enseñan después (lista en `tools/forward-references.ts`, `LATER_TERMS`: OLS en módulos < 3, "regresión logística" en < 5, PCA, bootstrap, validación cruzada, sesgo-varianza en < 6, PAC y dimensión VC en < 7, etc.). Para anticipar algo, decir "más adelante" sin nombrarlo. "sección 3.8" en texto plano está permitido; "(3.8)" o "ver 3.8" no.
- **Cifras:** toda cifra nueva que se pueda recalcular va a `tools/expansion-numbers.ts` (ver 2.3). No escribir cifras hipotéticas que no se puedan verificar (por ejemplo, "un 30 % en la prueba y un 42 % en el entrenamiento"); en ese caso, describir sin números.

### 2.3 Verificación de cifras (RNF-24)

`tools/expansion-numbers.ts` tiene un helper `example(id, snippet, expected, precision, actual)`:

- **`id`** empieza con la sección (`'5.2-odds-ratio'`): de ahí sale en qué sección se busca el snippet.
- **`snippet`** es el texto **literal** (LaTeX incluido) que debe aparecer en una ampliación de esa sección. Usar `String.raw` (alias `r`).
- **`expected`** es el número tal como está escrito; **`precision`** son los decimales impresos. La tolerancia es medio dígito de esa precisión: si escribís `0.555` y el valor real es `0.5538`, falla. Redondeá bien, o escribí "alrededor de $0.55$" con `precision: 2`.
- **`actual`** recalcula la cifra **con la lógica del curso** (`src/logic/...`). Si falta una función (entropía, F1, distancias, OLS...), se agrega en `src/logic/` con su test en `tests/logic/`.

Las cifras de cada módulo van en su propio arreglo (`module0Examples`, `module4Examples`, ...), que se agrega a `expansionExamples`.

---

## 3. Estado

| Módulo | Estado | Rama / commit |
| :--- | :--- | :--- |
| 0 | ✅ Hecho | `feat/ampliaciones-contenido` (`bf3c051`) |
| 1 | ⏳ Pendiente (siguiente) | — |
| 2 | ✅ Hecho | `feat/ampliaciones-contenido` (`bf3c051`) |
| 3 | ✅ Hecho (piloto) | `feat/ampliaciones-contenido` (`bf3c051`) |
| 4 | ✅ Hecho | `feat/ampliaciones-contenido` (`bf3c051`) |
| 5 | ✅ Hecho | `feat/ampliaciones-contenido` (`ff1fe61`) |
| 6 | ✅ Hecho | `feat/ampliaciones-contenido` (`e98b62f`) |
| 7 | ✅ Hecho | `feat/ampliaciones-contenido` (mergeado a `main`) |

**Notas de estado (al 2026-10-28):**

- Todo el trabajo de los módulos 0 y 2 a 7 está mergeado a `main` (2026-10-28) desde la rama `feat/ampliaciones-contenido`.
- `package-lock.json` tenía cambios **previos** a este trabajo y quedó fuera de los commits a propósito. No es parte de esto.
- Orden acordado: 3 (piloto) → 2 → 0 → 4 → 5 → 6 → 7. Queda solo el **Módulo 1** (metacognición).
- Infraestructura ya hecha (no repetir): los tipos y componentes de los bloques, el validador, RNF-24/AC-65 en el PRD, `npm run verify:expansion`, rótulos accesibles para opciones y encabezados que son solo fórmulas, y el barrido e2e de todas las secciones (`e2e/a11y-sections.spec.ts`).
- Cifras verificadas hasta ahora: 207 (todas coinciden).

---

## 4. Procedimiento por módulo (lista de verificación)

1. **Leer el archivo completo** `src/content/data/moduleN.ts`. Marcar:
   - intuiciones y extras que **repiten** el texto anterior con el mismo ejemplo (para quitar);
   - conceptos de módulos anteriores que se **dan por sabidos** (para el `recall`);
   - afirmaciones sin **porqué**, saltos y huecos (para los `deepDive`).
2. **Planificar** por sección: un `recall` (2 a 4 preguntas) y 1 o 2 `deepDive`. Apuntar a 8–12 ampliaciones por módulo.
3. **Aplicar los cambios con un script de edición** (Python, en el scratchpad, no en el repo) que use reemplazos exactos con `assert s.count(old) == 1`. Usar **cadenas crudas `r"""..."""`**: con cadenas normales, `\t`, `\b`, `\f` o `\n` dentro de LaTeX se convierten en caracteres de control sin aviso. Después, comprobar que no quedaron caracteres de control:
   `python -c "import re;s=open('src/content/data/moduleN.ts',encoding='utf-8').read();print([m.start() for m in re.finditer(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', s)])"`
   Funciones útiles del script: `rep(old, new)`, `drop_block(marcador)` (quita el bloque de 6 espacios de sangría que contiene el marcador, por ejemplo su `title: '...'`) e insertar antes o después de un bloque.
4. **Actualizar el comentario de cabecera** del archivo para mencionar `deepDive` y `recall` (copiar el de `module3.ts`).
5. **Registrar las cifras** en `tools/expansion-numbers.ts` (y agregar la lógica que falte, con sus tests).
6. **Verificar** (todo tiene que pasar):
   ```powershell
   npm run typecheck
   npx vitest run                                              # unitarios
   npx vitest run --config vitest.verify.config.ts             # RNF-17/18/19/20/24 + referencias hacia adelante
   npx playwright test                                         # e2e completo, incluye el barrido de accesibilidad de las 50 secciones
   ```
   Además: abrir las secciones a **360 px** (sin scroll horizontal ni `$` crudos) y mirar capturas de las ampliaciones para revisar cómo se leen.
7. **Actualizar este documento** (la tabla de estado y lo hecho en el módulo) y avisar al usuario con un resumen. **Commit y push solo si el usuario lo pide.**

### Problemas que ya aparecieron (y cómo se resolvieron)

| Síntoma | Causa | Solución |
| :--- | :--- | :--- |
| Falla un e2e que busca `.katex` visible | La primera fórmula de la página quedó dentro de un `recall` cerrado | Apuntar al selector de la fórmula real (por ejemplo `.math-display .katex`) |
| axe: `landmark-unique` | Varias ampliaciones con la misma `aria-label` | Ya resuelto: cada una usa `aria-labelledby` con su título |
| axe: `empty-table-header` o `label` | Un encabezado u opción que es solo una fórmula | Ya resuelto en `TableBlock` y `QuestionCard` |
| La verificación de cifras falla por poco | Redondeo del texto ("2.6 %" cuando el valor es 2.67) | Corregir el texto, no la tolerancia |
| Referencia hacia adelante | Se mencionó un término posterior ("regresión logística" en el Módulo 2) | Reformular sin el término |
| Una lista se ve como un solo párrafo | RichText no tiene listas | Usar párrafos separados con una línea en blanco |
| Aparecen `ar{x}`, `ho` o `arphi` en lugar de `\bar`, `\rho`, `\varphi` | Script de Python pasado por un heredoc de Git Bash: los `\b`, `\r`, `\v` se vuelven caracteres de control | Escribir el script en un archivo del scratchpad (con `r"""..."""`) y correrlo; nunca por heredoc |
| Scroll horizontal a 360 px | Una fórmula inline larga (por ejemplo, 8 números en un solo `$...$`) no se puede cortar | Partirla en fórmulas sueltas: `$0.95$, $0.85$, ...` |

---

## 5. Plan por módulo

### Hechos (resumen, para no repetir ejemplos)

<details>
<summary><strong>Módulo 0</strong>: 12 ampliaciones, 2 repasos, 8 bloques quitados</summary>

- 0.1: Cómo leer una fórmula; los desvíos al promedio suman cero.
- 0.2: Independientes no es lo mismo que excluyentes, y la falacia del jugador · Bayes como actualización (con un segundo test positivo se pasa de 15 % a 77 %) · Misma esperanza, distinto riesgo · Esperanza condicional como la mejor predicción (34 vs 30/40).
- 0.3: $X\beta$ fila por fila (4650, 6200, 5350) · Por qué la colinealidad perfecta no tiene una única respuesta (tres repartos que dan 1500) · Covarianza → correlación con los datos de 3.3 ($21$, $0.98$).
- 0.4: Derivada como pendiente entre puntos cercanos (4.001) · Con valor absoluto gana la mediana (7 vs 8) · Tamaño del paso (rebote entre 0 y 6).
- 0.5: Diferencias de logaritmos como porcentajes (asimetría de 10 % / 9.09 %) y de dónde sale $e$.
- Tabla de 0.5: encabezados "Número ($x$)" y "Logaritmo natural ($\ln(x)$)".
</details>

<details>
<summary><strong>Módulo 2</strong>: 12 ampliaciones, 5 repasos, 14 bloques quitados</summary>

- 2.1: Muestra chica bien elegida contra gigante mal elegida (*Literary Digest* 1936).
- 2.2: Por qué al cuadrado y por qué $n-1$ (33 contra 28; grados de libertad).
- 2.3: Por qué importa por qué faltan los datos (imputar con la media: varianza de 7 a 2).
- 2.4: La Poisson como binomial con muchos intentos (0.0494 contra 0.0498) · De dónde sale el 1.96 · Para qué sirven la $t$, la $\chi^2$ y la $F$ (valores críticos 3.18, 2.03 y 1.96).
- 2.5: Desviación típica contra error estándar ($\sqrt{n}$: 120, 60, 30).
- 2.6: De dónde sale "±1.96 ee" (IC al 99 %: [895.4; 1204.6]) · El máximo de la verosimilitud y por qué usar logaritmos.
- 2.7: Por qué el p-valor no es P($H_0$) (1000 hipótesis, 36 % de falsas alarmas) · El 0.053 y su equivalencia con el IC [91.94; 100.06] · $t = d\sqrt{n}$.
</details>

<details>
<summary><strong>Módulo 3</strong> (piloto): 8 ampliaciones, 6 repasos</summary>

- 3.2: Por qué el sorteo arregla todo.
- 3.3: Qué miden el contraste $t$ y el $F$ ($t \approx 8.34$, $F \approx 69.6 = t^2$).
- 3.4: El sesgo por variable omitida con números (2.9 = 2 + 3 × 0.3).
- 3.5: Logaritmos y porcentajes ($e^{0.08}$, $e^{0.5}-1 = 64.9$ %).
- 3.6: Qué protege cada supuesto.
- 3.7: Por qué la heterocedasticidad arruina los contrastes (t 2.4 contra 1.5) · Las tres causas de la endogeneidad (atenuación ×0.5) · El instrumento como regla de tres (0.4/0.5 = 0.8).
- 3.8: DID como regresión con dos variables ficticias ($\delta = 3$).
- Tabla de 3.3: encabezados "Años de estudio ($x$)" y "Salario ($y$)".
</details>

<details>
<summary><strong>Módulo 4</strong>: 8 ampliaciones, 5 repasos, 19 bloques quitados</summary>

- 4.1: Predecir no es lo mismo que explicar (helados y ahogamientos; Breiman, Shmueli).
- 4.2: La maldición de la dimensionalidad (0.316, 0.794) y min-max arrastrado por un extremo (0.0101).
- 4.3: La filtración · La entropía como preguntas de sí o no (0.737/1.322 → 0.971) · Precisión y recall son Bayes (0.31 contra 0.80 al cambiar la prevalencia; F1 0.18 si todo es positivo).
- 4.4: El lift como prueba de independencia y su fragilidad con 5 tickets (0.94 o 1.67); $2^{20}-1$.
- 4.5: Sin escalar, decide el ingreso (1000.45 contra 10 000) · Elegir Eps con la distancia al segundo vecino (reproduce la clasificación de la guía).
</details>

<details>
<summary><strong>Módulo 5</strong>: 8 ampliaciones, 4 repasos, 22 bloques quitados</summary>

- 5.1: De dónde sale $p(1-p)$ ($0.009 + 0.081 = 0.09$) y cuándo la recta alcanza (0.731 contra 0.75).
- 5.2: Por qué justo el logaritmo de los odds (±1.386, $\ln 99$) · Por qué verosimilitud y no mínimos cuadrados (log-pérdida 0.105 / 2.303 / 4.605 contra 0.81 / 0.98) · Separación perfecta: los coeficientes se van al infinito (ℓ −0.627, −0.0134, −0.0001) · El AUC contado a mano con los 8 pasajeros de 4.3 (11/15 = 0.733) y un modelo "a la mitad" con el mismo AUC pero mal calibrado.
- 5.3: De dónde sale el factor 1.6–1.8 (π/√3 ≈ 1.81; 0.399/0.25 ≈ 1.6) y por qué la escala de la variable latente es una convención.
- 5.4: LDA también termina en una S logística (log-cociente $= x - 4$; reproduce el 0.73 y el 5.39 de la guía) · Naive Bayes cuenta dos veces la misma pista (0.87 contra 0.985).
- Lógica nueva: `aucByPairs` en `src/logic/classification/classification.ts`, con test.
- Se conservaron: el examen con horas de estudio (5.1 y 5.2), las apuestas "4 a 1", la variable latente de "salir a correr", Celsius/Fahrenheit (recortada), manzanas y peras, y la gripe.
</details>

<details>
<summary><strong>Módulo 6</strong>: 8 ampliaciones, 8 repasos (19 preguntas), 31 bloques quitados</summary>

- 6.1: Por qué el error de entrenamiento es optimista (predecir con el promedio: 3.2 contra 4.8, un 50 % más; conecta con el $n-1$ de 2.2).
- 6.2: La descomposición con números: el estimador encogido $0.8\bar{x}$ (2.72 contra 4 si $\mu = 2$; 6.56 si $\mu = 10$).
- 6.3: El bootstrap sin azar: las 27 muestras de $(2, 4, 9)$ (error estándar 1.70 = $\sqrt{(26/3)/3}$; el dato fuera en 8 de 27 = 0.296).
- 6.4: Por qué Lasso pone ceros y Ridge no (una variable, $\lambda = 2$: 3 → 1 y 2; 0.5 → 0.167 y 0). Se dejó para 6.8 la ampliación de PCA.
- 6.5: El voto de mayoría (5 clasificadores al 70 % → 83.7 %; copiados → 70 %; al 45 % → 40.7 %). **No** se usó la varianza del promedio con $\rho$: la guía ya la trae con números.
- 6.6: El truco del kernel con números ($(x \cdot z)^2 = \varphi(x)\cdot\varphi(z) = 25$; 5050 coordenadas; RBF $e^{-1}$ y $e^{-10}$). **No** se usó el ejemplo 1D con $x^2$: la guía ya lo trae.
- 6.7: K-Means siempre baja la SSE (20 → 9.33 con la guía) pero se traba: rectángulo de 10 × 1, SSE 100 contra 1.
- 6.8: Dos variables con correlación $r$: autovalores $1 \pm r$ con direcciones $(1, 1)$ y $(1, -1)$; $r = 0.9$ → 95 %.
- Lógica nueva: `src/logic/statistics/learning.ts` (sesgo-varianza, bootstrap exacto, Ridge/Lasso de una variable, varianza de un promedio, voto de mayoría) y `symmetric2x2Eigenvalues` en `pca.ts`, con tests.
- Se conservaron: libro con soluciones/discoteca y el MSE de temperaturas (6.1), tiro al blanco y "el que memoriza" recortada (6.2), rotar al evaluador recortada y las bolillas con 0.349 (6.3), la valija y el talle recortado (6.4), Galton, el banco que debe explicar, el mapa que envejece y el simulacro recortado (6.5), el pasillo y la pista de patinaje recortada (6.6), estaciones de servicio recortada, verdulería y dendrograma de seres vivos (6.7), termómetros, aseguradora, girar el mapa, manecillas, edad e ingreso, hoja de papel, imán, nubes y yerba (6.8).
</details>

<details>
<summary><strong>Módulo 7</strong>: 9 ampliaciones, 6 repasos (15 preguntas), 23 bloques quitados</summary>

- 7.1: Memorizar con criterio: el vecino más cercano (mismo error de entrenamiento que la memoria; en $x = 6.5$ el vecino está a 0.5) y cuándo la apuesta falla (paridad).
- 7.2: Por qué alcanzan 231 ejemplos: una hipótesis mala sobrevive con $0.95^m$ (0.358 con 20; 0.0000071 con 231), cota de la unión ($1000 \times 0.0000071 \approx 0.0071 < 0.01$), duplicar $|\mathcal{H}|$ suma 13.9 y la mitad de $\epsilon$ da 461.
- 7.3: Un solo modelo: Hoeffding pide 738 casos contra los 385 de la Normal · De un modelo a toda la clase: los 9765 de la guía salen de Hoeffding + cota de la unión + margen $\epsilon/2$; $1/\epsilon$ contra $1/\epsilon^2$ (461 contra 39 060).
- 7.4: Por qué alcanza con VC finita: intervalos sobre 10 puntos logran 56 de 1024 etiquetados; lema de Sauer ($1 + 10 + 45$); con 100 puntos, 5051 contra un número de 31 cifras.
- 7.5: No-Free-Lunch à la Wolpert: con 2 casos sin ver, cualquier predicción acierta el 50 % promediando los 4 mundos (y con 10, también).
- 7.6: Estabilidad con números: $b = \sum x_i/(n+\lambda)$ (un dato mueve 1 o 0.5; precio: 6 → 3) · De dónde sale la cota de Ockham (repartir $\delta \cdot 2^{-|h|}$; $\ln 2 \approx 0.69 < 1$) · MDL como compresión (memoria 1000 bits, regla simple 306, compleja 481).
- 7.7: se recortó la intuición final (el párrafo que repetía la tabla).
- Lógica nueva: `src/logic/statistics/pac.ts` (tamaños de muestra, Hoeffding, etiquetados de intervalos/umbrales, cota de Sauer, error fuera del entrenamiento) y `ridgeMean` en `learning.ts`, con tests en `tests/logic/pac.test.ts`.
- Se conservaron: la tabla del 7 (extra, 7.1), el simulacro (7.2), las 77 reglas (extra, 7.2), la encuesta electoral (extra, 7.3), "medir la flexibilidad" y el cartel en la puerta (7.4), la serie de Moser 1, 2, 4, 8, 16, 31 (extra, 7.5), el auto que no arranca (7.6).
</details>

### Pendientes

Las propuestas de abajo salen de relevar la estructura de cada archivo. **Antes de escribir, leé el archivo completo y la sección de la guía**: si la guía ya cubre una idea, no la repitas, y comprobá que las cifras coincidan con las de la guía. Cada cifra propuesta tiene que registrarse y verificarse.

#### Módulo 1: metacognición y Hamming

Archivo: `module1.ts` (354 líneas, **20 intuiciones y 8 extras** en 7 secciones: muy probable que haya mucha repetición). No tiene conceptos previos de peso (solo el Módulo 0), así que lleva pocos `recall`.

| Sección | Repaso | Ampliaciones propuestas |
| :--- | :--- | :--- |
| 1.1 Metacognición y descalibración | — | **Medir la descalibración con tu propia nota:** la evaluación de la app pide estimar el puntaje antes de empezar (RF-31). Mostrar la cuenta: estimar 80 % y sacar 9/12 = 75 % es 5 puntos de sobreconfianza. Revisar la lógica en `src/logic/assessment/` para usar la misma fórmula. Fuente: Kruger y Dunning (1999); Dunlosky y Metcalfe, *Metacognition*. |
| 1.2 Órdenes de ignorancia | — | Revisar redundancia (hay intuiciones con un auto y una "buena noticia"). Posible ampliación: cómo pasar de la ignorancia de 2.º orden a la de 1.º con preguntas de autoevaluación (enlazar con los repasos "¿Te acordás?" del propio curso). |
| 1.3 Perfiles de Leonard | — | Probablemente solo depurar: hay dos intuiciones (la escalera y la guitarra) y "qué significa para vos". |
| 1.4 Estrategias de recalibración | 1.1 (descalibración) | **Por qué ponerse a prueba le gana a releer** (efecto de prueba, Roediger y Karpicke 2006) y **por qué espaciar** (curva del olvido de Ebbinghaus). Conectar con la repetición espaciada de la app: tomar los intervalos reales de `src/logic/review/scheduler.ts` como cifras verificables. Las cifras de los estudios, sin números si no se pueden recalcular. |
| 1.5 Hamming: aprender a aprender | — | Probablemente solo depurar (tres intuiciones). |
| 1.6 Distancia de Hamming | 0.2 (independencia) | **Por qué con distancia mínima $d$ se detectan $d-1$ errores y se corrigen $\lfloor (d-1)/2 \rfloor$:** código de repetición `000`/`111` ($d = 3$: detecta 2 y corrige 1). **Cuánto ayuda repetir:** con una probabilidad de error por bit $p = 0.1$, triplicar y votar por mayoría da $3p^2(1-p) + p^3 = 0.028$. Contar casos sin nombrar la binomial (es del Módulo 2). Fuente: MacKay, *Information Theory, Inference, and Learning Algorithms*, cap. 1. |
| 1.7 Nyquist y Eddington (anexo) | — | **El alias con números:** una rueda que gira a 9 vueltas por segundo filmada a 10 cuadros por segundo parece girar a 1 vuelta por segundo hacia atrás. Muestrear al menos al doble de la frecuencia evita el alias. Fuente: Oppenheim y Willsky, *Signals and Systems* (muestreo). |

---

## 6. Ideas para después (fuera del plan actual)

Las propuso el asistente en la conversación inicial y quedaron pendientes:

- **Términos del glosario con definición al tocarlos** (tooltip) dentro del texto, con "lo viste en…".
- **Ubicación al empezar cada sección** ("venís de…, vas a poder responder…") y un resumen de 3 puntos al terminar.
- **Lectura de a un bloque**, con un "Siguiente" y una barra de avance dentro de la sección.
- **Preguntas de predicción** antes de mostrar un resultado o una simulación.
- **Tarjetas de repaso** de conceptos con la repetición espaciada que ya tiene la app.
- Hacer opcional la apertura de las ampliaciones (por ahora están siempre abiertas; al usuario le gustó así).
