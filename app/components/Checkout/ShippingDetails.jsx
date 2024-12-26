import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from '@remix-run/react';
import ShopSelectionModal from './ShopSelectionModal';
import { toast } from 'react-toastify';
import { Button, Modal } from '@mui/material';
import axios from 'axios'; // Import axios

export default function ShippingDetails() {
  const navigate = useNavigate();
  const { shippingAddress, eligibleDealers } = useLoaderData();
  const [showShippingPopup, setShowShippingPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingCoordinates, setShippingCoordinates] = useState(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [browserCoordinates, setBrowserCoordinates] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('shipping');
  const [selectedShop, setSelectedShop] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  // const [error, setError] = useState(''); // This variable is set but not used. Consider using it for displaying errors.

  useEffect(() => {
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationGranted(true);
        setBrowserCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setLocationGranted(false);
        console.error('Geolocation error:', error);
      },
      geoOptions
    );
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  useEffect(() => {
    if (browserCoordinates && isModalOpen) {
      const shopsWithin50km = eligibleDealers.reduce((acc, variant) => {
        const nearbySellers = variant.sellers
          .map((seller) => {
            if (!seller.coordinates) {
              console.warn('Seller coordinates not defined:', seller);
              return null;
            }
            return {
              ...seller,
              distance: calculateDistance(
                browserCoordinates.lat,
                browserCoordinates.lng,
                seller.coordinates.lat,
                seller.coordinates.lng
              ),
            };
          })
          .filter(Boolean)
          .filter((seller) => seller.distance <= 50);

        if (nearbySellers.length > 0) {
          acc.push({
            ...variant,
            sellers: nearbySellers,
          });
        }
        return acc;
      }, []);
      setNearbyShops(shopsWithin50km);
    }
  }, [browserCoordinates, eligibleDealers, isModalOpen]);

  const attemptAddressGeocoding = async (address) => {
    const performGeocoding = async (query) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setBrowserCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error fetching geocode:', error);
        return false;
      }
    };

    const geocodePriorities = [
      `${address.streetLine1}, ${address.city}, ${address.state}, ${address.country}`,
      `${address.streetLine2}, ${address.city}, ${address.state}, ${address.country}`,
      `${address.postalCode}`
    ];

    for (const query of geocodePriorities) {
      const found = await performGeocoding(query);
      if (found) return;
    }

    toast.error('Address not found. Please opt for normal shipping.');
  };

  const handleOptionChange = async (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    if (value === 'pickup') {
      if (browserCoordinates) {
        setIsModalOpen(true);
      } else {
        toast.error('Unable to get current location. Please enable location services.');
      }
    } else if (value === 'ship') {
      if (!browserCoordinates && shippingAddress) { // Make sure to use shippingAddress instead of shippingData
        await attemptAddressGeocoding(shippingAddress);
      }
      setShowShippingPopup(true);
    }
  };

  const handleShopSelection = (shop) => {
    setSelectedShop(shop);
    setIsModalOpen(false);
  };

  const handleShippingConfirmation = async (useCurrentLocation) => {
    if (useCurrentLocation) {
      setShippingCoordinates(browserCoordinates);
    } else if (shippingAddress) { // Ensure shippingAddress is used here
      await attemptAddressGeocoding(shippingAddress);
    }
    setShowShippingPopup(false);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shipping Details</h1>
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="shipping"
            checked={selectedOption === 'shipping'}
            onChange={handleOptionChange}
            className="form-radio text-indigo-600 h-5 w-5"
          />
          <span className="text-gray-800">Ship to my address</span>
        </label>

        {locationGranted && (
          <>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="pickup"
                checked={selectedOption === 'pickup'}
                onChange={handleOptionChange}
                className="form-radio text-indigo-600 h-5 w-5"
              />
              <span className="text-gray-800">Pick from dealer</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="ship"
                checked={selectedOption === 'ship'}
                onChange={handleOptionChange}
                className="form-radio text-indigo-600 h-5 w-5"
              />
              <span className="text-gray-800">Ship from dealer</span>
            </label>
          </>
        )}
      </div>

      {isModalOpen && (
        <ShopSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setSelectedOption={setSelectedOption}
          coordinates={browserCoordinates}
          nearbyShops={nearbyShops}
          onSelectShop={handleShopSelection}
          isLoading={isLoading}
          deliveryType={selectedOption}
        />
      )}

      <Modal open={showShippingPopup} onClose={() => setShowShippingPopup(false)} className="flex align-center justify-center">
        <div className="mt-[18%] p-6 bg-white rounded-md w-1/2 h-[150px] text-center">
          <h2 className="text-xl font-bold">Shipping Confirmation</h2>
          <p>Is your shipping address the same as your current location?</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="contained" color="primary" onClick={() => handleShippingConfirmation(true)}>Yes</Button>
            <Button variant="contained" color="error" onClick={() => handleShippingConfirmation(false)}>No</Button>
          </div>
        </div>
      </Modal>

      <button
        className="bg-black w-full text-white p-2 rounded-lg mt-4"
        onClick={() => {
          localStorage.removeItem('selectedShippingDealers');
          localStorage.removeItem('dealerData');
          navigate("/checkout/billing");
        }}
      >
        Continue
      </button>
    </div>
  );
}
