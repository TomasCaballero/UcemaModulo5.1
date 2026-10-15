# PRD-001: Curso Interactivo de Estadística, Econometría y Ciencia de Datos — web app con módulos, simulaciones y evaluaciones

**Estado:** v2 (hallazgos de la auditoría 1 aprobados y aplicados; pendiente segunda auditoría)
**Confirmado por el usuario:** SPA estática sin backend; progreso, historial y repetición espaciada; preguntas redactadas desde la guía; 8 módulos completos desde el inicio; funciones extra RF-20, RF-30, RF-31, RF-40, RF-42 y RNF-13; cifras de los RNF; decisiones técnicas propuestas.
**Fuente de contenido:** `recorrido-guias-de-aprendizaje-v3.md` (Módulos 0 a 7, Glosario, Cuadro síntesis)

---

## Contexto y Problema

### El dolor
La guía de estudio existe y es completa (8 módulos, ~1700 líneas), pero está en un archivo Markdown largo. El usuario tiene dificultad para sentarse a leer apuntes extensos: se pierde la motivación, no se retiene, y las relaciones entre conceptos (p. ej. "el promedio minimiza la suma de cuadrados" → OLS → K-Means) quedan escondidas en referencias del tipo "ver Módulo 0.4". La propia guía (Módulo 1) advierte que releer da una falsa sensación de saber; hace falta practicar recuperación activa, y hoy las autoevaluaciones están a un scroll de distancia de sus respuestas.

### Personas
| Persona | Descripción | Qué necesita |
| :--- | :--- | :--- |
| **P1 — Estudiante de posgrado (usuario principal)** | Estudia ciencia de datos mientras trabaja. Parte de matemática de secundaria. Estudia en sesiones cortas, desde la PC y desde el celular. | Aprender sin leer paredes de texto; ver y manipular los conceptos; saber qué domina y qué no; retomar donde dejó. |

La app es de **usuario único, local al dispositivo** (sin cuentas).

---

## Objetivos

1. **Cobertura total:** todo el contenido de la guía aparece en el curso, sin omitir módulos, secciones, ejemplos numéricos, fórmulas, tablas, analogías, glosario ni autoevaluaciones.
2. **Aprender haciendo:** cada concepto clave se puede manipular (animación o simulación), no solo leer.
3. **Recuperación activa:** cada módulo termina con una evaluación de opción múltiple (4 o 5 opciones) y las preguntas falladas se repasan con repetición espaciada.
4. **Conceptos conectados:** el usuario puede navegar de un concepto a los que lo usan o lo anticipan (mapa de conceptos y enlaces cruzados).
5. **Usable en cualquier dispositivo:** la experiencia es completa en celular y en escritorio.
6. **Métrica de éxito de producto:** el usuario completa los 8 módulos y logra ≥ 80 % en cada evaluación de módulo.

---

## Requerimientos Funcionales

### Estructura y navegación
- **RF-01:** El sistema debe mostrar una pantalla de inicio con los 8 módulos (0 a 7) en el orden de la guía.
- **RF-02:** El sistema debe dividir cada módulo en las secciones numeradas de la guía (p. ej. 0.1, 0.2, … 7.7), cada una accesible por separado.
- **RF-03:** El sistema debe ofrecer navegación "anterior / siguiente" entre secciones.
- **RF-04:** El sistema debe mostrar el índice de secciones del módulo actual en todo momento (barra lateral en escritorio, menú desplegable en celular).
- **RF-05:** El sistema debe permitir abrir cualquier módulo sin haber completado los anteriores.
- **RF-06:** El sistema debe mostrar la sugerencia de orden de estudio de la guía ("Cómo estudiar con esta guía") en el inicio.

### Contenido
- **RF-07:** El sistema debe presentar el texto de cada sección de la guía, incluyendo sus definiciones y analogías.
- **RF-43:** El sistema debe presentar las notas de advertencia de la guía ("Cuidado", "Ojo", "Advertencia", "Salvedad") con un estilo visual diferenciado.
- **RF-44:** El sistema debe presentar las tablas de la guía en formato tabular legible en pantallas de 360 px de ancho.
- **RF-08:** El sistema debe renderizar las fórmulas matemáticas en notación matemática (no como texto plano).
- **RF-09:** El sistema debe presentar cada ejemplo numérico de la guía con su cálculo paso a paso.
- **RF-10:** El sistema debe presentar el Anexo opcional del Módulo 1 (Nyquist-Shannon y red de Eddington) marcado como "opcional".
- **RF-11:** El sistema debe incluir el Glosario completo, buscable por término.
- **RF-12:** El sistema debe enlazar cada término del glosario con la sección donde se explica.
- **RF-13:** El sistema debe incluir el Cuadro síntesis: la escalera del conocimiento, la tabla "¿Qué técnica uso para qué problema?" y la lista de "Los errores más comunes".
- **RF-14:** El sistema debe mostrar, en cada concepto que referencia a otro módulo (p. ej. "ver Módulo 0.4"), un enlace que lleve a esa sección.
- **RF-15:** El sistema debe mostrar un mapa de conceptos navegable que represente las dependencias entre secciones.
- **RF-16:** El sistema debe resaltar las tablas y los ejemplos que la guía marca como "ilustrativos / cifras inventadas" con una etiqueta visible.

