// This is file of your component
// You can use any dependencies from npm; we import them automatically in package.json

import { useState } from "react";

const  Component= () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Amber Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      {/* Dot Pattern Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          opacity: 0.4,
        }}
      />
    </div>
  );
};

export { Component };