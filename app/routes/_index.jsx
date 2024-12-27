import { json, useLoaderData } from "@remix-run/react";
import Slider from "../components/Slider";
import {  lazy, Suspense } from "react";
import { fetchcontent } from "../utils/api";

const SlickSliderComponent = lazy(() => import("../components/Swaper"));

export async function loader() {
  try {
    const data = await fetchcontent();
    return json({ data });
  } catch (err) {
    console.error(err);
    return json({ error: "Failed to fetch data. Please check your connection." });
  }
}

const Homepage = () => {
  const { data, error } = useLoaderData();

  const popularProductSliders = data?.filter((image) =>
    image.title.includes("popular product slider")
  );
  const thepopularSpotlight = data?.filter((image) =>
    image.title.includes("the popular spotlight")
  );
  const mainImage = data?.filter((image) =>
    image.title.includes("main banner")
  );
  const latestImage = data?.filter((image) =>
    image.title.includes("the latest")
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-600 p-4 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90vw] mx-auto">
      <div className="pl-6 pr-6 mx-auto">
        <img
          src={mainImage?.[0]?.url}
          alt="Nike Electric Pack"
          className="w-full h-full object-cover"
        />
        <div className="flex flex-col items-center justify-center mt-4 bg-white text-center">
          <h3 className="text-sm text-gray-600 mb-2">Nike Electric Pack</h3>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            WIN ON AIR
          </h1>
          <p className="text-gray-600 mb-6">
            Engineered for those who stand out.
          </p>
          <div className="flex space-x-4">
            <button className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800">
              Experience Air
            </button>
            <button className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800">
              Shop Air
            </button>
          </div>
        </div>
      </div>

      <Slider data={popularProductSliders} />

      <div>
        <Suspense fallback={<div className="loader">Loading...</div>}>
          <SlickSliderComponent data={thepopularSpotlight} />
        </Suspense>
      </div>

      <div className="w-full mx-auto px-2 py-8">
        <h2 className="text-3xl font-bold mb-6">The Latest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Card */}
          {latestImage?.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={item?.url}
                alt={item?.title || "Product"}
                className="w-full h-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{item?.title}</h3>
                <button className="text-primary hover:underline">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
