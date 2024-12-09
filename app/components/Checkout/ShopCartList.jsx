import React, { useState, useEffect } from "react";
import ShopCart from "./ShopCart"; // Ensure you import the ShopCart component
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Assuming shop is passed as a prop
const ShopCartList = ({ shop,deliveryType,onClose,setSelectedOption }) => {
  const [selectedSellers, setSelectedSellers] = useState({});
  const navigate = useNavigate();

  // Handle seller selection when a card is clicked
  const handleSelectSeller = (variantId, sellerId) => {
    const selectedVariant = shop?.find((v) => v.variantId === variantId);
    const selectedSeller = selectedVariant.sellers.find((s) => s.sellerId === sellerId);

    setSelectedSellers((prevSelected) => ({
      ...prevSelected,
      [variantId]: selectedSeller, // Store the selected seller for this variant
    }));
  };

  // Automatically select default sellers based on the number of sellers or distance
  // useEffect(() => {
  //   shop?.forEach((variant) => {
  //     if (!selectedSellers[variant.variantId]) {
  //       // if (variant.sellers.length === 1) {
  //       //   // If only one seller, select it by default
  //       //   setSelectedSellers((prevSelected) => ({
  //       //     ...prevSelected,
  //       //     [variant.variantId]: variant.sellers[0],
  //       //   }));
  //       // } else
  //       //  if (variant.sellers.length >= 1) {
  //       //   // If multiple sellers, select the one with the minimum distance
  //       //   const closestSeller = variant.sellers.reduce((minSeller, currentSeller) =>
  //       //     currentSeller.distance < minSeller.distance ? currentSeller : minSeller
  //       //   );
  //       //   setSelectedSellers((prevSelected) => ({
  //       //     ...prevSelected,
  //       //     [variant.variantId]: closestSeller,
  //       //   }));
  //       // }
  //     }
  //   });
  // }, [shop, selectedSellers]);

  // Transform selectedSellers into the desired format
  const transformSelectedSellers = () => {
    return Object.entries(selectedSellers)?.map(([variantId, seller]) => {
      const variant = shop?.find((v) => v.variantId === variantId);
      return {
        variantId,
        variantName: variant.variantName,
        sku: variant.sku,
        sellers: [seller], // Store only the selected seller for this variant
      };
    });
  };

  const notify = () => toast.success("Added sellers address");

  const handleContinue = () => {
    const selectedDealers = transformSelectedSellers(); // Call the function to get the data
    if(deliveryType=="pickup"){
      localStorage.setItem("shippingAddress", null);

    }
    saveSellersToLocalStorage(selectedDealers,deliveryType)
    localStorage.setItem("selectedShippingDealers", JSON.stringify(selectedDealers));
    notify();
    navigate("/checkout/billing");
  };
  function saveSellersToLocalStorage(shopData, deliveryType) {
    // Collect unique sellerId with their respective shipMethodId
    const sellerInfo = shopData.reduce((acc, variant) => {
      variant.sellers.forEach((seller) => {
        if (!acc[seller.shipMethodId]) {
          acc[seller.shipMethodId] = []; // Initialize the array for the shipMethodId
        }
        if (!acc[seller.shipMethodId].includes(seller.sellerId)) {
          acc[seller.shipMethodId].push(seller.sellerId); // Add sellerId to the shipMethodId's array
        }
      });
      return acc;
    }, {});
  
    // Format the dealer data as required
    const dealerData = {
      dealer: {
        deliveryType: deliveryType,
        shipMethodIds: Object.keys(sellerInfo).map((shipMethodId) =>shipMethodId )
      }
    };
  
    // Save to localStorage
    localStorage.setItem("dealerData", JSON.stringify(dealerData));
    console.log("Dealer data saved to localStorage:", dealerData);
  }
  
  
  

  // Check if all variants have a selected seller
  const isAllSelected = shop?.every((variant) => selectedSellers[variant.variantId]) || shop.length === 0;


  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between mb-3 mr-3 sticky top-0 bg-white p-2">
  {/* Heading */}
  <div className="text-lg font-bold text-gray-800">Choose Nearby Shop</div>

  {/* Continue Button */}
  <button
    onClick={handleContinue}
    className={`px-4 py-2 text-white font-semibold rounded-md transition duration-300 ${
      isAllSelected
        ? "bg-black hover:bg-indigo-900 cursor-pointer"
        : "bg-gray-300 cursor-not-allowed"
    }`}
    disabled={!isAllSelected} // Disable the button if not all sellers are selected
  >
    Continue
  </button>

  {/* Cancel Button */}
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
  No nearby sellers for this cart items.<br/> Choose 'Ship to my address' to continue.
</div>
) : (
  <>
    {shop?.map((variant, index) => (
      <div className="border mb-3 p-5" key={index}>
        <h1 className="my-2 font-semibold">{variant.variantName}</h1>
        <div>
          {variant.sellers.length > 0 ? (
            variant.sellers
              .sort((a, b) => a.distance - b.distance) // Sort sellers by ascending distance
              .map((seller) => (

                <div
                  key={seller.sellerId}
                  className={`relative border p-4 mb-2 rounded-md cursor-pointer ${
                    selectedSellers[variant.variantId]?.sellerId === seller.sellerId
                      ? "border-green-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleSelectSeller(variant.variantId, seller.sellerId)}
                >
                  <ShopCart shop={seller} />
                  {/* Display "Selected" label if this seller is selected */}
                  {selectedSellers[variant.variantId]?.sellerId === seller.sellerId && (
                    <div className="absolute bottom-2 right-2 text-green-600 font-semibold">
                      Selected
                    </div>
                  )}
                </div>
              ))

          ) : (
            <div className="text-red-600 border border-red-500 rounded p-2 m-2">
            No nearby sellers for this item.<br/>Either remove this item from cart <br/> OR <br/>Choose 'Ship to my address' to continue.
           
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

export default ShopCartList;