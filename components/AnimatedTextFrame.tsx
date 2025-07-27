import { useEffect, useRef, useState } from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Moon, Sun } from 'lucide-react';

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
  isHighlighted?: boolean; // For custom word letters
  baseOpacityMin?: number; // Minimum opacity for this letter
  baseOpacityMax?: number; // Maximum opacity for this letter
}

type AnimationStyle = 'blink' | 'wave' | 'wind' | 'rain';

export function AnimatedTextFrame() {
  const [letters, setLetters] = useState<LetterAnimation[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState([50]); // 1-100 speed level
  const [backgroundOpacity, setBackgroundOpacity] = useState([35]); // 5-65% max opacity for background letters
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('blink');
  const [highlightWord1, setHighlightWord1] = useState('DREAM');
  const [highlightWord2, setHighlightWord2] = useState('BELIEVE');
  const [highlightWord3, setHighlightWord3] = useState('ACHIEVE');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const animationFrameRef = useRef<number>();

  // Generate letters function
  const generateLetters = () => {
    const letterArray: LetterAnimation[] = [];
    const canvasWidth = 400;
    const canvasHeight = 400;
    const letterSize = 12; // Approximate letter width/height
    const gap = 2; // Gap between letters
    const stepX = letterSize + gap;
    const stepY = letterSize + gap;
    
    // Characters to choose from
    const randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    // Calculate grid dimensions
    const cols = Math.floor((canvasWidth - 20) / stepX);
    const rows = Math.floor((canvasHeight - 20) / stepY);
    
    // Create a 2D grid to track positions
    const grid: (LetterAnimation | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
    
    // First, fill entire grid with random letters (low opacity)
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
          baseOpacityMin: 0.05, // 5%
          baseOpacityMax: backgroundOpacity[0] / 100  // Dynamic based on slider
        };
      }
    }
    
    // Function to place a word in a random position
    const placeWord = (word: string, avoidRows: number[] = []) => {
      if (!word.trim()) return [];
      
      const wordLength = word.length;
      const availableRows = [];
      
      // Find rows that can fit the word and aren't in avoidRows
      for (let row = 0; row < rows; row++) {
        if (avoidRows.includes(row)) continue;
        
        // Check if there's enough space in this row
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
      
      // Pick a random available position
      const randomPos = availableRows[Math.floor(Math.random() * availableRows.length)];
      const { row, startCol } = randomPos;
      
      // Place the word
      for (let i = 0; i < wordLength; i++) {
        if (grid[row][startCol + i]) {
          grid[row][startCol + i]!.letter = word.charAt(i).toUpperCase();
          grid[row][startCol + i]!.isHighlighted = true;
          grid[row][startCol + i]!.baseOpacityMin = 0.80; // 80%
          grid[row][startCol + i]!.baseOpacityMax = 0.95; // 95%
        }
      }
      
      return [row];
    };
    
    // Place the three highlight words with spacing
    let usedRows: number[] = [];
    
    // Place words with strategic spacing
    if (highlightWord1.trim()) {
      const placedRows = placeWord(highlightWord1, usedRows);
      usedRows.push(...placedRows);
      // Add buffer rows around placed word
      placedRows.forEach(row => {
        if (row > 0) usedRows.push(row - 1);
        if (row < rows - 1) usedRows.push(row + 1);
      });
    }
    
    if (highlightWord2.trim()) {
      const placedRows = placeWord(highlightWord2, usedRows);
      usedRows.push(...placedRows);
      placedRows.forEach(row => {
        if (row > 0) usedRows.push(row - 1);
        if (row < rows - 1) usedRows.push(row + 1);
      });
    }
    
    if (highlightWord3.trim()) {
      placeWord(highlightWord3, usedRows);
    }
    
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

  // Initialize letters with animation properties and positions
  useEffect(() => {
    generateLetters();
  }, []);

  // Regenerate letters when highlight words or background opacity change
  useEffect(() => {
    generateLetters();
  }, [highlightWord1, highlightWord2, highlightWord3, backgroundOpacity]);

  // Reset positions when animation style changes
  useEffect(() => {
    setLetters(prev => prev.map(letter => ({
      ...letter,
      x: letter.initialX,
      y: letter.initialY,
      opacity: 1
    })));
  }, [animationStyle]);

  // Animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      // Calculate base speed from slider (1-100 scale)
      const speedMultiplier = animationSpeed[0] / 50; // Normalize around 1.0
      const time = currentTime * 0.001 * speedMultiplier; // Convert to seconds
      
      setLetters(prev => prev.map((letterData, index) => {
        let newLetterData = { ...letterData };
        
        // Calculate opacity range based on whether letter is highlighted
        const minOpacity = letterData.baseOpacityMin || 0.05;
        const maxOpacity = letterData.baseOpacityMax || 0.65;
        const opacityRange = maxOpacity - minOpacity;
        
        switch (animationStyle) {
          case 'blink':
            // Blinking animation with custom opacity ranges
            const frequency = letterData.animationSpeed;
            const sine = Math.sin(time * frequency + letterData.phase);
            newLetterData.opacity = minOpacity + (sine + 1) * 0.5 * opacityRange;
            break;
            
          case 'wave':
            // Sea wave animation - letters move in wave pattern
            const waveOffset = Math.sin(time * 2 + letterData.initialX * 0.02) * 15;
            newLetterData.y = letterData.initialY + waveOffset;
            newLetterData.opacity = minOpacity + (Math.sin(time * 3 + letterData.phase) + 1) * 0.5 * opacityRange;
            break;
            
          case 'wind':
            // Wind animation - letters sway horizontally
            const windStrength = Math.sin(time * 1.5 + letterData.windPhase!) * 8;
            const verticalSway = Math.sin(time * 0.8 + letterData.phase) * 3;
            newLetterData.x = letterData.initialX + windStrength;
            newLetterData.y = letterData.initialY + verticalSway;
            newLetterData.opacity = minOpacity + (Math.sin(time * 2 + letterData.phase) + 1) * 0.5 * opacityRange;
            break;
            
          case 'rain':
            // Rain animation - letters fall down
            const fallDistance = (time * letterData.fallSpeed! * 50) % 420; // Reset when off screen
            newLetterData.y = letterData.initialY + fallDistance;
            if (newLetterData.y > 400) {
              newLetterData.y = letterData.initialY - 20; // Reset to top
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
    <div className={`flex flex-col items-center justify-center size-full gap-8 p-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* Controls */}
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
              Animation Speed: {animationSpeed[0]}%
            </Label>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              max={100}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
              Background Opacity: {backgroundOpacity[0]}%
            </Label>
            <Slider
              value={backgroundOpacity}
              onValueChange={setBackgroundOpacity}
              max={65}
              min={5}
              step={1}
              className="w-full"
            />
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Max opacity for background letters (highlights stay 80-95%)
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
            Animation Style
          </Label>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={animationStyle === 'blink' ? 'default' : 'outline'}
              onClick={() => setAnimationStyle('blink')}
              size="sm"
            >
              Blink
            </Button>
            <Button
              variant={animationStyle === 'wave' ? 'default' : 'outline'}
              onClick={() => setAnimationStyle('wave')}
              size="sm"
            >
              Sea Wave
            </Button>
            <Button
              variant={animationStyle === 'wind' ? 'default' : 'outline'}
              onClick={() => setAnimationStyle('wind')}
              size="sm"
            >
              Wind
            </Button>
            <Button
              variant={animationStyle === 'rain' ? 'default' : 'outline'}
              onClick={() => setAnimationStyle('rain')}
              size="sm"
            >
              Rain
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
            Highlight Words
          </Label>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            These words will stand out with higher opacity (80-95%)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label htmlFor="word1" className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Word 1
              </Label>
              <Input
                id="word1"
                value={highlightWord1}
                onChange={(e) => setHighlightWord1(e.target.value)}
                placeholder="First word..."
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="word2" className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Word 2
              </Label>
              <Input
                id="word2"
                value={highlightWord2}
                onChange={(e) => setHighlightWord2(e.target.value)}
                placeholder="Second word..."
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="word3" className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Word 3
              </Label>
              <Input
                id="word3"
                value={highlightWord3}
                onChange={(e) => setHighlightWord3(e.target.value)}
                placeholder="Third word..."
                className="w-full"
              />
            </div>
          </div>
          
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Background letters: 5-{backgroundOpacity[0]}% opacity, highlight words: 80-95% opacity
          </p>
        </div>
        
        <div className="space-y-2">
          <Label className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
            Theme
          </Label>
          <div className="flex items-center space-x-2">
            <Sun className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-yellow-500'}`} />
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
            <Moon className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-gray-500'}`} />
            <Label htmlFor="theme-toggle" className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </Label>
          </div>
        </div>
      </div>

      {/* Text Frame - filled with letters */}
      <div className={`relative w-[400px] h-[400px] transition-colors duration-300 ${
        isDarkMode ? 'bg-black' : 'bg-white border-2 border-gray-200'
      }`}>
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
              opacity: letterData.opacity,
              transition: 'color 0.3s ease' // Only transition color, not position/opacity
            }}
          >
            {letterData.letter}
          </span>
        ))}
      </div>
    </div>
  );
}