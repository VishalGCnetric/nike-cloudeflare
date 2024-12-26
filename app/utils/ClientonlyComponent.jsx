import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ClientOnlyComponent = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Mark as client-side
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return <>{children}</>; // Render children on the client
};

ClientOnlyComponent.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children is a required prop
};

export default ClientOnlyComponent;
