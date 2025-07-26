# 🔮 Oráculo de la Suerte

Un juego web místico de cartas que simula un algoritmo de ordenamiento basado en la posición de las cartas.

## 🎮 Descripción del Juego

El **Oráculo de la Suerte** es un juego de cartas basado en una baraja francesa (52 cartas sin comodín) que se distribuyen en 13 grupos circulares de 4 cartas cada uno. El objetivo es ordenar todas las cartas según un algoritmo específico que simula una consulta al oráculo.

### 🃏 Reglas del Juego

1. **Inicio**: Las 52 cartas se distribuyen en 13 grupos de 4 cartas cada uno
2. **Distribución especial**: Los grupos se organizan en forma de cuadrado con K(13) en el centro:
   ```
   ┌─────┬─────┬─────┬─────┐
   │ A(1)│  2  │  3  │  4  │
   ├─────┼─────┼─────┼─────┤
   │Q(12)│     │K(13)│     │ 5
   ├─────┤     ├─────┤     ├─────┤
   │J(11)│     │     │     │  6  │
   ├─────┼─────┼─────┼─────┤
   │ 10  │  9  │  8  │  7  │
   └─────┴─────┴─────┴─────┘
   ```
3. **Algoritmo**: 
   - Se inicia con la primera carta del centro (grupo 13 - K)
   - La carta se voltea y se mueve al grupo correspondiente a su valor (A=1, J=11, Q=12, K=13)
   - Se coloca debajo de la pila del grupo destino
   - Se toma la carta superior del grupo destino y se repite el proceso

### 🏆 Condiciones de Victoria y Derrota

**Victoria**: 
- Se gana ÚNICAMENTE cuando TODOS los 13 grupos están completamente ordenados
- Cada grupo debe tener exactamente sus 4 cartas correspondientes (ejemplo: grupo 1 con 4 Ases, grupo 13 con 4 Reyes)
- No basta con que las cartas estén en el grupo correcto, deben estar TODAS las cartas de cada tipo en su grupo

**Derrota**:
- **Bloqueo por grupo vacío**: Un grupo está vacío cuando se intenta sacar una carta
- **Auto-loop simple**: La carta revelada apunta al mismo grupo y es la única carta restante
- **Bucle infinito por ordenamiento completo**: Si un grupo ya está completamente ordenado (tiene sus 4 cartas correctas) y la carta actual apunta al mismo grupo, se crea un bucle infinito que impide continuar ordenando otros grupos. En este caso el juego termina automáticamente con derrota.

**Indicadores Visuales**:
- ✓ **Verde**: Grupos completamente ordenados (4 cartas correctas)
- ◐ **Naranja**: Grupos parcialmente ordenados (algunas cartas correctas)
- **Normal**: Grupos sin ordenar o con cartas incorrectas

### 🎯 Modalidades de Juego

#### 🖱️ Modo Manual
- El usuario interactúa con la interfaz
- Solo se permiten movimientos válidos
- Mensajes de error si se intenta un movimiento incorrecto
- Indicación visual del grupo actual y destino

#### ⚡ Modo Automático
- El sistema simula el juego paso a paso
- Velocidad ajustable (0.5s - 3s por movimiento)
- Visualización del recorrido completo
- Indicación de cada paso en pantalla

## 🚀 Instalación y Ejecución

### Requisitos
- Python 3.7 o superior
- Flask (se instala automáticamente)

### Pasos para ejecutar

1. **Navegar al directorio del proyecto**:
   ```bash
   cd "ruta\al\proyecto\Juego_Cartas"
   ```

2. **Ejecutar el juego**:
   ```bash
   python app.py
   ```

3. **Abrir en el navegador**:
   - Ve a: `http://localhost:5000`
   - El servidor se iniciará automáticamente

### 🛠️ Estructura del Proyecto

```
Juego_Cartas/
├── app.py              # Servidor Flask principal
├── game_logic.py       # Lógica interna del juego
├── static/
│   ├── style.css       # Estilos CSS
│   └── script.js       # JavaScript del frontend
├── templates/
│   └── index.html      # Interfaz HTML principal
└── README.md           # Este archivo
```

## 🎨 Características Técnicas

### Backend (Python/Flask)
- **Separación de responsabilidades**: Lógica del juego separada del servidor
- **API RESTful**: Endpoints para interacción frontend-backend
- **Barajado realista**: Simulación de múltiples mezclas tipo riffle
- **Layout cuadrado**: Distribución visual en forma de cuadrado con K en el centro
- **Algoritmo clásico**: Correspondencia directa valor-grupo (A=1, J=11, Q=12, K=13)
- **Validación de movimientos**: Control de reglas del juego

### Frontend (HTML/CSS/JavaScript)
- **Interfaz responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones CSS**: Efectos visuales al mover cartas
- **Comunicación AJAX**: Llamadas asíncronas al backend
- **Feedback visual**: Indicadores de grupo actual y destino

### 🎭 Características Especiales

1. **Tema Místico**: Diseño inspirado en la cartomancia y el ocultismo
2. **Efectos Visuales**: Animaciones suaves y efectos de partículas
3. **Feedback Inmediato**: Mensajes contextuales según el estado del juego
4. **Control de Velocidad**: Ajuste dinámico en modo automático
5. **Historial de Movimientos**: Registro completo de todas las jugadas

## 🎮 Cómo Jugar

1. **Iniciar**: Presiona "🎮 Nuevo Juego" para comenzar
2. **Modo Manual**: Haz clic en el grupo destino indicado para mover la carta
3. **Modo Automático**: Presiona "⚡ Modo Automático" para ver la simulación
4. **Ajustar Velocidad**: Usa el control deslizante para cambiar la velocidad
5. **Observar**: Sigue las instrucciones del oráculo para entender cada movimiento

## 🔮 Interpretación Mística

El juego representa una consulta al oráculo donde:
- Cada carta es una pregunta al destino
- Los grupos representan aspectos de la vida (amor, trabajo, salud, etc.)
- El algoritmo simula el flujo del destino
- La victoria significa armonía y orden cósmico
- La derrota indica bloqueos energéticos o loops kármicos

## 🐛 Solución de Problemas

### Error de Conexión
- Verifica que el servidor esté ejecutándose
- Revisa que el puerto 5000 esté disponible
- Intenta reiniciar el servidor

### Juego No Responde
- Recarga la página del navegador
- Verifica la consola del navegador (F12) para errores
- Reinicia el servidor si es necesario

### Problemas de Rendimiento
- Reduce la velocidad del modo automático
- Cierra otras pestañas del navegador
- Verifica los recursos del sistema

## 🔧 Desarrollo y Personalización

El código está estructurado para facilitar modificaciones:

- **game_logic.py**: Modifica las reglas del juego
- **style.css**: Cambia la apariencia visual
- **script.js**: Ajusta la interacción del usuario
- **app.py**: Añade nuevos endpoints o funcionalidades

## 📝 Licencia

Este proyecto es de código abierto y puede ser modificado libremente para uso educativo y personal.

---

🌟 **¡Que el oráculo revele tu destino!** 🌟
