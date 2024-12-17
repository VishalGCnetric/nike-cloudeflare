import { useLoaderData } from "@remix-run/react";
import React from "react";

const cardClass = "w-full p-8 bg-white shadow-md rounded-md";
const flexClass = "flex justify-between";
const itemClass = "text-sm";

const dummyCart = {
  subtotal: 2000,
  shipping: 150,
  total: 2150,
  arrivesDate: "Dec 15, 2024",
  lines: [
    {
      id: "1",
      productVariant: {
        name: "Product A",
        images: [{ url: "https://via.placeholder.com/100" }],
      },
      size: "M",
      quantity: 2,
      linePrice: 1000,
    },
    {
      id: "2",
      productVariant: {
        name: "Product B",
        images: [{ url: "https://via.placeholder.com/100" }],
      },
      size: "L",
      quantity: 1,
      linePrice: 1150,
    },
  ],
};

const OrderSummary = () => {
  // Use loader data if cartData prop is not provided
  const {cart} = useLoaderData();
  // const cart = dummyCart || loaderData || dummyCart;
  if (!cart) {
    return <p>Your cart is empty. Please add items before proceeding.</p>;
  }
  return (
    <div className={cardClass}>
      <h2 className="text-lg font-semibold text-zinc-800">Order Summary</h2>
      <div className="mt-4">
        <p className={flexClass}>
          <span>Subtotal</span>
          <span>₹ {cart?.subtotal?.toLocaleString() || 0}</span>
        </p>
        <p className={flexClass}>
          <span>Delivery/Shipping</span>
          <span>₹ {cart?.shipping || 0}</span>
        </p>
        <hr className="my-2" />
        <p className={`${flexClass} font-bold`}>
          <span>Total</span>
          <span>₹ {cart?.total?.toLocaleString() || 0}</span>
        </p>
      </div>
      <p className={`${itemClass} mt-1`}>
        (The total reflects the price of your order, including all duties and taxes)
      </p>
      <h3 className="mt-4 font-semibold">Arrives {cart?.arrivesDate}</h3>

      {cart?.lines?.map((item) => (
        <div key={item.id} className="flex items-start mt-4 space-x-4">
          <img
            aria-hidden="true"
            alt={`${item?.productVariant?.name} (UK Size ${item?.size})`}
            src={
              item?.productVariant?.images?.[0]?.url ||
              item?.productVariant?.featuredAsset?.url
            }
            className="w-32 h-32 object-cover rounded-md"
          />
          <div>
            <h4 className="font-medium">{item?.productVariant?.name}</h4>
            <p className={itemClass}>Qty {item?.quantity}</p>
            <p className={itemClass}>Size UK {item?.size}</p>
            <p className="font-bold">₹ {item?.linePrice?.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSummary;
