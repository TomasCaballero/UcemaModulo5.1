# Guía de Estudio: Estadística, Econometría y Ciencia de Datos desde las Bases (v3)

## Cómo usar esta guía

Esta guía está pensada para alguien que parte de **conocimientos previos mínimos** (aritmética y álgebra de secundaria). Tiene tres reglas de diseño:

1. **Cada término se explica antes de usarse.** Cuando por necesidad aparece antes de su explicación (por ejemplo, un anticipo en el Módulo 0), se indica el módulo donde se desarrolla.
2. **Cada idea tiene un ejemplo con números**, para que puedas rehacer la cuenta a mano.
3. **Cada módulo termina con preguntas de autoevaluación** y sus respuestas. Intenta responder *antes* de mirar las respuestas: eso es lo que te protege de creer que sabes algo que no sabes (ver Módulo 1).

Orden de los módulos:

| Módulo | Contenido |
| :--- | :--- |
| 0 | Matemática mínima necesaria: sumatorias, probabilidad, álgebra lineal, cálculo, logaritmos |
| 1 | Cómo aprender: metacognición y pensamiento científico |
| 2 | Estadística: medición, inferencia, contraste de hipótesis |
| 3 | Econometría: regresión, causalidad, datos de panel |
| 4 | Minería de datos: preprocesamiento, árboles, asociación, clustering |
| 5 | Clasificación: regresión logística y modelos generativos |
| 6 | Aprendizaje estadístico: sesgo-varianza, regularización, ensambles, SVM |
| 7 | Teoría del aprendizaje: PAC, dimensión VC |

> **Contenido:** los ocho módulos (0 a 7), un glosario y un cuadro síntesis con una guía de uso. Los ejemplos numéricos fueron verificados con un script de Python; las tablas marcadas como "ilustrativas" y el ejemplo de DID usan cifras inventadas.

---

## Módulo 0: La Matemática Mínima que Necesitas

No necesitas ser matemático. Necesitas entender **cinco herramientas**, que son las que el resto de la guía usa una y otra vez. Cada una se explica con lo justo.

### 0.1 Notación básica

Antes de las ideas, el "alfabeto" que verás en todas partes:

| Símbolo | Se lee | Significado | Ejemplo |
| :--- | :--- | :--- | :--- |
| $x_i$ | "x sub i" | El i-ésimo valor de una lista | En la lista $(4, 7, 9)$: $x_1 = 4$, $x_2 = 7$, $x_3 = 9$ |
| $n$ | "n" | Cantidad de datos | $n = 3$ en la lista anterior |
| $\sum$ | "sumatoria" | Sumar una serie de términos | $\sum_{i=1}^{3} x_i = 4 + 7 + 9 = 20$ |
| $\bar{x}$ | "x barra" | El promedio (media) de la lista | $\bar{x} = 20/3 \approx 6.67$ |
| $\hat{y}$ | "y sombrero" | Un valor **predicho o estimado** (no el real) | Si el real es $y=10$ y el modelo dice 9.2, entonces $\hat{y}=9.2$ |
| $\|x\|$ | "valor absoluto" | La magnitud sin signo | $\|-5\| = 5$ |
| $\approx$ | "aproximadamente" | Casi igual | $\pi \approx 3.14$ |
| $\epsilon, u, e$ | "épsilon", "u", "e" | Letras que se usan para el **error** (lo que el modelo no explica) | — |
| $\beta, \theta, \mu, \sigma$ | letras griegas | Cantidades **desconocidas** que queremos estimar (parámetros) | — |

**Regla útil:** letra latina ($x$, $y$) suele ser un dato observado; letra griega ($\beta$, $\mu$) suele ser algo desconocido de la realidad; letra con sombrero ($\hat{\beta}$) es nuestra **estimación** de esa cantidad desconocida.

### 0.2 Probabilidad

#### Lo básico
* **Experimento**: algo cuyo resultado es incierto (tirar un dado).
* **Evento**: un conjunto de resultados que nos interesa (que salga par: $\{2, 4, 6\}$).
* **Probabilidad** $P(A)$: un número entre 0 (imposible) y 1 (seguro) que mide cuán probable es el evento $A$. Si todos los resultados son igual de probables:

$$P(A) = \frac{\text{casos favorables}}{\text{casos totales}}$$

*Ejemplo:* $P(\text{par}) = 3/6 = 0.5$.

* **Complemento**: la probabilidad de que $A$ **no** ocurra es $1 - P(A)$. Si llover tiene probabilidad 0.3, no llover tiene 0.7.

#### Independencia
Dos eventos son **independientes** si saber que uno ocurrió no cambia la probabilidad del otro. Dos tiradas de moneda son independientes. En ese caso la probabilidad de que ocurran ambos se multiplica:

$$P(A \text{ y } B) = P(A) \cdot P(B)$$

*Ejemplo:* dos caras seguidas: $0.5 \times 0.5 = 0.25$.

#### Probabilidad condicional
$P(A \mid B)$ se lee "probabilidad de $A$ **dado que** ocurrió $B$". Es la probabilidad de $A$ una vez que sabemos que $B$ pasó:

$$P(A \mid B) = \frac{P(A \text{ y } B)}{P(B)}$$

*Ejemplo:* en una baraja española de 40 cartas, ¿cuál es la probabilidad de que una carta sea un as, sabiendo que es de oros? Hay 10 cartas de oros y 1 es el as: $P = 1/10$. (Sin saber el palo sería $4/40 = 1/10$: el palo y el número son independientes en la baraja.)

#### Teorema de Bayes (la idea más importante de esta sección)
Permite **dar vuelta** una probabilidad condicional: pasar de $P(B \mid A)$ a $P(A \mid B)$.

$$P(A \mid B) = \frac{P(B \mid A)\, P(A)}{P(B)}$$

*Ejemplo completo (test médico).* Una enfermedad afecta al 1% de la población. Un test detecta la enfermedad en el 90% de los enfermos (sensibilidad) y da falso positivo en el 5% de los sanos. Si das positivo, ¿qué probabilidad tienes de estar enfermo?

1. Positivo y enfermo: $0.01 \times 0.90 = 0.009$
2. Positivo y sano: $0.99 \times 0.05 = 0.0495$
3. Total de positivos: $0.009 + 0.0495 = 0.0585$
4. $P(\text{enfermo} \mid +) = 0.009 / 0.0585 \approx 0.154$

**Solo 15.4 %**, aunque el test parezca "bueno". La razón: hay muchísimos más sanos que enfermos, y el 5 % de una población enorme de sanos genera más positivos que el 90 % de unos pocos enfermos. Esta intuición reaparece en los Módulos 4 y 5 (precisión y recall, Naive Bayes, LDA).

#### Variable aleatoria, esperanza y varianza
* **Variable aleatoria**: un número cuyo valor depende del azar (el resultado de un dado, $X$).
* **Esperanza** $E(X)$: el promedio que obtendrías si repitieras el experimento infinitas veces. Se calcula ponderando cada valor por su probabilidad:

$$E(X) = \sum x \cdot P(X=x)$$

*Dado justo:* $E(X) = (1+2+3+4+5+6)/6 = 3.5$. (Nunca sale 3.5, pero es el centro de gravedad.)

* **Varianza** $\text{Var}(X)$: el promedio de cuánto se alejan los valores del centro, **al cuadrado**:

$$\text{Var}(X) = E\big[(X - E(X))^2\big]$$

*Dado justo:* $\text{Var} = \tfrac{1}{6}\big[(1-3.5)^2 + (2-3.5)^2 + \dots + (6-3.5)^2\big] \approx 2.92$.

* **Desviación típica**: la raíz cuadrada de la varianza. Tiene las mismas unidades que los datos. Para el dado: $\sqrt{2.92} \approx 1.71$.

*¿Por qué al cuadrado?* Porque si no, las desviaciones positivas y negativas se cancelarían y el promedio daría 0.

#### Esperanza condicional
$E(Y \mid X)$ es el valor promedio de $Y$ **entre quienes tienen un valor dado de $X$**. *Ejemplo:* $E(\text{salario} \mid \text{15 años de estudio})$ es el salario promedio de quienes estudiaron 15 años. La regresión (Módulo 3) es, en esencia, una forma de estimar $E(Y \mid X)$.

### 0.3 Álgebra lineal mínima

#### Vectores y matrices
* **Vector**: una lista ordenada de números. $x = (2, 5, 1)$ es un vector de 3 componentes. Representa, por ejemplo, un individuo con 3 características (edad, años de estudio, horas trabajadas).
* **Matriz**: una tabla de números con filas y columnas. En ciencia de datos, la **matriz de datos $X$** tiene una fila por individuo y una columna por variable:

$$X = \begin{pmatrix} 25 & 12 \\ 40 & 16 \\ 31 & 14 \end{pmatrix}$$

(3 personas × 2 variables: edad y años de estudio).

#### Producto interno (producto punto)
Se multiplican los componentes uno a uno y se suman:

$$\langle a, b \rangle = a_1 b_1 + a_2 b_2 + \dots + a_k b_k$$

*Ejemplo:* $(1,2,3) \cdot (4,5,6) = 4 + 10 + 18 = 32$.

#### Combinación lineal (la idea detrás de toda regresión)
Una **combinación lineal** de variables es una suma donde cada variable se multiplica por un número y se suma:

$$\beta_0 + \beta_1 x_1 + \beta_2 x_2$$

Esto es exactamente un producto interno entre el vector de coeficientes y el vector de variables (con un 1 delante para el $\beta_0$). Por eso en los módulos siguientes verás escrito $X\beta$: es la forma compacta de decir "la combinación lineal de todas las variables de cada individuo".

*Ejemplo:* si $\beta_0 = 1000$, $\beta_1 = 50$ (por año de edad) y $\beta_2 = 200$ (por año de estudio), para una persona de 30 años con 12 de estudio: $1000 + 50\cdot30 + 200\cdot12 = 4900$.

#### Dependencia lineal (colinealidad)
Si una columna de $X$ se puede obtener combinando otras columnas, la información es **redundante**. *Ejemplo:* si incluyes "edad en años" y "edad en meses", una columna es 12 veces la otra. Eso se llama **colinealidad perfecta** y rompe la regresión del Módulo 3: el modelo no puede decidir cuánto del efecto atribuir a cada columna.

#### Hiperplano
En 2 dimensiones, una **recta** ($w_1 x_1 + w_2 x_2 + b = 0$) divide el plano en dos mitades. En 3 dimensiones lo hace un plano. En $k$ dimensiones, la misma idea se llama **hiperplano**: una superficie plana que parte el espacio en dos lados. Es la herramienta de separación de las SVM (Módulo 6).

#### Matriz de covarianza (solo la idea)
Cuando tienes varias variables, se resume su variabilidad en una tabla cuadrada: en la **diagonal** están las varianzas de cada variable, y fuera de la diagonal las **covarianzas** (cuánto tienden a moverse juntas dos variables). La verás en LDA/QDA (Módulo 5) y PCA (Módulo 6).

### 0.4 Cálculo mínimo: derivada y optimización

#### Derivada = pendiente
La **derivada** de una función en un punto es la **pendiente** de la curva en ese punto: cuánto cambia la salida si mueves un poquito la entrada. Si la derivada es positiva, la función sube; si es negativa, baja; si es **cero**, estás en una cima o en un valle (un punto donde la curva se aplana).

#### Minimizar una función
Casi todo el aprendizaje automático consiste en **minimizar un error**. Para hacerlo, se busca el punto donde la derivada es cero.

*Ejemplo:* $f(b) = (b - 3)^2 + 1$. Su derivada es $2(b-3)$. Igualando a cero: $b = 3$. Ahí está el mínimo: $f(3) = 1$.

#### Ejemplo central: por qué el promedio es "el mejor resumen"
Supón datos $y_1, \dots, y_n$ y que quieres un único número $b$ que los represente, eligiendo el que minimice la suma de errores al cuadrado:

$$S(b) = \sum_{i=1}^{n} (y_i - b)^2$$

Derivando e igualando a cero: $-2\sum (y_i - b) = 0$, de donde $b = \bar{y}$.

**El promedio es la solución de mínimos cuadrados** cuando el modelo es solo "una constante". La regresión OLS del Módulo 3 es la misma idea, pero con una recta (o hiperplano) en vez de una constante.

#### Gradiente y descenso por gradiente
Cuando hay varios parámetros, se calcula una derivada para cada uno; el vector de todas ellas es el **gradiente**. Apunta hacia donde la función **sube más rápido**, así que para bajar se avanza en dirección contraria. Repetir esto paso a paso es el **descenso por gradiente**: la analogía es bajar una montaña con niebla, dando cada paso hacia donde el suelo desciende más. Es la base de Gradient Boosting (Módulo 6).

### 0.5 Logaritmos y exponenciales

* **Exponencial**: $e^x$, donde $e \approx 2.718$ es una constante especial. Siempre da un número positivo. $e^0 = 1$.
* **Logaritmo natural** $\ln(x)$: la operación **inversa** de la exponencial. Responde: "¿a qué potencia debo elevar $e$ para obtener $x$?". Por eso $\ln(e^x) = x$ y $e^{\ln x} = x$.

Valores para tener a mano:

| $x$ | $\ln(x)$ |
| :--- | :--- |
| 1 | 0 |
| 2 | 0.693 |
| 4 | 1.386 |
| $e \approx 2.718$ | 1 |

**Propiedad estrella:** el logaritmo convierte **productos en sumas**:

$$\ln(a \cdot b) = \ln(a) + \ln(b)$$

Por eso se usa tanto: sumar es mucho más fácil que multiplicar (en particular para la máxima verosimilitud del Módulo 2 y la regresión logística del Módulo 5).

*Ejemplo de uso real (anticipo del Módulo 5):* $e^{0.693} \approx 2$. Es decir, un coeficiente de $0.693$ en una escala logarítmica equivale a **multiplicar por 2** en la escala original.

### Autoevaluación del Módulo 0

Responde en papel antes de mirar las respuestas.

1. Calcula $\sum_{i=1}^{4} x_i$ para $x = (2, 4, 6, 8)$ y luego $\bar{x}$.
2. Se tiran dos dados. ¿Probabilidad de que ambos den 6?
3. En el ejemplo del test médico, si la enfermedad afectara al 10 % (en vez de 1 %) con los mismos datos del test, ¿la probabilidad de estar enfermo dado un positivo sube o baja? Estímala sin calcular y luego calcúlala.
4. Calcula el producto interno de $(3, 0, 2)$ y $(1, 5, 4)$.
5. ¿Por qué el promedio es el número $b$ que minimiza $\sum (y_i - b)^2$? Explícalo con tus palabras.
6. ¿Cuánto vale $e^{\ln 5}$?
7. Si en un conjunto de datos tienes las columnas "peso en kg" y "peso en gramos", ¿qué problema aparece al hacer una regresión?

### Respuestas del Módulo 0

1. Suma $= 20$; $\bar{x} = 20/4 = 5$.
2. $\tfrac{1}{6} \times \tfrac{1}{6} = \tfrac{1}{36} \approx 0.028$ (los dados son independientes).
3. **Sube.** Con 10 %: positivo y enfermo $= 0.10 \times 0.90 = 0.09$; positivo y sano $= 0.90 \times 0.05 = 0.045$; $P = 0.09 / 0.135 \approx 0.667$ (66.7 %). Cuanto más común es la enfermedad, más peso tiene un positivo.
4. $3\cdot1 + 0\cdot5 + 2\cdot4 = 11$.
5. Al derivar la suma de errores al cuadrado e igualar a cero, queda que la suma de las desviaciones $\sum(y_i - b)$ debe ser cero; eso solo ocurre cuando $b$ es el promedio. Intuitivamente: el promedio es el punto de equilibrio donde los errores positivos y negativos se compensan.
6. $5$.
7. **Colinealidad perfecta**: una columna es exactamente 1000 veces la otra, así que la información es redundante y el modelo no puede separar sus efectos.

---

## Módulo 1: La Mente del Aprendiz y el Arte de Pensar Científicamente

Antes de aprender estadística o programación hay que preparar el instrumento con el que aprendemos: la propia mente. Este módulo no tiene fórmulas, pero es el que más te sirve si estudias con poco tiempo, porque te ayuda a **decidir qué estudiar y a detectar cuándo crees saber algo que no sabes**.

### 1.1 Metacognición y descalibración metacognitiva

La **metacognición** es la capacidad de monitorear y controlar nuestros propios procesos de pensamiento: "pensar sobre cómo pensamos". Incluye preguntas como "¿entendí esto de verdad?", "¿estoy usando una buena estrategia para estudiar?".

Cuando ese monitoreo falla, aparece la **descalibración metacognitiva**: la persona **cree que domina** un tema que en realidad desconoce, o duda de una respuesta que en realidad era correcta.

**Analogía del velocímetro estropeado.** Imagina conducir con un velocímetro que marca 60 km/h cuando en realidad vas a 120. Como confías en el tablero, no frenas y tomas la curva a exceso de velocidad. La descalibración actúa igual: da una falsa sensación de control que te impide frenar a estudiar.

**Cómo se ve en la práctica:**
* Releer un capítulo y pensar "esto lo tengo claro" solo porque te resulta **familiar** (reconocer no es lo mismo que poder explicar o resolver).
* Frases como *"esa materia no tiene nada nuevo que enseñarme"* o *"el examen estaba mal planteado porque yo domino el tema"*.

**Cómo detectarla:** cierra el material e intenta **explicar el tema en voz alta o resolver un ejercicio sin mirar**. Si no puedes, tu "sensación de saber" estaba descalibrada. Por eso esta guía incluye autoevaluaciones.

### 1.2 Los órdenes de ignorancia (modelo de Phillip Armour)

Armour clasificó el conocimiento según **cómo nos relacionamos con lo que ignoramos**:

| Orden | Nombre | Qué significa | Ejemplo |
| :--- | :--- | :--- | :--- |
| **0OI** | Conocimiento | Sabes algo y puedes ejecutarlo o explicarlo | Sabes andar en bicicleta |
| **1OI** | Ignorancia consciente | Sabes **qué** no sabes | "Sé que no sé hablar alemán" |
| **2OI** | Ignorancia inconsciente | **No sabes que no sabes** | Crees dominar un tema y te falta una parte entera |
| **3OI** | Falta de proceso | No tienes un **método** para descubrir tu 2OI | No sabes cómo poner a prueba lo que sabes |

* El **2OI** es el estado más peligroso y es la raíz de la descalibración metacognitiva.
* El **3OI** es el que más se puede arreglar: la solución es tener un proceso (autoevaluación, explicar a otros, resolver problemas sin ayuda, pedir revisión).

**Objetivo práctico de estudio:** transformar 2OI en 1OI (descubrir qué te falta), y luego 1OI en 0OI (aprenderlo).

### 1.3 Los perfiles de aprendizaje de George Leonard

Al aprender una habilidad compleja, el progreso **no es una línea recta ascendente**: es una **escalera de mesetas**. Hay breves saltos de mejora seguidos de largos periodos donde parece que no avanzas, pero en los que tu mente está asimilando. Leonard describe cuatro reacciones típicas:

* **El Aficionado (*Dabbler*)**: se entusiasma al empezar, pero en cuanto llega a la primera meseta abandona y busca otra novedad.
* **El Hacker**: aprende lo mínimo para salir del paso y se niega a profundizar.
* **El Obsesivo**: exige resultados inmediatos; en la meseta se exige el doble, se frustra y se agota.
* **El Maestro**: valora la meseta. Entiende que el aprendizaje real ocurre en el trabajo silencioso y constante.

**Aplicación:** si estudias un posgrado a la vez que trabajas, vas a vivir mesetas (semanas en que parece que no entiendes nada de regresión logística, por ejemplo). Eso es normal. Lo que más ayuda es la **constancia**, más que la intensidad de un día aislado.

### 1.4 Estrategias de recalibración

Para corregir la descalibración y pasar de 2OI a 1OI:

* **Mente de principiante (*Shoshin*)**: asumir que siempre hay algo nuevo por aprender, incluso en lo elemental.
* **Construir la playa grano a grano**: el conocimiento no se adquiere de golpe; se acumula como una playa, grano por grano. Cada sesión de estudio agrega unos pocos granos.
* **Poner a prueba lo que crees saber**: autoevaluación, explicar a otra persona, resolver ejercicios sin mirar la solución. **Si no puedes explicarlo con palabras simples, todavía no lo sabes.**

### 1.5 La filosofía de Richard Hamming: aprender a aprender

Richard Hamming (matemático e ingeniero, 1915-1998) sostenía que, con la tecnología cambiando tan rápido, la educación no debería centrarse en memorizar contenidos que quedarán viejos, sino en adquirir un **estilo de pensamiento** que te permita adaptarte.

> "La suerte favorece a la mente preparada." — Louis Pasteur

Los grandes descubrimientos no son accidentes aleatorios: suelen ocurrirle a quienes llevan mucho tiempo **pensando en un problema** y tienen la mente "saturada" de él, de modo que reconocen la oportunidad cuando aparece.

**Programar se parece más a escribir que a construir puentes.** Dos ingenieros que diseñan el mismo puente bajo las mismas leyes de la física llegarán a estructuras muy parecidas. Pero si pides a dos novelistas que escriban sobre la grandeza humana, o a dos programadores que resuelvan un problema complejo, obtendrás obras y códigos muy distintos. Esto significa que en programación y análisis de datos **hay estilo y decisiones de diseño**, no una única respuesta correcta.

### 1.6 Distancia de Hamming y códigos de corrección de errores

Hamming trabajó en telecomunicaciones y se preguntó cómo hacer que una máquina **detecte y corrija sus propios errores** de transmisión sin intervención humana. Hay dos ideas distintas, que conviene no mezclar:

#### a) Distancia de Hamming
La **distancia de Hamming** entre dos secuencias de igual longitud es **el número de posiciones en las que difieren**.

*Ejemplo:* $10110$ y $11100$ difieren en la posición 2 y en la 4, así que su distancia es $2$.

Si se diseña un conjunto de mensajes válidos de modo que **cualquier par esté a distancia al menos 3**, entonces:
* un error de 1 bit deja el mensaje recibido "más cerca" del mensaje original que de cualquier otro, así que se **puede corregir**;
* alternativamente, se pueden **detectar** hasta 2 errores (sin corregirlos). Con distancia 3 se elige una de las dos opciones, no ambas a la vez: un error de 2 bits corregido "automáticamente" llevaría a un mensaje equivocado.

El **código de Hamming (7,4)** aplica esta idea: a cada 4 bits de datos se agregan 3 bits de verificación y el receptor puede corregir automáticamente un error de un solo bit.

#### b) Dígitos verificadores (idea relacionada, pero distinta)
Al transcribir números, los humanos solemos **trasponer dígitos adyacentes** (escribir 76 en vez de 67). Una suma simple de dígitos no lo detecta: $6+7 = 7+6 = 13$. En cambio, si se **ponderan las posiciones** (por ejemplo, $1\times6 + 2\times7 = 20$ frente a $1\times7 + 2\times6 = 19$) la transposición cambia el resultado y se detecta. Así funcionan los dígitos verificadores de códigos como el ISBN de los libros.

**Idea general (para todo el curso):** agregar **redundancia estructurada** permite detectar y corregir errores. Vas a volver a ver esta idea de "redundancia útil" en conceptos como regularización y ensambles.

### Anexo opcional: muestreo de Nyquist-Shannon y la red de Eddington

> Estos dos temas son tangenciales para data science. Úsalos como cultura general, no como prioridad de estudio.

**Teorema de Nyquist-Shannon.** Para digitalizar una señal que varía en el tiempo (por ejemplo, sonido) hay que **tomar muestras** a intervalos regulares; la **frecuencia de muestreo** es cuántas muestras se toman por segundo. Para no perder información, debe ser **al menos el doble de la frecuencia máxima** de la señal:

$$f_s \ge 2 f_{\text{máx}}$$

Si se muestrea por debajo de ese límite ocurre el ***aliasing***: las frecuencias altas se "disfrazan" de frecuencias bajas. *Ejemplo:* una señal de 10 Hz muestreada a 12 Hz (menos de los 20 Hz necesarios) se ve como una señal de $|10-12| = 2$ Hz. Es el mismo efecto por el que en las películas las ruedas de un carro parecen girar hacia atrás.

**La red de pescar de Eddington.** Un científico pesca con una red de malla de 5 cm y concluye que "no existen peces más pequeños de 5 cm". Moraleja: **nuestras herramientas de medición determinan lo que podemos ver**. Un modelo o un muestreo solo detecta los patrones para los que fue diseñado. Es una versión del *sesgo de selección*: si la muestra o el instrumento no son representativos de lo que se quiere estudiar (ver 2.1), las conclusiones salen distorsionadas.

### Autoevaluación del Módulo 1

1. Explica con tus palabras la diferencia entre 1OI y 2OI. Da un ejemplo de tu propia vida.
2. Acabas de releer un capítulo y sientes que lo entendiste perfectamente. Menciona dos formas concretas de comprobar si esa sensación está calibrada.
3. Un compañero abandona un curso apenas pasa de la tercera semana, cuando el progreso se estanca. ¿Qué perfil de Leonard describe esto? ¿Y quien estudia 12 horas al día y se agota a la semana?
4. Calcula la distancia de Hamming entre $0110101$ y $0100111$.
5. ¿Por qué una suma simple de dígitos no sirve para detectar transposiciones, y qué se hace para solucionarlo?
6. ¿Qué diferencia a Hamming (distancia) de los dígitos verificadores, aunque ambos busquen detectar errores?

### Respuestas del Módulo 1

1. **1OI**: sabes qué no sabes (ej.: "no sé nada de estadística bayesiana"). **2OI**: no sabes que no sabes (ej.: creer que entiendes un p-valor pero interpretarlo mal sin darte cuenta). La segunda es más peligrosa porque no puedes buscar ayuda para un problema que no ves.
2. Por ejemplo: (a) cerrar el material y explicar el tema en voz alta o por escrito; (b) resolver un ejercicio sin mirar la solución; (c) responder una autoevaluación; (d) explicarlo a otra persona.
3. El primero es el **Aficionado (*Dabbler*)**; el segundo es el **Obsesivo**.
4. Se comparan posición a posición: `0110101` vs `0100111`: difieren en la posición 3 y en la 6. Distancia $= 2$.
5. Porque la suma es conmutativa: $6+7 = 7+6$. Se soluciona **ponderando** cada posición con un peso distinto, de modo que cambiar el orden cambie el resultado.
6. La **distancia de Hamming** mide cuán distintos son dos mensajes y sirve para diseñar códigos que **corrigen** errores. Los **dígitos verificadores** son una prueba de consistencia que **detecta** ciertos errores comunes de tipeo, pero no los corrige.

