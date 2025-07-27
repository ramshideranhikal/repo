/**
 * AnimatedTextFrame Version 1
 * 
 * Features:
 * - 4 Animation styles: Blink, Sea Wave, Wind, Rain
 * - Custom text input with repeat fill
 * - Random letter generation toggle
 * - Animation speed control
 * - Dark/Light mode themes
 * - 400x400px canvas with grid-based letter positioning
 * 
 * Created: July 27, 2025
 */

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
}

type AnimationStyle = 'blink' | 'wave' | 'wind' | 'rain';

export function AnimatedTextFrame_v1() {
  const [letters, setLetters] = useState<LetterAnimation[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState([50]); // 1-100 speed level
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('blink');
  const [customText, setCustomText] = useState('HELLO');
  const [useCustomText, setUseCustomText] = useState(false);
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
    const sourceText = useCustomText ? customText.toUpperCase() : randomCharacters;
    
    let letterIndex = 0;
    
    // Fill the canvas with letters in a grid
    for (let y = 10; y < canvasHeight - letterSize; y += stepY) {
      for (let x = 10; x < canvasWidth - letterSize; x += stepX) {
        let selectedLetter;
        
        if (useCustomText && customText.trim()) {
          // Use custom text, repeating if necessary
          selectedLetter = sourceText.charAt(letterIndex % sourceText.length);
          letterIndex++;
        } else {
          // Use random characters
          selectedLetter = randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
        }
        
        letterArray.push({
          letter: selectedLetter,
          opacity: 1,
          animationSpeed: Math.random() * 2 + 0.5, // Random speed between 0.5 and 2.5
          phase: Math.random() * Math.PI * 2, // Random starting phase
          x,
          y,
          initialX: x,
          initialY: y,
          fallSpeed: Math.random() * 2 + 1, // For rain animation
          windPhase: Math.random() * Math.PI * 2 // For wind animation
        });
      }
    }
    
    setLetters(letterArray);
  };

  // Initialize letters with animation properties and positions
  useEffect(() => {
    generateLetters();
  }, []);

  // Regenerate letters when text source changes
  useEffect(() => {
    generateLetters();
  }, [useCustomText, customText]);

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
        
        switch (animationStyle) {
          case 'blink':
            // Original blinking animation
            const frequency = letterData.animationSpeed;
            const sine = Math.sin(time * frequency + letterData.phase);
            newLetterData.opacity = 0.1 + (sine + 1) * 0.45;
            break;
            
          case 'wave':
            // Sea wave animation - letters move in wave pattern
            const waveOffset = Math.sin(time * 2 + letterData.initialX * 0.02) * 15;
            newLetterData.y = letterData.initialY + waveOffset;
            newLetterData.opacity = 0.7 + Math.sin(time * 3 + letterData.phase) * 0.3;
            break;
            
          case 'wind':
            // Wind animation - letters sway horizontally
            const windStrength = Math.sin(time * 1.5 + letterData.windPhase!) * 8;
            const verticalSway = Math.sin(time * 0.8 + letterData.phase) * 3;
            newLetterData.x = letterData.initialX + windStrength;
            newLetterData.y = letterData.initialY + verticalSway;
            newLetterData.opacity = 0.6 + Math.sin(time * 2 + letterData.phase) * 0.4;
            break;
            
          case 'rain':
            // Rain animation - letters fall down
            const fallDistance = (time * letterData.fallSpeed! * 50) % 420; // Reset when off screen
            newLetterData.y = letterData.initialY + fallDistance;
            if (newLetterData.y > 400) {
              newLetterData.y = letterData.initialY - 20; // Reset to top
            }
            newLetterData.opacity = 0.4 + Math.sin(fallDistance * 0.02) * 0.6;
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
          <div className="flex items-center space-x-2">
            <Switch
              id="text-source"
              checked={useCustomText}
              onCheckedChange={setUseCustomText}
            />
            <Label htmlFor="text-source" className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
              {useCustomText ? 'Using Custom Text' : 'Using Random Letters'}
            </Label>
          </div>
          
          {useCustomText && (
            <div className="space-y-2">
              <Label htmlFor="custom-text" className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
                Custom Text
              </Label>
              <Input
                id="custom-text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter text to animate..."
                className="w-full"
              />
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Letters will repeat to fill the canvas
              </p>
            </div>
          )}
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
            className={`absolute font-['Geist_Mono:Regular',_sans-serif] font-normal text-[10px] select-none transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-black'
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