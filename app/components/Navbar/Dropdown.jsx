import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
const Dropdown = ({ sections, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      style={{position:'absolute',left:'0',width:'600px'}}
      className="bg-white border absolute left-0 top-full mt-2 rounded-lg shadow-l z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="overflow-x-hidden max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {sections?.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="space-y-4 p-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-800">{section?.title}</h2>
              <ul className="list-disc list-inside text-gray-700">
                {section.items.map((item, idx) => (
                  <li key={idx} className="mb-1">{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
// Prop Types Validation
Dropdown.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

Dropdown.defaultProps = {
  onMouseEnter: () => {},
  onMouseLeave: () => {},
};
export default Dropdown;