### Interactividad y animaciones
- **RF-17:** El sistema debe incluir, por cada módulo, las simulaciones interactivas listadas en la sección "Catálogo de interactivos" de este PRD.
- **RF-45:** El sistema debe montar cada simulación sin errores de ejecución en consola.
- **RF-18:** El sistema debe permitir al usuario modificar los parámetros de cada simulación mediante controles (deslizadores, campos numéricos o selectores) y actualizar el resultado en pantalla.
- **RF-19:** El sistema debe ofrecer controles de reproducir, pausar y reiniciar en cada animación paso a paso.
- **RF-20:** El sistema debe permitir al usuario rehacer cada ejemplo numérico ingresando su propia respuesta y mostrando el resultado correcto.
- **RF-21:** El sistema debe mostrar una versión estática (imagen o descripción textual) de cada simulación cuando el usuario tenga activada la preferencia del sistema "reducir movimiento".

### Evaluaciones
- **RF-22:** El sistema debe incluir una evaluación de opción múltiple al final de cada módulo (0 a 7).
- **RF-23:** El sistema debe cubrir, en el banco de preguntas de cada módulo, todas las preguntas de "Autoevaluación" de ese módulo en la guía.
- **RF-24:** El sistema debe presentar cada pregunta con 4 o 5 opciones y exactamente una correcta.
- **RF-25:** El sistema debe aleatorizar el orden de las opciones en cada intento.
- **RF-26:** El sistema debe mostrar, tras responder cada pregunta, si fue correcta y la explicación de la respuesta (basada en la sección "Respuestas" de la guía).
- **RF-27:** El sistema debe enlazar cada explicación con la sección de la guía donde se trata el concepto.
- **RF-28:** El sistema debe mostrar al finalizar una evaluación el puntaje total y la lista de preguntas falladas.
- **RF-29:** El sistema debe permitir reintentar una evaluación cuantas veces el usuario quiera.
- **RF-30:** El sistema debe ofrecer mini-chequeos de 1 a 3 preguntas dentro de las secciones de cada módulo, antes de mostrar la explicación completa.
- **RF-31:** El sistema debe pedir al usuario que estime su dominio (confianza) antes de ver el resultado de una evaluación, y mostrar luego la diferencia entre su estimación y su resultado (aplicación del Módulo 1.1, descalibración metacognitiva).

### Progreso y repaso
- **RF-32:** El sistema debe marcar una sección como completada cuando el usuario la recorra hasta el final o pulse "Marcar como vista".
- **RF-33:** El sistema debe mostrar el porcentaje de secciones completadas por módulo y en total.
- **RF-34:** El sistema debe guardar el progreso en el dispositivo del usuario.
- **RF-35:** El sistema debe permitir retomar el estudio en la última sección visitada desde la pantalla de inicio.
- **RF-36:** El sistema debe guardar el historial de intentos de cada evaluación (fecha, puntaje, preguntas falladas).
- **RF-37:** El sistema debe mostrar el historial de puntajes por módulo.
- **RF-38:** El sistema debe programar el reaparecimiento de cada pregunta fallada según un calendario de repetición espaciada.
- **RF-39:** El sistema debe ofrecer una sesión de repaso con las preguntas cuya fecha de repaso llegó.
- **RF-40:** El sistema debe permitir exportar el progreso a un archivo y reimportarlo en otro dispositivo.
- **RF-41:** El sistema debe permitir borrar todo el progreso, previa confirmación del usuario.

### Búsqueda
- **RF-42:** El sistema debe ofrecer búsqueda de texto sobre secciones y glosario.

---

## Catálogo de interactivos

Cada fila es un componente que debe existir (RF-17). La columna "Guía" indica el contenido que visualiza.

