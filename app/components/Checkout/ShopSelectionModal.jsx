import React, { useState, useEffect } from "react";
import { Modal, Button } from "@mui/material";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import ShopCartList from "./ShopCartList";
import Maps from "./Maps";
import ShopCart from "./ShopCart";
import FindingDealerLoader from "../Loader/FindingDealerLoader";

// Custom marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ShopSelectionModal = ({
  setSelectedOption,
  isOpen,
  onClose,
  coordinates,
  nearbyShops = [],
  onSelectShop,
  isLoading,
  deliveryType
}) => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [selectedShops, setSelectedShops] = useState({}); // Track selected shop per variant

  useEffect(() => {
    if (coordinates) {
      const fetchAddress = async () => {
        try {
          setError('');  // Reset any previous error
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lng}&lon=${coordinates.lat}&format=json`
          );
          setAddress(response.data.display_name);
        } catch (err) {
          setError('Unable to fetch address. Please try again later.');
        }
      };
  if(isOpen && coordinates ){
    fetchAddress();

  }
    }
  }, [coordinates]);
  

 
  
  
  
  

  return (
    <Modal open={isOpen} onClose={onClose} className="flex items-center justify-center">
      <div className="bg-white rounded-lg p-5 w-full max-w-5xl mx-auto max-h-[90vh] overflow-auto">
      {isLoading ? (          <div className="w-full sm:w-1/2 h-full mb-5 sm:mb-0">

<FindingDealerLoader/>   </div>     ) : (
        <div className="flex flex-col sm:flex-row">
          {/* Left side: Map */}
          <div className="w-full sm:w-1/2 h-full mb-5 sm:mb-0">
  {coordinates ? (
    <Maps currentLocation={coordinates} nearbyShops={nearbyShops} />
  ) : (
    <p>Loading map...</p>
  )}

          </div>

          {/* Right side: List of shops */}
          <div className="w-full sm:w-1/2 pl-0 sm:pl-6 overflow-y-auto max-h-96">
            <ShopCartList shop={nearbyShops} deliveryType={deliveryType} setSelectedOption= {setSelectedOption} onClose={onClose}/>
</div>
      </div>)}
      </div>
    </Modal>
  );
};

export default ShopSelectionModal;
