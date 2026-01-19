import React, { useRef, useEffect, useState, useCallback } from "react";
import { soundManager } from "../utils/soundManager";
import { useSnakeFoodMapper } from "../hooks/useSnakeFoodMapper";

interface SnakeGameProps {
  isPlaying: boolean;
  onGameOver?: (score: number) => void;
  onClose?: () => void;
  debug?: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface Food {
  position: Position;
  type: "element" | "random";
  elementId?: string; // Only for element food
}

interface PointPopup {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

const GRID_SIZE = 20; // Number of cells per row/column
const CELL_SIZE = 30; // Size of each cell in pixels
const INITIAL_SNAKE_SPEED = 150; // Milliseconds between moves
const MIN_SNAKE_SPEED = 80; // Fastest speed
const ELEMENT_COOLDOWN = 15000; // 15 seconds before element can become food again

export const SnakeGame: React.FC<SnakeGameProps> = ({
  isPlaying,
  onGameOver,
  onClose,
  debug = false, // Disable debug by default
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const speedRef = useRef<number>(INITIAL_SNAKE_SPEED);

  // Map snake food elements from DOM
  const foodItems = useSnakeFoodMapper(isPlaying, {
    debug,
    canvasRef,
    gridSize: GRID_SIZE,
    cellSize: CELL_SIZE,
  });

  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
  ]);
  const [food, setFood] = useState<Food>({ position: { x: 15, y: 15 }, type: "random" });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Position>({ x: 1, y: 0 });
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [pointPopups, setPointPopups] = useState<PointPopup[]>([]);
  const [elementsEaten, setElementsEaten] = useState<number>(0);
  
  // Track when elements were last eaten
  const eatenElementsRef = useRef<Map<string, number>>(new Map());
  const activeElementFoodRef = useRef<HTMLElement | null>(null);
  const popupIdCounterRef = useRef<number>(0);
  
  // Element statistics tracking
  const [uniqueElementsEaten, setUniqueElementsEaten] = useState<Set<string>>(new Set());
  const [elementPoints, setElementPoints] = useState<number>(0);
  const [currentCombo, setCurrentCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [elementCounts, setElementCounts] = useState<Map<string, number>>(new Map());
  const [deathCount, setDeathCount] = useState<number>(0);
  const [testMode, setTestMode] = useState<boolean>(false);
  const [testCoordinate, setTestCoordinate] = useState<Position | null>(null);
  const testCoordinateRef = useRef<number>(0);
  const [showCoordinates, setShowCoordinates] = useState<boolean>(false);

  // Initialize high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("snake-high-score");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Get available element positions (not recently eaten)
  const getAvailableElementPositions = useCallback((): Array<{ position: Position; id: string; element: HTMLElement }> => {
    const now = Date.now();
    return foodItems
      .filter(item => {
        const lastEaten = eatenElementsRef.current.get(item.id);
        if (lastEaten && now - lastEaten < ELEMENT_COOLDOWN) {
          return false; // Still in cooldown
        }
        // Check if position conflicts with snake
        return true;
      })
      .map(item => ({
        position: { x: item.x, y: item.y },
        id: item.id,
        element: item.element,
      }));
  }, [foodItems]);

  // Generate food position (70% element, 30% random)
  const generateFood = useCallback((snakeBody: Position[]): Food => {
    const useElementFood = Math.random() < 0.7;
    const availableElements = getAvailableElementPositions();
    
    // Filter out positions occupied by snake
    const validElements = availableElements.filter(el => 
      !snakeBody.some(segment => segment.x === el.position.x && segment.y === el.position.y)
    );

    if (useElementFood && validElements.length > 0) {
      // Choose random element food
      const chosen = validElements[Math.floor(Math.random() * validElements.length)];
      
      // Remove old active class
      if (activeElementFoodRef.current) {
        activeElementFoodRef.current.classList.remove("snake-food-active");
      }
      
      // Add active class to new element food
      chosen.element.classList.add("snake-food-active");
      activeElementFoodRef.current = chosen.element;
      
      return {
        position: chosen.position,
        type: "element",
        elementId: chosen.id,
      };
    } else {
      // Generate random food
      let newPosition: Position;
      do {
        newPosition = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } while (
        snakeBody.some((segment) => segment.x === newPosition.x && segment.y === newPosition.y)
      );
      
      // Remove old active class
      if (activeElementFoodRef.current) {
        activeElementFoodRef.current.classList.remove("snake-food-active");
        activeElementFoodRef.current = null;
      }
      
      return {
        position: newPosition,
        type: "random",
      };
    }
  }, [getAvailableElementPositions]);

  // Check collision with walls or self
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    // Self collision
    return body.some(
      (segment, index) =>
        index > 0 && segment.x === head.x && segment.y === head.y
    );
  }, []);

