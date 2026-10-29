# ♟ Ajedrez Web

Videojuego de ajedrez para navegador, en español, con estética de madera y tonos verde azulados. Diseñado primero para móvil (responsive) y adaptado a ordenador.

## Cómo ejecutarlo
1. Descomprime el proyecto.
2. Abre `index.html` en el navegador. No necesita servidor, instalación ni conexión (solo la fuente Roboto se descarga de Google Fonts; sin internet se usa una del sistema).

## Estructura
```
ajedrez/
├── index.html        Estructura de pantallas (carga, menú, configuración, CPU, partida)
├── css/
│   └── styles.css    Todos los estilos y el diseño responsive
├── js/
│   ├── config.js     Constantes, niveles de la CPU, avatares, ajustes y guardado
│   ├── engine.js     Motor de ajedrez: reglas, movimientos legales, IA
│   ├── ui.js         Tablero, partida, jugadas, fin de partida, botones inferiores
│   ├── menus.js      Menú, configuración, perfil, pantalla de la CPU
│   └── index.js      Pantalla de carga e inicio de la web
└── README.md
```
Los scripts se cargan en ese orden (al final de `index.html`) y comparten variables globales.

## Funciones de la web

### Pantalla de carga
- Logo con rey y reina, texto "CARGANDO..." y barra de progreso verde.
- Al llegar la barra al 100 % aparece el menú con un desvanecido.

### Cabecera
- Se muestra en todas las pantallas, con aspecto de madera y borde dorado.
- **Avatar (izquierda):** abre un selector de 8 imágenes de perfil. Se guarda la elección.
- **Ruedecita (derecha, cinta roja):** abre la configuración. Desde ahí, la flecha vuelve a la pantalla anterior.
- En la partida, el centro de la cabecera muestra el nivel y su nombre (o "2 jugadores" y de quién es el turno).

### Menú "Elige tu modo"
- **Jugar contra la CPU**
- **2 Jugadores** (dos personas en el mismo equipo; blancas y negras se turnan)
- **Puzles** (aún no disponible, muestra "Próximamente")
- **Aprende a jugar al ajedrez** (aún no disponible, muestra "Próximamente")

### Configuración
- **Jugar con 3D / 2D:** con 3D las piezas llevan sombra para dar volumen.
- **Indicar los movimientos disponibles** de la pieza seleccionada (puntos y aros).
- **Indicar las piezas con movimientos disponibles** (borde verde en las piezas que se pueden mover).
- **Resaltar el último movimiento.**
- **Girar el tablero en 2 jugadores:** el tablero se da la vuelta tras cada jugada.
- **Sonidos** (efectos sencillos al mover y capturar).
- **Idioma:** Español.
- **Reiniciar estadísticas:** borra victorias, tablas, derrotas y el progreso de niveles (pide confirmación).
- Todos los ajustes se guardan en el navegador.

### Jugar contra la CPU
- **Jugar como:** blancas, negras o aleatorio.
- **Nivel de dificultad (8 niveles):** Básico, Principiante, Fácil, Intermedio, Avanzado, Experto, Maestro y Gran maestro.
- **Progresión:** empiezas en el nivel 1. Un nivel más difícil solo se desbloquea al ganar el nivel más alto que tengas disponible. Los niveles bloqueados avisan con un candado y se ven atenuados en la regla de la escala.
- **Estadísticas:** ganadas, empatadas, perdidas y porcentaje de victorias, guardadas en el navegador.
- **Jugar ahora:** inicia la partida.

### Partida
- Tablero de 8×8 con coordenadas (números y letras), casillas crema y negras, y marco de madera.
- Se mueve tocando una pieza y luego su casilla de destino.
- **Reglas completas:** movimiento de todas las piezas, enroque corto y largo, captura al paso, coronación (siempre a reina), jaque (casilla del rey en rojo), jaque mate y rey ahogado.
- **Tablas:** por rey ahogado o cuando solo quedan los dos reyes.
- **Botones inferiores:**
  - **Reiniciar:** empieza una partida nueva con los mismos ajustes.
  - **Piezas:** muestra las piezas capturadas por cada bando y la ventaja de material.
  - **Deshacer:** retrocede tu jugada y la de la CPU (en 2 jugadores, solo una jugada).
  - **Pista:** resalta en verde una buena jugada. Dispones de 9 por partida.
- **Fin de partida:** ventana con el resultado (victoria, derrota o tablas), y si ganas, aviso del nivel desbloqueado. Opciones de jugar otra vez o volver al menú.

### La CPU
- **Nivel 1:** movimientos al azar.
- **Niveles 2 a 8:** búsqueda minimax con poda alfa-beta y evaluación por material y posición.
  - Niveles bajos: poca profundidad y algo de aleatoriedad, para que cometa errores.
  - Niveles altos: más profundidad (hasta 4 jugadas) y sin errores deliberados. El nivel 8 puede tardar un par de segundos en mover.

### Responsive
- En móvil ocupa toda la pantalla, con el tablero ajustado al ancho.
- En ordenador se centra en una columna más ancha, con el mismo estilo.
- Respeta las zonas seguras de los móviles con muesca.

## Limitaciones conocidas
- Puzles y "Aprende a jugar" son solo marcadores.
- La coronación siempre es a reina.
- Las piezas son símbolos Unicode con sombreado, no imágenes 3D.
- No hay tablas por repetición ni por la regla de los 50 movimientos.
- No hay modo online.

## Ideas para ampliar
- Puzles de mate en 1, 2 y 3 jugadas.
- Tutorial interactivo de cada pieza.
- Elegir pieza al coronar.
- Reloj de ajedrez.
- Piezas con imágenes SVG o PNG propias.
