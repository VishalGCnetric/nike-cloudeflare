// utils/cartUtils.js

const BASE_URL = 'https://composer.nike.universalcommerce.io/cart';

const getHeaders = token => {
	return {
		accesstoken: token,
		'Content-Type': 'application/json',
	};
};
export const getCart = async token => {
	console.log(token);
	try {
		const response = await fetch(BASE_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				accesstoken: token,
			},
		});
		console.log(response.ok);
		// if (!response.ok) {
		//   throw new Error('Failed to fetch cart');
		// }

		// Only call response.json() once and store the result in a variable
		const data = await response.json();
		console.log(data);
		return data.cart; // Return the parsed JSON data
	} catch (error) {
		console.error(error);
		throw error; // Rethrow error to handle in component
	}
};

export const updateCartQuantity = async (token, lineId, newQuantity) => {
	try {
		const response = await fetch(BASE_URL, {
			method: 'PUT',
			headers: getHeaders(token),
			body: JSON.stringify({ lineId, quantity: newQuantity }),
		});
		if (!response.ok) throw new Error('Failed to update cart item');
		return await response.json();
	} catch (error) {
		console.error(error);
		throw error; // Rethrow error to handle in component
	}
};

export const deleteFromCart = async (token, lineId) => {
	try {
		const response = await fetch(`${BASE_URL}?lineId=${lineId}`, {
			method: 'DELETE',
			headers: getHeaders(token),
		});
		if (!response.ok) throw new Error('Failed to delete cart item');
		return await response.json();
	} catch (error) {
		console.error(error);
		throw error; // Rethrow error to handle in component
	}
};

// utils/cartutils.js
export const addToCart = async (productVariantId, quantity, token) => {
	const response = await fetch(
		'https://composer.nike.universalcommerce.io/cart',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accesstoken: token, // Include your access token if required
			},
			body: JSON.stringify({ productVariantId, quantity }),
		},
	);

	if (!response.ok) {
		throw new Error('Failed to add item to cart');
	}

	return response.json(); // Assuming the API returns the updated cart data
};
