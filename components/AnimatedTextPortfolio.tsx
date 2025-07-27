/**
 * AnimatedTextPortfolio - Simplified version for portfolio website
 * No controls, just the animated background with preset words
 */

import { useEffect, useRef, useState } from 'react';

interface LetterAnimation {
  letter: string;
  opacity: number;
  animationSpeed: number;
  phase: number;
  x: number;
  y: number;
  initialX: number;
  initialY: number;
  fallSpeed?: number;
  windPhase?: number;
  isHighlighted?: boolean;
  baseOpacityMin?: number;
  baseOpacityMax?: number;
}

type AnimationStyle = 'blink' | 'wave' | 'wind' | 'rain';

interface AnimatedTextPortfolioProps {
  highlightWords?: string[];
  animationStyle?: AnimationStyle;
  animationSpeed?: number;
  backgroundOpacity?: number;
  isDarkMode?: boolean;
  className?: string;
}

export function AnimatedTextPortfolio({
  highlightWords = ['CREATIVE', 'DEVELOPER', 'DESIGNER'],
  animationStyle = 'blink',
  animationSpeed = 50,
  backgroundOpacity = 25,
  isDarkMode = true,
  className = ''
}: AnimatedTextPortfolioProps) {
  const [letters, setLetters] = useState<LetterAnimation[]>([]);
  const animationFrameRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate letters function
  const generateLetters = () => {
    if (!containerRef.current) return;
    
    const letterArray: LetterAnimation[] = [];
    const containerRect = containerRef.current.getBoundingClientRect();
    const canvasWidth = containerRect.width || 800;
    const canvasHeight = containerRect.height || 600;
    const letterSize = 12;
    const gap = 2;
    const stepX = letterSize + gap;
    const stepY = letterSize + gap;
    
    const randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    const cols = Math.floor((canvasWidth - 20) / stepX);
    const rows = Math.floor((canvasHeight - 20) / stepY);
    
    const grid: (LetterAnimation | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
    
    // Fill with random letters
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = 10 + col * stepX;
        const y = 10 + row * stepY;
        const randomLetter = randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
        
        grid[row][col] = {
          letter: randomLetter,
          opacity: 1,
          animationSpeed: Math.random() * 2 + 0.5,
          phase: Math.random() * Math.PI * 2,
          x,
          y,
          initialX: x,
          initialY: y,
          fallSpeed: Math.random() * 2 + 1,
          windPhase: Math.random() * Math.PI * 2,
          isHighlighted: false,
          baseOpacityMin: 0.05,
          baseOpacityMax: backgroundOpacity / 100
        };
      }
    }
    
    // Place highlight words
    const placeWord = (word: string, avoidRows: number[] = []) => {
      if (!word.trim()) return [];
      
      const wordLength = word.length;
      const availableRows = [];
      
      for (let row = 0; row < rows; row++) {
        if (avoidRows.includes(row)) continue;
        
        for (let startCol = 0; startCol <= cols - wordLength; startCol++) {
          let canPlace = true;
          for (let i = 0; i < wordLength; i++) {
            if (!grid[row][startCol + i]) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            availableRows.push({ row, startCol });
          }
        }
      }
      
      if (availableRows.length === 0) return [];
      
      const randomPos = availableRows[Math.floor(Math.random() * availableRows.length)];
      const { row, startCol } = randomPos;
      
      for (let i = 0; i < wordLength; i++) {
        if (grid[row][startCol + i]) {
          grid[row][startCol + i]!.letter = word.charAt(i).toUpperCase();
          grid[row][startCol + i]!.isHighlighted = true;
          grid[row][startCol + i]!.baseOpacityMin = 0.80;
          grid[row][startCol + i]!.baseOpacityMax = 0.95;
        }
      }
      
      return [row];
    };
    
    let usedRows: number[] = [];
    
    highlightWords.forEach((word, index) => {
      if (word.trim()) {
        const placedRows = placeWord(word, usedRows);
        usedRows.push(...placedRows);
        placedRows.forEach(row => {
          if (row > 0) usedRows.push(row - 1);
          if (row < rows - 1) usedRows.push(row + 1);
        });
      }
    });
    
    // Convert grid to flat array
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col]) {
          letterArray.push(grid[row][col]!);
        }
      }
    }
    
    setLetters(letterArray);
  };

  useEffect(() => {
    generateLetters();
    
    const handleResize = () => {
      generateLetters();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [highlightWords, backgroundOpacity]);

  // Animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      const speedMultiplier = animationSpeed / 50;
      const time = currentTime * 0.001 * speedMultiplier;
      
      setLetters(prev => prev.map((letterData) => {
        let newLetterData = { ...letterData };
        
        const minOpacity = letterData.baseOpacityMin || 0.05;
        const maxOpacity = letterData.baseOpacityMax || 0.25;
        const opacityRange = maxOpacity - minOpacity;
        
        switch (animationStyle) {
          case 'blink':
            const frequency = letterData.animationSpeed;
            const sine = Math.sin(time * frequency + letterData.phase);
            newLetterData.opacity = minOpacity + (sine + 1) * 0.5 * opacityRange;
            break;
            
          case 'wave':
            const waveOffset = Math.sin(time * 2 + letterData.initialX * 0.02) * 15;
            newLetterData.y = letterData.initialY + waveOffset;
            newLetterData.opacity = minOpacity + (Math.sin(time * 3 + letterData.phase) + 1) * 0.5 * opacityRange;
            break;
            
          case 'wind':
            const windStrength = Math.sin(time * 1.5 + letterData.windPhase!) * 8;
            const verticalSway = Math.sin(time * 0.8 + letterData.phase) * 3;
            newLetterData.x = letterData.initialX + windStrength;
            newLetterData.y = letterData.initialY + verticalSway;
            newLetterData.opacity = minOpacity + (Math.sin(time * 2 + letterData.phase) + 1) * 0.5 * opacityRange;
            break;
            
          case 'rain':
            const fallDistance = (time * letterData.fallSpeed! * 50) % (window.innerHeight + 50);
            newLetterData.y = letterData.initialY + fallDistance;
            if (newLetterData.y > window.innerHeight) {
              newLetterData.y = letterData.initialY - 20;
            }
            newLetterData.opacity = minOpacity + Math.abs(Math.sin(fallDistance * 0.02)) * opacityRange;
            break;
        }
        
        return newLetterData;
      }));
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (letters.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [letters.length, animationSpeed, animationStyle]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    >
      {letters.map((letterData, index) => (
        <span
          key={index}
          className={`absolute font-['Geist_Mono:Regular',_sans-serif] select-none transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-black'
          } ${
            letterData.isHighlighted ? 'font-medium text-[11px]' : 'font-normal text-[10px]'
          }`}
          style={{
            left: letterData.x,
            top: letterData.y,
            opacity: letterData.opacity
          }}
        >
          {letterData.letter}
        </span>
      ))}
    </div>
  );
}