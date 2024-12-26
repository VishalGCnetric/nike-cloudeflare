import PropTypes from 'prop-types';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ShopCart = ({ shop, onClick }) => {
  const { lat, lng } = shop.coordinates;

  // Static Map Image URL with better zoom level for visible location details
  const staticMapUrl = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${lng},${lat}&z=8&l=map&size=400,200&pt=${lng},${lat},pm2rdl`; 

  return (
    <button
      type="button"
      className="border border-gray-200 p-6 rounded-lg shadow-md mb-8 transform transition duration-300 hover:scale-105 hover:shadow-xl"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      tabIndex={0} // Make it focusable
    >
      <div className="flex flex-row items-start justify-between space-x-4">
        {/* Static Map Section */}
        <div className="relative h-36 w-36 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <img
            src={staticMapUrl}
            alt={`${shop.sellerName} Location`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Shop Details Section */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-indigo-900 leading-snug">
            {shop.sellerName}
          </h2>
          <p className="text-md text-gray-600 mt-2">
            Price: <span className="text-green-500 font-semibold">₹{shop.price.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Distance: {shop.distance} km</p>

          {/* Google Maps Link */}
          <div className="mt-4">
            <a
              href={shop.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <FaMapMarkerAlt className="mr-2" /> View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </button>
  );
};

// PropTypes validation
ShopCart.propTypes = {
  shop: PropTypes.shape({
    coordinates: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
    sellerName: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
    mapLink: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ShopCart;