| ID | Módulo | Interactivo | Qué permite hacer | Guía |
| :--- | :--- | :--- | :--- | :--- |
| IN-01 | 0 | Calculadora de sumatoria y promedio | Editar una lista y ver $\sum$ y $\bar{x}$ | 0.1 |
| IN-02 | 0 | Simulador de probabilidad con dados y monedas | Tirar repetidamente y comparar frecuencia vs. $P(A)$; probar independencia | 0.2 |
| IN-03 | 0 | Diagrama de población para Bayes (test médico) | Variar prevalencia, sensibilidad y falsos positivos; ver los 1000 individuos coloreados y $P(\text{enfermo}\mid +)$ | 0.2 |
| IN-04 | 0 | Esperanza y varianza del dado | Cambiar probabilidades de caras y ver $E(X)$, Var | 0.2 |
| IN-05 | 0 | Producto interno y combinación lineal | Editar vectores y coeficientes; ver el resultado | 0.3 |
| IN-06 | 0 | Hiperplano en 2D | Mover $w$ y $b$ y ver qué lado clasifica cada punto | 0.3 |
| IN-07 | 0 | Pendiente y derivada | Mover un punto sobre una curva y ver la tangente | 0.4 |
| IN-08 | 0 | "El promedio minimiza la suma de cuadrados" | Arrastrar $b$ y ver $S(b)$ con mínimo en $\bar{y}$ | 0.4 |
| IN-09 | 0 | Descenso por gradiente | Elegir punto inicial y tasa de paso; ver la bajada paso a paso | 0.4 |
| IN-10 | 0 | Gráfica de $e^x$ y $\ln x$ | Ver la inversa y la propiedad $\ln(ab)=\ln a+\ln b$ | 0.5 |
| IN-11 | 1 | Quiz de descalibración (velocímetro) | Estimar-vs-resultado como en RF-31 | 1.1 |
| IN-12 | 1 | Clasificador de órdenes de ignorancia | Arrastrar ejemplos al orden 0OI/1OI/2OI/3OI | 1.2 |
| IN-13 | 1 | Escalera de mesetas de Leonard | Animación de la curva de aprendizaje y los 4 perfiles | 1.3 |
| IN-14 | 1 | Distancia de Hamming | Voltear bits de dos cadenas y ver la distancia; ver corrección de 1 bit con distancia 3 | 1.6 |
| IN-15 | 1 | Dígito verificador | Transponer dígitos y ver cómo la suma simple falla y la ponderada detecta | 1.6 |
| IN-16 | 1 | Aliasing (Nyquist) | Variar frecuencia de muestreo y ver la señal reconstruida | Anexo |
| IN-17 | 2 | Explorador de media/mediana/moda y outliers | Arrastrar un dato y ver cómo reacciona cada medida | 2.2 |
| IN-18 | 2 | Clasificador de escalas de Stevens | Asignar variables a nominal/ordinal/intervalo/razón | 2.3 |
| IN-19 | 2 | Galería de distribuciones | Variar parámetros de Binomial, Poisson, Normal, $t$, $\chi^2$, $F$ y ver la forma; calcular áreas | 2.4 |
| IN-20 | 2 | Regla 68-95-99.7 y puntaje $z$ | Marcar un valor y ver $z$ y área en cola | 2.4 |
| IN-21 | 2 | Simulador del TLC | Elegir población (sesgada, uniforme, etc.) y $n$; ver crecer la distribución de $\bar{x}$ | 2.5 |
| IN-22 | 2 | Intervalos de confianza repetidos ("aro y estaca") | Lanzar 100 muestras; ver cuántos intervalos cubren $\mu$ | 2.6 |
| IN-23 | 2 | Verosimilitud de la moneda | Mover $p$ y ver $L(p)$ con máximo en $\hat p$ | 2.6 |
| IN-24 | 2 | Contraste de hipótesis | Mover $\bar{x}$, $s$, $n$, $\alpha$; ver estadístico, p-valor y zona de rechazo | 2.7 |
| IN-25 | 2 | Errores Tipo I/II y potencia | Variar $\alpha$, $n$ y tamaño del efecto; ver $\beta$ y potencia | 2.7 |
| IN-26 | 2 | Significativo vs. relevante | Variar $n$ y $d$ de Cohen; ver p-valor y tamaño del efecto | 2.7 |
| IN-27 | 3 | Selector de estructura de datos | Clasificar casos como corte transversal/serie/acumulado/panel | 3.1 |
| IN-28 | 3 | Variable de confusión | Activar/desactivar el confusor (calor→helados/ahogamientos) y ver la correlación | 3.2 |
| IN-29 | 3 | OLS interactivo | Arrastrar puntos y ver recta, residuos, SSR, $R^2$; comparar con la recta óptima | 3.3 |
| IN-30 | 3 | Inferencia de $\beta_1$ | Ver ee, $t$ e IC del ejemplo de 5 datos | 3.3 |
| IN-31 | 3 | Sesgo por variable omitida | Variar correlaciones y ver el sesgo del coeficiente | 3.4 |
| IN-32 | 3 | Heterocedasticidad | Generar datos con varianza creciente; ver el "megáfono" en residuos | 3.7 |
| IN-33 | 3 | IV / 2SLS paso a paso | Ver primera y segunda etapa con datos de ejemplo | 3.7 |
| IN-34 | 3 | Efectos fijos (transformación *within*) | Ver cómo se restan promedios por unidad y desaparece $a_i$ | 3.8 |
| IN-35 | 3 | Diferencias en diferencias | Mover las 4 medias y ver el efecto y el contrafactual (tendencias paralelas) | 3.8 |
| IN-36 | 4 | Tubería KDD | Recorrer las 3 etapas con el ejemplo de fraude | 4.1 |
| IN-37 | 4 | Preprocesamiento | Escalado min-max y $z$, *one-hot* y discretización sobre datos de ejemplo | 4.2 |
| IN-38 | 4 | Árbol de decisión paso a paso | Elegir divisiones y ver entropía, Gini y ganancia; límite de profundidad y sobreajuste | 4.3 |
| IN-39 | 4 | Matriz de confusión | Editar VP/FP/FN/VN y ver exactitud, precisión, recall, $F_1$; ejemplo "nadie está enfermo" | 4.3 |
| IN-40 | 4 | Apriori por niveles | Cambiar soporte mínimo y ver qué conjuntos se descartan; calcular soporte/confianza/lift | 4.4 |
| IN-41 | 4 | DBSCAN | Mover Eps y MinPts; ver puntos núcleo/borde/ruido y grupos | 4.5 |
| IN-42 | 5 | LPM vs. logística | Superponer ambos ajustes y ver probabilidades fuera de [0,1] | 5.1 |
| IN-43 | 5 | Función logística, odds y OR | Mover $\beta_0,\beta_1$; ver $p$, odds, log-odds, OR y efecto marginal | 5.2 |
| IN-44 | 5 | Umbral, ROC y AUC | Mover el umbral y ver el punto sobre la curva ROC y el AUC | 5.2 |
| IN-45 | 5 | Logit vs. probit | Superponer curvas y ver la relación de escala de coeficientes | 5.3 |
| IN-46 | 5 | LDA/QDA | Mover medias, varianzas y *a priori*; ver frontera lineal vs. cuadrática | 5.4 |
| IN-47 | 5 | Naive Bayes de spam | Elegir palabras presentes; ver el producto de verosimilitudes y la posterior; suavizado de Laplace | 5.4 |
| IN-48 | 6 | Sesgo-varianza con polinomios | Elegir grado; ver error de entrenamiento y de prueba (curva en U) | 6.2 |
| IN-49 | 6 | Validación cruzada $k$-fold | Animar la rotación de particiones | 6.3 |
| IN-50 | 6 | Bootstrap y OOB | Generar remuestras; ver que ~63 % entra y ~37 % queda fuera | 6.3, 6.5 |
| IN-51 | 6 | Ridge vs. Lasso | Variar $\lambda$ y ver trayectorias de coeficientes; ver la geometría círculo vs. rombo | 6.4 |
| IN-52 | 6 | PCA | Rotar la dirección de proyección y ver varianza capturada; diagrama de varianza explicada | 6.4 |
| IN-53 | 6 | Varianza del promedio de árboles | Variar $B$, $\sigma^2$, $\rho$; ver $\rho\sigma^2+\frac{1-\rho}{B}\sigma^2$ | 6.5 |
| IN-54 | 6 | Bagging / bosque aleatorio | Variar número de árboles y $m$; ver la frontera suavizarse | 6.5 |
| IN-55 | 6 | Boosting | Agregar árboles de a uno con tasa $\lambda$; ver el residuo caer | 6.5 |
| IN-56 | 6 | SVM | Mover puntos; ver margen y vectores de soporte; variar tolerancia, kernel, $d$, $\gamma$ | 6.6 |
| IN-57 | 6 | Truco del kernel en 1D | Ver cómo $x \to (x, x^2)$ vuelve separables los datos | 6.6 |
| IN-58 | 6 | K-Means paso a paso | Colocar centroides, asignar, recalcular; ver SSE y método del codo | 6.7 |
| IN-59 | 6 | Clustering jerárquico | Construir el dendrograma, cambiar el enlace y cortar a una altura | 6.7 |
| IN-60 | 7 | Memoria vs. inducción | Comparar la "función memoria" con un clasificador acotado | 7.1, 7.2 |
| IN-61 | 7 | Riesgo real vs. empírico | Variar $m$ y ver la brecha | 7.2 |
| IN-62 | 7 | Calculadora de tamaño de muestra PAC | Variar $\lvert\mathcal{H}\rvert,\epsilon,\delta$ (realizable y agnóstico) | 7.2, 7.3 |
| IN-63 | 7 | Pérdida *hinge* vs. 0-1 | Mover $\langle w,x\rangle$ y ver ambas pérdidas | 7.2 |
| IN-64 | 7 | Fragmentación (*shattering*) | Probar umbrales, intervalos y rectas sobre 1–4 puntos y las $2^k$ etiquetas | 7.4 |
| IN-65 | 7 | No-Free-Lunch | Ver reglas compatibles con $2,4,6,8$ | 7.5 |
| IN-66 | 7 | Cota de Ockham/MDL | Variar bits y $m$; ver el margen de error | 7.6 |
| IN-67 | 7 | Mapa de conexiones teoría ↔ práctica | Tabla 7.7 navegable | 7.7 |

