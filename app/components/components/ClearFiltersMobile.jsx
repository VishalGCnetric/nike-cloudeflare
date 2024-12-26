import { useClearRefinements } from 'react-instantsearch';
import PropTypes from 'prop-types';
export function ClearFiltersMobile({
  containerRef,
}) {
  const { refine } = useClearRefinements();

  function onClick() {
    refine();
    document.body.classList.remove('filtering');
    containerRef.current.scrollIntoView();
  }

  return (
    <div className="ais-ClearRefinements">
      <button className="ais-ClearRefinements-button" onClick={onClick}>
        Reset filters
      </button>
    </div>
  );
}
// PropTypes for ClearFiltersMobile component
ClearFiltersMobile.propTypes = {
  containerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};