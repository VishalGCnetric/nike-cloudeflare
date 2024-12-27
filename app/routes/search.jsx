import { lazy } from 'react';

const App = lazy(() => import('../components/AlgoliaApp'), { ssr: false });

const Search = () => {
  return (
    <>
      <App />
    </>
  );
};

export default Search;
