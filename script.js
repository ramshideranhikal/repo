// Portfolio Animation Script
class PortfolioAnimation {
    constructor() {
        this.letters = [];
        this.animationFrame = null;
        this.animationStyle = 'blink';
        this.animationSpeed = 50;
        this.backgroundOpacity = 35;
        this.canvas = document.getElementById('canvas');
        this.highlightWords = ['PRODUCTDESIGNER', '10+YEARS', 'CRAFTFIRST'];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateLetters();
        this.startAnimation();
    }

    setupEventListeners() {
        // Animation control buttons
        const controls = document.querySelectorAll('.control-icon');
        controls.forEach(control => {
            control.addEventListener('click', () => {
                const animation = control.dataset.animation;
                this.setAnimation(animation);
                
                // Update active state
                controls.forEach(c => c.classList.remove('active'));
                control.classList.add('active');
            });
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.generateLetters();
        });
    }

    setAnimation(style) {
        this.animationStyle = style;
    }

    generateLetters() {
        // Clear existing letters
        this.canvas.innerHTML = '';
        this.letters = [];

        const canvasRect = this.canvas.getBoundingClientRect();
        let canvasWidth = canvasRect.width;
        let canvasHeight = canvasRect.height;
        
        // Ensure minimum canvas size for mobile word placement
        if (isMobile) {
            canvasWidth = Math.max(canvasWidth, isVerySmallMobile ? 280 : 300);
            canvasHeight = Math.max(canvasHeight, isVerySmallMobile ? 350 : 400);
        }
        
        // Responsive letter size and spacing - optimized for mobile word placement
        const isMobile = window.innerWidth <= 768;
        const isVerySmallMobile = window.innerWidth <= 480;
        
        let letterSize, gap;
        if (isVerySmallMobile) {
            letterSize = 9;  // Smaller letters for very small screens
            gap = 5.5;       // Tighter spacing to fit more letters
        } else if (isMobile) {
            letterSize = 10;
            gap = 6.0;       // Slightly tighter spacing for mobile
        } else {
            letterSize = 11;
            gap = 6.6;
        }
        
        const stepX = letterSize + gap;
        const stepY = letterSize + gap;
        
        const randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        const cols = Math.floor(canvasWidth / stepX);
        const rows = Math.floor(canvasHeight / stepY);
        
        console.log('Grid dimensions:', rows, 'x', cols, 'Canvas:', canvasWidth, 'x', canvasHeight);
        
        // Create grid
        const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
        
        // Fill with random letters
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * stepX;
                const y = row * stepY;
                const randomLetter = randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
                
                grid[row][col] = {
                    letter: randomLetter,
                    opacity: 1,
                    animationSpeed: Math.random() * 2 + 0.5,
                    phase: Math.random() * Math.PI * 2,
                    x: x,
                    y: y,
                    initialX: x,
                    initialY: y,

                    windPhase: Math.random() * Math.PI * 2,
                    isHighlighted: false,
                    baseOpacityMin: 0.05,
                    baseOpacityMax: this.backgroundOpacity / 100
                };
            }
        }
        
        // Mobile-first highlight word placement algorithm
        const isMobile = window.innerWidth <= 768;
        const isVerySmallMobile = window.innerWidth <= 480;
        
        if (isMobile) {
            // MOBILE-SPECIFIC ALGORITHM - Guaranteed placement
            console.log('Using mobile-specific word placement algorithm');
            
            // Use appropriate words based on screen width
            let wordsToPlace = ['PRODUCTDESIGNER', '10+YEARS', 'CRAFTFIRST'];
            
            // Determine word lengths based on available columns
            if (cols < 12) {
                // Very small screens - use minimal words
                wordsToPlace = ['DESIGN', '10+YRS', 'CRAFT'];
            } else if (cols < 16) {
                // Small screens - use medium words
                wordsToPlace = ['DESIGNER', '10+YEARS', 'CRAFT'];
            } else if (isVerySmallMobile) {
                // Small mobile but with decent width
                wordsToPlace = ['DESIGNER', '10+YEARS', 'CRAFTFIRST'];
            }
            
            console.log('Mobile words selected:', wordsToPlace, 'for', cols, 'columns');
            
            // Calculate guaranteed safe positions for mobile
            const safeStartRow = 3; // Reduced safe zone for mobile
            const safeEndRow = rows - 3;
            const availableRows = safeEndRow - safeStartRow;
            
            // Ensure we have enough rows for all words
            if (availableRows < 9) { // Need at least 3 words + 2 spacing rows each
                console.log('Not enough rows for all words, using minimal spacing');
            }
            
            // Fixed positions for mobile - divide canvas into 3 vertical sections
            const rowsPerSection = Math.floor(availableRows / 3);
            
            wordsToPlace.forEach((word, index) => {
                if (!word.trim()) return;
                
                // Calculate fixed row for this word
                const targetRow = safeStartRow + (index * rowsPerSection) + Math.floor(rowsPerSection / 2);
                
                // Ensure target row is valid
                const actualRow = Math.max(safeStartRow, Math.min(targetRow, safeEndRow - 1));
                
                // Find best horizontal position for this word
                const wordLength = word.length;
                let startCol = 0;
                
                // Try to center the word horizontally
                if (cols >= wordLength + 2) {
                    startCol = Math.floor((cols - wordLength) / 2);
                } else if (cols >= wordLength) {
                    startCol = Math.floor((cols - wordLength) / 2);
                } else {
                    // Word too long, use left alignment
                    startCol = 0;
                    console.log(`Warning: Word "${word}" too long for grid width ${cols}`);
                }
                
                // Place the word
                for (let i = 0; i < Math.min(wordLength, cols - startCol); i++) {
                    if (grid[actualRow] && grid[actualRow][startCol + i]) {
                        grid[actualRow][startCol + i].letter = word.charAt(i).toUpperCase();
                        grid[actualRow][startCol + i].isHighlighted = true;
                        grid[actualRow][startCol + i].baseOpacityMin = 0.80;
                        grid[actualRow][startCol + i].baseOpacityMax = 0.95;
                    }
                }
                
                console.log(`Mobile placed word "${word}" at row ${actualRow}, col ${startCol}`);
            });
            
        } else {
            // DESKTOP ALGORITHM - Original flexible placement
            console.log('Using desktop word placement algorithm');
            
            const placeWord = (word, alignment, avoidRows = []) => {
                if (!word.trim()) return [];
                
                const wordLength = word.length;
                const availablePositions = [];
                
                // Avoid top 5 and bottom 5 rows
                const safeStartRow = 5;
                const safeEndRow = rows - 5;
                
                for (let row = safeStartRow; row < safeEndRow; row++) {
                    if (avoidRows.includes(row)) continue;
                    
                    // Calculate start column based on alignment
                    let startCols = [];
                    switch (alignment) {
                        case 'left':
                            for (let startCol = 0; startCol <= Math.floor(cols / 3) - wordLength; startCol++) {
                                startCols.push(startCol);
                            }
                            break;
                        case 'center':
                            const centerStart = Math.floor(cols / 3);
                            const centerEnd = Math.floor((2 * cols) / 3);
                            for (let startCol = centerStart; startCol <= centerEnd - wordLength; startCol++) {
                                startCols.push(startCol);
                            }
                            break;
                        case 'right':
                            const rightStart = Math.floor((2 * cols) / 3);
                            for (let startCol = rightStart; startCol <= cols - wordLength; startCol++) {
                                startCols.push(startCol);
                            }
                            break;
                    }
                    
                    // Check if word can be placed in any of the alignment positions
                    for (const startCol of startCols) {
                        let canPlace = true;
                        for (let i = 0; i < wordLength; i++) {
                            if (!grid[row] || !grid[row][startCol + i]) {
                                canPlace = false;
                                break;
                            }
                        }
                        if (canPlace) {
                            availablePositions.push({ row, startCol });
                        }
                    }
                }
                
                if (availablePositions.length === 0) return [];
                
                const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
                const { row, startCol } = randomPos;
                
                for (let i = 0; i < wordLength; i++) {
                    if (grid[row] && grid[row][startCol + i]) {
                        grid[row][startCol + i].letter = word.charAt(i).toUpperCase();
                        grid[row][startCol + i].isHighlighted = true;
                        grid[row][startCol + i].baseOpacityMin = 0.80;
                        grid[row][startCol + i].baseOpacityMax = 0.95;
                    }
                }
                
                return [row];
            };
            
            let usedRows = [];
            const wordsInOrder = ['PRODUCTDESIGNER', '10+YEARS', 'CRAFTFIRST'];
            const alignments = ['left', 'center', 'right'];
            const shuffledAlignments = [...alignments].sort(() => Math.random() - 0.5);
            
            wordsInOrder.forEach((word, index) => {
                if (word.trim()) {
                    const alignment = shuffledAlignments[index % 3];
                    let placedRows = placeWord(word, alignment, usedRows);
                    
                    // If placement failed, try with any alignment
                    if (placedRows.length === 0) {
                        for (const fallbackAlignment of alignments) {
                            placedRows = placeWord(word, fallbackAlignment, usedRows);
                            if (placedRows.length > 0) break;
                        }
                    }
                    
                    // If still failed, try without avoiding any rows
                    if (placedRows.length === 0) {
                        placedRows = placeWord(word, 'center', []);
                    }
                    
                    console.log(`Desktop word "${word}" placement:`, placedRows.length > 0 ? 'SUCCESS' : 'FAILED', 'at rows:', placedRows);
                    
                    usedRows.push(...placedRows);
                    
                    // Add distance between words
                    placedRows.forEach(row => {
                        for (let i = -4; i <= 4; i++) {
                            const bufferRow = row + i;
                            if (bufferRow >= 5 && bufferRow < rows - 5) {
                                usedRows.push(bufferRow);
                            }
                        }
                    });
                }
            });
        }
        
        // Convert grid to DOM elements and flat array
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col]) {
                    const letterData = grid[row][col];
                    const letterElement = document.createElement('span');
                    letterElement.className = 'letter';
                    letterElement.textContent = letterData.letter;
                    letterElement.style.left = letterData.x + 'px';
                    letterElement.style.top = letterData.y + 'px';
                    letterElement.style.opacity = letterData.opacity;
                    
                    this.canvas.appendChild(letterElement);
                    
                    // Store reference to DOM element
                    letterData.element = letterElement;
                    this.letters.push(letterData);
                }
            }
        }
    }

    startAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const animate = (currentTime) => {
            const speedMultiplier = this.animationSpeed / 50;
            const time = currentTime * 0.001 * speedMultiplier;
            
            // Performance optimization: batch DOM updates
            const updates = [];
            
            this.letters.forEach((letterData) => {
                const minOpacity = letterData.baseOpacityMin || 0.05;
                const maxOpacity = letterData.baseOpacityMax || 0.35;
                const opacityRange = maxOpacity - minOpacity;
                
                // Always reset to initial position first
                let newX = letterData.initialX;
                let newY = letterData.initialY;
                let newOpacity = letterData.opacity;
                
                switch (this.animationStyle) {
                    case 'blink':
                        const frequency = letterData.animationSpeed;
                        const sine = Math.sin(time * frequency + letterData.phase);
                        newOpacity = minOpacity + (sine + 1) * 0.5 * opacityRange;
                        break;
                        
                    case 'wave':
                        const waveOffset = Math.sin(time * 2 + letterData.initialX * 0.02) * 15;
                        newY = letterData.initialY + waveOffset;
                        newOpacity = minOpacity + (Math.sin(time * 3 + letterData.phase) + 1) * 0.5 * opacityRange;
                        break;
                        
                    case 'wind':
                        const windStrength = Math.sin(time * 1.5 + letterData.windPhase) * 8;
                        const verticalSway = Math.sin(time * 0.8 + letterData.phase) * 3;
                        newX = letterData.initialX + windStrength;
                        newY = letterData.initialY + verticalSway;
                        newOpacity = minOpacity + (Math.sin(time * 2 + letterData.phase) + 1) * 0.5 * opacityRange;
                        break;
                        

                }
                
                // Store updates for batch processing
                updates.push({
                    element: letterData.element,
                    x: newX,
                    y: newY,
                    opacity: newOpacity
                });
                
                // Update stored values
                letterData.x = newX;
                letterData.y = newY;
                letterData.opacity = newOpacity;
            });
            
            // Batch apply DOM updates for better performance
            updates.forEach(update => {
                update.element.style.left = update.x + 'px';
                update.element.style.top = update.y + 'px';
                update.element.style.opacity = update.opacity;
            });
            
            this.animationFrame = requestAnimationFrame(animate);
        };

        if (this.letters.length > 0) {
            this.animationFrame = requestAnimationFrame(animate);
        }
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize the portfolio animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing portfolio animation...');
    try {
        new PortfolioAnimation();
        console.log('Portfolio animation initialized successfully');
    } catch (error) {
        console.error('Error initializing portfolio animation:', error);
    }
});

// Handle page visibility changes to pause/resume animation
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, you could pause animation here if needed
    } else {
        // Page is visible again
    }
});