import React from 'react';
import OrderSummary from './OrderSummary';
import IDClearanceForm from './IDClearence';

const sharedClasses = {
  border: 'border border-border',
  rounded: 'rounded-md',
  inputField: ' w-full border p-2',
  button: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 p-2 rounded-md',
  textMuted: 'text-muted-foreground',
  gridCols: 'grid grid-cols-1 md:grid-cols-1 gap-4',
};

const OrderForm = () => {
  return (
    <div className="flex flex-col justify-around  md:flex-row p-6 bg-card border rounded-lg">
      <div className="w-full p-8 ">
        <h2 className="text-2xl font-bold mb-4">How would you like to get your order?</h2>
        <p className={sharedClasses.textMuted + " mb-4"}>
          Customs regulation for India require a copy of the recipient's KYC. The address on the KYC needs to match the shipping address.
          The KYC will be stored securely and used solely for the purpose of clearing customs (including sharing it with customs officials) for all orders and returns.
          If your KYC does not match your shipping address, please click the link for more information.
          <a href="#" className="text-primary">Learn More</a>
        </p>
        <button className={sharedClasses.button}>Deliver It</button>
        <h3 className="text-xl font-semibold mt-6 mb-2">Enter your name and address:</h3>
        <div className={sharedClasses.gridCols + " mb-4"}>
          <input type="text" placeholder="First Name" className={sharedClasses.inputField + " " + sharedClasses.rounded} /> 
          <input type="text" placeholder="Last Name" className={sharedClasses.inputField + " " + sharedClasses.rounded} />
        </div>
        <input type="text" placeholder="Start typing a street address or postcode" className={sharedClasses.inputField + " " + sharedClasses.rounded + " mb-2"} />
        <span className={sharedClasses.textMuted}>We do not ship to P.O. boxes</span>
        <button className="text-primary mt-2">Enter address manually</button>
        <h3 className="text-xl font-semibold mt-6 mb-2">What's your contact information?</h3>
        <div className={sharedClasses.gridCols + " mb-4"}>
          <input type="email" placeholder="Email" className={sharedClasses.inputField + " " + sharedClasses.rounded} />
          <input type="text" placeholder="Phone Number" className={sharedClasses.inputField + " " + sharedClasses.rounded} />
        </div>
        <span className={sharedClasses.textMuted}>A confirmation email will be sent after checkout.</span><br />
        <span className={sharedClasses.textMuted}>A carrier might contact you to confirm delivery.</span>
     <IDClearanceForm/>
      </div>
      
    </div>
  );
};

export default OrderForm;
