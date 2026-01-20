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

// Collision Debug Overlay Component
interface CollisionDebugOverlayProps {
  headRef: React.RefObject<HTMLDivElement>;
  segments: SnakeSegment[];
  closestSegment: {index: number, distance: number} | null;
  collisionStatus: "SAFE" | "CLOSE" | "COLLISION";
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CollisionDebugOverlay: React.FC<CollisionDebugOverlayProps> = ({
  headRef,
  segments,
  closestSegment,
  collisionStatus,
  canvasRef,
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !headRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      // Resize canvas to match window
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get head position
      const headRect = headRef.current?.getBoundingClientRect();
      if (!headRect) return;

      const headCenter = {
        x: headRect.left + headRect.width / 2,
        y: headRect.top + headRect.height / 2,
      };

      // Draw collision radius around head (20px threshold)
      ctx.strokeStyle = collisionStatus === "COLLISION" ? "#ff0000" :
                       collisionStatus === "CLOSE" ? "#ffff00" :
                       "#00ff00";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(headCenter.x, headCenter.y, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw head center point
      ctx.fillStyle = "#00ffff";
      ctx.beginPath();
      ctx.arc(headCenter.x, headCenter.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw segments and collision radii
      segments.forEach((segment, index) => {
        if (!segment.element || !document.contains(segment.element)) return;

        const segmentRect = segment.element.getBoundingClientRect();
        const segmentCenter = {
          x: segmentRect.left + segmentRect.width / 2,
          y: segmentRect.top + segmentRect.height / 2,
        };

        // Highlight closest segment
        const isClosest = closestSegment?.index === index;
        
        // Draw collision radius (12px for segments)
        ctx.strokeStyle = isClosest 
          ? (collisionStatus === "COLLISION" ? "#ff0000" : "#ffff00")
          : "#666666";
        ctx.lineWidth = isClosest ? 3 : 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(segmentCenter.x, segmentCenter.y, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw segment center point
        ctx.fillStyle = isClosest ? "#ffff00" : "#ff00ff";
        ctx.beginPath();
        ctx.arc(segmentCenter.x, segmentCenter.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw distance line to head if closest segment
        if (isClosest && closestSegment) {
          ctx.strokeStyle = collisionStatus === "COLLISION" ? "#ff0000" :
                           collisionStatus === "CLOSE" ? "#ffff00" :
                           "#00ff00";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(headCenter.x, headCenter.y);
          ctx.lineTo(segmentCenter.x, segmentCenter.y);
          ctx.stroke();

          // Draw distance label
          ctx.fillStyle = "#ffffff";
          ctx.font = "10px 'Press Start 2P', monospace";
          ctx.textAlign = "center";
          ctx.fillText(
            `${closestSegment.distance.toFixed(1)}px`,
            (headCenter.x + segmentCenter.x) / 2,
            (headCenter.y + segmentCenter.y) / 2 - 10
          );
        }
      });
      
      // Draw tunnel path if continuous collision was detected
      if (tunnelPathRef.current) {
        const tunnel = tunnelPathRef.current;
        const tunnelStart = {
          x: tunnel.start.x + HEAD_SIZE / 2,
          y: tunnel.start.y + HEAD_SIZE / 2,
        };
        const tunnelEnd = {
          x: tunnel.end.x + HEAD_SIZE / 2,
          y: tunnel.end.y + HEAD_SIZE / 2,
        };
        
        // Draw movement path that caused collision
        ctx.strokeStyle = "rgba(255, 0, 255, 0.7)";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(tunnelStart.x, tunnelStart.y);
        ctx.lineTo(tunnelEnd.x, tunnelEnd.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw hit point estimate (midpoint)
        const midX = (tunnelStart.x + tunnelEnd.x) / 2;
        const midY = (tunnelStart.y + tunnelEnd.y) / 2;
        
        ctx.fillStyle = "#ff00ff";
        ctx.beginPath();
        ctx.arc(midX, midY, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.textAlign = "left";
        ctx.fillText("TUNNEL PATH", midX + 10, midY - 10);
        
        // Clear tunnel path after drawing (will be set again if collision persists)
        setTimeout(() => {
          tunnelPathRef.current = null;
        }, 100);
      }
    };

    const animationFrame = requestAnimationFrame(function frame() {
      draw();
      requestAnimationFrame(frame);
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [headRef, segments, closestSegment, collisionStatus, canvasRef]);

  return null;
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
  
  // Initialize head position to center of screen for visibility
  const [headPosition, setHeadPosition] = useState<Position>(() => {
    if (typeof window !== 'undefined') {
      return { 
        x: window.innerWidth / 2 - HEAD_SIZE / 2, 
        y: window.innerHeight / 2 - HEAD_SIZE / 2 
      };
    }
    return { x: 400, y: 300 }; // Fallback for SSR
  });
  const [segments, setSegments] = useState<SnakeSegment[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameOverReason, setGameOverReason] = useState<string>("unknown");
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<Array<{x: number, y: number}>>([]); // Head position trail
  const [debugVisible, setDebugVisible] = useState<boolean>(import.meta.env.DEV);
  const [debugMode, setDebugMode] = useState<boolean>(false); // Visual collision debug overlay
  const [collisionEnabled, setCollisionEnabled] = useState<boolean>(true); // Toggle collision detection
  const [isPaused, setIsPaused] = useState<boolean>(false); // Pause game
  const [closestSegment, setClosestSegment] = useState<{index: number, distance: number} | null>(null); // Closest segment for debug
  const [collisionStatus, setCollisionStatus] = useState<"SAFE" | "CLOSE" | "COLLISION">("SAFE");
  
  const animationFrameRef = useRef<number | null>(null);
  const segmentUpdateFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef<Position>({ x: 100, y: 100 });
  const keyDirectionRef = useRef<Position>({ x: 1, y: 0 });
  const eatenElementsRef = useRef<Set<string>>(new Set());
  const segmentCounterRef = useRef<number>(0);
  const lastHeadPositionRef = useRef<Position>({ x: 100, y: 100 });
  const prevHeadPositionRef = useRef<Position>({ x: 100, y: 100 }); // Previous frame position for continuous collision
  const debugCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tunnelPathRef = useRef<{start: Position, end: Position, segment: number} | null>(null); // For debug visualization
  
  // Trail length based on number of segments eaten
  const getTrailLength = () => Math.max(segments.length + 5, 20); // At least 20 positions in trail
  
  // Maximum speed per frame to prevent extreme tunneling
  const MAX_SPEED_PER_FRAME = 15; // pixels per frame maximum

      // Initialize head position and trail
  useEffect(() => {
    if (isPlaying) {
      // Initialize head position to center of screen (visible position)
      const initialPos = { 
        x: window.innerWidth / 2 - HEAD_SIZE / 2, 
        y: window.innerHeight / 2 - HEAD_SIZE / 2 
      };
      setHeadPosition(initialPos);
      lastHeadPositionRef.current = initialPos;
      prevHeadPositionRef.current = initialPos; // Initialize previous position
      mousePositionRef.current = initialPos;
      // Initialize trail with current position repeated
      const trailLength = getTrailLength();
      setTrail(Array(trailLength).fill(initialPos).map(() => ({ ...initialPos })));
      console.log("🟢 INITIALIZED head position and trail:", initialPos);
      console.log("🟢 Window size:", { width: window.innerWidth, height: window.innerHeight });
    }
  }, [isPlaying]);

  // Add test segment function
  const addTestSegment = useCallback(() => {
    const testElementId = `test-segment-${segments.length + 1}`;
    const colors = ["var(--color-secondary)", "var(--color-primary)", "var(--color-accent)", "#FF5555"];
    const color = colors[segments.length % colors.length];
    
    // Calculate target position from trail
    const currentSegments = segments.length;
    const trailIndex = Math.min(5 + (currentSegments * 5), trail.length - 1);
    const attachPosition = trail[trailIndex] || trail[trail.length - 1] || headPosition;
    const targetX = attachPosition.x;
    const targetY = attachPosition.y;
    
    // Create visual element
    const visualEl = document.createElement("div");
    visualEl.className = "snake-body-segment test-segment";
    visualEl.setAttribute("data-snake-segment", testElementId);
    visualEl.setAttribute("data-segment-index", currentSegments.toString());
    visualEl.style.cssText = `
      position: fixed !important;
      left: ${targetX}px !important;
      top: ${targetY}px !important;
      width: ${SEGMENT_SIZE}px !important;
      height: ${SEGMENT_SIZE}px !important;
      background: linear-gradient(135deg, ${color} 70%, var(--color-primary) 30%) !important;
      border: 2px solid black !important;
      border-radius: 3px !important;
      opacity: 0.9 !important;
      z-index: 9999 !important;
      pointer-events: none !important;
      background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 2px, transparent 3px) !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2) !important;
      transition: none !important;
    `;
    document.body.appendChild(visualEl);
    
    const newSegment: SnakeSegment = {
      id: `test-segment-${Date.now()}-${segmentCounterRef.current++}`,
      elementId: testElementId,
      element: visualEl,
      currentPosition: { x: targetX, y: targetY },
      targetPosition: { x: targetX, y: targetY },
      offset: currentSegments + 1,
    };
    
    setSegments((prev) => [...prev, newSegment]);
    setScore((prev) => prev + 20);
    console.log(`✅ Test segment added. Total segments: ${segments.length + 1}`);
  }, [segments, trail, headPosition]);

  // Handle keyboard input for arrow key mode and test shortcuts
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
        return;
      }

      // Test mode shortcuts (work even during game over)
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        if (!gameOver) {
          addTestSegment();
        }
        return;
      }
      
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        // Clean up all segments
        document.querySelectorAll('[data-snake-segment]').forEach((el) => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
        setSegments([]);
        setScore(0);
        eatenElementsRef.current.clear();
        segmentCounterRef.current = 0;
        console.log("🔄 Segments reset");
        return;
      }
      
      if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        setDebugVisible((prev) => !prev);
        console.log("🔍 Debug overlay:", !debugVisible);
        return;
      }
      
      // Collision debug system shortcuts
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setDebugMode((prev) => {
          const newValue = !prev;
          console.log("🎮 Debug mode:", newValue ? "ON" : "OFF");
          return newValue;
        });
        return;
      }
      
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setCollisionEnabled((prev) => {
          const newValue = !prev;
          console.log("🎮 Collision detection:", newValue ? "ENABLED" : "DISABLED");
          return newValue;
        });
        return;
      }
      
      // Pause/unpause game
      if (e.key === "Escape" && !gameOver) {
        e.preventDefault();
        setIsPaused((prev) => {
          const newValue = !prev;
          console.log("🎮 Game:", newValue ? "PAUSED" : "UNPAUSED");
          return newValue;
        });
        // Don't close game when pausing, just toggle pause
        return;
      }

      if (gameOver) return;
      
      // Arrow key mode handling
      if (mode !== "arrow") return;

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
  }, [isPlaying, mode, gameOver, onClose, addTestSegment, debugVisible]);

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
    // Calculate target position from trail (attach to nearest trail position)
    const trailIndex = Math.min(5 + (currentSegments * 5), trail.length - 1);
    const attachPosition = trail[trailIndex] || trail[trail.length - 1] || headPosition;
    const targetX = attachPosition.x;
    const targetY = attachPosition.y;

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
    if (!headRef.current || gameOver || isPaused) return;

    // Store previous position BEFORE movement (for continuous collision detection)
    prevHeadPositionRef.current = { ...headPosition };

    let newX = headPosition.x;
    let newY = headPosition.y;
    let moveX = 0;
    let moveY = 0;

    if (mode === "mouse") {
      // Smoothly move head toward mouse
      const targetX = mousePositionRef.current.x;
      const targetY = mousePositionRef.current.y;
      
      const dx = targetX - headPosition.x;
      const dy = targetY - headPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 1) {
        moveX = (dx / distance) * MOVEMENT_SPEED;
        moveY = (dy / distance) * MOVEMENT_SPEED;
        
        // Cap maximum movement per frame to prevent extreme tunneling
        const moveDistance = Math.sqrt(moveX * moveX + moveY * moveY);
        if (moveDistance > MAX_SPEED_PER_FRAME) {
          const scale = MAX_SPEED_PER_FRAME / moveDistance;
          moveX *= scale;
          moveY *= scale;
        }
        
        newX = headPosition.x + moveX;
        newY = headPosition.y + moveY;
      }
    } else if (mode === "arrow") {
      // Move head based on arrow key direction
      moveX = keyDirectionRef.current.x * MOVEMENT_SPEED;
      moveY = keyDirectionRef.current.y * MOVEMENT_SPEED;
      
      // Cap maximum movement per frame
      const moveDistance = Math.sqrt(moveX * moveX + moveY * moveY);
      if (moveDistance > MAX_SPEED_PER_FRAME) {
        const scale = MAX_SPEED_PER_FRAME / moveDistance;
        moveX *= scale;
        moveY *= scale;
      }
      
      newX = headPosition.x + moveX;
      newY = headPosition.y + moveY;

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

  // Monitor score changes - DEBUG for 80-point bug
  useEffect(() => {
    if (score === 80) {
      console.log("🧨 === SCORE 80 REACHED - FULL STATE DUMP ===");
      console.log("Score:", score);
      console.log("Segments:", segments.length);
      console.log("Game Over:", gameOver);
      console.log("Is Playing:", isPlaying);
      console.log("Trail length:", trail.length);
      console.log("Head position:", headPosition);
      console.log("Game Over Reason:", gameOverReason);
      
      // Check for any hidden state or storage
      console.log("localStorage check:", {
        snakeScore: localStorage.getItem("snakeScore"),
        snakeHighScore: localStorage.getItem("snakeHighScore"),
        achievements: localStorage.getItem("portfolio-achievements"),
      });
      
      // Check window state
      console.log("window.gameState:", (window as any).gameState);
      
      // Dump all segment positions
      segments.forEach((seg, i) => {
        console.log(`Segment ${i}:`, {
          position: seg.currentPosition,
          element: seg.element?.getBoundingClientRect(),
        });
      });
      
      console.log("🧨 === END STATE DUMP ===");
    }
  }, [score, gameOver, segments, trail, headPosition, gameOverReason, isPlaying]);

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

  // Calculate closest segment for debug display
  const calculateClosestSegment = useCallback(() => {
    if (!headRef.current || segments.length < 1) {
      setClosestSegment(null);
      setCollisionStatus("SAFE");
      return;
    }

    const headRect = headRef.current.getBoundingClientRect();
    const headPos = { x: headRect.left + headRect.width / 2, y: headRect.top + headRect.height / 2 };
    
    let closestIndex = -1;
    let closestDistance = Infinity;
    let collisionDetected = false;
    
    // Find closest segment
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      if (!segment.element || !document.contains(segment.element)) continue;
      
      const segmentRect = segment.element.getBoundingClientRect();
      const segmentPos = { 
        x: segmentRect.left + segmentRect.width / 2, 
        y: segmentRect.top + segmentRect.height / 2 
      };
      
      const distance = Math.sqrt(
        Math.pow(headPos.x - segmentPos.x, 2) + 
        Math.pow(headPos.y - segmentPos.y, 2)
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
      
      // Check for actual collision
      if (distance < 20) {
        collisionDetected = true;
      }
    }
    
    // Update state
    if (closestIndex >= 0) {
      setClosestSegment({ index: closestIndex, distance: closestDistance });
      
      // Determine collision status
      if (collisionDetected) {
        setCollisionStatus("COLLISION");
      } else if (closestDistance < 40) {
        setCollisionStatus("CLOSE");
      } else {
        setCollisionStatus("SAFE");
      }
    } else {
      setClosestSegment(null);
      setCollisionStatus("SAFE");
    }
  }, [segments]);

  // Main game loop
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const gameLoop = () => {
      updateHeadPosition();
      
      // Calculate closest segment for debug (always, even if collision disabled)
      if (debugMode) {
        calculateClosestSegment();
      }
      
      // Check for self-collision - BOTH discrete and continuous
      if (collisionEnabled && headRef.current && segments.length >= 1) {
        const headRect = headRef.current.getBoundingClientRect();
        const headPos = { x: headRect.left + headRect.width / 2, y: headRect.top + headRect.height / 2 };
        
        // 1. DISCRETE COLLISION CHECK (point-to-point at current position)
        let discreteCollision = false;
        let collisionSegment = -1;
        let collisionDistance = Infinity;
        
        for (let i = 1; i < segments.length; i++) {
          const segment = segments[i];
          if (!segment.element || !document.contains(segment.element)) continue;
          
          const segmentRect = segment.element.getBoundingClientRect();
          const segmentPos = { 
            x: segmentRect.left + segmentRect.width / 2, 
            y: segmentRect.top + segmentRect.height / 2 
          };
          
          // Calculate distance between centers
          const distance = Math.sqrt(
            Math.pow(headPos.x - segmentPos.x, 2) + 
            Math.pow(headPos.y - segmentPos.y, 2)
          );
          
          // Collision if distance is less than combined radii (20px threshold)
          if (distance < 20) {
            discreteCollision = true;
            collisionSegment = i;
            collisionDistance = distance;
            break;
          }
        }

        // 2. CONTINUOUS COLLISION CHECK (line-to-circle along movement path)
        const continuousCollision = checkContinuousCollision();
        
        // Use whichever detected collision first
        if (discreteCollision || continuousCollision.detected) {
          const isContinuous = continuousCollision.detected && !discreteCollision;
          const finalSegment = isContinuous ? continuousCollision.segmentIndex : collisionSegment;
          const finalDistance = isContinuous ? continuousCollision.distance : collisionDistance;
          
          console.log("🚨 === COLLISION DETECTED ===");
          console.log(`Type: ${isContinuous ? "CONTINUOUS (tunneling prevented)" : "DISCRETE"}`);
          console.log("Collision Details:", {
            score,
            segments: segments.length,
            collisionSegment: finalSegment,
            collisionDistance: finalDistance.toFixed(2) + "px",
            headPosition: headPos,
            segmentPosition: segments[finalSegment]?.currentPosition,
            threshold: "20px",
            movementPath: isContinuous ? {
              from: prevHeadPositionRef.current,
              to: headPosition,
            } : "N/A",
          });
          console.log("All segment positions:", segments.map((s, idx) => ({
            index: idx,
            position: s.currentPosition,
            elementId: s.elementId,
          })));
          
          soundManager.error();
          setGameOverReason(
            `${isContinuous ? "Continuous" : "Discrete"} collision with segment ${finalSegment} (distance: ${finalDistance.toFixed(1)}px)`
          );
          setGameOver(true);
          if (onGameOver) {
            console.log("📞 Calling onGameOver callback with score:", score);
            onGameOver(score);
          }
          return;
        }
      }
      
      // Debug logging every 60 frames (once per second at 60fps)
      if (animationFrameRef.current && animationFrameRef.current % 60 === 0) {
        console.log("🐍 Game state:", {
          score,
          segments: segments.length,
          trailLength: trail.length,
          headPosition,
          gameOver: false
        });
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, gameOver, isPaused, updateHeadPosition, segments, checkCollision, score, onGameOver, collisionEnabled, debugMode, calculateClosestSegment, checkContinuousCollision]);

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
      style={{ 
        overflow: "hidden",
        backgroundColor: "transparent", // Ensure transparent background
      }}
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
          backgroundColor: "#00ffff", // Cyan - explicit color for visibility
          border: "3px solid #000000", // Black border
          borderRadius: "4px",
          boxShadow: 
            "0 0 20px #00ffff, " +
            "inset 4px 4px 0 0 rgba(255,255,255,0.5), " +
            "inset -4px -4px 0 0 rgba(255,255,255,0.5), " +
            "0 2px 4px rgba(0,0,0,0.5)",
          transition: "none", // No transition for smooth movement
          display: "block", // Ensure it's visible
          opacity: 1, // Ensure full opacity
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

      {/* Debug Canvas for visual collision overlays */}
      {debugMode && (
        <canvas
          ref={debugCanvasRef}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9997]"
          style={{ zIndex: 9997 }}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}

      {/* Visual Debug Drawing */}
      {debugMode && (
        <CollisionDebugOverlay
          headRef={headRef}
          segments={segments}
          closestSegment={closestSegment}
          collisionStatus={collisionStatus}
          canvasRef={debugCanvasRef}
        />
      )}

      {/* Collision Monitor HUD */}
      {debugMode && (
        <div className="fixed top-4 right-4 bg-black/95 text-white p-4 rounded z-[10001] font-pixel text-[9px] border-2 border-green-500">
          <div className="space-y-2">
            <div className="text-green-400 font-bold border-b border-green-500 pb-1 mb-2">
              COLLISION DEBUG
            </div>
            <div>
              <div className="text-gray-400">Status:</div>
              <div className={`font-bold ${
                collisionStatus === "COLLISION" ? "text-red-400" :
                collisionStatus === "CLOSE" ? "text-yellow-400" :
                "text-green-400"
              }`}>
                {collisionStatus}
              </div>
            </div>
            {closestSegment && (
              <div>
                <div className="text-gray-400">Closest Segment:</div>
                <div className="text-white">#{closestSegment.index}</div>
                <div className="text-gray-400">Distance:</div>
                <div className="text-white">{closestSegment.distance.toFixed(1)}px</div>
              </div>
            )}
            <div className="pt-2 border-t border-gray-700">
              <div className="text-gray-400">Segments:</div>
              <div className="text-white">{segments.length}</div>
            </div>
            <div>
              <div className="text-gray-400">Collision:</div>
              <div className={collisionEnabled ? "text-green-400" : "text-red-400"}>
                {collisionEnabled ? "ENABLED" : "DISABLED"}
              </div>
            </div>
            {isPaused && (
              <div className="text-yellow-400 font-bold">
                PAUSED
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug: Enhanced debug overlay */}
      {debugVisible && (
        <div className="fixed top-4 left-4 bg-black/90 text-white p-3 rounded z-[10001] font-pixel text-[8px] border-2 border-white">
          <div className="space-y-1">
            <div className="text-green-400 font-bold">DEBUG MODE</div>
            <div>Segments: {segments.length}</div>
            <div>Trail length: {trail.length}</div>
            <div className={score >= 80 ? "text-red-400 font-bold" : ""}>
              Score: {score} {score === 80 && "🚨 AT 80!"}
            </div>
            <div>Head: ({Math.round(headPosition.x)}, {Math.round(headPosition.y)})</div>
            <div>Game Over: {gameOver ? "YES ❌" : "NO ✅"}</div>
            {gameOver && (
              <div className="text-red-400 mt-2">
                GAME OVER
                <br />
                Reason: {gameOverReason}
              </div>
            )}
            <div className="mt-3 pt-2 border-t border-white/30 text-green-300 text-[7px]">
              <div>T = Add segment</div>
              <div>R = Reset</div>
              <div>I = Toggle debug</div>
              <div>D = Collision debug</div>
              <div>C = Toggle collision</div>
              <div>ESC = {isPaused ? "Unpause" : "Pause/Exit"}</div>
            </div>
            {score >= 80 && !gameOver && (
              <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-500 text-yellow-300 text-[7px]">
                ⚠️ Score at/above 80 but game NOT over
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Test button for 80-point bug */}
      {import.meta.env.DEV && !gameOver && (
        <button
          onClick={() => {
            console.log("🧪 TEST: Setting score to 79, then 80");
            setScore(79);
            setTimeout(() => {
              console.log("🧪 TEST: Setting score to 80");
              setScore(80);
              // Check if game over triggered
              setTimeout(() => {
                console.log("🧪 TEST: After 1 second, gameOver =", gameOver);
              }, 1000);
            }, 1000);
          }}
          className="fixed bottom-24 right-4 z-[10001] bg-purple-600 hover:bg-purple-700 text-white p-2 rounded font-pixel text-[8px] border-2 border-purple-400"
        >
          🧪 Test 80 Bug
        </button>
      )}
      
      {/* Force continue button if game over at 80 */}
      {gameOver && score >= 80 && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/95">
          <div className="bg-black border-2 border-red-500 p-6 rounded-lg max-w-md font-pixel text-white">
            <h2 className="text-xl text-red-400 mb-4">⚠️ DEBUG: Game Over at {score} Points</h2>
            <p className="text-sm mb-4">Reason: {gameOverReason}</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  console.log("🔧 FORCE CONTINUE: Resetting game over");
                  setGameOver(false);
                  setGameOverReason("force-continue");
                  setScore(79); // Reset to 79
                }}
                className="w-full p-3 bg-green-600 hover:bg-green-700 rounded font-pixel text-xs"
              >
                Continue Anyway (Reset to 79)
              </button>
              <button
                onClick={() => {
                  console.log("🔧 FORCE CONTINUE: Keeping score at 80");
                  setGameOver(false);
                  setGameOverReason("force-continue-keep-score");
                }}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded font-pixel text-xs"
              >
                Continue & Keep Score at {score}
              </button>
              {onClose && (
                <button
                  onClick={() => {
                    soundManager.click();
                    onClose();
                  }}
                  className="w-full p-3 bg-gray-600 hover:bg-gray-700 rounded font-pixel text-xs"
                >
                  Exit Game
                </button>
              )}
            </div>
          </div>
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
                  setGameOverReason("unknown");
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
          // Reset debug state
          setIsPaused(false);
          setDebugMode(false);
          setCollisionEnabled(true);
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
            {debugMode && (
              <span className="block mt-1 text-green-400">
                DEBUG: D=Toggle • C=Collision • ESC=Pause
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
