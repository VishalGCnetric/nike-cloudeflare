import { useState, lazy } from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "@remix-run/react";

const ShopCart = lazy(() => import("./ShopCart"));

const ShopCartList = ({ shop, deliveryType, onClose, setSelectedOption }) => {
  const [selectedSellers, setSelectedSellers] = useState({});
  const navigate = useNavigate();

  const handleSelectSeller = (variantId, sellerId) => {
    const selectedVariant = shop?.find((v) => v.variantId === variantId);
    const selectedSeller = selectedVariant.sellers.find((s) => s.sellerId === sellerId);

    setSelectedSellers((prevSelected) => ({
      ...prevSelected,
      [variantId]: selectedSeller,
    }));
  };

  const transformSelectedSellers = () => {
    return Object.entries(selectedSellers)?.map(([variantId, seller]) => {
      const variant = shop?.find((v) => v.variantId === variantId);
      return {
        variantId,
        variantName: variant.variantName,
        sku: variant.sku,
        sellers: [seller],
      };
    });
  };

  const handleContinue = () => {
    const selectedDealers = transformSelectedSellers();
    if (deliveryType === "pickup") {
      localStorage.setItem("shippingAddress", null);
    }
    saveSellersToLocalStorage(selectedDealers, deliveryType);
    localStorage.setItem("selectedShippingDealers", JSON.stringify(selectedDealers));
    navigate("/checkout/billing");
  };

  function saveSellersToLocalStorage(shopData, deliveryType) {
    const sellerInfo = shopData.reduce((acc, variant) => {
      variant.sellers.forEach((seller) => {
        if (!acc[seller.shipMethodId]) {
          acc[seller.shipMethodId] = [];
        }
        if (!acc[seller.shipMethodId].includes(seller.sellerId)) {
          acc[seller.shipMethodId].push(seller.sellerId);
        }
      });
      return acc;
    }, {});

    const dealerData = {
      dealer: {
        deliveryType: deliveryType,
        shipMethodIds: Object.keys(sellerInfo).map((shipMethodId) => shipMethodId),
      },
    };

    localStorage.setItem("dealerData", JSON.stringify(dealerData));
    console.log("Dealer data saved to localStorage:", dealerData);
  }

  const isAllSelected = shop?.every((variant) => selectedSellers[variant.variantId]) || shop.length === 0;

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between mb-3 mr-3 sticky top-0 bg-white p-2">
        <div className="text-lg font-bold text-gray-800">Choose Nearby Shop</div>
        <button
          onClick={handleContinue}
          className={`px-4 py-2 text-white font-semibold rounded-md transition duration-300 ${
            isAllSelected ? "bg-black hover:bg-indigo-900 cursor-pointer" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!isAllSelected}
        >
          Continue
        </button>
        <button
          onClick={() => {
            setSelectedOption("shipping");
            onClose();
          }}
          className="px-4 py-2 text-white font-semibold rounded-md transition duration-300 bg-red-400 hover:bg-red-700 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {shop.length === 0 ? (
        <div className="text-gray-600 border border-red-500 p-2 m-2">
          No nearby sellers for this cart items.<br /> Choose &apos;Ship to my address&apos; to continue.
        </div>
      ) : (
        <>
          {shop?.map((variant) => (
            <div className="border mb-3 p-5" key={variant.variantId}>
              <h1 className="my-2 font-semibold">{variant.variantName}</h1>
              <div>
                {variant.sellers.length > 0 ? (
                  variant.sellers
                    .sort((a, b) => a.distance - b.distance)
                    .map((seller) => (
                      <div
                        key={seller.sellerId}
                        className={`relative border p-4 mb-2 rounded-md cursor-pointer ${
                          selectedSellers[variant.variantId]?.sellerId === seller.sellerId
                            ? "border-green-600"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleSelectSeller(variant.variantId, seller.sellerId)}
                        role="button" // Added role for accessibility
                        tabIndex={0} // Allow keyboard navigation
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSelectSeller(variant.variantId, seller.sellerId);
                        }} // Handle keyboard enter key
                      >
                        <ShopCart shop={seller} />
                        {selectedSellers[variant.variantId]?.sellerId === seller.sellerId && (
                          <div className="absolute bottom-2 right-2 text-green-600 font-semibold">
                            Selected
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-red-600 border border-red-500 rounded p-2 m-2">
                    No nearby sellers for this item.<br />Either remove this item from cart <br /> OR <br />Choose &apos;Ship to my address&apos; to continue.
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

ShopCartList.propTypes = {
  shop: PropTypes.array.isRequired,
  deliveryType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
};

export default ShopCartList;
