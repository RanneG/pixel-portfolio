import { useEffect, useState, useRef, useCallback } from "react";
import { debounce } from "../utils/debounce";

export interface SnakeFoodItem {
  id: string;
  x: number;
  y: number;
  element: HTMLElement;
}

interface UseSnakeFoodMapperOptions {
  debug?: boolean;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  gridSize?: number;
  cellSize?: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 30;

/**
 * Custom hook that maps DOM elements with data-snake-food="true" to grid coordinates
 * and provides debug visualization when enabled
 */
export function useSnakeFoodMapper(
  isActive: boolean = true,
  options: UseSnakeFoodMapperOptions = {}
): SnakeFoodItem[] {
  const { debug = false, canvasRef, gridSize = GRID_SIZE, cellSize = CELL_SIZE } = options;
  const [foodItems, setFoodItems] = useState<SnakeFoodItem[]>([]);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Check if an element is visible
   */
  const isElementVisible = (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);
    
    // Check display
    if (style.display === "none") {
      return false;
    }
    
    // Check opacity
    if (parseFloat(style.opacity) === 0) {
      return false;
    }
    
    // Check visibility
    if (style.visibility === "hidden") {
      return false;
    }
    
    // Check if element has dimensions
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }
    
    return true;
  };

  /**
   * Get center position of an element
   */
  const getElementCenter = (element: HTMLElement): { x: number; y: number } => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  /**
   * Map viewport coordinates to grid coordinates
   * Note: Canvas might be centered, so we need to map relative to canvas position
   */
  const mapToGrid = useCallback(
    (viewportX: number, viewportY: number): { x: number; y: number } => {
      // Get canvas position if available
      let canvasX = 0;
      let canvasY = 0;
      let canvasWidth = window.innerWidth;
      let canvasHeight = window.innerHeight;

      if (canvasRef?.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        canvasX = canvasRect.left;
        canvasY = canvasRect.top;
        canvasWidth = canvasRect.width;
        canvasHeight = canvasRect.height;
      }

      // Map relative to canvas position and size
      const relativeX = viewportX - canvasX;
      const relativeY = viewportY - canvasY;
      
      const gridX = Math.floor((relativeX / canvasWidth) * gridSize);
      const gridY = Math.floor((relativeY / canvasHeight) * gridSize);
      
      // Clamp to grid bounds
      return {
        x: Math.max(0, Math.min(gridSize - 1, gridX)),
        y: Math.max(0, Math.min(gridSize - 1, gridY)),
      };
    },
    [gridSize, canvasRef]
  );

  /**
   * Find and map all snake food elements
   */
  const mapFoodElements = useCallback(() => {
    if (!isActive) {
      setFoodItems([]);
      return;
    }

    const elements = document.querySelectorAll<HTMLElement>('[data-snake-food="true"]');
    const mapped: SnakeFoodItem[] = [];

    // Get canvas dimensions for logging
    let canvasRect = null;
    if (canvasRef?.current) {
      canvasRect = canvasRef.current.getBoundingClientRect();
    }

    if (debug) {
      console.log("🐍 === SNAKE FOOD MAPPER DEBUG ===");
      console.log(`Window: ${window.innerWidth}x${window.innerHeight}`);
      if (canvasRect) {
        console.log(`Canvas: ${canvasRect.width}x${canvasRect.height} at (${canvasRect.left}, ${canvasRect.top})`);
      }
      console.log(`Grid: ${gridSize}x${gridSize} cells, ${cellSize}px per cell`);
    }

    elements.forEach((element) => {
      if (!isElementVisible(element)) {
        return;
      }

      const foodId = element.getAttribute("data-food-id");
      if (!foodId) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const center = getElementCenter(element);
      const gridPos = mapToGrid(center.x, center.y);

      if (debug) {
        console.log(`\n📦 Element: ${foodId}`);
        console.log(`  getBoundingClientRect():`, {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        });
        console.log(`  Center: (${center.x.toFixed(2)}, ${center.y.toFixed(2)})`);
        console.log(`  Mapped to grid: (${gridPos.x}, ${gridPos.y})`);
        if (canvasRect) {
          const relativeX = center.x - canvasRect.left;
          const relativeY = center.y - canvasRect.top;
          console.log(`  Relative to canvas: (${relativeX.toFixed(2)}, ${relativeY.toFixed(2)})`);
        }
      }

      mapped.push({
        id: foodId,
        x: gridPos.x,
        y: gridPos.y,
        element,
      });
    });

    setFoodItems(mapped);

    if (debug) {
      console.log(`\n✅ Total mapped: ${mapped.length} elements`);
      console.log("🐍 === END DEBUG ===\n");
    }
  }, [isActive, mapToGrid, debug, gridSize, cellSize, canvasRef]);

  /**
   * Draw debug visualization on canvas
   * This function is called after the game draws each frame
   */
  const drawDebugVisualization = useCallback(() => {
    if (!debug || !canvasRef?.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Always draw grid lines and numbers in debug mode
    ctx.strokeStyle = "rgba(100, 100, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(200, 200, 255, 0.7)";
    ctx.font = "8px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Draw grid lines
    for (let i = 0; i <= gridSize; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Number each grid cell
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cellX = x * cellSize + cellSize / 2;
        const cellY = y * cellSize + cellSize / 2;
        
        // Draw cell coordinates
        const coordText = `${x},${y}`;
        ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
        ctx.font = "6px 'Press Start 2P', monospace";
        ctx.fillText(coordText, cellX, cellY);
      }
    }

    // Draw food element positions with red dots at exact mapped coordinates
    foodItems.forEach((item, index) => {
      const x = item.x * cellSize;
      const y = item.y * cellSize;

      // Draw semi-transparent rectangle at grid position
      const colors = [
        "rgba(0, 255, 255, 0.3)", // Cyan
        "rgba(255, 0, 255, 0.3)", // Magenta
        "rgba(255, 255, 0, 0.3)", // Yellow
        "rgba(0, 255, 0, 0.3)",   // Green
      ];
      const color = colors[index % colors.length];

      ctx.fillStyle = color;
      ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

      // Draw border
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

      // Draw RED DOT at exact mapped coordinate (center of cell)
      const dotX = x + cellSize / 2;
      const dotY = y + cellSize / 2;
      ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw red circle around dot
      ctx.strokeStyle = "rgba(255, 0, 0, 1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Draw ID label
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(
        item.id.substring(0, 6),
        dotX,
        y + cellSize + 2
      );
    });
  }, [debug, canvasRef, gridSize, cellSize, foodItems]);

  // Initial mapping
  useEffect(() => {
    mapFoodElements();
  }, [mapFoodElements]);

  // Handle window resize with debounce
  useEffect(() => {
    const debouncedMap = debounce(mapFoodElements, 250);

    const handleResize = () => {
      debouncedMap();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [mapFoodElements]);

  // Debug mode: Toggle grid overlay with 'G' key
  useEffect(() => {
    if (!debug) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setShowGridOverlay((prev) => !prev);
        console.log(`🐍 Grid overlay: ${!showGridOverlay ? "ON" : "OFF"}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [debug, showGridOverlay]);

  // Expose drawDebugVisualization for manual calls from game component
  useEffect(() => {
    if (debug && canvasRef?.current) {
      // Store the draw function on the canvas element for external access
      (canvasRef.current as any).__drawDebug = drawDebugVisualization;
    } else if (canvasRef?.current) {
      // Clean up when debug is disabled
      delete (canvasRef.current as any).__drawDebug;
    }
  }, [debug, canvasRef, drawDebugVisualization]);

  return foodItems;
}

