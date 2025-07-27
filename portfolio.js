// Portfolio Animation JavaScript

class PortfolioAnimation {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.letters = [];
        this.animationId = null;
        this.currentAnimation = 'blink';
        this.isInitialized = false;
        this.debugMode = false;
        
        console.log('🚀 PortfolioAnimation: Starting initialization...');
        
        if (!this.canvas) {
            console.error('❌ Canvas element not found!');
            return;
        }
        
        this.init();
    }

    init() {
        console.log('⚙️ Setting up portfolio animation...');
        
        this.setupControls();
        this.generateGrid();
        this.startAnimation();
        this.setupResize();
        this.isInitialized = true;
        
        console.log('✅ Portfolio animation initialized successfully!');
    }

    setupControls() {
        const controls = document.querySelectorAll('.control-icon');
        console.log(`🎮 Setting up ${controls.length} animation controls`);
        
        controls.forEach(control => {
            control.addEventListener('click', (e) => {
                const animation = control.dataset.animation;
                console.log(`🎨 Animation changed to: ${animation}`);
                
                // Update active state
                controls.forEach(c => c.classList.remove('active'));
                control.classList.add('active');
                
                // Change animation
                this.currentAnimation = animation;
            });
        });
    }

    setupResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log('📐 Window resized, regenerating grid...');
                this.generateGrid();
            }, 250);
        });
    }

    generateGrid() {
        console.log('🔤 Generating letter grid...');
        
        // Clear existing letters
        this.canvas.innerHTML = '';
        this.letters = [];

        const rect = this.canvas.getBoundingClientRect();
        const canvasWidth = rect.width;
        const canvasHeight = rect.height;

        console.log(`📏 Canvas size: ${canvasWidth}px × ${canvasHeight}px`);

        if (canvasWidth === 0 || canvasHeight === 0) {
            console.warn('⚠️ Canvas has no size, skipping grid generation');
            setTimeout(() => this.generateGrid(), 500); // Retry
            return;
        }

        // Responsive settings
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        const isVerySmall = window.innerWidth <= 360;
        
        let fontSize, spacing;
        if (isVerySmall) {
            fontSize = 8;
            spacing = 12;
        } else if (isSmallMobile) {
            fontSize = 9;
            spacing = 13;
        } else if (isMobile) {
            fontSize = 10;
            spacing = 14;
        } else {
            fontSize = 11;
            spacing = 16;
        }

        const cols = Math.floor(canvasWidth / spacing);
        const rows = Math.floor(canvasHeight / spacing);

        console.log(`📊 Grid: ${rows} rows × ${cols} cols (${fontSize}px font, ${spacing}px spacing)`);

        if (rows === 0 || cols === 0) {
            console.warn('⚠️ Grid has no cells, canvas too small');
            return;
        }

        // Character set
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=<>?';

        // Create grid data structure
        const grid = [];
        for (let row = 0; row < rows; row++) {
            grid[row] = [];
            for (let col = 0; col < cols; col++) {
                const x = col * spacing + (spacing / 4); // Add slight offset
                const y = row * spacing + (spacing / 4);
                
                grid[row][col] = {
                    char: chars[Math.floor(Math.random() * chars.length)],
                    x: x,
                    y: y,
                    originalX: x,
                    originalY: y,
                    opacity: Math.random() * 0.25 + 0.05, // 0.05 to 0.3
                    animationSpeed: Math.random() * 1.5 + 0.5, // 0.5 to 2
                    phase: Math.random() * Math.PI * 2,
                    windPhase: Math.random() * Math.PI * 2,
                    isHighlight: false,
                    element: null
                };
            }
        }

        // Place highlight words
        this.placeHighlightWords(grid, rows, cols, isMobile);

        // Create DOM elements
        let elementCount = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const letterData = grid[row][col];
                const element = document.createElement('div');
                element.className = 'letter';
                element.textContent = letterData.char;
                element.style.left = letterData.x + 'px';
                element.style.top = letterData.y + 'px';
                element.style.fontSize = fontSize + 'px';
                element.style.opacity = letterData.opacity;
                
                // Highlight styling
                if (letterData.isHighlight) {
                    element.style.fontWeight = '500';
                }
                
                this.canvas.appendChild(element);
                
                letterData.element = element;
                this.letters.push(letterData);
                elementCount++;
            }
        }

        console.log(`✨ Generated ${elementCount} letters successfully`);

        // Add debug info if enabled
        if (this.debugMode) {
            console.log('🐛 Debug mode: Grid data', { grid, rows, cols, spacing, fontSize });
        }
    }

    placeHighlightWords(grid, rows, cols, isMobile) {
        let words = ['PRODUCTDESIGNER', '10+YEARS', 'CRAFTFIRST'];
        
        // Adjust words based on screen size
        if (cols < 10) {
            words = ['DESIGN', '10+YR', 'CRAFT'];
        } else if (cols < 14) {
            words = ['DESIGNER', '10+YRS', 'CRAFT'];
        } else if (cols < 18 || isMobile) {
            words = ['DESIGNER', '10+YEARS', 'CRAFT'];
        }

        console.log(`🎯 Placing highlight words: ${words.join(', ')}`);

        const safeRowStart = Math.max(1, Math.floor(rows * 0.15));
        const safeRowEnd = Math.min(rows - 1, Math.floor(rows * 0.85));
        const availableRows = safeRowEnd - safeRowStart;

        console.log(`📍 Safe zone: rows ${safeRowStart} to ${safeRowEnd} (${availableRows} available)`);

        if (availableRows < words.length * 2) {
            console.warn('⚠️ Limited space for word placement');
        }

        let successfulPlacements = 0;

        words.forEach((word, index) => {
            if (word.length > cols) {
                console.warn(`⚠️ Word "${word}" (${word.length} chars) too long for grid width ${cols}`);
                return;
            }

            // Calculate target row
            const sectionHeight = Math.max(2, Math.floor(availableRows / words.length));
            const targetRow = safeRowStart + (index * sectionHeight) + Math.floor(sectionHeight / 2);
            const row = Math.max(safeRowStart, Math.min(targetRow, safeRowEnd - 1));

            // Center horizontally with slight randomness
            const centerCol = Math.floor((cols - word.length) / 2);
            const randomOffset = Math.floor(Math.random() * 6) - 3; // -3 to +3
            const startCol = Math.max(0, Math.min(centerCol + randomOffset, cols - word.length));

            console.log(`📝 Placing "${word}" at row ${row}, cols ${startCol}-${startCol + word.length - 1}`);

            // Place the word
            let placedLetters = 0;
            for (let i = 0; i < word.length && startCol + i < cols; i++) {
                if (grid[row] && grid[row][startCol + i]) {
                    grid[row][startCol + i].char = word[i].toUpperCase();
                    grid[row][startCol + i].isHighlight = true;
                    grid[row][startCol + i].opacity = 0.85 + Math.random() * 0.1; // 0.85 to 0.95
                    placedLetters++;
                }
            }

            if (placedLetters === word.length) {
                successfulPlacements++;
                console.log(`✅ Successfully placed "${word}"`);
            } else {
                console.warn(`⚠️ Partially placed "${word}" (${placedLetters}/${word.length} letters)`);
            }
        });

        console.log(`🎯 Placement summary: ${successfulPlacements}/${words.length} words placed successfully`);
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        console.log('🎬 Starting animation loop...');

        const animate = (currentTime) => {
            if (!this.letters.length) {
                console.warn('⚠️ No letters to animate');
                return;
            }

            const time = currentTime * 0.001; // Convert to seconds
            const speed = 0.5; // Animation speed multiplier

            this.letters.forEach(letterData => {
                if (!letterData.element) return;

                let newOpacity = letterData.opacity;
                let newX = letterData.originalX;
                let newY = letterData.originalY;

                const baseOpacity = letterData.isHighlight ? 0.8 : 0.15;
                const variation = letterData.isHighlight ? 0.15 : 0.2;

                switch (this.currentAnimation) {
                    case 'blink':
                        const blink = Math.sin(time * letterData.animationSpeed * speed + letterData.phase);
                        newOpacity = baseOpacity + (blink * variation);
                        break;

                    case 'wave':
                        const waveTime = time * 2 * speed;
                        const wave = Math.sin(waveTime + letterData.originalX * 0.015);
                        newY = letterData.originalY + (wave * 8);
                        
                        const waveOpacity = Math.sin(waveTime * 1.5 + letterData.phase);
                        newOpacity = baseOpacity + (waveOpacity * variation);
                        break;

                    case 'wind':
                        const windTime = time * 1.2 * speed;
                        const windStrength = Math.sin(windTime + letterData.windPhase);
                        const verticalSway = Math.sin(windTime * 0.7 + letterData.phase);
                        
                        newX = letterData.originalX + (windStrength * 4);
                        newY = letterData.originalY + (verticalSway * 2);
                        
                        const windOpacity = Math.sin(windTime * 2 + letterData.phase);
                        newOpacity = baseOpacity + (windOpacity * variation);
                        break;
                }

                // Apply changes
                letterData.element.style.opacity = Math.max(0.02, Math.min(1, newOpacity));
                letterData.element.style.left = newX + 'px';
                letterData.element.style.top = newY + 'px';
            });

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
        console.log('🎬 Animation loop started');
    }

    toggleDebug() {
        this.debugMode = !this.debugMode;
        document.body.classList.toggle('debug', this.debugMode);
        console.log(`🐛 Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.canvas.innerHTML = '';
        this.letters = [];
        console.log('🗑️ PortfolioAnimation destroyed');
    }
}

// Global initialization
let portfolioAnimation = null;

function initializePortfolio() {
    console.log('🌟 Initializing portfolio...');
    
    if (portfolioAnimation) {
        console.log('🔄 Destroying existing animation...');
        portfolioAnimation.destroy();
    }

    try {
        portfolioAnimation = new PortfolioAnimation();
        
        // Make it globally accessible for debugging
        window.portfolioAnimation = portfolioAnimation;
        
        // Add debug toggle (Ctrl+Shift+D)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                portfolioAnimation.toggleDebug();
            }
        });
        
    } catch (error) {
        console.error('❌ Failed to initialize portfolio animation:', error);
    }
}

// DOM ready initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded');
    
    // Wait for fonts and layout
    setTimeout(() => {
        initializePortfolio();
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👁️ Page hidden');
    } else {
        console.log('👁️ Page visible');
        // Regenerate grid when page becomes visible
        if (portfolioAnimation && portfolioAnimation.isInitialized) {
            setTimeout(() => {
                console.log('🔄 Regenerating grid after visibility change...');
                portfolioAnimation.generateGrid();
            }, 200);
        }
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('💥 JavaScript error:', e.error);
});

console.log('📜 Portfolio script loaded successfully');

// Export for module usage (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAnimation;
}