---

## Requerimientos No Funcionales

**Rendimiento**
- **RNF-01:** El sistema debe cargar la pantalla de inicio en < 3 s (p95) en una conexión 4G simulada (1.6 Mbps, 150 ms RTT) con caché vacía.
- **RNF-02:** El sistema debe mostrar una sección nueva en < 500 ms (p95) tras navegar a ella (con la app ya cargada).
- **RNF-03:** Cada simulación debe responder a un cambio de parámetro en < 100 ms (p95) en un celular de gama media (equivalente a Moto G Power 2022).
- **RNF-04:** Las animaciones deben mantener ≥ 30 fps en el mismo dispositivo de referencia.
- **RNF-05:** El peso inicial de descarga (JS+CSS+HTML, comprimido) debe ser ≤ 300 KB; el código de cada módulo debe cargarse bajo demanda.

**Responsive y accesibilidad**
- **RNF-06:** La interfaz debe ser utilizable sin scroll horizontal desde 360 px hasta 1920 px de ancho.
- **RNF-07:** Todos los controles táctiles deben tener un área mínima de 44 × 44 px.
- **RNF-08:** El sistema debe obtener ≥ 90 en Accesibilidad de Lighthouse en cada tipo de pantalla (inicio, sección, evaluación, glosario).
- **RNF-09:** El contraste de texto debe ser ≥ 4.5:1 (WCAG AA).
- **RNF-10:** Toda la navegación, las evaluaciones y los controles de simulación deben ser operables solo con teclado.
- **RNF-11:** Cada simulación debe tener una descripción textual accesible (`aria-label` o texto equivalente) de lo que muestra.

