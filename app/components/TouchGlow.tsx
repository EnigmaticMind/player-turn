import { useState, useEffect, useRef } from "react";

import ching from "./cha-ching.mp3";
import success from "./success.mp3";
import ProgressBar from "./ProgressBar";

interface TouchGlowProps {
  className?: string;
  children?: () => React.ReactNode;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  color: string;
}

const TIME_TO_SHOW_CHOSEN = 4000;

const TIME_TO_PICK = 3000;

const TOUCH_COLORS = [
  "from-red-500 to-red-600",
  "from-amber-500 to-amber-600",
  "from-yellow-500 to-yellow-600",
  "from-green-500 to-green-600",
  "from-cyan-500 to-cyan-600",
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-pink-500 to-pink-600",
];

export function TouchGlow({ className = "", children }: TouchGlowProps) {
  const [touchPoints, setTouchPoints] = useState<Map<number, TouchPoint>>(
    new Map()
  );

  const [showProgress, setShowProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutFreezeRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to get unique color
  const getUniqueColor = (touches: Map<number, TouchPoint>) => {
    const usedColor: Map<string, string> = new Map();

    touches.forEach((touch) => {
      usedColor.set(touch.color, touch.color);
    });

    const availableColors = TOUCH_COLORS.filter(
      (color) => !usedColor.has(color)
    );

    if (availableColors.length > 0) {
      return availableColors[
        Math.floor(Math.random() * availableColors.length)
      ];
    }

    // If all colors are used, return a random one
    return TOUCH_COLORS[Math.floor(Math.random() * TOUCH_COLORS.length)];
  };

  // Helper function for chosen color time
  const showChosenColor = () => {
    new Audio(ching).play();
    // Stop listening to events, freezing app for a few seconds.
    removeEventListeners();

    setShowProgress(0);

    setTouchPoints((prevMap) => {
      const map = new Map(prevMap);
      // Randomly pick one finger to keep visible
      if (map.size > 1) {
        map.keys;
        const randomIndex = Math.floor(Math.random() * map.size);
        const keysArray = Array.from(map.keys());
        const chosenKey = keysArray[randomIndex];

        map.forEach((point, key) => {
          if (key !== chosenKey) {
            map.delete(key);
          }
        });
      }
      return map;
    });

    timeoutFreezeRef.current = setTimeout(() => {
      setTouchPoints(new Map());
      addEventListeners();
    }, TIME_TO_SHOW_CHOSEN);
  };

  // Helper function to start timer
  const startTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowProgress((prev) => prev + 1);

    timeoutRef.current = setTimeout(showChosenColor, TIME_TO_PICK);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.changedTouches.length > 0) {
      setTouchPoints((prevMap) => {
        let map = new Map(prevMap);
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];

          map.set(touch.identifier, {
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY,
            color: getUniqueColor(map),
          });
        }
        return map;
      });

      if (e.touches.length > 0) {
        startTimeout();
      }

      new Audio(success).play();
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.changedTouches.length > 0) {
      setTouchPoints((prevMap) => {
        const map = new Map(prevMap);
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          const prevTouch = map.get(touch.identifier);

          if (prevTouch) {
            prevTouch.x = touch.clientX;
            prevTouch.y = touch.clientY;
            map.set(touch.identifier, prevTouch);
          }
        }

        return map;
      });
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    setTouchPoints((prevMap) => {
      const map = new Map(prevMap);

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        map.delete(touch.identifier);
      }

      if (map.size === 0 && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return map;
    });
  };

  const addEventListeners = () => {
    const container = containerRef.current;
    if (!container) return;

    // Add event listeners
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
  };

  const removeEventListeners = () => {
    const container = containerRef.current;
    if (!container) return;

    container.removeEventListener("touchstart", handleTouchStart);
    container.removeEventListener("touchmove", handleTouchMove);
    container.removeEventListener("touchend", handleTouchEnd);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    addEventListeners();

    return () => {
      removeEventListeners();

      // Clear timeouts on cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (timeoutFreezeRef.current) {
        clearTimeout(timeoutFreezeRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ touchAction: "none" }}
    >
      {showProgress > 0 && touchPoints.size > 0 ? (
        <ProgressBar key={showProgress} />
      ) : null}

      {/* Render touch points */}
      {Array.from(touchPoints.entries()).map((tp) => {
        const [key, point] = tp;

        return (
          <div
            key={key}
            className={`absolute pointer-events-none transition-opacity duration-200`}
            style={{
              left: point.x - 90,
              top: point.y - 90,
              transform: "translateZ(0)", // Hardware acceleration
            }}
          >
            {/* Solid white line circle */}
            <div
              className="absolute w-38 h-38 rounded-full border-4 border-white
          "
            />
            {/* Outer solid glow ring */}
            <div
              className={`absolute w-38 h-38 rounded-full bg-gradient-to-r ${point.color} opacity-80 blur-sm touch-glow-outer`}
            />
          </div>
        );
      })}
    </div>
  );
}
