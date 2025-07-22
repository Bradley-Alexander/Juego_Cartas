from flask import Flask, render_template, jsonify, request
import time
from game_logic import OracleGame

app = Flask(__name__)

# Global game instance
game = OracleGame()

@app.route('/')
def index():
    """Main game page"""
    return render_template('index.html')

@app.route('/api/new_game', methods=['POST'])
def new_game():
    """Start a new game"""
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
    """Get current game state"""
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
    """Make a manual move"""
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
    """Execute one step in automatic mode"""
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
    """Get information about the next move"""
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

if __name__ == '__main__':
    print("🃏 Iniciando Oráculo de la Suerte...")
    print("🌐 Accede al juego en: http://localhost:5000")
    print("🎮 Presiona Ctrl+C para detener el servidor")
    app.run(debug=True, host='localhost', port=5000)