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

const TIME_TO_PICK = 2000;

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
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      setTouchPoints((prevMap) => {
        let map = new Map(prevMap);
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];

          map.set(touch.identifier, {
            id: touch.identifier,
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
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
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      setTouchPoints((prevMap) => {
        const map = new Map(prevMap);
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          const prevTouch = map.get(touch.identifier);

          if (prevTouch) {
            prevTouch.x = touch.clientX - rect.left;
            prevTouch.y = touch.clientY - rect.top;
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
            className="absolute pointer-events-none"
            style={{
              left: point.x,
              top: point.y,
              transform: "translate(-50%, -50%) translateZ(0)",
            }}
          >
            {/* Ripple wave 1 */}
            <div
              className="absolute w-40 h-40 rounded-full border-2 ripple-ping"
              style={{
                animationDuration: "2s",
                left: "50%",
                top: "50%",
                borderColor: point.color.includes("red")
                  ? "rgba(239, 68, 68, 0.3)"
                  : point.color.includes("amber")
                    ? "rgba(245, 158, 11, 0.3)"
                    : point.color.includes("yellow")
                      ? "rgba(234, 179, 8, 0.3)"
                      : point.color.includes("green")
                        ? "rgba(34, 197, 94, 0.3)"
                        : point.color.includes("cyan")
                          ? "rgba(6, 182, 212, 0.3)"
                          : point.color.includes("blue")
                            ? "rgba(59, 130, 246, 0.3)"
                            : point.color.includes("indigo")
                              ? "rgba(99, 102, 241, 0.3)"
                              : "rgba(236, 72, 153, 0.3)",
              }}
            />

            {/* Ripple wave 2 */}
            <div
              className="absolute w-32 h-32 rounded-full border-2 ripple-ping"
              style={{
                animationDuration: "1.5s",
                animationDelay: "0.3s",
                left: "50%",
                top: "50%",
                borderColor: point.color.includes("red")
                  ? "rgba(239, 68, 68, 0.5)"
                  : point.color.includes("amber")
                    ? "rgba(245, 158, 11, 0.5)"
                    : point.color.includes("yellow")
                      ? "rgba(234, 179, 8, 0.5)"
                      : point.color.includes("green")
                        ? "rgba(34, 197, 94, 0.5)"
                        : point.color.includes("cyan")
                          ? "rgba(6, 182, 212, 0.5)"
                          : point.color.includes("blue")
                            ? "rgba(59, 130, 246, 0.5)"
                            : point.color.includes("indigo")
                              ? "rgba(99, 102, 241, 0.5)"
                              : "rgba(236, 72, 153, 0.5)",
              }}
            />

            {/* Main glow */}
            <div
              className={`absolute w-24 h-24 rounded-full bg-gradient-to-r ${point.color} opacity-80 blur-md shadow-2xl`}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* White border */}
            {/* <div
              className="absolute w-20 h-20 rounded-full border-2 border-white shadow-lg"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            /> */}

            {/* Inner core */}
            <div
              className={`absolute w-10 h-10 rounded-full bg-gradient-to-r ${point.color} opacity-100`}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
