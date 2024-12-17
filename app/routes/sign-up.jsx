import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from '@remix-run/react';
import { signup } from '../utils/api'; // Utility function for the signup API

// Action function for handling form submission
import { json, redirect } from '@remix-run/node';

export let action = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());

  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const email = formData.get('email');
  const password = formData.get('password');
  const phoneNumber = formData.get('phoneNumber');

  try {
    // Make API call to signup the user
    await signup({ firstName, lastName, email, password, phoneNumber });

    // Redirect to login on successful signup
    return redirect('/login');
  } catch (error) {
    // Return error details to the client
    return json(
      { error: error.message || 'Sign-up failed. Please try again.' },
      { status: 400 }
    );
  }
};

import { useActionData } from '@remix-run/react';

const NikeSignUpForm = () => {
  const actionData = useActionData();

  // Display error toast if actionData contains an error
  if (actionData?.error) {
    toast.error(actionData.error, { autoClose: 3000 });
  }

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
      <Form method="post">
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email*"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password*"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number*"
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Create Account
        </button>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already a member?{' '}
            <a href="/login" className="text-blue-600">
              Sign In
            </a>
          </p>
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default NikeSignUpForm;
