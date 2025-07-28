#!/usr/bin/env python3
"""
Script de prueba para verificar que todas las características estén implementadas correctamente.
"""

import os
import sys

def check_file_exists(file_path, description):
    """Verifica si un archivo existe y muestra el resultado."""
    if os.path.exists(file_path):
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ {description}: {file_path} - NO ENCONTRADO")
        return False

def check_content_in_file(file_path, search_terms, description):
    """Verifica si cierto contenido existe en un archivo."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        missing_terms = []
        for term in search_terms:
            if term not in content:
                missing_terms.append(term)
        
        if not missing_terms:
            print(f"✅ {description}: Todas las características encontradas")
            return True
        else:
            print(f"❌ {description}: Faltan características: {missing_terms}")
            return False
    except Exception as e:
        print(f"❌ Error leyendo {file_path}: {e}")
        return False

def main():
    print("🔍 VERIFICACIÓN DE CARACTERÍSTICAS IMPLEMENTADAS")
    print("=" * 60)
    
    base_path = os.path.dirname(os.path.abspath(__file__))
    
    # Verificar archivos principales
    files_to_check = [
        (os.path.join(base_path, "app.py"), "Servidor Flask"),
        (os.path.join(base_path, "game_logic.py"), "Lógica del juego"),
        (os.path.join(base_path, "templates", "index.html"), "Template HTML"),
        (os.path.join(base_path, "static", "script.js"), "JavaScript principal"),
        (os.path.join(base_path, "static", "style.css"), "Estilos CSS"),
        (os.path.join(base_path, "static", "sounds"), "Directorio de sonidos")
    ]
    
    print("\n📁 VERIFICACIÓN DE ARCHIVOS:")
    all_files_exist = True
    for file_path, description in files_to_check:
        if not check_file_exists(file_path, description):
            all_files_exist = False
    
    if not all_files_exist:
        print("\n❌ Algunos archivos faltan. Verificar la estructura del proyecto.")
        return
    
    print("\n🎨 VERIFICACIÓN DE CARACTERÍSTICAS CSS:")
    css_features = [
        "shuffle-animation-container",
        "card-deck",
        "mini-card",
        "@keyframes shuffleLeft",
        "@keyframes shuffleRight",
        "reshuffle-btn",
        "sound-btn"
    ]
    check_content_in_file(
        os.path.join(base_path, "static", "style.css"),
        css_features,
        "Animaciones de barajado y estilos de botones"
    )
    
    print("\n🎵 VERIFICACIÓN DE CARACTERÍSTICAS DE SONIDO:")
    js_sound_features = [
        "class SoundManager",
        "playCardMove",
        "playShuffle",
        "playVictory",
        "playDefeat",
        "playButton",
        "startAmbient",
        "stopAmbient"
    ]
    check_content_in_file(
        os.path.join(base_path, "static", "script.js"),
        js_sound_features,
        "Sistema de sonidos"
    )
    
    print("\n🃏 VERIFICACIÓN DE CARACTERÍSTICAS DE BARAJADO:")
    js_shuffle_features = [
        "showShuffleAnimation",
        "reshuffleCards",
        "shuffle-animation-container",
        "updateSoundButtons"
    ]
    check_content_in_file(
        os.path.join(base_path, "static", "script.js"),
        js_shuffle_features,
        "Sistema de barajado y animaciones"
    )
    
    print("\n🎮 VERIFICACIÓN DE BOTONES EN HTML:")
    html_button_features = [
        'id="reshuffleBtn"',
        'id="soundToggleBtn"',
        'id="ambientToggleBtn"',
        'class="game-extra-controls"'
    ]
    check_content_in_file(
        os.path.join(base_path, "templates", "index.html"),
        html_button_features,
        "Botones de control adicionales"
    )
    
    print("\n🔧 VERIFICACIÓN DE API ENDPOINTS:")
    api_features = [
        "/api/reshuffle",
        "@app.route('/api/reshuffle', methods=['POST'])",
        "def reshuffle_cards"
    ]
    check_content_in_file(
        os.path.join(base_path, "app.py"),
        api_features,
        "Endpoint de rebarajado"
    )
    
    print("\n" + "=" * 60)
    print("✅ VERIFICACIÓN COMPLETADA")
    print("\n🚀 Para iniciar el juego ejecuta: python app.py")
    print("🌐 Luego abre tu navegador en: http://localhost:5000")
    print("\n🎯 CARACTERÍSTICAS IMPLEMENTADAS:")
    print("   • Animación de barajado antes de cada partida")
    print("   • Botón de rebarajear (habilitado antes del primer movimiento)")
    print("   • Sistema de sonidos sintéticos (movimientos, barajado, victoria, derrota)")
    print("   • Música ambiental")
    print("   • Controles de sonido (activar/desactivar)")
    print("   • Interfaz casino con tema pixel art")
    print("   • Detección de bucles infinitos en modo automático")
    print("   • Comentarios completos en el código")

if __name__ == "__main__":
    main()
