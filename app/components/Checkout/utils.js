import axios from 'axios';
import { toast } from 'react-toastify';

// Attempt address geocoding using Nominatim
export const attemptAddressGeocoding = async shippingData => {
	// Helper function to perform geocoding request
	const performGeocoding = async query => {
		try {
			const response = await axios.get(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
			);
			if (response.data.length > 0) {
				const { lat, lon } = response.data[0];
				return { lat: parseFloat(lat), lng: parseFloat(lon) };
			}
			return null;
		} catch (error) {
			console.error('Error fetching geocode:', error);
			return null;
		}
	};

	// Address queries to try
	const geocodePriorities = [
		`${shippingData.streetLine1}, ${shippingData.city}, ${shippingData.state}, ${shippingData.country}`,
		`${shippingData.streetLine2}, ${shippingData.city}, ${shippingData.state}, ${shippingData.country}`,
		`${shippingData.postalCode}, ${shippingData.city}, ${shippingData.state}, ${shippingData.country}`,
	];

	for (const query of geocodePriorities) {
		const coordinates = await performGeocoding(query);
		if (coordinates) {
			return coordinates;
		}
	}

	toast.error('Address not found. Please opt for normal shipping.');
	return null;
};
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c; // Distance in km
	return distance;
};
function deg2rad(deg) {
	return deg * (Math.PI / 180);
}
