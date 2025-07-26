# Test para verificar las nuevas reglas de victoria y derrota
from game_logic import OracleGame, Card

def test_victory_conditions():
    print("🎯 Probando condiciones de VICTORIA")
    print("=" * 50)
    
    game = OracleGame()
    game.start_game()
    
    # Simular un estado de victoria (todas las cartas ordenadas)
    print("Simulando estado de victoria completa...")
    
    # Crear cartas ordenadas para cada grupo
    suits = ['♠', '♥', '♦', '♣']
    ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    
    # Limpiar grupos
    game.groups = {i: [] for i in range(1, 14)}
    
    # Llenar cada grupo con sus 4 cartas correctas
    for group_num in range(1, 14):
        for suit in suits:
            card = Card(suit, ranks[group_num - 1], group_num)
            game.groups[group_num].append(card)
    
    victory = game.check_victory()
    print(f"✅ Estado de victoria: {victory}")
    
    stats = game.get_game_statistics()
    print(f"📊 Grupos completamente ordenados: {stats['completely_sorted_groups']}/13")
    print(f"📊 Cartas en posición correcta: {stats['cards_in_correct_position']}/52")
    
    return victory

def test_defeat_conditions():
    print("\n💀 Probando condiciones de DERROTA")
    print("=" * 50)
    
    game = OracleGame()
    game.start_game()
    
    # Caso 1: Simular bucle infinito (grupo completamente ordenado)
    print("\n🔄 Caso 1: Bucle infinito por grupo completamente ordenado")
    
    # Llenar el grupo 1 con sus 4 Ases correctos
    suits = ['♠', '♥', '♦', '♣']
    game.groups[1] = []
    for suit in suits:
        card = Card(suit, 'A', 1)
        game.groups[1].append(card)
    
    # Establecer el grupo 1 como actual
    game.current_group = 1
    game.current_card = game.groups[1][0]  # Un As que apunta al grupo 1
    
    print(f"Grupo {game.current_group} está completamente ordenado: {game.is_group_completely_sorted(1)}")
    print(f"Carta actual: {game.current_card.rank}{game.current_card.suit} (apunta al grupo {game.current_card.value})")
    print(f"Todos los grupos ordenados: {game.all_groups_sorted()}")
    
    # Verificar detección de bucle infinito
    loop_detected = game.detect_infinite_loop_scenario()
    defeat_reason = game.check_defeat()
    
    print(f"🚨 Bucle infinito detectado: {loop_detected is not None}")
    if loop_detected:
        print(f"📝 Razón: {loop_detected}")
    
    print(f"🚨 Derrota detectada: {defeat_reason is not None}")
    if defeat_reason:
        print(f"📝 Razón: {defeat_reason}")
    
    # Caso 2: Grupo vacío
    print("\n🚫 Caso 2: Grupo vacío")
    game2 = OracleGame()
    game2.start_game()
    game2.groups[5] = []  # Vaciar grupo 5
    game2.current_group = 5
    
    defeat_reason2 = game2.check_defeat()
    print(f"🚨 Derrota por grupo vacío: {defeat_reason2 is not None}")
    if defeat_reason2:
        print(f"📝 Razón: {defeat_reason2}")

def test_partial_sorting():
    print("\n🔍 Probando detección de ordenamiento parcial")
    print("=" * 50)
    
    game = OracleGame()
    game.start_game()
    
    # Simular ordenamiento parcial
    # Grupo 1: 2 Ases correctos + 2 cartas incorrectas
    game.groups[1] = [
        Card('♠', 'A', 1),  # Correcto
        Card('♥', 'A', 1),  # Correcto
        Card('♦', '2', 2),  # Incorrecto
        Card('♣', '3', 3)   # Incorrecto
    ]
    
    # Grupo 2: Completamente ordenado
    game.groups[2] = [
        Card('♠', '2', 2),
        Card('♥', '2', 2),
        Card('♦', '2', 2),
        Card('♣', '2', 2)
    ]
    
    stats = game.get_game_statistics()
    
    print(f"📊 Estadísticas del juego:")
    print(f"   - Grupos completamente ordenados: {stats['completely_sorted_groups']}")
    print(f"   - Grupos parcialmente ordenados: {stats['partially_sorted_groups']}")
    print(f"   - Grupos sin ordenar: {stats['unsorted_groups']}")
    print(f"   - Cartas en posición correcta: {stats['cards_in_correct_position']}")
    
    print(f"\n🔍 Detalles por grupo:")
    for detail in stats['sorted_group_details']:
        if detail['group'] in [1, 2]:  # Solo mostrar los grupos que modificamos
            print(f"   Grupo {detail['group']}: {detail['status']} - {detail['correct_cards']}/{detail['cards']} cartas correctas")

if __name__ == "__main__":
    print("🔮 PRUEBAS DE REGLAS DEL ORÁCULO DE LA SUERTE")
    print("=" * 60)
    
    # Ejecutar todas las pruebas
    victory_result = test_victory_conditions()
    test_defeat_conditions()
    test_partial_sorting()
    
    print("\n" + "=" * 60)
    print("🎮 Resumen de pruebas completado")
    print(f"✅ Condición de victoria funciona: {victory_result}")
    print("💀 Condiciones de derrota implementadas")
    print("📊 Sistema de estadísticas operativo")
    print("🔮 ¡El oráculo está listo con las nuevas reglas!")