---

## Módulo 2: Estadística, Medición e Inferencia

La estadística es el conjunto de herramientas para **tomar decisiones razonables cuando hay incertidumbre y variabilidad**. Casi todo lo que sigue en la guía (regresión, clasificación, aprendizaje automático) se apoya en las ideas de este módulo.

### 2.1 Vocabulario base: población, muestra, parámetro, estadístico

* **Población**: el conjunto completo que nos interesa (todos los clientes de un banco, todos los votantes del país).
* **Muestra**: un subconjunto de la población que sí podemos observar.
* **Variable**: una característica que se mide en cada individuo (edad, ingreso, si compró o no).
* **Parámetro**: un número que describe a la **población** y casi siempre es **desconocido** (la media poblacional $\mu$, la desviación típica poblacional $\sigma$).
* **Estadístico (o estimador)**: un número calculado a partir de la **muestra** (la media muestral $\bar{x}$, la desviación típica muestral $s$). Se usa para **estimar** el parámetro.

| | Población | Muestra |
| :--- | :--- | :--- |
| Media | $\mu$ (desconocida) | $\bar{x}$ (calculable) |
| Desviación típica | $\sigma$ | $s$ |
| Tamaño | $N$ | $n$ |

Con esto se definen las dos grandes ramas:

* **Estadística descriptiva**: resume los datos que **tienes** (tablas, promedios, gráficos). Es sacar una fotografía del grupo y medir su estatura promedio.
* **Estadística inferencial**: usa la muestra para sacar conclusiones sobre una **población que no puedes medir entera**. Es probar una cucharada de sopa para decidir si a toda la olla le falta sal. La condición es que la cucharada esté bien revuelta, es decir, que la muestra sea **representativa** (idealmente elegida al azar).

### 2.2 Medidas de tendencia central y de dispersión

Para resumir una lista de datos se usan números de **posición** (dónde está el centro) y de **dispersión** (cuánto se esparcen).

**Tendencia central**
* **Media** ($\bar{x}$): suma de los valores dividida por $n$. Es el "punto de equilibrio".
* **Mediana**: el valor central cuando los datos están ordenados (con cantidad par, el promedio de los dos centrales). La mitad de los datos queda por debajo y la mitad por encima.
* **Moda**: el valor que **más se repite**.

**Dispersión**
* **Varianza muestral** ($s^2$): promedio de las desviaciones al cuadrado respecto a la media. Se divide por $n-1$ y no por $n$:

$$s^2 = \frac{\sum_{i=1}^{n}(x_i - \bar{x})^2}{n-1}$$

  *Por qué $n-1$:* la media $\bar{x}$ se calculó con los mismos datos, así que los datos están, en promedio, más cerca de $\bar{x}$ que de la verdadera $\mu$. Dividir por $n$ subestimaría la varianza; $n-1$ lo corrige.
* **Desviación típica** ($s$): $\sqrt{s^2}$. Está en las mismas unidades que los datos.

**Ejemplo con números.** Datos: $2, 4, 4, 6, 9$ ($n=5$).
* Media: $25/5 = 5$. Mediana: $4$. Moda: $4$.
* Desviaciones respecto a la media: $-3, -1, -1, 1, 4$. Al cuadrado: $9, 1, 1, 1, 16$; suma $= 28$.
* $s^2 = 28/4 = 7$; $s = \sqrt{7} \approx 2.65$.

**Valores atípicos (*outliers*).** Cambia el $9$ por un $90$: los datos son $2, 4, 4, 6, 90$. La media salta a $21.2$, pero la mediana sigue siendo $4$. **La mediana es robusta a valores extremos; la media no.** Por eso, con ingresos o precios de viviendas (muy sesgados), se suele reportar la mediana.

**Metáfora del abanico.** La media indica hacia dónde apunta el mango del abanico; la desviación típica indica cuánto se abre la tela. Desviación pequeña: datos agrupados. Desviación grande: datos dispersos.

### 2.3 Escalas de medición (Stevens) y calidad de datos

No todos los datos se miden igual, y el tipo de escala determina **qué cálculos tienen sentido**:

| Escala | Qué permite | Ejemplo | Resumen válido |
| :--- | :--- | :--- | :--- |
| **Nominal** | Solo clasificar, sin orden | Estado civil, marca de auto | Moda, frecuencias |
| **Ordinal** | Ordenar, pero la distancia entre valores no es uniforme | Satisfacción: bajo / medio / alto | Mediana, percentiles |
| **Intervalo** | Ordenar y las diferencias son constantes, pero el **cero es arbitrario** | Temperatura en °C, año calendario | Media, desviación típica |
| **Razón** | Todo lo anterior y **tiene un cero absoluto** (ausencia total) | Salario, peso, edad | Todo, incluyendo cocientes |

*Claves para recordar:*
* 20 °C **no** es "el doble de caliente" que 10 °C (el cero de Celsius es arbitrario), pero un salario de $2000 sí es el doble que uno de $1000.
* Promediar una escala ordinal ("bajo=1, medio=2, alto=3") es discutible, porque nada garantiza que el salto de 1 a 2 valga lo mismo que de 2 a 3.

**Calidad de datos.** Antes de analizar, conviene revisar:
* **Ruido**: variación aleatoria que distorsiona la señal (un sensor impreciso).
* **Valores atípicos**: ¿son errores de carga o casos reales?
* **Datos faltantes (*missing values*)**: se pueden eliminar, imputar (rellenar con la media, la mediana o con un modelo) o marcar. La decisión depende de *por qué* faltan.
* **Redondeo y cifras significativas**: no reportes resultados con más precisión que la de tu instrumento de medición (si mides con regla en milímetros, no informes 12.34567 mm).

### 2.4 Distribuciones de probabilidad

Una **distribución** describe **qué valores puede tomar una variable aleatoria y con qué probabilidad**.

* Si la variable es **discreta** (valores contables: 0, 1, 2…), se da la probabilidad de cada valor.
* Si es **continua** (cualquier valor en un intervalo: estatura, tiempo), se usa una **curva de densidad**, y la **probabilidad de un rango es el área bajo la curva** en ese rango. (La probabilidad de un valor exacto es 0.)
* Las **colas** son los extremos de la distribución. Una distribución de "colas pesadas" da más probabilidad a valores extremos.

#### Binomial
Cuenta el número de **éxitos** en $n$ ensayos independientes, cada uno con probabilidad de éxito $p$ (cara/cruz, compra/no compra).

$$P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}, \qquad \binom{n}{k} = \frac{n!}{k!\,(n-k)!}$$

Media $= np$; varianza $= np(1-p)$.

*Ejemplo:* 10 tiradas de moneda, ¿probabilidad de exactamente 3 caras? $\binom{10}{3}(0.5)^{10} = 120/1024 \approx 0.117$.

#### Poisson
Cuenta cuántas veces ocurre un **evento raro** en un intervalo de tiempo o espacio, si ocurre a una tasa media $\lambda$ y de forma independiente.

$$P(X=k) = \frac{e^{-\lambda}\lambda^k}{k!}$$

Media $= \lambda$ y varianza $= \lambda$.

*Ejemplo:* una central recibe en promedio $\lambda = 3$ llamadas por minuto. Probabilidad de **ninguna** llamada: $e^{-3} \approx 0.050$. De **exactamente 2**: $e^{-3}\cdot 9/2 \approx 0.224$.

#### Normal (la campana de Gauss)
Se escribe $N(\mu, \sigma)$. Es simétrica y queda definida por su media y su desviación típica. Aparece de forma natural cuando una variable es **la suma de muchos pequeños factores independientes** (estatura, errores de medición). Regla práctica:

* ~68 % de los datos está a menos de **1** desviación típica de la media,
* ~95 % a menos de **2**,
* ~99.7 % a menos de **3**.

**Estandarización (puntaje $z$):** $z = (x-\mu)/\sigma$ dice a cuántas desviaciones típicas de la media está un valor. *Ejemplo:* si el coeficiente intelectual tiene $\mu=100$ y $\sigma=15$, un valor de 130 tiene $z=2$, y solo ~2.3 % de la gente lo supera.

#### $t$ de Student
Parece una Normal, pero con **colas más pesadas**. Aparece cuando hay que **estimar la desviación típica con la propia muestra** ($s$ en vez de $\sigma$), lo que agrega incertidumbre extra, sobre todo con muestras pequeñas. Depende de los **grados de libertad** ($gl = n-1$ en el caso de la media); cuando $n$ crece, se parece cada vez más a la Normal.

#### Chi-cuadrado ($\chi^2$)
Es la distribución de la **suma de $k$ variables Normales estándar elevadas al cuadrado** ($k$ = grados de libertad). Solo toma valores positivos. Se usa para inferir sobre **varianzas** y en pruebas sobre **tablas de contingencia** (tablas que cruzan los conteos de dos variables categóricas, por ejemplo género × marca preferida).

#### $F$ de Fisher-Snedecor
Es el **cociente entre dos $\chi^2$**, cada una dividida por sus grados de libertad. Sirve para **comparar variabilidades**: por ejemplo, en el análisis de varianza (**ANOVA**, que compara las medias de varios grupos mediante la relación entre la variabilidad *entre* grupos y *dentro* de los grupos) y en la regresión, para decidir si un modelo explica algo en conjunto.

**Resumen:**

| Distribución | ¿Cuándo aparece? |
| :--- | :--- |
| Binomial | Contar éxitos en $n$ ensayos |
| Poisson | Contar eventos raros en un intervalo |
| Normal | Sumas/promedios de muchos factores; errores |
| $t$ | Inferir la media con $\sigma$ desconocida (muestras chicas) |
| $\chi^2$ | Varianzas; tablas de contingencia |
| $F$ | ANOVA; comparar modelos o varianzas |

### 2.5 Distribución muestral y Teorema del Límite Central (TLC)

Si tomas una muestra y calculas $\bar{x}$, y luego tomas **otra** muestra, obtienes otra $\bar{x}$ distinta. La $\bar{x}$ **varía de muestra en muestra**. Su distribución se llama **distribución muestral de la media**.

**Teorema del Límite Central.** Si la población tiene media $\mu$ y varianza finita $\sigma^2$, entonces para $n$ suficientemente grande la distribución de $\bar{x}$ es **aproximadamente Normal**, **sin importar la forma de la población original**:

$$\bar{x} \;\approx\; N\!\left(\mu,\; \frac{\sigma}{\sqrt{n}}\right)$$

* La desviación típica de $\bar{x}$, $\sigma/\sqrt{n}$, se llama **error estándar**. En la práctica se estima con $s/\sqrt{n}$.
* "Suficientemente grande" suele indicarse como $n \ge 30$, pero es una **regla práctica**: si la población es muy asimétrica puede hacer falta más.
* El teorema habla de **promedios (y sumas)**, no de los datos individuales.

*Ejemplo:* ingresos de una población muy sesgada con $\mu = 1000$ y $\sigma = 600$. Con muestras de $n=100$, el error estándar es $600/10 = 60$. Entonces, aproximadamente el 95 % de las medias muestrales cae en $1000 \pm 2\times60$, es decir, entre 880 y 1120, aunque los ingresos individuales estén muy dispersos.

**Dos consecuencias clave:**
1. Más datos $\Rightarrow$ menos error: para **reducir el error estándar a la mitad** hay que **cuadruplicar** $n$.
2. Gracias al TLC se pueden construir intervalos de confianza y contrastes de hipótesis sobre medias sin saber cómo se distribuye la población.

### 2.6 Estimación: intervalos de confianza y máxima verosimilitud

Un **estimador** es una regla para calcular, desde la muestra, un valor que aproxime un parámetro. Un estimador es **insesgado** si, en promedio sobre muchas muestras, acierta al parámetro (por ejemplo, $\bar{x}$ es insesgado para $\mu$).

#### Intervalo de confianza
Una estimación puntual (un solo número) casi nunca da en el blanco. Un **intervalo de confianza** da un rango. Para la media, con muestra grande:

$$\bar{x} \;\pm\; z^{*}\cdot\frac{s}{\sqrt{n}}$$

donde $z^{*} = 1.96$ para un 95 % de confianza (con muestras pequeñas se usa el valor de la $t$ en lugar de $z^*$).

*Ejemplo:* $n=100$, $\bar{x} = 1050$, $s = 600$. Error estándar $= 60$. Intervalo al 95 %: $1050 \pm 1.96\times60 = 1050 \pm 117.6$, es decir, **[932.4 ; 1167.6]**.

**Interpretación correcta (la que más se confunde).** El parámetro $\mu$ es un valor **fijo** (desconocido); lo que **varía** es el intervalo, porque depende de la muestra. "95 % de confianza" significa que **si repitieras el procedimiento muchas veces, el 95 % de los intervalos construidos así contendría el verdadero $\mu$**.

> **Analogía del aro y la estaca.** La estaca (el parámetro) está clavada en el suelo y no se mueve. Tú lanzas un aro (el intervalo) una y otra vez con una técnica que atrapa la estaca el 95 % de las veces. Cada lanzamiento concreto la atrapa o no; no sabes cuál ocurrió. Por eso **no es correcto** decir "hay un 95 % de probabilidad de que $\mu$ esté en [932.4 ; 1167.6]": en ese intervalo ya calculado, $\mu$ está o no está. El 95 % describe la **fiabilidad del método**.

**Qué hace al intervalo más ancho:** mayor confianza (99 % > 95 %), mayor variabilidad ($s$) y menos datos ($n$).

#### Función de verosimilitud y máxima verosimilitud (MLE)
Supón que tiras una moneda 10 veces y obtienes **7 caras**. ¿Qué valor de $p$ (probabilidad de cara) hace **más plausibles** estos datos?

La **verosimilitud** es la probabilidad de los datos observados, vista **como función del parámetro**:

$$L(p) = p^{7}(1-p)^{3}$$

* $L(0.5) = 0.5^{10} \approx 0.00098$
* $L(0.7) = 0.7^{7}\cdot0.3^{3} \approx 0.00222$ (más del doble)

El **estimador de máxima verosimilitud (MLE)** es el valor del parámetro que **maximiza** $L$. Es más cómodo maximizar el **logaritmo** ($\ln L = 7\ln p + 3\ln(1-p)$, ver Módulo 0.5): al derivar e igualar a cero se obtiene $\hat{p} = 7/10 = 0.7$.

> Ojo: la verosimilitud **no** es la probabilidad de que el parámetro valga tal cosa; es la probabilidad de los **datos** dado el parámetro.

La máxima verosimilitud es el método con el que se estiman los modelos del Módulo 5 (logit, probit).

### 2.7 Contraste de hipótesis y tamaño del efecto

El contraste de hipótesis se parece a un **juicio**:

| En el juicio | En estadística |
| :--- | :--- |
| Presunción de inocencia | **Hipótesis nula $H_0$**: la postura por defecto ("no hay efecto", "$\mu = 100$") |
| La acusación | **Hipótesis alternativa $H_a$**: "sí hay efecto" |
| Las pruebas | Los datos de la muestra |
| El veredicto | Rechazar o **no** rechazar $H_0$ |

**Pasos:**
1. Plantear $H_0$ y $H_a$.
2. Fijar el **nivel de significación $\alpha$** (casi siempre $0.05$): la probabilidad de equivocarse al rechazar una $H_0$ verdadera que estamos dispuestos a tolerar.
3. Calcular un **estadístico de contraste**: un número que mide cuán lejos están los datos de lo que predice $H_0$, en unidades de error estándar. Para una media: $t = \dfrac{\bar{x} - \mu_0}{s/\sqrt{n}}$.
4. Calcular el **p-valor** y decidir.

**P-valor (definición correcta):** es la probabilidad, **suponiendo que $H_0$ es cierta**, de obtener un resultado **tan extremo o más** que el observado. Si $p < \alpha$, se rechaza $H_0$.

Lo que el p-valor **no** es: no es la probabilidad de que $H_0$ sea cierta, ni la probabilidad de que el resultado sea fruto del azar.

**Ejemplo completo.** Un fabricante dice que sus baterías duran 100 horas. Pruebas $n=36$ y obtienes $\bar{x} = 96$, $s=12$.
* $H_0: \mu = 100$; $H_a: \mu \neq 100$.
* Error estándar $= 12/\sqrt{36} = 2$.
* $t = (96-100)/2 = -2$, con $gl = 35$.
* El valor crítico de la $t$ para $\alpha = 0.05$ (dos colas) es aprox. $2.03$, y $|-2| < 2.03$. El p-valor es aproximadamente $0.053$.
* **Decisión:** como $p > 0.05$, **no se rechaza $H_0$**. (Si hubieras obtenido $\bar{x}=95$, $t=-2.5$ y $p \approx 0.017$, y sí se rechazaría.)

**Importante:** "no rechazar $H_0$" **no** significa "demostrar que $H_0$ es cierta"; significa que **no hay evidencia suficiente** en su contra, igual que "no culpable" no es "inocente probado". Por eso se evita decir "aceptar $H_0$". Además, $0.05$ es una convención, y $p=0.053$ y $p=0.049$ son evidencias casi idénticas.

#### Errores posibles

| Realidad | No rechazar $H_0$ | Rechazar $H_0$ |
| :--- | :--- | :--- |
| **$H_0$ verdadera** (inocente) | Decisión correcta | **Error Tipo I** ($\alpha$): condenar a un inocente (falso positivo) |
| **$H_0$ falsa** (culpable) | **Error Tipo II** ($\beta$): liberar a un culpable (falso negativo) | **Potencia** ($1-\beta$): decisión correcta |

* La **potencia** es la probabilidad de detectar un efecto real cuando existe. Aumenta con más datos, con efectos más grandes y con menor variabilidad.
* Reducir $\alpha$ (ser más exigente para condenar) **aumenta $\beta$** si no cambias $n$: hay un equilibrio entre ambos errores.

#### Tamaño del efecto
El p-valor dice si hay evidencia de un efecto, **no si ese efecto importa**. Con una muestra enorme, hasta una diferencia ínfima resulta "significativa". Para medir la **magnitud práctica** se usa, por ejemplo, la **$d$ de Cohen**:

$$d = \frac{\text{diferencia entre medias}}{\text{desviación típica}}$$

Es una diferencia expresada en "desviaciones típicas". Guía orientativa de Cohen: $0.2$ pequeño, $0.5$ mediano, $0.8$ grande. En el ejemplo de las baterías: $d = (96-100)/12 \approx -0.33$ (efecto entre pequeño y mediano).

*Contraste:* con $n = 100\,000$, una diferencia de solo $0.5$ horas ($s=12$) daría $t \approx 13$ (muy significativa), pero $d \approx 0.04$ (irrelevante en la práctica). **Siempre hay que mirar el p-valor y el tamaño del efecto.**

### Autoevaluación del Módulo 2

1. Calcula la media, la varianza muestral y la desviación típica de $3, 5, 7, 9, 11$.
2. Con 4 tiradas de una moneda justa, ¿probabilidad de exactamente 2 caras?
3. Si $\mu=100$ y $\sigma=15$, ¿qué $z$ tiene el valor 85 y qué significa?
4. Clasifica por escala: (a) número de camiseta de un jugador, (b) talla S/M/L, (c) año calendario, (d) ingreso mensual.
5. Con $s=20$: ¿cuál es el error estándar de la media para $n=100$ y para $n=400$? ¿Qué conclusión sacas?
6. ¿Por qué es incorrecto decir "hay un 95 % de probabilidad de que $\mu$ esté en este intervalo ya calculado"? ¿Cuál es la interpretación correcta?
7. Un estudio reporta $p = 0.03$ con una $d$ de Cohen de $0.05$ y $n$ enorme. ¿Qué concluyes?
8. Si obtienes $p = 0.20$, ¿puedes afirmar que $H_0$ es cierta? Justifica.
9. En el ejemplo del juicio, ¿qué le pasa a $\beta$ si reduces $\alpha$ y no cambias $n$?
10. ¿Qué dice y qué no dice el Teorema del Límite Central?

### Respuestas del Módulo 2

1. Media $= 7$. Desviaciones: $-4,-2,0,2,4$; al cuadrado suman $40$. $s^2 = 40/4 = 10$; $s \approx 3.16$.
2. $\binom{4}{2}(0.5)^4 = 6/16 = 0.375$.
3. $z = (85-100)/15 = -1$: está a una desviación típica **por debajo** de la media (alrededor del 16 % de la población queda por debajo).
4. (a) nominal; (b) ordinal; (c) intervalo; (d) razón.
5. $20/\sqrt{100} = 2$ y $20/\sqrt{400} = 1$. Cuadruplicar la muestra **reduce a la mitad** el error estándar.
6. Porque $\mu$ es fijo y lo aleatorio es el intervalo. El 95 % es la proporción de intervalos que contendrían a $\mu$ si repitiéramos el muestreo muchas veces; no es la probabilidad de un intervalo concreto.
7. El resultado es **estadísticamente significativo pero prácticamente irrelevante**: con $n$ enorme se detecta un efecto minúsculo ($d=0.05$).
8. **No.** $p=0.20$ indica que los datos no contradicen $H_0$ lo suficiente; falta de evidencia no es evidencia de ausencia (puede deberse a poca potencia).
9. $\beta$ **aumenta**: es más difícil rechazar $H_0$, así que se pierden más efectos reales.
10. Dice que la distribución de la **media muestral** (o suma) se aproxima a una Normal con media $\mu$ y error estándar $\sigma/\sqrt{n}$ cuando $n$ es grande, sea cual sea la forma de la población. **No** dice que los datos individuales sean Normales.

---

## Módulo 3: Econometría, Regresión y Causalidad

La **econometría** usa herramientas estadísticas para responder preguntas del tipo "¿cuánto cambia $Y$ cuando cambia $X$?", y sobre todo "¿**es causal** esa relación?", a partir de datos que casi nunca provienen de experimentos controlados. Es la base del análisis de impacto y de buena parte de la modelización estadística en ciencia de datos.

### 3.1 Estructuras de datos

Antes de modelar hay que saber **cómo están organizados los datos**, porque eso determina qué técnicas son válidas. Hay cuatro estructuras típicas:

| Estructura | Qué es | Ejemplo |
| :--- | :--- | :--- |
| **Corte transversal** (*cross-section*) | Muchas unidades (personas, hogares, empresas) observadas **en un solo momento** | Encuesta a 2000 hogares en 2023 |
| **Serie de tiempo** (*time series*) | **Una** unidad observada **a lo largo del tiempo** | Inflación mensual de un país, 2000-2024 |
| **Corte transversal acumulado** (*pooled cross-section*) | Muestras **independientes** tomadas en distintos momentos (las personas **no** son las mismas) | Encuestas de empleo de 2010 y de 2020 con personas distintas |
| **Panel / longitudinal** | Las **mismas** unidades seguidas en varios períodos | 500 empresas observadas cada año de 2015 a 2022 |

La diferencia entre el acumulado y el panel es clave: en el panel puedes seguir la **trayectoria de cada unidad**, y eso permite controlar características propias de cada una (sección 3.8).

### 3.2 Correlación, causalidad y *ceteris paribus*

* **Correlación**: dos variables se mueven juntas. **No implica causalidad.** El gallo canta antes del amanecer, pero no provoca la salida del sol.
* **Variable de confusión (*confounder*)**: una tercera variable que afecta a las dos y crea una relación aparente. Las ventas de helados y los ahogamientos están correlacionados porque ambos suben con el **calor**, no porque los helados ahoguen gente.
* ***Ceteris paribus*** (latín: "manteniendo todo lo demás constante"): para medir el efecto **causal** de $X$ sobre $Y$ hay que comparar situaciones que **solo** difieren en $X$. Para medir el efecto de la educación sobre el salario, debes comparar personas con la misma experiencia, la misma habilidad, etc.
* **Contrafactual**: lo que le habría pasado a la misma unidad si **no** hubiera recibido el tratamiento. Nunca lo observamos (una persona estudia o no estudia). Casi toda la econometría causal consiste en **aproximar ese contrafactual** de forma creíble.

Un **experimento aleatorio** resuelve el problema porque el azar hace que los grupos sean comparables. Con datos observacionales (sin azar) hay que apoyarse en modelos y supuestos, y por eso importa conocer cuándo fallan.

### 3.3 Regresión lineal simple y mínimos cuadrados ordinarios (OLS)

**Vocabulario:**
* **Variable dependiente** ($y$): la que queremos explicar (salario).
* **Variable independiente / explicativa** ($x$): la que usamos para explicarla (años de estudio).
* **Término de error** ($u$): **todo lo que afecta a $y$ y no está en el modelo** (habilidad, suerte, motivación…). No se observa.

**Modelo:**

$$y = \beta_0 + \beta_1 x + u$$

* $\beta_1$ (pendiente): cuánto cambia $y$, en promedio, por cada unidad adicional de $x$.
* $\beta_0$ (ordenada): valor esperado de $y$ cuando $x=0$.

**Residuos.** Con la recta estimada $\hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1 x_i$, el **residuo** es lo que la recta no explica: $\hat{u}_i = y_i - \hat{y}_i$. No hay que confundir el **error** $u$ (teórico, no observable) con el **residuo** $\hat{u}$ (calculado con los datos).

**Mínimos Cuadrados Ordinarios (OLS).** Se eligen $\hat\beta_0, \hat\beta_1$ de modo que la **suma de los residuos al cuadrado** sea la menor posible (la misma idea del Módulo 0.4, donde el promedio minimizaba esa suma para una constante). La solución es:

$$\hat{\beta}_1 = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}, \qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1 \bar{x}$$

El numerador es la covarianza entre $x$ e $y$ (cuánto se mueven juntas) y el denominador es la variación de $x$.

**Ejemplo con números.** Años de estudio ($x$) y salario mensual en miles ($y$) de 5 personas:

| $x$ | 8 | 10 | 12 | 14 | 16 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $y$ | 22 | 26 | 28 | 36 | 38 |

1. $\bar{x} = 12$, $\bar{y} = 30$.
2. Desviaciones de $x$: $-4,-2,0,2,4$; de $y$: $-8,-4,-2,6,8$.
3. Numerador: $32 + 8 + 0 + 12 + 32 = 84$. Denominador: $16+4+0+4+16 = 40$.
4. $\hat\beta_1 = 84/40 = 2.1$ y $\hat\beta_0 = 30 - 2.1\times12 = 4.8$.

