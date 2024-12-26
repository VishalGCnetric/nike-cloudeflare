// import {   Form } from "@remix-run/react";
// import { useState } from "react";
// import Modal from "./Modal"; // Your custom modal component

// Dummy data for shipping address
const dummyData = {
  firstName: "John",
  lastName: "Doe",
  landmark: "Near Central Park",
  streetLine1: "123 Main St",
  streetLine2: "Apt 4B",
  city: "New York",
  postalCode: "10001",
  state: "NY",
  countryCode: "US",
  phoneNumber: "123-456-7890",
};

export default function DeliveryInformation() {
  // const { shippingAddress } = useLoaderData() || {}; // Ensure we safely destructure
  const shippingAddress=JSON.parse(localStorage.getItem("shippingAddress"))||{};
  // const [isModalOpen, setModalOpen] = useState(false);
console.log(shippingAddress)
  // Use updated address from action, or loader data as fallback
  const address = shippingAddress || dummyData;
  return (
    <div className="mt-6 border-t border-zinc-300 dark:border-zinc-600 pt-4">
      <h4 className="text-md font-bold text-zinc-800 dark:text-zinc-200">
        Delivery
      </h4>

      {address ? (
        <div>
          <div className="flex justify-between items-center">
            <p className="text-zinc-800 dark:text-zinc-200">
              {`${address.firstName} ${address.lastName}`}
            </p>
            <button
              // onClick={() => setModalOpen(true)}
              className="flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Edit
            </button>
          </div>
          <p className="text-zinc-800 dark:text-zinc-200">{address.landmark}</p>
          <p className="text-zinc-800 dark:text-zinc-200">
            {`${address.streetLine1}, ${address.streetLine2}`}
          </p>
          <p className="text-zinc-800 dark:text-zinc-200">
            {`${address.city}, ${address.state} ${address.postalCode}`}
          </p>
          <p className="text-zinc-800 dark:text-zinc-200">{address.phoneNumber}</p>
          <p className="text-zinc-800 dark:text-zinc-200">{address.countryCode}</p>
        </div>
      ) : (
        <div>
          <p className="text-zinc-500 dark:text-zinc-400">No address added yet.</p>
          <button
            // onClick={() => setModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add Address
          </button>
        </div>
      )}

      {/* Modal for editing address
      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <Form method="post" className="p-6 bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold mb-4">Edit Delivery Information</h2>
            {[
              { label: "First Name", name: "firstName", value: address.firstName },
              { label: "Last Name", name: "lastName", value: address.lastName },
              { label: "Landmark", name: "landmark", value: address.landmark },
              { label: "Street Line 1", name: "streetLine1", value: address.streetLine1 },
              { label: "Street Line 2", name: "streetLine2", value: address.streetLine2 },
              { label: "City", name: "city", value: address.city },
              { label: "Postal Code", name: "postalCode", value: address.postalCode },
              { label: "State", name: "state", value: address.state },
              { label: "Country Code", name: "countryCode", value: address.countryCode },
              { label: "Phone Number", name: "phoneNumber", value: address.phoneNumber },
            ].map((input, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm text-zinc-800 dark:text-zinc-200">
                  {input.label}
                </label>
                <input
                  type="text"
                  name={input.name}
                  defaultValue={input.value}
                  className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </Form>
        </Modal>
      )} */}
    </div>
  );
}
