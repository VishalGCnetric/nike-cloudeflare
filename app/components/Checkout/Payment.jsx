import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStripe } from "react-icons/fa6"; // Importing Stripe icon
import CheckoutSuccessModal from "./CheckoutSuccessModel";

const PaymentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isModalVisible, setModalVisible] = useState(false);
  const [datas, setData] = useState(null);
  const { cart, status } = useSelector((state) => state.cart);
  const [sdkReady, setSdkReady] = useState(false);
  const paypalCardRef = useRef(null);
  const paypalRef = useRef(null);

  useEffect(() => {
    if ((paymentMethod === "card" || paymentMethod === "paypal") && !sdkReady) {
      const scriptExists = document.querySelector(
        `script[data-namespace="paypal_sdk"]`
      );

      if (!scriptExists) {
        const addPaypalScript = async () => {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `https://www.paypal.com/sdk/js?client-id=AUKvP8ae0aMLtrs2Fxk76rEV_02atz98Zn_mkIFlBpmogGo2iAzBc4iLeKhIDxCOKuPAg6R70OgNOClL&currency=USD&components=buttons,funding-eligibility`;
          script.setAttribute("data-namespace", "paypal_sdk");
          script.async = true;
          script.onload = () => {
            setSdkReady(true);
          };
          script.onerror = () => {
            console.error("PayPal SDK failed to load.");
          };
          document.body.appendChild(script);
        };
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [paymentMethod, sdkReady]);

  useEffect(() => {
    if (sdkReady && paymentMethod === "paypal") {
      if (paypalRef.current) {
        const rupeeToDollarRate = 0.012; // Example conversion rate (you can fetch this dynamically if needed)
        const cartTotalInDollars = (cart?.total * rupeeToDollarRate).toFixed(2); // Convert cart total to dollars

        window?.paypal_sdk
          ?.Buttons({
            style: {
              layout: "horizontal",
            },
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: cartTotalInDollars, // Use the converted value in dollars
                    },
                  },
                ],
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then((details) => {
                handlePayPalSuccess(details, data);
              });
            },
            onError: (err) => {
              console.error("PayPal Error:", err);
            },
          })
          .render(paypalRef.current);
      }
    }
  }, [sdkReady, paymentMethod, cart?.total]); // Add cart.total as a dependency

  const handlePlaceOrder = () => {
    let shippingAddress = JSON.parse(
      localStorage.getItem("shippingAddress") || "{}"
    );
    const dealerData = JSON.parse(localStorage.getItem("dealerData"));
    const cartId = JSON.parse(localStorage.getItem("cartId"));

    let data;
    if (dealerData) {
      data = JSON.stringify({
        cartId,
        shippingAddress,
        dealer: dealerData.dealer,
      });
    } else {
      data = JSON.stringify({
        cartId,
        shippingAddress,
      });
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}/checkout`,
      headers: {
        accesstoken: sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const { orderId, expectedDelivery } = response.data;
        dispatch({
          type: "checkout/setCheckoutDetails",
          payload: { orderId, expectedDelivery },
        });
        setData({ orderId, expectedDelivery });
        setModalVisible(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePayPalSuccess = (details, data) => {
    console.log("Payment Successful:", details);
    handlePlaceOrder();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigate("/"); // Redirect to home page
  };

  const handleStripePayment = async () => {
    // console.log(auth);
    let email =
      "v@mail.com" || JSON.parse(localStorage.getItem("userInfo")).email;
    try {
      await checkoutStripePayment(cart, email);
      // Handle successful Stripe payment logic here
    } catch (error) {
      console.error("Stripe payment failed");
    }
  };

  const checkoutStripePayment = (Cart, custEmail) => {
    console.log("this is stripe API testing", Cart, custEmail);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      `Bearer sk_test_51NBwWXSGTUXQrd4JyICqJIf64RVbq1t3vfAroiNGqRD87s3a31DvzicmmFvamzuK8gWDW4wY2E8D49fRiQRVxd3000CdSHv08F`
    );

    var urlencoded = new URLSearchParams();
    urlencoded.append("cancel_url", "http://13.126.66.2:2024/Error");
    urlencoded.append(
      "success_url",
      `http://localhost:3000/payment/${Cart.id}`
    );
    urlencoded.append("customer_email", custEmail);

    // const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"));
    // urlencoded.append("shipping[name]", shippingAddress.firstName);
    // urlencoded.append("shipping[address][line1]", shippingAddress.streetLine1);
    // urlencoded.append("shipping[address][line2]", shippingAddress.streetLine2);
    // urlencoded.append(
    //   "shipping[address][postal_code]",
    //   shippingAddress.postalCode
    // );
    // urlencoded.append("shipping[address][city]", shippingAddress.city);
    // urlencoded.append("shipping[address][state]", shippingAddress.state);
    // urlencoded.append(
    //   "shipping[address][country]",
    //   shippingAddress.country || "IN"
    // );

    Cart.lines.forEach((each, index) => {
      urlencoded.append(`line_items[${index}][price_data][currency]`, "INR");
      urlencoded.append(
        `line_items[${index}][price_data][product_data][name]`,
        each.productVariant.name
      );
      urlencoded.append(
        `line_items[${index}][price_data][product_data][description]`,
        each.productVariant.name
      );
      urlencoded.append(
        `line_items[${index}][price_data][product_data][images][0]`,
        each.productVariant.featuredAsset.url
      );
      urlencoded.append(
        `line_items[${index}][price_data][unit_amount]`,
        each.productVariant.price * 100
      );
      urlencoded.append(`line_items[${index}][quantity]`, each.quantity);

      // Add shipping options (if needed)
      urlencoded.append(
        `shipping_options[${index}][shipping_rate_data][display_name]`,
        "BlueDart"
      );
      urlencoded.append(
        `shipping_options[${index}][shipping_rate_data][fixed_amount][amount]`,
        "1000"
      );
      urlencoded.append(
        `shipping_options[${index}][shipping_rate_data][fixed_amount][currency]`,
        "INR"
      );
      urlencoded.append(
        `shipping_options[${index}][shipping_rate_data][type]`,
        "fixed_amount"
      );
    });

    urlencoded.append("mode", "payment");
    urlencoded.append(`payment_method_types[0]`, "card");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch("https://api.stripe.com/v1/checkout/sessions", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          console.log("Stripe response", result.url);
          localStorage.removeItem("LocalCartItems");

          // const paymentData = {
          //   cartId: Cart?.id,
          //   shippingAddress,
          // };
          handlePlaceOrder();

          window.location.replace(result.url);
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Have a promo code?</h2>
      <input
        type="text"
        placeholder="Enter promo code"
        className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
      />

      <h2 className="text-xl font-semibold mb-4">How would you like to pay?</h2>

      {/* Credit/Debit Card Option */}
      <div className="flex items-center mb-6">
        <input
          type="radio"
          id="card"
          name="payment-method"
          className="mr-3"
          checked={paymentMethod === "card"}
          onChange={() => setPaymentMethod("card")}
        />
        <label htmlFor="card" className="text-gray-700 text-lg">
          Credit or Debit Card
        </label>
      </div>

      {paymentMethod === "card" && (
        <div className="mt-4">
          {/* Stripe Button */}
          <button
            onClick={handleStripePayment}
            className="flex items-center justify-center w-full bg-purple-600 text-white mb-2 rounded-lg hover:bg-purple-700 transition"
          >
            <FaStripe className="mr-2" size={48} />

            {/* Pay with Stripe */}
          </button>
        </div>
      )}

      {/* PayPal Option */}
      <div className="flex items-center mb-6">
        <input
          type="radio"
          id="paypal"
          name="payment-method"
          className="mr-3"
          checked={paymentMethod === "paypal"}
          onChange={() => setPaymentMethod("paypal")}
        />
        <label htmlFor="paypal" className="text-gray-700 text-lg">
          PayPal
        </label>
      </div>

      {paymentMethod === "paypal" && (
        <div className="mt-4">
          {sdkReady ? (
            <div
              id="paypal-button-container"
              ref={paypalRef}
              className="paypal-button-container"
            ></div>
          ) : (
            <p>Loading PayPal...</p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">
        By clicking Place Order, you agree to the{" "}
        <a href="#" className="text-blue-500">
          Terms and Conditions
        </a>
        .
      </p>

      <CheckoutSuccessModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        orderId={datas?.orderId}
        expectedDelivery={datas?.expectedDelivery}
      />
    </div>
  );
};

export default PaymentForm;
