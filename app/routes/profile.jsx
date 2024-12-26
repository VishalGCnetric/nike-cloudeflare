import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';

import { getSession } from '../utils/cookies';
import { getUserDetails } from '../utils/api'; // Uncomment if API utility is implemented

// Loader function to fetch data server-side
export const loader = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("Cookie") || "";
    const session = await getSession(cookieHeader);
    const token = session.get("token");

    if (!token) {
      throw new Error("Unauthorized");
    }

    const response = await getUserDetails(token); // Assuming this fetches user details
    if (!response) {
      throw new Error("Failed to fetch user details.");
    }

    return json(response.data.activeCustomer);
  } catch (error) {
    console.error("Error in loader:", error);
    return json({ error: error.message }, { status: 500 });
  }
};

const Profile = () => {
  const data = useLoaderData();
  // Loading and error handling
  if (!data || data.error) {
    return <div className="text-center text-red-500">Error: {data?.error || "Unable to load profile."}</div>;
  }

  // Find the default billing and shipping addresses
  const defaultBillingAddress = data?.addresses?.find((address) => address.defaultBillingAddress);
  const defaultShippingAddress = data?.addresses?.find((address) => address.defaultShippingAddress);

  return (
    <div className=" flex w-[90vw] mx-auto p-4">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 border p-4 mb-4 md:mb-0">
          <ul className="space-y-4">
            <li className="font-bold border-l-4 border-red-500 pl-2">My Account</li>
            <li>
              <Link to="/orderlist" className="hover:bg-gray-100 block p-2">
                My Orders
              </Link>
            </li>
            <li className="hover:bg-gray-100 p-2 cursor-pointer">My Wish List</li>
            <li className="hover:bg-gray-100 p-2 cursor-pointer">Address Book</li>
            <li className="hover:bg-gray-100 p-2 cursor-pointer">Store Credit & Refunds</li>
            <li className="hover:bg-gray-100 p-2 cursor-pointer">My RMA Requests</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4 md:pl-6">
          <h2 className="text-2xl font-bold mb-6">MY ACCOUNT</h2>

          {/* Account Information */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Account Information</h3>
            <div>
              <p>
                <b>Name:</b> {`${data?.firstName || 'N/A'} ${data?.lastName || ''}`}
              </p>
              <p>
                <b>Email:</b> {data?.emailAddress || 'N/A'}
              </p>
              <p>
                <b>Phone Number:</b> {data?.phoneNumber || 'N/A'}
              </p>
            </div>
          </section>

          {/* Address Book */}
          <section className="mb-8">
            <h3 className="text-xl font-bold mb-4">Address Book</h3>
            <p>
              <Link to="#" className="text-primary hover:underline">
                Manage Addresses
              </Link>
            </p>
          </section>

          {/* Default Addresses */}
          <div className="flex justify-between">
            {/* Default Billing Address */}
            <div className="w-1/2 pr-4">
              <h3 className="text-xl font-bold mb-2">Default Billing Address</h3>
              {defaultBillingAddress ? (
                <div>
                  <p>{defaultBillingAddress.fullName}</p>
                  <p>
                    {defaultBillingAddress.streetLine1}, {defaultBillingAddress.streetLine2}
                  </p>
                  <p>
                    {defaultBillingAddress.city}, {defaultBillingAddress.province},{' '}
                    {defaultBillingAddress.postalCode}
                  </p>
                  <p>{defaultBillingAddress.country.name}</p>
                  <p>{defaultBillingAddress.phoneNumber}</p>
                </div>
              ) : (
                <p>You have not set a default billing address.</p>
              )}
              <Link to="#" className="text-primary hover:underline">
                EDIT ADDRESS
              </Link>
            </div>

            {/* Default Shipping Address */}
            <div className="w-1/2 pl-4">
              <h3 className="text-xl font-bold mb-2">Default Shipping Address</h3>
              {defaultShippingAddress ? (
                <div>
                  <p>{defaultShippingAddress.fullName}</p>
                  <p>
                    {defaultShippingAddress.streetLine1}, {defaultShippingAddress.streetLine2}
                  </p>
                  <p>
                    {defaultShippingAddress.city}, {defaultShippingAddress.province},{' '}
                    {defaultShippingAddress.postalCode}
                  </p>
                  <p>{defaultShippingAddress.country.name}</p>
                  <p>{defaultShippingAddress.phoneNumber}</p>
                </div>
              ) : (
                <p>You have not set a default shipping address.</p>
              )}
              <Link to="#" className="text-primary hover:underline">
                EDIT ADDRESS
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Orders Section */}
      {/* <div className="text-center text-muted-foreground mt-8">
        <p>You don't have any orders yet.</p>
      </div> */}
    </div>
  );
};

export default Profile;
