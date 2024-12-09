import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCart } from '../../redux/slices/cartSlice';

const cardClass = "w-full p-8 bg-white shadow-md rounded-md";
const flexClass = "flex justify-between";
const itemClass = "text-sm";

const OrderSummary = () => {
  const { step } = useParams();
  const dispatch = useDispatch();
  const { cart, status } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);
  if (cart?.id){
    localStorage.setItem("cartId",cart?.id)
  }
  // console.log(cart)
//   if (!cart || cart?.lines.length === 0) {
//     return (
//       <div className="flex justify-center">
//         <p className="text-lg text-gray-600">No items in your order.</p>
//       </div>
//     );
//   }

  return (
    <div className={cardClass}>
      <h2 className="text-lg font-semibold text-zinc-800">Order Summary</h2>
      <div className="mt-4">
        <p className={flexClass}><span>Subtotal</span><span>₹ {cart?.subtotal.toLocaleString()||0}</span></p>
        <p className={flexClass}><span>Delivery/Shipping</span><span>₹ {cart?.shipping||0}</span></p>
        <hr className="my-2" />
        <p className={`${flexClass} font-bold`}><span>Total</span><span>₹ {(cart?.total || 0).toLocaleString()}</span></p>
      </div>
      <p className={`${itemClass} mt-1`}>(The total reflects the price of your order, including all duties and taxes)</p>
      {/* {step === 'payment' && (
        <button
          className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          onClick={() => console.log('Proceed to payment')}
        >
          Checkout
        </button>
      )} */}
      <h3 className="mt-4 font-semibold">Arrives {cart?.arrivesDate}</h3>   

      {cart?.lines?.map((item) => (
        <div key={item.id} className="flex items-start mt-4 space-x-4">
          <img
            aria-hidden="true"
            alt={`${item?.productVariant?.name} (UK Size ${item?.size})`}
            src={item?.productVariant?.images?.[0]?.url|| item?.productVariant?.featuredAsset?.url}
            className="w-32 h-32 object-cover rounded-md"
          />
          <div>
            <h4 className="font-medium">{item?.productVariant?.name}</h4>
            <p className={itemClass}>Qty {item?.quantity}</p>
            <p className={itemClass}>Size UK {item?.size}</p>
            <p className="font-bold">₹ {item?.linePrice.toLocaleString()}</p>
          </div>
        </div>
      ))}

      {/* Show the checkout button only when the step is 'payment' */}
     
    </div>
  );
};

export default OrderSummary;
