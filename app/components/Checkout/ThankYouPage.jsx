import  { useEffect, useState } from "react";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { getOrderDetails } from "../../redux/slices/orders";
import { useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

const ThankYouPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getOrderDetails(params.orderId));
        setOrderData(response.payload.data.order);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, params.orderId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!orderData) {
    return (
      <div className="text-center text-red-500">
        <MdError className="inline-block h-6 w-6 mr-2" />
        Failed to load order data.
      </div>
    );
  }

  const {
    id,
    orderPlacedAt,
    subTotalWithTax,
    shippingWithTax,
    totalWithTax,
    currencyCode,
    state,
    lines,
    shippingAddress,
    billingAddress,
  } = orderData;

  return (
    <div className="mx-auto p-8 bg-gradient-to-r from-gray-100 to-gray-300 shadow-lg rounded-lg max-w-5xl">
      {/* Thank You Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <FaCheckCircle className="text-green-600 h-10 w-10" />
          <h1 className="text-4xl font-bold text-gray-800">
            Thank You for Your Order!
          </h1>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <h2 className="text-2xl font-semibold text-gray-700">
            Order ID: {id}
          </h2>
          <p className="text-gray-600">
            Placed On:{" "}
            {format(new Date(orderPlacedAt), "MMM dd, yyyy HH:mm:ss")}
          </p>
          <p className="text-lg">
            Status:{" "}
            <span
              className={`font-bold ${
                state === "Cancelled" ? "text-red-600" : "text-green-600"
              }`}
            >
              {state}
            </span>
          </p>
        </div>
      </div>

      {/* Order Summary and Items */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Subtotal (with Tax):{" "}
              <span className="font-bold">
                {currencyCode} {subTotalWithTax.toFixed(2)}
              </span>
            </p>
            <p>
              Shipping (with Tax):{" "}
              <span className="font-bold">
                {currencyCode} {shippingWithTax.toFixed(2)}
              </span>
            </p>
            <p className="text-xl font-bold">
              Total (with Tax):{" "}
              <span>
                {currencyCode} {totalWithTax.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Items
          </h2>
          {lines.map((line) => (
            <div
              key={line.id}
              className="flex items-center bg-gray-50 p-4 mb-3 rounded-lg shadow-md"
            >
              <img
                src={line.productVariant.featuredAsset.preview}
                alt={line.productVariant.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div className="space-y-1">
                <p className="text-lg font-semibold">
                  {line.productVariant.name}
                </p>
                <p className="text-gray-600">Quantity: {line.quantity}</p>
                <p className="text-gray-600">
                  Price (with Tax): {currencyCode}{" "}
                  {line.linePriceWithTax.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping and Billing Addresses */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Shipping Address */}
        {shippingAddress?.fullName && (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Shipping Address
            </h2>
            <p className="font-bold mb-1 text-gray-700">
              {shippingAddress?.fullName}
            </p>
            <p className="text-gray-600">{shippingAddress.phoneNumber}</p>
            <p className="text-gray-600">
              {shippingAddress.streetLine1} {shippingAddress?.streetLine2}
            </p>
            <p className="text-gray-600">
              {shippingAddress?.city}, {shippingAddress?.province}{" "}
              {shippingAddress?.postalCode}
            </p>
            <p className="text-gray-600">{shippingAddress?.country}</p>
          </div>
        )}

        {/* Billing Address */}
        {billingAddress?.fullName && (
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-600">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Billing Address
            </h2>
            <p className="font-bold mb-1 text-gray-700">
              {billingAddress?.fullName}
            </p>
            <p className="text-gray-600">{billingAddress?.phoneNumber}</p>
            <p className="text-gray-600">
              {billingAddress?.streetLine1} {billingAddress?.streetLine2}
            </p>
            <p className="text-gray-600">
              {billingAddress?.city}, {billingAddress?.province}{" "}
              {billingAddress?.postalCode}
            </p>
            <p className="text-gray-600">{billingAddress?.country}</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg text-gray-700">
          Your order has been placed successfully. You will receive a
          confirmation email shortly.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
