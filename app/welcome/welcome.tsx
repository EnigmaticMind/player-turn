import { TouchGlow } from "../components/TouchGlow";

export function Welcome() {
  return (
    <TouchGlow className="min-h-screen w-full">
      <main className="flex items-center justify-center pt-16 pb-4 min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Player Turn
          </h1>
          <p className="text-lg text-gray-200">
            Touch with multiple fingers or move your mouse around to see the
            magic! ✨<br />
            <span className="text-sm text-gray-300">
              Each finger gets a random color. After 5 seconds with multiple
              touches, only one random finger stays glowing!
            </span>
          </p>
        </div>
      </main>
    </TouchGlow>
  );
}
