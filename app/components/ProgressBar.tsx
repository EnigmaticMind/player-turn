import { useState, useEffect } from "react";

const ProgressBar = () => {
  const [progressPercentage, setProgress] = useState(100);

  useEffect(() => {
    setProgress(0);
  });
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-gray-200">
      <div
        style={{ width: `${progressPercentage}%` }}
        className={`h-full bg-blue-500 transition-all duration-4000 ease-in-out`}
      ></div>
    </div>
  );
};

export default ProgressBar;