**Compatibilidad y disponibilidad**
- **RNF-12:** El sistema debe funcionar en las 2 últimas versiones estables de Chrome, Safari (iOS y macOS), Firefox y Edge.
- **RNF-13:** Tras la primera visita, el sistema debe funcionar sin conexión de red para todas las secciones, simulaciones y evaluaciones.

**Confiabilidad y datos**
- **RNF-14:** El progreso debe persistir tras cerrar y reabrir el navegador, con 0 pérdidas en 100 ciclos de prueba automatizados.
- **RNF-15:** El sistema debe seguir mostrando el contenido si el almacenamiento local no está disponible, avisando al usuario que el progreso no se guardará.
- **RNF-16:** El archivo exportado debe reimportarse sin pérdida de datos: 100 % de los registros idénticos tras exportar e importar.

**Fidelidad del contenido**
- **RNF-17:** El 100 % de los encabezados de nivel 2 y 3 (`##`, `###`) de la guía deben tener una sección equivalente en el curso, verificado por un script automatizado.
- **RNF-18:** El 100 % de los resultados numéricos de los ejemplos de la guía deben coincidir con los calculados por el curso (tolerancia de redondeo a 3 decimales), verificado por tests automatizados.
- **RNF-19:** El 100 % de las preguntas de autoevaluación de la guía (M0: 7, M1: 6, M2: 10, M3: 11, M4: 10, M5: 11, M6: 15, M7: 12; total 82) deben tener al menos una pregunta de opción múltiple equivalente en el banco.
- **RNF-20:** Cada módulo debe tener ≥ 12 preguntas en su banco de evaluación.

**Privacidad**
- **RNF-21:** El sistema debe enviar 0 datos de progreso o respuestas del usuario a servidores externos.

**Mantenibilidad**
- **RNF-22:** La cobertura de tests automatizados de la lógica de negocio (cálculos, evaluaciones, repetición espaciada, persistencia) debe ser ≥ 85 %.
- **RNF-23:** Agregar una pregunta al banco o una sección de contenido debe requerir editar únicamente archivos de datos/contenido, sin tocar componentes de interfaz.

---

## Lineamientos de Implementación

1. **SOLID.** El código debe respetar los principios SOLID. Aplicación concreta al proyecto: componentes de interfaz con una sola responsabilidad (S); simulaciones y tipos de pregunta extensibles sin modificar el motor (O); cualquier tipo de simulación o de pregunta intercambiable detrás de la misma interfaz (L); interfaces chicas por rol, p. ej. contratos separados para "simulación", "evaluación", "almacenamiento" (I); la lógica depende de abstracciones (almacenamiento, reloj, aleatoriedad), no de `localStorage` o `Math.random` directos (D).
2. **Buenas prácticas.** Nombres claros, funciones chicas, DRY/KISS, manejo explícito de errores, tests automatizados y sin código muerto.
3. **Patrones de diseño.** Categorías que aplican al proyecto (los patrones concretos quedan **pendientes de confirmación del usuario**):

| Categoría | ¿Aplica? | Por qué |
| :--- | :--- | :--- |
| Creacionales | Sí | Se crean muchos componentes parecidos (67 simulaciones, tipos de pregunta) a partir de metadatos. **Propuesto:** Factory/Registry de simulaciones y de tipos de pregunta. |
| Estructurales | Sí | Hay que aislar el almacenamiento y simplificar el acceso al contenido. **Propuesto:** Adapter (almacenamiento local/exportación) y Facade (motor de evaluación). |
| De comportamiento | Sí | Repetición espaciada, evaluaciones y animaciones paso a paso tienen estrategias intercambiables y estado que cambia con eventos. **Propuesto:** Strategy (algoritmo de repaso espaciado), Observer (actualización de progreso) y State (reproducir/pausar/reiniciar). |

Los patrones "propuestos" se consideran aprobados salvo que el usuario indique lo contrario en la próxima revisión.

