import  { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState(null);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};
// Define prop types for AddressProvider
AddressProvider.propTypes = {
  children: PropTypes.node.isRequired, // children is a required node
};
export const useAddress = () => useContext(AddressContext);
