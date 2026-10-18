import type { Section } from '../types'

// Fuente: recorrido-guias-de-aprendizaje-v3.md, Módulo 3. Los bloques `extra` son ejemplos
// agregados (cotidianos o clásicos): no son de la guía y se muestran rotulados.
const t = String.raw

export const module3Sections: Section[] = [
  {
    id: '3.1',
    moduleId: 3,
    title: 'Estructuras de datos',
    blocks: [
      {
        type: 'paragraph',
        text: t`Antes de modelar hay que saber **cómo están organizados los datos**, porque eso determina qué técnicas son válidas. Hay cuatro estructuras típicas:`,
      },
      {
        type: 'table',
        headers: ['Estructura', 'Qué es', 'Ejemplo'],
        rows: [
          [
            '**Corte transversal** (*cross-section*)',
            'Muchas unidades (personas, hogares, empresas) observadas **en un solo momento**',
            'Encuesta a 2000 hogares en 2023',
          ],
          [
            '**Serie de tiempo** (*time series*)',
            '**Una** unidad observada **a lo largo del tiempo**',
            'Inflación mensual de un país, 2000-2024',
          ],
          [
            '**Corte transversal acumulado** (*pooled cross-section*)',
            'Muestras **independientes** tomadas en distintos momentos (las personas **no** son las mismas)',
            'Encuestas de empleo de 2010 y de 2020 con personas distintas',
          ],
          [
            '**Panel / longitudinal**',
            'Las **mismas** unidades seguidas en varios períodos',
            '500 empresas observadas cada año de 2015 a 2022',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: t`La diferencia entre el acumulado y el panel es clave: en el panel puedes seguir la **trayectoria de cada unidad**, y eso permite controlar características propias de cada una (sección 3.8).`,
      },
      {
        type: 'extra',
        text: t`Piensa en las fotos de tu familia. La foto de todos los alumnos de un curso el primer día de clases es un corte transversal. Tu peso medido cada mes durante cinco años es una serie de tiempo. Dos fotos de cursos de distintos años, con alumnos diferentes, son un corte acumulado. Y la foto del mismo grupo de amigos cada cumpleaños, durante diez años, es un panel: puedes ver cómo cambió cada persona.`,
      },
      {
        type: 'intuition',
        title: 'Una foto, una película, dos fotos distintas o un álbum de los mismos',
        text: t`**1. Cómo se miran los datos.** Antes de analizar nada, conviene preguntarse cómo se juntaron. Pensá en fotos de tu familia.

**Corte transversal:** una foto de muchas personas en un solo momento, como la foto de todo un curso el primer día de clases.

**Serie de tiempo:** muchas fotos de **una sola** unidad a lo largo del tiempo, como tu peso medido cada mes durante cinco años.

**Corte acumulado:** dos fotos de cursos de distintos años. Cada una muestra mucha gente, pero las personas **no son las mismas**.

**Panel:** el álbum de un grupo de amigos fotografiados **cada cumpleaños**. Son los mismos, así que podés ver cómo cambió cada uno.

**2. Por qué la diferencia importa.** Solo en el panel podés seguir la trayectoria de cada persona o empresa. Eso permite quitar de la comparación todo lo que es propio de cada una y no cambia, que es uno de los trucos más poderosos que vas a ver más adelante en este módulo (sección 3.8).`,
      },
    ],
  },
  {
    id: '3.2',
    moduleId: 3,
    title: 'Correlación, causalidad y ceteris paribus',
    blocks: [
      { type: 'miniCheck', questionIds: ['m3-q02'] },
      {
        type: 'list',
        items: [
          t`**Correlación**: dos variables se mueven juntas. **No implica causalidad.** El gallo canta antes del amanecer, pero no provoca la salida del sol.`,
          t`**Variable de confusión (*confounder*)**: una tercera variable que afecta a las dos y crea una relación aparente. Las ventas de helados y los ahogamientos están correlacionados porque ambos suben con el **calor**, no porque los helados ahoguen gente.`,
          t`**Ceteris paribus** (latín: "manteniendo todo lo demás constante"): para medir el efecto **causal** de $X$ sobre $Y$ hay que comparar situaciones que **solo** difieren en $X$. Para medir el efecto de la educación sobre el salario, debes comparar personas con la misma experiencia, la misma habilidad, etc.`,
          t`**Contrafactual**: lo que le habría pasado a la misma unidad si **no** hubiera recibido el tratamiento. Nunca lo observamos (una persona estudia o no estudia). Casi toda la econometría causal consiste en **aproximar ese contrafactual** de forma creíble.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Un **experimento aleatorio** resuelve el problema porque el azar hace que los grupos sean comparables. Con datos observacionales (sin azar) hay que apoyarse en modelos y supuestos, y por eso importa conocer cuándo fallan.`,
      },
      {
        type: 'extra',
        text: t`Cuantos más bomberos llegan a un incendio, mayor suele ser el daño: ¿los bomberos causan el daño? No: el confusor es el tamaño del incendio, que atrae a más bomberos y también produce más daño. Y con el contrafactual pasa igual que con una aspirina: si te tomas una y se te va el dolor de cabeza, nunca sabrás qué habría pasado en esa misma tarde, con ese mismo dolor, sin tomarla.`,
      },
      {
        type: 'intuition',
        title: 'Correlación no es causa: el gallo y el amanecer',
        text: t`**1. Moverse juntos no es empujarse.** Dos cosas pueden subir y bajar a la vez sin que una cause la otra. El gallo canta antes de que salga el sol, pero no lo hace salir.

**2. El tercero escondido.** Las ventas de helados y los ahogamientos suben juntos en verano. No es que los helados ahoguen a nadie: hay un tercer factor, el calor, que empuja a los dos. Ese tercer factor se llama **variable de confusión**. Otro caso: cuantos más bomberos hay en un incendio, mayor suele ser el daño. Pero no es culpa de los bomberos: el tamaño del incendio atrae a más bomberos y además produce más daño.

**3. Comparar peras con peras.** *Ceteris paribus* significa "manteniendo todo lo demás igual". Para saber si estudiar más sube el salario, tenés que comparar personas que se parezcan en todo lo demás (experiencia, habilidad…) y se diferencien solo en los años de estudio.

**4. El mundo que no vemos.** Si te tomás una aspirina y se te pasa el dolor, nunca vas a saber qué habría pasado esa misma tarde, con ese mismo dolor, si no la hubieras tomado. Ese "qué habría pasado" se llama **contrafactual**. Nunca se observa. Casi todo el trabajo de averiguar causas consiste en encontrar una forma creíble de aproximarlo.

**5. La mejor solución.** Un experimento al azar: si el sorteo decide quién recibe el tratamiento, los dos grupos quedan parecidos en todo, salvo en lo que querés medir. Sin azar, hay que apoyarse en modelos y supuestos, y por eso importa saber cuándo fallan.`,
      },
    ],
  },
  {
    id: '3.3',
    moduleId: 3,
    title: 'Regresión lineal simple y mínimos cuadrados ordinarios (OLS)',
    blocks: [
      { type: 'paragraph', text: '**Vocabulario:**' },
      {
        type: 'list',
        items: [
          t`**Variable dependiente** ($y$): la que queremos explicar (salario).`,
          t`**Variable independiente / explicativa** ($x$): la que usamos para explicarla (años de estudio).`,
          t`**Término de error** ($u$): **todo lo que afecta a $y$ y no está en el modelo** (habilidad, suerte, motivación…). No se observa.`,
        ],
      },
      { type: 'paragraph', text: '**Modelo:**' },
      { type: 'formula', latex: t`y = \beta_0 + \beta_1 x + u` },
      {
        type: 'list',
        items: [
          t`$\beta_1$ (pendiente): cuánto cambia $y$, en promedio, por cada unidad adicional de $x$.`,
          t`$\beta_0$ (ordenada): valor esperado de $y$ cuando $x=0$.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`**Residuos.** Con la recta estimada $\hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1 x_i$, el **residuo** es lo que la recta no explica: $\hat{u}_i = y_i - \hat{y}_i$. No hay que confundir el **error** $u$ (teórico, no observable) con el **residuo** $\hat{u}$ (calculado con los datos).`,
      },
      {
        type: 'paragraph',
        text: t`**Mínimos Cuadrados Ordinarios (OLS).** Se eligen $\hat\beta_0, \hat\beta_1$ de modo que la **suma de los residuos al cuadrado** sea la menor posible (la misma idea del Módulo 0.4, donde el promedio minimizaba esa suma para una constante). La solución es:`,
      },
      {
        type: 'formula',
        latex: t`\hat{\beta}_1 = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}, \qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1 \bar{x}`,
      },
      {
        type: 'paragraph',
        text: t`El numerador es la covarianza entre $x$ e $y$ (cuánto se mueven juntas) y el denominador es la variación de $x$.`,
      },
      {
        type: 'paragraph',
        text: t`**Ejemplo con números.** Años de estudio ($x$) y salario mensual en miles ($y$) de 5 personas:`,
      },
      {
        type: 'table',
        headers: [t`$x$`, '8', '10', '12', '14', '16'],
        rows: [[t`$y$`, '22', '26', '28', '36', '38']],
      },
      {
        type: 'workedExample',
        title: '**Paso a paso:** la recta de regresión de los 5 datos.',
        steps: [
          t`$\bar{x} = 12$, $\bar{y} = 30$.`,
          t`Desviaciones de $x$: $-4,-2,0,2,4$; de $y$: $-8,-4,-2,6,8$.`,
          t`Numerador: $32 + 8 + 0 + 12 + 32 = 84$. Denominador: $16+4+0+4+16 = 40$.`,
          t`$\hat\beta_1 = 84/40 = 2.1$ y $\hat\beta_0 = 30 - 2.1\times12 = 4.8$.`,
        ],
        result: t`**Recta estimada:** $\hat{y} = 4.8 + 2.1x$.`,
      },
      {
        type: 'paragraph',
        text: t`Cada año adicional de estudio se asocia con **2.1 mil más** de salario. Predicción para 15 años: $4.8 + 31.5 = 36.3$.`,
      },
      {
        type: 'paragraph',
        text: t`Valores ajustados: $21.6,\ 25.8,\ 30.0,\ 34.2,\ 38.4$. Residuos: $0.4,\ 0.2,\ -2.0,\ 1.8,\ -0.4$ (suman 0, como siempre en OLS con constante).`,
      },
      { type: 'paragraph', text: t`**Bondad de ajuste: $R^2$.**` },
      { type: 'formula', latex: t`R^2 = 1 - \frac{\text{SSR}}{\text{SST}}` },
      {
        type: 'list',
        items: [
          t`SSR: suma de residuos al cuadrado (variación **no explicada**). Aquí $0.16+0.04+4+3.24+0.16 = 7.6$.`,
          t`SST: variación total de $y$ respecto a su media. Aquí $64+16+4+36+64 = 184$.`,
          t`$R^2 = 1 - 7.6/184 \approx 0.96$: el modelo explica el 96 % de la variación del salario **en esta muestra**.`,
        ],
      },
      { type: 'miniCheck', questionIds: ['m3-q07'] },
      {
        type: 'callout',
        kind: 'cuidado',
        text: t`un $R^2$ alto **no** prueba causalidad ni que el modelo esté bien especificado. Y agregar variables nunca baja el $R^2$, aunque sean irrelevantes; para comparar modelos con distinto número de variables se usa el **$R^2$ ajustado**, que penaliza ese efecto.`,
      },
      { type: 'paragraph', text: t`**Inferencia sobre $\beta_1$** (aplicando el Módulo 2):` },
      {
        type: 'list',
        items: [
          t`Varianza estimada del error: $\hat\sigma^2 = \text{SSR}/(n-2) = 7.6/3 \approx 2.53$ (se divide por $n-2$ porque se estimaron 2 parámetros).`,
          t`Error estándar: $\text{ee}(\hat\beta_1) = \hat\sigma/\sqrt{\sum(x_i-\bar{x})^2} = 1.59/\sqrt{40} \approx 0.25$.`,
          t`Estadístico $t = 2.1/0.25 \approx 8.3$ con $gl = 3$. El valor crítico al 5 % es $3.18$, así que se rechaza $H_0: \beta_1 = 0$ (no hay relación).`,
          t`Intervalo de confianza al 95 %: $2.1 \pm 3.18\times0.25 \approx [1.30;\ 2.90]$.`,
        ],
      },
      { type: 'paragraph', text: '(Una muestra de 5 es solo didáctica: en la práctica se necesitan muchos más datos.)' },
      {
        type: 'extra',
        text: t`Un ejemplo de la vida cotidiana: metros cuadrados ($x$) y precio en miles de dólares ($y$) de cinco departamentos del mismo barrio. Con $x = 40, 50, 60, 70, 80$ e $y = 41, 44, 50, 56, 59$ resulta $\bar{x} = 60$ e $\bar{y} = 50$. El numerador es $180 + 60 + 0 + 60 + 180 = 480$ y el denominador $400+100+0+100+400 = 1000$, así que $\hat\beta_1 = 0.48$ y $\hat\beta_0 = 50 - 0.48\times60 = 21.2$. La recta $\hat{y} = 21.2 + 0.48x$ dice que cada metro cuadrado adicional se asocia con unos 480 dólares más; para un departamento de 65 m² predice $21.2 + 31.2 = 52.4$ mil dólares.`,
      },
      {
        type: 'intuition',
        title: 'La mejor recta que pasa "en el medio" de una nube de puntos',
        text: t`**1. La idea de fondo.** Tenés personas con sus años de estudio y sus salarios, dibujadas como puntos en un gráfico. La regresión busca **la recta que mejor resume la nube**: la que, en promedio, queda más cerca de todos los puntos. Con ella podés decir "por cada año más de estudio, el salario sube tanto" y hacer predicciones.

**2. Los ingredientes.** El salario es lo que querés explicar. Los años de estudio son lo que usás para explicarlo. El **término de error** reúne todo lo que influye en el salario pero que no está en tu modelo (suerte, motivación, habilidad). La **pendiente** dice cuánto sube el salario por cada año extra, y la **ordenada** es el punto de partida.

**3. "Mínimos cuadrados" significa "el menor error posible".** Entre todas las rectas posibles, se elige la que minimiza la suma de los errores al cuadrado (la misma idea que viste en el módulo 0, con la caminata hacia el fondo del valle). El **residuo** es lo que la recta falla en cada punto: el dato real menos lo que la recta predijo.

**4. Con los números de la guía.** Con 5 personas, la recta queda $\hat{y} = 4.8 + 2.1x$: cada año de estudio se asocia con **2.1 mil más de salario**. Para 15 años, la predicción es $36.3$. Los residuos suman cero, porque la recta queda "equilibrada" entre los puntos.

**5. ¿Qué tan bien encaja? El $R^2$.** Es un número de 0 a 1 que dice qué parte de las variaciones del salario explica el modelo. Acá es $0.96$: explica el 96 % de la variación de esta muestra. Cuidado: un $R^2$ alto no prueba que haya causalidad, y agregar variables nunca lo baja aunque sean inútiles, así que para comparar modelos conviene el $R^2$ ajustado.

**6. ¿La pendiente es real o casualidad?** Aplicás lo que viste en el módulo 2: error estándar, estadístico $t$ y un intervalo de confianza. Acá la pendiente queda entre aproximadamente $1.30$ y $2.90$ con 95 % de confianza. Con solo 5 datos todo esto es didáctico; en la práctica hacen falta muchos más.`,
      },
    ],
  },
  {
    id: '3.4',
    moduleId: 3,
    title: 'Regresión lineal múltiple',
    blocks: [
      { type: 'paragraph', text: 'Se agregan **más variables explicativas**:' },
      { type: 'formula', latex: t`y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_k x_k + u` },
      {
        type: 'paragraph',
        text: t`En forma matricial (Módulo 0.3): $y = X\beta + u$. OLS sigue minimizando la suma de los residuos al cuadrado.`,
      },
      {
        type: 'paragraph',
        text: t`**Interpretación clave.** $\beta_1$ es el efecto de $x_1$ sobre $y$ **manteniendo constantes las demás variables** del modelo, es decir, la versión *ceteris paribus*. *Ejemplo:* si $\widehat{\text{salario}} = 3 + 1.8\,\text{estudio} + 0.5\,\text{experiencia}$, entonces un año más de estudio se asocia con $1.8$ más de salario **entre personas con la misma experiencia**.`,
      },
      {
        type: 'paragraph',
        text: t`**Por qué incluir más variables:** para controlar factores que confunden y para explicar mejor $y$.`,
      },
      { type: 'subheading', text: 'Sesgo por variable omitida' },
      {
        type: 'paragraph',
        text: t`Si omites una variable que (a) afecta a $y$ y (b) está correlacionada con $x_1$, el coeficiente de $x_1$ **absorbe** parte de su efecto y queda sesgado.`,
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* en una regresión de salario sobre educación **sin** la habilidad. Las personas más hábiles ganan más y además estudian más, así que parte de lo que le atribuyes a la educación es en realidad habilidad: **sobreestimas** el retorno de la educación.`,
      },
      {
        type: 'paragraph',
        text: t`Regla del signo del sesgo: (efecto de la omitida sobre $y$) × (correlación entre la omitida y $x_1$). Positivo × positivo = sesgo positivo.`,
      },
      {
        type: 'extra',
        text: t`Un clásico: quienes toman vitaminas viven más años. Pero quienes las toman también suelen comer mejor, hacer ejercicio y controlarse con el médico. Si en la regresión de la longevidad sobre "toma vitaminas" omites los hábitos saludables (que alargan la vida y se correlacionan positivamente con tomar vitaminas), el coeficiente de las vitaminas queda sesgado hacia arriba: sobreestimas su efecto.`,
      },
      {
        type: 'intuition',
        title: 'Pesar varios ingredientes a la vez, y el peligro de olvidarse de uno',
        text: t`**1. Más de una causa a la vez.** En vez de explicar el salario solo con los años de estudio, sumás también la experiencia, y así. Es como una receta donde cada ingrediente tiene su propio peso.

**2. "Manteniendo lo demás igual".** El número de cada ingrediente se lee como el efecto de **ese** ingrediente cuando los otros no cambian. Si el modelo dice que un año más de estudio suma $1.8$ al salario, significa: entre personas con **la misma experiencia**, el que estudió un año más gana $1.8$ más. Por eso agregar variables sirve para limpiar la comparación.

**3. El peligro de la variable que falta.** Si te olvidás de un factor que influye en el resultado **y** está relacionado con lo que estás midiendo, tus números se contaminan. Un ejemplo claro: quienes toman vitaminas viven más años, pero también suelen comer mejor, hacer ejercicio y controlarse con el médico. Si no incluís esos hábitos, el efecto de esas costumbres se adjudica a las vitaminas y las ves como más poderosas de lo que son.

**4. Cómo adivinar hacia dónde se tuerce.** Es una cuenta de signos: ¿la variable olvidada sube el resultado? ¿Está relacionada de forma positiva con lo que medís? Si las dos respuestas son positivas, vas a **sobreestimar** el efecto. En el ejemplo de la educación, se sobreestima porque la habilidad hace ganar más y también lleva a estudiar más.`,
      },
    ],
  },
  {
    id: '3.5',
    moduleId: 3,
    title: 'Variables ficticias y logaritmos',
    blocks: [
      {
        type: 'list',
        items: [
          t`**Variable ficticia (*dummy*)**: toma valor 1 si se cumple una condición y 0 si no (1 = mujer, 0 = varón). Su coeficiente es la **diferencia promedio** de $y$ entre los dos grupos, manteniendo lo demás constante.`,
          t`**Logaritmos** (Módulo 0.5). Si la variable dependiente es $\ln(y)$, un coeficiente $\beta_1$ pequeño se interpreta como **cambio porcentual**: un aumento de una unidad en $x$ cambia $y$ en aproximadamente $100\cdot\beta_1\ \%$. *Ejemplo:* en $\ln(\text{salario}) = 0.9 + 0.08\,\text{estudio}$, cada año de estudio se asocia con un salario **aprox. 8 % mayor**. Se usa mucho porque salarios y precios tienen efectos más naturales en porcentaje que en valores absolutos.`,
        ],
      },
      {
        type: 'extra',
        text: t`En el precio de los departamentos, una variable ficticia puede ser "tiene balcón" (1 = sí, 0 = no). Si su coeficiente estimado es 5, los departamentos con balcón cuestan en promedio 5 mil dólares más que los que no lo tienen, a igual superficie y antigüedad. Y si el modelo fuera $\ln(\text{precio}) = 3 + 0.012\,\text{metros}$, cada metro cuadrado adicional se asociaría con un precio aproximadamente 1.2 % mayor.`,
      },
      {
        type: 'intuition',
        title: 'Interruptores de sí o no y cambios en porcentaje',
        text: t`**1. Una variable ficticia es un interruptor.** Vale 1 si se cumple algo ("tiene balcón") y 0 si no. Su coeficiente es simplemente la **diferencia promedio** entre quienes tienen y quienes no tienen esa condición, manteniendo lo demás igual. Si el coeficiente de "balcón" es 5, un departamento con balcón cuesta en promedio 5 mil dólares más que uno sin balcón de la misma superficie y antigüedad.

**2. Los logaritmos convierten saltos en porcentajes.** Muchas veces tiene más sentido hablar de "un 8 % más" que de "tantos pesos más". Si en lugar del salario usás su logaritmo, el coeficiente se lee casi directamente como porcentaje: con un coeficiente de $0.08$ por año de estudio, cada año de estudio se asocia con un salario de **aproximadamente 8 % mayor**.

**3. Por qué se usa tanto.** Un aumento de mil pesos significa mucho para quien gana poco y casi nada para quien gana mucho. En cambio, un aumento del 8 % se siente parecido en ambos casos. Es la razón por la que salarios y precios se miden con logaritmos.`,
      },
    ],
  },
  {
    id: '3.6',
    moduleId: 3,
    title: 'Supuestos de Gauss-Markov y propiedad BLUE',
    blocks: [
      { type: 'paragraph', text: 'Primero, dos conceptos:' },
      {
        type: 'list',
        items: [
          t`Un estimador es **insesgado** si, en promedio sobre muchas muestras, da el valor verdadero: $E(\hat\beta_j) = \beta_j$.`,
          t`Entre los insesgados, el más **eficiente** es el de **menor varianza** (el más preciso).`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Los cinco supuestos (condicionales a los valores de $X$; la sigla MLR viene de *Multiple Linear Regression* y la numeración es la del libro de Wooldridge):`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**MLR.1: Linealidad en los parámetros.** El modelo es lineal en los $\beta$. Admite términos como $x^2$ o $\ln x$, porque lo que debe ser lineal son los **coeficientes**, no las variables.`,
          t`**MLR.2: Muestreo aleatorio.** La muestra es representativa de la población.`,
          t`**MLR.3: Sin colinealidad perfecta.** Ninguna variable explicativa es combinación lineal exacta de otras (Módulo 0.3), y hay suficientes observaciones.`,
          t`**MLR.4: Media condicional cero (exogeneidad).** $E(u \mid x_1,\dots,x_k) = 0$. Todo lo que está en el error (habilidad, suerte…) **no está sistemáticamente relacionado** con las variables explicativas. **Es el supuesto crucial**, el que se rompe en los problemas de causalidad.`,
          t`**MLR.5: Homocedasticidad.** $\text{Var}(u \mid x_1,\dots,x_k) = \sigma^2$. La dispersión del error es **la misma** para cualquier valor de $x$.`,
        ],
      },
      {
        type: 'list',
        items: [
          t`Con **MLR.1 a MLR.4**, OLS es **insesgado**.`,
          t`Con **MLR.1 a MLR.5**, el **Teorema de Gauss-Markov** dice que OLS es **BLUE** (*Best Linear Unbiased Estimator*): entre todos los estimadores **lineales e insesgados**, es el de **menor varianza**.`,
          t`Para que los contrastes $t$ y $F$ sean exactos con muestras pequeñas se agrega un sexto supuesto: errores Normales. Con muestras grandes el TLC lo vuelve innecesario.`,
        ],
      },
      {
        type: 'extra',
        text: t`Imagina dos balanzas de baño. La primera marca, en promedio, tu peso verdadero, pero cada vez que te subes da un número distinto (a veces 2 kg de más, a veces de menos): es insesgada, pero poco precisa. La segunda marca siempre casi lo mismo, pero 3 kg de más: es precisa pero sesgada. "Insesgado" habla de acertar en promedio; "eficiente" habla de variar poco. BLUE es el mejor estimador entre los que aciertan en promedio y son lineales.`,
      },
      {
        type: 'intuition',
        title: 'Las cinco reglas del juego para que la recta sea confiable',
        text: t`**1. Dos virtudes de un buen estimador.** Es **insesgado** si en promedio acierta al valor verdadero. Y es **eficiente** si, entre los insesgados, es el que menos varía. Pensá en dos balanzas de baño: la primera acierta tu peso en promedio, pero da un número distinto cada vez (insesgada, pero poco precisa). La segunda da siempre lo mismo, pero con 3 kg de más (precisa, pero sesgada). Querés una que acierte **y** que sea estable.

**2. Las cinco reglas, en lenguaje común.**

**MLR.1 (lineal):** el modelo es una suma de ingredientes con pesos. Permite usar $x^2$ o $\ln x$, porque lo que debe ser lineal son los pesos, no las variables.

**MLR.2 (muestreo aleatorio):** la muestra representa a la población, como la cucharada bien revuelta.

**MLR.3 (sin ingredientes repetidos):** ninguna variable es una copia exacta de otras, como "edad en años" y "edad en meses".

**MLR.4 (nada escondido en el error):** todo lo que quedó fuera del modelo no se relaciona sistemáticamente con las variables que incluiste. Es **la regla más importante** y la que se rompe cuando hay problemas de causalidad.

**MLR.5 (misma dispersión en todas partes):** el error se desparrama igual en todos los niveles de la variable explicativa.

**3. Qué se obtiene con cada una.** Con las primeras cuatro, la recta acierta en promedio (insesgada). Con las cinco, el **Teorema de Gauss-Markov** dice que es la mejor entre las rectas insesgadas, es decir, la más precisa. Eso es lo que significa **BLUE**. Con muestras pequeñas, para que las pruebas sean exactas se pide además que los errores sigan una campana (Normal); con muestras grandes, el Teorema del Límite Central lo vuelve innecesario.`,
      },
    ],
  },
  {
    id: '3.7',
    moduleId: 3,
    title: 'Cuando fallan los supuestos',
    blocks: [
      { type: 'subheading', text: 'Heterocedasticidad (falla MLR.5)' },
      {
        type: 'paragraph',
        text: t`La dispersión del error **cambia** con $x$. *Ejemplo:* el gasto en entretenimiento varía muchísimo más entre hogares ricos que entre pobres. Al graficar los residuos contra $x$ se ve un **megáfono** (abanico que se abre).`,
      },
      {
        type: 'list',
        items: [
          t`**Consecuencias:** OLS **sigue siendo insesgado** (si MLR.4 se cumple), pero **deja de ser el más eficiente** y los **errores estándar usuales son incorrectos**, así que los contrastes $t$ y $F$ y los intervalos **no son confiables**.`,
          t`**Solución habitual:** usar **errores estándar robustos** (de White), o mínimos cuadrados ponderados.`,
        ],
      },
      {
        type: 'extra',
        text: t`Predecir cuánto tarda un viaje según la distancia: en trayectos de 2 km casi todos tardan entre 8 y 12 minutos, pero en trayectos de 30 km puede variar entre 35 minutos y más de una hora, según el tránsito. El error es pequeño para distancias cortas y grande para las largas: heterocedasticidad.`,
      },
      { type: 'subheading', text: 'Correlación serial (típica en series de tiempo)' },
      {
        type: 'paragraph',
        text: t`El error de un período se **relaciona con el de períodos anteriores** (una crisis que se arrastra). Consecuencia parecida: los errores estándar usuales dejan de ser válidos. Solución habitual: errores estándar robustos a autocorrelación (Newey-West).`,
      },
      { type: 'subheading', text: 'Endogeneidad (falla MLR.4)' },
      {
        type: 'paragraph',
        text: t`Una variable explicativa **está correlacionada con el error $u$**. Consecuencia grave: OLS es **sesgado e inconsistente**. *Inconsistente* significa que **aunque tengas infinitos datos, no converge al valor verdadero**: más datos no lo arreglan. Tres causas típicas:`,
      },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**Variable omitida** (la habilidad del ejemplo anterior).`,
          t`**Error de medición** en $x$: cuando la variable explicativa se mide con ruido, el coeficiente tiende a quedar **más cerca de cero** de lo real (sesgo de atenuación).`,
          t`**Simultaneidad**: $x$ e $y$ se determinan **mutuamente** (precio y cantidad en un mercado: cada uno afecta al otro).`,
        ],
      },
      { type: 'subheading', text: 'Variables instrumentales (IV) y mínimos cuadrados en dos etapas (2SLS)' },
      {
        type: 'paragraph',
        text: t`Idea: encontrar una variable $z$, el **instrumento**, que mueva a $x$ **sin tener relación con el error**. Para ser válido debe cumplir:`,
      },
      {
        type: 'list',
        items: [
          t`**Relevancia:** $z$ está correlacionada con $x$.`,
          t`**Exogeneidad (exclusión):** $z$ **no** está correlacionada con $u$, y afecta a $y$ **solo a través de** $x$.`,
        ],
      },
      { type: 'paragraph', text: '**2SLS en dos pasos:**' },
      {
        type: 'list',
        ordered: true,
        items: [
          t`**Primera etapa:** regresar $x$ sobre $z$ (y los controles) para obtener $\hat{x}$, la parte de $x$ "limpia", explicada solo por el instrumento.`,
          t`**Segunda etapa:** regresar $y$ sobre $\hat{x}$.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* educación → salario, con la habilidad omitida. Instrumento posible: la **distancia a la universidad más cercana** durante la adolescencia. Mueve cuánto estudia la persona (relevancia) y, se argumenta, no afecta directamente al salario (exclusión). *Advertencia:* la exclusión **no se puede probar con los datos**: se defiende con argumentos, y un instrumento débil (poco correlacionado con $x$) da resultados poco confiables.`,
      },
      {
        type: 'extra',
        text: t`Un instrumento clásico: la lotería del servicio militar de los años 70 en Estados Unidos. Para saber si ser veterano afecta los ingresos posteriores, no sirve comparar veteranos con no veteranos (los que se enlistan suelen ser distintos). Pero el número que te tocaba en el sorteo era puro azar (exogeneidad) y sí influía en si terminabas haciendo el servicio (relevancia), así que sirve de instrumento.`,
      },
      {
        type: 'intuition',
        title: 'Cuando las reglas se rompen: tres problemas y un atajo ingenioso',
        text: t`**1. Dispersión que cambia (heterocedasticidad).** Si gastás en entretenimiento, entre hogares pobres casi todos gastan parecido, y entre hogares ricos la diferencia es enorme. El error es chico en un extremo y grande en el otro; al graficarlo se ve un megáfono. La recta sigue acertando en promedio, pero los márgenes de error que calcula están mal. Solución habitual: calcular los errores de otra manera, más robusta.

**2. El error que arrastra memoria (correlación serial).** En series de tiempo, una crisis no desaparece de golpe: el error de hoy se parece al de ayer. Tiene la misma consecuencia: los márgenes de error usuales dejan de servir. Se arregla con un cálculo robusto a esa memoria.

**3. El problema serio: la endogeneidad.** Pasa cuando una variable que usás está relacionada con lo que quedó en el error. Entonces la estimación es **sesgada e inconsistente**: aunque tengas infinitos datos, no te acerca a la verdad. Más datos no lo arreglan. Tres causas típicas: olvidar una variable importante, medir mal una variable (lo que tiende a acercar el efecto a cero) y que las dos cosas se influyan mutuamente, como precio y cantidad en un mercado.

**4. El atajo ingenioso: el instrumento.** Se busca una variable que empuje a lo que querés medir pero **sin tener ninguna otra vía** de influir en el resultado. Por ejemplo, para saber si estudiar sube el salario (con la habilidad escondida), se usa la distancia a la universidad: mueve cuánto estudia la gente, y no parece afectar el sueldo por otra vía. Se hace en dos pasos: primero se saca de la variable la parte "limpia", la que mueve el instrumento, y después se usa esa parte para explicar el resultado.

**5. Una advertencia honesta.** Que el instrumento no afecte al resultado por otras vías no se puede probar con los datos: se defiende con argumentos. Y un instrumento que apenas mueve la variable da resultados poco confiables.`,
      },
    ],
  },
  {
    id: '3.8',
    moduleId: 3,
    title: 'Datos de panel y diferencias en diferencias',
    blocks: [
      { type: 'subheading', text: 'Datos de panel' },
      { type: 'paragraph', text: t`Con las mismas unidades $i$ observadas en varios períodos $t$:` },
      { type: 'formula', latex: t`y_{it} = \beta_1 x_{it} + a_i + u_{it}` },
      {
        type: 'list',
        items: [
          t`$a_i$ = **efecto no observado de la unidad $i$ que no cambia en el tiempo** (habilidad innata de una persona, cultura de una empresa).`,
          t`$u_{it}$ = error que varía en el tiempo.`,
        ],
      },
      {
        type: 'paragraph',
        text: t`Si $a_i$ está correlacionado con $x_{it}$ y lo ignoras, tienes variable omitida (endogeneidad). El panel permite sortearlo:`,
      },
      {
        type: 'list',
        items: [
          t`**Efectos fijos (FE).** Se resta a cada variable **el promedio de su propia unidad** (transformación *within*). Como $a_i$ es constante en el tiempo, **desaparece**:`,
        ],
      },
      { type: 'formula', latex: t`(y_{it} - \bar{y}_i) = \beta_1 (x_{it} - \bar{x}_i) + (u_{it} - \bar{u}_i)` },
      {
        type: 'paragraph',
        text: t`*Ejemplo:* si una empresa tiene $x = 1, 3, 5$, su promedio es 3 y los valores transformados son $-2, 0, 2$. Se usa solo la **variación dentro de cada unidad**. Permite que $a_i$ esté correlacionado con $x$. **Costo:** no se puede estimar el efecto de variables que **no cambian** en el tiempo (el género, el sector fijo de una empresa).`,
      },
      { type: 'miniCheck', questionIds: ['m3-q14'] },
      {
        type: 'list',
        items: [
          t`**Efectos aleatorios (RE).** Supone que $a_i$ **no** está correlacionado con las explicativas. Si es cierto, es **más eficiente** (usa mínimos cuadrados generalizados y aprovecha también la variación entre unidades). Si es falso, es sesgado.`,
          t`**¿Cuál elegir?** Si hay dudas sobre la correlación entre $a_i$ y $x$, FE es la opción más segura. Se suele apoyar la decisión en el **test de Hausman**.`,
        ],
      },
      {
        type: 'extra',
        text: t`Efectos fijos es comparar a cada persona consigo misma. Si estudias el efecto de una dieta sobre el peso, medir a las mismas 100 personas antes y después elimina todo lo que no cambia de cada una (su altura, su contextura, su genética), que de otro modo mezclarían las cosas al comparar personas distintas entre sí.`,
      },
      { type: 'subheading', text: 'Diferencias en diferencias (DID)' },
      {
        type: 'paragraph',
        text: t`Sirve para evaluar el impacto de una **política o intervención** que afecta a un grupo (tratamiento) y no a otro (control), con datos **antes y después**. Se calcula:`,
      },
      {
        type: 'formula',
        latex: t`\hat\delta_{\text{DID}} = (\bar{y}_{\text{Trat,Post}} - \bar{y}_{\text{Trat,Pre}}) - (\bar{y}_{\text{Ctrl,Post}} - \bar{y}_{\text{Ctrl,Pre}})`,
      },
      {
        type: 'paragraph',
        text: t`*Por qué restar dos veces:* comparar solo "antes y después" del grupo tratado mezcla el efecto de la política con otras tendencias del tiempo. El grupo de control **captura esas tendencias comunes**, y se restan.`,
      },
      { type: 'miniCheck', questionIds: ['m3-q10'] },
      {
        type: 'paragraph',
        text: t`*Ejemplo (cifras inventadas).* Una provincia sube el salario mínimo; otra no. Empleo promedio por comercio:`,
      },
      {
        type: 'table',
        headers: ['', 'Antes', 'Después', 'Cambio'],
        rows: [
          ['Tratamiento', '20', '21', t`$+1$`],
          ['Control', '25', '23', t`$-2$`],
        ],
        illustrative: true,
      },
      {
        type: 'paragraph',
        text: t`$\hat\delta_{\text{DID}} = (+1) - (-2) = +3$. Sin la política, el grupo tratado habría bajado como el control; por eso el efecto estimado es $+3$.`,
      },
      {
        type: 'paragraph',
        text: t`**Supuesto central: tendencias paralelas.** Sin la política, ambos grupos habrían evolucionado **igual**. No se puede verificar del todo, pero se evalúa mirando si sus tendencias eran paralelas **antes** de la intervención.`,
      },
      {
        type: 'extra',
        text: t`Imagina que se habilita un carril exclusivo para colectivos en una avenida y el tiempo de viaje en hora pico baja de 40 a 30 minutos. ¿Fue el carril? Otra avenida, sin carril, también bajó de 38 a 36 minutos en las mismas semanas (menos tránsito por las vacaciones). Entonces $\hat\delta_{\text{DID}} = (30-40) - (36-38) = -10 - (-2) = -8$: el carril ahorra unos 8 minutos; los otros 2 los explica la tendencia común. El clásico del campo es el estudio de Card y Krueger sobre el salario mínimo en New Jersey, comparado con la vecina Pennsylvania.`,
      },
      {
        type: 'intuition',
        title: 'Compararte con vos mismo y con tu gemelo que no recibió la medida',
        text: t`**1. El panel permite comparar a cada uno consigo mismo.** Cada persona o empresa tiene rasgos propios que no cambian (su genética, la cultura de la empresa). Si no los medís, contaminan el análisis. La solución de los **efectos fijos** es restar a cada dato el promedio de **esa misma** unidad. Es como medir el efecto de una dieta pesando a las mismas 100 personas antes y después: su altura, contextura y genética quedan fuera de la comparación, porque son las mismas en las dos pesadas. El costo es que no podés estudiar el efecto de cosas que nunca cambian, como el género.

**2. Efectos aleatorios.** Es una alternativa que supone que esos rasgos propios no se relacionan con lo que estudiás. Si es cierto, es más preciso. Si es falso, queda sesgada. Si dudás, la opción más segura son los efectos fijos.

**3. Diferencias en diferencias: antes, después y un grupo de control.** Imaginá que una provincia sube el salario mínimo y otra no. Mirar solo "antes y después" de la provincia que cambió mezcla el efecto de la medida con lo que pasaba de todos modos en el tiempo. Entonces se resta lo que le pasó a la otra provincia. En el ejemplo, el empleo sube $1$ donde se aplicó la medida y baja $2$ en la otra: el efecto estimado es $(+1) - (-2) = +3$. Es como separar lo que cambió por la medida de lo que habría cambiado igual.

**4. El supuesto clave: tendencias paralelas.** Todo funciona si, sin la medida, los dos grupos habrían evolucionado igual. No se puede comprobar del todo, pero se puede mirar si ya iban en la misma dirección **antes** de que apareciera la medida. (Esas cifras del ejemplo son inventadas para ilustrar el método.)`,
      },
    ],
  },
]
