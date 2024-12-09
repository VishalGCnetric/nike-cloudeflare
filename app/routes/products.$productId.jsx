// app/routes/products/$productId.tsx
import { useParams } from '@remix-run/react';

export default function ProductDetails() {
  const { productId } = useParams(); // `productId` will be available from the URL
  
  // Fetch the product details based on `productId` (you can use a loader or fetch API)
  // Example: fetch product details here
  
  return (
    <div>
      <h1>Product Details for Product ID: {productId}</h1>
      {/* Render product details here */}
    </div>
  );
}
