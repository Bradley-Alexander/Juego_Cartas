class OracleGame {
    constructor() {
        this.isAutoMode = false;
        this.autoInterval = null;
        this.autoSpeed = 1500; // milliseconds
        this.currentState = null;
        
        this.initializeEventListeners();
        this.updateSpeedDisplay();
    }

    initializeEventListeners() {
        // Button events
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('autoPlayBtn').addEventListener('click', () => this.startAutoMode());
        document.getElementById('stopAutoBtn').addEventListener('click', () => this.stopAutoMode());
        
        // Speed control
        const speedSlider = document.getElementById('autoSpeed');
        speedSlider.addEventListener('input', (e) => {
            this.autoSpeed = parseInt(e.target.value);
            this.updateSpeedDisplay();
        });
        
        // Group click events for manual mode
        document.querySelectorAll('.group').forEach(group => {
            group.addEventListener('click', (e) => this.handleGroupClick(e));
        });
    }

    updateSpeedDisplay() {
        const speedValue = document.getElementById('speedValue');
        speedValue.textContent = `${(this.autoSpeed / 1000).toFixed(1)}s`;
    }

    async startNewGame() {
        try {
            this.showMessage('Iniciando nuevo juego...', 'info');
            const response = await fetch('/api/new_game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentState = data.state;
                this.updateGameDisplay();
                this.updateGameStatus();
                this.showMessage('¡Nuevo juego iniciado! Consulta al oráculo...', 'success');
                
                // Enable auto play button
                document.getElementById('autoPlayBtn').disabled = false;
            } else {
                this.showMessage(`Error: ${data.message}`, 'error');
            }
        } catch (error) {
            this.showMessage(`Error de conexión: ${error.message}`, 'error');
        }
    }

    async startAutoMode() {
        if (this.isAutoMode) return;
        
        this.isAutoMode = true;
        document.getElementById('autoPlayBtn').style.display = 'none';
        document.getElementById('stopAutoBtn').style.display = 'inline-block';
        document.getElementById('newGameBtn').disabled = true;
        
        this.showMessage('Modo automático activado - El oráculo revela su sabiduría...', 'info');
        
        this.autoInterval = setInterval(() => this.executeAutoStep(), this.autoSpeed);
    }

    stopAutoMode() {
        if (!this.isAutoMode) return;
        
        this.isAutoMode = false;
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
        
        document.getElementById('autoPlayBtn').style.display = 'inline-block';
        document.getElementById('stopAutoBtn').style.display = 'none';
        document.getElementById('newGameBtn').disabled = false;
        
        this.showMessage('Modo automático detenido', 'info');
    }

    async executeAutoStep() {
        try {
            const response = await fetch('/api/auto_step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentState = data.state;
                this.updateGameDisplay();
                this.updateGameStatus();
                
                if (!data.can_continue) {
                    this.stopAutoMode();
                    if (this.currentState.game_state === 'victory') {
                        this.showMessage('🎉 ¡Victoria! El oráculo sonríe sobre ti', 'victory');
                    } else {
                        this.showMessage(`💀 ${data.message}`, 'defeat');
                    }
                }
            } else {
                this.stopAutoMode();
                this.showMessage(`Error: ${data.message}`, 'error');
            }
        } catch (error) {
            this.stopAutoMode();
            this.showMessage(`Error de conexión: ${error.message}`, 'error');
        }
    }

    async handleGroupClick(event) {
        if (this.isAutoMode || !this.currentState || this.currentState.game_state !== 'playing') {
            return;
        }
        
        const groupElement = event.currentTarget;
        const toGroup = parseInt(groupElement.dataset.group);
        const fromGroup = this.currentState.current_group;
        
        if (!this.currentState.current_card) {
            this.showMessage('No hay carta actual para mover', 'error');
            return;
        }
        
        // Visual feedback
        this.highlightCardMovement(fromGroup, toGroup);
        
        try {
            const response = await fetch('/api/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from_group: fromGroup,
                    to_group: toGroup
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentState = data.state;
                this.updateGameDisplay();
                this.updateGameStatus();
                
                if (this.currentState.game_state === 'victory') {
                    this.showMessage('🎉 ¡Victoria! Has dominado el oráculo', 'victory');
                    document.getElementById('autoPlayBtn').disabled = true;
                } else if (this.currentState.game_state === 'defeat') {
                    this.showMessage(`💀 ${data.message}`, 'defeat');
                    document.getElementById('autoPlayBtn').disabled = true;
                } else {
                    this.showMessage('Movimiento exitoso', 'success');
                }
            } else {
                this.showMessage(data.message, 'error');
            }
        } catch (error) {
            this.showMessage(`Error de conexión: ${error.message}`, 'error');
        }
    }

    highlightCardMovement(fromGroup, toGroup) {
        // Remove previous highlights
        document.querySelectorAll('.group').forEach(g => {
            g.classList.remove('current', 'target');
        });
        
        // Add movement highlights
        const fromElement = document.querySelector(`[data-group="${fromGroup}"]`);
        const toElement = document.querySelector(`[data-group="${toGroup}"]`);
        
        if (fromElement) fromElement.classList.add('current');
        if (toElement) toElement.classList.add('target');
        
        // Add card animation
        const fromCards = fromElement?.querySelector('.cards-pile');
        if (fromCards && fromCards.children.length > 0) {
            fromCards.children[0].classList.add('moving');
            setTimeout(() => {
                if (fromCards.children[0]) {
                    fromCards.children[0].classList.remove('moving');
                }
            }, 800);
        }
    }

    updateGameDisplay() {
        if (!this.currentState) return;
        
        // Clear all groups first (back to 13 groups)
        for (let i = 1; i <= 13; i++) {
            const pile = document.getElementById(`group-${i}`);
            const countElement = pile.parentElement.querySelector('.card-count');
            
            pile.innerHTML = '';
            countElement.textContent = '0';
        }
        
        // Update each group with cards
        Object.entries(this.currentState.groups).forEach(([groupNum, groupData]) => {
            const pile = document.getElementById(`group-${groupNum}`);
            const countElement = pile.parentElement.querySelector('.card-count');
            const groupElement = pile.parentElement;
            
            // Update card count
            countElement.textContent = groupData.count;
            
            // Show only the top card (face up) and indicate stack
            if (groupData.cards.length > 0) {
                const topCard = groupData.cards[0];
                const cardElement = this.createCardElement(topCard);
                pile.appendChild(cardElement);
                
                // Show stack indicator if more than one card
                if (groupData.cards.length > 1) {
                    const stackIndicator = document.createElement('div');
                    stackIndicator.className = 'stack-indicator';
                    stackIndicator.textContent = `+${groupData.cards.length - 1}`;
                    pile.appendChild(stackIndicator);
                }
            }
            
            // Highlight current and target groups
            groupElement.classList.remove('current', 'target');
            
            if (parseInt(groupNum) === this.currentState.current_group) {
                groupElement.classList.add('current');
            }
            if (parseInt(groupNum) === this.currentState.target_group) {
                groupElement.classList.add('target');
            }
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.suit === '♥' || card.suit === '♦' ? 'hearts' : 'spades'}`;
        cardDiv.textContent = card.display;
        cardDiv.title = `${card.rank} de ${this.getSuitName(card.suit)}`;
        return cardDiv;
    }

    getSuitName(suit) {
        const suits = {
            '♠': 'Espadas',
            '♥': 'Corazones', 
            '♦': 'Diamantes',
            '♣': 'Tréboles'
        };
        return suits[suit] || suit;
    }

    updateGameStatus() {
        if (!this.currentState) return;
        
        const statusElement = document.getElementById('gameStatus');
        const movesElement = document.getElementById('movesCount');
        const currentGroupElement = document.getElementById('currentGroup');
        const instructionElement = document.getElementById('instruction');
        
        // Update status
        let statusText = 'Esperando...';
        let statusClass = '';
        
        switch (this.currentState.game_state) {
            case 'playing':
                statusText = '🎮 Jugando';
                statusClass = 'playing';
                break;
            case 'victory':
                statusText = '🎉 Victoria';
                statusClass = 'victory';
                break;
            case 'defeat':
                statusText = '💀 Derrota';
                statusClass = 'defeat';
                break;
            default:
                statusText = '⏳ Esperando';
                statusClass = 'waiting';
        }
        
        statusElement.textContent = statusText;
        statusElement.className = `value ${statusClass}`;
        
        // Update moves count
        movesElement.textContent = this.currentState.moves_count;
        
        // Update current group
        currentGroupElement.textContent = this.currentState.current_group || '-';
        
        // Update instruction
        let instruction = 'Inicia un nuevo juego para comenzar tu consulta al oráculo';
        
        if (this.currentState.game_state === 'playing' && this.currentState.current_card) {
            const card = this.currentState.current_card;
            instruction = `El oráculo revela: ${card.display} - Muévela del grupo ${this.currentState.current_group} al grupo ${this.currentState.target_group}`;
        } else if (this.currentState.game_state === 'victory') {
            instruction = '🎉 ¡Has dominado completamente el oráculo! Todos los grupos están perfectamente ordenados';
        } else if (this.currentState.game_state === 'defeat') {
            instruction = `💀 El oráculo se ha cerrado: ${this.currentState.defeat_reason}`;
        }
        
        instructionElement.textContent = instruction;
    }

    showMessage(text, type = 'info') {
        const messageArea = document.getElementById('messageArea');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        
        messageArea.appendChild(messageDiv);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
        
        // Keep only last 3 messages
        while (messageArea.children.length > 3) {
            messageArea.removeChild(messageArea.firstChild);
        }
    }

    async loadGameState() {
        try {
            const response = await fetch('/api/game_state');
            const data = await response.json();
            
            if (data.success) {
                this.currentState = data.state;
                this.updateGameDisplay();
                this.updateGameStatus();
            }
        } catch (error) {
            console.error('Error loading game state:', error);
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new OracleGame();
    
    // Load initial state
    game.loadGameState();
    
    // Add some mystical flavor text
    console.log('🔮 Oráculo de la Suerte inicializado');
    console.log('✨ Las cartas esperan revelar tu destino...');
});
