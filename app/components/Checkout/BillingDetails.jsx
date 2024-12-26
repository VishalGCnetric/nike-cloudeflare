import { useNavigate } from "@remix-run/react";
import DeliveryInformation from "./DeliveryInformation";
import { lazy } from "react";
const ShopCart = lazy(() => import("./ShopCart"));

// Shared Tailwind CSS classes
const twClasses = {
  container: "p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md",
  header: "text-lg font-semibold text-zinc-800 dark:text-zinc-200",
  checkboxLabel: "text-zinc-700 dark:text-zinc-300",
  button: "bg-primary text-primary-foreground rounded-full px-4 py-2 mb-4",
  border: "border-t border-zinc-300 dark:border-zinc-700",
  subHeader: "font-medium text-zinc-800 dark:text-zinc-200",
  content: "text-zinc-700 dark:text-zinc-300",
  editButton: "text-blue-600 hover:underline",
};

const BillingComponent = () => {
  const navigate = useNavigate();

  // Use server data if available; fallback to localStorage for development selectedShippingDealers
  const data =
    JSON.parse(localStorage.getItem("selectedShippingDealers")) || [];
  if (data.length > 0) {
    return (
      <div className="mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-6">
          {data ? "Selected Shipping Dealers" : "Ship To Delivery address"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {data.map((variant) => (
            <div
              key={variant.variantId}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                {variant.variantName}
              </h3>
              <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
              <div className="mt-4">
                {variant.sellers.map((seller) => (<>
                   <ShopCart key={seller.id} shop={seller} />
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/checkout/payment")}
          className="w-full mt-6 bg-black text-white mb-5 py-3 rounded-lg hover:bg-gray-800"
        >
          Continue
        </button>
      </div>
    );
  }

  // Show normal UI if no data is available
  return (
    <div className={twClasses.container}>
      <h2 className={twClasses.header}>What&apos;s your billing address?</h2>
      <div className="flex items-center my-4">
        <input
          type="checkbox"
          id="billingMatches"
          className="mr-2"
          defaultChecked
        />
        <label htmlFor="billingMatches" className={twClasses.checkboxLabel}>
          Billing matches shipping address
        </label>
      </div>
      <button
        onClick={() => navigate("/checkout/payment")}
        className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
      >
        Continue
      </button>
      <div className={twClasses.border}></div>
      <DeliveryInformation />
    </div>
  );
};

export default BillingComponent;
