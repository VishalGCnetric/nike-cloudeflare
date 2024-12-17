const api = 'http://4.240.112.193:50102';
// src/utils/api.js

// const api = import.meta.env.REACT_APP_BASE_URL || "http://4.240.112.193:50102";

/**
 * Fetch product by ID from the API.
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<object>} - Returns product data or throws an error.
 */
export const fetchProductById = async productId => {
	try {
		const response = await fetch(`${api}/product?productId=${productId}`);

		if (!response.ok) {
			throw new Error(`Error fetching product: ${response.statusText}`);
		}

		const product = await response.json();

		if (!product || !product.product) {
			throw new Error('Product data is missing');
		}

		return product.product;
	} catch (error) {
		console.error('API Error:', error.message);
		throw error;
	}
};

// Login API Function
export async function loginUser(data) {
	const response = await fetch('http://4.240.112.193:50102/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Login failed. Please try again.');
	}

	return await response.json(); // Returns the token or other response data
}

/**
 * Fetch user details from the server
 * @param {string} token - The access token for authentication
 * @returns {Promise<object>} - Resolves with user details data
 * @throws {Error} - Throws an error if the request fails
 */
export const getUserDetails = async token => {
	try {
		const response = await fetch(`${api}/me`, {
			method: 'GET',
			headers: {
				accesstoken: token,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to fetch user details');
		}

		const data = await response.json();
		return data; // Adjust based on your API response structure
	} catch (error) {
		throw new Error(error.message || 'An unexpected error occurred');
	}
};

/**
 * Fetch all orders from the server
 * @param {string} token - The access token for authentication
 * @returns {Promise<object>} - Resolves with the orders data
 * @throws {Error} - Throws an error if the request fails
 */
export const getAllOrders = async token => {
	const response = await fetch('http://4.240.112.193:50102/orders', {
		method: 'GET',
		headers: {
			accesstoken: token, // Add the token here
		},
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to fetch orders');
	}

	return response.json();
};

// api.js
export async function getOrderDetails(orderId, token) {
	const url = `http://4.240.112.193:50102/order?orderId=${orderId}`;
	const headers = {
		accesstoken: token,
	};

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: headers,
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = await response.json();
		console.log('Order details:', data.data.order);
		return data.data.order;
	} catch (error) {
		console.error('Failed to fetch order details:', error);
		return null;
	}
}

// utils/api.js

// Utility function to fetch dealers
export async function fetchDealers(accessToken) {
	const url = `${api}/elgDealers`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				accesstoken: accessToken,
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch dealers: ${response.statusText}`);
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Error fetching dealers:', error);
		throw error;
	}
}

export async function checkout(token, data) {
	try {
		const response = await fetch(`${api}/checkout`, {
			method: 'POST',
			headers: {
				accesstoken: token,
				'Content-Type': 'application/json',
			},
			body: data,
		});

		if (!response.ok) {
			throw new Error(`Checkout failed: ${response.statusText}`);
		}

		const res = await response.json();
		return res;
	} catch (error) {
		console.error('Error during checkout:', error);
		throw error;
	}
}
const API_BASE_URL = 'http://4.240.112.193:50102'; // Base URL for your API

/**
 * Utility function to handle POST requests
 * @param {string} endpoint - The API endpoint (e.g., "/signup")
 * @param {object} data - The data to be sent in the request body
 * @returns {Promise<object>} - The response data or error
 */
export async function postRequest(endpoint, data) {
	const url = `${API_BASE_URL}${endpoint}`;
	const headers = {
		'Content-Type': 'application/json',
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Something went wrong');
		}

		return await response.json(); // Return the response data
	} catch (error) {
		console.error('Error in POST request:', error.message);
		throw error;
	}
}

/**
 * Signup function to register a new user
 * @param {object} userData - The signup details (e.g., firstName, lastName, etc.)
 * @returns {Promise<object>} - The API response
 */
export async function signup(userData) {
	return await postRequest('/signup', userData);
}
