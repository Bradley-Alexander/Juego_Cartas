from flask import Flask, render_template, jsonify, request
import time
from game_logic import OracleGame

# Crear instancia de la aplicación Flask
app = Flask(__name__)

# Instancia global del juego para mantener el estado entre requests
game = OracleGame()

@app.route('/')
def index():
    """
    Ruta principal de la aplicación.
    Renderiza la página principal del juego con todas las pantallas.
    """
    return render_template('index.html')

@app.route('/api/new_game', methods=['POST'])
def new_game():
    """
    API para iniciar una nueva partida.
    Reinicia el juego y devuelve el estado inicial.
    """
    try:
        game.start_game()
        return jsonify({
            'success': True,
            'message': 'Nuevo juego iniciado',
            'state': game.get_current_state()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error al iniciar el juego: {str(e)}'
        }), 500

@app.route('/api/game_state', methods=['GET'])
def get_game_state():
    """
    API para obtener el estado actual del juego.
    Devuelve toda la información necesaria para actualizar la interfaz.
    """
    try:
        return jsonify({
            'success': True,
            'state': game.get_current_state()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error al obtener el estado: {str(e)}'
        }), 500

@app.route('/api/move', methods=['POST'])
def make_move():
    """
    API para realizar un movimiento manual.
    Recibe el grupo origen y destino, valida y ejecuta el movimiento.
    """
    try:
        data = request.json
        from_group = data.get('from_group')
        to_group = data.get('to_group')
        
        if from_group is None or to_group is None:
            return jsonify({
                'success': False,
                'message': 'Faltan parámetros from_group y to_group'
            }), 400
        
        success, message = game.make_move(from_group, to_group)
        
        return jsonify({
            'success': success,
            'message': message,
            'state': game.get_current_state()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error al realizar el movimiento: {str(e)}'
        }), 500

@app.route('/api/auto_step', methods=['POST'])
def auto_step():
    """
    API para ejecutar un paso en modo automático.
    Permite que el juego se mueva solo siguiendo las reglas del oráculo.
    """
    try:
        success, message = game.auto_play_step()
        
        return jsonify({
            'success': success,
            'message': message,
            'state': game.get_current_state(),
            'can_continue': game.game_state == "playing"
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error en el paso automático: {str(e)}'
        }), 500

@app.route('/api/next_move_info', methods=['GET'])
def get_next_move_info():
    """
    API para obtener información sobre el próximo movimiento.
    Útil para mostrar indicaciones al jugador sobre qué carta mover.
    """
    try:
        move_info = game.get_next_move_info()
        return jsonify({
            'success': True,
            'move_info': move_info
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error al obtener información del movimiento: {str(e)}'
        }), 500

@app.route('/api/reshuffle', methods=['POST'])
def reshuffle_game():
    """
    API para rebarajear las cartas antes del primer movimiento.
    Solo disponible si no se han realizado movimientos aún.
    """
    try:
        if len(game.moves_history) > 0:
            return jsonify({
                'success': False,
                'message': 'No se puede rebarajear después de realizar movimientos'
            }), 400
        
        # Rebarajear y repartir nuevamente
        game.shuffle_deck()
        game.deal_cards()
        
        # Reinicializar estado del juego manteniendo el mismo estado "playing"
        game.current_group = 13
        game.moves_history = []
        
        # Configurar carta inicial
        if game.groups[13]:
            game.current_card = game.groups[13][0]
            game.target_group = game.current_card.value
        
        return jsonify({
            'success': True,
            'message': 'Cartas rebarajeadas exitosamente',
            'state': game.get_current_state()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error al rebarajear: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Mensajes informativos para el usuario
    print("🃏 Iniciando Oráculo de la Suerte...")
    print("🌐 Accede al juego en: http://localhost:5000")
    print("🎮 Presiona Ctrl+C para detener el servidor")
    # Iniciar el servidor Flask en modo debug
    app.run(debug=True, host='localhost', port=5000)