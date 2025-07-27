import { useEffect, useRef, useState } from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  baseOpacity: number;
  currentOpacity: number;
}

export function InteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const animationFrameRef = useRef<number>();
  const [randomization, setRandomization] = useState([0]); // 0-100 randomization level
  const [animationSpeed, setAnimationSpeed] = useState([50]); // 1-100 speed level
  const lastAnimationTime = useRef(0);

  // Generate grid of rectangles with 1px gaps
  useEffect(() => {
    const generateRectangles = () => {
      const rects: Rectangle[] = [];
      const canvasWidth = 400;
      const canvasHeight = 400;
      const baseSize = 20; // Base size of each rectangle
      const gap = 1; // 1 pixel gap between rectangles
      const stepSize = baseSize + gap; // Total step including gap
      const randomFactor = randomization[0] / 100; // 0-1 randomization factor
      
      // Create a grid with randomized rectangle sizes
      for (let y = 0; y < canvasHeight - baseSize; y += stepSize) {
        for (let x = 0; x < canvasWidth - baseSize; x += stepSize) {
          const baseOpacity = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
          
          // Calculate random width and height based on randomization level
          const maxVariation = baseSize * 0.8; // Max 80% variation
          const widthVariation = (Math.random() - 0.5) * maxVariation * randomFactor;
          const heightVariation = (Math.random() - 0.5) * maxVariation * randomFactor;
          
          const width = Math.max(5, Math.min(baseSize + widthVariation, stepSize - gap));
          const height = Math.max(5, Math.min(baseSize + heightVariation, stepSize - gap));
          
          rects.push({
            x,
            y,
            width,
            height,
            baseOpacity,
            currentOpacity: baseOpacity
          });
        }
      }
      
      setRectangles(rects);
    };

    generateRectangles();
  }, [randomization]);

  // Animation loop for random opacity changes on hover
  useEffect(() => {
    if (!isHovering) {
      // Reset to base opacity when not hovering
      setRectangles(prev => prev.map(rect => ({
        ...rect,
        currentOpacity: rect.baseOpacity
      })));
      return;
    }

    const animate = (currentTime: number) => {
      // Calculate delay based on animation speed (1-100 scale)
      // Speed 1 = 2000ms delay, Speed 100 = 16ms delay
      const speedFactor = animationSpeed[0];
      const delay = 2000 - (speedFactor - 1) * (2000 - 16) / 99;
      
      if (currentTime - lastAnimationTime.current >= delay) {
        setRectangles(prev => prev.map(rect => ({
          ...rect,
          currentOpacity: Math.random() * 0.8 + 0.2
        })));
        lastAnimationTime.current = currentTime;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovering, animationSpeed]);

  // Draw rectangles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background to black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw rectangles
    rectangles.forEach(rect => {
      const grayValue = Math.floor(Math.random() * 128 + 64); // Random gray between 64-192
      ctx.fillStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${rect.currentOpacity})`;
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    });
  }, [rectangles]);

  return (
    <div className="flex flex-col items-center justify-center size-full bg-gray-100 gap-8 p-8">
      {/* Controls */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div className="space-y-2">
          <Label>Rectangle Size Randomization: {randomization[0]}%</Label>
          <Slider
            value={randomization}
            onValueChange={setRandomization}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Animation Speed: {animationSpeed[0]}%</Label>
          <Slider
            value={animationSpeed}
            onValueChange={setAnimationSpeed}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border border-gray-300 cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          {isHovering ? 'Animating...' : 'Hover to animate'}
        </div>
      </div>
    </div>
  );
}