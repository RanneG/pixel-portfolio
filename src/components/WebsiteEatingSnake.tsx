import React, { useRef, useEffect, useState, useCallback } from "react";
import { soundManager } from "../utils/soundManager";

interface WebsiteEatingSnakeProps {
  isPlaying: boolean;
  onGameOver?: (score: number) => void;
  onClose?: () => void;
  mode?: "mouse" | "arrow"; // Control mode: mouse follow or arrow keys
}

interface SnakeSegment {
  id: string;
  elementId: string;
  element: HTMLElement; // Cloned DOM element
  position: { x: number; y: number };
  targetPosition: { x: number; y: number }; // Position to smoothly move to
  offset: number; // Distance behind head
}

interface Position {
  x: number;
  y: number;
}

const HEAD_SIZE = 40; // Size of snake head in pixels
const SEGMENT_SPACING = 50; // Distance between segments
const SEGMENT_SCALE = 0.7; // Scale factor for body segments
const MOVEMENT_SPEED = 5; // Pixels per frame
const COLLISION_BUFFER = 10; // Buffer for collision detection

export const WebsiteEatingSnake: React.FC<WebsiteEatingSnakeProps> = ({
  isPlaying,
  onGameOver,
  onClose,
  mode = "mouse", // Default to mouse following
}) => {
  const headRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [headPosition, setHeadPosition] = useState<Position>({ x: 100, y: 100 });
  const [segments, setSegments] = useState<SnakeSegment[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef<Position>({ x: 100, y: 100 });
  const keyDirectionRef = useRef<Position>({ x: 1, y: 0 });
  const eatenElementsRef = useRef<Set<string>>(new Set());
  const segmentCounterRef = useRef<number>(0);

  // Initialize head position
  useEffect(() => {
    if (isPlaying && headRef.current) {
      const rect = headRef.current.getBoundingClientRect();
      setHeadPosition({ x: rect.left, y: rect.top });
      mousePositionRef.current = { x: rect.left, y: rect.top };
    }
  }, [isPlaying]);

  // Handle keyboard input for arrow key mode
  useEffect(() => {
    if (!isPlaying || mode !== "arrow") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
        return;
      }

      if (gameOver) return;

      // Prevent default arrow key behavior
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      let newDirection: Position | null = null;

      switch (e.key) {
        case "ArrowUp":
          if (keyDirectionRef.current.y === 0) newDirection = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          if (keyDirectionRef.current.y === 0) newDirection = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          if (keyDirectionRef.current.x === 0) newDirection = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          if (keyDirectionRef.current.x === 0) newDirection = { x: 1, y: 0 };
          break;
      }

      if (newDirection) {
        keyDirectionRef.current = newDirection;
        setDirection(newDirection);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, mode, gameOver, onClose]);

  // Handle mouse movement for mouse mode
  useEffect(() => {
    if (!isPlaying || mode !== "mouse" || gameOver) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX - HEAD_SIZE / 2, y: e.clientY - HEAD_SIZE / 2 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPlaying, mode, gameOver]);

  // Calculate collision between two rectangles (AABB)
  const checkCollision = useCallback((rect1: DOMRect, rect2: DOMRect): boolean => {
    return (
      rect1.left < rect2.right + COLLISION_BUFFER &&
      rect1.right + COLLISION_BUFFER > rect2.left &&
      rect1.top < rect2.bottom + COLLISION_BUFFER &&
      rect1.bottom + COLLISION_BUFFER > rect2.top
    );
  }, []);

  // Eat an element: clone it, hide original, add to snake body
  const eatElement = useCallback((element: HTMLElement, elementId: string) => {
    if (eatenElementsRef.current.has(elementId)) {
      return; // Already eaten
    }

    eatenElementsRef.current.add(elementId);

    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement;
    clone.classList.add("snake-body-segment");
    clone.style.position = "fixed";
    clone.style.zIndex = "9999";
    clone.style.pointerEvents = "none";
    clone.style.transform = `scale(${SEGMENT_SCALE})`;
    clone.style.opacity = "0.8";
    clone.style.transition = "all 0.3s ease";
    clone.style.willChange = "transform";

    // Get original element position
    const originalRect = element.getBoundingClientRect();
    clone.style.left = `${originalRect.left}px`;
    clone.style.top = `${originalRect.top}px`;
    clone.style.width = `${originalRect.width}px`;
    clone.style.height = `${originalRect.height}px`;

    // Add to DOM
    if (containerRef.current) {
      containerRef.current.appendChild(clone);
    }

    // Calculate target position (behind last segment or head)
    const lastSegment = segments[segments.length - 1];
    const targetX = lastSegment 
      ? lastSegment.targetPosition.x 
      : headPosition.x - SEGMENT_SPACING;
    const targetY = lastSegment 
      ? lastSegment.targetPosition.y 
      : headPosition.y;

    // Create segment
    const newSegment: SnakeSegment = {
      id: `segment-${segmentCounterRef.current++}`,
      elementId,
      element: clone,
      position: { x: originalRect.left, y: originalRect.top },
      targetPosition: { x: targetX, y: targetY },
      offset: segments.length + 1,
    };

    setSegments((prev) => [...prev, newSegment]);

    // Hide original element with "bite" animation
    element.classList.add("snake-food-eaten");
    element.style.filter = "grayscale(1) brightness(0.5)";
    element.style.opacity = "0.3";
    element.style.transition = "all 0.5s ease";

    // Play sound
    soundManager.eatElement();

    // Update score
    const points = 20; // Element food always worth 20
    setScore((prev) => prev + points);
  }, [segments, headPosition]);

  // Check for collisions with portfolio elements
  const checkElementCollisions = useCallback(() => {
    if (!headRef.current || gameOver) return;

    const headRect = headRef.current.getBoundingClientRect();
    const elements = document.querySelectorAll<HTMLElement>('[data-snake-food="true"]');

    elements.forEach((element) => {
      const elementId = element.getAttribute("data-food-id");
      if (!elementId || eatenElementsRef.current.has(elementId)) {
        return;
      }

      const elementRect = element.getBoundingClientRect();
      if (checkCollision(headRect, elementRect)) {
        eatElement(element, elementId);
      }
    });
  }, [checkCollision, eatElement, gameOver]);

  // Update head position based on mode
  const updateHeadPosition = useCallback(() => {
    if (!headRef.current || gameOver) return;

    let newX = headPosition.x;
    let newY = headPosition.y;

    if (mode === "mouse") {
      // Smoothly move head toward mouse
      const targetX = mousePositionRef.current.x;
      const targetY = mousePositionRef.current.y;
      
      const dx = targetX - headPosition.x;
      const dy = targetY - headPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 1) {
        newX = headPosition.x + (dx / distance) * MOVEMENT_SPEED;
        newY = headPosition.y + (dy / distance) * MOVEMENT_SPEED;
      }
    } else if (mode === "arrow") {
      // Move head based on arrow key direction
      newX = headPosition.x + keyDirectionRef.current.x * MOVEMENT_SPEED;
      newY = headPosition.y + keyDirectionRef.current.y * MOVEMENT_SPEED;

      // Check boundaries (prevent going off screen)
      newX = Math.max(0, Math.min(window.innerWidth - HEAD_SIZE, newX));
      newY = Math.max(0, Math.min(window.innerHeight - HEAD_SIZE, newY));
    }

    setHeadPosition({ x: newX, y: newY });

    // Update head DOM position
    if (headRef.current) {
      headRef.current.style.left = `${newX}px`;
      headRef.current.style.top = `${newY}px`;
    }

    // Check for collisions
    requestAnimationFrame(() => {
      checkElementCollisions();
    });
  }, [headPosition, mode, gameOver, checkElementCollisions]);

  // Update body segments to follow head
  const updateBodySegments = useCallback(() => {
    setSegments((prevSegments) => {
      return prevSegments.map((segment, index) => {
        // Calculate target position: behind previous segment or head
        let targetX: number;
        let targetY: number;

        if (index === 0) {
          // First segment follows head
          const dx = headPosition.x - segment.position.x;
          const dy = headPosition.y - segment.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > SEGMENT_SPACING) {
            const angle = Math.atan2(dy, dx);
            targetX = headPosition.x - Math.cos(angle) * SEGMENT_SPACING;
            targetY = headPosition.y - Math.sin(angle) * SEGMENT_SPACING;
          } else {
            targetX = segment.targetPosition.x;
            targetY = segment.targetPosition.y;
          }
        } else {
          // Follow previous segment
          const prevSegment = prevSegments[index - 1];
          const dx = prevSegment.position.x - segment.position.x;
          const dy = prevSegment.position.y - segment.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > SEGMENT_SPACING) {
            const angle = Math.atan2(dy, dx);
            targetX = prevSegment.position.x - Math.cos(angle) * SEGMENT_SPACING;
            targetY = prevSegment.position.y - Math.sin(angle) * SEGMENT_SPACING;
          } else {
            targetX = segment.targetPosition.x;
            targetY = segment.targetPosition.y;
          }
        }

        // Smoothly move segment toward target
        const dx = targetX - segment.position.x;
        const dy = targetY - segment.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let newX = segment.position.x;
        let newY = segment.position.y;
        
        if (distance > 1) {
          newX = segment.position.x + (dx / distance) * MOVEMENT_SPEED * 0.8; // Slightly slower
          newY = segment.position.y + (dy / distance) * MOVEMENT_SPEED * 0.8;
        } else {
          newX = targetX;
          newY = targetY;
        }

        // Update DOM element position
        segment.element.style.left = `${newX}px`;
        segment.element.style.top = `${newY}px`;
        segment.element.style.transform = `scale(${SEGMENT_SCALE}) translate(${(-SEGMENT_SCALE + 1) * 50}%, ${(-SEGMENT_SCALE + 1) * 50}%)`;

        return {
          ...segment,
          position: { x: newX, y: newY },
          targetPosition: { x: targetX, y: targetY },
        };
      });
    });
  }, [headPosition]);

  // Main game loop
  useEffect(() => {
    if (!isPlaying || gameOver) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const gameLoop = () => {
      updateHeadPosition();
      updateBodySegments();
      
      // Check for self-collision (head hitting body)
      if (headRef.current && segments.length > 3) {
        const headRect = headRef.current.getBoundingClientRect();
        const collision = segments.some((segment) => {
          const segmentRect = segment.element.getBoundingClientRect();
          return checkCollision(headRect, segmentRect);
        });

        if (collision) {
          soundManager.error();
          setGameOver(true);
          if (onGameOver) {
            onGameOver(score);
          }
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, gameOver, updateHeadPosition, updateBodySegments, segments, checkCollision, score, onGameOver]);

  // Cleanup segments on unmount or game end
  useEffect(() => {
    return () => {
      segments.forEach((segment) => {
        if (segment.element.parentNode) {
          segment.element.parentNode.removeChild(segment.element);
        }
      });
    };
  }, []);

  // Reset game
  useEffect(() => {
    if (isPlaying && !gameOver) {
      setScore(0);
      setGameOver(false);
      setSegments([]);
      eatenElementsRef.current.clear();
      segmentCounterRef.current = 0;
      
      // Remove eaten classes from all elements
      document.querySelectorAll(".snake-food-eaten").forEach((el) => {
        el.classList.remove("snake-food-eaten");
        (el as HTMLElement).style.filter = "";
        (el as HTMLElement).style.opacity = "";
      });
    }
  }, [isPlaying]);

  if (!isPlaying) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      {/* SVG for connector lines */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 9998 }}
      >
        {segments.map((segment, index) => {
          const prevPosition = index === 0 
            ? { x: headPosition.x + HEAD_SIZE / 2, y: headPosition.y + HEAD_SIZE / 2 }
            : { 
                x: segments[index - 1].position.x, 
                y: segments[index - 1].position.y 
              };
          
          const segmentRect = segment.element.getBoundingClientRect();
          const segmentCenterX = segmentRect.left + segmentRect.width / 2;
          const segmentCenterY = segmentRect.top + segmentRect.height / 2;
          
          return (
            <line
              key={`connector-${segment.id}`}
              x1={prevPosition.x}
              y1={prevPosition.y}
              x2={segmentCenterX}
              y2={segmentCenterY}
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          );
        })}
      </svg>

      {/* Snake Head */}
      <div
        ref={headRef}
        className="snake-head fixed z-[10000] pointer-events-none"
        style={{
          width: `${HEAD_SIZE}px`,
          height: `${HEAD_SIZE}px`,
          left: `${headPosition.x}px`,
          top: `${headPosition.y}px`,
          backgroundColor: "var(--color-primary)",
          border: "3px solid var(--color-foreground)",
          borderRadius: "4px",
          boxShadow: "0 0 20px var(--color-primary), inset 0 0 10px rgba(255, 255, 255, 0.3)",
          transition: "none", // No transition for smooth movement
        }}
        aria-label="Snake head"
      >
        {/* Eye indicator */}
        <div
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            backgroundColor: "var(--color-foreground)",
            borderRadius: "50%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Score Display */}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[10001] pixel-border bg-card px-4 py-2"
        style={{ pointerEvents: "none" }}
      >
        <p className="font-pixel text-xs text-primary">
          SCORE: {score} | ELEMENTS: {segments.length}/12
        </p>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-bg/95 backdrop-blur-sm pixel-fade-in">
          <div className="text-center space-y-4 pixel-border bg-card p-6 box-glow max-w-md w-full mx-4">
            <h2 className="font-pixel text-2xl text-secondary neon-glow-secondary animate-pulse">
              GAME OVER
            </h2>
            <p className="font-pixel text-lg text-primary">FINAL SCORE: {score}</p>
            <p className="font-pixel text-sm text-muted">
              ELEMENTS EATEN: {segments.length}/12
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  soundManager.click();
                  setGameOver(false);
                  setScore(0);
                  setSegments([]);
                  eatenElementsRef.current.clear();
                  segmentCounterRef.current = 0;
                  document.querySelectorAll(".snake-food-eaten").forEach((el) => {
                    el.classList.remove("snake-food-eaten");
                    (el as HTMLElement).style.filter = "";
                    (el as HTMLElement).style.opacity = "";
                  });
                }}
                className="retro-btn retro-btn-primary px-4 py-2 font-pixel text-[10px] uppercase"
              >
                PLAY AGAIN
              </button>
              {onClose && (
                <button
                  onClick={() => {
                    soundManager.click();
                    onClose();
                  }}
                  className="retro-btn retro-btn-secondary px-4 py-2 font-pixel text-[10px] uppercase"
                >
                  EXIT
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!gameOver && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10001] pixel-border bg-card/80 px-4 py-2"
          style={{ pointerEvents: "none" }}
        >
          <p className="font-pixel text-[9px] text-muted">
            {mode === "mouse" 
              ? "MOVE MOUSE • ESC TO EXIT" 
              : "USE ARROW KEYS • ESC TO EXIT"}
          </p>
        </div>
      )}
    </div>
  );
};

