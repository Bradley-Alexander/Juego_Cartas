import random
from typing import List, Tuple, Dict, Optional

class Card:
    """
    Representa una carta individual del mazo.
    Cada carta tiene un palo, rango y valor numérico para el juego.
    """
    def __init__(self, suit: str, rank: str, value: int):
        """
        Inicializa una carta con palo, rango y valor.
        suit: Símbolo del palo (♠, ♥, ♦, ♣)
        rank: Rango de la carta (A, 2-10, J, Q, K)
        value: Valor numérico (1-13) para determinar el grupo destino
        """
        self.suit = suit
        self.rank = rank
        self.value = value
    
    def __repr__(self):
        """Representación en string de la carta para debugging."""
        return f"{self.rank}{self.suit}"
    
    def to_dict(self):
        """
        Convierte la carta a diccionario para envío JSON al frontend.
        Incluye toda la información necesaria para mostrar la carta.
        """
        return {
            'suit': self.suit,
            'rank': self.rank,
            'value': self.value,
            'display': f"{self.rank}{self.suit}"
        }

class OracleGame:
    """
    Clase principal que maneja toda la lógica del Oráculo de las Cartas.
    Controla el estado del juego, movimientos, y condiciones de victoria/derrota.
    """
    def __init__(self):
        """
        Inicializa un nuevo juego con estado por defecto.
        Las cartas se organizan en 13 grupos dispuestos en cuadrado con K en el centro.
        """
        self.deck = []                    # Mazo de 52 cartas
        self.groups = {}                  # 1-13: grupos dispuestos en cuadrado con K(13) en el centro
        self.current_group = 13           # Empezar desde el centro (K)
        self.game_state = "waiting"       # Estados: waiting, playing, victory, defeat
        self.defeat_reason = ""           # Razón específica de la derrota
        self.moves_history = []           # Historial de movimientos realizados
        self.current_card = None          # Carta actual que se debe mover
        self.target_group = None          # Grupo destino de la carta actual
        
    def create_deck(self):
        """
        Crea un mazo estándar de 52 cartas.
        Incluye 4 palos con 13 cartas cada uno (A=1, 2-10, J=11, Q=12, K=13).
        """
        suits = ['♠', '♥', '♦', '♣']
        ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        
        self.deck = []
        for suit in suits:
            for rank, value in zip(ranks, values):
                self.deck.append(Card(suit, rank, value))
    
    def shuffle_deck(self):
        """
        Simula un mezclado realista del mazo.
        Realiza múltiples mezclas tipo riffle para obtener una distribución natural.
        """
        # Simular múltiples mezclas riffle
        for _ in range(random.randint(5, 8)):
            # Dividir el mazo aproximadamente por la mitad
            split_point = random.randint(20, 32)
            left_half = self.deck[:split_point]
            right_half = self.deck[split_point:]
            
            # Mezcla riffle con alguna imperfección para realismo
            shuffled = []
            while left_half or right_half:
                # Elegir aleatoriamente de qué mitad tomar
                if not left_half:
                    shuffled.extend(right_half)
                    break
                elif not right_half:
                    shuffled.extend(left_half)
                    break
                else:
                    # Tomar 1-3 cartas de un lado
                    take_from_left = random.choice([True, False])
                    cards_to_take = random.randint(1, 3)
                    
                    if take_from_left:
                        taken = left_half[:cards_to_take]
                        left_half = left_half[cards_to_take:]
                    else:
                        taken = right_half[:cards_to_take]
                        right_half = right_half[cards_to_take:]
                    
                    shuffled.extend(taken)
            
            self.deck = shuffled
    
    def deal_cards(self):
        """
        Reparte las cartas en 13 grupos de 4 cartas cada uno.
        Cada grupo representa una posición en el cuadrado mágico del oráculo.
        """
        self.groups = {i: [] for i in range(1, 14)}
        
        # Repartir 4 cartas a cada grupo
        card_index = 0
        for group in range(1, 14):
            for _ in range(4):
                if card_index < len(self.deck):
                    self.groups[group].append(self.deck[card_index])
                    card_index += 1
    
    def start_game(self):
        """
        Inicializa y comienza una nueva partida.
        Crea el mazo, lo mezcla, reparte las cartas e inicia el juego.
        """
        self.create_deck()
        self.shuffle_deck()
        self.deal_cards()
        self.current_group = 13  # Start from center (K)
        self.game_state = "playing"
        self.defeat_reason = ""
        self.moves_history = []
        self.current_card = None
        self.target_group = None
        
        # Set the first card from center (group 13 - K)
        if self.groups[13]:
            self.current_card = self.groups[13][0]
            self.target_group = self.current_card.value
        else:
            self.game_state = "defeat"
            self.defeat_reason = "Centro vacío al iniciar"
    
    def get_current_state(self):
        """
        Obtiene el estado completo del juego para enviar al frontend.
        Incluye información detallada de todos los grupos, cartas y estadísticas.
        """
        groups_data = {}
        for group_num, cards in self.groups.items():
            groups_data[group_num] = {
                'cards': [card.to_dict() for card in cards],
                'count': len(cards),
                'top_card': cards[0].to_dict() if cards else None,
                'is_completely_sorted': self.is_group_completely_sorted(group_num),
                'correct_cards_count': sum(1 for card in cards if card.value == group_num)
            }
        
        return {
            'groups': groups_data,
            'current_group': self.current_group,
            'current_card': self.current_card.to_dict() if self.current_card else None,
            'target_group': self.target_group,
            'game_state': self.game_state,
            'defeat_reason': self.defeat_reason,
            'moves_count': len(self.moves_history),
            'last_move': self.moves_history[-1] if self.moves_history else None,
            'statistics': self.get_game_statistics()
        }
    
    def is_valid_move(self, from_group: int, to_group: int) -> Tuple[bool, str]:
        """
        Valida si un movimiento propuesto es legal según las reglas del oráculo.
        Verifica que el juego esté activo, el grupo origen correcto y que haya cartas.
        """
        if self.game_state != "playing":
            return False, "El juego no está en curso"
        
        if from_group != self.current_group:
            return False, f"Debes tomar la carta del grupo {self.current_group}"
        
        if not self.groups[from_group]:
            return False, f"El grupo {from_group} está vacío"
        
        card = self.groups[from_group][0]
        if to_group != card.value:
            return False, f"La carta {card.rank} debe ir al grupo {card.value}, no al {to_group}"
        
        return True, ""
    
    def make_move(self, from_group: int, to_group: int, is_auto: bool = False) -> Tuple[bool, str]:
        """
        Ejecuta un movimiento de carta de un grupo a otro.
        Actualiza el estado del juego y verifica condiciones de victoria/derrota.
        is_auto: Si es True, salta la validación (para modo automático)
        """
        if not is_auto:
            valid, message = self.is_valid_move(from_group, to_group)
            if not valid:
                return False, message
        
        # Obtener la carta del grupo origen
        card = self.groups[from_group].pop(0)
        
        # Agregar al grupo destino (al final de la pila)
        self.groups[to_group].append(card)
        
        # Registrar el movimiento en el historial
        move = {
            'from_group': from_group,
            'to_group': to_group,
            'card': card.to_dict(),
            'move_number': len(self.moves_history) + 1
        }
        self.moves_history.append(move)
        
        # Actualizar posición actual
        self.current_group = to_group
        
        # Verificar condiciones de fin de juego
        if self.check_victory():
            self.game_state = "victory"
            self.current_card = None
            self.target_group = None
            return True, "¡Victoria! Todas las cartas están ordenadas correctamente."
        
        # Verificar condiciones de derrota
        defeat_reason = self.check_defeat()
        if defeat_reason:
            self.game_state = "defeat"
            self.defeat_reason = defeat_reason
            self.current_card = None
            self.target_group = None
            return True, f"Juego terminado: {defeat_reason}"
        
        # Check for infinite loop scenarios
        loop_reason = self.detect_infinite_loop_scenario()
        if loop_reason:
            self.game_state = "defeat"
            self.defeat_reason = loop_reason
            self.current_card = None
            self.target_group = None
            return True, f"Juego terminado: {loop_reason}"
        
        # Set next card
        if self.groups[self.current_group]:
            self.current_card = self.groups[self.current_group][0]
            self.target_group = self.current_card.value
        else:
            self.game_state = "defeat"
            self.defeat_reason = f"Grupo {self.current_group} vacío"
            self.current_card = None
            self.target_group = None
            return True, f"Juego terminado: Grupo {self.current_group} vacío"
        
        return True, "Movimiento exitoso"
    
    def check_victory(self) -> bool:
        """
        Verifica si el jugador ha ganado.
        Victoria: TODOS los grupos deben tener exactamente sus 4 cartas correctas.
        """
        # Victoria: TODAS las cartas están en sus grupos correctos (ordenamiento completo)
        for group_num in range(1, 14):
            group_cards = self.groups[group_num]
            
            # Cada grupo debe tener exactamente 4 cartas del valor correcto
            if len(group_cards) != 4:
                return False
            
            # Todas las cartas del grupo deben tener el valor correcto
            for card in group_cards:
                if card.value != group_num:
                    return False
        
        return True
    
    def check_defeat(self) -> Optional[str]:
        """
        Verifica condiciones de derrota.
        Detecta bucles infinitos y situaciones sin salida.
        """
        # Verificar si el grupo actual está vacío
        if not self.groups[self.current_group]:
            return f"Grupo {self.current_group} vacío - no hay cartas para mover"
        
        current_card = self.groups[self.current_group][0]
        
        # Verificar bucle infinito: si el grupo actual está completamente ordenado 
        # y la carta apunta al mismo grupo
        if (current_card.value == self.current_group and 
            self.is_group_completely_sorted(self.current_group) and
            not self.all_groups_sorted()):
            return f"Bucle infinito detectado: el grupo {self.current_group} está completamente ordenado pero otros grupos no. ¡Imposible continuar!"
        
        # Verificar auto-loop: carta apunta al mismo grupo y es la única carta
        if (current_card.value == self.current_group and 
            len(self.groups[self.current_group]) == 1):
            return f"Auto-loop: carta {current_card.rank} apunta al mismo grupo {self.current_group} sin más cartas"
        
        return None
    
    def is_group_completely_sorted(self, group_num: int) -> bool:
        """
        Verifica si un grupo específico está completamente ordenado.
        Un grupo está ordenado si tiene exactamente 4 cartas del valor correcto.
        """
        group_cards = self.groups[group_num]
        
        # Must have exactly 4 cards
        if len(group_cards) != 4:
            return False
        
        # All cards must have the correct value for this group
        for card in group_cards:
            if card.value != group_num:
                return False
        
        return True
    
    def all_groups_sorted(self) -> bool:
        """Check if all groups are completely sorted"""
        for group_num in range(1, 14):
            if not self.is_group_completely_sorted(group_num):
                return False
        return True
    
    def detect_infinite_loop_scenario(self) -> Optional[str]:
        """Detect more complex infinite loop scenarios"""
        if not self.groups[self.current_group]:
            return None
        
        current_card = self.groups[self.current_group][0]
        target_group = current_card.value
        
        # If we're in a completely sorted group and the card points to the same group
        if (target_group == self.current_group and 
            self.is_group_completely_sorted(self.current_group)):
            
            # Count how many groups are completely sorted
            sorted_groups = sum(1 for i in range(1, 14) if self.is_group_completely_sorted(i))
            total_groups = 13
            
            if sorted_groups < total_groups:
                return f"¡Bucle infinito! El grupo {self.current_group} está completamente ordenado con {len(self.groups[self.current_group])} cartas correctas, pero {total_groups - sorted_groups} grupos aún necesitan ordenarse. ¡El oráculo se ha cerrado!"
        
        return None
    
    def get_game_statistics(self) -> Dict:
        """
        Obtiene estadísticas detalladas sobre el estado actual del juego.
        Incluye información sobre grupos ordenados, cartas en posición correcta, etc.
        """
        stats = {
            'total_groups': 13,
            'completely_sorted_groups': 0,
            'partially_sorted_groups': 0,
            'unsorted_groups': 0,
            'sorted_group_details': [],
            'cards_in_correct_position': 0,
            'total_cards': 52
        }
        
        for group_num in range(1, 14):
            group_cards = self.groups[group_num]
            correct_cards = sum(1 for card in group_cards if card.value == group_num)
            
            if self.is_group_completely_sorted(group_num):
                stats['completely_sorted_groups'] += 1
                stats['sorted_group_details'].append({
                    'group': group_num,
                    'status': 'completely_sorted',
                    'cards': len(group_cards),
                    'correct_cards': correct_cards
                })
            elif correct_cards > 0:
                stats['partially_sorted_groups'] += 1
                stats['sorted_group_details'].append({
                    'group': group_num,
                    'status': 'partially_sorted',
                    'cards': len(group_cards),
                    'correct_cards': correct_cards
                })
            else:
                stats['unsorted_groups'] += 1
                stats['sorted_group_details'].append({
                    'group': group_num,
                    'status': 'unsorted',
                    'cards': len(group_cards),
                    'correct_cards': correct_cards
                })
            
            stats['cards_in_correct_position'] += correct_cards
        
        return stats
    
    def auto_play_step(self) -> Tuple[bool, str]:
        """
        Ejecuta un paso en modo automático.
        Toma la carta superior del grupo actual y la mueve según las reglas del oráculo.
        """
        if self.game_state != "playing":
            return False, "El juego no está en curso"
        
        if not self.groups[self.current_group]:
            self.game_state = "defeat"
            self.defeat_reason = f"Grupo {self.current_group} vacío"
            return False, self.defeat_reason
        
        card = self.groups[self.current_group][0]
        target = card.value
        
        return self.make_move(self.current_group, target, is_auto=True)
    
    def get_next_move_info(self) -> Dict:
        """
        Obtiene información sobre el próximo movimiento a realizar.
        Útil para mostrar indicaciones visuales al jugador.
        """
        if self.game_state != "playing" or not self.groups[self.current_group]:
            return {}
        
        card = self.groups[self.current_group][0]
        return {
            'from_group': self.current_group,
            'card': card.to_dict(),
            'to_group': card.value,
            'instruction': f"Mover {card.rank}{card.suit} del grupo {self.current_group} al grupo {card.value}"
        }
