import React from 'react';

const ShoppingLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative flex flex-col items-center">
        {/* Cart Body */}
        <div className="w-20 h-10 bg-gray-800 rounded-md mb-2"></div>

        {/* Cart Wheels */}
        <div className="flex justify-between w-20">
          {/* First Wheel */}
          <div
            className="w-6 h-6 bg-black rounded-full"
            style={{
              animation: 'spin-slow 2s linear infinite',
              animationDelay: '0s',
              opacity: 1,
            }}
          ></div>
          {/* Second Wheel (with delay) */}
          <div
            className="w-6 h-6 bg-black rounded-full"
            style={{
              animation: 'spin-slow 2s linear infinite',
              animationDelay: '1s',
              opacity: 0,
              animationFillMode: 'forwards',
            }}
          ></div>
        </div>
      </div>

      {/* Keyframes */}
      <style>
        {`
          @keyframes spin-slow {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ShoppingLoader;
