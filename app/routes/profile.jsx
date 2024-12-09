import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import ShoppingLoader from '../components/Loader/ShoppingLoader';
// import { getUserDetails } from '../utils/api';

// Loader function to fetch data server-side
export const loader = async () => {
  try {
    // const response = await getUserDetails();
    return json(response.data.activeCustomer);
  } catch (error) {
    throw json({ message: 'Unable to fetch user details' }, { status: 500 });
  }
};

const Profile = () => {
  const data = useLoaderData();

  // Find the default billing and shipping addresses
  const defaultBillingAddress = data?.addresses?.find(address => address.defaultBillingAddress);
  const defaultShippingAddress = data?.addresses?.find(address => address.defaultShippingAddress);

  if (!data) {
    return <ShoppingLoader />;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Content */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 border p-4 mb-4 md:mb-0">
          <ul className="space-y-4">
            <li className="font-bold border-l-4 border-red-500 pl-2">My Account</li>
            <li>
              <Link to="/all-orders" className="hover:bg-gray-100 block p-2">
                My Orders
              </Link>
            </li>
            <li className="hover:bg-gray-100 p-2 cursor-pointer">My Wish List</li>
            <li className="hover:bg-gray-100 p-2 cursor-pointer">Address Book</li>
            <li className="hover:bg-gray-100 p-2 cursor-pointer">Store Credit & Refunds</li>
            <li className="hover:bg-gray-100 p-2 cursor-pointer">My RMA Requests</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 md:pl-6">
          <h2 className="text-2xl font-bold mb-6">MY ACCOUNT</h2>

          <div className="mb-8">
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
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Address Book</h3>
            <p>
              <Link to="#" className="text-primary">
                Manage Addresses
              </Link>
            </p>
          </div>

          <div className="flex justify-between">
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
        </div>
      </div>

      {/* Orders Section */}
      <div className="text-center text-muted-foreground mt-8">
        <p>You don't have any orders yet</p>
      </div>
    </div>
  );
};

export default Profile;
