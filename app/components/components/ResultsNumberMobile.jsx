import { useInstantSearch } from 'react-instantsearch';

import { formatNumber } from '../../utils/format';

export function ResultsNumberMobile() {
  const { results } = useInstantSearch();
  const nbHits = results ? results.nbHits : 0;

  return (
    <div>
      <strong>{formatNumber(nbHits)}</strong> results
    </div>
  );
}
