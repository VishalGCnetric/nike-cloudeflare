import PropTypes from "prop-types";

const CartItem = ({ item, onQuantityChange, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b-2">
      <img
        src={
          item?.productVariant?.featuredAsset?.url ||
          item?.productVariant?.images?.[0].url
        }
        alt={item?.productVariant?.name}
        className="w-48 h-48 object-cover mr-4"
      />
      <div className="flex-1 space-y-1 text-left">
        <h3 className="text-lg font-semibold">{item?.productVariant?.name}</h3>
        <p className="text-gray-600">
          Price: ₹{item?.productVariant?.price.toLocaleString()}
        </p>
        <div className="text-gray-600">
          Quantity:
          <select
            name="quantity"
            value={item.quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value))}
            className="ml-2"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onDelete}
          className="text-gray-600 hover:text-black mt-2"
        >
          🗑️ Delete
        </button>
      </div>
      <div className="font-semibold">
        {/* Total: ₹{item.linePrice.toLocaleString()} */}
      </div>
    </div>
  );
};

// PropTypes for CartItem component
CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    productVariant: PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      featuredAsset: PropTypes.shape({
        url: PropTypes.string,
      }),
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
        })
      ),
    }).isRequired,
    linePrice: PropTypes.number.isRequired,
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default CartItem;
