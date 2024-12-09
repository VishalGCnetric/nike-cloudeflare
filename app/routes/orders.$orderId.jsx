// app/routes/orders/$orderId.tsx
import { useParams } from '@remix-run/react';

export default function OrderDetails() {
  const { orderId } = useParams(); // `orderId` will be available from the URL
  
  // Fetch the order details based on `orderId` (you can use a loader or fetch API)
  
  return (
    <div>
      <h1>Order Details for Order ID: {orderId}</h1>
      {/* Render order details here */}
    </div>
  );
}
