import { useEffect, useRef, useState } from "react";
import { TouchGlow } from "../components/TouchGlow";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function Welcome() {
  const [start, setStart] = useState(false);

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Check if app is already installed and listen for install prompt
  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const checkIfInstalled = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://")
      );
    };

    if (checkIfInstalled()) {
      setIsInstalled(true);
    }

    // Listen for install prompt (Chrome/Edge/Opera)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      // Fallback: show instructions for manual installation
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isIOS) {
        alert(
          "To install on iOS:\n\n" +
            "1. Tap the Share button (square with arrow)\n" +
            '2. Scroll down and tap "Add to Home Screen"\n' +
            '3. Tap "Add"'
        );
      } else if (isAndroid) {
        alert(
          "To install on Android:\n\n" +
            "1. Tap the Menu (⋮) in your browser\n" +
            '2. Tap "Add to Home screen" or "Install app"\n' +
            '3. Tap "Add" or "Install"'
        );
      } else {
        alert(
          "To install this app:\n\n" +
            "Look for the install button in your browser's address bar,\n" +
            'or use your browser\'s menu to find "Install" or "Add to Home Screen"'
        );
      }
      return;
    }

    try {
      // Show the install prompt
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        setInstallPrompt(null);
        setIsInstalled(true);
      } else {
        // User dismissed the prompt, keep the button available
        // The installPrompt will remain available for future attempts
      }
    } catch (error) {
      console.error("Error showing install prompt:", error);
      // If prompt fails, show manual instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isIOS) {
        alert(
          "To install on iOS:\n\n" +
            "1. Tap the Share button (square with arrow)\n" +
            '2. Scroll down and tap "Add to Home Screen"\n' +
            '3. Tap "Add"'
        );
      } else if (isAndroid) {
        alert(
          "To install on Android:\n\n" +
            "1. Tap the Menu (⋮) in your browser\n" +
            '2. Tap "Add to Home screen" or "Install app"\n' +
            '3. Tap "Add" or "Install"'
        );
      }
    }
  };

  const handleStartClick = () => {
    setStart(true);
  };

  if (start) {
    return <TouchGlow className="min-h-screen w-full" />;
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center px-6 max-w-md">
        <h1 className="text-5xl font-bold text-white mb-3">Player Turn</h1>
        <p className="text-lg text-gray-300 mb-8">
          Have each player touch the screen. After a few moments, one finger
          will be chosen at random.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleStartClick}
            className="px-8 py-4 bg-white text-black font-semibold text-lg rounded-lg hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
          >
            Start Game
          </button>

          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-lg hover:bg-white hover:text-black transition-colors shadow-lg active:scale-95"
            >
              Add to Home Screen
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
