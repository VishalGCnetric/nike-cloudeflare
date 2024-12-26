import  {  useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// import axios from 'axios';
import PropTypes from 'prop-types';

// Custom icon for user location (red icon)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Custom icon for shops (green icon)
const shopIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Fix for missing marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Maps = ({ currentLocation, nearbyShops }) => {
  // const [error, setError] = useState(null);
  const markersRef = useRef({});
  const error=null;
  useEffect(() => {
    // Reverse geocode to get the address from coordinates
    // if (currentLocation) {
    //   axios
    //     .get(`https://nominatim.openstreetmap.org/reverse?lat=${currentLocation.lat}&lon=${currentLocation.lng}&format=json`)
    //     .then((res) => setAddress(res.data.display_name))
    //     .catch(() => setError('Unable to fetch address'));
    // }
  }, [currentLocation]);

  // Function to auto-open tooltips when zoom level is high enough
  const AutoOpenTooltips = () => {
    const map = useMap();

    useEffect(() => {
      const handleZoom = () => {
        const zoomLevel = map.getZoom();
        if (zoomLevel >= 8) {
          // Open tooltips for all markers
          Object.values(markersRef.current).forEach((marker) => {
            marker.openTooltip();
          });
        } else {
          // Close tooltips for all markers
          Object.values(markersRef.current).forEach((marker) => {
            marker.closeTooltip();
          });
        }
      };

      map.on('zoomend', handleZoom);

      // Initial check
      handleZoom();

      return () => {
        map.off('zoomend', handleZoom);
      };
    }, [map]);

    return null;
  };

  const position = [currentLocation.lat, currentLocation.lng];

  return (
    <div>
      {error && <p>{error}</p>}
      {currentLocation ? (
        <div>
          <MapContainer
            key={Date.now()}
            center={position}
            zoom={13} // Zoom level
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution=''
            />

            {/* Marker for the current user location */}
            <Marker position={position} icon={userIcon}>
              <Tooltip
                direction='top'
                offset={[0, -10]}
                opacity={1}
                permanent
                className='tooltip-content'
              >
                <div>
                  <strong>You are here</strong>
                  <br />
                </div>
              </Tooltip>
            </Marker>

            {/* Markers for nearby shops */}
            {nearbyShops.length > 0 ? (
              nearbyShops.map((shop) =>
                shop.sellers.map((seller) => (
                  <Marker
                    key={seller.sellerId}
                    position={[seller.coordinates.lat, seller.coordinates.lng]}
                    icon={shopIcon}
                    ref={(ref) => {
                      if (ref) {
                        markersRef.current[seller.sellerId] = ref;
                      }
                    }}
                  >
                    <Tooltip
                      direction='top'
                      offset={[0, -10]}
                      permanent
                      opacity={1}
                      className='tooltip-content'
                    >
                      <div>
                        <strong>{seller.sellerName}</strong>
                        <p>Distance {seller.distance} km away</p>
                      </div>
                    </Tooltip>
                  </Marker>
                ))
              )
            ) : (
              <p>No shops available nearby.</p>
            )}

            <AutoOpenTooltips />
          </MapContainer>
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

Maps.propTypes = {
  currentLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  nearbyShops: PropTypes.arrayOf(
    PropTypes.shape({
      sellers: PropTypes.arrayOf(
        PropTypes.shape({
          sellerId: PropTypes.string.isRequired,
          sellerName: PropTypes.string.isRequired,
          coordinates: PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
          }).isRequired,
          distance: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default Maps;