  // Handle keyboard input
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC always works to exit, even during game over
      if (e.key === "Escape") {
        if (onClose) {
          onClose();
        }
        return;
      }

      // C key: Toggle coordinate display
      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        setShowCoordinates((prev) => {
          const newValue = !prev;
          console.log(`🐍 Coordinates display: ${newValue ? "ON" : "OFF"}`);
          return newValue;
        });
        return;
      }

      // Arrow keys only work when game is not over
      if (gameOver) return;

      // Prevent default arrow key behavior
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      let newDirection: Position | null = null;

      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) newDirection = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (direction.y === 0) newDirection = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (direction.x === 0) newDirection = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (direction.x === 0) newDirection = { x: 1, y: 0 };
          break;
      }

      if (newDirection) {
        setNextDirection(newDirection);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver, direction, onClose, debug]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const update = () => {
      const now = Date.now();
      if (now - lastUpdateTimeRef.current >= speedRef.current) {
        lastUpdateTimeRef.current = now;

        setSnake((currentSnake) => {
          setDirection((currentDir) => {
            const newDir = nextDirection;
            return newDir;
          });

          const newDir = nextDirection;
          const head = currentSnake[0];
          const newHead: Position = {
            x: head.x + newDir.x,
            y: head.y + newDir.y,
          };

          // Check collision
          if (checkCollision(newHead, currentSnake)) {
            soundManager.error();
            setDeathCount(prev => prev + 1);
            setCurrentCombo(0); // Reset combo on death
            setGameOver(true);
            const finalScore = score;
            if (finalScore > highScore) {
              const newHighScore = finalScore;
              setHighScore(newHighScore);
              localStorage.setItem("snake-high-score", newHighScore.toString());
            }
            if (onGameOver) {
              onGameOver(finalScore);
            }
            return currentSnake;
          }

          // Check if food eaten
          const ateFood = newHead.x === food.position.x && newHead.y === food.position.y;

          if (ateFood) {
            const isElementFood = food.type === "element";
            const points = isElementFood ? 20 : 10;
            const newScore = score + points;
            setScore(newScore);

            // Play appropriate sound
            if (isElementFood) {
              soundManager.eatElement();
              setElementsEaten(prev => prev + 1);
              setElementPoints(prev => prev + points);
              
              // Update combo
              setCurrentCombo(prev => {
                const newCombo = prev + 1;
                setHighestCombo(highest => Math.max(highest, newCombo));
                return newCombo;
              });
              
              // Mark element as eaten
              if (food.elementId) {
                eatenElementsRef.current.set(food.elementId, Date.now());
                
                // Track unique elements and counts
                setUniqueElementsEaten(prev => new Set([...prev, food.elementId!]));
                setElementCounts(prev => {
                  const newMap = new Map(prev);
                  newMap.set(food.elementId!, (newMap.get(food.elementId!) || 0) + 1);
                  return newMap;
                });
                
                // Find and react to element
                const elementFood = foodItems.find(item => item.id === food.elementId);
                if (elementFood) {
                  const element = elementFood.element;
                  
                  // Remove active class, add eaten class
                  element.classList.remove("snake-food-active");
                  element.classList.add("snake-food-eaten");
                  
                  // Flash white briefly
                  const originalFilter = element.style.filter;
                  element.style.filter = "brightness(3)";
                  setTimeout(() => {
                    element.style.filter = originalFilter;
                  }, 200);
                  
                  // Remove eaten class after 15 seconds
                  setTimeout(() => {
                    element.classList.remove("snake-food-eaten");
                  }, ELEMENT_COOLDOWN);
                  
                  // Show point popup at element position
                  const rect = element.getBoundingClientRect();
                  const popupId = popupIdCounterRef.current++;
                  setPointPopups(prev => [...prev, {
                    id: popupId,
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    text: `▲+${points}`,
                    color: "var(--color-accent)",
                  }]);
                  
                  // Remove popup after animation
                  setTimeout(() => {
                    setPointPopups(prev => prev.filter(p => p.id !== popupId));
                  }, 800);
                }
              }
            } else {
              // Reset combo when eating random food
              setCurrentCombo(0);
              soundManager.click();
              
              // Show point popup at food position
              const canvas = canvasRef.current;
              if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const popupId = popupIdCounterRef.current++;
                setPointPopups(prev => [...prev, {
                  id: popupId,
                  x: rect.left + food.position.x * CELL_SIZE + CELL_SIZE / 2,
                  y: rect.top + food.position.y * CELL_SIZE + CELL_SIZE / 2,
                  text: `+${points}`,
                  color: "white",
                }]);
                
                // Remove popup after animation
                setTimeout(() => {
                  setPointPopups(prev => prev.filter(p => p.id !== popupId));
                }, 800);
              }
            }

            // Increase speed slightly
            speedRef.current = Math.max(
              MIN_SNAKE_SPEED,
              INITIAL_SNAKE_SPEED - newScore * 2
            );

            // Generate new food
            const newFood = generateFood([newHead, ...currentSnake]);
            setFood(newFood);

            // Grow snake
            return [newHead, ...currentSnake];
          } else {
            // Move snake
            return [newHead, ...currentSnake.slice(0, -1)];
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    lastUpdateTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [
    isPlaying,
    gameOver,
    food,
    score,
    highScore,
    nextDirection,
    checkCollision,
    generateFood,
    onGameOver,
    foodItems,
    canvasRef,
  ]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drawFrameRef: number | null = null;

    const draw = () => {
      if (gameOver || !isPlaying) return;

      // Clear canvas
      ctx.fillStyle = "var(--color-bg)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "var(--color-muted)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
      }

      // Draw snake - cyan head, magenta body
      snake.forEach((segment, index) => {
        if (index === 0) {
          // Head - cyan
          ctx.fillStyle = "#00ffff"; // Cyan
        } else {
          // Body - magenta
          ctx.fillStyle = "#ff00ff"; // Magenta
        }
        ctx.fillRect(
          segment.x * CELL_SIZE + 2,
          segment.y * CELL_SIZE + 2,
          CELL_SIZE - 4,
          CELL_SIZE - 4
        );
      });

      // Draw food
      const foodX = food.position.x * CELL_SIZE + CELL_SIZE / 2;
      const foodY = food.position.y * CELL_SIZE + CELL_SIZE / 2;
      const foodSize = CELL_SIZE - 4;
      
      // Draw food - always red square for basic game
      ctx.fillStyle = "#ff0000"; // Red
      ctx.fillRect(
        foodX - foodSize / 2,
        foodY - foodSize / 2,
        foodSize,
        foodSize
      );

      // Draw coordinate if enabled (debug only)
      if (showCoordinates && debug) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "8px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const coordText = `(${food.position.x},${food.position.y})`;
        ctx.fillText(coordText, foodX, foodY + CELL_SIZE / 2 + 5);
        
        // Draw element ID if it's element food
        if (food.type === "element" && food.elementId) {
          ctx.font = "6px 'Press Start 2P', monospace";
          ctx.fillStyle = "#00ff00";
          ctx.fillText(food.elementId.substring(0, 10), foodX, foodY + CELL_SIZE / 2 + 15);
        }
      }

      // Draw debug visualization if enabled (only in debug mode)
      if (debug && (canvasRef.current as any)?.__drawDebug) {
        (canvasRef.current as any).__drawDebug();
      }

      // Continue animation loop
      drawFrameRef = requestAnimationFrame(draw);
    };

    drawFrameRef = requestAnimationFrame(draw);

    return () => {
      if (drawFrameRef !== null) {
        cancelAnimationFrame(drawFrameRef);
      }
    };
      }, [snake, food.position, food.type, gameOver, isPlaying, debug, canvasRef, showCoordinates]);

  // Reset game when starting
  const gameStartedRef = useRef(false);
  useEffect(() => {
    if (isPlaying && !gameStartedRef.current) {
      gameStartedRef.current = true;
      setSnake([{ x: 10, y: 10 }]);
      setDirection({ x: 1, y: 0 });
      setNextDirection({ x: 1, y: 0 });
      setScore(0);
      setGameOver(false);
      setElementsEaten(0);
      setPointPopups([]);
      setUniqueElementsEaten(new Set());
      setElementPoints(0);
      setCurrentCombo(0);
      setHighestCombo(0);
      setElementCounts(new Map());
      setDeathCount(0);
      eatenElementsRef.current.clear();
      if (activeElementFoodRef.current) {
        activeElementFoodRef.current.classList.remove("snake-food-active");
        activeElementFoodRef.current = null;
      }
      speedRef.current = INITIAL_SNAKE_SPEED;
      setFood(generateFood([{ x: 10, y: 10 }]));
      lastUpdateTimeRef.current = Date.now();
    } else if (!isPlaying) {
      gameStartedRef.current = false;
    }
  }, [isPlaying, generateFood]);

  // Helper functions for Game Over screen
  const getBestElement = useCallback((): string => {
    let bestElement = "";
    let maxCount = 0;
    elementCounts.forEach((count, id) => {
      if (count > maxCount) {
        maxCount = count;
        bestElement = id;
      }
    });
    return bestElement || "NONE";
  }, [elementCounts]);

  const getPerformanceMessage = useCallback((): string => {
    const uniqueCount = uniqueElementsEaten.size;
    const isPerfectRun = uniqueCount === 12 && deathCount === 0;
    
    if (isPerfectRun) {
      return "PERFECT RUN! Flawless victory.";
    } else if (uniqueCount >= 9) {
      return "LEGENDARY HARVEST! You've mastered this site.";
    } else if (uniqueCount >= 5) {
      return "Impressive harvest! You know your portfolio.";
    } else if (uniqueCount >= 1) {
      return "Good start! You're learning the layout.";
    } else {
      return "Focus on the glowing elements next time!";
    }
  }, [uniqueElementsEaten.size, deathCount]);

  const getUnlockedBadges = useCallback((): Array<{ id: string; name: string; description: string; icon: string }> => {
    const badges: Array<{ id: string; name: string; description: string; icon: string }> = [];
    const uniqueCount = uniqueElementsEaten.size;
    
    if (uniqueCount >= 12) {
      badges.push({ id: "collector", name: "COLLECTOR", description: "Harvested all 12 elements", icon: "★" });
    }
    if (highestCombo >= 5) {
      badges.push({ id: "combo", name: "COMBO MASTER", description: `Achieved ${highestCombo}x combo`, icon: "🔥" });
    }
    if (elementPoints >= 200) {
      badges.push({ id: "points", name: "POINT HUNTER", description: `Earned ${elementPoints} element points`, icon: "💰" });
    }
    if (deathCount === 0 && uniqueCount >= 5) {
      badges.push({ id: "survivor", name: "SURVIVOR", description: "No deaths with 5+ elements", icon: "🛡️" });
    }
    if (score >= 500) {
      badges.push({ id: "highscore", name: "HIGH SCORER", description: "Scored 500+ points", icon: "🏆" });
    }
    
    return badges;
  }, [uniqueElementsEaten.size, highestCombo, elementPoints, deathCount, score]);

  // Test mode: Log all element positions
  const logAllElementPositions = useCallback(() => {
    console.log("🧪 === TEST MODE: LOGGING ALL ELEMENT POSITIONS ===");
    const elements = document.querySelectorAll<HTMLElement>('[data-snake-food="true"]');
    console.log(`Found ${elements.length} elements with data-snake-food="true"`);
    
    elements.forEach((element, index) => {
      const foodId = element.getAttribute("data-food-id");
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const canvas = canvasRef.current;
      let canvasRect = null;
      if (canvas) {
        canvasRect = canvas.getBoundingClientRect();
      }
      
      console.log(`\n${index + 1}. Element: ${foodId || "NO ID"}`);
      console.log(`   Visible: ${element.offsetParent !== null}`);
      console.log(`   getBoundingClientRect():`, {
        left: rect.left.toFixed(2),
        top: rect.top.toFixed(2),
        width: rect.width.toFixed(2),
        height: rect.height.toFixed(2),
      });
      console.log(`   Center viewport: (${centerX.toFixed(2)}, ${centerY.toFixed(2)})`);
      
      if (canvasRect) {
        const relativeX = centerX - canvasRect.left;
        const relativeY = centerY - canvasRect.top;
        console.log(`   Canvas position: (${canvasRect.left.toFixed(2)}, ${canvasRect.top.toFixed(2)})`);
        console.log(`   Relative to canvas: (${relativeX.toFixed(2)}, ${relativeY.toFixed(2)})`);
        
        const gridX = Math.floor((relativeX / canvasRect.width) * GRID_SIZE);
        const gridY = Math.floor((relativeY / canvasRect.height) * GRID_SIZE);
        console.log(`   Calculated grid: (${gridX}, ${gridY})`);
      }
      
      // Find in foodItems
      const mappedItem = foodItems.find(item => item.id === foodId);
      if (mappedItem) {
        console.log(`   Mapped grid: (${mappedItem.x}, ${mappedItem.y})`);
      } else {
        console.log(`   ⚠️ NOT FOUND IN MAPPED ITEMS`);
      }
    });
    
    console.log(`\nCanvas dimensions:`, canvasRef.current ? {
      width: canvasRef.current.width,
      height: canvasRef.current.height,
      rect: canvasRef.current.getBoundingClientRect(),
    } : "Canvas not available");
    console.log(`Window: ${window.innerWidth}x${window.innerHeight}`);
    console.log("🧪 === END TEST LOG ===\n");
  }, [foodItems, canvasRef]);

  // Test mode: Spawn food at coordinates sequentially
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startCoordinateTest = useCallback(() => {
    if (testMode) {
      setTestMode(false);
      setTestCoordinate(null);
      testCoordinateRef.current = 0;
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current);
        testIntervalRef.current = null;
      }
      return;
    }
    
    setTestMode(true);
    testCoordinateRef.current = 0;
    setTestCoordinate({ x: 0, y: 0 });
    setFood({ position: { x: 0, y: 0 }, type: "random" });
    console.log("🧪 TEST MODE: Starting coordinate test. Food will spawn at (0,0)");
    
    // Clear any existing interval
    if (testIntervalRef.current) {
      clearInterval(testIntervalRef.current);
    }
    
    // Spawn at each coordinate sequentially
    testIntervalRef.current = setInterval(() => {
      const x = testCoordinateRef.current % GRID_SIZE;
      const y = Math.floor(testCoordinateRef.current / GRID_SIZE);
      
      if (testCoordinateRef.current >= GRID_SIZE * GRID_SIZE) {
        if (testIntervalRef.current) {
          clearInterval(testIntervalRef.current);
          testIntervalRef.current = null;
        }
        setTestMode(false);
        setTestCoordinate(null);
        console.log("🧪 TEST MODE: Completed all coordinates");
        return;
      }
      
      console.log(`🧪 TEST MODE: Spawning food at (${x}, ${y})`);
      setTestCoordinate({ x, y });
      setFood({ position: { x, y }, type: "random" });
      testCoordinateRef.current++;
    }, 1000); // Spawn every second
  }, [testMode]);

  // Cleanup test interval on unmount
  useEffect(() => {
    return () => {
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current);
      }
    };
  }, []);

  const handleShare = useCallback(async () => {
    const uniqueCount = uniqueElementsEaten.size;
    const shareText = `I scored ${score} points and harvested ${uniqueCount} elements on @rannegerodias's portfolio! #8bitPortfolio`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Snake Game Score",
          text: shareText,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert("Score copied to clipboard!");
      }
      soundManager.click();
    } catch (err) {
      // User cancelled or error occurred
      console.log("Share cancelled or failed");
    }
  }, [score, uniqueElementsEaten.size]);

  if (!isPlaying) return null;

  const canvasWidth = GRID_SIZE * CELL_SIZE;
  const canvasHeight = GRID_SIZE * CELL_SIZE;
  const uniqueCount = uniqueElementsEaten.size;
  const harvestProgress = (uniqueCount / 12) * 100;
  const bestElement = getBestElement();
  const performanceMessage = getPerformanceMessage();
  const unlockedBadges = getUnlockedBadges();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="snake-game-title"
      aria-modal="true"
    >
      <div className="relative flex flex-col items-center gap-4 p-6">
        {/* Score display */}
        <div className="flex gap-6 items-center pixel-border bg-card px-4 py-2">
          <div className="text-center">
            <p className="font-pixel text-[10px] text-muted">SCORE</p>
            <p className="font-pixel text-lg text-primary">{score}</p>
          </div>
          <div className="text-center">
            <p className="font-pixel text-[10px] text-muted">HIGH SCORE</p>
            <p className="font-pixel text-lg text-secondary">{highScore}</p>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="pixel-border box-glow bg-bg"
          style={{
            imageRendering: "pixelated",
            imageRendering: "crisp-edges",
          }}
          aria-label="Snake game canvas"
        />

        {/* Game Over screen */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/90 pixel-fade-in overflow-y-auto">
            <div className="text-center space-y-4 pixel-border bg-card p-4 md:p-6 box-glow max-w-2xl w-full mx-4 my-8">
              <h2
                id="snake-game-title"
                className="font-pixel text-xl md:text-2xl lg:text-3xl text-secondary neon-glow-secondary animate-pulse"
              >
                GAME OVER
              </h2>
              
              <p className="font-pixel text-sm md:text-base text-primary">
                FINAL SCORE: {score}
              </p>
              
              {score === highScore && score > 0 && (
                <p className="font-pixel text-xs md:text-sm text-accent neon-glow-accent">
                  ★ NEW HIGH SCORE! ★
                </p>
              )}

              {/* Performance Message */}
              <div className="pixel-border bg-bg/50 p-3 mt-2">
                <p className="font-pixel text-[10px] md:text-xs text-foreground">
                  {performanceMessage}
                </p>
              </div>

              {/* Element Statistics Section */}
              <div className="space-y-3 mt-4 text-left">
                <h3 className="font-pixel text-xs md:text-sm text-secondary neon-glow-secondary text-center">
                  ELEMENT STATISTICS
                </h3>
                
                {/* Elements Harvested */}
                <div className="pixel-border bg-bg/50 p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-pixel text-[9px] md:text-[10px] text-muted">
                      ELEMENTS HARVESTED:
                    </p>
                    <p className="font-pixel text-[10px] md:text-xs text-primary">
                      {uniqueCount}/12
                    </p>
                  </div>
                  <div className="pixel-progress-track h-3 w-full">
                    <div
                      className="pixel-progress-fill-accent"
                      style={{ width: `${harvestProgress}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="pixel-border bg-bg/50 p-2">
                    <p className="font-pixel text-[8px] md:text-[9px] text-muted">HIGHEST COMBO</p>
                    <p className="font-pixel text-sm md:text-base text-accent">{highestCombo}</p>
                  </div>
                  <div className="pixel-border bg-bg/50 p-2">
                    <p className="font-pixel text-[8px] md:text-[9px] text-muted">BEST ELEMENT</p>
                    <p className="font-pixel text-[9px] md:text-[10px] text-primary truncate" title={bestElement}>
                      {bestElement.replace(/-/g, " ").toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="pixel-border bg-bg/50 p-2">
                  <p className="font-pixel text-[8px] md:text-[9px] text-muted">TOTAL ELEMENT POINTS</p>
                  <p className="font-pixel text-sm md:text-base text-accent">{elementPoints}</p>
                </div>
              </div>

              {/* Badges Section */}
              {unlockedBadges.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-pixel text-xs md:text-sm text-secondary neon-glow-secondary">
                    ACHIEVEMENTS UNLOCKED
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {unlockedBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="pixel-border bg-card p-2 hover:bg-card/80 transition-colors cursor-help group relative"
                        title={badge.description}
                      >
                        <div className="text-center">
                          <p className="font-pixel text-lg text-accent">{badge.icon}</p>
                          <p className="font-pixel text-[8px] md:text-[9px] text-foreground mt-1">
                            {badge.name}
                          </p>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                          <div className="pixel-border bg-card p-2 whitespace-nowrap">
                            <p className="font-pixel text-[8px] text-foreground">{badge.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <button
                  onClick={() => {
                    soundManager.click();
                    setGameOver(false);
                    setSnake([{ x: 10, y: 10 }]);
                    setDirection({ x: 1, y: 0 });
                    setNextDirection({ x: 1, y: 0 });
                    setScore(0);
                    setElementsEaten(0);
                    setPointPopups([]);
                    setUniqueElementsEaten(new Set());
                    setElementPoints(0);
                    setCurrentCombo(0);
                    setHighestCombo(0);
                    setElementCounts(new Map());
                    setDeathCount(0);
                    eatenElementsRef.current.clear();
                    if (activeElementFoodRef.current) {
                      activeElementFoodRef.current.classList.remove("snake-food-active");
                      activeElementFoodRef.current = null;
                    }
                    speedRef.current = INITIAL_SNAKE_SPEED;
                    setFood(generateFood([{ x: 10, y: 10 }]));
                    lastUpdateTimeRef.current = Date.now();
                  }}
                  className="retro-btn retro-btn-primary px-4 py-2 font-pixel text-[10px] uppercase tracking-widest min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  PLAY AGAIN
                </button>
                
                <button
                  onClick={handleShare}
                  className="retro-btn retro-btn-secondary px-4 py-2 font-pixel text-[10px] uppercase tracking-widest min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2"
                >
                  SHARE SCORE
                </button>
                
                {onClose && (
                  <button
                    onClick={() => {
                      soundManager.click();
                      onClose();
                    }}
                    className="retro-btn retro-btn-secondary px-4 py-2 font-pixel text-[10px] uppercase tracking-widest min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2"
                  >
                    CLOSE
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!gameOver && (
          <div className="text-center space-y-2">
            <p className="font-pixel text-[9px] text-muted">
              USE ARROW KEYS TO MOVE • ESC TO EXIT{debug && " • C FOR COORDS"}
            </p>
            {elementsEaten > 0 && (
              <p className="font-pixel text-[8px] text-accent">
                ELEMENTS EATEN: {elementsEaten}
              </p>
            )}
            {showCoordinates && (
              <p className="font-pixel text-[8px] text-primary">
                COORDINATES: ON
              </p>
            )}
            
            {/* Debug Test Buttons */}
            {debug && (
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <button
                  onClick={() => {
                    soundManager.click();
                    logAllElementPositions();
                  }}
                  className="pixel-border bg-card/50 px-2 py-1 font-pixel text-[7px] text-foreground hover:bg-card transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  title="Log all element positions to console"
                >
                  LOG POSITIONS
                </button>
                <button
                  onClick={() => {
                    soundManager.click();
                    startCoordinateTest();
                  }}
                  className="pixel-border bg-card/50 px-2 py-1 font-pixel text-[7px] text-foreground hover:bg-card transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  title="Test food spawning at each coordinate (0,0 to 19,19)"
                >
                  {testMode ? "STOP TEST" : "TEST COORDS"}
                </button>
                {testMode && testCoordinate && (
                  <p className="font-pixel text-[8px] text-accent">
                    TEST: ({testCoordinate.x}, {testCoordinate.y})
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Point Popups */}
        {pointPopups.map(popup => (
          <div
            key={popup.id}
            className="point-popup"
            style={{
              left: `${popup.x}px`,
              top: `${popup.y}px`,
              color: popup.color,
            }}
          >
            {popup.text}
          </div>
        ))}
      </div>
    </div>
  );
};

