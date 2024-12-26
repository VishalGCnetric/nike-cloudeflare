
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
            className="w-6 h-6 bg-black rounded-full animate-spin-slow"
          ></div>
          {/* Second Wheel */}
          <div
            className="w-6 h-6 bg-black rounded-full animate-spin-slow"
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

          .animate-spin-slow {
            animation: spin-slow 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default ShoppingLoader;
