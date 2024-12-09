import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CheckoutSuccessModal = ({
  isVisible,
  onClose,
  orderId,
  expectedDelivery,
}) => {
  const navigate = useNavigate();

  // Use useEffect to handle redirection after 2 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        navigate(`/checkout/success/${orderId}`);
      }, 2000);

      return () => clearTimeout(timer); // Clean up the timer when modal unmounts or isVisible changes
    }
  }, [isVisible, orderId, navigate]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Increase z-index to 50 (or higher) to ensure it's above other elements */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50"
        // Increase z-index to 50 (or higher) to ensure it's above other elements
      >
        <h2 className="text-2xl font-semibold text-green-600">
          Checkout Successful!
        </h2>
        <p className="mt-4">Your order has been placed successfully.</p>
        <p className="mt-2">
          Order ID: <strong>{orderId}</strong>
        </p>
        <p className="mt-2">
          Expected Delivery: <strong>{expectedDelivery}</strong>
        </p>

        {/* <button 
                    onClick={onClose} 
                    className="mt-6 px-4 py-2 bg-black-500 text-white rounded-lg w-full hover:bg-blue-600"
                >
                    Close
                </button> */}
      </motion.div>
    </div>
  );
};

export default CheckoutSuccessModal;
