import { useInstantSearch } from 'react-instantsearch';
import PropTypes from 'prop-types';
export function NoResultsBoundary({
  children,
  fallback,
}) {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure to not display the No Results message
  // when no hits have been returned yet.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return <>{children}</>;
}
// PropTypes for NoResultsBoundary component
NoResultsBoundary.propTypes = {
  children: PropTypes.node.isRequired, // Ensure children are passed
  fallback: PropTypes.node.isRequired,  // Ensure fallback is passed
};
