import { useState, useEffect } from "react";

const SkeletonLoader = ({
  width = "100%",
  height = "100%",
  borderRadius = "rounded-xl",
  animation = "pulse",
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`w-full h-full ${borderRadius} bg-zinc-900 animate-${animation} ${className}`}
      style={{
        width: width,
        height: height,
        display: isVisible ? 'block' : 'none'
      }}
    >
      {!isVisible && (
        <div className="w-full h-full flex items-center justify-center text-zinc-700">
          Loading...
        </div>
      )}
    </div>
  );
};

export default SkeletonLoader;