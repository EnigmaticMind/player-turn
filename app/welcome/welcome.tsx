import { useEffect, useRef, useState } from "react";
import { TouchGlow } from "../components/TouchGlow";

function isMobileDevice() {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(navigator.userAgent);
}

export function Welcome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  const startEvent = () => {
    setStart(true);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("click", startEvent);

    return () => {
      container.removeEventListener("click", startEvent);
    };
  }, []);
  return (
    <div ref={containerRef}>
      {start ? (
        <TouchGlow className="min-h-screen w-full"></TouchGlow>
      ) : (
        <main className="flex items-center justify-center pt-16 pb-4 min-h-screen">
          {isMobileDevice() ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                Tap the screen to begin
              </h1>
              <p className="text-md text-gray-200">
                After a few moments, one finger will be chosen at random.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                Please open this on a mobile device.
              </h1>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
