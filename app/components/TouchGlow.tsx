import { useState, useEffect, useRef } from "react";

interface TouchGlowProps {
  className?: string;
  children?: React.ReactNode;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  color: string;
  isVisible: boolean;
}

const TOUCH_COLORS = [
  "from-blue-500 to-blue-600",
  "from-cyan-500 to-cyan-600",
  "from-green-500 to-green-600",
  "from-yellow-500 to-yellow-600",
  "from-red-500 to-red-600",
  "from-indigo-500 to-indigo-600",
  "from-emerald-500 to-emerald-600",
  "from-rose-500 to-rose-600",
  "from-violet-500 to-violet-600",
  "from-amber-500 to-amber-600",
];

export function TouchGlow({ className = "", children }: TouchGlowProps) {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseVisible, setIsMouseVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to get random color
  const getRandomColor = () => {
    return TOUCH_COLORS[Math.floor(Math.random() * TOUCH_COLORS.length)];
  };

  // Helper function to start 5-second timeout
  const startTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setTouchPoints((prev) => {
        if (prev.length > 1) {
          // Randomly pick one finger to keep visible
          const randomIndex = Math.floor(Math.random() * prev.length);
          return prev.map((point, index) => ({
            ...point,
            isVisible: index === randomIndex,
          }));
        }
        return prev;
      });
    }, 5000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const newTouchPoints: TouchPoint[] = [];

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        newTouchPoints.push({
          id: touch.identifier,
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          color: getRandomColor(),
          isVisible: true,
        });
      }

      setTouchPoints(newTouchPoints);

      // Start timeout if more than one finger
      if (newTouchPoints.length > 1) {
        startTimeout();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();

      setTouchPoints((prev) => {
        const updatedPoints = [...prev];

        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          const pointIndex = updatedPoints.findIndex(
            (p) => p.id === touch.identifier
          );

          if (pointIndex !== -1) {
            updatedPoints[pointIndex] = {
              ...updatedPoints[pointIndex],
              x: touch.clientX - rect.left,
              y: touch.clientY - rect.top,
            };
          }
        }

        return updatedPoints;
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();

      setTouchPoints((prev) => {
        const remainingTouchIds = Array.from(e.touches).map(
          (t) => t.identifier
        );
        return prev.filter((point) => remainingTouchIds.includes(point.id));
      });

      // Clear timeout if no more touches
      if (e.touches.length <= 1) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsMouseVisible(true);
    };

    const handleMouseEnter = () => {
      setIsMouseVisible(true);
    };

    const handleMouseLeave = () => {
      setIsMouseVisible(false);
    };

    // Add event listeners
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);

      // Clear timeout on cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Render touch points */}
      {touchPoints.map((point) => (
        <div
          key={point.id}
          className={`absolute pointer-events-none transition-opacity duration-200 ${
            point.isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: point.x - 50,
            top: point.y - 50,
            transform: "translateZ(0)", // Hardware acceleration
          }}
        >
          {/* Solid white line circle */}
          <div className="absolute w-20 h-20 rounded-full border-2 border-white opacity-90" />

          {/* Outer solid glow ring */}
          <div
            className={`absolute w-20 h-20 rounded-full bg-gradient-to-r ${point.color} opacity-80 blur-sm touch-glow-outer`}
          />
        </div>
      ))}

      {/* Mouse cursor glow */}
      <div
        className={`absolute pointer-events-none transition-opacity duration-200 ${
          isMouseVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
          transform: "translateZ(0)", // Hardware acceleration
        }}
      >
        {/* Solid white line circle */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-white opacity-90" />

        {/* Outer solid glow ring */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-80 blur-sm touch-glow-outer" />

        {/* Middle solid glow ring */}
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 opacity-90 blur-xs touch-glow-middle" />

        {/* Inner solid core */}
        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-100 touch-glow-inner" />

        {/* Central bright dot */}
        <div className="absolute w-4 h-4 rounded-full bg-white opacity-100 touch-glow-core" />
      </div>

      {/* Render children */}
      {children}
    </div>
  );
}
