import { useEffect, useRef } from 'react';
import { useInstantSearch } from 'react-instantsearch';
import PropTypes from 'prop-types';

export function ScrollTo({ children }) {
  const { addMiddlewares } = useInstantSearch();
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      // Skip execution in non-browser environments
      return;
    }

    const middleware = () => {
      return {
        onStateChange() {
          const isFiltering = document.body?.classList.contains('filtering');
          const isTyping =
            document.activeElement?.tagName === 'INPUT' &&
            document.activeElement?.getAttribute('type') === 'search';

          if (isFiltering || isTyping) {
            return;
          }

          containerRef.current?.scrollIntoView();
        },
      };
    };

    const removeMiddleware = addMiddlewares(middleware);

    return () => {
      removeMiddleware();
    };
  }, [addMiddlewares]);

  return (
    <div ref={containerRef} className="ais-ScrollTo">
      {children}
    </div>
  );
}

ScrollTo.propTypes = {
  children: PropTypes.node.isRequired,
};
