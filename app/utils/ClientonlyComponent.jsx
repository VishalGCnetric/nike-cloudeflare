import { useState, useEffect } from "react";

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

export default ClientOnlyComponent;
