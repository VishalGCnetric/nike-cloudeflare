import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { toast } from 'react-toastify'; // For toast notifications
import axios from 'axios'; // For geocoding requests
import ShopSelectionModal from './ShopSelectionModal'; // Custom modal for shop selection
import { useNavigate } from 'react-router-dom';
import { fetchEligibleDealers } from '../../redux/slices/cartSlice';

const dummyshop = {
  data: [
    {
      variantId: "107",
      variantName: "Air Jordan 1 Low SE Brown/Sail/Neutral Grey/Archaeo Brown",
      sku: "HF1567-200",
      sellers: [
        {
          sellerId: "3",
          sellerName: "Sneakersnstuff",
          price: 1149500,
          coordinates: { lat: 76.6126324, lng: 18.2604291 },
          mapLink: "https://maps.app.goo.gl/ginWn95sFEK5PWKF8",
        },
        {
          sellerId: "2",
          sellerName: "Dev Logistics",
          price: 274750,
          coordinates: { lat: 75.6326324, lng: 18.2604291 }
          ,
          mapLink: "https://www.google.com/maps/place/Chandni+Chowk,+Delhi/@28.6513747,77.2316374,15z/",
        }
      ],
    },
    {
      variantId: "150",
      variantName: "Jordan Artist Series By Darien Birks Dark Smoke Grey",
      sku: "HF5470-070",
      sellers: [
        {
          sellerId: "2",
          sellerName: "Dev Logistics",
          price: 274750,
          coordinates: { lat: 75.6326324, lng: 18.2604291 }
          ,
          mapLink: "https://www.google.com/maps/place/Chandni+Chowk,+Delhi/@28.6513747,77.2316374,15z/",
        },
        {
          sellerId: "5",
          sellerName: "Finish Line",
          price: 549500,
          coordinates: { lat: 76.1826324, lng: 18.7304291 },
          mapLink: "https://maps.app.goo.gl/tSQsEzQzpZca7uZc6",
        },
      ],
    },
  ],
};

const ShippingDetails = () => {
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.cart.eligibleDealers);
 
  const status = useSelector((state) => state.cart.status);
  const error = useSelector((state) => state.cart.error);
  const [isLoading, setIsLoading] = useState(false);

  const [locationGranted, setLocationGranted] = useState(false);
  const [browserCoordinates, setBrowserCoordinates] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('shipping');
  const [selectedShop, setSelectedShop] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [shippingCoordinates, setShippingCoordinates] = useState(null);
  const [showShippingPopup, setShowShippingPopup] = useState(false);
const navigate=useNavigate();
  // Get shipping data from Redux store or localStorage
  const shippingData =  JSON.parse(localStorage.getItem('shippingAddress'));
 // Dispatch fetchEligibleDealers when the modal opens and show loader
useEffect(() => {
  if (isModalOpen) {
    setIsLoading(true); // Show loader when fetching starts
    dispatch(fetchEligibleDealers()).finally(() => setIsLoading(false)); // Hide loader once fetching is done
  }
}, [dispatch, isModalOpen]);


  // Request browser location permission
  useEffect(() => {
    const geoOptions = {
      enableHighAccuracy: true, // More accurate, but drains battery
      timeout: 10000, // Timeout in 10 seconds
      maximumAge: 0,  // Do not use cached position
    };
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationGranted(true);
        // setPosition([18.2604291, 76.1826324]);

        // setBrowserCoordinates({
        //     lng:18.2604291,
        //     lat:76.1826324
        // });
        // console.log(position.coords.latitude,position.coords.longitude)
        setBrowserCoordinates({lat:parseFloat(position.coords.longitude), lng: parseFloat(position.coords.latitude) });

        // setBrowserCoordinates([position.coords.latitude,position.coords.longitude]);
        //   lat: position.coords.latitude,
        //   lng: position.coords.longitude,
        // });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log('User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.log('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            console.log('The request to get user location timed out.');
            break;
          default:
            console.log('An unknown error occurred.');
            break;
        }
        setLocationGranted(false);
      },
      geoOptions
    );
  }, []);
 
