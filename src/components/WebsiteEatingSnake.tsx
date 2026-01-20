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
  currentPosition: { x: number; y: number }; // Current actual position
  targetPosition: { x: number; y: number }; // Position to smoothly move to
  offset: number; // Distance behind head
}

interface Position {
  x: number;
  y: number;
}

const HEAD_SIZE = 28; // Size of snake head in pixels
const SEGMENT_SIZE = 24; // Uniform size for body segments
const SEGMENT_SPACING = 18; // Tighter spacing between segments (pixels)
const MOVEMENT_SPEED = 5; // Pixels per frame
const COLLISION_BUFFER = 10; // Buffer for collision detection

// Get color hint based on element type
const getColorFromElementType = (elementId: string): string => {
  if (elementId.includes("button")) return "var(--color-primary)";
  if (elementId.includes("header")) return "var(--color-accent)";
  if (elementId.includes("bar")) return "var(--color-secondary)";
  if (elementId.includes("card")) return "var(--color-primary)";
  return "var(--color-secondary)";
};

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
  const [trail, setTrail] = useState<Array<{x: number, y: number}>>([]); // Head position trail
  
  const animationFrameRef = useRef<number | null>(null);
  const segmentUpdateFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef<Position>({ x: 100, y: 100 });
  const keyDirectionRef = useRef<Position>({ x: 1, y: 0 });
  const eatenElementsRef = useRef<Set<string>>(new Set());
  const segmentCounterRef = useRef<number>(0);
  const lastHeadPositionRef = useRef<Position>({ x: 100, y: 100 });
  
  // Trail length based on number of segments eaten
  const getTrailLength = () => Math.max(segments.length + 5, 20); // At least 20 positions in trail

  // Initialize head position and trail
  useEffect(() => {
    if (isPlaying && headRef.current) {
      const rect = headRef.current.getBoundingClientRect();
      const initialPos = { x: rect.left, y: rect.top };
      setHeadPosition(initialPos);
      lastHeadPositionRef.current = initialPos;
      mousePositionRef.current = initialPos;
      // Initialize trail with current position repeated
      const trailLength = getTrailLength();
      setTrail(Array(trailLength).fill(initialPos).map(() => ({ ...initialPos })));
      console.log("🟢 INITIALIZED head position and trail:", initialPos);
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
    console.log("🔵 COLLISION DETECTED with element:", elementId);
    console.log("Current segments before:", segments.length);
    
    if (eatenElementsRef.current.has(elementId)) {
      console.log("⚠️ Element already eaten:", elementId);
      return; // Already eaten
    }

    eatenElementsRef.current.add(elementId);
    console.log("🟢 CREATING BODY SEGMENT for:", elementId);

    // 1. Find the ORIGINAL element
    const originalElement = document.querySelector(`[data-food-id="${elementId}"]`) as HTMLElement;
    if (!originalElement) {
      console.error("❌ Original element not found:", elementId);
      return;
    }

    // 2. Get position BEFORE cloning
    const rect = originalElement.getBoundingClientRect();
    console.log("Original element position:", { x: rect.x, y: rect.y, width: rect.width, height: rect.height });

    // 3. Create VISIBLE clone and transform it into uniform snake segment
    const clone = originalElement.cloneNode(true) as HTMLElement;
    
    // Make it VISIBLE and TRACKABLE with explicit styles
    const currentSegments = segments.length;
    const lastSegment = currentSegments > 0 ? segments[currentSegments - 1] : null;
    const targetX = lastSegment 
      ? lastSegment.currentPosition.x - SEGMENT_SPACING
      : headPosition.x - SEGMENT_SPACING;
    const targetY = lastSegment 
      ? lastSegment.currentPosition.y
      : headPosition.y;

    // Get color hint for gradient
    const elementColor = getColorFromElementType(elementId);

    // Transform clone to uniform snake segment appearance
    clone.style.cssText = `
      position: fixed !important;
      left: ${rect.left}px !important;
      top: ${rect.top}px !important;
      width: ${SEGMENT_SIZE}px !important;
      height: ${SEGMENT_SIZE}px !important;
      background: linear-gradient(135deg, var(--color-secondary) 70%, ${elementColor} 30%) !important;
      border: 2px solid black !important;
      border-radius: 3px !important;
      opacity: 0.9 !important;
      z-index: 9999 !important;
      pointer-events: none !important;
      /* Hide original content */
      color: transparent !important;
      font-size: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
      /* Snake segment pattern */
      background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 2px, transparent 3px) !important;
      transition: all 0.5s ease !important;
      will-change: transform, left, top !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2) !important;
    `;
    
    // Hide all children to remove original content
    const hideChildren = (el: HTMLElement) => {
      Array.from(el.children).forEach(child => {
        (child as HTMLElement).style.display = 'none';
      });
    };
    hideChildren(clone);
    
    // Add identifiers
    clone.setAttribute("data-snake-segment", elementId);
    clone.setAttribute("data-segment-index", currentSegments.toString());
    clone.setAttribute("data-original-type", elementId);
    clone.classList.add("snake-body-segment");

    // 4. Add to DOM FIRST (immediately visible) - use document.body
    document.body.appendChild(clone);
    console.log("✅ Clone added to DOM. Document contains?", document.contains(clone));
    console.log("Clone element:", clone);

    // 5. Create segment object with currentPosition (start at attach position from trail)
    const newSegment: SnakeSegment = {
      id: `segment-${Date.now()}-${segmentCounterRef.current++}`,
      elementId: elementId,
      element: clone,
      currentPosition: { x: targetX, y: targetY }, // Start at trail position (instant)
      targetPosition: { x: targetX, y: targetY },
      offset: currentSegments + 1,
    };
    
    // Set initial DOM position immediately
    clone.style.left = `${targetX}px`;
    clone.style.top = `${targetY}px`;

    // 6. Update state
    setSegments((prev) => {
      const newSegments = [...prev, newSegment];
      console.log("📈 Segments array updated. Length:", newSegments.length);
      console.log("New segment:", newSegment);
      return newSegments;
    });

    // 7. Animate from original position to snake position (no border change needed)

    // Hide original element with "bite" animation
    originalElement.classList.add("snake-food-eaten");
    originalElement.style.filter = "grayscale(1) brightness(0.5)";
    originalElement.style.opacity = "0.3";
    originalElement.style.transition = "all 0.5s ease";

    // Play sound
    soundManager.eatElement();

    // Update score
    const points = 20; // Element food always worth 20
    setScore((prev) => prev + points);
    
    console.log("Current segments after:", segments.length + 1);
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

  // Update head position based on mode and update trail
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

    // Only update if position actually changed
    if (newX !== headPosition.x || newY !== headPosition.y) {
      const newPosition = { x: newX, y: newY };
      setHeadPosition(newPosition);
      
      // Update trail: add new position to front, remove oldest
      setTrail(prev => {
        const newTrail = [newPosition, ...prev];
        const trailLength = getTrailLength();
        return newTrail.slice(0, trailLength);
      });
      
      lastHeadPositionRef.current = newPosition;
    }

    // Update head DOM position
    if (headRef.current) {
      headRef.current.style.left = `${newX}px`;
      headRef.current.style.top = `${newY}px`;
    }

    // Check for collisions
    requestAnimationFrame(() => {
      checkElementCollisions();
    });
  }, [headPosition, mode, gameOver, checkElementCollisions, segments.length]);

  // Update body segments to follow trail instantly (no lerp, classic snake movement)
  useEffect(() => {
    if (!isPlaying || segments.length === 0 || gameOver || trail.length === 0) {
      if (segmentUpdateFrameRef.current) {
        cancelAnimationFrame(segmentUpdateFrameRef.current);
        segmentUpdateFrameRef.current = null;
      }
      return;
    }

    const updateSegmentPositions = () => {
      setSegments((prevSegments) => {
        const updatedSegments = [...prevSegments];
        
        // Each segment instantly takes position from trail at fixed intervals
        for (let i = 0; i < updatedSegments.length; i++) {
          const segment = updatedSegments[i];
          
          // Calculate which trail position this segment should use
          // Segment 0 uses trail[5], segment 1 uses trail[10], etc.
          // This creates fixed spacing between segments
          const trailIndex = Math.min(5 + (i * 5), trail.length - 1);
          const trailPosition = trail[trailIndex] || trail[trail.length - 1] || headPosition;
          
          // INSTANT position update (no lerp - classic snake movement)
          segment.currentPosition = { x: trailPosition.x, y: trailPosition.y };
          segment.targetPosition = { x: trailPosition.x, y: trailPosition.y };
          
          // Update DOM element position instantly
          if (segment.element && segment.element.parentNode) {
            segment.element.style.left = `${trailPosition.x}px`;
            segment.element.style.top = `${trailPosition.y}px`;
            segment.element.style.width = `${SEGMENT_SIZE}px`;
            segment.element.style.height = `${SEGMENT_SIZE}px`;
            // Remove any transitions for instant movement
            segment.element.style.transition = "none";
          } else {
            console.warn(`⚠️ Segment ${segment.id} element not in DOM`);
          }
        }
        
        return updatedSegments;
      });
      
      segmentUpdateFrameRef.current = requestAnimationFrame(updateSegmentPositions);
    };
    
    segmentUpdateFrameRef.current = requestAnimationFrame(updateSegmentPositions);
    
    return () => {
      if (segmentUpdateFrameRef.current) {
        cancelAnimationFrame(segmentUpdateFrameRef.current);
      }
    };
  }, [isPlaying, trail, segments.length, gameOver, headPosition]);

  // Debug: Log segment rendering
  useEffect(() => {
    if (import.meta.env.DEV && segments.length > 0) {
      console.log("🟣 RENDERING - Total segments:", segments.length);
      segments.forEach((seg, i) => {
        console.log(`  Segment ${i}:`, {
          id: seg.id,
          elementId: seg.elementId,
          visible: document.contains(seg.element),
          position: seg.currentPosition,
          element: seg.element?.tagName,
          inDOM: seg.element?.parentNode !== null,
        });
      });
    }
  }, [segments]);

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
      
      // Check for self-collision (head hitting body)
      if (headRef.current && segments.length > 3) {
        const headRect = headRef.current.getBoundingClientRect();
        const collision = segments.some((segment) => {
          if (!segment.element || !document.contains(segment.element)) return false;
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
  }, [isPlaying, gameOver, updateHeadPosition, segments, checkCollision, score, onGameOver]);

  // Cleanup segments on unmount or game end
  useEffect(() => {
    return () => {
      // Remove all segment elements from DOM
      document.querySelectorAll('[data-snake-segment]').forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      
      // Also clean up from state
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
      // Clean up any existing segments
      document.querySelectorAll('[data-snake-segment]').forEach((el) => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      
      setScore(0);
      setGameOver(false);
      setSegments([]);
      eatenElementsRef.current.clear();
      segmentCounterRef.current = 0;
      
      // Reset trail
      if (headRef.current) {
        const rect = headRef.current.getBoundingClientRect();
        const initialPos = { x: rect.left, y: rect.top };
        const trailLength = getTrailLength();
        setTrail(Array(trailLength).fill(initialPos).map(() => ({ ...initialPos })));
        lastHeadPositionRef.current = initialPos;
      }
      
      // Remove eaten classes from all elements
      document.querySelectorAll(".snake-food-eaten").forEach((el) => {
        el.classList.remove("snake-food-eaten");
        (el as HTMLElement).style.filter = "";
        (el as HTMLElement).style.opacity = "";
      });
    }
  }, [isPlaying]);

  if (!isPlaying) return null;

  // Calculate connector line positions (use currentPosition directly for instant updates)
  const getSegmentCenter = (segment: SnakeSegment) => {
    // Use currentPosition directly (no need for getBoundingClientRect - positions update instantly)
    return { 
      x: segment.currentPosition.x + SEGMENT_SIZE / 2, 
      y: segment.currentPosition.y + SEGMENT_SIZE / 2 
    };
  };

  const headCenter = { 
    x: headPosition.x + HEAD_SIZE / 2, 
    y: headPosition.y + HEAD_SIZE / 2 
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      {/* SVG for connector tissue between segments */}
      <svg
        ref={svgRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 9994 }}
      >
        {/* Connector circles between head and first segment */}
        {segments.length > 0 && (() => {
          const firstSegment = segments[0];
          const firstCenter = getSegmentCenter(firstSegment);
          const midX = (headCenter.x + firstCenter.x) / 2;
          const midY = (headCenter.y + firstCenter.y) / 2;
          
          return (
            <circle
              key="connector-head-to-first"
              cx={midX}
              cy={midY}
              r="4"
              fill="var(--color-accent)"
              opacity="0.7"
            />
          );
        })()}
        
        {/* Connector circles between segments */}
        {segments.map((segment, index) => {
          const nextSegment = segments[index + 1];
          if (!nextSegment) return null;
          
          const currentCenter = getSegmentCenter(segment);
          const nextCenter = getSegmentCenter(nextSegment);
          const midX = (currentCenter.x + nextCenter.x) / 2;
          const midY = (currentCenter.y + nextCenter.y) / 2;
          
          return (
            <circle
              key={`connector-${segment.id}`}
              cx={midX}
              cy={midY}
              r="3"
              fill="var(--color-accent)"
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
          border: "3px solid black",
          borderRadius: "4px",
          boxShadow: 
            "0 0 20px var(--color-primary), " +
            "inset 4px 4px 0 0 rgba(255,255,255,0.5), " +
            "inset -4px -4px 0 0 rgba(255,255,255,0.5), " +
            "0 2px 4px rgba(0,0,0,0.5)",
          transition: "none", // No transition for smooth movement
        }}
        aria-label="Snake head"
      >
        {/* Eye indicators (left and right) */}
        <div
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            backgroundColor: "black",
            borderRadius: "50%",
            top: "35%",
            left: "30%",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            backgroundColor: "black",
            borderRadius: "50%",
            top: "35%",
            right: "30%",
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

      {/* Debug: Segment count (development only) */}
      {import.meta.env.DEV && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded z-[10000] font-pixel text-[8px]">
          Segments: {segments.length}
          <br />
          In DOM: {document.querySelectorAll('[data-snake-segment]').length}
        </div>
      )}

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
                  // Clean up segments
                  document.querySelectorAll('[data-snake-segment]').forEach((el) => {
                    if (el.parentNode) {
                      el.parentNode.removeChild(el);
                    }
                  });
                  setGameOver(false);
                  setScore(0);
                  setSegments([]);
                  eatenElementsRef.current.clear();
                  segmentCounterRef.current = 0;
                  // Reset trail
                  if (headRef.current) {
                    const rect = headRef.current.getBoundingClientRect();
                    const initialPos = { x: rect.left, y: rect.top };
                    const trailLength = getTrailLength();
                    setTrail(Array(trailLength).fill(initialPos).map(() => ({ ...initialPos })));
                    lastHeadPositionRef.current = initialPos;
                  }
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
                    // Clean up segments
                    document.querySelectorAll('[data-snake-segment]').forEach((el) => {
                      if (el.parentNode) {
                        el.parentNode.removeChild(el);
                      }
                    });
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
