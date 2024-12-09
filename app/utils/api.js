// utils/api.js
const api = process.env.REACT_APP_BASE_URL;

// Utility function to handle API requests
const fetchData = async (url, method = 'GET', body = null) => {
	const token = sessionStorage.getItem('token'); // Retrieve the token from session storage
	const headers = {
		'Content-Type': 'application/json',
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`; // Attach token if available
	}

	const options = {
		method,
		headers,
	};

	if (body) {
		options.body = JSON.stringify(body); // If it's a POST or PUT request, add the request body
	}

	try {
		const response = await fetch(`${api}${url}`, options);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Something went wrong!');
		}

		return data; // Return the data from the response
	} catch (error) {
		throw new Error(error.message || 'Something went wrong!');
	}
};

// Example function to sign up a user
export const signupUser = async userData => {
	try {
		const response = await fetchData('/signup', 'POST', userData);
		sessionStorage.setItem('token', response.token); // Save the token after signup
		sessionStorage.setItem('user', JSON.stringify(response.user)); // Save the user data
		return response;
	} catch (error) {
		throw new Error(error.message || 'Signup failed');
	}
};

// Example function to log in a user
export const loginUser = async credentials => {
	try {
		const response = await fetchData('/login', 'POST', credentials);
		sessionStorage.setItem('token', response.token); // Save the token after login
		sessionStorage.setItem('user', JSON.stringify(response.user)); // Save the user data
		return response;
	} catch (error) {
		throw new Error(error.message || 'Login failed');
	}
};

// Example function to fetch content (with token if logged in)
export const fetchContent = async () => {
	try {
		const data = await fetchData('/content');
		return data;
	} catch (error) {
		throw new Error(error.message || 'Failed to fetch content');
	}
};

// POST request: Create new resource (e.g., signup, add item, etc.)
export const postRequest = async (url, body) => {
	try {
		const data = await fetchData(url, 'POST', body);
		return data;
	} catch (error) {
		throw new Error(error.message || 'Failed to create resource');
	}
};

// PUT request: Update an existing resource
export const updateRequest = async (url, body) => {
	try {
		const data = await fetchData(url, 'PUT', body);
		return data;
	} catch (error) {
		throw new Error(error.message || 'Failed to update resource');
	}
};

// DELETE request: Delete an existing resource
export const deleteRequest = async url => {
	try {
		const data = await fetchData(url, 'DELETE');
		return data;
	} catch (error) {
		throw new Error(error.message || 'Failed to delete resource');
	}
};