**Recta estimada:** $\hat{y} = 4.8 + 2.1x$. Cada año adicional de estudio se asocia con **2.1 mil más** de salario. Predicción para 15 años: $4.8 + 31.5 = 36.3$.

Valores ajustados: $21.6,\ 25.8,\ 30.0,\ 34.2,\ 38.4$. Residuos: $0.4,\ 0.2,\ -2.0,\ 1.8,\ -0.4$ (suman 0, como siempre en OLS con constante).

**Bondad de ajuste: $R^2$.**

$$R^2 = 1 - \frac{\text{SSR}}{\text{SST}}$$

* SSR: suma de residuos al cuadrado (variación **no explicada**). Aquí $0.16+0.04+4+3.24+0.16 = 7.6$.
* SST: variación total de $y$ respecto a su media. Aquí $64+16+4+36+64 = 184$.
* $R^2 = 1 - 7.6/184 \approx 0.96$: el modelo explica el 96 % de la variación del salario **en esta muestra**.

> **Cuidado:** un $R^2$ alto **no** prueba causalidad ni que el modelo esté bien especificado. Y agregar variables nunca baja el $R^2$, aunque sean irrelevantes; para comparar modelos con distinto número de variables se usa el **$R^2$ ajustado**, que penaliza ese efecto.

**Inferencia sobre $\beta_1$** (aplicando el Módulo 2):
* Varianza estimada del error: $\hat\sigma^2 = \text{SSR}/(n-2) = 7.6/3 \approx 2.53$ (se divide por $n-2$ porque se estimaron 2 parámetros).
* Error estándar: $\text{ee}(\hat\beta_1) = \hat\sigma/\sqrt{\sum(x_i-\bar{x})^2} = 1.59/\sqrt{40} \approx 0.25$.
* Estadístico $t = 2.1/0.25 \approx 8.3$ con $gl = 3$. El valor crítico al 5 % es $3.18$, así que se rechaza $H_0: \beta_1 = 0$ (no hay relación).
* Intervalo de confianza al 95 %: $2.1 \pm 3.18\times0.25 \approx [1.30;\ 2.90]$.

(Una muestra de 5 es solo didáctica: en la práctica se necesitan muchos más datos.)

### 3.4 Regresión lineal múltiple

Se agregan **más variables explicativas**:

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_k x_k + u$$

En forma matricial (Módulo 0.3): $y = X\beta + u$. OLS sigue minimizando la suma de los residuos al cuadrado.

**Interpretación clave.** $\beta_1$ es el efecto de $x_1$ sobre $y$ **manteniendo constantes las demás variables** del modelo, es decir, la versión *ceteris paribus*. *Ejemplo:* si $\widehat{\text{salario}} = 3 + 1.8\,\text{estudio} + 0.5\,\text{experiencia}$, entonces un año más de estudio se asocia con $1.8$ más de salario **entre personas con la misma experiencia**.

**Por qué incluir más variables:** para controlar factores que confunden y para explicar mejor $y$.

#### Sesgo por variable omitida
Si omites una variable que (a) afecta a $y$ y (b) está correlacionada con $x_1$, el coeficiente de $x_1$ **absorbe** parte de su efecto y queda sesgado.

*Ejemplo:* en una regresión de salario sobre educación **sin** la habilidad. Las personas más hábiles ganan más y además estudian más, así que parte de lo que le atribuyes a la educación es en realidad habilidad: **sobreestimas** el retorno de la educación.

Regla del signo del sesgo: (efecto de la omitida sobre $y$) × (correlación entre la omitida y $x_1$). Positivo × positivo = sesgo positivo.

### 3.5 Variables ficticias y logaritmos

* **Variable ficticia (*dummy*)**: toma valor 1 si se cumple una condición y 0 si no (1 = mujer, 0 = varón). Su coeficiente es la **diferencia promedio** de $y$ entre los dos grupos, manteniendo lo demás constante.
* **Logaritmos** (Módulo 0.5). Si la variable dependiente es $\ln(y)$, un coeficiente $\beta_1$ pequeño se interpreta como **cambio porcentual**: un aumento de una unidad en $x$ cambia $y$ en aproximadamente $100\cdot\beta_1\ \%$. *Ejemplo:* en $\ln(\text{salario}) = 0.9 + 0.08\,\text{estudio}$, cada año de estudio se asocia con un salario **aprox. 8 % mayor**. Se usa mucho porque salarios y precios tienen efectos más naturales en porcentaje que en valores absolutos.

### 3.6 Supuestos de Gauss-Markov y propiedad BLUE

Primero, dos conceptos:
* Un estimador es **insesgado** si, en promedio sobre muchas muestras, da el valor verdadero: $E(\hat\beta_j) = \beta_j$.
* Entre los insesgados, el más **eficiente** es el de **menor varianza** (el más preciso).

Los cinco supuestos (condicionales a los valores de $X$; la sigla MLR viene de *Multiple Linear Regression* y la numeración es la del libro de Wooldridge):

1. **MLR.1: Linealidad en los parámetros.** El modelo es lineal en los $\beta$. Admite términos como $x^2$ o $\ln x$, porque lo que debe ser lineal son los **coeficientes**, no las variables.
2. **MLR.2: Muestreo aleatorio.** La muestra es representativa de la población.
3. **MLR.3: Sin colinealidad perfecta.** Ninguna variable explicativa es combinación lineal exacta de otras (Módulo 0.3), y hay suficientes observaciones.
4. **MLR.4: Media condicional cero (exogeneidad).** $E(u \mid x_1,\dots,x_k) = 0$. Todo lo que está en el error (habilidad, suerte…) **no está sistemáticamente relacionado** con las variables explicativas. **Es el supuesto crucial**, el que se rompe en los problemas de causalidad.
5. **MLR.5: Homocedasticidad.** $\text{Var}(u \mid x_1,\dots,x_k) = \sigma^2$. La dispersión del error es **la misma** para cualquier valor de $x$.

* Con **MLR.1 a MLR.4**, OLS es **insesgado**.
* Con **MLR.1 a MLR.5**, el **Teorema de Gauss-Markov** dice que OLS es **BLUE** (*Best Linear Unbiased Estimator*): entre todos los estimadores **lineales e insesgados**, es el de **menor varianza**.
* Para que los contrastes $t$ y $F$ sean exactos con muestras pequeñas se agrega un sexto supuesto: errores Normales. Con muestras grandes el TLC lo vuelve innecesario.

### 3.7 Cuando fallan los supuestos

#### Heterocedasticidad (falla MLR.5)
La dispersión del error **cambia** con $x$. *Ejemplo:* el gasto en entretenimiento varía muchísimo más entre hogares ricos que entre pobres. Al graficar los residuos contra $x$ se ve un **megáfono** (abanico que se abre).
* **Consecuencias:** OLS **sigue siendo insesgado** (si MLR.4 se cumple), pero **deja de ser el más eficiente** y los **errores estándar usuales son incorrectos**, así que los contrastes $t$ y $F$ y los intervalos **no son confiables**.
* **Solución habitual:** usar **errores estándar robustos** (de White), o mínimos cuadrados ponderados.

#### Correlación serial (típica en series de tiempo)
El error de un período se **relaciona con el de períodos anteriores** (una crisis que se arrastra). Consecuencia parecida: los errores estándar usuales dejan de ser válidos. Solución habitual: errores estándar robustos a autocorrelación (Newey-West).

#### Endogeneidad (falla MLR.4)
Una variable explicativa **está correlacionada con el error $u$**. Consecuencia grave: OLS es **sesgado e inconsistente**. *Inconsistente* significa que **aunque tengas infinitos datos, no converge al valor verdadero**: más datos no lo arreglan. Tres causas típicas:

1. **Variable omitida** (la habilidad del ejemplo anterior).
2. **Error de medición** en $x$: cuando la variable explicativa se mide con ruido, el coeficiente tiende a quedar **más cerca de cero** de lo real (sesgo de atenuación).
3. **Simultaneidad**: $x$ e $y$ se determinan **mutuamente** (precio y cantidad en un mercado: cada uno afecta al otro).

#### Variables instrumentales (IV) y mínimos cuadrados en dos etapas (2SLS)
Idea: encontrar una variable $z$, el **instrumento**, que mueva a $x$ **sin tener relación con el error**. Para ser válido debe cumplir:

* **Relevancia:** $z$ está correlacionada con $x$.
* **Exogeneidad (exclusión):** $z$ **no** está correlacionada con $u$, y afecta a $y$ **solo a través de** $x$.

**2SLS en dos pasos:**
1. **Primera etapa:** regresar $x$ sobre $z$ (y los controles) para obtener $\hat{x}$, la parte de $x$ "limpia", explicada solo por el instrumento.
2. **Segunda etapa:** regresar $y$ sobre $\hat{x}$.

*Ejemplo:* educación → salario, con la habilidad omitida. Instrumento posible: la **distancia a la universidad más cercana** durante la adolescencia. Mueve cuánto estudia la persona (relevancia) y, se argumenta, no afecta directamente al salario (exclusión). *Advertencia:* la exclusión **no se puede probar con los datos**: se defiende con argumentos, y un instrumento débil (poco correlacionado con $x$) da resultados poco confiables.

### 3.8 Datos de panel y diferencias en diferencias

#### Datos de panel
Con las mismas unidades $i$ observadas en varios períodos $t$:

$$y_{it} = \beta_1 x_{it} + a_i + u_{it}$$

* $a_i$ = **efecto no observado de la unidad $i$ que no cambia en el tiempo** (habilidad innata de una persona, cultura de una empresa).
* $u_{it}$ = error que varía en el tiempo.

Si $a_i$ está correlacionado con $x_{it}$ y lo ignoras, tienes variable omitida (endogeneidad). El panel permite sortearlo:

* **Efectos fijos (FE).** Se resta a cada variable **el promedio de su propia unidad** (transformación *within*). Como $a_i$ es constante en el tiempo, **desaparece**:

$$(y_{it} - \bar{y}_i) = \beta_1 (x_{it} - \bar{x}_i) + (u_{it} - \bar{u}_i)$$

  *Ejemplo:* si una empresa tiene $x = 1, 3, 5$, su promedio es 3 y los valores transformados son $-2, 0, 2$. Se usa solo la **variación dentro de cada unidad**. Permite que $a_i$ esté correlacionado con $x$. **Costo:** no se puede estimar el efecto de variables que **no cambian** en el tiempo (el género, el sector fijo de una empresa).
* **Efectos aleatorios (RE).** Supone que $a_i$ **no** está correlacionado con las explicativas. Si es cierto, es **más eficiente** (usa mínimos cuadrados generalizados y aprovecha también la variación entre unidades). Si es falso, es sesgado.
* **¿Cuál elegir?** Si hay dudas sobre la correlación entre $a_i$ y $x$, FE es la opción más segura. Se suele apoyar la decisión en el **test de Hausman**.

#### Diferencias en diferencias (DID)
Sirve para evaluar el impacto de una **política o intervención** que afecta a un grupo (tratamiento) y no a otro (control), con datos **antes y después**. Se calcula:

$$\hat\delta_{\text{DID}} = (\bar{y}_{\text{Trat,Post}} - \bar{y}_{\text{Trat,Pre}}) - (\bar{y}_{\text{Ctrl,Post}} - \bar{y}_{\text{Ctrl,Pre}})$$

*Por qué restar dos veces:* comparar solo "antes y después" del grupo tratado mezcla el efecto de la política con otras tendencias del tiempo. El grupo de control **captura esas tendencias comunes**, y se restan.

*Ejemplo (cifras inventadas).* Una provincia sube el salario mínimo; otra no. Empleo promedio por comercio:

| | Antes | Después | Cambio |
| :--- | :--- | :--- | :--- |
| Tratamiento | 20 | 21 | $+1$ |
| Control | 25 | 23 | $-2$ |

$\hat\delta_{\text{DID}} = (+1) - (-2) = +3$. Sin la política, el grupo tratado habría bajado como el control; por eso el efecto estimado es $+3$.

**Supuesto central: tendencias paralelas.** Sin la política, ambos grupos habrían evolucionado **igual**. No se puede verificar del todo, pero se evalúa mirando si sus tendencias eran paralelas **antes** de la intervención.

### Autoevaluación del Módulo 3

1. Clasifica la estructura de datos: (a) encuesta a 2000 hogares en 2023; (b) inflación mensual 2000-2024; (c) las mismas 500 empresas entre 2015 y 2022; (d) encuestas de empleo independientes de 2010 y 2020.
2. Las ventas de paraguas y los accidentes de tránsito están correlacionados. ¿Hay causalidad? Explica con el concepto de variable de confusión.
3. Con $\hat{y} = 4.8 + 2.1x$ (ejemplo de 3.3), ¿qué salario predice para $x=15$? ¿Cómo interpretas $\hat\beta_1$?
4. Estimas el efecto del tamaño de una clase sobre las notas, pero omites el nivel socioeconómico (que mejora las notas y está asociado a clases más chicas). ¿Hacia qué lado se sesga el coeficiente?
5. ¿Qué supuestos hacen falta para que OLS sea insesgado y cuáles para que sea BLUE?
6. Hay heterocedasticidad. ¿Qué sigue funcionando en OLS, qué deja de funcionar y qué se hace?
7. Un colega dice "mi modelo tiene $R^2 = 0.95$, así que el efecto es causal". ¿Qué le respondes?
8. ¿Cuáles son las dos condiciones de un instrumento válido? Verifícalas para "distancia a la universidad" como instrumento de la educación.
9. En $\ln(\text{salario}) = 1.2 + 0.07\,\text{estudio}$, ¿cómo se interpreta $0.07$?
10. Tratamiento: antes 50, después 58. Control: antes 48, después 52. Calcula DID.
11. ¿Cuándo preferirías efectos fijos sobre efectos aleatorios y qué no puedes estimar con efectos fijos?

### Respuestas del Módulo 3

1. (a) Corte transversal; (b) serie de tiempo; (c) panel; (d) corte transversal acumulado.
2. No necesariamente. Variable de confusión: **la lluvia** aumenta tanto las ventas de paraguas como los accidentes.
3. $4.8 + 2.1\times15 = 36.3$. Cada año adicional de estudio se asocia con **2.1 mil más** de salario (promedio, en esa muestra; no necesariamente causal).
4. Efecto de la omitida sobre las notas: positivo. Correlación con "clase chica": positiva (los más ricos tienen clases más chicas). Sesgo **positivo**: se **sobreestima** el beneficio de las clases chicas.
5. **Insesgado:** MLR.1 a MLR.4. **BLUE:** MLR.1 a MLR.5 (se agrega homocedasticidad).
6. Sigue funcionando: OLS es **insesgado**. Deja de funcionar: la **eficiencia** y los **errores estándar** usuales, por lo que $t$, $F$ e intervalos no son confiables. Se usan **errores estándar robustos** (White).
7. Un $R^2$ alto mide **ajuste**, no causalidad. Puede haber variables omitidas, simultaneidad, etc. La causalidad depende del supuesto de exogeneidad (MLR.4) y del diseño, no del $R^2$.
8. **Relevancia:** debe correlacionarse con la educación (vivir lejos desalienta ir a la universidad: plausible). **Exogeneidad/exclusión:** no debe afectar al salario por otra vía (discutible: las zonas cercanas a universidades pueden tener más empleos bien pagos). La exclusión no se puede probar solo con los datos.
9. Cada año adicional de estudio se asocia con un salario aprox. **7 % mayor**.
10. Tratamiento: $58-50 = +8$. Control: $52-48 = +4$. DID $= 8 - 4 = +4$.
11. FE cuando sospechas que el efecto no observado $a_i$ está correlacionado con las explicativas (lo más común). Con FE **no se pueden estimar efectos de variables que no cambian en el tiempo** (género, país de nacimiento…), porque se eliminan junto con $a_i$.

---

## Módulo 4: Minería de Datos, Preprocesamiento y Descubrimiento de Patrones

La **minería de datos** combina informática y estadística para **extraer patrones útiles de grandes volúmenes de datos**. A diferencia de la econometría (Módulo 3), que busca sobre todo **explicar y estimar efectos causales**, aquí el foco suele estar en **predecir y descubrir estructura**, aunque no siempre sepamos "por qué".

**Vocabulario base:**
* **Registro** (o instancia, observación): una fila de datos (un cliente, una transacción).
* **Atributo** (o variable, característica): una columna (edad, monto de compra).
* **Clase** (o etiqueta): el atributo que queremos predecir (¿pagó el crédito? sí/no).

**Dos familias de tareas:**
* **Predictivas** (hay una variable objetivo): clasificación (predecir una categoría) y regresión (predecir un número).
* **Descriptivas** (no hay objetivo; se busca estructura): asociación (qué cosas ocurren juntas), agrupamiento o *clustering* (qué registros se parecen) y detección de anomalías.

### 4.1 El proceso KDD (*Knowledge Discovery in Databases*)

Extraer conocimiento no es "correr un algoritmo": es un ciclo completo.

1. **Preprocesamiento**: limpiar, integrar y transformar los datos brutos. Suele ser la etapa que **más tiempo consume**.
2. **Minería de datos**: aplicar los algoritmos que extraen patrones.
3. **Postprocesamiento**: interpretar, evaluar, visualizar y decidir si los patrones son útiles, nuevos y válidos.

*Ejemplo:* un banco quiere detectar fraudes. (1) Une las tablas de transacciones y clientes, corrige errores y rellena faltantes. (2) Entrena un clasificador. (3) Revisa cuántos fraudes detecta y cuántas falsas alarmas genera, y lo presenta al equipo de riesgo.

### 4.2 Preprocesamiento

* **Limpieza**: tratar duplicados, errores, valores atípicos y faltantes (Módulo 2.3).
* **Agregación**: combinar registros en uno solo (ventas por día en lugar de por ticket); reduce volumen y suaviza el ruido.
* **Muestreo**: trabajar con un subconjunto representativo cuando los datos completos son demasiados. Debe ser aleatorio (o estratificado) para que la muestra conserve la composición de la población.
* **Reducción de dimensionalidad**: la **dimensión** es el número de atributos. Con muchos atributos, los datos se vuelven "ralos": hay poquísimos registros por cada región del espacio y las distancias pierden sentido (la llamada **maldición de la dimensionalidad**). Se reduce eliminando atributos redundantes o irrelevantes, o transformándolos (técnicas como PCA, en el Módulo 6).
* **Discretización**: convertir un atributo continuo en categorías. *Ejemplo:* edad → Joven (< 30), Adulto (30-59), Mayor (≥ 60).
* **Binarización y codificación *one-hot***: convertir una categoría en columnas 0/1. *Ejemplo:* el atributo "color" con valores {rojo, azul, verde} pasa a tres columnas "es_rojo", "es_azul", "es_verde", donde solo una vale 1. Muchos algoritmos exigen números, y asignar 1, 2, 3 a categorías sugeriría un orden que no existe.
* **Escalado de atributos**: poner variables en escalas comparables, importante en métodos basados en distancias.
  * **Min-max**: $x' = \dfrac{x - x_{\min}}{x_{\max} - x_{\min}}$ lleva los valores a $[0,1]$. *Ejemplo:* ingresos entre 10 000 y 50 000: el valor 20 000 pasa a $(20-10)/(50-10) = 0.25$.
  * **Estandarización** (puntaje $z$, Módulo 2.4): $z = (x-\bar{x})/s$ deja media 0 y desviación 1.

### 4.3 Clasificación predictiva

**Clasificar** es asignar cada registro a una **clase predefinida**. Se aprende de ejemplos con la clase conocida y se aplica a registros nuevos.

**Entrenamiento y prueba.** Un modelo no debe evaluarse con los mismos datos con que se construyó, porque un modelo puede **memorizar** esos datos y fallar con datos nuevos. Por eso se separan:
* **Conjunto de entrenamiento**: se usa para construir el modelo.
* **Conjunto de prueba**: datos que el modelo **nunca vio**, usados solo para medir su rendimiento real.

Cuando un modelo rinde muy bien en entrenamiento y mal en prueba, hay **sobreajuste** (*overfitting*): aprendió el ruido en lugar del patrón. Este tema se formaliza en el Módulo 6.

**Partición estratificada.** Al separar entrenamiento y prueba conviene **estratificar** por la variable objetivo: las dos partes conservan la misma proporción de cada clase. *Ejemplo de clase (Titanic, Kaggle: 891 pasajeros, de los que sobrevivió el 38.4 %):* se usó el 70 % para entrenar (623 pasajeros) y el 30 % para probar (268). Toda transformación que se aprende de los datos (por ejemplo, imputar la edad faltante con la **mediana**) se calcula **solo con el entrenamiento** y después se aplica a la prueba; si no, información de la prueba se "filtra" al modelo y la evaluación queda optimista.

#### Árboles de decisión
Un **árbol de decisión** clasifica mediante una secuencia de preguntas sobre los atributos:
* **Nodo interno**: una pregunta ("¿ingreso > 3000?").
* **Rama**: cada respuesta posible.
* **Hoja**: la clase asignada.

Ventaja principal: son **interpretables** (se leen como reglas "si... entonces...").

**¿Cómo elige el árbol qué pregunta hacer?** Busca la división que deja **grupos lo más "puros" posible** (donde casi todos los registros son de la misma clase).

> **Analogía de las 20 preguntas:** para adivinar un animal, la primera pregunta eficiente no es "¿es un caniche?", sino "¿es un vertebrado?", porque divide el conjunto en grupos muy distintos. Las mejores preguntas son las que más reducen la incertidumbre.

La **impureza** de un nodo se mide con dos criterios habituales. Si $p_c$ es la proporción de la clase $c$ en el nodo:

* **Entropía**: $H = -\sum_c p_c \log_2 p_c$ (en bits). Vale $0$ en un nodo puro y es máxima cuando las clases están parejas.
* **Índice Gini**: $G = 1 - \sum_c p_c^2$. También vale $0$ en un nodo puro.

La **ganancia de información** de una división es la entropía del nodo padre **menos** la entropía promedio de los hijos, ponderada por su tamaño. Se elige la división con mayor ganancia.

**Ejemplo con números.** Un nodo con 10 clientes: 6 pagan y 4 no ($p = 0.6$ y $0.4$).
* Entropía: $-(0.6\log_2 0.6 + 0.4\log_2 0.4) \approx 0.971$. Gini: $1 - (0.36+0.16) = 0.48$.

Una pregunta lo divide así:
* Hijo izquierdo: 5 clientes (4 pagan, 1 no): entropía $\approx 0.722$; Gini $= 0.32$.
* Hijo derecho: 5 clientes (2 pagan, 3 no): entropía $\approx 0.971$; Gini $= 0.48$.

Entropía ponderada de los hijos: $0.5\times0.722 + 0.5\times0.971 \approx 0.847$. **Ganancia de información** $= 0.971 - 0.847 \approx 0.12$. (En Gini, la reducción es $0.48 - 0.40 = 0.08$.) El árbol probaría todas las preguntas candidatas y se quedaría con la de mayor ganancia, y repetiría el proceso en cada hijo.

**Comparar dos preguntas con el Gini ponderado.** Para elegir la pregunta, se calcula el Gini de cada hijo y se promedian ponderando por su tamaño. *Ejemplo de clase (Titanic, entrenamiento: 623 pasajeros, 239 sobrevivieron):*
* Opción A, "¿es mujer?": 217 mujeres (163 sobrevivieron, 54 no), Gini $\approx 0.374$; 406 hombres (76 sobrevivieron, 330 no), Gini $\approx 0.304$. Gini ponderado $= \tfrac{217}{623}\cdot 0.374 + \tfrac{406}{623}\cdot 0.304 \approx 0.329$.
* Opción B, "¿viaja en 3.ª clase?": 346 pasajeros (86 sobrevivieron, 260 no), Gini $\approx 0.374$; 277 pasajeros (153 sobrevivieron, 124 no), Gini $\approx 0.495$. Gini ponderado $\approx 0.427$.

Como $0.329 < 0.427$, el árbol abre con "¿es mujer?": la división que deja los hijos más puros.

**Variables categóricas y continuas.** El árbol también decide *cómo* cortar cada tipo de variable. Con una variable **categórica** de varias categorías (clase 1, 2 o 3), prueba separaciones binarias de las categorías: por ejemplo, {1.ª y 2.ª} contra {3.ª}, o {1.ª} contra {2.ª y 3.ª}. Con una variable **continua** (edad), ordena los valores y prueba los **puntos de corte** posibles (por ejemplo, 10, 24.5 o 38.5 años); se queda con el umbral que deja los grupos más puros.

**El árbol del Titanic (ejemplo de clase, profundidad 3).** La raíz contiene los 623 pasajeros de entrenamiento (239 sobrevivieron, $38.4\,\%$) y pregunta "¿es mujer?". Para clasificar a un pasajero se sigue **un único camino** desde la raíz hasta una hoja: por ejemplo, un hombre de 3.ª clase responde "¿es mujer?" $\to$ no, "¿clase = 3?" $\to$ sí, y llega a una hoja con **baja** probabilidad de sobrevivir; una mujer de 1.ª clase llega a una hoja con probabilidad alta. Los componentes son el **nodo raíz** (primera pregunta), los **nodos internos**, las **ramas** (respuestas) y las **hojas** (predicción: la proporción de sobrevivientes del entrenamiento que cayó en ellas). Un árbol no usa una fórmula única: toma decisiones a partir de preguntas sucesivas.

**Sobreajuste y poda.** Si el árbol sigue dividiendo hasta que cada hoja tenga un solo registro, memoriza el entrenamiento. Se controla **limitando la profundidad**, exigiendo un mínimo de registros por hoja, o **podando** ramas que no mejoran el rendimiento en datos de validación.

