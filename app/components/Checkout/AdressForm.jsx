import { useActionData, Form, useNavigate,  } from '@remix-run/react';

import  { useEffect } from 'react';

// KV Namespace (Cloudflare-specific, provided by the environment)


export default function AddressForm() {
  const actionData = useActionData();
  const navigate = useNavigate();

  // Effect to handle saving to local storage and redirecting
  useEffect(() => {
    if (actionData?.success) {
      const addressData = JSON.stringify(actionData.address);
      localStorage.setItem('shippingAddress', addressData); // Save address to local storage
      navigate('/checkout/shipping'); // Redirect to the billing page
    }
  }, [actionData, navigate]);
  return (
    <div className="max-w-md mx-auto p-4 bg-card rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Enter your shipping address:</h2>
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="firstName">First Name</label>
          <input type="text" name="firstName"   className="mt-1 block w-full rounded-md p-2 border border-border" required  />
        </div>

        <div>
          <label htmlFor="lastName">Last Name</label>
          <input type="text" name="lastName" required className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label htmlFor="landmark">Landmark</label>
          <input type="text" name="landmark" className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label htmlFor="streetLine1">Street Line 1</label>
          <input type="text" name="streetLine1" required className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label htmlFor="streetLine2">Street Line 2</label>
          <input type="text" name="streetLine2" className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input type="text" name="postalCode" required className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input type="text" name="city" required className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label htmlFor="state">State</label>
          <input type="text" name="state" required className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label htmlFor="countryCode">Country Code</label>
          <input type="text" name="countryCode" defaultValue="IN" required className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="tel" name="phoneNumber" required className="mt-1 block w-full rounded-md p-2 border border-border" />
        </div>

        <div>
          <label>
            <input type="checkbox" name="isDefaultBilling" /> Use as Billing Address
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" name="isDefaultShipping" /> Use as Default Shipping Address
          </label>
        </div>

        <button type="submit" className="w-full p-2 font-semibold bg-gray-200 rounded hover:bg-black hover:text-white">
          Submit & Continue
        </button>
      </Form>
    </div>
  );
}
