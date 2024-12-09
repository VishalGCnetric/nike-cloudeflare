// import React from 'react';

// const IDClearanceForm = () => {
//   return (
//     <div className="p-6 w-full mx-auto bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">ID for Customs Clearance</h2>
//       <p className="mb-2 text-sm">
//         Provide your National ID information to expedite the customs clearance process. If you don't provide this information at checkout, you will be asked to provide it once your order has been processed. Please ensure the address on your KYC document matches your shipping address.
//       </p>
      
//       {/* ID Upload Buttons */}
//       <div className="mb-4">
//         <button className="w-full mb-2 py-2 border-2 border-gray-900 rounded-md">
//           Upload ID as Indian Resident
//         </button>
//         <button className="w-full mb-2 py-2 border-2 border-gray-900 rounded-md">
//           Upload ID as Foreign National
//         </button>
//         <button className="w-full py-2 border-2 border-gray-300 rounded-md text-gray-500">
//           Skip for now
//         </button>
//       </div>
      
//       {/* Passport Details */}
//       <div className="mb-4">
//         <label className="block mb-1 text-sm">Passport</label>
//         <select className="w-full mb-2 py-2 border rounded-md">
//           <option>Passport</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Passport Number"
//           className="w-full mb-2 py-2 border rounded-md"
//         />
//         <input
//           type="text"
//           placeholder="Passport Expiry Date"
//           className="w-full py-2 border rounded-md"
//         />
//       </div>
      
//       <p className="text-xs text-gray-500 mb-4">
//         * I authorize the KYC partner to collect, use, and disclose my complete KYC details to act as my agent and customs for my shipment. <br />
//         * Only your ID and photograph will be shared securely. <br />
//         <a href="#" className="text-blue-500 underline">Privacy Statement</a>
//       </p>

//       {/* Upload ID Photos */}
//       <h3 className="text-lg font-semibold mb-2">Front and back of ID</h3>
//       <p className="mb-2 text-sm">
//         Be sure that your name, photograph, and ID number are clearly visible in the ID photograph, or it may be rejected at customs, causing delivery delays.
//       </p>
//       <div className="mb-4">
//         <button className="w-full mb-2 py-2 border-2 border-gray-900 rounded-md">
//           Upload front side
//         </button>
//         <button className="w-full py-2 border-2 border-gray-900 rounded-md">
//           Upload reverse side
//         </button>
//       </div>
      
//       {/* Address Match Buttons */}
//       <div className="mb-4">
//         <button className="w-full mb-2 py-2 border-2 border-gray-900 rounded-md">
//           Address on ID Matches Shipping Address
//         </button>
//         <button className="w-full py-2 border-2 border-gray-900 rounded-md">
//           Address on ID does not Match Shipping Address
//         </button>
//       </div>
      
//       {/* PAN Input */}
//       <h3 className="text-lg font-semibold mb-2">What's your PAN?</h3>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="PAN"
//           className="w-full mb-2 py-2 border rounded-md"
//         />
//         <label className="flex items-center text-sm">
//           <input type="checkbox" className="mr-2" />
//           Save PAN details to My Profile
//         </label>
//       </div>
      
//       {/* Continue Button */}
//       <button className="w-full py-3 bg-gray-200 text-gray-500 rounded-md">
//         Continue
//       </button>

//       {/* Additional Sections */}
//       <div className="mt-8">
//         <h3 className="text-lg font-semibold mb-2">Delivery</h3>
//         <h3 className="text-lg font-semibold mb-2">Shipping</h3>
//         <h3 className="text-lg font-semibold mb-2">Billing</h3>
//         <h3 className="text-lg font-semibold">Payment</h3>
//       </div>
//     </div>
//   );
// };

// export default IDClearanceForm;
import React, { useState } from 'react';

const IdClearanceForm = () => {
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    frontImage: null,
    backImage: null,
    addressMatches: false,
    pan: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      addressMatches: e.target.checked,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">ID for Customs Clearance</h2>
      <p className="mb-2 text-sm">
        Provide your National ID information to expedite the customs clearance process. If you don't provide this information at checkout, you will be asked to provide it once your order has been processed. Please ensure the address on your KYC document matches your shipping address.
      </p>
      <div className="mb-4">
        <button className="w-full mb-2 p-2 border rounded" type="button">Upload ID as Indian Resident</button>
        <button className="w-full mb-2 p-2 border rounded" type="button">Upload ID as Foreign National</button>
        <button className="w-full mb-2 p-2 border rounded" type="button">Skip for now</button>
      </div>

      <div className="mb-4">
        <select
          name="idType"
          value={formData.idType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select ID Type</option>
          <option value="Aadhaar Card">Aadhaar Card</option>
          {/* Add other options as needed */}
        </select>
      </div>

      <div className="mb-4">
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          placeholder="Aadhaar Number"
          className="w-full p-2 border rounded"
        />
        <p className="text-xs mt-1">Only top and side lines are allowed.</p>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Front and back of ID</label>
        <input
          type="file"
          name="frontImage"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="backImage"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mt-2"
        />
      </div>

      <div className="mb-4">
        <input
          type="checkbox"
          name="addressMatches"
          checked={formData.addressMatches}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        <label className="text-sm">Address on ID Matches Shipping Address</label>
      </div>

      <div className="mb-4">
        <input
          type="text"
          name="pan"
          value={formData.pan}
          onChange={handleChange}
          placeholder="What's your PAN?"
          className="w-full p-2 border rounded"
        />
        <p className="text-xs mt-1">Enter your PAN to enable payment using UPI, Net Banking, or credit/debit cards.</p>
      </div>

      <div className="mb-4">
        <button type="submit" className="w-full p-2 bg-gray-200 rounded">Continue</button>
      </div>
    </form>
  );
};

export default IdClearanceForm;