**¿Un árbol más grande es siempre mejor? (ejemplo de clase).** No. Al crecer, el AUC en entrenamiento sube casi siempre, pero el AUC en prueba mejora solo hasta cierto punto. En el Titanic de la clase (variables sexo, edad y clase), con `max_depth` de 1 a 5 el AUC de entrenamiento fue $0.771$, $0.821$, $0.863$, $0.884$ y $0.900$, y el árbol sin límite (107 hojas) llegó a $0.958$. En prueba, el mejor valor apareció con `max_depth = 3` ($0.833$); con más profundidad no se recuperó ($0.793$ y $0.804$) y el árbol completo cayó a $0.768$: **más complejidad puede mejorar el entrenamiento y empeorar la prueba**. Los hiperparámetros que se suelen ajustar son `max_depth` (profundidad máxima), `min_samples_split` (mínimo de observaciones para dividir un nodo), `min_samples_leaf` (mínimo permitido en una hoja), `max_leaf_nodes` (límite de hojas) y `ccp_alpha` (poda). La proporción de sobrevivientes de entrenamiento que cayó en una hoja es la **probabilidad estimada** para los pasajeros nuevos que lleguen a ella.

#### Evaluación: la matriz de confusión
Para una clasificación de dos clases (positivo/negativo), cada predicción cae en una de cuatro celdas:

| | Predicho **positivo** | Predicho **negativo** |
| :--- | :--- | :--- |
| **Real positivo** | **VP** (verdadero positivo) | **FN** (falso negativo) |
| **Real negativo** | **FP** (falso positivo) | **VN** (verdadero negativo) |

Métricas derivadas:

* **Exactitud** (*accuracy*) $= \dfrac{VP+VN}{\text{total}}$: proporción de aciertos.
* **Precisión** (*precision*) $= \dfrac{VP}{VP+FP}$: de todo lo que **predije** como positivo, ¿cuánto lo era realmente?
* **Exhaustividad / Sensibilidad** (*recall*) $= \dfrac{VP}{VP+FN}$: de todos los positivos **reales**, ¿cuántos detecté?
* **Especificidad** (*specificity*) $= \dfrac{VN}{VN+FP}$: de todos los negativos **reales**, ¿cuántos identifiqué correctamente como negativos?
* **$F_1$** $= \dfrac{2\cdot\text{precisión}\cdot\text{recall}}{\text{precisión}+\text{recall}}$: un solo número que equilibra las dos.

**Ejemplo.** De 100 pacientes, 10 están enfermos. El modelo da: $VP=8$, $FN=2$, $FP=18$, $VN=72$.
* Exactitud: $(8+72)/100 = 0.80$.
* Precisión: $8/(8+18) \approx 0.31$. Recall: $8/(8+2) = 0.80$. Especificidad: $72/(72+18) = 0.80$. $F_1 \approx 0.44$.

**¿Por qué la exactitud puede engañar?** Un modelo que dice "nadie está enfermo" acierta en 90 de los 100: **exactitud del 90 %**, pero **recall $=0$**: no detecta a ningún enfermo. Cuando una clase es rara (fraude, enfermedades), la exactitud es una mala métrica. Además, la **precisión baja** del ejemplo es la misma intuición del test médico del Módulo 0.2 (Bayes): cuando los positivos son pocos, aun un buen test genera muchos falsos positivos en términos relativos.

**Qué priorizar:** si un falso negativo es muy costoso (no detectar un cáncer), importa el **recall**; si lo costoso es un falso positivo (bloquear a un cliente legítimo), importa la **precisión**.

**El umbral cambia las métricas, no el modelo.** Un modelo que entrega probabilidades se convierte en clasificador al fijar un **umbral** $t$: se predice positivo si $\hat{p} \ge t$. Con el mismo modelo, subir $t$ lo vuelve más exigente (sube la precisión y la especificidad, pero puede bajar el recall) y bajarlo hace lo contrario. *Ejemplo ilustrativo (cifras inventadas):* 8 pasajeros con probabilidades estimadas $0.95, 0.85, 0.60, 0.55, 0.45, 0.35, 0.20, 0.10$; sobrevivieron 5 de ellos (los de probabilidad $0.95$, $0.85$, $0.55$, $0.45$ y $0.20$).

| Umbral | VP | FP | FN | VN | Recall | Precisión | Especificidad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $0.30$ | 4 | 2 | 1 | 1 | $0.80$ | $0.67$ | $0.33$ |
| $0.50$ | 3 | 1 | 2 | 2 | $0.60$ | $0.75$ | $0.67$ |
| $0.70$ | 2 | 0 | 3 | 3 | $0.40$ | $1.00$ | $1.00$ |

**No existe un umbral universalmente óptimo:** la elección es una decisión posterior al modelo y depende del **costo de cada error**. Si un falso negativo es muy caro (medicina: dejar pasar a un paciente enfermo), conviene un umbral más bajo para ganar recall. Si lo caro es el falso positivo (fraude: bloquear clientes legítimos), conviene uno más alto para ganar precisión y especificidad; en riesgo crediticio el corte equilibra la mora esperada con el negocio aprobado. El mejor punto de corte no es el que maximiza una métrica por definición, sino el que mejor representa el objetivo y el costo de los errores. **Buena práctica:** elegirlo con entrenamiento y validación (o validación cruzada) y reservar la **prueba** para la evaluación final.

### 4.4 Análisis de asociación y algoritmo Apriori

Busca **qué elementos suelen aparecer juntos** (análisis de la cesta de la compra). Vocabulario:
* **Transacción**: un conjunto de ítems comprados juntos.
* **Conjunto de ítems** (*itemset*): un grupo de ítems, por ejemplo $\{\text{pan, leche}\}$.
* **Regla de asociación** $A \rightarrow B$: "quien compra $A$ suele comprar $B$".

**Tres medidas:**
* **Soporte** de un conjunto: fracción de transacciones que lo contienen. Mide **qué tan frecuente** es.
* **Confianza** de $A \rightarrow B$: $\dfrac{\text{soporte}(A\cup B)}{\text{soporte}(A)}$ $= P(B \mid A)$. De los que compran $A$, ¿qué fracción compra también $B$?
* **Lift** de $A \rightarrow B$: $\dfrac{\text{confianza}(A\rightarrow B)}{\text{soporte}(B)}$. Compara con lo que se esperaría **si $A$ y $B$ fueran independientes**: $>1$ asociación positiva; $=1$ independientes; $<1$ asociación negativa. La confianza sola engaña: si casi todos compran $B$, cualquier regla hacia $B$ tendrá confianza alta sin ser informativa.

**Ejemplo con 5 transacciones:**

| N.º | Ítems |
| :--- | :--- |
| 1 | pan, leche |
| 2 | pan, pañales, cerveza, huevos |
| 3 | leche, pañales, cerveza, cola |
| 4 | pan, leche, pañales, cerveza |
| 5 | pan, leche, pañales, cola |

* Soporte$\{\text{pañales, cerveza}\} = 3/5 = 0.6$; soporte$\{\text{pañales}\} = 4/5$; soporte$\{\text{cerveza}\} = 3/5$.
* Regla pañales $\rightarrow$ cerveza: confianza $= 3/4 = 0.75$; lift $= 0.75/0.6 = 1.25$ (asociación positiva moderada).
* Regla pan $\rightarrow$ leche: soporte$\{\text{pan, leche}\} = 3/5$; confianza $= 3/4 = 0.75$; lift $= 0.75/0.8 = 0.94$ (ligeramente por debajo de 1: **no** hay asociación real, aunque la confianza sea alta).

**El problema computacional.** Con 1000 ítems existen más de $2^{1000}$ combinaciones posibles: es imposible evaluarlas todas.

**Algoritmo Apriori.** Se apoya en la propiedad: **si un conjunto de ítems es infrecuente, todos los conjuntos que lo contienen (sus superconjuntos) también lo son**. (Si pocos compran pan y cerveza juntos, menos aún comprarán pan, cerveza *y* pañales.) Así, se avanza **por niveles** y se **descarta sin contar**.

*Con soporte mínimo $= 3$ transacciones (0.6):*
1. **Ítems individuales.** Conteos: pan 4, leche 4, pañales 4, cerveza 3, huevos 1, cola 2. Quedan los frecuentes: pan, leche, pañales, cerveza. **Huevos y cola se descartan** y con ellos todos los conjuntos que los contengan, sin evaluarlos.
2. **Pares** (solo con ítems frecuentes): $\{\text{pan, leche}\}$ 3 ✓; $\{\text{pan, pañales}\}$ 3 ✓; $\{\text{pan, cerveza}\}$ 2 ✗; $\{\text{leche, pañales}\}$ 3 ✓; $\{\text{leche, cerveza}\}$ 2 ✗; $\{\text{pañales, cerveza}\}$ 3 ✓.
3. **Tríos:** el único candidato cuyos subconjuntos son todos frecuentes es $\{\text{pan, leche, pañales}\}$, y tiene conteo 2 ✗. Todos los demás tríos contienen un par infrecuente y se descartan sin contarlos.

Con los conjuntos frecuentes se generan reglas y se filtran por confianza y lift. *Advertencia:* una regla describe **co-ocurrencia**, no causalidad: no implica que comprar pañales cause comprar cerveza.

### 4.5 Agrupamiento (*clustering*) y DBSCAN

El **agrupamiento** es una tarea **no supervisada** (no hay clase conocida): se busca organizar los registros en **grupos** de modo que los de un mismo grupo se parezcan entre sí y se diferencien de los otros. Para decir "se parecen" se necesita una **medida de distancia**; la más común es la **distancia euclídea** (la recta entre dos puntos): en 2D, entre $(1,2)$ y $(4,6)$ es $\sqrt{3^2+4^2} = 5$.

Hay dos enfoques típicos:
* **Basados en prototipos** (como **K-Means**, Módulo 6.7): cada grupo se representa por un "centro", y cada punto va al centro más cercano. Funcionan bien con grupos compactos y redondeados, y exigen decidir de antemano **cuántos** grupos hay.
* **Basados en densidad** (**DBSCAN**): un grupo es una **región continua de alta densidad** rodeada de regiones de baja densidad.

#### DBSCAN
Usa dos parámetros:
* **Eps**: radio de "vecindad".
* **MinPts**: número mínimo de puntos (contando el propio) que debe haber dentro de ese radio.

Y clasifica cada punto en tres tipos:
* **Punto núcleo** (*core*): tiene al menos `MinPts` puntos dentro de su radio `Eps`. Está en el "interior" de una zona densa.
* **Punto borde** (*border*): **no** es núcleo, pero cae dentro del radio de **algún** punto núcleo. Está en la frontera del grupo.
* **Punto ruido** (*noise*): ni núcleo ni borde. Es un punto aislado.

Un grupo se forma conectando puntos núcleo cercanos entre sí, más sus puntos borde.

**Ejemplo en una dimensión.** Puntos: $1,\ 1.5,\ 2,\ 2.5,\ 3.4,\ 8,\ 8.4,\ 9,\ 20$ con $\text{Eps}=1$ y $\text{MinPts}=3$.
* $1, 1.5, 2, 2.5$ tienen al menos 3 puntos en su vecindad: son **núcleo** y forman el **Grupo A**.
* $3.4$ solo tiene 2 puntos a menos de 1 (él mismo y $2.5$): no es núcleo, pero está dentro del radio de $2.5$, que sí lo es: **borde** del Grupo A.
* $8, 8.4, 9$ son núcleo: **Grupo B**.
* $20$ no tiene vecinos: **ruido**.

**Ventajas:** encuentra grupos de **formas arbitrarias** (anillos, espirales), **no necesita fijar** el número de grupos y **separa el ruido** en lugar de forzarlo a pertenecer a un grupo. **Limitaciones:** es sensible a la elección de `Eps` y `MinPts`; tiene dificultades cuando los grupos tienen **densidades muy distintas**; y en dimensiones altas las distancias pierden significado.

### Autoevaluación del Módulo 4

1. Nombra las tres etapas de KDD y da un ejemplo de una tarea de cada una.
2. Normaliza con min-max el ingreso 30 000 si el mínimo es 10 000 y el máximo es 50 000.
3. ¿Cuál es la entropía de un nodo con 50 % de cada clase? ¿Y la de un nodo puro?
4. Dada $VP=30$, $FP=10$, $FN=20$, $VN=40$, calcula exactitud, precisión, recall y $F_1$.
5. Un banco tiene 1 % de transacciones fraudulentas. Un modelo que predice siempre "no fraude", ¿qué exactitud y qué recall tiene? ¿Qué enseñanza deja?
6. Con las 5 transacciones de 4.4, calcula soporte, confianza y lift de leche $\rightarrow$ pañales.
7. ¿Por qué la propiedad de Apriori permite ahorrar tanto cálculo?
8. Un árbol rinde 100 % en entrenamiento y 70 % en prueba. ¿Qué ocurre y qué puedes hacer?
9. ¿Por qué DBSCAN puede encontrar un grupo con forma de anillo y un método basado en centros no?
10. En DBSCAN, ¿cuál es la diferencia entre un punto borde y un punto ruido?

### Respuestas del Módulo 4

1. (1) Preprocesamiento: imputar valores faltantes. (2) Minería: entrenar un árbol o buscar reglas. (3) Postprocesamiento: evaluar con una matriz de confusión y visualizar los resultados.
2. $(30-10)/(50-10) = 0.5$.
3. Entropía $= -(0.5\log_2 0.5 + 0.5\log_2 0.5) = 1$ bit (máxima incertidumbre). Nodo puro: $0$.
4. Exactitud $= 70/100 = 0.70$. Precisión $= 30/40 = 0.75$. Recall $= 30/50 = 0.60$. $F_1 = 2\cdot0.75\cdot0.60/1.35 \approx 0.67$.
5. Exactitud $= 99\,\%$, recall $= 0$ (no detecta ningún fraude). Con clases desbalanceadas, la exactitud engaña; hay que mirar precisión, recall y $F_1$.
6. Soporte$\{\text{leche, pañales}\} = 3/5 = 0.6$ (transacciones 3, 4, 5). Soporte(leche) $= 4/5$. Confianza $= 0.6/0.8 = 0.75$. Soporte(pañales) $= 0.8$. Lift $= 0.75/0.8 \approx 0.94$ ($<1$: no hay asociación real).
7. Porque si un conjunto es infrecuente, **todos los que lo contienen** también lo son y se pueden descartar **sin contarlos**; así, se evita evaluar la inmensa mayoría de combinaciones.
8. **Sobreajuste:** el árbol memorizó el entrenamiento. Se corrige limitando la profundidad, exigiendo un mínimo de registros por hoja o podando, y evaluando con datos de validación.
9. DBSCAN une puntos vecinos densos, así que sigue la forma del anillo. Un método de centros asigna cada punto al **centro más cercano**, lo que parte el espacio en regiones compactas y no puede representar un anillo como un único grupo.
10. Un punto **borde** no es núcleo, pero **está dentro del radio de un núcleo** y se incorpora al grupo. Un punto **ruido** no está cerca de ningún núcleo y no pertenece a ningún grupo.

---

## Módulo 5: Elección Binaria, Regresión Logística y Modelos Generativos

Cuando la variable que queremos explicar o predecir es **categórica** (¿se aprueba el crédito?, ¿el cliente compra?, ¿el correo es spam?), la regresión lineal del Módulo 3 deja de ser adecuada. Este módulo presenta los modelos pensados para ese caso. Usa ideas de módulos anteriores: probabilidad condicional y Bayes (0.2), logaritmos y exponenciales (0.5), máxima verosimilitud (2.6) y la matriz de confusión (4.3).

Notación: la variable respuesta es $Y \in \{0, 1\}$ (1 = "éxito": compra, pago, spam) y $X$ representa las variables explicativas. Lo que queremos modelar es la **probabilidad condicional** $p(X) = P(Y=1 \mid X)$.

### 5.1 El modelo lineal de probabilidad (LPM) y sus límites

La idea más simple: aplicar OLS (Módulo 3) directamente a $y$ (que vale 0 o 1):

$$y = \beta_0 + \beta_1 x_1 + \dots + \beta_k x_k + u$$

Como $E(y \mid X) = P(y=1 \mid X)$, el valor predicho $\hat{y}$ se interpreta como una **probabilidad**, y $\beta_j$ como el cambio en esa probabilidad (en puntos de probabilidad) por cada unidad de $x_j$. Es simple y fácil de interpretar, pero tiene **tres problemas**:

1. **Probabilidades imposibles.** Nada impide que $\hat{y} < 0$ o $\hat{y} > 1$. *Ejemplo:* si $\hat{y} = -0.1 + 0.25x$, con $x = 5$ (ingreso en miles) se predice $1.15$ ($115\,\%$), y con $x=0$, $-0.10$ ($-10\,\%$).
2. **Efecto constante.** Un aumento de una unidad en $x_j$ siempre mueve la probabilidad en $\beta_j$, sin importar el nivel de partida. Es poco realista: pasar de 0 a 1 hijo no suele afectar la decisión de trabajar igual que pasar de 4 a 5. Y cerca de 0 % o 100 % es imposible seguir sumando.
3. **Heterocedasticidad inherente.** Como $y$ solo toma 0 o 1, la varianza del error es $\text{Var}(u \mid X) = p(X)\,(1-p(X))$, que **cambia con $X$** (vale $0.25$ si $p=0.5$ y solo $0.09$ si $p=0.9$). Se viola MLR.5 (Módulo 3.6), así que hacen falta errores estándar robustos.

El LPM se usa a veces en econometría por su simplicidad, pero para predecir o para probabilidades extremas se prefieren los modelos siguientes.

*Ejemplo de clase (Titanic):* si se codifica Survived como $0$ (no sobrevivió) y $1$ (sobrevivió) y se ajusta una recta, las predicciones de tres pasajeros pueden ser $-0.20$, $0.67$ y $1.12$: la recta se sale de $[0,1]$ y dos de esos valores no pueden ser probabilidades. Es el problema que resuelve la función logística de 5.2.

### 5.2 Regresión logística

**Idea:** en vez de modelar la probabilidad con una recta, se pasa la combinación lineal $z = \beta_0 + \beta_1 X_1 + \dots + \beta_k X_k$ por una función en forma de "S" que **siempre devuelve valores entre 0 y 1**: la **función logística**.

$$p(X) = \frac{e^{z}}{1+e^{z}} = \frac{1}{1+e^{-z}}$$

| $z$ | $-4$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $4$ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $p$ | 0.018 | 0.119 | 0.269 | 0.500 | 0.731 | 0.881 | 0.982 |

Cuando $z$ es muy negativo, $p$ se acerca a 0 sin llegar; cuando es muy positivo, se acerca a 1 sin pasarse.

#### Probabilidad, *odds*, *log-odds* y *odds ratio*
Para interpretar los coeficientes conviene pasar por tres escalas:

1. **Probabilidad** $p \in [0,1]$.
2. **Odds** (posibilidades): $\text{odds} = \dfrac{p}{1-p}$, cuántas veces es más probable que ocurra a que no ocurra. *Ejemplo:* $p = 0.8 \Rightarrow \text{odds} = 0.8/0.2 = 4$ ("4 a 1"); $p = 0.5 \Rightarrow 1$; $p = 0.2 \Rightarrow 0.25$. Se recupera la probabilidad con $p = \text{odds}/(1+\text{odds})$.
3. **Log-odds (logit)**: el logaritmo natural de los odds. En la regresión logística es **exactamente la combinación lineal**:

$$\ln\!\left(\frac{p(X)}{1-p(X)}\right) = \beta_0 + \beta_1 X_1 + \dots + \beta_k X_k$$

Es decir: **el modelo es lineal en los log-odds**. Por eso $\beta_1$ es el cambio en el log-odds al aumentar $X_1$ una unidad, manteniendo lo demás constante.

4. **Odds ratio (OR)**: como los log-odds suben $\beta_1$, los odds se **multiplican por $e^{\beta_1}$**. Ese factor es el *odds ratio* de $X_1$:
   * $\text{OR} > 1$ ($\beta_1>0$): $X_1$ aumenta los odds.
   * $\text{OR} = 1$ ($\beta_1 = 0$): sin efecto.
   * $\text{OR} < 1$ ($\beta_1<0$): $X_1$ reduce los odds.

**Ejemplo de interpretación.** Si el coeficiente de "fumar" es $\beta_1 = 0.693$, entonces $\text{OR} = e^{0.693} \approx 2$: los fumadores tienen **el doble de odds** de enfermar que los no fumadores (a igualdad de las demás variables). Cuidado: **doble de odds no es doble de probabilidad**; solo son parecidos cuando el evento es raro.

**Ejemplo numérico completo.** Modelo de morosidad: $\ln(\text{odds}) = -2 + 0.7\,x$, donde $x$ = número de atrasos previos.
* $x=0$: $z = -2 \Rightarrow p \approx 0.119$.
* $x=1$: $z = -1.3 \Rightarrow p \approx 0.214$.
* $x=2$: $z = -0.6 \Rightarrow p \approx 0.354$.
* $x=3$: $z = 0.1 \Rightarrow p \approx 0.525$.
* $\text{OR} = e^{0.7} \approx 2.01$: cada atraso adicional **duplica los odds** de mora.

**El efecto sobre la probabilidad no es constante.** Los odds se duplican siempre, pero la probabilidad sube $0.095$ al pasar de 0 a 1 atraso y $0.171$ al pasar de 2 a 3. El efecto de $x_j$ sobre $p$ es aproximadamente $\beta_j\, p(1-p)$: **es máximo cerca de $p=0.5$** (ahí vale $\beta_j/4$, regla práctica rápida) y se achata hacia los extremos. Esto resuelve el segundo problema del LPM.

**El mismo odds ratio, distinto cambio en probabilidad.** Si una variable multiplica los odds por $\text{OR}$ y la probabilidad inicial era $p_0$, la nueva probabilidad es $p_1 = \dfrac{\text{OR}\cdot p_0}{1-p_0+\text{OR}\cdot p_0}$. *Ejemplo de clase (Titanic, ser mujer, $\text{OR} = e^{2.61} \approx 13.6$):* con $p_0 = 0.10$ los odds pasan de $0.11$ a $0.11 \times 13.6 \approx 1.50$ y $p_1 = 0.60$ (**+50 puntos porcentuales**); con $p_0 = 0.50$ los odds pasan de $1$ a $13.6$ y $p_1 \approx 0.93$ (**+43 puntos**). El OR es el mismo, pero el cambio en probabilidad depende del punto de partida.

#### Estimación: máxima verosimilitud
Los coeficientes no se calculan con una fórmula cerrada como OLS, sino por **máxima verosimilitud (MLE)**, como la moneda del Módulo 2.6, pero ahora con una probabilidad $p_i$ distinta para cada observación. La probabilidad de observar $y_i$ es $p_i^{y_i}(1-p_i)^{1-y_i}$, la verosimilitud es el producto de todas, y se maximiza su logaritmo (suma) con un **algoritmo iterativo** (Newton-Raphson). Para el logit la función a maximizar es cóncava, así que hay un único máximo.

**Clasificar.** El modelo da $\hat{p}$. Para obtener una clase se fija un **umbral**: $\hat{p} > 0.5 \Rightarrow$ clase 1. Subir o bajar el umbral intercambia precisión y recall (Módulo 4.3): un umbral bajo detecta más positivos (más recall), pero con más falsas alarmas.

**Evaluar el modelo:**
* **Test de razón de verosimilitud (LR):** compara un modelo completo con uno restringido: $LR = 2(\ln L_{\text{completo}} - \ln L_{\text{restringido}})$, que bajo $H_0$ sigue una $\chi^2$ con tantos grados de libertad como restricciones (Módulo 2.4). Es el equivalente del test $F$ de la regresión.
* **Pseudo $R^2$ de McFadden:** $1 - \ln L_{\text{modelo}}/\ln L_{\text{nulo}}$ (el modelo nulo solo tiene constante). *Ejemplo:* $\ln L_{\text{nulo}} = -100$ y $\ln L_{\text{modelo}} = -70 \Rightarrow R^2_{\text{McF}} = 0.30$ (y $LR = 60$). **No es comparable con el $R^2$ de OLS:** valores de 0.2 a 0.4 ya se consideran un buen ajuste.
* **Curva ROC y AUC:** al variar el umbral de 0 a 1 se grafica la **tasa de verdaderos positivos** (el recall, $VP/(VP+FN)$) contra la **tasa de falsos positivos** ($FP/(FP+VN)$). El **AUC** (área bajo la curva) es la probabilidad de que el modelo asigne mayor $\hat{p}$ a un positivo real elegido al azar que a un negativo real. $0.5$ equivale a azar; $1$ es un clasificador perfecto.

**Cómo leer la curva ROC.** Cada punto de la curva corresponde a un **umbral** distinto: el eje vertical es la tasa de verdaderos positivos (recall) y el horizontal la tasa de falsos positivos $= 1-\text{especificidad}$. La diagonal representa el azar (un clasificador sin capacidad de discriminar); cuanto más cerca de la esquina superior izquierda, mejor discrimina el modelo. La ROC mira **todos** los umbrales a la vez; el AUC resume qué tan bien el modelo distingue entre quienes tienen el evento y quienes no. Mover el umbral no cambia el modelo ni su AUC: solo recorre la curva (Módulo 4.3).

#### Un caso completo: el Titanic de la clase
**Los datos.** El archivo train.csv reúne 891 pasajeros y 12 variables. La variable objetivo $Y$ es Survived (0 = no sobrevivió, 549 pasajeros; 1 = sobrevivió, 342) y las variables explicativas $X$ incluyen Pclass (clase), Sex, Age, SibSp, Parch, Fare y Embarked. Es **aprendizaje supervisado**: el algoritmo aprende patrones de casos pasados en los que se conoce el resultado y los aplica a pasajeros nuevos. Y es un problema de **clasificación**, no de regresión: se predice una categoría (sobrevive o no), no un número. En entrenamiento sobrevivió el $75.1\,\%$ de las mujeres (163 de 217) y solo el $18.7\,\%$ de los hombres (76 de 406).

*Ejemplo de clase (Titanic, Kaggle).* Se parte `train.csv` (891 pasajeros) en 70 % entrenamiento (623) y 30 % prueba (268), estratificando por `Survived`. Con **una sola variable** (`Female`), el modelo estimado fue $\text{logit}(p) = -1.468 + 2.573\cdot\text{Female}$. Para una mujer: $z = -1.468 + 2.573 = 1.105$ y $p = 1/(1+e^{-1.105}) \approx 0.751$, coherente con la tasa observada en entrenamiento (163 de 217 mujeres, 75.1 %).

Con **tres variables** (`Female`, `Age` y `Pclass` como categórica, con la 1.ª clase de referencia) el modelo es $z = 1.4666 + 2.6100\,\text{Female} - 0.0439\,\text{Age} - 1.3946\,\text{Pclass}_2 - 2.5846\,\text{Pclass}_3$:

