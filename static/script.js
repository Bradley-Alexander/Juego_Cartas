class OracleGameManager {
    constructor() {
        this.currentScreen = 'startScreen';
        this.selectedMode = null;
        this.selectedCharacter = null;
        this.gameInstance = null;
        this.characterEventsInitialized = false;
        this.oracleQuestion = '';
        
        // Esperar a que el DOM esté completamente listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.initializeNavigation(), 100);
            });
        } else {
            setTimeout(() => this.initializeNavigation(), 100);
        }
    }

    initializeNavigation() {
        // Pantalla de inicio
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.showScreen('modeScreen');
        });
        
        document.getElementById('instructionsBtn').addEventListener('click', () => {
            this.showScreen('instructionsScreen');
        });

        // Pantalla de modo
        document.getElementById('manualModeBtn').addEventListener('click', () => {
            this.selectedMode = 'manual';
            this.showScreen('questionScreen');
        });
        
        document.getElementById('autoModeBtn').addEventListener('click', () => {
            this.selectedMode = 'auto';
            this.showScreen('questionScreen');
        });
        
        document.getElementById('backFromModeBtn').addEventListener('click', () => {
            this.showScreen('startScreen');
        });

        // Pantalla de preguntas
        this.initializeQuestionScreen();
        
        document.getElementById('backFromQuestionBtn').addEventListener('click', () => {
            this.showScreen('modeScreen');
        });

        // Pantalla de personajes
        this.initializeCharacterSelection();
        
        document.getElementById('backFromCharacterBtn').addEventListener('click', () => {
            this.showScreen('questionScreen');
        });

        // Pantalla de instrucciones
        document.getElementById('backFromInstructionsBtn').addEventListener('click', () => {
            this.showScreen('startScreen');
        });

        // Pantalla de juego
        document.getElementById('exitGameBtn').addEventListener('click', () => {
            this.exitGame();
        });
    }

    initializeCharacterSelection() {
        // Prevenir inicializaciones múltiples
        if (this.characterEventsInitialized) {
            console.log('🔄 Eventos de personajes ya inicializados, saltando...');
            return;
        }
        
        // Verificar que los elementos existan
        const characterCards = document.querySelectorAll('.character-card');
        console.log('🎭 Inicializando selección de personajes:', characterCards.length, 'tarjetas encontradas');
        
        if (characterCards.length === 0) {
            console.error('❌ No se encontraron tarjetas de personajes');
            // Solo reintentar si aún no hemos inicializado
            if (!this.characterEventsInitialized) {
                setTimeout(() => {
                    console.log('🔄 Reintentando inicialización de personajes...');
                    this.initializeCharacterSelection();
                }, 500);
            }
            return;
        }
        
        // Marcar como inicializados ANTES de configurar eventos
        this.characterEventsInitialized = true;
        
        characterCards.forEach((card, index) => {
            const character = card.dataset.character;
            console.log(`🎯 Configurando evento para personaje ${index + 1}:`, character);
            
            // Limpiar eventos previos
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            // Configurar eventos en el nuevo elemento
            newCard.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log('🎪 Click en personaje:', character);
                this.selectCharacter(character);
            });
            
            // Backup con onclick directo
            newCard.onclick = (event) => {
                event.preventDefault();
                console.log('🎪 Onclick backup en personaje:', character);
                this.selectCharacter(character);
                return false;
            };
            
            // Estilos para indicar que es clickeable
            newCard.style.cursor = 'pointer';
            newCard.style.userSelect = 'none';
            
            // Feedback visual
            newCard.addEventListener('mouseenter', () => {
                console.log('🎯 Hover sobre personaje:', character);
                newCard.style.transform = 'translateY(-3px)';
            });
            
            newCard.addEventListener('mouseleave', () => {
                newCard.style.transform = 'translateY(0)';
            });
        });
        
        // Agregar método alternativo con botones
        this.addCharacterButtons();
        
        console.log('✅ Eventos de personajes inicializados correctamente');
    }

    addCharacterButtons() {
        // Verificar si ya existen botones alternativos
        if (document.getElementById('characterButtonsContainer')) {
            return;
        }
        
        const characterContainer = document.querySelector('.character-container');
        if (!characterContainer) {
            console.error('❌ No se encontró el contenedor de personajes');
            return;
        }
        
        // Crear contenedor de botones alternativos
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'characterButtonsContainer';
        buttonContainer.style.cssText = `
            margin: 20px 0;
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
        `;
        
        // Crear botones para cada personaje
        const characters = [
            { id: 'andres', name: 'Ing. Andrés', emoji: '👨‍🏫' },
            { id: 'bradley', name: 'Bradley', emoji: '👨‍💻' },
            { id: 'student', name: 'Estudiante Promedio', emoji: '🎓' }
        ];
        
        characters.forEach(char => {
            const button = document.createElement('button');
            button.className = 'pixel-btn primary';
            button.textContent = `${char.emoji} ${char.name}`;
            button.style.fontSize = '14px';
            
            button.addEventListener('click', () => {
                console.log('🎯 Botón alternativo clickeado:', char.id);
                this.selectCharacter(char.id);
            });
            
            buttonContainer.appendChild(button);
        });
        
        // Insertar antes del botón "VOLVER"
        const backButton = document.getElementById('backFromCharacterBtn');
        if (backButton) {
            characterContainer.insertBefore(buttonContainer, backButton);
        } else {
            characterContainer.appendChild(buttonContainer);
        }
        
        console.log('🎛️ Botones alternativos de personajes agregados');
    }

    showScreen(screenId) {
        console.log('🎬 Cambiando a pantalla:', screenId);
        
        // Ocultar pantalla actual
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar nueva pantalla
        const targetScreen = document.getElementById(screenId);
        if (!targetScreen) {
            console.error('❌ Pantalla no encontrada:', screenId);
            return;
        }
        
        targetScreen.classList.add('active');
        this.currentScreen = screenId;
        
        // Manejo especial para la pantalla de personajes
        if (screenId === 'characterScreen') {
            console.log('🎭 Reentrando a pantalla de personajes...');
            
            // Resetear flag y forzar reinicialización
            this.characterEventsInitialized = false;
            
            // Usar múltiples timeouts para asegurar que el DOM esté listo
            setTimeout(() => {
                this.initializeCharacterSelection();
            }, 50);
            
            setTimeout(() => {
                this.initializeCharacterSelection();
            }, 200);
            
            setTimeout(() => {
                this.initializeCharacterSelection();
            }, 500);
        }

        // Manejo especial para la pantalla de preguntas
        if (screenId === 'questionScreen') {
            console.log('🔮 Mostrando pantalla de preguntas...');
            
            // Enfocar el textarea después de que la pantalla esté visible
            setTimeout(() => {
                const questionInput = document.getElementById('oracleQuestion');
                if (questionInput) {
                    questionInput.focus();
                    questionInput.click(); // Forzar click para activar en algunos browsers
                    console.log('🎯 Textarea enfocado en showScreen');
                }
            }, 100);
            
            setTimeout(() => {
                const questionInput = document.getElementById('oracleQuestion');
                if (questionInput) {
                    questionInput.focus();
                }
            }, 300);
        }
    }

    selectCharacter(character) {
        console.log('🎯 Seleccionando personaje:', character);
        
        if (!character) {
            console.error('❌ No se proporcionó personaje');
            return;
        }
        
        // Remover selección anterior
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Seleccionar nuevo personaje
        const selectedCard = document.querySelector(`[data-character="${character}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            console.log('✅ Personaje seleccionado visualmente:', character);
        } else {
            console.error('❌ No se encontró el elemento del personaje:', character);
            return;
        }
        
        this.selectedCharacter = character;
        console.log('💾 Personaje guardado en memoria:', this.selectedCharacter);

        // Mostrar mensaje de confirmación
        const characterName = selectedCard.querySelector('.character-name').textContent;
        console.log('🎪 Iniciando juego con:', characterName);

        // Esperar un momento y luego iniciar el juego
        setTimeout(() => {
            console.log('🚀 Iniciando partida...');
            this.startGame();
        }, 1000);
    }

    initializeQuestionScreen() {
        // Asegurar que los elementos existan antes de agregar eventos
        const questionInput = document.getElementById('oracleQuestion');
        const charCount = document.getElementById('questionCharCount');
        const confirmBtn = document.getElementById('confirmQuestionBtn');
        const questionPreview = document.getElementById('questionPreview');
        const questionText = document.getElementById('questionText');
        const editBtn = document.getElementById('editQuestionBtn');
        const inputSection = document.querySelector('.question-input-section');

        if (!questionInput || !charCount || !confirmBtn) {
            console.error('❌ Elementos de la pantalla de preguntas no encontrados');
            return;
        }

        console.log('🔮 Inicializando pantalla de preguntas...');

        // Asegurar que el textarea esté habilitado y enfocable
        questionInput.disabled = false;
        questionInput.readOnly = false;
        questionInput.style.pointerEvents = 'auto';

        // Contador de caracteres
        questionInput.addEventListener('input', (e) => {
            console.log('📝 Input detectado:', e.target.value.length);
            const length = e.target.value.length;
            charCount.textContent = length;
            
            // Habilitar/deshabilitar botón según la longitud
            if (length >= 10 && length <= 200) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = '🔮 CONSULTAR AL ORÁCULO';
            } else if (length < 10) {
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Escribe al menos 10 caracteres';
            } else {
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Máximo 200 caracteres';
            }
        });

        // También escuchar el evento keyup para mayor compatibilidad
        questionInput.addEventListener('keyup', (e) => {
            console.log('⌨️ Keyup detectado:', e.target.value.length);
            const event = new Event('input');
            e.target.dispatchEvent(event);
        });

        // Confirmar pregunta
        confirmBtn.addEventListener('click', () => {
            const question = questionInput.value.trim();
            console.log('✅ Confirmar pregunta:', question);
            if (question.length >= 10) {
                this.oracleQuestion = question;
                
                // Mostrar preview
                if (questionText && questionPreview && inputSection) {
                    questionText.textContent = question;
                    questionPreview.style.display = 'block';
                    inputSection.style.display = 'none';
                    confirmBtn.textContent = '🔮 INICIAR CONSULTA';
                    confirmBtn.onclick = () => this.showScreen('characterScreen');
                }
            }
        });

        // Editar pregunta
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                console.log('✏️ Editar pregunta');
                if (questionPreview && inputSection) {
                    questionPreview.style.display = 'none';
                    inputSection.style.display = 'flex';
                    confirmBtn.textContent = '🔮 CONSULTAR AL ORÁCULO';
                    confirmBtn.onclick = null;
                    
                    // Recalcular estado del botón
                    const length = questionInput.value.length;
                    if (length >= 10 && length <= 200) {
                        confirmBtn.disabled = false;
                    } else {
                        confirmBtn.disabled = true;
                    }
                    
                    // Enfocar el textarea
                    setTimeout(() => {
                        questionInput.focus();
                    }, 100);
                }
            });
        }

        // Enfocar el textarea cuando se muestre la pantalla
        setTimeout(() => {
            if (questionInput && this.currentScreen === 'questionScreen') {
                questionInput.focus();
                console.log('🎯 Textarea enfocado');
            }
        }, 500);
    }
    
    resetQuestionScreen() {
        console.log('🔄 Reseteando pantalla de preguntas');
        const questionInput = document.getElementById('oracleQuestion');
        const charCount = document.getElementById('questionCharCount');
        const confirmBtn = document.getElementById('confirmQuestionBtn');
        const questionPreview = document.getElementById('questionPreview');
        const inputSection = document.querySelector('.question-input-section');
        
        if (questionInput) {
            questionInput.value = '';
            questionInput.disabled = false;
            questionInput.readOnly = false;
        }
        if (charCount) charCount.textContent = '0';
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = '🔮 CONSULTAR AL ORÁCULO';
            confirmBtn.onclick = null;
        }
        if (questionPreview) questionPreview.style.display = 'none';
        if (inputSection) inputSection.style.display = 'flex';
        this.oracleQuestion = '';
        
        console.log('✅ Pantalla de preguntas reseteada');
    }

    startGame() {
        console.log('🎮 Iniciando juego con modo:', this.selectedMode, 'y personaje:', this.selectedCharacter);
        
        if (!this.selectedMode || !this.selectedCharacter) {
            console.error('❌ Faltan datos para iniciar el juego. Modo:', this.selectedMode, 'Personaje:', this.selectedCharacter);
            return;
        }
        
        // Configurar información del jugador
        this.setupPlayerInfo();
        
        // Mostrar la pregunta del oráculo si existe
        this.displayOracleQuestion();
        
        // Mostrar pantalla de juego
        this.showScreen('gameScreen');
        
        // Inicializar el juego
        console.log('🔧 Creando instancia del juego...');
        this.gameInstance = new OracleGame(this.selectedMode);
        
        // Iniciar automáticamente una nueva partida
        setTimeout(() => {
            console.log('🎲 Iniciando nueva partida...');
            this.gameInstance.startNewGame();
        }, 500);
    }

    displayOracleQuestion() {
        const questionDisplay = document.getElementById('oracleQuestionDisplay');
        const currentQuestionText = document.getElementById('currentQuestionText');
        
        if (this.oracleQuestion) {
            currentQuestionText.textContent = this.oracleQuestion;
            questionDisplay.style.display = 'block';
        } else {
            questionDisplay.style.display = 'none';
        }
    }

    getOracleAnswerMessage(isVictory) {
        if (!this.oracleQuestion) {
            return isVictory ? 
                'El oráculo sonríe sobre ti - Has dominado las cartas' : 
                'El oráculo se ha cerrado - Las cartas no pudieron continuar';
        }

        const answer = isVictory ? 'SÍ' : 'NO';
        const answerColor = isVictory ? '✨' : '🌑';
        
        return `${answerColor} El oráculo responde: "${answer}" a tu pregunta. ${isVictory ? 'Las cartas confirman tu destino' : 'Las cartas niegan tu consulta'}`;
    }

    setupPlayerInfo() {
        const characterAvatar = document.getElementById('selectedCharacter');
        const playerName = document.getElementById('playerName');
        
        characterAvatar.className = `character-avatar ${this.selectedCharacter}`;
        
        switch(this.selectedCharacter) {
            case 'andres':
                playerName.textContent = 'Ing. Andrés';
                break;
            case 'bradley':
                playerName.textContent = 'Bradley';
                break;
            case 'student':
                playerName.textContent = 'Estudiante Promedio';
                break;
        }
    }

    exitGame() {
        // Detener el juego si está en modo automático
        if (this.gameInstance && this.gameInstance.isAutoMode) {
            this.gameInstance.stopAutoMode();
        }
        
        // Resetear variables
        this.selectedMode = null;
        this.selectedCharacter = null;
        this.gameInstance = null;
        
        // Resetear pantalla de pregunta
        this.resetQuestionScreen();
        
        // Remover selecciones
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Volver a la pantalla de inicio
        this.showScreen('startScreen');
    }
}

class SoundManager {
    /**
     * Maneja todos los sonidos del juego incluido el audio ambiental.
     * Proporciona métodos para reproducir efectos de sonido y controlar el volumen.
     */
    constructor() {
        this.sounds = {};
        this.ambientSound = null;
        this.soundEnabled = true;
        this.ambientEnabled = true;
        this.volume = 0.7;
        this.ambientVolume = 0.3;
        
        this.initializeSounds();
    }
    
    initializeSounds() {
        /**
         * Inicializa todos los archivos de sonido del juego.
         * Crea elementos de audio para efectos y sonido ambiental.
         */
        console.log('🔊 Inicializando sistema de sonidos...');
        
        // Sonidos de efectos (se pueden reemplazar con archivos reales)
        this.sounds = {
            cardMove: this.createAudioElement('card-move'),
            shuffle: this.createAudioElement('shuffle'),
            victory: this.createAudioElement('victory'),
            defeat: this.createAudioElement('defeat'),
            button: this.createAudioElement('button')
        };
        
        // Sonido ambiental
        this.ambientSound = this.createAudioElement('ambient', true);
        if (this.ambientSound) {
            this.ambientSound.volume = this.ambientVolume;
        }
    }
    
    createAudioElement(soundName, isAmbient = false) {
        /**
         * Crea un elemento de audio para un sonido específico.
         * Genera tonos sintéticos si no hay archivos de audio disponibles.
         */
        const audio = new Audio();
        
        // Intentar cargar archivo de audio, si no existe usar tono sintético
        const audioPath = `/static/sounds/${soundName}.mp3`;
        
        audio.addEventListener('error', () => {
            console.log(`🎵 Generando tono sintético para: ${soundName}`);
            // Si no se puede cargar el archivo, usar generación sintética
            this.createSyntheticSound(soundName, audio);
        });
        
        audio.src = audioPath;
        audio.volume = isAmbient ? this.ambientVolume : this.volume;
        audio.preload = 'auto';
        
        if (isAmbient) {
            audio.loop = true;
        }
        
        return audio;
    }
    
    createSyntheticSound(soundName, audioElement) {
        /**
         * Genera sonidos sintéticos usando Web Audio API cuando no hay archivos de audio.
         */
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.log('❌ Web Audio API no disponible');
            return;
        }
        
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        audioElement.playSynthetic = () => {
            if (!this.soundEnabled) return;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Configurar sonido según el tipo
            switch(soundName) {
                case 'card-move':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.15);
                    break;
                    
                case 'shuffle':
                    // Sonido de barajado - múltiples tonos rápidos
                    for(let i = 0; i < 8; i++) {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        
                        osc.frequency.value = 200 + Math.random() * 300;
                        gain.gain.setValueAtTime(this.volume * 0.2, audioContext.currentTime + i * 0.05);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.05 + 0.08);
                        
                        osc.start(audioContext.currentTime + i * 0.05);
                        osc.stop(audioContext.currentTime + i * 0.05 + 0.08);
                    }
                    break;
                    
                case 'victory':
                    // Acorde de victoria
                    [523.25, 659.25, 783.99].forEach((freq, i) => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(audioContext.destination);
                        
                        osc.frequency.value = freq;
                        gain.gain.setValueAtTime(this.volume * 0.4, audioContext.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                        
                        osc.start(audioContext.currentTime);
                        osc.stop(audioContext.currentTime + 1);
                    });
                    break;
                    
                case 'defeat':
                    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(this.volume * 0.4, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                    break;
                    
                case 'button':
                    oscillator.frequency.value = 1000;
                    gainNode.gain.setValueAtTime(this.volume * 0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
            }
        };
    }
    
    playSound(soundName) {
        /**
         * Reproduce un efecto de sonido específico.
         */
        if (!this.soundEnabled) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            if (sound.playSynthetic) {
                sound.playSynthetic();
            } else {
                sound.currentTime = 0;
                sound.play().catch(e => {
                    console.log(`🔇 No se pudo reproducir sonido: ${soundName}`);
                    // Intentar sonido sintético como respaldo
                    if (sound.playSynthetic) {
                        sound.playSynthetic();
                    }
                });
            }
        }
    }
    
    startAmbientSound() {
        /**
         * Inicia el sonido ambiental del juego.
         */
        if (!this.ambientEnabled || !this.ambientSound) return;
        
        this.ambientSound.play().catch(e => {
            console.log('🎵 Sonido ambiental no disponible, usando silencio');
        });
    }
    
    stopAmbientSound() {
        /**
         * Detiene el sonido ambiental.
         */
        if (this.ambientSound) {
            this.ambientSound.pause();
            this.ambientSound.currentTime = 0;
        }
    }
    
    toggleSound() {
        /**
         * Activa/desactiva los efectos de sonido.
         */
        this.soundEnabled = !this.soundEnabled;
        console.log('🔊 Sonidos:', this.soundEnabled ? 'activados' : 'desactivados');
    }
    
    toggleAmbient() {
        /**
         * Activa/desactiva el sonido ambiental.
         */
        this.ambientEnabled = !this.ambientEnabled;
        if (this.ambientEnabled) {
            this.startAmbientSound();
        } else {
            this.stopAmbientSound();
        }
        console.log('🎵 Sonido ambiental:', this.ambientEnabled ? 'activado' : 'desactivado');
    }
    
    setVolume(volume) {
        /**
         * Ajusta el volumen de los efectos de sonido.
         */
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = this.volume;
        });
    }
    
    setAmbientVolume(volume) {
        /**
         * Ajusta el volumen del sonido ambiental.
         */
        this.ambientVolume = Math.max(0, Math.min(1, volume));
        if (this.ambientSound) {
            this.ambientSound.volume = this.ambientVolume;
        }
    }
}

class OracleGame {
    constructor(mode) {
        console.log('🎮 Creando instancia OracleGame con modo:', mode);
        
        this.gameMode = mode;
        this.isAutoMode = false; // Siempre empezar en false, se activará después
        this.autoInterval = null;
        this.autoSpeed = 1500;
        this.currentState = null;
        this.isShuffleAnimationActive = false;
        
        // Inicializar sistema de sonidos
        this.soundManager = new SoundManager();
        
        console.log('🔧 Configuración inicial - gameMode:', this.gameMode, 'isAutoMode:', this.isAutoMode);
        
        this.initializeGameControls();
        this.updateSpeedDisplay();
        
        // Iniciar sonido ambiental
        setTimeout(() => {
            this.soundManager.startAmbientSound();
        }, 1000);
    }

    initializeGameControls() {
        console.log('🎛️ Inicializando controles para modo:', this.gameMode);
        
        // Eventos de botones
        document.getElementById('newGameBtn').addEventListener('click', () => this.startNewGame());
        
        // Botón de rebarajado - solo habilitado antes del primer movimiento
        const reshuffleBtn = document.getElementById('reshuffleBtn');
        if (reshuffleBtn) {
            reshuffleBtn.addEventListener('click', () => this.reshuffleCards());
        }
        
        // Controles de sonido
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (soundToggleBtn) {
            soundToggleBtn.addEventListener('click', () => {
                this.soundManager.toggleSound();
                this.updateSoundButtons();
            });
        }
        
        const ambientToggleBtn = document.getElementById('ambientToggleBtn');
        if (ambientToggleBtn) {
            ambientToggleBtn.addEventListener('click', () => {
                this.soundManager.toggleAmbient();
                this.updateSoundButtons();
            });
        }
        
        // Configurar botones según el modo
        const autoPlayBtn = document.getElementById('autoPlayBtn');
        const stopAutoBtn = document.getElementById('stopAutoBtn');
        
        if (this.gameMode === 'manual') {
            // Modo manual: mostrar todos los controles
            console.log('⚙️ Configurando controles para modo manual');
            autoPlayBtn.addEventListener('click', () => this.startAutoMode());
            stopAutoBtn.addEventListener('click', () => this.stopAutoMode());
            autoPlayBtn.style.display = 'inline-block';
            stopAutoBtn.style.display = 'none';
        } else {
            // Modo automático: ocultar controles de auto/stop
            console.log('🤖 Configurando controles para modo automático');
            autoPlayBtn.style.display = 'none';
            stopAutoBtn.style.display = 'none';
            
            // Agregar mensaje informativo
            setTimeout(() => {
                this.showMessage('🤖 Modo automático seleccionado - El juego se ejecutará solo', 'info');
            }, 100);
        }
        
        // Control de velocidad (siempre disponible)
        const speedSlider = document.getElementById('autoSpeed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.autoSpeed = parseInt(e.target.value);
                this.updateSpeedDisplay();
                console.log('🏃 Velocidad cambiada a:', this.autoSpeed, 'ms');
            });
        }
        
        // Eventos de click en grupos (solo en modo manual)
        if (this.gameMode === 'manual') {
            console.log('👆 Configurando eventos de click para modo manual');
            document.querySelectorAll('.group').forEach(group => {
                group.addEventListener('click', (e) => this.handleGroupClick(e));
            });
        } else {
            console.log('🚫 Saltando eventos de click (modo automático)');
        }
    }

    updateSpeedDisplay() {
        const speedValue = document.getElementById('speedValue');
        if (speedValue) {
            speedValue.textContent = `${(this.autoSpeed / 1000).toFixed(1)}s`;
        }
    }

    async showShuffleAnimation() {
        /**
         * Muestra una animación de barajado de cartas.
         * Simula el proceso de partir el mazo por la mitad y entreverar las cartas.
         */
        return new Promise((resolve) => {
            console.log('🃏 Iniciando animación de barajado...');
            this.isShuffleAnimationActive = true;
            
            // Reproducir sonido de barajado
            this.soundManager.playSound('shuffle');
            
            // Crear elemento de animación
            const shuffleContainer = document.createElement('div');
            shuffleContainer.className = 'shuffle-animation-container';
            shuffleContainer.innerHTML = `
                <div class="shuffle-animation">
                    <div class="card-deck left-deck">
                        <div class="card-pile">
                            ${Array(26).fill(0).map((_, i) => `<div class="mini-card" style="animation-delay: ${i * 0.02}s"></div>`).join('')}
                        </div>
                    </div>
                    <div class="card-deck right-deck">
                        <div class="card-pile">
                            ${Array(26).fill(0).map((_, i) => `<div class="mini-card" style="animation-delay: ${(i + 26) * 0.02}s"></div>`).join('')}
                        </div>
                    </div>
                    <div class="shuffle-text">🃏 Barajeando cartas...</div>
                </div>
            `;
            
            // Agregar al DOM
            document.body.appendChild(shuffleContainer);
            
            // Animar
            setTimeout(() => {
                shuffleContainer.classList.add('active');
            }, 100);
            
            // Remover después de la animación
            setTimeout(() => {
                shuffleContainer.classList.add('fade-out');
                setTimeout(() => {
                    if (shuffleContainer.parentNode) {
                        shuffleContainer.parentNode.removeChild(shuffleContainer);
                    }
                    this.isShuffleAnimationActive = false;
                    console.log('✅ Animación de barajado completada');
                    resolve();
                }, 500);
            }, 2500);
        });
    }

    async reshuffleCards() {
        /**
         * Rebarajea las cartas antes del primer movimiento.
         * Solo disponible si no se han realizado movimientos.
         */
        if (!this.currentState || this.currentState.moves_count > 0) {
            this.showMessage('❌ No se puede rebarajear después de realizar movimientos', 'error');
            return;
        }
        
        if (this.isShuffleAnimationActive) {
            this.showMessage('⏳ Esperando que termine el barajado actual...', 'info');
            return;
        }
        
        try {
            this.showMessage('🔄 Rebarajeando cartas...', 'info');
            
            // Mostrar animación de barajado
            await this.showShuffleAnimation();
            
            const response = await fetch('/api/reshuffle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentState = data.state;
                this.updateGameDisplay();
                this.updateGameStatus();
                this.updateReshuffleButton();
                this.showMessage('🔄 ¡Cartas rebarajeadas! Nueva distribución lista', 'success');
                this.soundManager.playSound('button');
            } else {
                this.showMessage(`❌ Error al rebarajear: ${data.message}`, 'error');
                this.soundManager.playSound('defeat');
            }
        } catch (error) {
            this.showMessage(`🔌 Error de conexión: ${error.message}`, 'error');
            this.soundManager.playSound('defeat');
        }
    }

    updateReshuffleButton() {
        /**
         * Actualiza el estado del botón de rebarajado.
         * Solo habilitado antes del primer movimiento.
         */
        const reshuffleBtn = document.getElementById('reshuffleBtn');
        if (reshuffleBtn && this.currentState) {
            const canReshuffle = this.currentState.moves_count === 0 && 
                               this.currentState.game_state === 'playing' &&
                               !this.isShuffleAnimationActive;
            
            reshuffleBtn.disabled = !canReshuffle;
            reshuffleBtn.title = canReshuffle ? 
                'Rebarajear cartas (solo antes del primer movimiento)' : 
                'No disponible: ya se realizaron movimientos';
        }
    }

    updateSoundButtons() {
        /**
         * Actualiza el estado visual de los botones de sonido.
         */
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        const ambientToggleBtn = document.getElementById('ambientToggleBtn');
        
        if (soundToggleBtn) {
            soundToggleBtn.textContent = this.soundManager.soundEnabled ? '🔊' : '🔇';
            soundToggleBtn.title = this.soundManager.soundEnabled ? 
                'Desactivar efectos de sonido' : 'Activar efectos de sonido';
        }
        
        if (ambientToggleBtn) {
            ambientToggleBtn.textContent = this.soundManager.ambientEnabled ? '🎵' : '🎵';
            ambientToggleBtn.style.opacity = this.soundManager.ambientEnabled ? '1' : '0.5';
            ambientToggleBtn.title = this.soundManager.ambientEnabled ? 
                'Desactivar sonido ambiental' : 'Activar sonido ambiental';
        }
    }

    async startNewGame() {
        try {
            this.showMessage('🔮 Preparando nueva consulta al oráculo...', 'info');
            
            // Mostrar animación de barajado antes de hacer la petición
            await this.showShuffleAnimation();
            
            const response = await fetch('/api/new_game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentState = data.state;
                this.updateGameDisplay();
                this.updateGameStatus();
                this.updateReshuffleButton();
                this.showMessage('✨ ¡El oráculo ha mezclado las cartas! La consulta ha comenzado...', 'success');
                
                // Reproducir sonido de éxito
                this.soundManager.playSound('button');
                
                // Si es modo automático, iniciar inmediatamente SIN delay
                if (this.gameMode === 'auto') {
                    console.log('🤖 Modo automático detectado, iniciando inmediatamente...');
                    this.startAutoMode();
                } else {
                    const autoPlayBtn = document.getElementById('autoPlayBtn');
                    if (autoPlayBtn) autoPlayBtn.disabled = false;
                }
            } else {
                this.showMessage(`❌ Error: ${data.message}`, 'error');
                this.soundManager.playSound('defeat');
            }
        } catch (error) {
            this.showMessage(`🔌 Error de conexión: ${error.message}`, 'error');
            this.soundManager.playSound('defeat');
        }
    }

    async startAutoMode() {
        console.log('🤖 Iniciando modo automático. isAutoMode actual:', this.isAutoMode, 'gameMode:', this.gameMode);
        
        if (this.isAutoMode) {
            console.log('⚠️ Modo automático ya está activo');
            return;
        }
        
        this.isAutoMode = true;
        
        // Ocultar/mostrar botones según el modo
        const autoPlayBtn = document.getElementById('autoPlayBtn');
        const stopAutoBtn = document.getElementById('stopAutoBtn');
        const newGameBtn = document.getElementById('newGameBtn');
        
        if (this.gameMode === 'manual') {
            // En modo manual, mostrar controles
            autoPlayBtn.style.display = 'none';
            stopAutoBtn.style.display = 'inline-block';
            newGameBtn.disabled = true;
        } else {
            // En modo automático puro, ocultar todos los controles excepto nueva partida
            autoPlayBtn.style.display = 'none';
            stopAutoBtn.style.display = 'none';
            newGameBtn.disabled = true;
        }
        
        this.showMessage('⚡ Modo automático activado - El oráculo revela su sabiduría...', 'info');
        
        console.log('🎯 Configurando intervalo automático con velocidad:', this.autoSpeed, 'ms');
        this.autoInterval = setInterval(() => this.executeAutoStep(), this.autoSpeed);
    }

    stopAutoMode() {
        console.log('⏹️ Deteniendo modo automático. isAutoMode actual:', this.isAutoMode);
        
        if (!this.isAutoMode) {
            console.log('⚠️ Modo automático ya está detenido');
            return;
        }
        
        this.isAutoMode = false;
        
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
            console.log('✅ Intervalo automático detenido');
        }
        
        const autoPlayBtn = document.getElementById('autoPlayBtn');
        const stopAutoBtn = document.getElementById('stopAutoBtn');
        const newGameBtn = document.getElementById('newGameBtn');
        
        if (this.gameMode === 'manual') {
            // En modo manual, restaurar controles
            autoPlayBtn.style.display = 'inline-block';
            stopAutoBtn.style.display = 'none';
            newGameBtn.disabled = false;
            this.showMessage('⏸️ Modo automático detenido', 'info');
        } else {
            // En modo automático puro, mantener controles ocultos
            autoPlayBtn.style.display = 'none';
            stopAutoBtn.style.display = 'none';
            // newGameBtn se maneja en executeAutoStep
        }
    }

    async executeAutoStep() {
        try {
            console.log('🎲 Ejecutando paso automático...');
            
            const response = await fetch('/api/auto_step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Reproducir sonido de movimiento automático
                this.soundManager.playSound('cardMove');
                
                this.currentState = data.state;
                this.updateGameDisplay();
                this.updateGameStatus();
                this.updateReshuffleButton(); // Actualizar botón de rebarajado
                
                console.log('✅ Paso ejecutado. Puede continuar:', data.can_continue, 'Estado:', this.currentState.game_state);
                
                if (!data.can_continue) {
                    console.log('🏁 Partida terminada, deteniendo modo automático');
                    this.stopAutoMode();
                    
                    if (this.currentState.game_state === 'victory') {
                        const oracleAnswer = this.getOracleAnswerMessage(true);
                        this.showMessage(`🎉 ¡VICTORIA! ${oracleAnswer}`, 'victory');
                        this.soundManager.playSound('victory');
                    } else {
                        // Verificar si es una derrota por bucle infinito
                        const isInfiniteLoop = data.message && (
                            data.message.includes('Bucle infinito') || 
                            data.message.includes('bucle infinito') ||
                            data.message.includes('Auto-loop') ||
                            data.message.includes('auto-loop') ||
                            this.currentState.defeat_reason && (
                                this.currentState.defeat_reason.includes('Bucle infinito') ||
                                this.currentState.defeat_reason.includes('bucle infinito') ||
                                this.currentState.defeat_reason.includes('Auto-loop') ||
                                this.currentState.defeat_reason.includes('auto-loop')
                            )
                        );
                        
                        if (isInfiniteLoop) {
                            this.showMessage(`🔄 BUCLE INFINITO DETECTADO: ${data.message}`, 'defeat');
                            this.showMessage('⚠️ El oráculo ha entrado en un bucle infinito. Este tipo de partida no puede continuarse.', 'error');
                            this.showMessage('🎮 Presiona "Nueva Partida" para intentar con una nueva configuración de cartas.', 'info');
                            this.soundManager.playSound('defeat');
                        } else {
                            this.showMessage(`💀 DERROTA: ${data.message}`, 'defeat');
                            this.soundManager.playSound('defeat');
                        }
                    }
                    
                    // Habilitar nueva partida después de terminar
                    document.getElementById('newGameBtn').disabled = false;
                    
                    // Si es modo automático puro Y NO es bucle infinito, ofrecer reinicio automático
                    if (this.gameMode === 'auto' && this.currentState.game_state === 'victory') {
                        setTimeout(() => {
                            this.showMessage('🔄 Nueva partida automática en 3 segundos...', 'info');
                            setTimeout(() => {
                                console.log('🔁 Iniciando nueva partida automática');
                                this.startNewGame();
                            }, 3000);
                        }, 2000);
                    }
                    // Para bucle infinito o derrotas normales, requerir intervención manual
                }
            } else {
                console.error('❌ Error en paso automático:', data.message);
                this.stopAutoMode();
                this.showMessage(`❌ Error: ${data.message}`, 'error');
                document.getElementById('newGameBtn').disabled = false;
            }
        } catch (error) {
            console.error('🔌 Error de conexión en paso automático:', error);
            this.stopAutoMode();
            this.showMessage(`🔌 Error de conexión: ${error.message}`, 'error');
            document.getElementById('newGameBtn').disabled = false;
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
            this.showMessage('❌ No hay carta actual para mover', 'error');
            return;
        }
        
        // Efecto visual
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
                // Reproducir sonido de movimiento
                this.soundManager.playSound('cardMove');
                
                this.currentState = data.state;
                this.updateGameDisplay();
                this.updateGameStatus();
                this.updateReshuffleButton(); // Actualizar botón de rebarajado
                
                if (this.currentState.game_state === 'victory') {
                    const oracleAnswer = this.getOracleAnswerMessage(true);
                    this.showMessage(`🎉 ¡VICTORIA! ${oracleAnswer}`, 'victory');
                    this.soundManager.playSound('victory');
                    const autoPlayBtn = document.getElementById('autoPlayBtn');
                    if (autoPlayBtn) autoPlayBtn.disabled = true;
                } else if (this.currentState.game_state === 'defeat') {
                    const oracleAnswer = this.getOracleAnswerMessage(false);
                    this.showMessage(`💀 DERROTA: ${oracleAnswer}`, 'defeat');
                    this.soundManager.playSound('defeat');
                    const autoPlayBtn = document.getElementById('autoPlayBtn');
                    if (autoPlayBtn) autoPlayBtn.disabled = true;
                } else {
                    this.showMessage('✅ Movimiento exitoso', 'success');
                }
            } else {
                this.showMessage(`❌ ${data.message}`, 'error');
            }
        } catch (error) {
            this.showMessage(`🔌 Error de conexión: ${error.message}`, 'error');
        }
    }

    highlightCardMovement(fromGroup, toGroup) {
        // Remover highlights previos
        document.querySelectorAll('.group').forEach(g => {
            g.classList.remove('current', 'target');
        });
        
        // Añadir highlights de movimiento
        const fromElement = document.querySelector(`[data-group="${fromGroup}"]`);
        const toElement = document.querySelector(`[data-group="${toGroup}"]`);
        
        if (fromElement) fromElement.classList.add('current');
        if (toElement) toElement.classList.add('target');
        
        // Animación de carta
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
        
        // Limpiar todos los grupos
        for (let i = 1; i <= 13; i++) {
            const pile = document.getElementById(`group-${i}`);
            const countElement = pile.parentElement.querySelector('.card-count');
            
            pile.innerHTML = '';
            countElement.textContent = '0';
        }
        
        // Actualizar cada grupo con cartas
        Object.entries(this.currentState.groups).forEach(([groupNum, groupData]) => {
            const pile = document.getElementById(`group-${groupNum}`);
            const countElement = pile.parentElement.querySelector('.card-count');
            const groupElement = pile.parentElement;
            
            // Actualizar contador de cartas
            countElement.textContent = groupData.count;
            
            // Mostrar solo la carta superior y indicador de pila
            if (groupData.cards.length > 0) {
                const topCard = groupData.cards[0];
                const cardElement = this.createCardElement(topCard);
                pile.appendChild(cardElement);
                
                // Mostrar indicador de pila si hay más de una carta
                if (groupData.cards.length > 1) {
                    const stackIndicator = document.createElement('div');
                    stackIndicator.className = 'stack-indicator';
                    stackIndicator.textContent = `+${groupData.cards.length - 1}`;
                    pile.appendChild(stackIndicator);
                }
            }
            
            // Resaltar grupos actuales y objetivo
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
        
        // Actualizar estado
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
        
        // Actualizar contador de movimientos
        movesElement.textContent = this.currentState.moves_count;
        
        // Actualizar grupo actual
        currentGroupElement.textContent = this.currentState.current_group || '-';
        
        // Actualizar instrucción
        let instruction = 'Presiona "Nueva Partida" para comenzar tu consulta al oráculo';
        
        if (this.currentState.game_state === 'playing' && this.currentState.current_card) {
            const card = this.currentState.current_card;
            instruction = `🔮 El oráculo revela: ${card.display} - Muévela del grupo ${this.currentState.current_group} al grupo ${this.currentState.target_group}`;
            
            // Agregar indicador de modo automático
            if (this.isAutoMode) {
                instruction = `🤖 ${instruction} (AUTOMÁTICO)`;
            }
        } else if (this.currentState.game_state === 'victory') {
            instruction = '🎉 ¡Has dominado completamente el oráculo! Todos los grupos están perfectamente ordenados';
        } else if (this.currentState.game_state === 'defeat') {
            // Detectar si es bucle infinito para mostrar mensaje específico
            const isInfiniteLoop = this.currentState.defeat_reason && (
                this.currentState.defeat_reason.includes('Bucle infinito') ||
                this.currentState.defeat_reason.includes('bucle infinito') ||
                this.currentState.defeat_reason.includes('Auto-loop') ||
                this.currentState.defeat_reason.includes('auto-loop')
            );
            
            if (isInfiniteLoop) {
                instruction = `� BUCLE INFINITO: ${this.currentState.defeat_reason}`;
                // Actualizar también el status text para bucle infinito
                statusText = '🔄 Bucle Infinito';
                statusElement.textContent = statusText;
            } else {
                instruction = `�💀 El oráculo se ha cerrado: ${this.currentState.defeat_reason}`;
            }
        }
        
        // Si está en modo automático pero no hay carta actual, mostrar estado
        if (this.isAutoMode && this.currentState.game_state === 'playing' && !this.currentState.current_card) {
            instruction = '🤖 Modo automático activo - El oráculo está preparando el siguiente movimiento...';
        }
        
        instructionElement.textContent = instruction;
    }

    showMessage(text, type = 'info') {
        const messageArea = document.getElementById('messageArea');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        
        messageArea.appendChild(messageDiv);
        
        // Auto-remover mensaje después de 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
        
        // Mantener solo los últimos 3 mensajes
        while (messageArea.children.length > 3) {
            messageArea.removeChild(messageArea.firstChild);
        }
        
        // Scroll automático
        messageArea.scrollTop = messageArea.scrollHeight;
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

// Inicializar el manager cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔮 Oráculo de las Cartas inicializado');
    console.log('✨ Las cartas esperan revelar tu destino...');
    console.log('🎯 Elige tu modo y personaje para comenzar la consulta');
    
    // Verificar que todos los elementos necesarios existan
    const requiredElements = [
        'startGameBtn', 'instructionsBtn', 'manualModeBtn', 'autoModeBtn',
        'backFromModeBtn', 'backFromQuestionBtn', 'backFromCharacterBtn', 'backFromInstructionsBtn', 'exitGameBtn',
        'oracleQuestion', 'confirmQuestionBtn', 'editQuestionBtn'
    ];
    
    let allElementsFound = true;
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`❌ Elemento requerido no encontrado: ${id}`);
            allElementsFound = false;
        } else {
            console.log(`✅ Elemento encontrado: ${id}`);
        }
    });
    
    if (!allElementsFound) {
        console.error('❌ Algunos elementos requeridos no se encontraron. El juego puede no funcionar correctamente.');
        return;
    }
    
    // Verificar pantallas
    const screens = ['startScreen', 'modeScreen', 'questionScreen', 'characterScreen', 'instructionsScreen', 'gameScreen'];
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (!screen) {
            console.error(`❌ Pantalla no encontrada: ${screenId}`);
        } else {
            console.log(`✅ Pantalla encontrada: ${screenId}`);
        }
    });
    
    // Inicializar el game manager
    console.log('🎪 Creando game manager...');
    const gameManager = new OracleGameManager();
    console.log('🚀 Game manager creado exitosamente');
});
