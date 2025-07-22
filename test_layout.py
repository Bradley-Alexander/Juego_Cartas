# Archivo de prueba para verificar la distribución cuadrada con K en el centro
from game_logic import OracleGame

def test_square_layout():
    print("🔮 Probando distribución cuadrada del Oráculo de la Suerte")
    print("=" * 60)
    
    game = OracleGame()
    game.start_game()
    
    print("📋 Estado inicial:")
    print(f"Grupos totales: {len(game.groups)}")
    print(f"Grupo actual (centro): {game.current_group}")
    
    print("\n🃏 Distribución de cartas por grupo:")
    for group_num in range(1, 14):
        cards = game.groups[group_num]
        if cards:
            card_names = [f"{card.rank}{card.suit}" for card in cards]
            print(f"Grupo {group_num:2d}: {len(cards)} cartas - {card_names}")
        else:
            print(f"Grupo {group_num:2d}: Vacío")
    
    print("\n🎯 Mapeo directo valor-grupo:")
    test_values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    rank_names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    for value, rank in zip(test_values, rank_names):
        print(f"Valor {value:2d} ({rank}) -> Grupo {value}")
    
    print("\n🎮 Layout visual cuadrado:")
    print("┌─────┬─────┬─────┬─────┐")
    print(f"│ A({len(game.groups[1])}) │ 2({len(game.groups[2])}) │ 3({len(game.groups[3])}) │ 4({len(game.groups[4])}) │")
    print("├─────┼─────┼─────┼─────┤")
    print(f"│Q({len(game.groups[12])}) │     │K({len(game.groups[13])}) │     │ 5({len(game.groups[5])})")
    print("├─────┤     ├─────┤     ├─────┤")
    print(f"│J({len(game.groups[11])}) │     │     │     │ 6({len(game.groups[6])}) │")
    print("├─────┼─────┼─────┼─────┤")
    print(f"│10({len(game.groups[10])})│ 9({len(game.groups[9])}) │ 8({len(game.groups[8])}) │ 7({len(game.groups[7])}) │")
    print("└─────┴─────┴─────┴─────┘")
    
    print(f"\n🔮 Carta actual: {game.current_card.rank}{game.current_card.suit} (Grupo {game.current_group})")
    print(f"🎯 Objetivo: Grupo {game.target_group}")
    
    print("\n✨ El oráculo está listo para revelar tu destino...")

if __name__ == "__main__":
    test_square_layout()