| Variable | $\beta$ | Odds ratio $e^{\beta}$ | Lectura (demás variables constantes) |
| :--- | :--- | :--- | :--- |
| `Female` (1 = mujer) | $2.6100$ | $13.6$ | ser mujer multiplica los odds de sobrevivir por $13.6$ |
| `Age` (años) | $-0.0439$ | $0.96$ | cada año adicional multiplica los odds por $0.96$ ($\approx 4\,\%$ menos) |
| `Pclass` = 2 (vs. 1) | $-1.3946$ | $0.25$ | viajar en 2.ª clase multiplica los odds por $0.25$ ($\approx 75\,\%$ menos) |
| `Pclass` = 3 (vs. 1) | $-2.5846$ | $0.08$ | viajar en 3.ª clase multiplica los odds por $0.08$ ($\approx 92\,\%$ menos) |

Con el umbral $0.50$: una mujer de 23 años en 1.ª clase tiene $\hat{p} \approx 0.956$ (se predice "sobrevive"); un hombre de 30 años en 1.ª clase, $\hat{p} \approx 0.537$ ("sobrevive"); y un hombre de 30 años en 3.ª clase, $\hat{p} \approx 0.081$ ("no sobrevive"). El signo de cada $\beta$ indica hacia dónde empuja la probabilidad; el odds ratio dice cuántas veces se multiplican los odds.

Los odds de tres pasajeros del Titanic ilustran la escala: con $\hat{p} = 0.80$, $\text{odds} = 0.80/0.20 = 4.0$ (sobrevivir es 4 veces más probable que no); con $\hat{p} = 0.50$, $\text{odds} = 1.0$ (igual de probable); con $\hat{p} = 0.20$, $\text{odds} = 0.25$ (no sobrevivir es 4 veces más probable).

**De dónde salen los $\beta$ (ejemplo de clase).** Hay muchos $\beta$ posibles y hace falta un criterio: elegir los que mejor explican lo observado. Con 4 pasajeros (A sobrevivió, B no, C sobrevivió, D no), un modelo que asigna $\hat{p} = 0.90, 0.15, 0.80, 0.10$ explica mejor lo ocurrido que otro que asigna $0.60, 0.55, 0.55, 0.40$. La log-verosimilitud $\ell(\beta) = \sum_i [\,y_i \ln p_i + (1-y_i)\ln(1-p_i)\,]$ lo confirma: $\ell \approx -0.60$ para el primero y $\ell \approx -2.42$ para el segundo. Se eligen los $\beta$ que **maximizan** $\ell$ (en OLS, en cambio, se minimizan los errores al cuadrado).

#### Seleccionar variables: forward, backward y stepwise
Más variables no siempre dan un mejor modelo: pueden aportar información, pero también **redundancia** y complejidad innecesaria. Para decidir **qué variables conservar** se sigue un criterio sistemático (no se prueban combinaciones al azar):
* **Forward (hacia adelante):** parte del modelo vacío. En cada paso prueba agregar cada variable candidata **por separado** y se queda con la que más mejora el modelo; se detiene cuando ninguna aporta una mejora relevante.
* **Backward (hacia atrás):** parte del modelo con **todas** las variables y, en cada paso, elimina la que menos aporta; se detiene cuando ninguna de las que quedan cumple el criterio de eliminación.
* **Stepwise:** combina ambos enfoques: puede agregar variables y también **volver a quitar** alguna que ya estaba y dejó de aportar.

El **criterio de selección** puede ser estadístico (p-valor, AIC o BIC) o predictivo (por ejemplo, el AUC promedio por validación cruzada). Lo que distingue a los métodos es el punto de partida y la flexibilidad para agregar o quitar variables. *Ejemplo de clase (Titanic):* con candidatas `Female`, `Age`, `Pclass`, `Fare` y `FamilySize`, forward con AUC por validación cruzada de 5 folds incorporó primero `Female` (AUC CV $0.7708$), luego `Pclass` ($0.8333$) y luego `Age` ($0.8466$); `Fare` y `FamilySize` quedaron fuera. **Seleccionar variables no es lo mismo que regularizar:** seleccionar decide cuáles se conservan; regularizar cambia cómo se estiman los coeficientes de las que se conservan.

#### Regularización en la regresión logística: L1, L2 y el parámetro C
Sin regularización, los coeficientes se estiman maximizando la log-verosimilitud, es decir, minimizando el **Log Loss**. Regularizar significa **cambiar el criterio de estimación**: se minimiza $\text{Log Loss}(\beta) + \text{penalización}(\beta)$, de modo que el modelo ajuste bien los datos **y** evite coeficientes demasiado grandes.
* **L1 (Lasso):** penaliza la suma de valores absolutos, $\lambda\sum_j |\beta_j|$. Puede llevar algunos coeficientes **exactamente a 0**, así que sirve también como selección automática de variables; es útil si se busca parsimonia.
* **L2 (Ridge):** penaliza la suma de cuadrados, $\lambda\sum_j \beta_j^2$. Tiende a **achicar** todos los coeficientes sin anularlos; es útil si se busca estabilizar los coeficientes.

En *scikit-learn* se eligen dos cosas: `penalty` (`'l1'` o `'l2'`, el **tipo** de regularización; para L1 se usa el solver `'liblinear'`) y `C`, que es el **inverso** de la fuerza de regularización y aplica tanto a L1 como a L2: **`C` chico = regularización más fuerte; `C` grande = más débil**. Valores típicos: $0.01$, $0.1$, $1$, $10$, $100$. Primero se elige la penalización y después su intensidad; para elegir `C` conviene usar entrenamiento con validación cruzada y reservar la prueba para la evaluación final. *Ejemplo de clase (Titanic, `Female`, `Age`, `Pclass` numérica, L2 con $C=1$):* los coeficientes pasaron de $2.646$, $-0.038$ y $-1.173$ a $2.511$, $-0.037$ y $-1.130$: las mismas variables, pero coeficientes algo más moderados. (Es la misma idea de Ridge y Lasso del Módulo 6.4, con Log Loss en lugar de RSS.)

#### Discriminar bien no es estimar buenas probabilidades: calibración y Hosmer–Lemeshow
**Discriminar** es asignar probabilidades más altas a quienes realmente tienen el evento (se mide con la ROC y el AUC). **Estimar buenas probabilidades** (estar **calibrado**) significa que si el modelo asigna $80\,\%$ a un grupo, aproximadamente el $80\,\%$ de ese grupo debería tener el evento. Un modelo puede ordenar bien a los pasajeros y, aun así, sobreestimar o subestimar las probabilidades: **discriminar bien no implica estar bien calibrado**.

El **test de Hosmer–Lemeshow** evalúa esa calibración (la *bondad de ajuste* de la regresión logística): (1) se ordenan las observaciones según su probabilidad predicha; (2) se dividen en grupos (por ejemplo, 10 deciles); (3) en cada grupo se comparan los casos **observados** con los **esperados**; (4) si las diferencias son pequeñas en la mayoría de los grupos, el ajuste es razonable. Interpretación: $H_0$ = no hay evidencia de falta de ajuste. Un **p-valor grande** (por ejemplo, $>0.05$) indica que no hay evidencia contra el ajuste; un **p-valor chico** indica que las probabilidades predichas no coinciden bien con lo observado. Es una herramienta útil, pero conviene complementarla con otras métricas y con gráficos de calibración. *No mide discriminación (como el AUC): compara probabilidades predichas con frecuencias observadas.*

#### Antes de confiar en el modelo: significancia y multicolinealidad (VIF)
**Significancia de los coeficientes.** Para cada coeficiente se contrasta $H_0:\beta_j = 0$ (la variable no aporta información) contra $H_1:\beta_j \neq 0$ con el estadístico $z = \hat{\beta}_j/\text{ee}(\hat{\beta}_j)$ (coeficiente dividido su error estándar). Si el p-valor es pequeño (por ejemplo, $<0.05$), hay evidencia de que la variable está asociada con la probabilidad del evento, una vez controladas las demás variables. *Ejemplo de clase (Titanic):* `Female` ($\hat\beta = 2.6100$, ee $= 0.2257$, $z = 11.57$), `Age` ($-0.0439$, ee $= 0.0093$, $z = -4.72$) y las dos dummies de `Pclass` ($z = -4.31$ y $-8.22$) tienen p-valor menor que $0.05$.

**Multicolinealidad y VIF.** Ocurre cuando dos o más variables explicativas contienen información muy parecida; los coeficientes se vuelven **inestables**, aumentan sus errores estándar y el modelo es más difícil de interpretar. El **factor de inflación de la varianza** de la variable $X_j$ mide cuánta de su información está explicada por las demás:

$$\text{VIF}_j = \frac{1}{1 - R_j^2}$$

donde $R_j^2$ es el coeficiente de determinación de la regresión de $X_j$ contra las otras variables explicativas. *Ejemplo:* si $R_j^2 = 0.5$, $\text{VIF} = 2$; si $R_j^2 = 0.8$, $\text{VIF} = 5$. **Regla práctica:** un VIF mayor que $5$ suele considerarse una señal de alerta (y valores mucho más altos, un problema serio). En el Titanic de la clase todos los VIF estuvieron entre $1.06$ y $1.85$: sin indicios de multicolinealidad importante.

#### Comparar modelos: ¿qué pasó al agregar variables?
*Ejemplo de clase (Titanic, evaluación en prueba, 268 pasajeros).* Modelos: **Original** (`Female`, `Age`, `Pclass`), **Seleccionado** (agrega `FamilySize`), **Seleccionado + L2** (el mismo con $C=10$) y **Completo** (agrega también `Fare`).

| Modelo | AUC CV (train) | AUC test | Log Loss test | Accuracy test | Hosmer–Lemeshow (p) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Original | $0.8464$ | $0.8361$ | $0.4685$ | $0.7761$ | $0.1363$ |
| Seleccionado | $0.8500$ | $0.8485$ | $0.4534$ | $0.7985$ | $0.6582$ |
| Seleccionado + L2 | $0.8502$ | $0.8485$ | $0.4534$ | $0.7985$ | $0.6613$ |
| Completo | $0.8481$ | $0.8503$ | $0.4523$ | $0.7910$ | $0.6419$ |

Lectura: el modelo seleccionado mejora al original; la regularización L2 aporta una mejora muy leve en el AUC por validación cruzada; el completo logra el mejor AUC en prueba y el menor Log Loss; y todos los p-valores de Hosmer–Lemeshow son mayores que $0.05$. Más variables no son automáticamente mejores: las diferencias entre los tres últimos son pequeñas.

### 5.3 Probit y el modelo de variable latente

Tanto logit como probit pueden entenderse con una **variable latente** $y^{*}$: una magnitud **no observable** (la "utilidad neta" de comprar, la "propensión" a enfermar):

$$y^{*} = \beta_0 + X\beta + e, \qquad y = 1 \text{ si } y^{*} > 0,\quad y = 0 \text{ en caso contrario}$$

Solo observamos si $y^*$ cruzó el umbral 0. La probabilidad de $y=1$ depende de la **distribución que supongamos para el error $e$**:

* **Logit:** $e$ sigue una distribución **logística** estándar $\Rightarrow$ $p = 1/(1+e^{-z})$.
* **Probit:** $e$ sigue una **Normal estándar** $N(0,1)$ $\Rightarrow$ $p = \Phi(z)$, donde $\Phi(z)$ es la **función de distribución acumulada Normal**: la probabilidad de que una Normal estándar sea menor o igual a $z$ (por ejemplo, $\Phi(0) = 0.5$ y $\Phi(1.96) \approx 0.975$).

**Comparación práctica:**
* Las dos curvas en "S" son casi idénticas; la logística tiene colas algo más pesadas. Con frecuencia dan **las mismas predicciones y conclusiones**.
* **Escala de los coeficientes:** como la logística tiene mayor dispersión que la Normal estándar, los coeficientes del logit son aproximadamente **1.6 a 1.8 veces mayores** que los del probit. No son comparables directamente. *Ejemplo:* si el logit da $0.8$, el probit rondará $0.5$.
* **Interpretación:** el logit permite hablar de **odds ratios**. En el probit solo se interpretan el signo, la significación y los efectos marginales sobre la probabilidad. Por eso el logit es más popular.
* Ambos se estiman por **máxima verosimilitud**.

### 5.4 Clasificadores generativos: LDA, QDA y Naive Bayes

La regresión logística es un enfoque **discriminativo**: modela directamente $P(Y \mid X)$. Los modelos **generativos** hacen lo opuesto: modelan **cómo se distribuyen las variables $X$ dentro de cada clase** y luego aplican el **Teorema de Bayes** (Módulo 0.2) para obtener la probabilidad de cada clase dada la observación:

$$P(Y=k \mid X=x) = \frac{P(X=x \mid Y=k)\; P(Y=k)}{\sum_{l=1}^{K} P(X=x \mid Y=l)\; P(Y=l)}$$

Cada pieza tiene nombre:
* $P(Y=k)$: **probabilidad a priori** (qué proporción de la población pertenece a la clase $k$; se estima con la frecuencia en los datos).
* $P(X=x \mid Y=k)$: **verosimilitud** (qué tan típico es observar $x$ en la clase $k$; es lo que hay que modelar).
* $P(Y=k \mid X=x)$: **probabilidad a posteriori** (la que se quiere). Se asigna al registro la clase con **mayor probabilidad posterior**.

Los tres métodos difieren en **cómo modelan** la verosimilitud.

#### LDA: Análisis Discriminante Lineal
Supone que, dentro de cada clase, $X$ sigue una **Normal** con **media propia** $\mu_k$ y una **matriz de covarianza común** $\Sigma$ (Módulo 0.3: la tabla de varianzas y covarianzas entre las variables) **igual para todas las clases**. Con esas suposiciones, la frontera de decisión entre clases es **lineal** (una recta o un hiperplano).

**Ejemplo con una variable.** Dos clases: A con media $\mu_A = 2$ y B con $\mu_B = 6$; ambas con desviación típica $\sigma = 2$.
* Con **a priori iguales**, la frontera está en el punto medio: $x = 4$.
* Para $x = 5$, las verosimilitudes relativas son $e^{-(5-2)^2/8} \approx 0.325$ (A) y $e^{-(5-6)^2/8} \approx 0.883$ (B): probabilidad posterior de B $\approx 0.883/(0.325+0.883) \approx 0.73$.
* Si las **a priori son desiguales** ($\pi_A = 0.8$, $\pi_B = 0.2$), la frontera se mueve hacia la clase **más rara**: $x = \tfrac{\mu_A+\mu_B}{2} - \dfrac{\sigma^2 \ln(\pi_A/\pi_B)}{\mu_A-\mu_B} \approx 5.39$. Solo se clasifica como B si $x > 5.39$.

#### QDA: Análisis Discriminante Cuadrático
Igual que LDA, pero **cada clase tiene su propia matriz de covarianza** $\Sigma_k$. Las fronteras resultan **cuadráticas** (curvas). Es más flexible, pero **estima muchos más parámetros**. *Ejemplo:* con $p=50$ variables, la matriz de covarianza tiene $50\cdot51/2 = 1275$ parámetros; LDA estima una, y QDA con 3 clases estima $3\times1275 = 3825$. Es el trade-off sesgo-varianza del Módulo 6: **LDA** tiene más sesgo y menos varianza (mejor con pocos datos); **QDA**, menos sesgo y más varianza (mejor con muchos datos y covarianzas realmente distintas).

#### Naive Bayes
Supone que, **dentro de cada clase, todas las variables son independientes entre sí**. Eso permite **multiplicar** las verosimilitudes de cada variable, que se estiman de a una (algo muy simple):

$$P(X_1,\dots,X_p \mid Y=k) = \prod_{j=1}^{p} P(X_j \mid Y=k)$$

*Ejemplo (spam).* $P(\text{spam}) = 0.4$. Palabra "oferta": aparece en el $50\,\%$ del spam y en el $5\,\%$ del correo legítimo. Palabra "reunión": $10\,\%$ del spam y $40\,\%$ del legítimo. Para un correo con ambas palabras:
* Spam: $0.4 \times 0.5 \times 0.1 = 0.020$
* No spam: $0.6 \times 0.05 \times 0.4 = 0.012$
* Probabilidad de spam: $0.020/(0.020+0.012) = 0.625$.

El supuesto es "ingenuo" (las palabras no son realmente independientes), pero **funciona sorprendentemente bien**, sobre todo con muchísimas variables (como el texto), porque para clasificar basta que el **orden** de las probabilidades sea correcto, no que sean exactas. Es rápido, necesita pocos datos y se adapta bien a alta dimensión. *Problema típico:* si una palabra nunca apareció en una clase, su probabilidad es 0 y anula todo el producto; se corrige con **suavizado de Laplace** (sumar una pequeña cantidad a todos los conteos).

#### ¿Cuál usar?

| Método | Enfoque | Supone | Frontera | Útil cuando |
| :--- | :--- | :--- | :--- | :--- |
| **Regresión logística** | Discriminativo | Casi nada sobre la distribución de $X$ | Lineal (en $X$) | Quieres odds ratios y robustez |
| **LDA** | Generativo | $X$ Normal por clase, $\Sigma$ común | Lineal | Pocos datos, clases bien separadas, más de 2 clases |
| **QDA** | Generativo | $X$ Normal por clase, $\Sigma_k$ propias | Cuadrática | Muchos datos, covarianzas distintas |
| **Naive Bayes** | Generativo | Variables independientes dentro de cada clase | Depende del tipo | Alta dimensión (texto), pocos datos |

### Autoevaluación del Módulo 5

1. Enumera tres problemas del modelo lineal de probabilidad. Ilustra el primero con $\hat{y} = -0.1 + 0.25x$ y $x=6$.
2. Convierte: (a) $p = 0.2$ a odds; (b) odds $= 3$ a probabilidad.
3. Un coeficiente logit vale $-0.4$. ¿Cuál es el odds ratio y cómo lo interpretas?
4. Con $\ln(\text{odds}) = -2 + 0.7x$, calcula $p$ para $x = 2$ (usa $e^{0.6}\approx1.82$).
5. ¿Por qué el efecto de $x$ sobre $p$ no es constante en el logit y dónde es máximo?
6. Si un logit tiene coeficiente $0.8$, ¿qué esperarías aproximadamente en un probit?
7. $\ln L_{\text{nulo}} = -200$ y $\ln L_{\text{modelo}} = -150$. Calcula el $R^2$ de McFadden y el estadístico LR.
8. A priori: clase 1 = $0.3$, clase 2 = $0.7$. Para cierto $x$, las verosimilitudes son $0.4$ (clase 1) y $0.1$ (clase 2). ¿Cuál es la probabilidad posterior de la clase 1?
9. ¿Qué significa el supuesto "ingenuo" de Naive Bayes y por qué puede funcionar aunque sea falso?
10. ¿Qué diferencia a LDA de QDA y cuándo conviene cada uno?
11. ¿Qué significa un AUC de $0.5$?

### Respuestas del Módulo 5

1. (a) Probabilidades fuera de $[0,1]$; (b) efecto marginal constante; (c) heterocedasticidad inherente. Con $x = 6$: $\hat{y} = -0.1 + 1.5 = 1.4$, una "probabilidad" de $140\,\%$.
2. (a) $0.2/0.8 = 0.25$; (b) $p = 3/(1+3) = 0.75$.
3. $\text{OR} = e^{-0.4} \approx 0.67$: cada unidad adicional de la variable **multiplica los odds por 0.67**, es decir, los reduce aproximadamente un $33\,\%$.
4. $z = -2 + 1.4 = -0.6$; $p = 1/(1+e^{0.6}) \approx 1/2.82 \approx 0.354$.
5. Por la forma de "S" de la función logística: el efecto es $\approx \beta\,p(1-p)$, que es **máximo en $p=0.5$** (vale $\beta/4$) y pequeño cerca de 0 y de 1. Los odds se multiplican siempre por lo mismo, pero la probabilidad no cambia siempre en la misma cantidad.
6. Alrededor de $0.8/1.6 \approx 0.5$ (a veces un poco menos).
7. $R^2_{\text{McF}} = 1 - (-150)/(-200) = 0.25$. $LR = 2\times(-150 - (-200)) = 100$.
8. Numerador clase 1: $0.3 \times 0.4 = 0.12$. Clase 2: $0.7 \times 0.1 = 0.07$. Posterior $= 0.12/0.19 \approx 0.63$.
9. Que, dentro de cada clase, las variables son independientes entre sí. Es raro que sea verdad, pero para clasificar basta que **la clase con mayor probabilidad siga siendo la correcta**, aunque las probabilidades en sí sean inexactas. Además, estima pocos parámetros, lo que reduce la varianza.
10. LDA: misma covarianza en todas las clases, frontera **lineal**, pocos parámetros (mejor con pocos datos). QDA: covarianza propia por clase, frontera **cuadrática**, más flexible pero con más parámetros (mejor con muchos datos).
11. Que el modelo **no distingue mejor que el azar** entre positivos y negativos (equivale a lanzar una moneda).

---

## Módulo 6: Aprendizaje Estadístico, Ensambles, SVM y Agrupamiento

El **aprendizaje estadístico** reúne los métodos para construir modelos que **predigan bien datos que nunca vieron**. Todo el módulo gira alrededor de una tensión: un modelo demasiado simple no capta los patrones, y uno demasiado flexible memoriza el ruido.

### 6.1 Aprendizaje supervisado y no supervisado

* **Supervisado**: para cada entrada $x_i$ se conoce una respuesta $y_i$. Se busca una función $f$ tal que $Y = f(X) + \epsilon$, donde $\epsilon$ es el **error irreducible** (variación de $Y$ que ninguna función de $X$ puede explicar). Si $Y$ es un número, es **regresión**; si es una categoría, **clasificación** (Módulos 3 a 5).
* **No supervisado**: solo se observan las entradas $x_i$, sin respuesta. Se busca **estructura**: grupos (*clustering*) o direcciones de variación (PCA).

**Medir el error en regresión.** El **error cuadrático medio** (MSE) es el promedio de los errores al cuadrado: $\text{MSE} = \frac{1}{n}\sum (y_i - \hat{y}_i)^2$. Se distinguen dos versiones:
* **Error de entrenamiento**: calculado con los datos usados para ajustar el modelo. Casi siempre es optimista.
* **Error de prueba**: calculado con datos **nuevos**. Es el que realmente importa.

Un modelo más flexible **tiende a bajar siempre el error de entrenamiento**, pero el error de prueba no necesariamente.

### 6.2 El equilibrio sesgo-varianza

Para un punto nuevo, el error de prueba esperado se descompone en tres partes:

$$\text{Error esperado} = \underbrace{\text{Sesgo}^2}_{\text{por simplificar}} + \underbrace{\text{Varianza}}_{\text{por sensibilidad a los datos}} + \underbrace{\text{Error irreducible}}_{\text{no se puede evitar}}$$

* **Sesgo**: error por suponer un modelo demasiado simple (ajustar una recta a una curva). Produce **subajuste** (*underfitting*).
* **Varianza**: cuánto cambiaría el modelo si se entrenara con **otra muestra** distinta. Un modelo muy flexible cambia mucho y memoriza el ruido: **sobreajuste** (*overfitting*).
* **Error irreducible**: el piso, no se puede bajar con ningún modelo.

**Metáfora de la regla y la cuerda de hule.** Un modelo de alto sesgo es una **regla rígida de madera**: no se dobla para seguir el terreno real. Uno de alta varianza es una **cuerda de hule** muy flexible que se amolda a cada grano de polvo y pierde la forma general.

| Propiedad | Modelo rígido | Modelo balanceado | Modelo muy flexible |
| :--- | :--- | :--- | :--- |
| Sesgo | Alto | Bajo | Muy bajo |
| Varianza | Baja | Moderada | Muy alta |
| Ajuste | Subajuste | Óptimo | Sobreajuste |
| Error de entrenamiento | Alto | Bajo | **Casi cero** |
| Error de prueba | Alto | **Mínimo** | Alto (curva en U) |

*Ejemplo ilustrativo (cifras inventadas):* ajustando polinomios a 10 puntos, el error de entrenamiento baja con el grado (grado 1: 9.0; grado 3: 2.5; grado 9: **0.0**), pero el de prueba hace una **U** (grado 1: 10.2; grado 3: **3.1**; grado 9: 25.0). El grado 9 pasa por todos los puntos de entrenamiento y falla con datos nuevos.

**El objetivo no es minimizar el error de entrenamiento, sino hallar el punto de equilibrio** con menor error de prueba. Las secciones siguientes son herramientas para encontrarlo y controlarlo.

### 6.3 Remuestreo: validación cruzada y *bootstrap*

Como no siempre hay un conjunto de prueba aparte, se **reutilizan** los datos de forma inteligente.

**Parámetros e hiperparámetros.** Los **parámetros** (los $\beta$) se aprenden de los datos. Los **hiperparámetros** (profundidad de un árbol, $\lambda$ de regularización, número de vecinos) **se fijan antes** y controlan la flexibilidad. Elegirlos bien es la tarea típica de la validación cruzada.

**Validación cruzada de $k$ particiones (*$k$-fold CV*):**
1. Se dividen los datos al azar en $k$ partes iguales (*folds*).
2. Se entrena con $k-1$ partes y se evalúa en la parte restante.
3. Se repite $k$ veces, rotando la parte de evaluación, y se **promedian** los $k$ errores.

*Ejemplo:* con $n=100$ y $k=5$, cada ajuste usa 80 datos para entrenar y 20 para evaluar, y se hacen 5 ajustes. Se suele usar $k = 5$ o $10$. El caso extremo $k=n$ es *leave-one-out*, más costoso. Se elige el hiperparámetro con **menor error de validación cruzada**.

**Bootstrap.** Una muestra *bootstrap* se obtiene **sacando $n$ datos con reemplazo** de los $n$ originales (un mismo dato puede repetirse y otros quedar afuera). *Ejemplo:* de $\{1,2,3,4,5\}$ podría salir $\{2,2,4,5,1\}$. Permite simular "otras muestras" a partir de una sola y estimar la variabilidad de cualquier estadístico.

Un dato dado queda **fuera** de una muestra bootstrap con probabilidad $(1-1/n)^n \to 1/e \approx 0.368$. Es decir, **cada muestra bootstrap contiene en promedio ~63 % de los datos distintos y deja ~37 % afuera**. Esto se usa en el bagging.

### 6.4 Regularización y reducción de dimensión

