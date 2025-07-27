import { useEffect, useRef, useState } from 'react';
import svgPaths from "../imports/svg-eq1u1y44hs";

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

function AnimatedCanvas({ animationStyle }: { animationStyle: AnimationStyle }) {
  const [letters, setLetters] = useState<LetterAnimation[]>([]);
  const animationFrameRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const highlightWords = ['ProductDesigner', '10+Years', 'CraftFirst'];
  const animationSpeed = 50;
  const backgroundOpacity = 35;

  // Generate letters function
  const generateLetters = () => {
    if (!containerRef.current) return;
    
    const letterArray: LetterAnimation[] = [];
    const canvasWidth = 1280;
    const canvasHeight = 795;
    const letterSize = 11;
    const gap = 6.6; // matching the tracking from Figma
    const stepX = letterSize + gap;
    const stepY = letterSize + gap;
    
    const randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    const cols = Math.floor(canvasWidth / stepX);
    const rows = Math.floor(canvasHeight / stepY);
    
    const grid: (LetterAnimation | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
    
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
    
    // Place highlight words with varied alignment and spacing
    const placeWord = (word: string, alignment: 'left' | 'center' | 'right', avoidRows: number[] = []) => {
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
            // Left alignment: first 1/3 of the canvas
            for (let startCol = 0; startCol <= Math.floor(cols / 3) - wordLength; startCol++) {
              startCols.push(startCol);
            }
            break;
          case 'center':
            // Center alignment: middle 1/3 of the canvas
            const centerStart = Math.floor(cols / 3);
            const centerEnd = Math.floor((2 * cols) / 3);
            for (let startCol = centerStart; startCol <= centerEnd - wordLength; startCol++) {
              startCols.push(startCol);
            }
            break;
          case 'right':
            // Right alignment: last 1/3 of the canvas
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
          grid[row][startCol + i]!.letter = word.charAt(i).toUpperCase();
          grid[row][startCol + i]!.isHighlighted = true;
          grid[row][startCol + i]!.baseOpacityMin = 0.80;
          grid[row][startCol + i]!.baseOpacityMax = 0.95;
        }
      }
      
      return [row];
    };
    
    let usedRows: number[] = [];
    
    // Place words in specific order with random alignments and distant spacing
    const wordsInOrder = ['ProductDesigner', '10+Years', 'CraftFirst'];
    const alignments = ['left', 'center', 'right'] as const;
    
    // Shuffle alignments for randomness
    const shuffledAlignments = [...alignments].sort(() => Math.random() - 0.5);
    
    wordsInOrder.forEach((word, index) => {
      if (word.trim()) {
        const alignment = shuffledAlignments[index % 3];
        const placedRows = placeWord(word, alignment, usedRows);
        usedRows.push(...placedRows);
        
        // Add more distance between words (4 rows minimum spacing)
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
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      const speedMultiplier = animationSpeed / 50;
      const time = currentTime * 0.001 * speedMultiplier;
      
      setLetters(prev => prev.map((letterData) => {
        let newLetterData = { ...letterData };
        
        const minOpacity = letterData.baseOpacityMin || 0.05;
        const maxOpacity = letterData.baseOpacityMax || 0.35;
        const opacityRange = maxOpacity - minOpacity;
        
        // Always reset to initial position first
        newLetterData.x = letterData.initialX;
        newLetterData.y = letterData.initialY;
        
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
            const fallDistance = (time * letterData.fallSpeed! * 50) % (795 + 50);
            newLetterData.y = letterData.initialY + fallDistance;
            if (newLetterData.y > 795) {
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
  }, [letters.length, animationStyle]);

  return (
    <div 
      ref={containerRef}
      className="absolute h-full w-full overflow-hidden"
    >
      {letters.map((letterData, index) => (
        <span
          key={index}
          className={`absolute font-['Geist_Mono:Regular',_sans-serif] font-normal select-none text-[#ffffff] text-[11px] leading-[0]`}
          style={{
            left: letterData.x,
            top: letterData.y,
            opacity: letterData.opacity,
            letterSpacing: '6.6px'
          }}
        >
          {letterData.letter}
        </span>
      ))}
    </div>
  );
}

function Wave({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className={`relative shrink-0 size-6 cursor-pointer transition-all duration-300 hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`} 
      data-name="wave"
      onClick={onClick}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="wave">
          <path
            d={svgPaths.p28f4e00}
            fill="var(--fill-0, #E3E3E3)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Blink({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className={`relative shrink-0 size-6 cursor-pointer transition-all duration-300 hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`} 
      data-name="blink"
      onClick={onClick}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="blink">
          <path
            d={svgPaths.p1d11f300}
            fill="var(--fill-0, #E3E3E3)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Rain({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className={`relative shrink-0 size-6 cursor-pointer transition-all duration-300 hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`} 
      data-name="rain"
      onClick={onClick}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="rain">
          <path
            d={svgPaths.p18b13b80}
            fill="var(--fill-0, #E3E3E3)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Wind({ isActive, onClick }: { isActive: boolean; onClick: () => void }) {
  return (
    <div 
      className={`h-[23.1px] relative shrink-0 w-[24.7px] cursor-pointer transition-all duration-300 hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`} 
      data-name="wind"
      onClick={onClick}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 25 24"
      >
        <g id="wind">
          <path
            d={svgPaths.p16f6bc00}
            fill="var(--fill-0, #E3E3E3)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

export default function PortfolioFigma() {
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('blink');

  return (
    <div className="bg-[#000000] h-screen w-screen overflow-hidden flex flex-col" data-name="portfolio">
      {/* Canvas Area - Takes up most of the screen */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-[1280px] max-h-[795px]">
            <AnimatedCanvas animationStyle={animationStyle} />
          </div>
        </div>
      </div>

      {/* Bottom Section - Fixed height */}
      <div className="relative h-[120px] flex-shrink-0 flex items-center justify-center">
        <div className="w-full max-w-[1280px] flex items-center justify-between" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
        {/* Name */}
        <div className="font-['Geist:ExtraBold',_sans-serif] font-extrabold leading-[0] opacity-20 text-[#ffffff] text-[16px] md:text-[20px]">
          <p className="block leading-[normal] whitespace-pre">Ramshid</p>
        </div>

        {/* Animation Controls */}
        <div className="flex gap-4 items-center">
          <Wave isActive={animationStyle === 'wave'} onClick={() => setAnimationStyle('wave')} />
          <Blink isActive={animationStyle === 'blink'} onClick={() => setAnimationStyle('blink')} />
          <Rain isActive={animationStyle === 'rain'} onClick={() => setAnimationStyle('rain')} />
          <Wind isActive={animationStyle === 'wind'} onClick={() => setAnimationStyle('wind')} />
        </div>

        {/* Social Links */}
        <div className="flex gap-4 md:gap-8 items-center font-['Geist_Mono:Regular',_sans-serif] font-normal text-[#ffffff] text-[8px] md:text-[10px] opacity-30">
          <a href="#" className="transition-all duration-300 hover:opacity-80 hover:scale-105 transform">
            <p className="block leading-[15px] whitespace-pre">Instagram</p>
          </a>
          <a href="#" className="transition-all duration-300 hover:opacity-80 hover:scale-105 transform">
            <p className="block leading-[15px] whitespace-pre">Dribbble</p>
          </a>
          <a href="#" className="transition-all duration-300 hover:opacity-80 hover:scale-105 transform">
            <p className="block leading-[15px] whitespace-pre">LinkedIn</p>
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}