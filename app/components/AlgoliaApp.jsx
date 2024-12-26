import { useEffect, useRef, useState, useCallback } from "react";
import algoliasearch from "algoliasearch/lite";
import {
  Configure,
  Hits,
  HitsPerPage,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  SortBy,
} from "react-instantsearch";

import {
  ClearFilters,
  ClearFiltersMobile,
  NoResults,
  NoResultsBoundary,
  Panel,
  PriceSlider,
  ResultsNumberMobile,
  SaveFiltersMobile,
} from "./components";
import { ScrollTo } from "./components/ScrollTo";
import { formatNumber } from "../utils/format";
import "./Theme.css";
import "./AlgoliaApp.css";
import "./components/Pagination.css";
import "./AlgoliaApp.mobile.css";
import { useNavigate } from "@remix-run/react";
import ShoppingLoader from "./Loader/ShoppingLoader";
import PropTypes from "prop-types";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

const searchClient = algoliasearch("3BP6P78G2Y", "1903a10f4bc35dca44f99e43d8c51a99");
const indexName = "nike";

function Hit({ hit }) {
  const navigate = useNavigate();

  const handleProduct = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <article className="hit">
      <header className="hit-image-container relative">
        <img
          src={hit.featuredAsset?.preview}
          alt={hit.name}
          className="hit-image"
        />
      </header>
      <div className="hit-info-container">
        <p className="hit-category">{hit.facetValues?.[0]?.name}</p>
        <h1>{hit.name}</h1>
        <footer>
          <p>
            <span className="hit-em">₹</span>{" "}
            <strong>{formatNumber(hit.variants[0]?.priceWithTax)}</strong>
          </p>
        </footer>
      </div>
      <button
        onClick={() => handleProduct(hit.id)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleProduct(hit.id);
          }
        }}
        className="hit-button"
        aria-label={`View details for ${hit.name}`}
      >
        View Details
      </button>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    featuredAsset: PropTypes.shape({
      preview: PropTypes.string.isRequired,
    }),
    facetValues: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ),
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        priceWithTax: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

function SubmitIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.67"
        transform="translate(1 1)"
      >
        <circle cx="7.11" cy="7.11" r="7.11" />
        <path d="M16 16l-3.87-3.87" />
      </g>
    </svg>
  );
}

export function App() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const searchBoxRef = useRef(null);
  const isClient = useIsClient();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const closeFilters = useCallback(() => {
    setFiltersOpen(false);
    containerRef.current?.scrollIntoView();
  }, []);

  const onKeyUp = useCallback(
    (event) => {
      if (event.key === "Escape") {
        closeFilters();
      }
    },
    [closeFilters]
  );

  const onClick = useCallback(
    (event) => {
      if (event.target === headerRef.current) {
        closeFilters();
      }
    },
    [closeFilters]
  );

  useEffect(() => {
    if (filtersOpen) {
      document.body.classList.add("filtering");
      window.scrollTo(0, 0);
      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("click", onClick);
    }

    return () => {
      document.body.classList.remove("filtering");
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("click", onClick);
    };
  }, [filtersOpen, onKeyUp, onClick]);

  if (!isClient) {
    return <ShoppingLoader />;
  }

  return (
    <div className="mt-0 mx-auto">
      <InstantSearch searchClient={searchClient} indexName={indexName} insights>
        <header className="header" ref={headerRef}>
          <p className="header-logo"></p>
          <div ref={searchBoxRef}>
            <SearchBox
              placeholder="Categories, price, color, …"
              submitIconComponent={SubmitIcon}
            />
          </div>
        </header>

        <Configure
          attributesToSnippet={["description:10"]}
          snippetEllipsisText="…"
          removeWordsIfNoResults="allOptional"
        />

        <ScrollTo>
          <main className="flex w-[94vw] mx-auto" ref={containerRef}>
            <div className="container-wrapper mx-auto">
              <section className="container-filters ml-10">
                <div className="container-header">
                  <h2 id="filter-section-header">Filters</h2>
                  <div className="clear-filters" data-layout="desktop">
                    <ClearFilters />
                  </div>
                  <div className="clear-filters" data-layout="mobile">
                    <ResultsNumberMobile />
                  </div>
                </div>
                <div className="container-body">
                  <Panel header="Categories">
                    <RefinementList attribute="facetValues.name" showMore />
                  </Panel>
                  <Panel header="Size">
                    <RefinementList
                      attribute="optionGroups.options.name"
                      showMore
                    />
                  </Panel>
                  <Panel header="Price">
                    <PriceSlider attribute="variants.priceWithTax" />
                  </Panel>
                </div>
              </section>
              <footer
                className="container-filters-footer"
                data-layout="mobile"
              >
                <div className="container-filters-footer-button-wrapper">
                  <ClearFiltersMobile containerRef={containerRef} />
                </div>
                <div className="container-filters-footer-button-wrapper">
                  <SaveFiltersMobile onClick={closeFilters} />
                </div>
              </footer>
            </div>
            <section className="container-results">
              <header className="container-header flex justify-between items-center mb-6">
                <SortBy
                  className="container-option bg-white text-gray-700 py-3 px-5 rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  items={[
                    { label: "Sort By", value: indexName },
                    { label: "Price Ascending", value: `${indexName}_price_asc` },
                    { label: "Price Descending", value: `${indexName}_price_desc` },
                  ]}
                />
                <HitsPerPage
                  className="container-option bg-white text-gray-700 py-3 px-5 rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  items={[
                    { label: "10", value: 10 },
                    { label: "20", value: 20 },
                    { label: "50", value: 50 },
                  ]}
                />
              </header>
              <Hits hitComponent={Hit} />
              <NoResultsBoundary fallback={<NoResults />}>
                <Pagination />
              </NoResultsBoundary>
            </section>
          </main>
        </ScrollTo>
      </InstantSearch>
    </div>
  );
}
