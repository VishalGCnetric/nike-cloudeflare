import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
// import { getAllOrders } from "../utils/api";

// Loader function for server-side data fetching
export const loader = async () => {
  try {
    // const response = await getAllOrders();
    return json(response.payload.orders.items);
  } catch (error) {
    throw json({ message: "Failed to load orders" }, { status: 500 });
  }
};

const OrderList = () => {
  const orders = useLoaderData();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const amountPrint = (price) => {
    if (typeof price !== "undefined" && price !== null) {
      const formattedPrice = "₹" + price.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
      return formattedPrice;
    } else {
      return "₹0.00"; // Default value
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500";
      case "Pending":
        return "bg-yellow-500";
      case "PaymentAuthorized":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-black";
    }
  };

  if (!orders.length) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "1rem",
          }}
        >
          You have no orders!
        </h1>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mt-10 px-5 py-5 mx-auto font-sans">
      <h2 className="text-2xl mb-5 font-bold md:text-xl md:mb-2">My Recent Orders</h2>
      <table className="w-full border-collapse text-sm md:text-xs">
        <thead>
          <tr>
            <th className="p-3 text-left border-b bg-gray-200 md:p-2">Order</th>
            <th className="p-3 text-left border-b bg-gray-200 md:p-2">Placed On</th>
            <th className="p-3 text-left border-b bg-gray-200 md:p-2">Total</th>
            <th className="p-3 text-left border-b bg-gray-200 md:p-2">Order Status</th>
            <th className="p-3 text-left border-b bg-gray-200 md:p-2"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td className="p-3 text-left border-b md:p-2">{order.id}</td>
              <td className="p-3 text-left border-b md:p-2">{formatDate(order.orderPlacedAt)}</td>
              <td className="p-3 text-left border-b md:p-2">{amountPrint(order.totalWithTax)}</td>
              <td className="p-3 text-left border-b md:p-2">
                <span
                  className={`text-white px-2 py-1 rounded ${getStatusColor(order.state)}`}
                >
                  {order.state}
                </span>
              </td>
              <td className="p-3 text-left border-b md:p-2">
                <Link
                  to={`/order/${order.id}`}
                  className="underline text-blue-600 hover:text-red-600"
                >
                  View details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
