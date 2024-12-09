import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from '@remix-run/react';
import { signupUser } from '../utils/api';

// Action function for handling form submission
export let action = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const email = formData.get('email');
  const password = formData.get('password');
  const phoneNumber = formData.get('phoneNumber');

  try {
    // Call your signup logic here (e.g., dispatching an action to your redux store or server-side logic)
    // For example, you can use a utility function for making an API request:
    await signupUser({ firstName, lastName, email, password, phoneNumber });

    // Redirect to the sign-in page on successful signup
    return redirect('/auth/signin');
  } catch (error) {
    // Handle errors (e.g., return an error message to the client)
    return json({ error: 'Sign-up failed. Please try again.' }, { status: 400 });
  }
};

const NikeSignUpForm = () => {
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