4. **Contenido como datos.** El contenido (secciones, glosario, preguntas) debe vivir en archivos de datos separados de la interfaz (RNF-23). La lógica numérica de las simulaciones debe estar separada del dibujo para poder testearla (RNF-18, RNF-22).
5. **Decisiones técnicas propuestas (a confirmar):** SPA estática sin backend; librería de interfaz con componentes; renderizado de fórmulas con KaTeX; gráficos en SVG/Canvas; persistencia en el navegador; service worker para uso sin conexión.

---

## Criterios de Aceptación

### Estructura y navegación
- **AC-01 (RF-01):** Dado el inicio, cuando se abre la app, entonces se listan exactamente 8 módulos numerados 0 a 7 en orden.
- **AC-02 (RF-02):** Dado el módulo 3, cuando se abre su índice, entonces aparecen las secciones 3.1 a 3.8 más la autoevaluación.
- **AC-03 (RF-03):** Dado el usuario en la sección 2.4, cuando pulsa "siguiente", entonces se muestra la sección 2.5; y con "anterior" desde 2.4, la sección 2.3.
- **AC-04 (RF-04):** Dado un celular de 360 px de ancho, cuando el usuario abre el menú de secciones, entonces se listan todas las secciones del módulo actual.
- **AC-05 (RF-05):** Dado un usuario sin progreso, cuando abre el módulo 7, entonces el contenido se muestra sin bloqueo.
- **AC-06 (RF-06):** Dado el inicio, cuando se muestra, entonces contiene los 4 puntos de recomendación de estudio de la guía.

### Contenido
- **AC-07 (RF-43):** Dado el script de verificación, cuando se comparan las advertencias ("Cuidado", "Ojo", "Advertencia", "Salvedad") de la guía con las del curso, entonces el 100 % de las advertencias está presente.
- **AC-08 (RF-08):** Dado la sección 2.5, cuando se muestra, entonces la fórmula del TLC se renderiza con notación matemática (sin delimitadores `$` visibles).
- **AC-09 (RF-09):** Dado el ejemplo de OLS (3.3), cuando se expande, entonces se muestran los 4 pasos de la guía y los resultados $\hat\beta_1=2.1$ y $\hat\beta_0=4.8$.
- **AC-10 (RF-10):** Dado el Módulo 1, cuando se abre el anexo, entonces aparece rotulado "opcional" con ambos temas (Nyquist-Shannon y Eddington).
- **AC-11 (RF-11):** Dado el glosario, cuando se escribe "heterocedasticidad", entonces se muestra el término con su definición.
- **AC-12 (RF-12):** Dado el término "Lasso" en el glosario, cuando se pulsa su referencia "(6.4)", entonces se abre la sección 6.4.
- **AC-13 (RF-13):** Dado el cuadro síntesis, cuando se abre, entonces contiene la escalera de 8 niveles, las 8 filas de la tabla de técnicas y los 11 errores comunes.
- **AC-14 (RF-14):** Dado un texto con "ver Módulo 0.4", cuando se pulsa el enlace, entonces se abre la sección 0.4.
- **AC-15 (RF-15):** Dado el mapa de conceptos, cuando se pulsa el nodo "OLS (3.3)", entonces se resaltan sus dependencias (0.4 Derivadas, 2.2 Medidas…) y se puede abrir cada una.
- **AC-16 (RF-16):** Dado la tabla de Ridge/Lasso (6.4), cuando se muestra, entonces lleva la etiqueta "ilustrativa (cifras inventadas)".

### Interactividad
- **AC-17 (RF-17):** Dado el catálogo, cuando se abre cada módulo, entonces contiene todos los interactivos que el catálogo le asigna (67 en total, IN-01 a IN-67).
- **AC-53 (RF-45):** Dado la suite de tests de humo, cuando se montan los 67 interactivos, entonces 0 errores en consola.
- **AC-54 (RF-07):** Dado la sección 2.1, cuando se abre, entonces se muestran las definiciones de población, muestra, variable, parámetro y estadístico y la analogía de la sopa.
- **AC-55 (RF-44):** Dado la tabla de escalas de Stevens (2.3) a 360 px de ancho, cuando se muestra, entonces sus 4 columnas se leen sin scroll horizontal de la página.
- **AC-18 (RF-18):** Dado IN-03 (Bayes) con prevalencia 1 %, sensibilidad 90 % y falsos positivos 5 %, cuando el usuario cambia la prevalencia a 10 %, entonces el resultado cambia a 66.7 % ± 0.1.
- **AC-19 (RF-19):** Dado IN-58 (K-Means) en pausa, cuando el usuario pulsa "reproducir", entonces avanza paso a paso y al pulsar "reiniciar" vuelve a los centroides iniciales.
- **AC-20 (RF-20):** Dado el ejemplo de la dispersión (2.2), cuando el usuario ingresa 7 como varianza, entonces el sistema responde correcto; con otro valor, muestra el cálculo correcto (s² = 7).
- **AC-21 (RF-21):** Dado un sistema con "reducir movimiento" activado, cuando se abre IN-21 (TLC), entonces no se reproduce animación y se muestra la versión estática.

