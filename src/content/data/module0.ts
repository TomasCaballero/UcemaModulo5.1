import type { Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 0. Los bloques `extra` (ejemplos
// cotidianos o clásicos), `deepDive` (ampliaciones) y `recall` (repasos de lo previo) no son de la
// guía y se muestran rotulados; las cifras de las ampliaciones se verifican en tools/expansion-numbers.ts.
const t = String.raw

export const module0Sections: Section[] = [
  {
    id: '0.1',
    moduleId: 0,
    title: 'Notación básica',
    blocks: [
      { type: 'paragraph', text: 'Antes de las ideas, el "alfabeto" que verás en todas partes:' },
      {
        type: 'table',
        headers: ['Símbolo', 'Se lee', 'Significado', 'Ejemplo'],
        rows: [
          [t`$x_i$`, '"x sub i"', 'El i-ésimo valor de una lista', t`En la lista $(4, 7, 9)$: $x_1 = 4$, $x_2 = 7$, $x_3 = 9$`],
          [t`$n$`, '"n"', 'Cantidad de datos', t`$n = 3$ en la lista anterior`],
          [t`$\sum$`, '"sumatoria"', 'Sumar una serie de términos', t`$\sum_{i=1}^{3} x_i = 4 + 7 + 9 = 20$`],
          [t`$\bar{x}$`, '"x barra"', 'El promedio (media) de la lista', t`$\bar{x} = 20/3 \approx 6.67$`],
          [
            t`$\hat{y}$`,
            '"y sombrero"',
            'Un valor **predicho o estimado** (no el real)',
            t`Si el real es $y=10$ y el modelo dice 9.2, entonces $\hat{y}=9.2$`,
          ],
          [t`$|x|$`, '"valor absoluto"', 'La magnitud sin signo', t`$|-5| = 5$`],
          [t`$\approx$`, '"aproximadamente"', 'Casi igual', t`$\pi \approx 3.14$`],
          [
            t`$\epsilon, u, e$`,
            '"épsilon", "u", "e"',
            'Letras que se usan para el **error** (lo que el modelo no explica)',
            '—',
          ],
          [
            t`$\beta, \theta, \mu, \sigma$`,
            'letras griegas',
            'Cantidades **desconocidas** que queremos estimar (parámetros)',
            '—',
          ],
        ],
      },
      {
        type: 'intuition',
        title: 'Los símbolos como las etiquetas de un ticket de compras',
        text: t`**Cada símbolo es una abreviatura.** Pensá en el ticket del supermercado. Cada renglón tiene un precio, y $x_i$ es solo una forma corta de decir "el precio que está en el lugar $i$ de la lista". Si la lista es $(4, 7, 9)$, entonces $x_1 = 4$, $x_2 = 7$ y $x_3 = 9$. La letra $n$ cuenta cuántos renglones hay: acá, $n = 3$.

**Sumar y promediar.** El símbolo $\sum$ (sumatoria) es la instrucción "sumá todos los renglones": $4 + 7 + 9 = 20$. Y $\bar{x}$ ("x barra") es el promedio: el total repartido en partes iguales, $20/3 \approx 6.67$.

**El sombrero es una adivinanza.** El pronóstico del clima dice una temperatura y después llega la real. Cuando una letra lleva sombrero, como $\hat{y}$, es lo que el modelo **dijo**, no lo que **pasó**. Si el valor real fue $y = 10$ y el modelo dijo $9.2$, entonces $\hat{y} = 9.2$. La diferencia entre las dos es el error.`,
      },
      {
        type: 'paragraph',
        text: t`**Regla útil:** letra latina ($x$, $y$) suele ser un dato observado; letra griega ($\beta$, $\mu$) suele ser algo desconocido de la realidad; letra con sombrero ($\hat{\beta}$) es nuestra **estimación** de esa cantidad desconocida.`,
      },
      {
        type: 'deepDive',
        title: 'Cómo leer una fórmula sin asustarse',
        text: t`Una fórmula es una **receta escrita en abreviaturas**. El truco es leerla de adentro hacia afuera y traducir cada símbolo en voz alta. Tomemos la del promedio:

$\bar{x} = \dfrac{1}{n}\sum_{i=1}^{n} x_i$

**Adentro:** $x_i$, "el dato número $i$". **Alrededor:** $\sum_{i=1}^{n}$, "repetí para $i = 1, 2, \dots, n$ y sumá todo". **Afuera:** $\dfrac{1}{n}$, "dividí por la cantidad de datos". En voz alta: *sumá todos los datos y dividí por cuántos son*. Con la lista $(4, 7, 9)$: $(4 + 7 + 9)/3 = 20/3 \approx 6.67$.

El índice $i$ es solo un **contador**: no significa nada por sí mismo, y podría llamarse $j$ o $k$ sin cambiar el resultado.

**Dos reglas que vas a usar sin darte cuenta.** Un número que multiplica a todos los términos puede salir afuera de la suma: $\sum 2x_i = 2\sum x_i$, o sea $8 + 14 + 18 = 2 \times 20 = 40$. Y la suma de una resta es la resta de las sumas: $\sum (x_i - \bar{x}) = \sum x_i - n\bar{x} = 20 - 3 \times \tfrac{20}{3} = 0$. Esa última cuenta dice algo importante: **las distancias de los datos a su promedio siempre suman cero**. Los que quedan arriba compensan exactamente a los que quedan abajo, y por eso el promedio es el "punto de equilibrio".`,
        sources: ['Notación estándar; ver Wooldridge, *Introducción a la econometría*, apéndice A (el operador sumatoria)'],
      },
    ],
  },
  {
    id: '0.2',
    moduleId: 0,
    title: 'Probabilidad',
    blocks: [
      { type: 'subheading', text: 'Lo básico' },
      {
        type: 'list',
        items: [
          t`**Experimento**: algo cuyo resultado es incierto (tirar un dado).`,
          t`**Evento**: un conjunto de resultados que nos interesa (que salga par: $\{2, 4, 6\}$).`,
          t`**Probabilidad** $P(A)$: un número entre 0 (imposible) y 1 (seguro) que mide cuán probable es el evento $A$. Si todos los resultados son igual de probables:`,
        ],
      },
      { type: 'formula', latex: t`P(A) = \frac{\text{casos favorables}}{\text{casos totales}}` },
      { type: 'paragraph', text: t`*Ejemplo:* $P(\text{par}) = 3/6 = 0.5$.` },
      {
        type: 'list',
        items: [
          t`**Complemento**: la probabilidad de que $A$ **no** ocurra es $1 - P(A)$. Si llover tiene probabilidad 0.3, no llover tiene 0.7.`,
        ],
      },
      { type: 'miniCheck', questionIds: ['m0-q02'] },
      { type: 'subheading', text: 'Independencia' },
      {
        type: 'paragraph',
        text: t`Dos eventos son **independientes** si saber que uno ocurrió no cambia la probabilidad del otro. Dos tiradas de moneda son independientes. En ese caso la probabilidad de que ocurran ambos se multiplica:`,
      },
      { type: 'formula', latex: t`P(A \text{ y } B) = P(A) \cdot P(B)` },
      { type: 'paragraph', text: t`*Ejemplo:* dos caras seguidas: $0.5 \times 0.5 = 0.25$.` },
      {
        type: 'intuition',
        title: 'Independientes: cuando una cosa no influye en la otra',
        text: t`**Independientes quiere decir que no se influyen.** Una moneda no se acuerda de lo que salió antes. Para pedir que pasen **las dos cosas**, se multiplican las chances: dos caras seguidas es $0.5 \times 0.5 = 0.25$. Se multiplica porque cada vez que se cumple la primera, solo una parte de esos casos cumple también la segunda.`,
      },
      {
        type: 'extra',
        text: t`Si la probabilidad de que llueva el sábado es 0.3 y la de que llueva el domingo es 0.3, y suponemos que un día no influye en el otro, la probabilidad de que llueva los dos días es $0.3 \times 0.3 = 0.09$ (9 %). En la realidad el clima de dos días seguidos no suele ser independiente: multiplicar solo vale si de verdad lo son.`,
      },
      {
        type: 'deepDive',
        title: 'Independientes no es lo mismo que excluyentes',
        text: t`Es una confusión muy común, y las dos ideas son casi opuestas.

**Excluyentes** quiere decir que no pueden pasar juntos: en una sola tirada de un dado, "sale 1" y "sale 2" son excluyentes. **Independientes** quiere decir que uno no cambia la chance del otro. Y dos eventos excluyentes son **muy dependientes**: si sabés que salió 1, la probabilidad de que haya salido 2 pasa de $1/6$ a $0$. Si fueran independientes, la probabilidad de ambos sería $\tfrac{1}{6} \times \tfrac{1}{6} = \tfrac{1}{36}$, pero en realidad es $0$.

**La falacia del jugador.** Si salieron cinco caras seguidas, ¿"tiene que" salir cruz? No: la moneda no tiene memoria, y la sexta tirada sigue teniendo probabilidad $0.5$. Lo que sí es raro es la racha completa: seis caras seguidas, vistas antes de empezar, tienen probabilidad $0.5^6 \approx 0.016$. Pero una vez que ya salieron cinco, solo queda en juego la última tirada.`,
        sources: ['Ross, *A First Course in Probability*, cap. 3 (independencia)'],
      },
      { type: 'subheading', text: 'Probabilidad condicional' },
      {
        type: 'paragraph',
        text: t`$P(A \mid B)$ se lee "probabilidad de $A$ **dado que** ocurrió $B$". Es la probabilidad de $A$ una vez que sabemos que $B$ pasó:`,
      },
      { type: 'formula', latex: t`P(A \mid B) = \frac{P(A \text{ y } B)}{P(B)}` },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* en una baraja española de 40 cartas, ¿cuál es la probabilidad de que una carta sea un as, sabiendo que es de oros? Hay 10 cartas de oros y 1 es el as: $P = 1/10$. (Sin saber el palo sería $4/40 = 1/10$: el palo y el número son independientes en la baraja.)`,
      },
      {
        type: 'intuition',
        title: 'Condicional: cuando ya sabés algo',
        text: t`**Condicional quiere decir "ya sé algo".** $P(A \mid B)$ es la chance de $A$ **una vez que te enteraste** de que $B$ pasó. Es como achicar el mundo: ya no mirás todas las cartas de la baraja, sino solo las de oros, y adentro de ese grupo calculás la chance.`,
      },
      { type: 'subheading', text: 'Teorema de Bayes (la idea más importante de esta sección)' },
      {
        type: 'paragraph',
        text: t`Permite **dar vuelta** una probabilidad condicional: pasar de $P(B \mid A)$ a $P(A \mid B)$.`,
      },
      { type: 'formula', latex: t`P(A \mid B) = \frac{P(B \mid A)\, P(A)}{P(B)}` },
      {
        type: 'workedExample',
        title: t`*Ejemplo completo (test médico).* Una enfermedad afecta al 1% de la población. Un test detecta la enfermedad en el 90% de los enfermos (sensibilidad) y da falso positivo en el 5% de los sanos. Si das positivo, ¿qué probabilidad tienes de estar enfermo?`,
        steps: [
          t`Positivo y enfermo: $0.01 \times 0.90 = 0.009$`,
          t`Positivo y sano: $0.99 \times 0.05 = 0.0495$`,
          t`Total de positivos: $0.009 + 0.0495 = 0.0585$`,
        ],
        result: t`$P(\text{enfermo} \mid +) = 0.009 / 0.0585 \approx 0.154$`,
      },
      {
        type: 'paragraph',
        text: t`**Solo 15.4 %**, aunque el test parezca "bueno". La razón: hay muchísimos más sanos que enfermos, y el 5 % de una población enorme de sanos genera más positivos que el 90 % de unos pocos enfermos. Es el error típico de mirar solo el resultado del test e ignorar cuán frecuente es la enfermedad antes de testear: ese $P(A)$ de la fórmula pesa tanto como la calidad del test.`,
      },
      {
        type: 'intuition',
        title: 'El test médico, explicado con mil personas en una plaza',
        text: t`**Bayes: mirar el test con mil personas.** Imaginá mil personas en una plaza. La enfermedad afecta al 1 %: son **10 enfermas** y **990 sanas**.
De las 10 enfermas, el test detecta al 90 %: **9 dan positivo**.

De las 990 sanas, el test se equivoca con el 5 %: unas **49.5 dan positivo**.


Hay $9 + 49.5 = 58.5$ positivos en total y solo 9 están realmente enfermos: $9/58.5 \approx 0.154$, es decir **15.4 %**. El test parece muy bueno, pero hay tantos sanos que sus pocos errores se juntan y superan a los aciertos. Por eso importa saber **qué tan frecuente es la enfermedad antes de testear**.`,
      },
      {
        type: 'deepDive',
        title: 'Bayes es una forma de actualizar lo que creés',
        text: t`La fórmula de Bayes se puede leer como una regla para **cambiar de opinión con evidencia**: partís de lo que creías antes de ver el dato ($P(A)$, el 1 % de enfermos) y lo ajustás según qué tan bien explica el dato cada posibilidad. Lo que creías antes se llama **probabilidad a priori**; lo que creés después, **a posteriori**.

**Un segundo test.** Después del primer positivo, tu probabilidad de estar enfermo ya no es $0.01$, sino $0.154$. Si te hacés un segundo test independiente y también da positivo, se repite la misma cuenta, pero partiendo de $0.154$:

Positivo y enfermo: $0.154 \times 0.90 \approx 0.138$.

Positivo y sano: $0.846 \times 0.05 \approx 0.042$.

$P(\text{enfermo} \mid \text{dos positivos}) \approx 0.138 / (0.138 + 0.042) \approx 0.766$.

Con dos positivos pasa de 15 % a casi 77 %. Cada dato nuevo mueve la creencia, y **la a posteriori de hoy es la a priori de mañana**. Por eso, en la práctica, un positivo en una enfermedad rara se confirma con un segundo test antes de diagnosticar.`,
        sources: ['Gigerenzer, *Calculated Risks* (frecuencias naturales en pruebas médicas)'],
      },
      { type: 'simulation', simulationId: 'IN-03' },
      {
        type: 'extra',
        text: t`Un clásico de Kahneman y Tversky: en una ciudad, el 85 % de los taxis son verdes y el 15 % azules. Un testigo ve un taxi en un accidente nocturno y dice que era azul; sabemos que acierta el color el 80 % de las veces. ¿Qué tan probable es que el taxi fuera azul? Taxis azules que el testigo ve azules: $0.15 \times 0.80 = 0.12$. Taxis verdes que ve azules: $0.85 \times 0.20 = 0.17$. Entonces $P(\text{azul} \mid \text{dice azul}) = 0.12 / (0.12 + 0.17) \approx 0.414$: solo 41 %, aunque el testigo sea bastante confiable, porque hay muchos más taxis verdes. Es la misma estructura del test médico.`,
      },
      { type: 'subheading', text: 'Variable aleatoria, esperanza y varianza' },
      {
        type: 'list',
        items: [
          t`**Variable aleatoria**: un número cuyo valor depende del azar (el resultado de un dado, $X$).`,
          t`**Esperanza** $E(X)$: el promedio que obtendrías si repitieras el experimento infinitas veces. Se calcula ponderando cada valor por su probabilidad:`,
        ],
      },
      { type: 'formula', latex: t`E(X) = \sum x \cdot P(X=x)` },
      {
        type: 'paragraph',
        text: t`*Dado justo:* $E(X) = (1+2+3+4+5+6)/6 = 3.5$. (Nunca sale 3.5, pero es el centro de gravedad.)`,
      },
      {
        type: 'list',
        items: [
          t`**Varianza** $\text{Var}(X)$: el promedio de cuánto se alejan los valores del centro, **al cuadrado**:`,
        ],
      },
      { type: 'formula', latex: t`\text{Var}(X) = E\big[(X - E(X))^2\big]` },
      {
        type: 'paragraph',
        text: t`*Dado justo:* $\text{Var} = \tfrac{1}{6}\big[(1-3.5)^2 + (2-3.5)^2 + \dots + (6-3.5)^2\big] \approx 2.92$.`,
      },
      {
        type: 'list',
        items: [
          t`**Desviación típica**: la raíz cuadrada de la varianza. Tiene las mismas unidades que los datos. Para el dado: $\sqrt{2.92} \approx 1.71$.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`*¿Por qué al cuadrado?* Porque si no, las desviaciones positivas y negativas se cancelarían y el promedio daría 0.`,
      },
      {
        type: 'extra',
        text: t`Una rifa de 1000 números en la que el único premio es de 50 000 pesos y cada número cuesta 100. La ganancia de un número es una variable aleatoria: con probabilidad $1/1000$ ganas 50 000 y con probabilidad $999/1000$ ganas 0. Su esperanza es $E = 50\,000 \times \tfrac{1}{1000} = 50$ pesos, menos que los 100 que pagaste: en promedio, cada número "pierde" 50 pesos.`,
      },
      {
        type: 'deepDive',
        title: 'Misma esperanza, distinto riesgo',
        text: t`La esperanza sola no alcanza para decidir. Compará dos opciones:

**Opción A:** te dan $50$ pesos seguros.

**Opción B:** tirás una moneda; con cara ganás $100$ y con cruz, $0$.

Las dos tienen la misma esperanza: $E(B) = 0.5 \times 100 + 0.5 \times 0 = 50$. Pero no son iguales: la A tiene varianza $0$ (nunca te alejás de $50$) y la B tiene varianza $0.5 \times (100-50)^2 + 0.5 \times (0-50)^2 = 2500$, o sea, una desviación típica de $50$ pesos. **La esperanza dice dónde está el centro; la varianza, cuánto te podés alejar de él.** En finanzas, esa varianza es una forma de medir el **riesgo**, y por eso las dos cifras se reportan juntas.

**Por qué la esperanza es "promedio de largo plazo".** Si jugaras B mil veces, ganarías unas 500 veces $100$ y unas 500 veces $0$: en promedio, cerca de $50$ por jugada. Cuantas más veces juegues, más se acerca el promedio a la esperanza. Pero si jugás una sola vez, nunca vas a ganar $50$.`,
        sources: ['Ross, *A First Course in Probability*, cap. 4 (esperanza y varianza)'],
      },
      { type: 'subheading', text: 'Esperanza condicional' },
      {
        type: 'paragraph',
        text: t`$E(Y \mid X)$ es el valor promedio de $Y$ **entre quienes tienen un valor dado de $X$**. *Ejemplo:* $E(\text{salario} \mid \text{15 años de estudio})$ es el salario promedio de quienes estudiaron 15 años. Es un promedio, pero restringido al grupo que cumple una condición, igual que $P(A \mid B)$ restringe la probabilidad a los casos donde ocurrió $B$.`,
      },
      {
        type: 'deepDive',
        title: 'Promedios por grupo y el promedio de todos',
        text: t`Supongamos (cifras inventadas) que en una empresa el 60 % de los empleados estudió 12 años y gana en promedio $30$ mil, y el 40 % estudió 16 años y gana en promedio $40$ mil. Entonces:

$E(\text{salario} \mid 12 \text{ años}) = 30$ y $E(\text{salario} \mid 16 \text{ años}) = 40$.

**El promedio general es el promedio de los promedios, ponderado por el tamaño de cada grupo:** $0.6 \times 30 + 0.4 \times 40 = 34$. Es la misma idea que la esperanza, $\sum x \cdot P(X = x)$, pero con promedios de grupo en lugar de valores sueltos.

**Por qué importa tanto.** Si te piden predecir el salario de alguien y no sabés nada, lo mejor es decir $34$. Si sabés que estudió 16 años, mejor decir $40$. La esperanza condicional es **la mejor predicción posible usando la información que tenés**, y casi todo lo que viene en el curso (estimar cómo cambia el salario con los años de estudio, clasificar clientes, predecir) son formas de aproximarla cuando hay muchas variables y pocos datos por grupo.`,
        sources: ['Angrist y Pischke, *Mostly Harmless Econometrics*, cap. 3 (la función de esperanza condicional)', 'Cifras inventadas para el ejemplo'],
      },
    ],
  },
  {
    id: '0.3',
    moduleId: 0,
    title: 'Álgebra lineal mínima',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué significaban $x_i$ y $\sum$?`,
            answer: t`$x_i$ es el dato que está en el lugar $i$ de una lista, y $\sum$ manda a sumar todos los términos: $\sum_{i=1}^{3} x_i = 4 + 7 + 9 = 20$. El producto interno es una sumatoria de productos. Lo viste en Módulo 0.1.`,
          },
          {
            question: '¿Qué medía la varianza?',
            answer: t`Cuánto se alejan los valores de su centro, en promedio y al cuadrado. La covarianza, al final de esta sección, es la misma idea pero para dos variables a la vez. Lo viste en Módulo 0.2.`,
          },
        ],
      },
      { type: 'subheading', text: 'Vectores y matrices' },
      {
        type: 'list',
        items: [
          t`**Vector**: una lista ordenada de números. $x = (2, 5, 1)$ es un vector de 3 componentes. Representa, por ejemplo, un individuo con 3 características (edad, años de estudio, horas trabajadas).`,
          t`**Matriz**: una tabla de números con filas y columnas. En ciencia de datos, la **matriz de datos $X$** tiene una fila por individuo y una columna por variable:`,
        ],
      },
      { type: 'formula', latex: t`X = \begin{pmatrix} 25 & 12 \\ 40 & 16 \\ 31 & 14 \end{pmatrix}` },
      { type: 'paragraph', text: '(3 personas × 2 variables: edad y años de estudio).' },
      {
        type: 'intuition',
        title: 'Vector y matriz: la ficha y la planilla',
        text: t`**Vector = la ficha de una persona.** Una ficha con tres datos, por ejemplo $(2, 5, 1)$, es un vector: una lista ordenada de números. **Matriz = la planilla entera.** Si cada fila es una persona y cada columna es un dato (edad, años de estudio), tenés la matriz de datos $X$. Es, literalmente, una tabla de Excel.`,
      },
      { type: 'miniCheck', questionIds: ['m0-q10'] },
      { type: 'subheading', text: 'Producto interno (producto punto)' },
      { type: 'paragraph', text: 'Se multiplican los componentes uno a uno y se suman:' },
      { type: 'formula', latex: t`\langle a, b \rangle = a_1 b_1 + a_2 b_2 + \dots + a_k b_k` },
      { type: 'paragraph', text: t`*Ejemplo:* $(1,2,3) \cdot (4,5,6) = 4 + 10 + 18 = 32$.` },
      {
        type: 'intuition',
        title: 'Producto interno: multiplicar y sumar, como una factura',
        text: t`**Producto interno: multiplicar y sumar.** Se multiplica cada número de una lista por el que está en la misma posición de la otra y se suma todo: $(1,2,3) \cdot (4,5,6) = 4 + 10 + 18 = 32$. Es lo mismo que calcular una factura: cantidad por precio, renglón por renglón, y al final el total.`,
      },
      { type: 'subheading', text: 'Combinación lineal (una suma con "pesos")' },
      {
        type: 'paragraph',
        text: t`Una **combinación lineal** de variables es una suma donde cada variable se multiplica por un número y se suma:`,
      },
      { type: 'formula', latex: t`\beta_0 + \beta_1 x_1 + \beta_2 x_2` },
      {
        type: 'paragraph',
        text: t`Esto es exactamente un producto interno entre el vector de coeficientes y el vector de variables (con un 1 delante para el $\beta_0$). Por eso suele escribirse de forma compacta como $X\beta$: "la combinación lineal de todas las variables de cada individuo".`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* si $\beta_0 = 1000$, $\beta_1 = 50$ (por año de edad) y $\beta_2 = 200$ (por año de estudio), para una persona de 30 años con 12 de estudio: $1000 + 50\cdot30 + 200\cdot12 = 4900$.`,
      },
      {
        type: 'extra',
        text: t`El costo de un envío a domicilio es una combinación lineal: 300 pesos de base, más 40 por kilómetro, más 25 por kilo. Para un paquete de 2 kg que viaja 5 km: $300 + 40\cdot5 + 25\cdot2 = 550$ pesos. Es un producto interno entre los coeficientes $(300, 40, 25)$ y los datos del pedido $(1, 5, 2)$.`,
      },
      {
        type: 'deepDive',
        title: t`$X\beta$: todas las predicciones de una sola vez`,
        text: t`La notación $X\beta$ parece abstracta, pero es solo la combinación lineal aplicada **a cada fila de la planilla a la vez**. Tomemos la matriz $X$ de arriba (edad y años de estudio de 3 personas) y los pesos del ejemplo: $1000$ de base, $50$ por año de edad y $200$ por año de estudio.

Persona 1 (25 años, 12 de estudio): $1000 + 50 \cdot 25 + 200 \cdot 12 = 4650$.

Persona 2 (40 años, 16 de estudio): $1000 + 50 \cdot 40 + 200 \cdot 16 = 6200$.

Persona 3 (31 años, 14 de estudio): $1000 + 50 \cdot 31 + 200 \cdot 14 = 5350$.

Cada resultado es el producto interno de una fila por el vector de pesos. Multiplicar una matriz por un vector es exactamente eso: repetir el producto interno fila por fila. Para que la base de $1000$ entre en la misma cuenta, se agrega a la planilla una **columna de unos**: cada fila pasa a ser $(1, \text{edad}, \text{estudio})$ y el vector de pesos, $(1000, 50, 200)$.

**Por qué conviene escribirlo así.** Da lo mismo tener 3 personas o 3 millones, y 2 variables o 200: la cuenta se escribe igual, $X\beta$, y la computadora la resuelve de una sola vez.`,
        sources: ['Strang, *Introduction to Linear Algebra*, cap. 1 y 2 (producto de matriz por vector)'],
      },
      { type: 'subheading', text: 'Dependencia lineal (colinealidad)' },
      {
        type: 'paragraph',
        text: t`Si una columna de $X$ se puede obtener combinando otras columnas, la información es **redundante**. *Ejemplo:* si incluyes "edad en años" y "edad en meses", una columna es 12 veces la otra. Eso se llama **colinealidad perfecta** y hace imposible repartir el efecto de forma única: cualquier combinación lineal que use las dos columnas puede reproducirse con solo una de ellas, así que no hay manera de decidir cuánto corresponde a cada columna.`,
      },
      {
        type: 'deepDive',
        title: 'Por qué con colinealidad perfecta no hay una única respuesta',
        text: t`Supongamos que el efecto real de la edad es $50$ pesos por año, y que la planilla tiene "edad en años" y "edad en meses" ($= 12 \times$ años). Para una persona de 30 años (360 meses), todas estas combinaciones dan **exactamente la misma predicción**:

$50 \cdot 30 + 0 \cdot 360 = 1500$.

$0 \cdot 30 + \tfrac{50}{12} \cdot 360 = 1500$.

$25 \cdot 30 + \tfrac{25}{12} \cdot 360 = 1500$.

Y lo mismo para cualquier persona, porque la columna de meses siempre es 12 veces la de años. Hay **infinitas** maneras de repartir el efecto entre las dos columnas, y los datos no tienen forma de preferir una: todas encajan igual de bien. No es que el método falle; la pregunta "¿cuánto se debe a cada columna?" no tiene respuesta con esos datos.

**El caso parecido, pero no perfecto.** Si dos columnas son casi iguales (por ejemplo, años de experiencia y edad), sí hay una respuesta, pero muy inestable: pequeños cambios en los datos hacen saltar mucho el reparto entre las dos.`,
        sources: ['Wooldridge, *Introducción a la econometría*, cap. 3 (colinealidad perfecta)'],
      },
      { type: 'subheading', text: 'Hiperplano' },
      {
        type: 'paragraph',
        text: t`En 2 dimensiones, una **recta** ($w_1 x_1 + w_2 x_2 + b = 0$) divide el plano en dos mitades. En 3 dimensiones lo hace un plano. En $k$ dimensiones, la misma idea se llama **hiperplano**: una superficie plana que parte el espacio en dos lados. Sirve para separar casos en dos grupos con una regla lineal, como en el ejemplo que sigue.`,
      },
      {
        type: 'intuition',
        title: 'Hiperplano: una línea que parte en dos',
        text: t`**Hiperplano: una línea que parte en dos.** Una recta divide un dibujo plano en dos lados, un plano divide el espacio en dos lados y el hiperplano es lo mismo con más datos. Para decidir, alcanza con ver de qué lado cae cada persona. Es una regla del tipo "de este lado, sí; del otro, no".`,
      },
      {
        type: 'extra',
        text: t`Un banco decide aprobar un préstamo si $2x_1 - 3x_2 - 10 > 0$, donde $x_1$ es el ingreso y $x_2$ la deuda, ambos en miles de pesos. La recta $2x_1 - 3x_2 - 10 = 0$ separa a quienes aprueban de quienes no. Con ingreso 20 y deuda 5: $2\cdot20 - 3\cdot5 - 10 = 15 > 0$, así que cae del lado "aprobado". Con ingreso 10 y deuda 8: $20 - 24 - 10 = -14 < 0$, del lado "rechazado".`,
      },
      { type: 'subheading', text: 'Matriz de covarianza (solo la idea)' },
      {
        type: 'paragraph',
        text: t`Cuando tienes varias variables, se resume su variabilidad en una tabla cuadrada: en la **diagonal** están las varianzas de cada variable, y fuera de la diagonal las **covarianzas** (cuánto tienden a moverse juntas dos variables). Si dos variables tienen covarianza positiva (por ejemplo, años de estudio y salario), tienden a subir juntas; si es negativa, una sube cuando la otra baja.`,
      },
      {
        type: 'deepDive',
        title: 'Cómo se calcula la covarianza, y por qué se la estandariza',
        text: t`**La receta.** Para cada persona, se mide cuánto se aleja cada variable de su propio promedio y se **multiplican** esos dos desvíos. Si los dos están por encima del promedio, el producto es positivo; si los dos están por debajo, también (menos por menos). Si uno está arriba y el otro abajo, es negativo. La covarianza promedia esos productos: si dominan los positivos, las variables suben juntas.

**Con números.** Años de estudio $8, 10, 12, 14, 16$ y salario (en miles) $22, 26, 28, 36, 38$. Los promedios son $12$ y $30$. Los desvíos del estudio son $-4, -2, 0, 2, 4$ y los del salario, $-8, -4, -2, 6, 8$. Los productos son $32, 8, 0, 12, 32$, que suman $84$. Dividiendo por $n - 1 = 4$, la covarianza es $21$: positiva, suben juntas.

**El problema de las unidades.** Ese $21$ está en "años × miles de pesos". Si midieras el salario en pesos en vez de miles, la covarianza sería mil veces más grande, aunque la relación sea la misma. Por eso se la divide por las dos desviaciones típicas, y se obtiene la **correlación**, que siempre está entre $-1$ y $1$: $84 / \sqrt{40 \times 184} \approx 0.98$. Un valor tan cercano a $1$ indica que los puntos caen casi sobre una recta que sube.`,
        sources: ['Freedman, Pisani y Purves, *Statistics*, cap. 8 (correlación)'],
      },
    ],
  },
  {
    id: '0.4',
    moduleId: 0,
    title: 'Cálculo mínimo: derivada y optimización',
    blocks: [
      {
        type: 'recall',
        items: [
          {
            question: t`¿Qué eran $\sum$, $\bar{x}$ e $\hat{y}$?`,
            answer: t`$\sum$ manda a sumar todos los términos, $\bar{x}$ es el promedio y la letra con sombrero, $\hat{y}$, es un valor predicho, no el real. Lo viste en Módulo 0.1.`,
          },
          {
            question: '¿Por qué la varianza eleva los desvíos al cuadrado?',
            answer: t`Para que los desvíos hacia arriba y hacia abajo no se cancelen. Esos mismos cuadrados son los que se minimizan en esta sección. Lo viste en Módulo 0.2.`,
          },
        ],
      },
      { type: 'subheading', text: 'Derivada = pendiente' },
      {
        type: 'paragraph',
        text: t`La **derivada** de una función en un punto es la **pendiente** de la curva en ese punto: cuánto cambia la salida si mueves un poquito la entrada. Si la derivada es positiva, la función sube; si es negativa, baja; si es **cero**, estás en una cima o en un valle (un punto donde la curva se aplana).`,
      },
      {
        type: 'intuition',
        title: 'La derivada es la pendiente de una cuesta',
        text: t`**La derivada es la pendiente.** Imaginá que caminás por una cuesta. Si sube, la pendiente es positiva; si baja, negativa; y si el piso está plano, la pendiente es **cero**. Un lugar plano solo puede ser una cima o el fondo de un valle. La derivada es lo mismo que el velocímetro del auto: te dice cuánto cambia algo por cada pequeño paso que das.`,
      },
      { type: 'miniCheck', questionIds: ['m0-q11'] },
      { type: 'subheading', text: 'Minimizar una función' },
      {
        type: 'paragraph',
        text: t`Casi todo el aprendizaje automático consiste en **minimizar un error**. Para hacerlo, se busca el punto donde la derivada es cero.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* $f(b) = (b - 3)^2 + 1$. Su derivada es $2(b-3)$. Igualando a cero: $b = 3$. Ahí está el mínimo: $f(3) = 1$.`,
      },
      {
        type: 'deepDive',
        title: 'De dónde sale la derivada: acercar dos puntos',
        text: t`**La pendiente entre dos puntos** es "cuánto subió" dividido "cuánto avanzaste". La derivada es esa misma cuenta con los dos puntos casi pegados. Con $f(b) = (b-3)^2 + 1$ en $b = 5$: $f(5) = 5$ y $f(5.001) = 5.004001$, así que la pendiente es $0.004001 / 0.001 = 4.001$. Cuanto más se acercan los puntos, más se acerca a $4$, que es justo lo que da la fórmula $2(b-3) = 2 \times 2 = 4$.

**Las tres reglas que alcanzan para casi todo el curso.** La derivada de una constante es $0$, porque no cambia. La de $b^2$ es $2b$. Y si adentro del cuadrado hay algo, como $(b-3)^2$, la derivada es $2 \times (b-3)$ multiplicado por la derivada de lo de adentro, que acá es $1$. Con eso se deriva la suma de errores al cuadrado del ejemplo que sigue.

**Cómo saber si es un mínimo o un máximo.** Que la derivada valga cero solo dice que el piso está plano. En $f(b) = (b-3)^2 + 1$, a la izquierda de $3$ la derivada es negativa (baja) y a la derecha es positiva (sube): es un valle. En los problemas de minimizar errores al cuadrado, la función siempre tiene forma de valle, así que el punto plano es el mínimo.`,
        sources: ['Stewart, *Cálculo de una variable*, cap. 2 y 3 (la derivada y las reglas de derivación)'],
      },
      { type: 'subheading', text: 'Ejemplo central: por qué el promedio es "el mejor resumen"' },
      {
        type: 'paragraph',
        text: t`Supón datos $y_1, \dots, y_n$ y que quieres un único número $b$ que los represente, eligiendo el que minimice la suma de errores al cuadrado:`,
      },
      { type: 'formula', latex: t`S(b) = \sum_{i=1}^{n} (y_i - b)^2` },
      {
        type: 'paragraph',
        text: t`Derivando e igualando a cero: $-2\sum (y_i - b) = 0$, de donde $b = \bar{y}$.`,
      },
      {
        type: 'paragraph',
        text: t`**El promedio es la solución de mínimos cuadrados** cuando el modelo es solo "una constante": un único número que resume todos los datos. La idea es general: elegir el resumen que minimice la suma de los errores al cuadrado.`,
      },
      {
        type: 'extra',
        text: t`Tres compañeros de oficina prefieren el aire acondicionado a 20, 22 y 27 °C. ¿Qué temperatura incomoda menos al grupo, medido como suma de las diferencias al cuadrado? A 23 °C (el promedio): $3^2 + 1^2 + 4^2 = 26$. A 22 °C: $2^2 + 0^2 + 5^2 = 29$. A 24 °C: $4^2 + 2^2 + 3^2 = 29$. Cualquier otro valor da más que 26: el mínimo está en el promedio, $\bar{y} = 23$.`,
      },
      {
        type: 'deepDive',
        title: 'Si medís el error de otra forma, cambia el mejor resumen',
        text: t`El promedio gana porque el error se mide **al cuadrado**. Si en cambio se mide con la distancia sin signo (el valor absoluto), el mejor resumen es otro: **el valor del medio** de los datos ordenados, que se llama **mediana**.

Con las temperaturas del ejemplo ($20, 22, 27$), sumando distancias sin elevar al cuadrado:

En $22$ (el valor del medio): $2 + 0 + 5 = 7$.

En $23$ (el promedio): $3 + 1 + 4 = 8$.

Ahora gana el $22$. **¿Por qué la diferencia?** Al cuadrado, un error grande pesa muchísimo (un error de $5$ cuenta $25$), así que el promedio se corre hacia el dato lejano para no dejarlo tan incómodo. Con el valor absoluto, un error de $5$ cuenta solo $5$, y al resumen no le importa tanto el extremo. Por eso el promedio se deja arrastrar por valores extremos y la mediana no.

**La idea general:** elegir cómo medir el error es elegir qué te importa. Los cuadrados castigan mucho los errores grandes; el valor absoluto los trata a todos por igual.`,
        sources: ['Hastie, Tibshirani y Friedman, *The Elements of Statistical Learning*, cap. 2 (funciones de pérdida)'],
      },
      { type: 'subheading', text: 'Gradiente y descenso por gradiente' },
      {
        type: 'paragraph',
        text: t`Cuando hay varios parámetros, se calcula una derivada para cada uno; el vector de todas ellas es el **gradiente**. Apunta hacia donde la función **sube más rápido**, así que para bajar se avanza en dirección contraria. Repetir esto paso a paso es el **descenso por gradiente**: la analogía es bajar una montaña con niebla, dando cada paso hacia donde el suelo desciende más. Es la forma habitual de buscar un mínimo cuando no se puede despejar con una fórmula.`,
      },
      {
        type: 'intuition',
        title: 'Bajar la montaña con niebla',
        text: t`**Bajar la montaña con niebla.** Cuando hay muchos números que ajustar no se puede despejar el fondo con una fórmula. Entonces se hace como alguien perdido en una montaña con niebla: no ve el valle, pero siente hacia dónde baja el suelo bajo los pies, y da un paso en esa dirección, y otro, y otro. Esa lista de pendientes (una por cada número a ajustar) se llama **gradiente**, y repetir los pasos es el **descenso por gradiente**. Cuanto más cerca del fondo, más plano está el suelo y más cortos son los pasos.`,
      },
      {
        type: 'extra',
        text: t`Con la función de antes, $f(b) = (b-3)^2 + 1$, partimos de $b = 0$ y damos pasos de tamaño $0.25$ contra la derivada $2(b-3)$. Primer paso: la derivada vale $-6$, así que $b = 0 - 0.25\cdot(-6) = 1.5$. Segundo paso: la derivada vale $-3$ y $b = 1.5 - 0.25\cdot(-3) = 2.25$. Cada paso se acerca al mínimo en $b = 3$, y los pasos se achican porque la pendiente se aplana.`,
      },
      {
        type: 'deepDive',
        title: 'El tamaño del paso importa',
        text: t`En el ejemplo de arriba, cada paso es $0.25$ por la pendiente. Ese $0.25$ se llama **tasa de aprendizaje**, y elegirlo bien es más delicado de lo que parece.

**Si es demasiado grande, se pasa de largo.** Con un paso de $1$ en lugar de $0.25$, desde $b = 0$: la derivada vale $-6$, así que $b = 0 - 1 \cdot (-6) = 6$. Ahí la derivada vale $+6$, y vuelve a $b = 6 - 1 \cdot 6 = 0$. Rebota entre $0$ y $6$ para siempre, sin acercarse nunca al $3$. Con pasos todavía más grandes, se aleja cada vez más.

**Si es demasiado chico, tarda muchísimo.** Con un paso de $0.01$, cada iteración avanza apenas un poco y hacen falta cientos de pasos para llegar.

**Por qué los pasos se achican solos.** El paso es la tasa por la pendiente, y cerca del fondo la pendiente es casi cero. Por eso, con una tasa razonable, el método frena por sí mismo al llegar.`,
        sources: ['Goodfellow, Bengio y Courville, *Deep Learning*, cap. 4 (optimización basada en gradientes)'],
      },
    ],
  },
  {
    id: '0.5',
    moduleId: 0,
    title: 'Logaritmos y exponenciales',
    blocks: [
      {
        type: 'list',
        items: [
          t`**Exponencial**: $e^x$, donde $e \approx 2.718$ es una constante especial. Siempre da un número positivo. $e^0 = 1$.`,
          t`**Logaritmo natural** $\ln(x)$: la operación **inversa** de la exponencial. Responde: "¿a qué potencia debo elevar $e$ para obtener $x$?". Por eso $\ln(e^x) = x$ y $e^{\ln x} = x$.`,
        ],
      },
      { type: 'paragraph', text: 'Valores para tener a mano:' },
      {
        type: 'table',
        headers: [t`Número ($x$)`, t`Logaritmo natural ($\ln(x)$)`],
        rows: [
          ['1', '0'],
          ['2', '0.693'],
          ['4', '1.386'],
          [t`$e \approx 2.718$`, '1'],
        ],
      },
      { type: 'paragraph', text: t`**Propiedad estrella:** el logaritmo convierte **productos en sumas**:` },
      { type: 'formula', latex: t`\ln(a \cdot b) = \ln(a) + \ln(b)` },
      {
        type: 'paragraph',
        text: t`Por eso se usa tanto: sumar es mucho más fácil que multiplicar (y derivar una suma es mucho más simple que derivar un producto).`,
      },
      {
        type: 'intuition',
        title: 'El decodificador secreto: los logaritmos convierten productos en sumas',
        text: t`**El decodificador secreto (los logaritmos):** multiplicar a mano lleva tiempo, pero sumar es muy fácil. La tabla de logaritmos ($\ln$) funciona como una libreta de "códigos secretos" con una propiedad especial: *para multiplicar dos números, solo sumás sus códigos*.

Por ejemplo, para calcular $2 \times 4 = 8$ buscás en la libreta el código del $2$ (es $0.693$) y el del $4$ (es $1.386$). En lugar de multiplicar, sumás los códigos: $0.693 + 1.386 = 2.079$. Después buscás de qué número es el código $2.079$ y la libreta te dice que es el **8**.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo de uso:* $e^{0.693} \approx 2$. Es decir, sumar $0.693$ en la escala logarítmica equivale a **multiplicar por 2** en la escala original.`,
      },
      {
        type: 'intuition',
        title: 'La máquina inversa, la alcancía que crece sola y el atajo del 72',
        text: t`**La máquina inversa ($e$):** la función $e^x$ deshace el código: si le das $2.079$, te devuelve el número original ($e^{2.079} \approx 8$).

**La alcancía que crece sola (interés compuesto):** si tu dinero crece 10 % por año, cada año se multiplica por $1.10$. Para saber cuántos años tarda en **duplicarse**, la pregunta es: ¿cuántas veces seguidas hay que multiplicar por $1.10$ para llegar a $2$?

Acá vuelven los códigos: el código de la meta (duplicar) es $\ln(2) \approx 0.693$ y el del paso anual es $\ln(1.10) \approx 0.0953$. Los pasos necesarios son la meta dividida por el paso: $0.693 / 0.0953 \approx 7.3$ años.

**El atajo: la "regla del 72":** dividir decimales de memoria es incómodo. Con una tasa chica, $\ln(1+r) \approx r$, así que los años son aproximadamente $69.3$ dividido por la tasa en porcentaje. Se usa $72$ en lugar de $69.3$ porque se divide exacto por muchos números ($2, 3, 4, 6, 8, 9, 12$). Al 10 %: $72/10 = 7.2$ años, muy cerca del $7.3$ exacto.`,
      },
      {
        type: 'deepDive',
        title: 'Por qué las diferencias de logaritmos son cambios porcentuales',
        text: t`**Una diferencia de logaritmos es un cociente disfrazado.** Por la propiedad estrella, $\ln(110) - \ln(100) = \ln(110/100) = \ln(1.10) \approx 0.0953$. Es decir, la diferencia de logaritmos solo depende de **en qué proporción** cambió el valor, no de su tamaño: pasar de $100$ a $110$ y pasar de $1000$ a $1100$ dan la misma diferencia. Y para cambios chicos, $\ln(1 + r) \approx r$: un $0.0953$ está muy cerca de un aumento del 10 %.

**Los porcentajes comunes no son simétricos; los logaritmos sí.** Si un precio sube de $100$ a $110$ (un 10 %) y vuelve a $100$, la bajada es de $10/110 \approx 9.09$ %. Los porcentajes no se compensan. En logaritmos, la subida es $+0.0953$ y la bajada $-0.0953$: se cancelan exactamente. Por eso, cuando se trabaja con precios, salarios o crecimiento, se prefiere medir los cambios en logaritmos.

**De dónde sale $e$.** Si un banco te paga un 100 % anual pero lo acredita en partes, tu dinero se multiplica por $(1 + 1/n)^n$ en un año. Acreditando una vez, por $2$. Una vez por mes, por $(1 + 1/12)^{12} \approx 2.613$. Una vez por día, por $(1 + 1/365)^{365} \approx 2.715$. Si se acredita en forma continua, el límite es $e \approx 2.718$. Por eso $e$ aparece cada vez que algo crece en proporción a lo que ya tiene.`,
        sources: ['Stewart, *Cálculo de una variable*, cap. 6 (funciones exponenciales y logarítmicas)'],
      },
    ],
  },
]