Cuando hay **muchas variables** (incluso más variables que observaciones, $p > n$), OLS tiene alta varianza o directamente no tiene solución única. La idea de la **regularización** es **aceptar un poco de sesgo a cambio de bajar mucho la varianza**, penalizando coeficientes grandes.

Recordemos que OLS minimiza la suma de residuos al cuadrado (RSS). Los métodos regularizados le suman una **penalización**:

* **Ridge** ($L_2$): minimiza $\text{RSS} + \lambda\sum_j \beta_j^2$. **Encoge** todos los coeficientes hacia cero, pero **ninguno llega a ser exactamente cero**.
* **Lasso** ($L_1$): minimiza $\text{RSS} + \lambda\sum_j |\beta_j|$. Además de encoger, **lleva a cero** algunos coeficientes: hace **selección automática de variables** y produce modelos más simples de interpretar.

*Detalles que importan:*
* $\lambda \ge 0$ es un **hiperparámetro** (se elige por validación cruzada). Con $\lambda = 0$ se obtiene OLS; con $\lambda \to \infty$ todos los coeficientes tienden a 0 (solo queda la constante).
* Hay que **estandarizar las variables** antes (Módulo 4.2), porque la penalización depende de la escala de cada una.
* Intuición geométrica: la penalización $L_1$ define una región con "esquinas" en los ejes y el óptimo suele caer en una esquina (coeficiente $=0$); la $L_2$ define un círculo sin esquinas.
* *Elastic net* combina ambas penalizaciones.

*Ejemplo ilustrativo (cifras inventadas) de coeficientes al aumentar $\lambda$:*

| $\lambda$ | $\beta_1$ (Ridge) | $\beta_2$ (Ridge) | $\beta_3$ (Ridge) | $\beta_1$ (Lasso) | $\beta_2$ (Lasso) | $\beta_3$ (Lasso) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | 3.0 | 1.5 | 0.4 | 3.0 | 1.5 | 0.4 |
| 1 | 2.4 | 1.2 | 0.3 | 2.5 | 1.0 | **0** |
| 10 | 1.1 | 0.6 | 0.1 | 1.2 | **0** | **0** |

#### PCA: Análisis de Componentes Principales (reducción de dimensión, no regularización)
PCA es una técnica **no supervisada** (no usa la respuesta). Transforma las variables originales, correlacionadas, en **nuevas variables llamadas componentes principales**, que son:
* **combinaciones lineales** de las originales (Módulo 0.3),
* **no correlacionadas** entre sí,
* ordenadas por **cuánta varianza capturan**: la primera componente es la dirección con la mayor variación posible, la segunda es la mayor variación restante en dirección perpendicular, etc.

Matemáticamente, las componentes son los **vectores propios** de la matriz de covarianza, y la varianza de cada una es su **valor propio**.

*Ejemplo:* si "estatura" y "peso" están muy correlacionados, la primera componente se parece a un índice de "tamaño corporal" y captura casi toda la variación; la segunda, lo que queda (más bien "complexión").

*Con 4 variables estandarizadas* (varianza total $=4$), si los valores propios son $2.8,\ 0.9,\ 0.2,\ 0.1$, la primera componente explica $2.8/4 = 70\,\%$ de la varianza y las dos primeras $3.7/4 = 92.5\,\%$. Se podría trabajar con 2 componentes en lugar de 4 variables perdiendo poca información.

*Usos:* reducir dimensión, visualizar datos, eliminar colinealidad y alimentar otros modelos (regresión sobre componentes principales). *Advertencia:* se deben **estandarizar** las variables antes (si no, domina la de mayor escala), y como PCA **ignora $Y$**, las componentes con más varianza no tienen por qué ser las más útiles para predecir.

### 6.5 Métodos de ensamble

Un **ensamble** combina muchos modelos "débiles" para obtener uno fuerte. Los modelos base casi siempre son **árboles de decisión** (Módulo 4.3), que tienen la desventaja de ser **inestables**: un pequeño cambio en los datos puede cambiar mucho el árbol (alta varianza).

**Por qué promediar ayuda.** Si se promedian $B$ modelos, cada uno con varianza $\sigma^2$ y correlación $\rho$ entre sí, la varianza del promedio es:

$$\rho\,\sigma^2 + \frac{1-\rho}{B}\,\sigma^2$$

Si fueran independientes ($\rho=0$) la varianza caería a $\sigma^2/B$. Pero si están muy correlacionados, **promediar no ayuda**: el primer término queda. *Ejemplo:* $\sigma^2=4$, $B=100$. Con $\rho=0$, varianza $=0.04$. Con $\rho=0.5$, varianza $= 2 + 0.02 = 2.02$. **Hay que lograr modelos distintos entre sí.**

#### Bagging (*Bootstrap Aggregation*)
1. Generar $B$ muestras *bootstrap* (6.3).
2. Entrenar un **árbol profundo** (poco sesgo, mucha varianza) en cada una.
3. **Combinar:** promedio (regresión) o voto mayoritario (clasificación).

Reduce la **varianza** sin aumentar apreciablemente el sesgo, a costa de perder la interpretabilidad de un único árbol.

**Estimación Out-Of-Bag (OOB).** Como cada árbol ve solo ~63 % de los datos, **el ~37 % restante son datos que ese árbol "no vio"**. Para cada observación se promedian las predicciones de los árboles que **no la usaron** y se compara con el valor real. El error OOB resultante es una **estimación honesta del error de prueba, sin necesidad de validación cruzada**.

#### Bosques aleatorios (*Random Forests*)
Mejoran el bagging **descorrelacionando** los árboles. En **cada división** de cada árbol, solo se considera un **subconjunto aleatorio de $m$ variables** de las $p$ disponibles (típicamente $m \approx \sqrt{p}$ para clasificación). Si $m = p$, es bagging.

*Por qué funciona:* si hay una variable muy fuerte, **todos** los árboles del bagging la usan arriba y se parecen mucho ($\rho$ alta, el promedio ayuda poco). Al prohibir esa variable en muchas divisiones, se **fuerza la diversidad**.

> **Metáfora del comité:** si en un panel de médicos hay un especialista muy dominante, todos los diagnósticos se parecerán. Si a cada médico se le permite consultar solo un grupo aleatorio de síntomas, las opiniones se diversifican y el voto del comité es más robusto.

Agregar más árboles **no causa sobreajuste**: la varianza se estabiliza.

**Dos fuentes de diversidad.** (1) **Bootstrap de las observaciones:** cada árbol se entrena con una muestra del entrenamiento hecha **con reemplazo**, así que algunos pasajeros aparecen más de una vez en una muestra y otros no aparecen. (2) **Variables aleatorias en cada nodo:** en cada división el árbol solo evalúa un subconjunto aleatorio de variables. Con ambas, los árboles se parecen menos entre sí y al promediarlos el modelo suele ser más robusto.

**Cómo se obtiene la predicción final.** Cada árbol entrega una **probabilidad**; el bosque **promedia esas probabilidades** y luego aplica un umbral. *Ejemplo de clase (5 árboles, para un hombre de 30 años en 3.ª clase):* probabilidades $0.125, 0.500, 0.333, 0.143$ y $0.000$; promedio $= 1.101/5 \approx 0.220$; con umbral $0.50$, $0.220 < 0.50$ y la predicción es "no sobrevive". En la práctica se usan muchos más árboles (por ejemplo, 100).

**Ajuste de hiperparámetros del bosque.** Hay hiperparámetros **del bosque** (`n_estimators`: cantidad de árboles; `max_features`: cuántas variables se evalúan en cada nodo; `bootstrap`: si cada árbol usa una muestra con reemplazo) e hiperparámetros **de cada árbol** (`max_depth`, `min_samples_split`, `min_samples_leaf`). Para elegir la combinación: (1) se define una **grilla** de valores; (2) se prueban las combinaciones solo sobre el entrenamiento; (3) se usa **validación cruzada estratificada** (por ejemplo, 3 folds); (4) se elige la de mayor AUC promedio; y (5) se reentrena con todo el entrenamiento y recién entonces se evalúa en la prueba. *Ejemplo de clase (Titanic):* la mejor combinación fue `n_estimators=100`, `max_features=1`, `max_depth=None`, `min_samples_split=2`, `min_samples_leaf=5` y `bootstrap=True`, con AUC promedio de validación cruzada de $0.861$. **No se busca el bosque más grande, sino la combinación que mejor generaliza.**

**Comparación final (ejemplo de clase, Titanic, prueba).** Con la misma partición y las mismas variables (sexo, edad imputada y clase), los tres modelos dieron: regresión logística, AUC $0.838$, accuracy $0.780$, precisión $0.700$, recall $0.748$; árbol de decisión (`max_depth=None`, `min_samples_leaf=5`), AUC $0.837$, accuracy $0.813$, precisión $0.752$, recall $0.767$; bosque aleatorio, AUC $0.856$, accuracy $0.802$, precisión $0.755$, recall $0.718$. **Si se prioriza el AUC, el mejor fue el bosque; si se miran accuracy y recall, el árbol tuvo los valores más altos:** el "mejor" modelo depende de la métrica elegida.

#### Explicabilidad frente a capacidad predictiva
Al elegir una técnica hay que equilibrar dos fuerzas contrapuestas: **explicabilidad** (poder decir *por qué* el modelo decidió algo) y **capacidad predictiva**. Con los tres modelos de la comparación anterior:
* **Regresión logística** (modelo "blanco"): es transparente. Entrega una ecuación con coeficientes interpretables (*odds ratios*, Módulo 5.2) y permite inferencia formal (p-valores, intervalos de confianza).
* **Árbol de decisión**: si se mantiene pequeño (profundidad de hasta 3), se puede seguir el camino gráfico de la decisión y presentarlo a directivos o reguladores.
* **Bosque aleatorio** ("caja negra"): es un enjambre de cientos de árboles promediados. Suele predecir mejor con grandes volúmenes de datos, pero **no hay una ecuación única ni un gráfico sencillo** que explique por qué se clasificó a un cliente de cierta manera.

> **Analogía de la receta y el comité:** la regresión logística es una receta con cantidades exactas: puedes explicar cada ingrediente. El árbol chico es un diagrama de flujo que se sigue con el dedo. El bosque es un comité de cien médicos que vota: acierta más, pero nadie puede resumir en una frase por qué votó así el comité.

**SHAP.** En sectores muy regulados (banca, seguros, salud) hay que justificar, por ejemplo, por qué se rechazó un crédito. Como no se puede mostrar el cálculo de 500 árboles, se usan herramientas de explicabilidad válidas para cualquier modelo, como **SHAP** (*SHapley Additive exPlanations*): analizan cómo cambia la predicción al alterar las variables de un individuo, para medir qué variables aportaron más a su decisión.

**Deriva de datos y de concepto (*drift*).** Los modelos basados en árboles afinan patrones muy finos; si la realidad cambia, su rendimiento puede deteriorarse rápido (la regresión logística suele ser más estable en el tiempo). Hay dos tipos de cambio:
* **Deriva de datos (*data drift*):** cambia la distribución de las variables de entrada (por ejemplo, los clientes pasan de comprar por la web a comprar por la aplicación móvil).
* **Deriva de concepto (*concept drift*):** cambia la relación entre las variables y la respuesta (por ejemplo, tras una crisis económica, un nivel de ingresos que antes era seguro pasa a ser de alto riesgo).

Por eso, en empresas de gran escala (bancos, tarjetas de crédito, plataformas de comercio electrónico) estos modelos se **monitorean** y se **reentrenan periódicamente** (en la clase se mencionó cada 6 a 12 meses).

#### Boosting
A diferencia del bagging (árboles independientes en paralelo), el **boosting** entrena árboles **en secuencia**, cada uno **corrigiendo los errores del anterior**:

1. Empezar con una predicción inicial y calcular los **residuos** (lo que falta explicar).
2. Ajustar un **árbol pequeño** (poco profundo, un "aprendiz débil") a esos residuos.
3. Sumar ese árbol al modelo, multiplicado por una **tasa de aprendizaje $\lambda$** pequeña (0.01-0.1).
4. Recalcular los residuos y repetir $B$ veces.

El modelo final es la suma de todos los árboles pequeños. Aprende **despacio** a propósito.

*Caricatura numérica:* si $y=100$, la predicción inicial es $0$, cada árbol predice justo el residuo actual y $\lambda=0.1$: tras un paso el residuo es $100\times0.9 = 90$, tras tres pasos $100 \times 0.9^3 = 72.9$, tras 50 pasos casi $0.5$. Avanza por pasos pequeños en lugar de saltar al valor final.

Hiperparámetros: número de árboles $B$ (aquí **sí** puede haber sobreajuste si es excesivo), $\lambda$ y la profundidad de cada árbol.

* **AdaBoost** (clasificación): da **más peso a las observaciones mal clasificadas** en cada ronda, de modo que el siguiente aprendiz se concentre en lo difícil. El resultado final es un voto **ponderado** (los aprendices más precisos pesan más).
* **Gradient Boosting**: generaliza la idea a cualquier **función de pérdida** (una función que mide el costo de un error: el error cuadrático en regresión, la log-verosimilitud negativa en el logit). Cada árbol se ajusta al **gradiente negativo** de la pérdida (Módulo 0.4: la dirección de máximo descenso). Con pérdida cuadrática, ese gradiente negativo es justamente el **residuo**, por lo que es una **generalización del procedimiento anterior**.
* **BART** (*Bayesian Additive Regression Trees*): suma de muchos árboles pequeños, pero con un enfoque **bayesiano**: cada árbol se actualiza aleatoriamente de forma repetida (mediante **MCMC**, un algoritmo que genera muestras de una distribución de probabilidad compleja dando pasos aleatorios, donde cada paso depende solo del anterior) con una distribución a priori que mantiene los árboles pequeños. El resultado es una **distribución** de predicciones, lo que permite cuantificar la **incertidumbre**.

| | Bagging / Random Forest | Boosting |
| :--- | :--- | :--- |
| Entrenamiento | Paralelo, árboles independientes | Secuencial, cada árbol corrige al anterior |
| Árboles | Profundos | Pequeños |
| Reduce principalmente | **Varianza** | Sesgo (y también varianza) |
| Riesgo de sobreajuste con más árboles | No | **Sí** |
| Sensibilidad a los hiperparámetros | Baja | Alta |

### 6.6 Máquinas de Vectores de Soporte (SVM)

Las SVM son clasificadores que buscan **la mejor frontera lineal** entre dos clases.

**Hiperplano separador** (Módulo 0.3): una recta en 2D (o un plano en 3D) $w_1x_1 + w_2x_2 + b = 0$ que parte el espacio. Un punto cae de un lado u otro según el signo de $w \cdot x + b$.

**Clasificador de margen máximo.** Si las clases son **separables** con una recta, hay infinitas rectas posibles. Se elige la que **maximiza el margen**: la distancia entre la frontera y los puntos más cercanos de cada clase. Esos puntos más cercanos son los **vectores de soporte**: **solo ellos definen la frontera**, y eliminar cualquier otro punto no la cambiaría.

**Margen blando (*support vector classifier*).** Con clases que se solapan no existe una recta perfecta. Se permite que algunos puntos queden **dentro del margen o del lado equivocado**, midiendo cuánto se pasan con **variables de holgura** $\xi_i$ y controlando la tolerancia con un hiperparámetro:
* Más tolerancia: margen ancho, más puntos "violan", **mayor sesgo y menor varianza**.
* Menos tolerancia: margen angosto, ajuste ceñido a los datos, **menor sesgo y mayor varianza**.

> **Cuidado con la notación del parámetro $C$.** En el libro *An Introduction to Statistical Learning* $C$ es un "presupuesto" de violaciones (**más $C$ = más tolerancia**). En muchas librerías (por ejemplo, scikit-learn) $C$ es el **peso de la penalización** de las violaciones (**más $C$ = menos tolerancia**). Son opuestos: verifica siempre la definición de tu herramienta.

**El truco del kernel (*kernel trick*).** Para fronteras **no lineales**, se transforman los datos a un espacio de **mayor dimensión** donde sí sean separables linealmente.

*Ejemplo en 1D:* la clase $+$ en $x = -3$ y $x = 3$, y la clase $-$ en $x=-1,\,0,\,1$. No existe un único umbral que las separe. Pero si agregamos la variable $x^2$, los puntos pasan a ser $+$: $(-3, 9)$ y $(3, 9)$; $-$: $(-1, 1)$, $(0, 0)$, $(1, 1)$, y la **recta horizontal** $x^2 = 5$ las separa.

