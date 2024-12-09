import { Form, useActionData } from '@remix-run/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect, json } from '@remix-run/node';

// Simulated login function
async function loginUser({ email, password }) {
  // Mock validation for demonstration
  if (email !== 'test@nike.com' || password !== 'password123') {
    throw new Error('Invalid credentials');
  }
  return true;
}

// Action function for handling the form submission
export let action = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    // Simulate login API call
    await loginUser({ email, password });

    // Redirect to the homepage on successful login
    return redirect('/');
  } catch (error) {
    // Return the error message explicitly
    return json({ error: error.message }, { status: 400 });
  }
};

const NikeSignInForm = () => {
  // Get error data from the action
  const actionData = useActionData();

  // Display toast notification if there's an error
  if (actionData?.error) {
    toast.error(actionData.error, { position: 'top-center', autoClose: 3000 });
  }

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <div className="w-[100%] flex items-center justify-center space-x-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
          alt="Nike Logo"
          className="h-6"
        />
        <img
          src="https://th.bing.com/th?id=OIP.TWDOn4eq1Zipw770Qken7gHaG6&w=258&h=241&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
          alt="Jordan Logo"
          className="h-8 mr-72"
        />
      </div>
      <h2 className="text-2xl font-bold mb-2">Sign In to Your Nike Account</h2>
      <Form method="post" aria-describedby="form-error">
        {actionData?.error && (
          <div
            id="form-error"
            className="mb-4 text-red-600 text-sm"
            role="alert"
          >
            {actionData.error}
          </div>
        )}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address*"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby="form-error"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password*"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby="form-error"
          />
        </div>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="rememberMe" className="mt-1" />
            <label htmlFor="rememberMe" className="text-sm">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-blue-600">
            Forgot password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg text-center font-semibold hover:bg-gray-800 transition duration-200"
        >
          Sign In
        </button>
      </Form>
      <div className="mt-6 text-center">
        <p className="text-sm">
          Not a member?{' '}
          <a href="/sign-up" className="text-blue-600">
            Join Us
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NikeSignInForm;