// console.log(locationGranted,browserCoordinates);
  // Fetch nearby shops based on browser coordinates
  useEffect(() => {
    if (browserCoordinates && isModalOpen) {
      const shopsWithin50km = shop?.reduce((acc, variant) => {
        const nearbySellers = variant.sellers.map((seller) => {
          let distance = calculateDistance(
            browserCoordinates.lat,
            browserCoordinates.lng,
            seller.coordinates.lng,
            seller.coordinates.lat
          );
          distance = Math.ceil(distance);
          // console.log(`Distance from user to seller (${seller.sellerName}): ${distance} km`);
          return {
            ...seller,
            distance, // Add the distance to the seller object
          };
        }).filter(seller => seller.distance <= 50); // Keep only those within 51km
  
        // Ensure the variant is added even if there are no sellers within 50km
        acc.push({
          sku: variant.sku,
          variantId: variant.variantId,
          variantName: variant.variantName,
          sellers: nearbySellers.length ? nearbySellers : [], // If no sellers, send an empty array
        });
  
        return acc;
      }, []);
  
      setNearbyShops(shopsWithin50km);
    }
  }, [browserCoordinates, shop, isModalOpen]);
  
  
  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

  // Attempt address geocoding
  const attemptAddressGeocoding = async (address) => {
    const performGeocoding = async (query) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setBrowserCoordinates({lat:parseFloat(lon), lng: parseFloat(lat) });
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
      `${address.postalCode} `
    ];

    for (const query of geocodePriorities) {
      const found = await performGeocoding(query);
      if (found) return;
    }

    toast.error('Address not found. Please opt for normal shipping.');
  };

  // Handle shipping option change
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
      if (!browserCoordinates && shippingData) {
        await attemptAddressGeocoding(shippingData);
      }
      setShowShippingPopup(true);
      // setSelectedOption("shipping")
    }
  };

  // Handle shop selection and close modal
  const handleShopSelection = (shop) => {
    setSelectedShop(shop);
    setIsModalOpen(false);

    localStorage.setItem("selectedShop", JSON.stringify(shop));
    

  };

  // Handle shipping confirmation
  const handleShippingConfirmation = async (useCurrentLocation) => {
    if (useCurrentLocation) {
      setShippingCoordinates(browserCoordinates);
    } else if (shippingData) {
      await attemptAddressGeocoding(shippingData);
    }
    setShowShippingPopup(false);
    setIsModalOpen(true);
  };
// console.log("NearbyShop",nearbyShops)
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shipping Details</h1>
      
      <RadioGroup value={selectedOption} onChange={handleOptionChange}>
        <FormControlLabel value="shipping" control={<Radio />} label="Ship to my address" />
        {locationGranted && (
          <>
            <FormControlLabel value="pickup" control={<Radio />} label="Pick from dealer" />
            <FormControlLabel value="ship" control={<Radio />} label="Ship from dealer" />
          </>
        )}
      </RadioGroup>

      <ShopSelectionModal
        isOpen={isModalOpen}
        onClose={() =>{ setIsModalOpen(false)
          // setSelectedOption("shipping")

        }}
        setSelectedOption={setSelectedOption}
        coordinates={browserCoordinates }
        nearbyShops={nearbyShops}
        onSelectShop={handleShopSelection}
        isLoading={isLoading} // Pass the loader state to the modal
        deliveryType={selectedOption}
      />

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
      onClick={()=>{
        localStorage.removeItem('selectedShippingDealers');
        localStorage.removeItem('dealerData');
        // localStorage.removeItem('selectedShippingDealers');

        // localStorage.clear();
        navigate("/checkout/billing")}


    }
        className="w-full bg-black text-white p-2 rounded-lg hover:bg-zinc-800"
        disabled={!selectedShop && selectedOption !== 'shipping'}>
        Continue
      </button>
    </div>
  );
};

export default ShippingDetails;
