import  { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
} from "../../redux/slices/cartSlice";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ShoppingLoader from "../Loader/ShoppingLoader";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, status } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  // const handleQuantityChange = (itemId, newQuantity) => {
  //   dispatch(updateCartItem({ lineId: itemId, quantity: newQuantity }));
  // };
  const handleQuantityChange = (itemId, newQuantity) => {
    dispatch(updateCartItem({ lineId: itemId, quantity: newQuantity }))
      .unwrap() // Unwraps the result of the promise to wait for completion
      .then(() => {
        dispatch(fetchCart()); // Fetch updated cart after quantity change
      })
      .catch((error) => {
        console.error("Error updating cart item:", error);
      });
  };

  const handleDelete = (itemId) => {
    setOpenModal(true);
    setSelectedItem(itemId);
  };

  const confirmDelete = () => {
    dispatch(deleteCartItem(selectedItem));
    setOpenModal(false);
    dispatch(fetchCart());
  };

  if (!token) {
    return (
      <div className="text-center">
        No items in your cart. Please log in to view your cart.
      </div>
    );
  }
  if (status === "loading") {
    return <ShoppingLoader />;
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className=" mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-6">Bag</h2>
        <div className="flex justify-center">
          <p className="text-lg text-gray-600">No items in your cart.</p>
        </div>
      </div>
    );
  }
  return (
    <div className=" mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Bag</h2>
      {status === "loading" ? (
        <ShoppingLoader />
      ) : (
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">
            {cart?.lines?.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={(newQuantity) =>
                  handleQuantityChange(item.id, newQuantity)
                }
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
          <div className="w-full lg:w-1/3 lg:pl-6 mt-8 lg:mt-0">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹ {cart?.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>shipping: </span>
                <span>₹ {cart?.shipping?.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between mb-2">
                <span>Total :</span>
                <span>₹ {cart?.total?.toLocaleString()}</span>
              </div>
              <button
                onClick={() => navigate("/checkout/address")}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                Member Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to remove this item?
        </DialogContent>
        <DialogActions>
          <button onClick={confirmDelete} className="text-red-500">
            Confirm
          </button>
          <button onClick={() => setOpenModal(false)}>Cancel</button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CartPage;