### Evaluaciones
- **AC-22 (RF-22):** Dado cada uno de los módulos 0 a 7, cuando se abre su evaluación, entonces existe y contiene ≥ 12 preguntas.
- **AC-23 (RF-23, RNF-19):** Dado el script de trazabilidad, cuando se ejecuta, entonces cada una de las 82 preguntas de autoevaluación de la guía está mapeada a ≥ 1 pregunta del banco.
- **AC-24 (RF-24):** Dado el banco completo, cuando se valida, entonces el 100 % de las preguntas tiene 4 o 5 opciones y exactamente 1 correcta.
- **AC-25 (RF-25):** Dado una pregunta, cuando se la presenta en 20 intentos simulados, entonces la posición de la opción correcta varía y no queda siempre en la misma.
- **AC-26 (RF-26):** Dado una pregunta respondida mal, cuando el usuario confirma, entonces se marca incorrecta, se indica la opción correcta y se muestra la explicación.
- **AC-27 (RF-27):** Dado la explicación de una pregunta, cuando se pulsa "ver en la guía", entonces se abre la sección correspondiente.
- **AC-28 (RF-28):** Dado una evaluación de 12 preguntas con 9 aciertos, cuando finaliza, entonces muestra "9/12" y lista las 3 falladas.
- **AC-29 (RF-29):** Dado una evaluación terminada, cuando el usuario pulsa "reintentar", entonces comienza un nuevo intento y el anterior queda en el historial.
- **AC-30 (RF-30):** Dado la sección 2.7, cuando se abre, entonces antes de la explicación de los errores Tipo I/II se ofrece un mini-chequeo de 1 a 3 preguntas.
- **AC-31 (RF-31):** Dado el usuario que estimó 90 % y obtuvo 60 %, cuando termina la evaluación, entonces se muestra "Estimaste 90 %, obtuviste 60 % (diferencia: 30 puntos)".

### Progreso y repaso
- **AC-32 (RF-32):** Dado una sección sin completar, cuando el usuario pulsa "Marcar como vista", entonces queda marcada y el contador del módulo aumenta en 1.
- **AC-33 (RF-33):** Dado el módulo 0 con 4 de 5 secciones completadas, cuando se muestra el progreso, entonces indica 80 %.
- **AC-34 (RF-34, RNF-14):** Dado una sección marcada, cuando se cierra y reabre el navegador, entonces la sección sigue marcada.
- **AC-35 (RF-35):** Dado el usuario que salió en la sección 4.4, cuando abre el inicio, entonces aparece "Continuar: 4.4" y al pulsarlo se abre esa sección.
- **AC-36 (RF-36):** Dado un intento finalizado, cuando se consulta el historial, entonces aparece con fecha, puntaje y preguntas falladas.
- **AC-37 (RF-37):** Dado tres intentos del módulo 2, cuando se abre el historial, entonces se muestran los tres puntajes en orden cronológico.
- **AC-38 (RF-38):** Dado una pregunta fallada hoy, cuando se consulta su calendario, entonces tiene una fecha de repaso futura; y tras acertarla en el repaso, la siguiente fecha es posterior a la anterior.
- **AC-39 (RF-39):** Dado 5 preguntas con fecha de repaso vencida, cuando el usuario abre "Repaso", entonces la sesión contiene exactamente esas 5 preguntas.
- **AC-40 (RF-40, RNF-16):** Dado un progreso exportado, cuando se importa en un navegador sin datos, entonces el progreso, historial y calendario de repaso son idénticos al original.
- **AC-41 (RF-41):** Dado "Borrar progreso", cuando el usuario cancela la confirmación, entonces los datos permanecen; si confirma, el progreso queda en 0 %.

### Búsqueda
- **AC-42 (RF-42):** Dado la búsqueda "bootstrap", cuando se ejecuta, entonces los resultados incluyen la sección 6.3 y la entrada del glosario.

