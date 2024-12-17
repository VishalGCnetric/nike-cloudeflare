import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { json } from '@remix-run/node';
import { getAllOrders } from '../utils/api';
import { getSession } from '../utils/cookies';



export const loader = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get('Cookie') || '';
    const session = await getSession(cookieHeader);
    const token = session.get('token');

    if (!token) {
      throw new Error('Unauthorized access: Token is missing.');
    }

    const orders = await getAllOrders(token);
    // console.log('Orders fetched:', orders);

    // Adjust the structure based on the API response
    return json(orders.orders.items); // Adjusted this line to match the correct structure
  } catch (error) {
    console.error('Error in loader:', error);
    return json({ error: error.message || 'Failed to load orders.' }, { status: 500 });
  }
};






const OrderList = () => {
  const orders = useLoaderData();
  const navigate = useNavigate();

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Format the price for display
  const amountPrint = (price) => {
    if (typeof price !== "undefined" && price !== null) {
      return "₹" + price.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    }
    return "₹0.00";
  };

  // Get the status color based on order state
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
        return "bg-gray-500";
    }
  };

  // Handle error scenarios or no orders
  if (orders.error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Orders</h1>
        <p className="text-gray-700 mb-4">{orders.error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">You have no orders!</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                  to={`/orders/${order.id}`}
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

