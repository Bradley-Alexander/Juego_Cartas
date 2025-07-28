# 🔮 ORÁCULO DE LAS CARTAS - NUEVA FUNCIONALIDAD: PREGUNTAS

## 📋 RESUMEN DE LA NUEVA CARACTERÍSTICA

Se ha agregado un sistema de **consultas al oráculo** que permite a los usuarios hacer preguntas antes de jugar. La respuesta del oráculo se determina por el resultado del juego:

- **🏆 SI GANAS** = La respuesta a tu pregunta es **SÍ**
- **💀 SI PIERDES** = La respuesta a tu pregunta es **NO**

## 🎯 FLUJO DE USUARIO ACTUALIZADO

1. **Pantalla de Inicio** → Seleccionar "Iniciar Juego"
2. **Selección de Modo** → Manual o Automático
3. **🆕 NUEVA: Pantalla de Pregunta** → Escribir consulta al oráculo
4. **Selección de Personaje** → Elegir avatar
5. **Pantalla de Juego** → Jugar con la pregunta visible
6. **Resultado** → El oráculo responde SÍ (victoria) o NO (derrota)

## 🖥️ COMPONENTES AGREGADOS

### 🎨 HTML (templates/index.html)
- **Nueva pantalla `questionScreen`** con:
  - Introducción explicativa del sistema
  - Campo de texto para la pregunta (10-200 caracteres)
  - Vista previa de la pregunta
  - Contador de caracteres
  - Botones de confirmación y edición

- **Display en el juego `oracleQuestionDisplay`** con:
  - Recordatorio de la pregunta durante el juego
  - Indicaciones visuales SÍ/NO

### 🎨 CSS (static/style.css)
- **Estilos para la pantalla de preguntas**:
  - `.question-container` - Contenedor principal
  - `.oracle-question-input` - Campo de texto estilizado
  - `.question-preview` - Vista previa de la pregunta
  - `.answer-yes` / `.answer-no` - Colores para respuestas

- **Estilos para el display en juego**:
  - `.oracle-question-display` - Mostrar pregunta durante el juego
  - `.win-condition` / `.lose-condition` - Indicadores de condiciones

### ⚙️ JavaScript (static/script.js)

#### Nuevas Propiedades:
- `this.oracleQuestion` - Almacena la pregunta del usuario

#### Nuevas Funciones:
- `initializeQuestionScreen()` - Configura eventos de la pantalla de preguntas
- `resetQuestionScreen()` - Limpia el estado de la pantalla
- `displayOracleQuestion()` - Muestra la pregunta durante el juego
- `getOracleAnswerMessage(isVictory)` - Genera mensaje de respuesta del oráculo

#### Modificaciones:
- **Navegación actualizada** - Flujo: Modo → Pregunta → Personaje → Juego
- **Mensajes de victoria/derrota** - Incluyen respuesta del oráculo
- **Función de salida** - Resetea también la pantalla de preguntas

## 📝 VALIDACIONES IMPLEMENTADAS

### Entrada de Pregunta:
- **Mínimo**: 10 caracteres
- **Máximo**: 200 caracteres
- **Contador en tiempo real**
- **Botón habilitado/deshabilitado** según longitud

### Flujo de Navegación:
- **Obligatorio completar pregunta** antes de continuar
- **Opción de editar** pregunta antes de confirmar
- **Reseteo completo** al salir del juego

## 🎮 EXPERIENCIA DE USUARIO

### Antes del Juego:
1. Usuario escribe su pregunta (ej: "¿Debería cambiar de trabajo?")
2. Vista previa confirma la pregunta
3. Continúa al juego con la pregunta en mente

### Durante el Juego:
- **Recordatorio visual** de la pregunta en la parte superior
- **Indicadores claros** de qué significa ganar/perder
- **Misma jugabilidad** pero con propósito adivinatorio

### Al Finalizar:
- **Victoria**: "✨ El oráculo responde: 'SÍ' a tu pregunta. Las cartas confirman tu destino"
- **Derrota**: "🌑 El oráculo responde: 'NO' a tu pregunta. Las cartas niegan tu consulta"

## 🔧 ASPECTOS TÉCNICOS

### Compatibilidad:
- **Totalmente compatible** con todas las características existentes
- **No afecta** el sistema de sonidos, animaciones o modo automático
- **Funciona** con todos los personajes y modos de juego

### Persistencia:
- **Pregunta se mantiene** durante toda la sesión de juego
- **Se resetea** al salir del juego o volver al menú principal
- **No se guarda** entre sesiones (diseño intencional)

### Accesibilidad:
- **Placeholder descriptivo** con ejemplos de preguntas
- **Retroalimentación visual** clara del estado del botón
- **Mensajes de error** informativos para longitud de texto

## 🎯 CASOS DE USO

### Preguntas Típicas:
- "¿Debería aceptar esa propuesta?"
- "¿Es el momento adecuado para este cambio?"
- "¿Tendré éxito en mi nuevo proyecto?"
- "¿Es buena idea hacer este viaje?"

### Flexibilidad:
- **Acepta cualquier pregunta** de 10-200 caracteres
- **Sin restricciones** de idioma o contenido
- **Adaptable** a diferentes estilos de consulta

## 🚀 INSTALACIÓN Y USO

La funcionalidad está **completamente integrada** y lista para usar:

1. **No requiere configuración adicional**
2. **Arranca automáticamente** con el servidor Flask
3. **Accesible** desde el flujo normal del juego
4. **Compatible** con navegadores modernos

---

**¡El oráculo ahora puede responder a tus preguntas más profundas a través del destino de las cartas!** 🔮✨
