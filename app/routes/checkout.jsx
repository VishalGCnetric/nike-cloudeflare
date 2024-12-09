import React from 'react'
import { useLocation } from 'react-router-dom';
// import OrderForm from '../components/Checkout/OrderForm'
// import OrderDetails from '../component/Checkout/OrderDetails'
// import BillingComponent from '../component/Checkout/BillingDetails'
// import OrderSummary from '../component/Checkout/OrderSummary';
// import PaymentForm from '../component/Checkout/Payment';
// import AddressForm from '../component/Checkout/AdressForm';

const Checkout = () => {
  // Access query parameters using useLocation()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const step = searchParams.get('step'); // Get the step query parameter
  
  return (
    <div className="mx-auto w-[80%] md:flex md:justify-around">
      <div className="md:w-[50%] ">
        {/* Conditional rendering based on the "step" query parameter */}
       { step}
        {/* {step === "address" ? <AddressForm /> :
         step === "shipping" ? <OrderDetails /> :
         step === "billing" ? <BillingComponent /> :
         step === "payment" ? <PaymentForm /> : <OrderForm />} */}
      </div>

      <div className="md:w-[40%]">
        {/* <OrderSummary /> */}
      </div>
    </div>
  )
}

export default Checkout;
