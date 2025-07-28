# 🔮 Oráculo de las Cartas

Un juego místico de cartas con diseño pixel art que predice tu destino a través de la organización de un mazo completo.

## 🎯 Descripción del Juego

**Oráculo de las Cartas** es un juego de cartas único donde debes organizar las 52 cartas de una baraja francesa en 13 grupos según su valor. El oráculo revela una carta a la vez y te guía hacia dónde moverla, creando una experiencia mística e interactiva.

## ✨ Características Principales

### 🎨 Diseño Pixel Art
- Interfaz completamente rediseñada con estética pixel art
- Fondo de casino lujoso con efectos visuales
- Animaciones fluidas y colores vibrantes
- Tipografía futurista (Orbitron)

### 🎮 Sistema de Pantallas
1. **Pantalla de Inicio**: Menú principal con título llamativo
2. **Selección de Modo**: Elige entre manual o automático
3. **Selección de Personaje**: 3 avatares únicos
4. **Pantalla de Instrucciones**: Reglas detalladas del juego
5. **Pantalla de Juego**: Interfaz principal de juego

### 👥 Personajes Disponibles
- **Ing. Andrés** 👨‍🏫 - El Sabio
- **Bradley** 👨‍💻 - El Creador  
- **Estudiante Promedio** 🎓 - El Aprendiz

### 🎯 Modos de Juego
- **Modo Manual**: Controlas cada movimiento haciendo clic
- **Modo Automático**: El oráculo juega automáticamente

## 🏗️ Estructura del Proyecto

```
Juego_Cartas/
├── app.py                 # Servidor Flask principal
├── game_logic.py          # Lógica central del juego
├── templates/
│   └── index.html         # Interfaz HTML con múltiples pantallas
├── static/
│   ├── style.css          # Estilos pixel art y responsive
│   ├── script.js          # JavaScript para navegación y juego
│   ├── style_old.css      # Backup del diseño anterior
│   └── script_old.js      # Backup del JavaScript anterior
├── test_startup.py        # Script de verificación
├── test_rules.py          # Pruebas de reglas del juego
└── README.md              # Este archivo
```

## 🎲 Reglas del Juego

### 📋 Objetivo
Organizar todas las 52 cartas en 13 grupos según su valor:
- Grupo 1: Ases (A)
- Grupo 2: Doses (2)
- Grupo 3: Treses (3)
- ...
- Grupo 13: Reyes (K) - ubicado en el centro

### 🎯 Cómo Jugar
1. **Selecciona tu modo** de juego (manual o automático)
2. **Elige tu personaje** favorito
3. **El oráculo revela** una carta y te indica dónde moverla
4. **En modo manual**: Haz clic en el grupo destino
5. **En modo automático**: Observa mientras el oráculo juega

### 🏆 Condiciones de Victoria
- **Ganas** cuando todos los 13 grupos están completamente ordenados
- Cada grupo debe tener las 4 cartas de su valor correspondiente

### 💀 Condiciones de Derrota
- **Pierdes** si el oráculo detecta que es imposible continuar
- Esto ocurre cuando se forma un bucle infinito en la configuración

## 🚀 Instalación y Ejecución

### Prerrequisitos
```bash
Python 3.7+
Flask 2.0+
```

### Pasos de Instalación
1. **Clona o descarga** el proyecto
2. **Instala Flask** (si no lo tienes):
   ```bash
   pip install flask
   ```
3. **Navega** al directorio del juego:
   ```bash
   cd Juego_Cartas
   ```
4. **Ejecuta** el servidor:
   ```bash
   python app.py
   ```
5. **Abre** tu navegador en: `http://localhost:5000`

### Verificación del Sistema
Ejecuta el script de prueba:
```bash
python test_startup.py
```

## 🎨 Características Técnicas

### Frontend
- **HTML5** con diseño responsive
- **CSS3** con animaciones y efectos visuales
- **JavaScript ES6+** con async/await
- **Sistema de pantallas** con transiciones suaves

### Backend
- **Flask** como servidor web
- **API REST** para comunicación frontend-backend
- **Lógica de juego** separada en módulo independiente
- **Detección inteligente** de victoria y derrota

### Diseño Visual
- **Paleta de colores** inspirada en casinos lujosos
- **Efectos de luz** y animaciones CSS
- **Tipografía futurista** (Google Fonts - Orbitron)
- **Responsive design** para móviles y escritorio

## 🎯 API Endpoints

- `GET /` - Página principal del juego
- `POST /api/new_game` - Iniciar nueva partida
- `POST /api/move` - Realizar movimiento manual
- `POST /api/auto_step` - Paso automático
- `GET /api/game_state` - Estado actual del juego

## 🔧 Personalización

### Agregar Nuevos Personajes
1. Añade la información en `static/script.js`
2. Actualiza los estilos CSS correspondientes
3. Modifica el HTML para incluir el nuevo personaje

### Modificar Velocidad
- Ajusta el slider en la interfaz
- Rango: 0.5s - 3.0s por movimiento

### Cambiar Colores
- Edita las variables CSS en `static/style.css`
- Modifica los gradientes y efectos de luz

## 🐛 Resolución de Problemas

### El juego no carga
1. Verifica que Flask esté instalado
2. Comprueba que el puerto 5000 esté libre
3. Ejecuta `python test_startup.py` para diagnósticos

### Error de conexión
1. Revisa la consola del navegador (F12)
2. Verifica que el servidor Flask esté ejecutándose
3. Comprueba la URL en el navegador

### Problemas de diseño
1. Limpia la caché del navegador (Ctrl+F5)
2. Verifica que los archivos CSS/JS se carguen correctamente
3. Revisa la consola por errores de JavaScript

## 👨‍💻 Créditos

**Desarrollado por:** Bradley Poma  
**Inspiración:** Juegos clásicos de cartas y casinos  
**Diseño:** Pixel art y estética retro-futurista  
**Tecnologías:** Flask, HTML5, CSS3, JavaScript ES6+

## 📜 Licencia

Este proyecto es de uso educativo y personal. No está destinado para uso comercial.

---

🔮 *Que el oráculo guíe tu camino hacia la victoria* ✨
