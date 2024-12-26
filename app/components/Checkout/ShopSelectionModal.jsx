import React, { lazy, useEffect, useState } from "react";
import PropTypes from "prop-types";
import FindingDealerLoader from "../Loader/FindingDealerLoader";
import ShopCartList from "./ShopCartList";
import { Modal } from "@mui/material";

const Maps = lazy(() => import("./Maps"));

const ShopSelectionModal = ({
  setSelectedOption,
  isOpen,
  onClose,
  coordinates,
  nearbyShops = [],
  isLoading,
  deliveryType,
}) => {
  // const [address, setAddress] = useState("");
  // const [error, setError] = useState(false);
  const [showMap, setShowMap] = useState(false);
const error=false;
  // Fetch address based on coordinates
  // useEffect(() => {
  //   const fetchAddress = async () => {
  //     if (coordinates && isOpen) {
  //       try {
  //         setError(false);
  //         const response = await axios.get(
  //           `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json`
  //         );
  //         setAddress(response.data.display_name || "Address not available");
  //       } catch {
  //         setError(true);
  //       }
  //     }
  //   };

  //   fetchAddress();
  // }, [coordinates, isOpen]);

  // Trigger map rendering only after modal is open
  useEffect(() => {
    if (isOpen && coordinates) {
      setShowMap(true);
    }
  }, [isOpen, coordinates]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-5 w-full max-w-5xl mx-auto max-h-[90vh] overflow-auto">
        {isLoading ? (
          <div className="w-full sm:w-1/2 h-full mb-5 sm:mb-0">
            <FindingDealerLoader />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row">
            {/* Left side: Map */}
            <div className="w-full sm:w-1/2 h-full mb-5 sm:mb-0">
              {showMap && coordinates ? (
                <React.Suspense fallback={<FindingDealerLoader />}>
                  <Maps currentLocation={coordinates} nearbyShops={nearbyShops} />
                </React.Suspense>
              ) : (
                <FindingDealerLoader />
              )}
            </div>

            {/* Right side: List of shops */}
            <div className="w-full sm:w-1/2 pl-0 sm:pl-6 overflow-y-auto max-h-96">
              {error ? (
                <div className="text-red-600">
                  Unable to fetch address. Please try again later.
                </div>
              ) : (
                <ShopCartList
                  shop={nearbyShops}
                  deliveryType={deliveryType}
                  setSelectedOption={setSelectedOption}
                  onClose={onClose}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// PropTypes validation
ShopSelectionModal.propTypes = {
  setSelectedOption: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  nearbyShops: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  deliveryType: PropTypes.string.isRequired,
};

export default ShopSelectionModal;
