import { json,  useParams } from "@remix-run/react";
import AddressForm from "../components/Checkout/AdressForm";
import OrderDetails from "../components/Checkout/OrderDetails";
import BillingComponent from "../components/Checkout/BillingDetails";
import PaymentForm from "../components/Checkout/Payment";
// import OrderForm from "../components/Checkout/OrderForm";
import OrderSummary from "../components/Checkout/OrderSummary";
import { getSession } from "../utils/cookies";
import { getCart } from "../utils/cartutils";
import { fetchDealers } from "../utils/api";

export default function Checkout() {
  const { step } = useParams(); // Fetch the dynamic `step` parameter from the URL

  return (
    <div className="mx-auto w-[80%] md:flex md:justify-around">
      <div className="md:w-[50%]">
        {/* Conditional rendering based on the `step` */}
        {step === "address" && <AddressForm />}
        {step === "shipping" && <OrderDetails />}
        {step === "billing" && <BillingComponent />}
        {step === "payment" && <PaymentForm />}
        {/* {!step && <OrderForm />} */}
      </div>

      <div className="md:w-[40%]">
        <OrderSummary />
      </div>
    </div>
  );
}


// export const loader = async ({ context, request }) => {
//   // Extract token from session
//   const cookieHeader = request.headers.get("Cookie") || "";
//   const session = await getSession(cookieHeader);
//   const token = session.get("token");

//   if (!token) {
//     return json({ error: "Unauthorized: Token not found" }, { status: 401 });
//   }

//   try {
//     // Fetch cart details
//     const cart = await getCart(token);
//     if (!cart) {
//       return json({ error: "Cart is empty or not found" }, { status: 404 });
//     }

   
//     const eligibleDealers = await fetchDealers(token);

//     // Fetch shipping address from KV storage
//     let shippingAddress = await context.env.cache.get(`shippingAddress`);
//     if (shippingAddress) {
//       shippingAddress = JSON.parse(shippingAddress);
//     } else {
//       return json({ error: 'Address not found' }, { status: 404 });
//     }
// console.log({ shippingAddress, eligibleDealers, cart })
//     // Return the combined response
//     return json({ shippingAddress, eligibleDealers, cart });

//   } catch (error) {
//     console.error('Error in loader:', error.message);
//     return json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// };

export const loader = async ({  request }) => {
  try {
    // Extract token from session
    const cookieHeader = request.headers.get("Cookie") || "";
    const session = await getSession(cookieHeader);

    if (!session) {
      console.error("Session is undefined");
      return json({ error: "Session not found" }, { status: 401 });
    }

    const token = session.get("token");
    if (!token) {
      return json({ error: "Unauthorized: Token not found" }, { status: 401 });
    }

    // Fetch cart details
    const cart = await getCart(token);
    if (!cart) {
      return json({ error: "Cart is empty or not found" }, { status: 404 });
    }

    // Fetch eligible dealers
    const eligibleDealers = await fetchDealers(token);


    console.log({  eligibleDealers, cart });
    return json({  eligibleDealers, cart });

  } catch (error) {
    console.error('Error in loader:', error.message);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};


export const action = async ({ request }) => {
  const formData = await request.formData();
  const addressData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    landmark: formData.get('landmark'),
    streetLine1: formData.get('streetLine1'),
    streetLine2: formData.get('streetLine2'),
    city: formData.get('city'),
    postalCode: formData.get('postalCode'),
    state: formData.get('state'),
    countryCode: formData.get('countryCode'),
    phoneNumber: formData.get('phoneNumber'),
    isDefaultBilling: formData.get('isDefaultBilling') === 'on',
    isDefaultShipping: formData.get('isDefaultShipping') === 'on',
  };

  try {
    // Simulate saving to a database or KV store (Cloudflare example)
    console.log('Saving address data:', addressData);

    // Return the addressData for display or further use
    return json({ success: true, address: addressData });
  } catch (error) {
    console.error('Error storing data:', error);
    return json({ success: false, error: 'Failed to save address data. Please try again.' }, { status: 500 });
  }
};
