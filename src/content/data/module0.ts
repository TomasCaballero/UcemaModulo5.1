import type { Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 0. Los bloques `extra` son ejemplos
// agregados (cotidianos o clásicos): no son de la guía y se muestran rotulados.
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
        type: 'paragraph',
        text: t`**Regla útil:** letra latina ($x$, $y$) suele ser un dato observado; letra griega ($\beta$, $\mu$) suele ser algo desconocido de la realidad; letra con sombrero ($\hat{\beta}$) es nuestra **estimación** de esa cantidad desconocida.`,
      },
      {
        type: 'extra',
        text: t`Ticket del supermercado: pagaste 120, 80 y 200 pesos por tres productos. Esa es tu lista $x = (120, 80, 200)$ con $n = 3$. La sumatoria $\sum x_i = 400$ es el total del ticket y $\bar{x} = 400/3 \approx 133.33$ es lo que costó un producto en promedio. Y si el pronóstico del clima dijo 19 °C y la temperatura real fue $y = 21$ °C, la predicción es $\hat{y} = 19$ y el error es $y - \hat{y} = 2$.`,
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
        type: 'extra',
        text: t`Si la probabilidad de que llueva el sábado es 0.3 y la de que llueva el domingo es 0.3, y suponemos que un día no influye en el otro, la probabilidad de que llueva los dos días es $0.3 \times 0.3 = 0.09$ (9 %). En la realidad el clima de dos días seguidos no suele ser independiente: multiplicar solo vale si de verdad lo son.`,
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
      { type: 'subheading', text: 'Esperanza condicional' },
      {
        type: 'paragraph',
        text: t`$E(Y \mid X)$ es el valor promedio de $Y$ **entre quienes tienen un valor dado de $X$**. *Ejemplo:* $E(\text{salario} \mid \text{15 años de estudio})$ es el salario promedio de quienes estudiaron 15 años. Es un promedio, pero restringido al grupo que cumple una condición, igual que $P(A \mid B)$ restringe la probabilidad a los casos donde ocurrió $B$.`,
      },
    ],
  },
  {
    id: '0.3',
    moduleId: 0,
    title: 'Álgebra lineal mínima',
    blocks: [
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
      { type: 'miniCheck', questionIds: ['m0-q10'] },
      { type: 'subheading', text: 'Producto interno (producto punto)' },
      { type: 'paragraph', text: 'Se multiplican los componentes uno a uno y se suman:' },
      { type: 'formula', latex: t`\langle a, b \rangle = a_1 b_1 + a_2 b_2 + \dots + a_k b_k` },
      { type: 'paragraph', text: t`*Ejemplo:* $(1,2,3) \cdot (4,5,6) = 4 + 10 + 18 = 32$.` },
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
      { type: 'subheading', text: 'Dependencia lineal (colinealidad)' },
      {
        type: 'paragraph',
        text: t`Si una columna de $X$ se puede obtener combinando otras columnas, la información es **redundante**. *Ejemplo:* si incluyes "edad en años" y "edad en meses", una columna es 12 veces la otra. Eso se llama **colinealidad perfecta** y hace imposible repartir el efecto de forma única: cualquier combinación lineal que use las dos columnas puede reproducirse con solo una de ellas, así que no hay manera de decidir cuánto corresponde a cada columna.`,
      },
      { type: 'subheading', text: 'Hiperplano' },
      {
        type: 'paragraph',
        text: t`En 2 dimensiones, una **recta** ($w_1 x_1 + w_2 x_2 + b = 0$) divide el plano en dos mitades. En 3 dimensiones lo hace un plano. En $k$ dimensiones, la misma idea se llama **hiperplano**: una superficie plana que parte el espacio en dos lados. Sirve para separar casos en dos grupos con una regla lineal, como en el ejemplo que sigue.`,
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
    ],
  },
  {
    id: '0.4',
    moduleId: 0,
    title: 'Cálculo mínimo: derivada y optimización',
    blocks: [
      { type: 'subheading', text: 'Derivada = pendiente' },
      {
        type: 'paragraph',
        text: t`La **derivada** de una función en un punto es la **pendiente** de la curva en ese punto: cuánto cambia la salida si mueves un poquito la entrada. Si la derivada es positiva, la función sube; si es negativa, baja; si es **cero**, estás en una cima o en un valle (un punto donde la curva se aplana).`,
      },
      {
        type: 'extra',
        text: t`El velocímetro del auto es una derivada: marca cuánto cambia tu posición por cada hora que pasa. Si a las 10:00 estás en el kilómetro 100 y a las 10:30 en el 145, la velocidad media fue $(145-100)/0.5 = 90$ km/h. Con velocidad positiva avanzas; con velocidad cero, estás detenido (o justo en el punto donde cambias de sentido).`,
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
      { type: 'subheading', text: 'Gradiente y descenso por gradiente' },
      {
        type: 'paragraph',
        text: t`Cuando hay varios parámetros, se calcula una derivada para cada uno; el vector de todas ellas es el **gradiente**. Apunta hacia donde la función **sube más rápido**, así que para bajar se avanza en dirección contraria. Repetir esto paso a paso es el **descenso por gradiente**: la analogía es bajar una montaña con niebla, dando cada paso hacia donde el suelo desciende más. Es la forma habitual de buscar un mínimo cuando no se puede despejar con una fórmula.`,
      },
      {
        type: 'extra',
        text: t`Con la función de antes, $f(b) = (b-3)^2 + 1$, partimos de $b = 0$ y damos pasos de tamaño $0.25$ contra la derivada $2(b-3)$. Primer paso: la derivada vale $-6$, así que $b = 0 - 0.25\cdot(-6) = 1.5$. Segundo paso: la derivada vale $-3$ y $b = 1.5 - 0.25\cdot(-3) = 2.25$. Cada paso se acerca al mínimo en $b = 3$, y los pasos se achican porque la pendiente se aplana.`,
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
        headers: [t`$x$`, t`$\ln(x)$`],
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
        type: 'paragraph',
        text: t`*Ejemplo de uso:* $e^{0.693} \approx 2$. Es decir, sumar $0.693$ en la escala logarítmica equivale a **multiplicar por 2** en la escala original.`,
      },
      {
        type: 'intuition',
        title: 'El decodificador secreto, la máquina inversa y la alcancía mágica',
        text: t`**1. El decodificador secreto (los logaritmos):** multiplicar a mano lleva tiempo, pero sumar es muy fácil. La tabla de logaritmos ($\ln$) funciona como una libreta de "códigos secretos" con una propiedad especial: *para multiplicar dos números, solo sumás sus códigos*.

Por ejemplo, para calcular $2 \times 4 = 8$ buscás en la libreta el código del $2$ (es $0.693$) y el del $4$ (es $1.386$). En lugar de multiplicar, sumás los códigos: $0.693 + 1.386 = 2.079$. Después buscás de qué número es el código $2.079$ y la libreta te dice que es el **8**.

**2. La máquina inversa ($e$):** la función $e^x$ deshace el código: si le das $2.079$, te devuelve el número original ($e^{2.079} \approx 8$).

**3. La alcancía que crece sola (interés compuesto):** si tu dinero crece 10 % por año, cada año se multiplica por $1.10$. Para saber cuántos años tarda en **duplicarse**, la pregunta es: ¿cuántas veces seguidas hay que multiplicar por $1.10$ para llegar a $2$?

Acá vuelven los códigos: el código de la meta (duplicar) es $\ln(2) \approx 0.693$ y el del paso anual es $\ln(1.10) \approx 0.0953$. Los pasos necesarios son la meta dividida por el paso: $0.693 / 0.0953 \approx 7.3$ años.

**4. El atajo: la "regla del 72":** dividir decimales de memoria es incómodo. Con una tasa chica, $\ln(1+r) \approx r$, así que los años son aproximadamente $69.3$ dividido por la tasa en porcentaje. Se usa $72$ en lugar de $69.3$ porque se divide exacto por muchos números ($2, 3, 4, 6, 8, 9, 12$). Al 10 %: $72/10 = 7.2$ años, muy cerca del $7.3$ exacto.`,
      },
    ],
  },
]
