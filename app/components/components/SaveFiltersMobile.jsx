import { useInstantSearch } from 'react-instantsearch';
import PropTypes from 'prop-types'; // Import PropTypes
import { formatNumber } from '../../utils/format';

export function SaveFiltersMobile({ onClick }) {
  const { results } = useInstantSearch();
  const nbHits = results ? results.nbHits : 0;

  return (
    <button className="button button-primary" onClick={onClick}>
      See {formatNumber(nbHits)} results
    </button>
  );
}
// Define prop types for SaveFiltersMobile
SaveFiltersMobile.propTypes = {
  onClick: PropTypes.func.isRequired, // onClick is a required function
};