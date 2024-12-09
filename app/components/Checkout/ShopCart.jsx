import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Fix for missing marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ShopCart = ({ shop, onClick }) => {
  const position = [shop.coordinates.lat,shop.coordinates.lng]; 

  return (
    <div
      className="border border-gray-200 p-6 rounded-lg shadow-md mb-8 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-row items-start justify-between space-x-4">
        {/* Leaflet Map */}
        <div className="relative h-36 w-36 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            <Marker position={position}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <span className="font-semibold">{shop.sellerName}</span> <br />
                Price: ₹{shop.price}
              </Tooltip>
            </Marker>
          </MapContainer>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-indigo-900 leading-snug">
            {shop.sellerName}
          </h2>
          <p className="text-md text-gray-600 mt-2">
            Price: <span className="text-green-500 font-semibold">₹{shop.price.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">Distance: {shop.distance} km</p>

          <div className="mt-4">
            <a
              href={shop.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
             <FaMapMarkerAlt className="mr-2" /> Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
// import React from 'react';
// import { FaMapMarkerAlt } from 'react-icons/fa';

// const ShopCart = ({ shop, onClick }) => {
//   const lat = shop.coordinates.lat;
//   const lng = shop.coordinates.lng;

//   // OpenStreetMap Static Image URL
//   const openStreetMapUrl = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${lng},${lat}&z=9&l=map&size=400,400&pt=${lng},${lat},pm2rdm`;

//   return (
//     <div className="border border-gray-200 p-6 rounded-lg shadow-md mb-8 transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" onClick={onClick}>
//       <div className="flex flex-row items-start justify-between space-x-4">
//         {/* Left Section: Static Map */}
//         <div className="relative h-36 w-36 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
//           <img src={openStreetMapUrl} alt={`${shop.sellerName} Map`} className="h-full w-full object-cover" />
//         </div>

//         {/* Right Section: Shop Info */}
//         <div className="flex-1">
//           <h2 className="text-xl font-bold text-indigo-900 leading-snug">{shop.sellerName}</h2>
//           <p className="text-md text-gray-600 mt-2">
//             Price: <span className="text-green-500 font-semibold">₹{shop.price}</span>
//           </p>
//           <p className="text-sm text-gray-500 mt-1">Distance: {shop.distance} km</p>

//           {/* Button Section */}
//           <div className="mt-4">
//             <a
//               href={shop.mapLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out"
//             >
//               <FaMapMarkerAlt className="mr-2" /> View on Google Maps
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopCart;
