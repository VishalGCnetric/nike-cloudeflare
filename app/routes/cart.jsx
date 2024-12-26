import  { useEffect, useState } from 'react';
import { json, useLoaderData, Link, useOutletContext } from '@remix-run/react';
import { getCart, deleteFromCart, updateCartQuantity } from '../utils/cartutils';
import CartItem from '../components/cart/CartItem';
import ShoppingLoader from '../components/Loader/ShoppingLoader';
import {  getSession } from '../utils/cookies';

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie") || "";
	const session = await getSession(cookieHeader);
	const token = session.get("token");
  try {
    const cart = await getCart(token);
     
    

   
    return json({ cart });
  } catch (error) {
    return json({ cart: null }, { status: 500 });
  }
}

const CartPage = () => {
  const { cart } = useLoaderData();
  const [loading, setLoading] = useState(false);
  const [localCart, setLocalCart] = useState(cart);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { token } = useOutletContext(); // Ensure token is available

  useEffect(() => {
    setLocalCart(cart); // Ensure local cart is set when loader data changes
  }, [cart]);

  const fetchCart = async () => {
    try {
      const updatedCart = await getCart(token);
      setLocalCart(updatedCart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleQuantityChange = async (lineId, newQuantity) => {
    setLoading(true);
    try {
      await updateCartQuantity(token, lineId, newQuantity);
      await fetchCart(); // Fetch updated cart after changing quantity
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (lineId) => {
    setOpenModal(true);
    setSelectedItem(lineId);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteFromCart(token, selectedItem);
      await fetchCart(); // Fetch updated cart after deletion
    } catch (error) {
      console.error('Error deleting cart item:', error);
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  if (!localCart?.lines?.length) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Bag</h2>
        <p className="text-gray-600">No items in your cart.</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Bag</h2>
      {loading ? (
        <ShoppingLoader />
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">
            {localCart.lines.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
          <div className="w-full lg:w-1/3 lg:pl-6 mt-8 lg:mt-0">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹ {localCart.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>₹ {localCart.shipping?.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between mb-2">
                <span>Total:</span>
                <span>₹ {localCart.total?.toLocaleString()}</span>
              </div>
              <Link to="/checkout/address">
                <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                  Member Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-md w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to remove this item?</p>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-700 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