### No funcionales
- **AC-43 (RNF-01):** Dado Lighthouse con perfil 4G simulado y caché vacía, cuando se mide el inicio, entonces LCP < 3 s.
- **AC-44 (RNF-06):** Dado anchos de 360, 768 y 1920 px, cuando se recorren inicio, sección y evaluación, entonces no hay scroll horizontal en ninguno.
- **AC-45 (RNF-13):** Dado una app visitada una vez, cuando se desconecta la red y se recarga, entonces el inicio, una sección, una simulación y una evaluación funcionan.
- **AC-46 (RNF-17):** Dado el script de cobertura, cuando compara los encabezados `##` y `###` de la guía con el curso, entonces reporta 0 encabezados faltantes.
- **AC-47 (RNF-18):** Dado la suite de tests numéricos, cuando se ejecuta, entonces el 100 % de los ejemplos (p. ej. Bayes = 0.154, β̂₁ = 2.1, DID = 3, entropía = 0.971, lift = 1.25, varianza del bagging = 2.02) coincide con la guía.
- **AC-48 (RNF-21, control de acceso):** Dado cualquier uso de la app, cuando se inspecciona el tráfico de red, entonces 0 solicitudes contienen datos de progreso o respuestas; y los datos guardados solo son accesibles desde el origen de la propia app (no existen cuentas ni datos de otros usuarios).
- **AC-49 (RNF-08):** Dado Lighthouse de accesibilidad en 4 tipos de pantalla, cuando se mide, entonces cada una obtiene ≥ 90.
- **AC-50 (RNF-10):** Dado una evaluación, cuando se recorre usando solo teclado, entonces se pueden elegir opciones, confirmar y avanzar sin mouse.
- **AC-51 (RNF-15):** Dado un navegador con almacenamiento bloqueado, cuando se abre la app, entonces el contenido se muestra y aparece un aviso de que el progreso no se guardará.
- **AC-52 (RNF-22):** Dado la suite de tests con cobertura, cuando se ejecuta, entonces la cobertura de la lógica de negocio es ≥ 85 %.
- **AC-56 (RNF-02):** Dado la app cargada, cuando se navega a una sección en 20 mediciones, entonces el p95 es < 500 ms.
- **AC-57 (RNF-03):** Dado el dispositivo de referencia, cuando se mueve un deslizador de IN-43 en 50 mediciones, entonces el p95 de actualización es < 100 ms.
- **AC-58 (RNF-04):** Dado el dispositivo de referencia, cuando se reproduce IN-58 durante 10 s, entonces el promedio es ≥ 30 fps.
- **AC-59 (RNF-05):** Dado el build de producción, cuando se mide la descarga inicial comprimida (JS+CSS+HTML), entonces es ≤ 300 KB.
- **AC-60 (RNF-07):** Dado una auditoría automatizada de controles interactivos a 360 px, cuando se mide, entonces el 100 % tiene un área ≥ 44 × 44 px.
- **AC-61 (RNF-09):** Dado una auditoría de contraste sobre las 4 pantallas tipo, cuando se ejecuta, entonces 0 textos con contraste < 4.5:1.
- **AC-62 (RNF-11):** Dado el catálogo, cuando se valida, entonces los 67 interactivos tienen descripción textual no vacía.
- **AC-63 (RNF-12):** Dado la suite end-to-end, cuando se ejecuta en Chrome, Safari, Firefox y Edge (2 últimas versiones), entonces los flujos de inicio, sección, simulación y evaluación pasan en los 4.
- **AC-64 (RNF-23):** Dado una pregunta nueva agregada solo al archivo de datos, cuando se abre la evaluación, entonces la pregunta aparece sin cambios en componentes de interfaz.

---

## Fuera de Alcance

- Cuentas de usuario, login, sincronización en la nube y backend.
- Generación de preguntas o explicaciones con IA en tiempo de uso.
- Gamificación (puntos, rachas, insignias, rankings).
- Modo oscuro / temas personalizables (no pedido).
- Soporte multi-idioma (el curso es solo en español, igual que la guía).
- Contenido que no esté en la guía (temas nuevos, otros libros, demostraciones formales).
- Ejecución de código real (Python/R) dentro de la app.
- Foros, comentarios, funciones sociales o compartir resultados.
- Apps nativas de tienda (App Store / Google Play).
- Notificaciones push de recordatorio de repaso.
- Edición del contenido por el usuario desde la interfaz.
- Versión impresa / exportación a PDF.

---

## Riesgos y Dependencias

| Riesgo | Mitigación |
| :--- | :--- |
| **Alcance enorme:** 67 interactivos + ≥ 96 preguntas + todo el contenido. | Motor genérico de simulaciones y de preguntas (RNF-23); implementar por módulo en orden; cada módulo se entrega solo si pasa sus tests de cobertura (AC-46, AC-47). |
| **Errores numéricos o conceptuales** al reescribir contenido y simulaciones. | Tests automatizados contra los números verificados de la guía (RNF-18); revisión manual de cada módulo por el usuario. |
| **Preguntas con distractores débiles** (respuestas obvias). | Distractores basados en los "errores más comunes" de la guía; revisión del usuario sobre el banco antes del lanzamiento. |
| **Rendimiento de simulaciones en celular.** | Presupuesto de 100 ms/30 fps (RNF-03/04), carga bajo demanda, tamaños de datos acotados, medición en dispositivo de referencia. |
| **Pérdida de progreso** (el almacenamiento local puede ser borrado por el navegador). | Exportar/importar (RF-40), aviso cuando el almacenamiento no esté disponible (RNF-15). |
| **Accesibilidad de gráficos interactivos.** | Descripciones textuales (RNF-11), alternativa estática (RF-21), operación por teclado (RNF-10). |
| **Carga cognitiva:** pasar de un apunte a una app puede fragmentar la lectura. | Respetar el orden y numeración de la guía; mini-chequeos cortos; progreso visible. |

**Dependencias:**
- `recorrido-guias-de-aprendizaje-v3.md` como única fuente de contenido (cualquier cambio a la guía requiere actualizar el curso).
- Librería de renderizado de fórmulas (KaTeX o equivalente).
- Hosting estático (a elegir; gratuito alcanza).
- Decisión del usuario sobre los patrones de diseño concretos (sección Lineamientos).
- Revisión del usuario del banco de preguntas y de los textos de explicación.
