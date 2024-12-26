import App from '../components/AlgoliaApp';

// export const loader = async () => {
//   const client = algoliasearch("3BP6P78G2Y", "1903a10f4bc35dca44f99e43d8c51a99");
//   const index = client.initIndex("nike");
//   const hits = await index.search("", { hitsPerPage: 16 });
//   return hits.hits;
// };

const search = () => {
  return (
    <App/>
  )
}
export default search;