Lo notable: el algoritmo de la SVM solo necesita **productos internos** entre pares de puntos (Módulo 0.3). Una **función kernel** $K(x, x')$ calcula directamente el producto interno que habría en el espacio ampliado, **sin construir esas nuevas variables**, lo que lo hace eficiente incluso con espacios de dimensión enorme. El **Teorema de Mercer** da la condición para que una función $K$ sea un kernel válido (que corresponda a un producto interno en algún espacio).

* **Kernel polinómico**: $K(x,x') = (1 + \langle x, x' \rangle)^d$. El grado $d$ controla la flexibilidad.
* **Kernel radial (RBF)**: $K(x,x') = \exp(-\gamma\,\lVert x-x'\rVert^2)$. Mide **similitud local**: vale 1 si los puntos coinciden y decae hacia 0 al alejarse. Con $\gamma$ **grande**, la influencia de cada punto es muy local y la frontera se vuelve muy irregular (**sobreajuste**); con $\gamma$ **pequeño**, la frontera es suave.

Para más de dos clases, se combinan varias SVM binarias (una contra todas, o una contra una). Los hiperparámetros ($C$, $\gamma$, $d$) se eligen por validación cruzada.

### 6.7 Agrupamiento no supervisado: K-Means y clustering jerárquico

Complementa el agrupamiento por densidad del Módulo 4.5.

#### K-Means
Divide los datos en **$K$ grupos** (con $K$ fijado de antemano). Cada grupo se representa por su **centroide** (el promedio de sus puntos). **Algoritmo:**
1. Elegir $K$ centroides iniciales (al azar).
2. **Asignar** cada punto al centroide más cercano.
3. **Recalcular** cada centroide como el promedio de sus puntos.
4. Repetir 2 y 3 hasta que las asignaciones dejen de cambiar.

Busca minimizar la **suma de errores al cuadrado (SSE)**: la suma de los cuadrados de las distancias de cada punto a su centroide. (Recuerda el Módulo 0.4: **el promedio es el valor que minimiza la suma de cuadrados**, por eso el paso 3 usa el promedio.)

*Ejemplo en 1D, $K=2$:* puntos $1, 2, 4, 10, 11, 13$, con centroides iniciales $1$ y $10$.
* Asignación: $\{1,2,4\}$ al primero y $\{10,11,13\}$ al segundo.
* Nuevos centroides: $7/3 \approx 2.33$ y $34/3 \approx 11.33$.
* Se reasigna: nada cambia, el algoritmo termina. $\text{SSE} \approx 4.67 + 4.67 = 9.33$.

*Analogía:* ubicar $K$ estaciones de servicio en una ciudad para minimizar la distancia promedio que recorre cada conductor hasta la más cercana.

**Limitaciones:** hay que **elegir $K$** (el SSE siempre baja al aumentar $K$, así que no sirve minimizarlo; se usa el **método del codo**: graficar el SSE contra $K$ y buscar donde la mejora se aplana); el resultado depende de la **inicialización** (se prueban varios arranques y se elige el mejor); asume grupos **compactos y redondeados**; es sensible a **valores atípicos** y a la **escala** de las variables (estandarizar primero).

#### Otras distancias
Además de la euclídea, en dos puntos $(x_1,y_1)$ y $(x_2,y_2)$:
* **Manhattan** (*city block*): $|x_2-x_1| + |y_2-y_1|$. Es el recorrido por las calles de una cuadrícula.
* **Chebyshev**: $\max(|x_2-x_1|, |y_2-y_1|)$. Cuenta solo la mayor diferencia en una dimensión.

*Ejemplo:* entre $(1,2)$ y $(4,6)$: euclídea $5$, Manhattan $3+4=7$, Chebyshev $\max(3,4)=4$.

#### Variantes robustas: K-Medianas y K-Medoides (PAM)
Como el centroide de K-Means es un **promedio**, un solo valor extremo lo arrastra (un cliente multimillonario entre ingresos medios). Dos variantes lo evitan:
* **K-Medianas:** el centro es la **mediana** de cada variable y se usa la distancia Manhattan. Un atípico apenas lo mueve.
* **K-Medoides (PAM):** el centro debe ser un **dato real** de la muestra, el **medoide**. Permite presentar a un cliente concreto como representante del grupo y admite cualquier distancia (por ejemplo, coseno).

*Ejemplo:* en el grupo $\{1,2,3,4,100\}$ la media es $22$ (no se parece a ningún miembro), mientras que la mediana y el medoide valen $3$.

| | K-Means | K-Medianas | K-Medoides (PAM) |
| :--- | :--- | :--- | :--- |
| Centro | promedio (punto abstracto) | mediana (punto abstracto) | dato real |
| Distancia | euclídea | Manhattan | cualquiera |
| Sensibilidad a atípicos | alta | baja | muy baja |
| Costo | $O(nKp)$ por iteración | $O(nKp)$ por iteración | $O(K(n-K)^2)$ |
| Escala a bases grandes | muy bien | bien | mal |

El costo de PAM viene de que necesita la **matriz de distancias entre todos los pares** de puntos: con $10.000$ filas son $10^8$ distancias, y la memoria se agota mucho antes de llegar a bases grandes. Con $n$ grande hace falta submuestrear antes.

**Muchas columnas.** Con decenas o cientos de variables, las distancias entre puntos se vuelven casi iguales (maldición de la dimensionalidad, Módulo 4). La práctica habitual es **reducir primero** con PCA (continuas), ACM (categóricas) o FAMD (mixtas) y luego aplicar K-Means sobre los primeros ejes.

#### Clustering jerárquico y dendrogramas
No exige fijar $K$ de antemano. En la versión **aglomerativa**:
1. Cada punto empieza como su propio grupo.
2. Se **fusionan** los dos grupos más cercanos.
3. Se repite hasta quedar un único grupo.

El historial de fusiones se dibuja como un **dendrograma** (árbol). **Cortando** el dendrograma a cierta altura se obtiene el número de grupos que se desee.

Falta definir qué es "distancia entre grupos". Es el criterio de **enlace (*linkage*)**:
* **Simple (*single*)**: distancia **mínima** entre puntos de ambos grupos. Tiende a formar grupos alargados en "cadena".
* **Completo (*complete*)**: distancia **máxima**. Forma grupos compactos.
* **Promedio (*average*)**: promedio de **todas** las distancias entre pares.
* **Ward**: fusiona los grupos cuya unión **aumenta menos la varianza interna total**.

*Ejemplo con los mismos puntos:* tras fusionar $\{1,2,4\}$ y $\{10,11,13\}$, la distancia entre ambos grupos es **6** con enlace simple ($10-4$), **12** con enlace completo ($13-1$) y **9** con enlace promedio (promedio de las 9 distancias entre pares). La elección del enlace puede cambiar el resultado.

### 6.8 PCA en profundidad y análisis de correspondencias

Amplía el PCA del Módulo 6.4 con lo trabajado en la clase de aprendizaje no supervisado: por qué hace falta, cómo se interpreta, cuántos componentes conservar y qué hacer cuando las variables son categóricas.

#### Por qué hace falta: variabilidad y multicolinealidad
En la clase se mostró, con un archivo de departamentos (se quería explicar el precio), qué pasa cuando las columnas no aportan información, en cuatro pasos:
1. **Columnas constantes.** Si todos los departamentos tienen 10 años de antigüedad y el mismo código de tipo (99), el modelo da $R^2 = 0$, pendiente cero y se reduce al promedio del precio. **Sin variabilidad no hay información:** una columna que no cambia (varianza $=0$) no distingue entre observaciones.
2. **Constante más variable.** Al sumar la superficie en $m^2$ (que sí varía) a la antigüedad constante, $R^2 = 0.69$ y la antigüedad recibe coeficiente cero: agregarla es peso muerto.
3. **Variables idénticas.** Con dos predictoras iguales ($X_1 = X_2$) hay dependencia lineal perfecta: no se puede invertir la matriz y el programa anula una de las dos (coeficiente $0$).
4. **Variables casi iguales.** Con la superficie real y la superficie redondeada, $R^2 = 0.70$, pero la ecuación fue $\text{Precio} = 1741 - 150\times\text{Superficie real} + 152\times\text{Superficie redondeada}$: dice a la vez que más superficie *baja* el precio y que lo *sube*.

Esto es la **multicolinealidad** (Módulo 3; el VIF del Módulo 5.2 la mide). Los coeficientes se vuelven **inestables** (mover un solo dato puede cambiarles el signo), se pierde la capacidad de explicar ("¿esta variable ayuda o perjudica?") y, con 100 o 500 columnas, no se detecta mirando correlaciones de a pares, porque una columna puede ser combinación de otras tres o cuatro a la vez. El PCA ataca justamente este problema: reemplaza las columnas redundantes por pocas variables nuevas que no están correlacionadas.

> **Analogía del velocímetro trabado:** evaluar el rendimiento de un auto con un velocímetro clavado en 60 km/h, esté frenado en un semáforo o a fondo en la pista, no aporta ningún dato: lo que no cambia no informa.

#### De la dimensión observada a la dimensión verdadera
En datos reales se observan muchas columnas (500 en una aseguradora, 5000 en genética), pero muchas miden aspectos repetidos del mismo fenómeno. La **dimensión verdadera** (o latente) es el número reducido de ejes independientes que realmente gobiernan la variación. En muchos problemas prácticos, pasar de 500 variables a 10 o 20 componentes conserva más del 75-80 % de la información útil.

*Historia breve:*
* **Karl Pearson (1901):** primera versión, geométrica, buscando rectas y planos de mejor ajuste.
* **Charles Spearman (1904):** Análisis Factorial (AF), en psicología. Diferencia clave: el PCA busca explicar la **varianza total**; el AF, solo la **varianza compartida** (comunalidad) mediante factores latentes no observados.
* **Harold Hotelling (1933):** formulación matricial moderna, con valores y vectores propios; los componentes resultan ortogonales (no correlacionados).

**Intuición geométrica.** Una nube de puntos con variables muy correlacionadas no es redonda como una pelota de fútbol: está alargada en diagonal, como una pelota de rugby.
1. El **primer componente** ($CP_1$) es la recta que atraviesa la nube a lo largo de su lado más largo: la dirección de máxima varianza.
2. El **segundo componente** ($CP_2$) es un eje a $90^\circ$ del primero (ortogonal), que captura la mayor variabilidad restante.
3. En lugar de describir los puntos con los ejes originales (correlacionados), el PCA **rota el sistema de coordenadas** hasta alinearlo con los ejes naturales de la nube. En el sistema nuevo, $CP_1$ y $CP_2$ tienen correlación exactamente igual a cero.

> **Analogía de la sombra de la estatua:** para fotografiar una escultura 3D en una página plana, si la fotografías desde el costado correcto, la sombra conserva casi todos los detalles; desde un ángulo ciego solo ves un círculo sin forma. El PCA busca el ángulo de la mejor "sombra" de tus datos.

Cada componente $CP_k$ tiene asociado un **autovalor** (o valor propio) $\lambda_k$: la cantidad de varianza que captura. Se ordenan $\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_p > 0$, y su suma es la varianza total de los datos originales. La proporción de varianza que explica cada componente es:

$$\text{Varianza explicada por } CP_k = \frac{\lambda_k}{\lambda_1 + \lambda_2 + \dots + \lambda_p}$$

#### Cargas factoriales y círculo de correlaciones
Las **cargas factoriales** (*loadings*) son números entre $-1$ y $+1$ que miden la correlación simple entre cada variable original $X_j$ y un componente $CP_k$. Sirven para **ponerle nombre** a los componentes. *Ejemplo:* si con las notas de 5 materias el $CP_1$ tiene cargas altas y positivas ($+0.85$) en Matemática y en Física, se lo puede llamar "aptitud cuantitativa general".

En el **círculo de correlaciones** cada variable es una flecha:
* **Ángulo pequeño** ($\theta \approx 0^\circ$): variables con fuerte correlación positiva (avanzan juntas).
* **Ángulo recto** ($\theta = 90^\circ$): variables no correlacionadas.
* **Flechas opuestas** ($\theta = 180^\circ$): fuerte correlación negativa.
* **Flecha que llega al borde del círculo**: la variable está bien representada en ese plano.

#### Covarianza o correlación: ¿hay que estandarizar?
Un paso metodológico crítico es decidir sobre qué matriz se aplica el PCA:
* **Matriz de covarianza** ($S$, PCA no estandarizado): solo si todas las variables están en las **mismas unidades** y con escalas comparables.
* **Matriz de correlación** ($R$, PCA estandarizado): cuando las unidades son distintas (años, pesos, mmHg, miligramos frente a toneladas). Si no se estandariza, la variable con números más grandes (por ejemplo, ingresos de \$500.000) domina los primeros componentes por una cuestión de escala y no porque contenga más información.

Con la matriz de correlación, cada variable original aporta $1$ unidad de varianza, así que la varianza total es igual al número de variables $p$.

#### ¿Cuántos componentes retener?
Al pasar de $p$ variables a $p$ componentes hay que decidir con cuántos ($k<p$) quedarse y cuáles descartar como ruido:

| Criterio | Regla de decisión |
| :--- | :--- |
| **Varianza acumulada** | Retener los primeros $k$ componentes que acumulen entre el $70\,\%$ y el $80\,\%$ de la varianza total. |
| **Regla de Kaiser-Guttman** | Con la matriz de correlación, conservar solo los componentes con $\lambda > 1$: los que aportan más información que una variable original aislada. |
| **Gráfico de sedimentación** (*scree plot*) | Graficar los autovalores en orden decreciente y buscar el "codo", donde la curva se aplana; retener los componentes anteriores al codo. |
| **Análisis paralelo de Horn** | Simular (Monte Carlo) conjuntos de ruido aleatorio con las mismas dimensiones; retener solo los componentes reales cuyo autovalor supera al del ruido. Se lo considera el estándar de oro. |

Los criterios pueden no coincidir. *Ejemplo con los valores propios $2.8,\ 0.9,\ 0.2,\ 0.1$ del Módulo 6.4 (4 variables estandarizadas):* Kaiser retiene solo el primero ($2.8>1$); la varianza acumulada es $70\,\%$ con uno y $92.5\,\%$ con dos. Por eso conviene **triangular**: usar varios criterios y decidir con criterio.

#### Casos de la clase: pizzas y gorriones
* **Pizzas.** 71 muestras de masa de pizza analizadas en laboratorio, con 8 propiedades químicas continuas (pH, grasa, proteína, ceniza, sodio, calorías, entre otras). El $CP_1$ explicó el $65\,\%$ de la varianza y el $CP_2$ el $29\,\%$: entre los dos, el $94\,\%$. El espacio de 8 dimensiones era en realidad una nube casi plana de 2 dimensiones.
* **Gorriones.** 49 gorriones con 5 medidas morfológicas (largo total, extensión de las alas, largo de la quilla, entre otras), para estudiar su supervivencia tras una tormenta. El $CP_1$ explicó el $72\,\%$ (asociado al tamaño general del ave) y los dos primeros, el $83\,\%$ acumulado.

*Aplicando Kaiser a estas cifras (suponiendo matriz de correlación, con la varianza total igual a $p$ y los porcentajes redondeados):* en las pizzas, $\lambda_1 \approx 0.65 \times 8 = 5.2$ y $\lambda_2 \approx 0.29 \times 8 = 2.32$; el $6\,\%$ restante ($0.48$) se reparte entre 6 componentes, ninguno con $\lambda>1$: Kaiser retiene 2. En los gorriones, $\lambda_1 \approx 0.72 \times 5 = 3.6$ y $\lambda_2 \approx (0.83 - 0.72) \times 5 = 0.55 < 1$: Kaiser retendría 1, mientras que la regla del $80\,\%$ pide 2.

#### Valores atípicos y limitaciones
El PCA permite detectar dos tipos de observaciones atípicas:
* **Distancia de puntaje** (*score distance*): puntos dentro del plano de los componentes retenidos, pero muy alejados del centro (puntos de apalancamiento).
* **Distancia ortogonal** (*orthogonal distance*): puntos que se disparan en una dimensión perpendicular, la que el modelo descartó (atípicos reales).

Un solo atípico severo puede "tirar de la cuerda" y rotar indebidamente los ejes; conviene correr el análisis con y sin los atípicos para ver si los ejes son estables.

*Limitaciones y cuidados:*
* **Solo variables numéricas continuas.** Convertir una variable categórica (por ejemplo, estado civil $=1,2,3$) a números y meterla en un PCA es un error grave que distorsiona los resultados.
* **Solo estructuras lineales.** El PCA usa combinaciones lineales y rotaciones rígidas. Si los datos siguen formas curvas (como un pastel arrollado, el *Swiss roll*), falla y hace falta una variante como el **Kernel PCA**.
* **Explicar frente a predecir.** El PCA resuelve la multicolinealidad y permite modelos predictivos estables (regresión sobre componentes principales), pero para explicar el modelo a personas no técnicas hay que traducir las cargas de vuelta a las variables originales.

#### Análisis de correspondencias simples (ACS)
Cuando las variables no son números continuos sino **categóricas** (región del vino, plato elegido), se usa el **análisis de correspondencias**, el equivalente del PCA para este caso:

| | PCA | Análisis de correspondencias |
| :--- | :--- | :--- |
| Variables | Continuas | Categóricas |
| Datos | Tabla de observaciones por variables | Tabla de contingencia (cruce de filas y columnas) |
| Distancia | Euclídea | Chi-cuadrado ($\chi^2$) |
| Variabilidad | Varianza total | **Inercia total** |

**Regla de oro:** nunca hagas un análisis de correspondencias sin comprobar antes, con una prueba de $\chi^2$ sobre la tabla de contingencia (Módulo 2.4), que las variables están estadísticamente asociadas. *Demostración de la clase* (400 clientes que eligen vino y plato): en la tabla **sin asociación real**, todos los puntos del mapa se amontonaron en el centro, y interpretar distancias ahí era inventar historias sobre la nada misma; en la tabla **con asociación significativa**, platos y vinos se separaron con claridad (el tinto de Burdeos cerca de las carnes rojas, el blanco cerca de los pescados).

#### Análisis de correspondencias múltiple (ACM / MCA)
El análisis simple cruza **dos** variables categóricas en una tabla de doble entrada. Con tres o más (cuatro, diez, veinte) los datos forman un "cubo" de muchas dimensiones imposible de tabular, y se usa el **análisis de correspondencias múltiple (ACM)**, en inglés *MCA*.

* **Matriz de Burt.** Es una supertabla simétrica que cruza todas las categorías de todas las variables entre sí. En su diagonal cada variable se cruza **consigo misma**, y eso agrega inercia artificial.
* **Inercia inflada.** Por esa diagonal, los porcentajes brutos de los primeros ejes **subestiman** lo que realmente explican: puede parecer que la técnica sirve poco cuando sí funciona. Los programas corrigen esto con dos ajustes:
  * **Benzécri** reajusta los autovalores quitando el efecto de la diagonal.
  * **Greenacre** ajusta además el porcentaje acumulado usando el número real de variables y de categorías.

> **Analogía del micrófono con eco:** analizar la matriz de Burt sin corregir es cantar con el eco al máximo: tu propia voz rebotando tapa la melodía. Las correcciones actúan como un filtro que quita ese eco.

*Ejemplo didáctico* (cifras construidas para ilustrar, no son resultados de la clase). Con $Q=4$ variables y $J=12$ categorías en total, la inercia total de la tabla indicadora es $J/Q-1 = 2$ y el autovalor medio es $1/Q = 0.25$. Supongamos que solo dos autovalores superan $1/Q$: $\lambda_1 = 0.50$ y $\lambda_2 = 0.40$.
* **Sin corregir:** $0.50/2 = 25\,\%$ y $0.40/2 = 20\,\%$. Parece poco.
* **Benzécri:** $\lambda^{*}_k = \left(\dfrac{Q}{Q-1}\right)^{2} \left(\lambda_k - \dfrac{1}{Q}\right)^{2}$, es decir $\tfrac{16}{9}(0.25)^2 \approx 0.111$ y $\tfrac{16}{9}(0.15)^2 = 0.040$. Repartiendo entre los dos: $0.111/0.151 \approx 73.5\,\%$ y $26.5\,\%$. Los dos ejes explican casi todo lo que hay para explicar.

*Caso de la clase (vinos).* 200 vinos simulados con cuatro variables categóricas (región: Bordeaux, Loire, Burgundy, Rhône; color; cuerpo: ligero, medio, robusto; crianza en barrica sí/no), 12 categorías en total. En el mapa, el primer eje separa a **Loire con cuerpo ligero** de **Bordeaux con cuerpo robusto y color tinto**, y el segundo eje aísla a **Burgundy**.

*Caso de la clase (negocio).* Con 10.000 comercios minoristas de Tucumán con heladeras entregadas en comodato, el mapa separó dos perfiles: kioscos periféricos de bajo volumen con atrasos en el pago, y bares y restaurantes céntricos de alta rotación y pago al día. La decisión fue reubicar las heladeras desde los primeros hacia los segundos.

Aplicaciones clásicas: Bourdieu cartografió el "espacio social" francés (educación, consumo cultural, clase social). Software: `FactoMineR` en R y `prince` en Python.

#### Datos mixtos: FAMD
Las tablas reales suelen mezclar variables continuas (edad, ingreso) y categóricas (estado civil, nivel de riesgo). El PCA no puede tratar categorías, y el ACM obligaría a convertir las continuas en rangos y perder precisión. El **análisis factorial de datos mixtos (FAMD)** (Escofier, 1979, con el nombre francés AFDM) resuelve esto:
1. Las categóricas se pasan a columnas de $0$ y $1$ (*dummies*).
2. Se **equilibra** el peso de cada tipo: las continuas se estandarizan (cada una aporta $1$ de varianza) y las categóricas se ponderan para que una variable con muchas categorías no domine a una continua, ni al revés. Así, la inercia total es $p + J - Q$, con $p$ variables continuas y $Q$ categóricas que suman $J$ categorías.

*Ejemplo de la clase:* 100 vinos con $p=6$ continuas (pH, grado alcohólico, acidez, taninos, puntuación de calidad, intensidad de aroma) y $Q=2$ categóricas (suelo: volcánico o gravoso, 2 categorías; origen: Bordeaux, Burgundy o Loire, 3 categorías; $J=5$). Inercia total: $6 + 5 - 2 = 9$. El mapa permite ver juntas las categorías y las variables numéricas (por ejemplo, el suelo volcánico asociado a pH y grado alcohólico altos).

> **Advertencia:** no usar FAMD por comodidad si todas las variables son del mismo tipo. Con solo continuas corresponde el PCA; con solo categóricas, el ACM. La herramienta más compleja sobre datos simples introduce distorsiones innecesarias.

#### Mapa de decisión y lista de verificación
Para reducir dimensión:
* Si las variables son **continuas**: si tienen unidades o escalas distintas, PCA con la matriz de correlación ($R$); si no, con la de covarianza ($S$). En ambos casos, elegir los componentes con el gráfico de sedimentación, Kaiser ($\lambda>1$) y el análisis paralelo de Horn.
* Si las variables son **categóricas**: comprobar la asociación con $\chi^2$. Si **no** hay asociación significativa, no hacer el mapa. Si la hay, análisis de correspondencias simple (dos variables) o múltiple (tres o más), mirando los porcentajes corregidos.
* Si hay **ambos tipos**: FAMD.

Lista de verificación para el analista:
1. **Garantizar variabilidad:** comprobar que ninguna columna sea constante antes de modelar.
2. **Eliminar la multicolinealidad:** usar PCA o regresión sobre componentes cuando haya variables muy correlacionadas.
3. **Estandarizar** (matriz $R$) si las unidades de medida son heterogéneas.
4. **Validar la cantidad de ejes** triangulando codo, Kaiser y análisis paralelo.
5. **No forzar métodos:** PCA para continuas, análisis de correspondencias para categóricas asociadas, FAMD solo si hay mezcla.

### Autoevaluación del Módulo 6

1. ¿Supervisado o no supervisado? (a) predecir el precio de una vivienda; (b) segmentar clientes sin categorías previas; (c) detectar si un correo es spam.
2. El modelo A tiene error de entrenamiento 1 y de prueba 25; el B, 10 y 12. ¿Cuál tiene sobreajuste? ¿Cuál preferirías?
3. En validación cruzada de 5 particiones con $n=100$, ¿cuántos datos hay en cada entrenamiento y cuántos ajustes se hacen?
4. ¿Qué porcentaje de los datos queda fuera de una muestra bootstrap (para $n$ grande)? ¿Para qué sirve?
5. ¿Qué diferencia práctica hay entre Ridge y Lasso? ¿Cuál usarías para seleccionar variables?
6. En Ridge, ¿qué pasa cuando $\lambda = 0$ y cuando $\lambda \to \infty$?
7. Con valores propios $2.8,\ 0.9,\ 0.2,\ 0.1$, ¿qué porcentaje de varianza explican las dos primeras componentes principales? ¿Por qué se estandarizan las variables?
8. Promedias $B=100$ árboles, cada uno con varianza $4$, con correlación $\rho=0.5$. ¿Cuál es la varianza del promedio? ¿Y si fueran independientes?
9. ¿Por qué un bosque aleatorio considera solo $m<p$ variables en cada división?
10. En boosting con $y=100$, $\lambda = 0.1$ y árboles que predicen el residuo exacto, ¿cuánto vale el residuo tras 3 pasos?
11. ¿Qué diferencia hay entre bagging y boosting? ¿Cuál puede sobreajustar al aumentar el número de árboles?
12. ¿Qué son los vectores de soporte? ¿Qué pasa si se elimina un punto que no lo es?
13. ¿Para qué sirve el truco del kernel? ¿Qué pasa con $\gamma$ muy grande en un kernel RBF?
14. ¿Por qué no se elige $K$ minimizando el SSE en K-Means?
15. En clustering jerárquico, ¿cómo se ordenan las distancias entre grupos según enlace simple, promedio y completo?
16. En el grupo $\{1,2,3,4,100\}$, ¿cuánto valen la media y la mediana? ¿Qué centro usarían K-Means y K-Medianas, y cuál se ve afectado por el atípico?
17. ¿Por qué K-Medoides (PAM) no escala a bases con cientos de miles de filas, y K-Means sí?
18. ¿Por qué en el ACM el porcentaje de inercia explicado por los primeros ejes resulta engañosamente bajo si no se corrige?
19. ¿Qué técnica usarías para reducir dimensión en: (a) 10 variables continuas; (b) 6 variables categóricas; (c) 4 continuas y 3 categóricas?

### Respuestas del Módulo 6

1. (a) Supervisado (regresión); (b) no supervisado; (c) supervisado (clasificación).
2. El **A** tiene sobreajuste (gran brecha entre entrenamiento y prueba). Se prefiere el **B**, que tiene menor error de prueba (12 < 25).
3. 80 datos para entrenar (y 20 para validar) en cada uno de los 5 ajustes.
4. Alrededor del **37 %**. Los datos "fuera" sirven para la estimación OOB del error de prueba.
5. Ridge **encoge** todos los coeficientes sin llevarlos a cero; Lasso **lleva algunos a cero exacto**, haciendo **selección de variables**. Para seleccionar, Lasso.
6. $\lambda=0$: se obtiene OLS (sin penalización). $\lambda\to\infty$: todos los coeficientes tienden a 0 (el modelo se reduce a la constante).
7. $(2.8+0.9)/4 = 92.5\,\%$. Se estandarizan porque, si no, la variable de mayor escala dominaría la varianza total y las componentes reflejarían unidades de medida, no estructura.
8. $\rho\sigma^2 + (1-\rho)\sigma^2/B = 0.5\cdot4 + 0.5\cdot4/100 = 2.02$. Con independencia: $4/100 = 0.04$. La correlación limita cuánto ayuda promediar.
9. Para **reducir la correlación** entre árboles: si siempre pudieran usar la variable más fuerte, todos se parecerían y promediar ayudaría poco.
10. $100 \times 0.9^3 = 72.9$.
11. **Bagging:** árboles profundos, independientes, en paralelo; reduce varianza. **Boosting:** árboles pequeños, en secuencia, cada uno corrige al anterior. El **boosting** puede sobreajustar con demasiados árboles; el bagging no.
12. Son los puntos más cercanos a la frontera (sobre el margen o dentro de él); **solo ellos** determinan el hiperplano. Eliminar cualquier otro punto **no cambia** la solución.
13. Permite fronteras **no lineales** usando productos internos en un espacio ampliado sin construir explícitamente las variables nuevas. Con $\gamma$ muy grande, cada punto solo influye en su entorno inmediato: la frontera se vuelve muy irregular y **sobreajusta**.
14. Porque el SSE **siempre disminuye** al aumentar $K$ (con $K=n$ vale 0). Se busca el "codo" donde la mejora se aplana, o se usan otras medidas.
15. Enlace **simple $\le$ promedio $\le$ completo** (en el ejemplo: 6, 9 y 12).
16. Con $\{1,2,3,4,100\}$ la media es $22$ y la mediana es $3$. El centroide de K-Means (la media) queda arrastrado por el atípico y no representa a ningún punto del grupo; el de K-Medianas (la mediana) casi no se mueve. El medoide también sería $3$.
17. Porque el medoide debe ser un **dato real** y para hallarlo hay que comparar los puntos de a pares: se necesita la **matriz de distancias**, que crece con $n^2$ en memoria y tiempo. K-Means, en cambio, solo calcula distancias punto-centroide, $O(nKp)$ por iteración.
18. Porque la diagonal de la matriz de Burt cruza cada variable consigo misma y agrega inercia artificial: el porcentaje bruto subestima lo que cada eje explica. Se corrige con Benzécri o Greenacre.
19. (a) Todas continuas: PCA. (b) Todas categóricas: ACM (tras comprobar la asociación con $\chi^2$). (c) Mezcla de ambos tipos: FAMD.

---

## Módulo 7: Teoría Formal del Aprendizaje Automático

Los módulos anteriores enseñan **qué algoritmos usar**. Este explica **cuándo y por qué se puede confiar en ellos**: bajo qué condiciones matemáticas un algoritmo que ve unos pocos ejemplos puede garantizar buen desempeño con datos nuevos. Es el módulo más abstracto, pero muchas de sus ideas ya las usaste de forma intuitiva (sobreajuste, sesgo-varianza, regularización).

**Notación de este módulo** (es la habitual en los libros de teoría):
* $\mathcal{X}$: el conjunto de posibles entradas; $\mathcal{Y}$: el de posibles etiquetas (por ejemplo $\{0,1\}$).
* $\mathcal{D}$: la **distribución de probabilidad (desconocida)** que genera los datos del mundo real.
* $S$: la **muestra de entrenamiento**, de tamaño $m$ (aquí se usa $m$ en lugar de $n$), sacada de $\mathcal{D}$ de forma independiente.
* $h$: una **hipótesis** (un predictor concreto, una función $h:\mathcal{X}\to\mathcal{Y}$).
* $\mathcal{H}$: la **clase de hipótesis** (el conjunto de predictores entre los que el algoritmo puede elegir: todas las rectas, todos los árboles de profundidad 3…).
* $A(S)$ o $h_S$: la hipótesis que el algoritmo elige al ver $S$.

### 7.1 Aprender es inducir, no memorizar

Un algoritmo que **memoriza** guarda todos los datos de entrenamiento y responde bien si le preguntan por uno de ellos, pero **no tiene nada que decir de un dato nuevo**. Aprender de verdad es **inducir**: extraer reglas generales a partir de ejemplos para acertar en casos futuros no vistos.

*Ejemplo:* una "función memoria" que, si ve un punto del entrenamiento, devuelve su etiqueta, y en cualquier otro caso devuelve 0. Su error en el entrenamiento es **cero**, pero con datos nuevos se limita a decir "0" siempre.

### 7.2 Riesgo real, riesgo empírico y minimización del riesgo empírico (ERM)

El **error** de una hipótesis puede medirse de dos formas:

* **Riesgo real** (o error verdadero) $L_{\mathcal{D}}(h)$: la probabilidad de que $h$ **se equivoque en un dato nuevo** sacado de $\mathcal{D}$. Es lo que realmente nos importa, pero **no se puede calcular**, porque $\mathcal{D}$ es desconocida.
* **Riesgo empírico** $L_S(h)$: la **proporción de errores en la muestra de entrenamiento**:

$$L_S(h) = \frac{1}{m}\,\bigl|\{\, i : h(x_i) \neq y_i \,\}\bigr|$$

Es lo único que se puede medir (es el "error de entrenamiento" del Módulo 6.1).

**ERM (*Empirical Risk Minimization*)**: elegir la hipótesis de $\mathcal{H}$ con **menor riesgo empírico**. Es la estrategia más natural, **pero si $\mathcal{H}$ es demasiado flexible, falla**:

*Ejemplo:* los datos se distribuyen uniformemente en un cuadrado, y la etiqueta real es 1 dentro de un cuadrado interior que ocupa **la mitad** del área, y 0 afuera. La "función memoria" del 7.1 tiene $L_S = 0$ pero $L_{\mathcal{D}} = 1/2$: dice 0 en todos los puntos nuevos y se equivoca en toda la región interior. **El mejor ajuste en entrenamiento puede ser inútil en el mundo real.**

**Solución:** **restringir la clase $\mathcal{H}$** (por ejemplo, solo rectángulos, solo rectas, solo árboles de profundidad limitada). Esa restricción es una **suposición previa sobre cómo es el mundo**, el llamado **sesgo inductivo**, y es la que permite generalizar (ver 7.5).

#### Clase finita: cuántos datos hacen falta
Si $\mathcal{H}$ es **finita** (tiene $|\mathcal{H}|$ hipótesis) y existe en ella una hipótesis perfecta, la ERM funciona si el número de datos satisface:

$$m \;\ge\; \frac{\ln(|\mathcal{H}|/\delta)}{\epsilon}$$

Entonces, con probabilidad al menos $1-\delta$, el error real de la hipótesis elegida es como máximo $\epsilon$. (Qué son $\epsilon$ y $\delta$: ver 7.3.)

*Ejemplo:* $|\mathcal{H}| = 1000$, $\epsilon = 0.05$, $\delta = 0.01$: $m \ge \ln(1000/0.01)/0.05 = 11.51/0.05 \approx 231$ ejemplos. Dos observaciones: **más datos permiten error menor**, y una clase **más grande** requiere más datos, pero solo en forma **logarítmica**.

#### Pérdidas alternativas: la pérdida *hinge*
Contar errores (pérdida 0-1) es difícil de minimizar computacionalmente. Se reemplaza por una **pérdida convexa** que se puede minimizar con descenso por gradiente (Módulo 0.4). Para etiquetas $y\in\{-1,+1\}$ y un modelo lineal $\langle w,x\rangle$:

$$\ell_{\text{hinge}}(w,(x,y)) = \max\{0,\; 1 - y\langle w, x\rangle\}$$

Vale 0 si el punto está **bien clasificado con margen** ($y\langle w,x\rangle \ge 1$) y crece linealmente al empeorar. *Ejemplo con $y=+1$:* si $\langle w,x\rangle = 2$, pérdida $0$; si $0.5$, pérdida $0.5$; si $-1$ (clasificación errónea), pérdida $2$. Es la pérdida de las SVM (Módulo 6.6).

### 7.3 Aprendizaje PAC (*Probably Approximately Correct*)

El marco PAC define con precisión qué significa "es posible aprender". Dos tolerancias:

* **$\epsilon$ (exactitud):** cuánto error real toleramos. *Aproximadamente correcto*: el predictor no tiene que ser perfecto, sí tener error $\le \epsilon$.
* **$\delta$ (confianza):** la probabilidad de fallar que toleramos. *Probablemente*: puede tocar una muestra **mala por casualidad** (por ejemplo, con pocos puntos poco representativos), y no se puede evitar ese riesgo, solo acotarlo.

**Definición (versión intuitiva).** Una clase $\mathcal{H}$ es **PAC-aprendible** si existe un algoritmo y una función $m_{\mathcal{H}}(\epsilon,\delta)$ tales que, para **cualquier** $\epsilon,\delta \in (0,1)$ y **cualquier** distribución $\mathcal{D}$, si se le entregan al menos $m_{\mathcal{H}}(\epsilon,\delta)$ ejemplos, devuelve **con probabilidad $\ge 1-\delta$** una hipótesis con riesgo real $L_{\mathcal{D}}(h) \le \epsilon$.

Puntos clave: la garantía vale **sin importar cuál sea $\mathcal{D}$** (no hay que conocerla) y el número de datos depende de $\epsilon$, $\delta$ y de la clase, pero **no de $\mathcal{D}$**.

**Caso realizable vs. agnóstico:**
* **Realizable:** se supone que **en $\mathcal{H}$ existe** una hipótesis con error real 0 (la regla verdadera está en la clase).
* **PAC agnóstico:** versión **realista**, sin esa suposición. Los datos pueden tener ruido o la regla real puede no estar en $\mathcal{H}$. Entonces no se exige error $\le\epsilon$, sino error **cercano al mejor posible dentro de $\mathcal{H}$**: $L_{\mathcal{D}}(h) \le \min_{h'\in\mathcal{H}} L_{\mathcal{D}}(h') + \epsilon$. Para clase finita basta con $m \ge 2\ln(2|\mathcal{H}|/\delta)/\epsilon^2$ (con los números del ejemplo anterior, unos 9765 datos; exigir menos supuestos **cuesta más datos**).

**Descomposición del error (conexión con el sesgo-varianza del Módulo 6.2):**

$$L_{\mathcal{D}}(h_S) = \underbrace{\min_{h\in\mathcal{H}} L_{\mathcal{D}}(h)}_{\text{error de aproximación (sesgo)}} + \underbrace{\Bigl(L_{\mathcal{D}}(h_S) - \min_{h\in\mathcal{H}} L_{\mathcal{D}}(h)\Bigr)}_{\text{error de estimación (varianza)}}$$

* **Error de aproximación:** lo mejor que se puede lograr con la clase elegida. **Baja** si la clase es **más rica**.
* **Error de estimación:** cuánto nos alejamos de ese mejor por tener **pocos datos**. **Sube** si la clase es **más rica**.

Elegir $\mathcal{H}$ es **equilibrar** ambos. Es exactamente el mismo dilema que sesgo-varianza.

### 7.4 Dimensión VC y el Teorema Fundamental

Para clases **infinitas** (por ejemplo, todas las rectas del plano) $|\mathcal{H}|$ no sirve como medida de tamaño. La **dimensión de Vapnik-Chervonenkis (VC)** mide la **capacidad o flexibilidad** de una clase.

**Fragmentar (*shattering*).** Un conjunto de $k$ puntos es **fragmentado** por $\mathcal{H}$ si, para **cada una de las $2^k$ asignaciones posibles de etiquetas**, existe alguna hipótesis de $\mathcal{H}$ que la reproduce exactamente.

**Dimensión VC** de $\mathcal{H}$: el tamaño del **mayor conjunto de puntos** que $\mathcal{H}$ puede fragmentar (infinita si no hay tope). Para probar que $\text{VCdim}=d$ hay que (i) **exhibir un conjunto de $d$ puntos** fragmentado y (ii) **demostrar que ningún conjunto de $d+1$ puntos** lo puede ser.

**Ejemplos en una dimensión:**
* **Umbrales** ("1 si $x \ge a$, 0 en caso contrario"). Con **1 punto** se logran las dos etiquetas posibles. Con **2 puntos** $x_1 < x_2$, es imposible la combinación "$x_1$ positivo y $x_2$ negativo". $\Rightarrow \text{VCdim} = 1$.
* **Intervalos** ("1 si $a \le x \le b$"). Con 2 puntos se logran las 4 combinaciones. Con **3 puntos**, la combinación "positivo, negativo, positivo" es imposible (un intervalo es continuo). $\Rightarrow \text{VCdim} = 2$.

**Otros resultados:**
* **Rectas (semiplanos) en el plano:** VCdim $=3$. Tres puntos no alineados se fragmentan, pero **ningún conjunto de 4** (basta la configuración tipo "X": dos opuestos de una clase y dos opuestos de otra, no separables con una recta).
* **Clasificadores lineales en $\mathbb{R}^d$** (con constante): VCdim $= d+1$. Crece con el número de variables.
* **Clase finita:** VCdim $\le \log_2|\mathcal{H}|$.
* **Clase de todas las funciones sobre un dominio infinito** (como la función memoria): VCdim **infinita**.
* **Advertencia:** la dimensión VC **no es** el número de parámetros. Existe una familia con un solo parámetro ($\text{sign}(\sin(ax))$) con VC infinita.

> **Teorema Fundamental del Aprendizaje Estadístico** (clasificación binaria, pérdida 0-1): una clase $\mathcal{H}$ es PAC-aprendible **si y solo si su dimensión VC es finita**. Además, la ERM la aprende, y el número de datos necesarios crece en **proporción a $d$** (la dimensión VC), del orden de $d/\epsilon$ (realizable) o $d/\epsilon^2$ (agnóstico), más un término que depende de $\delta$.

**Interpretación práctica:** a mayor flexibilidad ($d$ alta), **más datos se necesitan** para garantizar generalización. Esto explica formalmente por qué conviene tener muchas más observaciones que variables, y por qué los modelos muy flexibles sobreajustan con pocos datos. (Los métodos modernos como las SVM con kernel RBF, de VC infinita, se justifican con otras garantías, basadas en el **margen** y en el **tamaño de los coeficientes**.)

### 7.5 Teorema *No-Free-Lunch* (sin almuerzo gratis)

**Enunciado informal:** **ningún algoritmo de aprendizaje es el mejor para todos los problemas.** Para cualquier algoritmo y cualquier tamaño de muestra menor a la mitad del dominio, existe una distribución y una regla verdadera (aprendible con error 0) para las cuales el algoritmo **falla con probabilidad apreciable** (el resultado formal: con probabilidad al menos $1/7$ el error real es al menos $1/8$).

*Intuición.* Te dan $2, 4, 6, 8$ y te piden el siguiente. Hay infinitas reglas compatibles con esos datos (pares ascendentes, un polinomio extraño que da 7…). Elegir "10" requiere una **preferencia previa por reglas simples**. Sin ella, los datos solos no deciden.

**Consecuencias:**
1. Aprender **exige** un **sesgo inductivo**: restringir la clase $\mathcal{H}$ o preferir ciertas hipótesis, basándose en **conocimiento del dominio**.
2. **No hay un "mejor modelo universal"**: un modelo funciona bien cuando su sesgo coincide con la estructura del problema. Por eso se comparan varios modelos con validación cruzada.
3. Es coherente con el 7.4: una clase de VC infinita (todas las funciones) no es aprendible.

### 7.6 Regularización, estabilidad y la navaja de Ockham

#### Minimización regularizada del riesgo (RLM)
En lugar de limitar rígidamente $\mathcal{H}$, se **penaliza la complejidad**: se elige la hipótesis que minimiza

$$L_S(h) + \text{penalización}(h)$$

El caso típico es **Ridge**: $L_S(w) + \lambda\lVert w\rVert^2$ (Módulo 6.4). La penalización **inclina la balanza** hacia modelos simples y **controla el sobreajuste**. $\lambda$ regula el equilibrio entre ajuste (sesgo) y simplicidad (varianza).

#### Estabilidad algorítmica
Un algoritmo es **estable** si **cambiar un solo dato de entrenamiento** altera poco su predicción. Resultado formal: **un algoritmo estable generaliza** (su riesgo real no puede ser mucho mayor que el empírico: la brecha esperada está acotada por el grado de inestabilidad). Intuitivamente: si el modelo no depende de ningún dato individual, no puede haber "memorizado" ninguno.

La **regularización produce estabilidad**: con $\lambda$ **grande** el modelo apenas cambia al modificar un dato (menos varianza), pero se ajusta peor (más sesgo). Otra vez el mismo equilibrio.

#### Navaja de Ockham y longitud de descripción mínima (MDL)
**Navaja de Ockham:** entre explicaciones con similar ajuste, **preferir la más simple**. La teoría lo vuelve preciso: si cada hipótesis se describe con una cantidad de bits $|h|$ (en algún lenguaje fijado de antemano), con probabilidad al menos $1-\delta$, **para todas** las hipótesis de la clase:

$$L_{\mathcal{D}}(h) \;\le\; L_S(h) + \sqrt{\frac{|h| + \ln(2/\delta)}{2m}}$$

*Ejemplo numérico* ($m=1000$, $\delta=0.05$): una hipótesis de **50 bits** tiene un margen de error de $\sqrt{(50+3.69)/2000} \approx 0.16$; una de **500 bits**, de $\sqrt{(500+3.69)/2000} \approx 0.50$. Con igual error en entrenamiento, **la más simple tiene una garantía mucho mejor**.

**Principio MDL:** elegir la hipótesis que minimiza (error en entrenamiento) + (término de complejidad). Es otra forma de **regularización**.

*Salvedad:* la longitud de descripción depende del **lenguaje** elegido; no existe una noción absoluta de "simplicidad". Esa elección es otra forma de sesgo inductivo.

### 7.7 Cómo se conecta todo

| Concepto de la teoría | Lo que ya conoces en la práctica |
| :--- | :--- |
| Error de aproximación vs. estimación | Sesgo vs. varianza (6.2) |
| ERM con clase muy rica | Sobreajuste (4.3, 6.2) |
| Riesgo real | Error de prueba, que se estima con validación cruzada u OOB (6.3, 6.5) |
| Dimensión VC | Flexibilidad del modelo; necesidad de más datos |
| Regularización / estabilidad | Ridge, Lasso, poda de árboles (4.3, 6.4) |
| Pérdida hinge | SVM (6.6) |
| *No-Free-Lunch* | Probar varios modelos; usar conocimiento del dominio |
| Navaja de Ockham / MDL | Preferir modelos más simples a igual desempeño |

### Autoevaluación del Módulo 7

1. Define riesgo real y riesgo empírico. ¿Cuál se puede calcular y cuál interesa realmente?
2. ¿Por qué la ERM sobre una clase muy flexible puede fallar? Da un ejemplo.
3. Con una clase finita de $10^6$ hipótesis, $\epsilon=0.1$ y $\delta=0.05$, ¿cuántos datos bastan en el caso realizable?
4. En PAC, ¿qué miden $\epsilon$ y $\delta$ y por qué hace falta $\delta$?
5. Demuestra que la dimensión VC de los intervalos en la recta es 2.
6. ¿Por qué la dimensión VC de las rectas en el plano no es 4?
7. Enuncia el Teorema Fundamental del Aprendizaje Estadístico.
8. Calcula la pérdida hinge ($y=+1$) para $\langle w,x\rangle = 3,\ 0.2,\ -0.5$. ¿Por qué se prefiere a la pérdida 0-1?
9. ¿Qué dice el teorema No-Free-Lunch y qué implica en la práctica?
10. Explica el error de aproximación y el de estimación. ¿Qué pasa con cada uno al ampliar la clase $\mathcal{H}$?
11. Con la cota de Ockham, ¿qué margen se obtiene para una hipótesis de 100 bits con $m=2000$ y $\delta=0.05$?
12. ¿Por qué la regularización aumenta la estabilidad y qué cuesta?

### Respuestas del Módulo 7

1. **Real** $L_{\mathcal{D}}(h)$: probabilidad de error en datos nuevos de $\mathcal{D}$ (no calculable, es lo que interesa). **Empírico** $L_S(h)$: proporción de errores en la muestra de entrenamiento (calculable).
2. Porque puede elegir una hipótesis que **memorice** el entrenamiento ($L_S = 0$) y falle fuera de él. Ejemplo: la "función memoria", con $L_{\mathcal{D}} = 1/2$ en el ejemplo del cuadrado.
3. $m \ge \ln(10^6/0.05)/0.1 = \ln(2\times10^7)/0.1 \approx 16.81/0.1 \approx 169$ datos.
4. $\epsilon$: error real tolerado. $\delta$: probabilidad de fallar tolerada. Hace falta $\delta$ porque la muestra puede ser **poco representativa por azar**, y eso no se puede eliminar, solo acotar.
5. **Fragmenta 2 puntos:** con $x_1<x_2$, se obtienen $(+,+)$ con un intervalo que cubre ambos; $(+,-)$ y $(-,+)$ con un intervalo que cubre solo uno; $(-,-)$ con un intervalo que no cubre ninguno. **No fragmenta 3:** con $x_1<x_2<x_3$ no se logra $(+,-,+)$, pues un intervalo que contiene $x_1$ y $x_3$ contiene a $x_2$. Entonces VCdim $=2$.
6. Hay 4 puntos (por ejemplo, en las esquinas de un cuadrado) con la combinación de etiquetas "diagonales iguales" (tipo XOR) que ninguna recta puede separar. La dimensión VC es 3.
7. Para clasificación binaria con pérdida 0-1, una clase es PAC-aprendible (y agnóstica-PAC) **si y solo si su dimensión VC es finita**; en ese caso la ERM la aprende y los datos necesarios crecen con $d$.
8. $\max\{0, 1-3\} = 0$; $\max\{0,1-0.2\} = 0.8$; $\max\{0,1+0.5\} = 1.5$. Se prefiere porque es **convexa** y se puede minimizar eficientemente (descenso por gradiente), mientras que minimizar la pérdida 0-1 es computacionalmente difícil.
9. **No existe un algoritmo universalmente mejor**: para cualquiera hay problemas donde falla. En la práctica: hace falta un **sesgo inductivo** acorde al problema, y conviene **comparar modelos** con validación cruzada.
10. **Aproximación:** el mejor error posible dentro de $\mathcal{H}$ (sesgo); **estimación:** la distancia entre lo que logramos con los datos y ese mejor (varianza). Al **ampliar $\mathcal{H}$**: el de aproximación **baja** y el de estimación **sube**.
11. $\sqrt{(100 + \ln 40)/(2\cdot2000)} = \sqrt{103.69/4000} \approx 0.16$.
12. Con penalización fuerte, **cambiar un dato casi no mueve el modelo** (menos varianza, no puede "memorizar"). El costo es **más sesgo**: el modelo se ajusta peor a los datos de entrenamiento.

---

## Glosario

Los números entre paréntesis indican el módulo donde se explica cada término.

* **AdaBoost**: boosting que da más peso a lo mal clasificado (6.5).
* **AUC**: área bajo la curva ROC; 0.5 = azar, 1 = perfecto (5.2).
* **Análisis de correspondencias**: equivalente del PCA para variables categóricas; trabaja con tablas de contingencia y distancia $\chi^2$ (6.8).
* **Análisis paralelo de Horn**: criterio que retiene solo los componentes cuyo autovalor supera al de datos de ruido simulados (6.8).
* **Análisis de correspondencias múltiple (ACM / MCA)**: extensión del análisis de correspondencias a tres o más variables categóricas (6.8).
* **Atributo**: variable o columna de los datos (4).
* **Autovalor (valor propio)**: varianza que captura un componente principal (6.4, 6.8).
* **Bagging**: promediar modelos entrenados en muestras bootstrap (6.5).
* **Bayes, teorema de**: invierte una probabilidad condicional (0.2).
* **BLUE**: mejor estimador lineal insesgado; propiedad de OLS bajo Gauss-Markov (3.6).
* **Bootstrap**: muestra de $n$ datos extraída con reemplazo (6.3).
* **C (parámetro de regularización)**: inverso de la fuerza de regularización en la regresión logística; C chico = más regularización (5.2).
* **Calibración**: las probabilidades predichas coinciden con las frecuencias observadas (5.2).
* ***Ceteris paribus***: "manteniendo todo lo demás constante" (3.2).
* **Carga factorial (*loading*)**: correlación entre una variable original y un componente principal (6.8).
* **Chi-cuadrado ($\chi^2$)**: distribución de una suma de normales al cuadrado (2.4).
* **Clasificación**: predecir una categoría (4.3).
* ***Clustering***: agrupar registros por similitud, sin etiquetas (4.5, 6.7).
* **Colinealidad**: una variable es combinación de otras (0.3, 3.6).
* **Confianza (reglas de asociación)**: $P(B \mid A)$ en una regla $A\rightarrow B$ (4.4).
* **Contrafactual**: lo que habría pasado sin el tratamiento (3.2).
* **Correlación serial**: error correlacionado entre períodos (3.7).
* **Covarianza, matriz de**: tabla de varianzas y covarianzas entre variables (0.3).
* **Deriva de datos / de concepto (*drift*)**: cambia la distribución de las entradas / la relación entre entradas y respuesta (6.5).
* **Dendrograma**: árbol de fusiones del clustering jerárquico (6.7).
* **DBSCAN**: agrupamiento por densidad (4.5).
* **Desviación típica**: raíz de la varianza (2.2).
* **DID (diferencias en diferencias)**: estimador de impacto con grupo de control (3.8).
* **Dimensión VC**: mayor conjunto de puntos que una clase puede fragmentar (7.4).
* **Distribución**: qué valores toma una variable aleatoria y con qué probabilidad (2.4).
* **Efectos fijos / aleatorios**: modelos de panel (3.8).
* **Endogeneidad**: variable explicativa correlacionada con el error (3.7).
* **Entropía**: medida de impureza o incertidumbre de un nodo (4.3).
* **Error de prueba / de entrenamiento**: error con datos nuevos / con los datos usados para ajustar (6.1).
* **Error estándar**: desviación típica de un estimador (2.5).
* **Error Tipo I / Tipo II**: rechazar $H_0$ verdadera / no rechazar $H_0$ falsa (2.7).
* **ERM**: minimizar el riesgo empírico (7.2).
* **Especificidad**: de los negativos reales, proporción identificada como negativa, $VN/(VN+FP)$ (4.3).
* **Esperanza**: promedio ponderado por probabilidad (0.2).
* **Estadístico**: número calculado desde la muestra (2.1).
* **Estimador**: regla para estimar un parámetro (2.6).
* **$F$ de Fisher**: cociente de dos $\chi^2$ (2.4).
* **Forward / backward / stepwise**: selección de variables agregando, quitando o ambas cosas paso a paso (5.2).
* **Función de pérdida**: medida del costo de un error (6.5, 7.2).
* **Gini, índice**: impureza de un nodo (4.3).
* **Gradient boosting**: boosting con árboles ajustados al gradiente de la pérdida (6.5).
* **Heterocedasticidad**: varianza del error no constante (3.7).
* **Gráfico de sedimentación (*scree plot*)**: autovalores en orden decreciente; se busca el codo (6.8).
* **FAMD (análisis factorial de datos mixtos)**: reducción de dimensión para tablas con variables continuas y categóricas a la vez (6.8).
* **Hiperparámetro**: parámetro que se fija antes de entrenar (6.3).
* **Hiperplano**: generalización de la recta/plano a $k$ dimensiones (0.3, 6.6).
* **Homocedasticidad**: varianza del error constante (3.6).
* **Hosmer–Lemeshow, test de**: compara casos observados y esperados por grupos para evaluar la calibración (5.2).
* **Inercia**: variabilidad total en el análisis de correspondencias (6.8).
* **Intervalo de confianza**: rango construido con un método que acierta con cierta frecuencia (2.6).
* **Kaiser-Guttman, regla de**: retener los componentes con autovalor mayor que 1 (6.8).
* **Kernel**: función que calcula productos internos en un espacio ampliado (6.6).
* **K-Means**: agrupamiento por centroides (6.7).
* **K-Medianas / K-Medoides (PAM)**: variantes robustas de K-Means; el centro es la mediana / un dato real (el medoide) (6.7).
* **Lasso**: regularización $L_1$ con selección de variables (6.4).
* **LDA / QDA**: análisis discriminante lineal / cuadrático (5.4).
* **Lift**: confianza dividida por el soporte del consecuente (4.4).
* **Logit**: logaritmo de los odds (5.2).
* **Margen**: distancia entre la frontera y los puntos más cercanos (6.6).
* **Matriz de Burt**: tabla simétrica que cruza todas las categorías de todas las variables; base del ACM (6.8).
* **Matriz de confusión**: aciertos y errores por clase (4.3).
* **Media / mediana / moda**: promedio / valor central / valor más repetido (2.2).
* **MLE (máxima verosimilitud)**: parámetros que hacen más plausibles los datos (2.6).
* **Naive Bayes**: clasificador con independencia entre variables dado la clase (5.4).
* **Normal**: la campana de Gauss (2.4).
* ***Odds* / *odds ratio***: $p/(1-p)$ / factor por el que se multiplican los odds (5.2).
* **OLS**: mínimos cuadrados ordinarios (3.3).
* **OOB (*out-of-bag*)**: datos que un árbol no vio, usados para evaluar (6.5).
* **PAC**: probablemente aproximadamente correcto (7.3).
* **Parámetro**: valor poblacional desconocido (2.1).
* **PCA**: componentes principales (6.4).
* **Poisson**: conteo de eventos raros (2.4).
* **Potencia**: probabilidad de detectar un efecto real, $1-\beta$ (2.7).
* **Precisión / *recall***: aciertos entre los predichos positivos / entre los positivos reales (4.3).
* **Probit**: modelo binario con error Normal (5.3).
* **P-valor**: probabilidad, bajo $H_0$, de un resultado tan extremo o más (2.7).
* **$R^2$**: proporción de variación explicada (3.3).
* ***Random forest***: bosque aleatorio de árboles descorrelacionados (6.5).
* **Regularización**: penalizar la complejidad (6.4, 7.6).
* **Residuo**: $y-\hat{y}$ (3.3).
* **Ridge**: regularización $L_2$ (6.4).
* **SHAP**: explica la contribución de cada variable a la predicción de un individuo, para cualquier modelo (6.5).
* **Sesgo (*bias*)**: error por un modelo demasiado simple (6.2).
* **Sesgo inductivo**: suposición previa que permite generalizar (7.2, 7.5).
* **Sobreajuste / subajuste**: memorizar el ruido / no captar el patrón (6.2).
* **Soporte**: frecuencia de un conjunto de ítems (4.4).
* **SVM**: máquina de vectores de soporte (6.6).
* **$t$ de Student**: Normal con colas pesadas (2.4).
* **TLC**: las medias muestrales se aproximan a una Normal (2.5).
* **Umbral (*threshold*)**: probabilidad a partir de la cual se predice la clase positiva; mueve precisión y recall (4.3, 5.2).
* **Validación cruzada**: estimar el error de prueba reutilizando los datos (6.3).
* **Variable instrumental**: instrumento que mueve a $x$ sin correlacionarse con $u$ (3.7).
* **Variable latente**: magnitud no observada que determina la respuesta binaria (5.3).
* **Varianza**: promedio de desviaciones al cuadrado / sensibilidad del modelo a los datos (2.2, 6.2).
* **VIF**: factor de inflación de la varianza, $1/(1-R_j^2)$; mide multicolinealidad (5.2).

---

## Cuadro síntesis y guía de uso

### La escalera del conocimiento

```
+-------------------------------------------------------------------------------+
|                      ESCALERA INTEGRAL DEL CONOCIMIENTO                       |
|                                                                               |
|  [7. Teoría PAC / Dimensión VC ] --> Garantías formales de generalización     |
|  [6. Aprendizaje Estadístico   ] --> Sesgo-varianza, ensambles, SVM, K-Means  |
|  [5. Elección Binaria / Logit  ] --> Odds ratios, Probit, LDA, Naive Bayes    |
|  [4. Minería de Datos / KDD    ] --> Árboles, Apriori, DBSCAN                 |
|  [3. Econometría / Panel       ] --> Causalidad, Gauss-Markov, FE/RE/DID, IV  |
|  [2. Inferencia Estadística    ] --> Distribuciones, TLC, intervalos, p-valor |
|  [1. Mente del Aprendiz        ] --> Recalibración metacognitiva              |
|  [0. Matemática Mínima         ] --> Probabilidad, álgebra, cálculo, logs     |
+-------------------------------------------------------------------------------+
```

### ¿Qué técnica uso para qué problema?

| Quiero... | Técnicas | Módulo |
| :--- | :--- | :--- |
| Estimar un efecto **causal** | Regresión múltiple con controles, IV, panel (FE), DID | 3 |
| Predecir un **número** | Regresión, Ridge/Lasso, bosques, boosting | 3, 6 |
| Predecir una **categoría** | Logit, LDA/QDA, Naive Bayes, árboles, SVM, ensambles | 4, 5, 6 |
| Interpretar con **odds ratios** | Regresión logística | 5 |
| Encontrar **qué se compra junto** | Apriori (soporte, confianza, lift) | 4 |
| **Agrupar** sin etiquetas | K-Means, jerárquico, DBSCAN | 4, 6 |
| **Reducir dimensión** | PCA (variables numéricas), análisis de correspondencias (categóricas), Lasso | 6 |
| Elegir hiperparámetros / estimar error | Validación cruzada, OOB | 6 |

### Los errores más comunes (y cómo evitarlos)

1. Confundir **correlación con causalidad** (3.2).
2. Interpretar el **intervalo de confianza** como "probabilidad de que $\mu$ esté adentro" (2.6).
3. Interpretar el **p-valor** como la probabilidad de que $H_0$ sea cierta, o "aceptar" $H_0$ (2.7).
4. Olvidar el **tamaño del efecto**: significativo no es relevante (2.7).
5. Creer que un **$R^2$ alto** implica causalidad (3.3).
6. Ignorar el **sesgo por variable omitida** y la **endogeneidad** (3.4, 3.7).
7. Evaluar un modelo **con los mismos datos con que se entrenó** (4.3, 6.1).
8. Usar la **exactitud** con clases desbalanceadas (4.3).
9. Interpretar un **odds ratio como riesgo relativo** (5.2).
10. No **estandarizar** antes de Ridge, Lasso, PCA, K-Means o SVM (4.2, 6.4).
11. Creer que hay un **"mejor algoritmo"** universal (7.5).

### Cómo estudiar con esta guía

1. **Primero el Módulo 0 y el 2.** Si no dominas probabilidad, medias y p-valores, todo lo demás se tambalea.
2. En cada módulo, **intenta las autoevaluaciones sin mirar** las respuestas. Lo que falles, relee. Es la aplicación directa del Módulo 1 (pasar de 2OI a 1OI).
3. **Rehaz a mano** al menos un ejemplo numérico por módulo.
4. Si estudias con poco tiempo, prioriza según tu posgrado: para ciencia de datos aplicada, **2, 5 y 6** son el núcleo; **3** si trabajas con causalidad o evaluación de políticas; **7** como marco conceptual (basta con entender sesgo-varianza, ERM, VC y No-Free-Lunch a nivel intuitivo).
5. Esta guía **resume**: para profundizar, usa los libros como referencia y para consultar demostraciones.
