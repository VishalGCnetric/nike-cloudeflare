import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import { FaShippingFast, FaMoneyBillAlt } from "react-icons/fa"; // Import icons
import { getOrderDetails } from "../utils/api";
import { json ,useLoaderData, useNavigate} from "@remix-run/react";
import { getSession } from "../utils/cookies";

export let loader= async ({ params ,request}) => {
  const orderId = params.orderId;
  const cookieHeader = request.headers.get('Cookie') || '';
  const session = await getSession(cookieHeader);
  const token = session.get('token');
  console.log(orderId,token)
  try {
    const response = await getOrderDetails(orderId,token); // Call your API function here
    // const orderdata=await response.json()
    // console.log(orderdata)
    return json(response); // Return the data to the component
  } catch (error) {
    console.error("Error fetching order details:", error);
    return json({ error: "Failed to fetch order details" }, { status: 500 });
  }
};

export default function OrderDetails() {
  const orderData = useLoaderData(); // Fetching data from loader
  const navigate = useNavigate(); // To navigate programmatically

  if (!orderData) {
    return <p>Failed to load order data</p>;
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
  const formattedOrderDate = orderPlacedAt
  ? format(new Date(orderPlacedAt), "MMMM dd, yyyy")
  : "Invalid Date";

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-white shadow-2xl rounded-2xl">
       <div className="flex items-center space-x-2 mb-8">
        <button
          onClick={() => navigate("/orderlist")} // Navigate back to order list
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          &lt; Back to Order List
        </button>
      </div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-800">Order Details</h1>
          <p className="text-lg text-gray-500 mt-1">
            Order ID: <span className="text-gray-700 font-medium">{id}</span>
          </p>
          <p className="text-lg text-gray-500">
            Placed on:{" "}
            <span className="text-gray-700">
            {formattedOrderDate}            </span>
          </p>
          <p className="text-lg">
            Status:{" "}
            <span className={`${state === "Cancelled" ? "text-red-500" : "text-green-500"} font-bold`}>
              {state}
            </span>
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <QRCodeCanvas value={id} size={100} className="shadow-lg rounded-lg" />
        </div>
      </div>

      {/* Order Summary & Items */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaMoneyBillAlt className="mr-2 text-green-500" /> Order Summary
          </h2>
          <div className="space-y-2 text-lg">
            <p>
              <span className="font-medium">Subtotal (with Tax):</span>{" "}
              {currencyCode} {subTotalWithTax}
            </p>
            <p>
              <span className="font-medium">Shipping (with Tax):</span>{" "}
              {currencyCode} {shippingWithTax}
            </p>
            <p>
              <span className="font-medium">Total (with Tax):</span>{" "}
              {currencyCode} {totalWithTax}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Order Items</h2>
          {lines?.map((line) => (
            <div
              key={line.id}
              className="flex items-center bg-gray-50 p-4 mb-4 rounded-md shadow-sm hover:bg-gray-100 transition"
            >
              <img
                src={line.productVariant.featuredAsset.preview}
                alt={line.productVariant.name}
                className="w-16 h-16 object-cover rounded-md shadow-md"
              />
              <div className="ml-4">
                <p className="text-lg font-medium">{line.productVariant.name}</p>
                <p className="text-sm text-gray-600">Qty: {line.quantity}</p>
                <p className="text-sm text-gray-600">
                  Price (with Tax): {currencyCode} {line.linePriceWithTax.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping and Billing Addresses */}
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {/* Shipping Address */}
        {shippingAddress.fullName && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaShippingFast className="mr-2 text-blue-500" /> Shipping Address
            </h2>
            <p className="font-medium text-lg mb-2">{shippingAddress.fullName}</p>
            <p className="text-gray-600">
              {shippingAddress.streetLine1}, {shippingAddress.streetLine2}, {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <p className="text-gray-600">Phone: {shippingAddress.phoneNumber}</p>
          </div>
        )}

        {/* Billing Address */}
        {billingAddress.fullName && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaMoneyBillAlt className="mr-2 text-green-500" /> Billing Address
            </h2>
            <p className="font-medium text-lg mb-2">{billingAddress.fullName}</p>
            <p className="text-gray-600">
              {billingAddress.streetLine1}, {billingAddress.streetLine2}, {billingAddress.city}, {billingAddress.province}, {billingAddress.postalCode}, {billingAddress.country}
            </p>
            <p className="text-gray-600">Phone: {billingAddress.phoneNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}
