import  { useEffect } from "react"; // Import React
import PropTypes from "prop-types"; // Import PropTypes
import { motion } from "framer-motion";
import { useNavigate } from "@remix-run/react";

const CheckoutSuccessModal = ({
  isVisible,
  onClose, // Optionally use onClose to close the modal
  orderId,
  expectedDelivery,
}) => {
  const navigate = useNavigate();

  // Use useEffect to handle redirection after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        navigate(`/checkout/success/${orderId}`);
      }, 5000);

      return () => clearTimeout(timer); // Clean up the timer when modal unmounts or isVisible changes
    }
  }, [isVisible, orderId, navigate]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50"
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
        
        {/* Optional close button if you want to provide the ability to close the modal manually */}
        <button 
          onClick={onClose} 
          className="mt-6 px-4 py-2 bg-black-500 text-white rounded-lg w-full hover:bg-blue-600"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

// Prop types validation
CheckoutSuccessModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  orderId: PropTypes.string.isRequired,
  expectedDelivery: PropTypes.string.isRequired,
};

export default CheckoutSuccessModal;
