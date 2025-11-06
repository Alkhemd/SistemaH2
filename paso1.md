Objetivo Principal: Implementar un rediseño de alta fidelidad para la interfaz de usuario (UI) del "Sistema H", transformando su estética actual a un estilo de Neumorfismo Profundo y Realista, idéntico en calidad y sensación táctil a la imagen de referencia proporcionada.

Mandato Crítico: El alcance de este trabajo es 100% estético. No se debe alterar, modificar o romper ninguna funcionalidad, lógica de negocio, estructura de datos o llamadas al backend. El objetivo es aplicar una nueva "piel" visual sobre la estructura funcional existente.

Principios del Estilo "Neumorfismo Profundo":

La clave para lograr un realismo idéntico a la foto no es solo aplicar sombras, sino orquestar una ilusión de materialidad.

Sistema de Luz y Sombra Dual: Este es el principio más importante. Cada elemento en relieve debe tener dos sombras para simular una fuente de luz desde la esquina superior izquierda:

Una sombra oscura y difusa en la esquina inferior derecha.

Una luz o "brillo" blanco y difuso en la esquina superior izquierda.

Sugerencia técnica: Esto se logra con box-shadow aplicando dos valores a la vez.

Múltiples Capas de Profundidad (Convexo vs. Cóncavo): La interfaz debe tener elementos que parecen salir (convexos) y otros que parecen hundirse (cóncavos).

Convexo (Extrusión): Para tarjetas principales, botones en estado normal, y paneles de dashboard. Usan el sistema de luz y sombra dual de forma externa.

Cóncavo (Hundimiento): Para campos de entrada de texto (como las barras de búsqueda), botones al ser presionados (:active), y áreas de contenido secundario. Se logra invirtiendo las sombras (luz abajo-derecha, sombra arriba-izquierda) y aplicándolas de forma interna (sugerencia técnica: inset).

Paleta de Colores y Gradientes Sutiles:

El color de fondo de la página y el de los elementos debe ser casi idéntico. Evitar el blanco puro (#FFFFFF). Usar un color base "off-white" o gris muy claro (ej. #E0E5EC).

El fondo principal de la aplicación debe usar un gradiente lineal muy sutil para eliminar la planitud y añadir una capa extra de profundidad.

El color de las sombras oscuras nunca debe ser negro. Debe ser un tono más oscuro y desaturado del color de fondo base.

Geometría Suave y Orgánica:

Todos los elementos deben tener un border-radius generoso y consistente (ej. 30px para tarjetas, 15px para botones) para simular un material suave y moldeado.

Restricciones y No-Negociables:

Lógica Intacta: No se debe modificar la lógica de los componentes (JavaScript, React, Vue, etc.), el manejo de estados, o las llamadas a APIs. Los cambios deben limitarse a los archivos de estilo (CSS/SCSS/Styled Components).

Preservación de Animaciones y Transiciones: Las animaciones y transiciones funcionales existentes (ej. transiciones de página, hover en menús, aparición de modales) deben permanecer intactas y funcionales. El nuevo diseño debe integrarse con ellas.

Nuevas Transiciones Fluidas: Cualquier nueva transición introducida por el rediseño (ej. el cambio de estado de un botón de convexo a cóncavo) debe ser fluida y suave. (Sugerencia técnica: transition: box-shadow 0.2s ease-in-out;).

Estructura HTML Estable: La estructura del DOM debe permanecer lo más inalterada posible. El objetivo es aplicar el nuevo estilo a los elementos existentes, no reconstruir los componentes.

Accesibilidad y Legibilidad: A pesar de la naturaleza sutil del neumorfismo, el contraste del texto y los elementos importantes debe ser suficiente para garantizar una buena legibilidad y experiencia de usuario.

Componentes Específicos a Transformar (Aplicando los principios):

Tarjetas de Información (Equipos, Fabricantes, etc.): Deben ser el principal ejemplo del efecto convexo.

Dashboard: Los paneles principales ("Total Equipos") deben ser grandes tarjetas convexas. Los gráficos internos deben sentirse integrados, no pegados encima.

Botones ("+ Nuevo Equipo", "Editar"): Convexos por defecto. Al hacer clic (:active), deben transformarse suavemente a un estado cóncavo, dando la sensación física de haber sido presionados.

Campos de Búsqueda: Deben tener un estado cóncavo por defecto para invitar al usuario a introducir texto.