import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { json } from "@remix-run/cloudflare";
import { useEffect, useState } from "react";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { addToCart } from "../utils/cartutils";
import PropTypes from "prop-types";

// src/routes/loader.js
import { fetchProductById } from "../utils/api";

export const loader = async ({ params }) => {
  try {
    const productId = params.productId;

    // Fetch product data using the API utility
    const product = await fetchProductById(productId);

    return json({ product });
  } catch (error) {
    return json(
      {
        error: "Product not found from API, showing default product",
      },
      { status: 500 }
    );
  }
};


const Option = (props) => {
  return (
    <div
      {...props.innerProps}
      className={`flex items-center p-2 cursor-pointer ${
        props.isFocused ? "bg-gray-100" : "bg-white"
      }`}
    >
      <img
        src={props.data.image}
        alt={props.data.label}
        className="w-8 h-8 object-cover rounded mr-2"
      />
      <span className="text-gray-700">{props.data.label}</span>
    </div>
  );
};
// Added prop type validation for Option component
Option.propTypes = {
  innerProps: PropTypes.object.isRequired,
  isFocused: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    image: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};
const ProductDetails = () => {
  const { product, error } = useLoaderData();

  const [variantData, setVariantData] = useState(product?.variants[0] || null);
  const [mainImage, setMainImage] = useState(
    product?.variants[0]?.images?.[0]?.url || ""
  );
  const [isClient, setIsClient] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState(null);
  const { token } = useOutletContext(); 
  useEffect(() => {
    setDescriptionHtml(product?.description);
  }, [product]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const notify = () => {
    toast(
      <div className="flex items-center space-x-4">
        <img
          src={variantData?.images?.[0]?.url}
          alt={variantData?.name}
          className="w-16 h-16 object-cover rounded-lg shadow-lg border"
        />
        <div className="flex flex-col">
          <h4 className="text-sm font-semibold text-gray-800">
            {variantData?.name}
          </h4>
          <p className="text-xs text-gray-500">Added to cart successfully!</p>
        </div>
      </div>,
      {
        className: "bg-white border border-gray-200 shadow-lg rounded-lg p-3 flex items-center",
        progressClassName: "bg-green-500",
      }
    );
  };

  const handleAddToCart = async () => {
    const data = {
      productVariantId: variantData.id,
      quantity: 1,
    };

    try {
       await addToCart(data.productVariantId, data.quantity,token);
      notify();
      // console.log("Cart response:", response);
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };


  const variantOptions =
    product?.variants?.map((variant) => ({
      value: variant.id,
      label: variant.name,
      image: variant.images[0]?.url,
    })) || [];

  useEffect(() => {
    if (variantData) {
      setMainImage(variantData?.images?.[0]?.url || "");
    }
  }, [variantData]);
  if (error) return <div>{error}</div>;

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto px-4 py-6 md:px-18">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Images */}
          <div className="col-span-1">
            <div className="flex flex-row md:flex-row md:space-x-4">
              <div className="relative md:w-1/6 flex-shrink-0 flex flex-col">
              <div className="flex flex-col h-full w-full space-y-2 overflow-hidden" style={{ maxHeight: "500px" }}>
  {variantData?.images?.map((image, index) => (
    <button
      onClick={() => setMainImage(image.url)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setMainImage(image.url);
        }
      }}
      key={index}
      className={`w-16 h-16 md:w-20 md:h-20 border ${mainImage === image.url ? "border-red-500" : ""} cursor-pointer`}
      tabIndex={0}
    >
      <img
        src={image.url}
        alt={`Thumbnail ${index}`}
        className="w-full h-full object-cover"
      />
    </button>
  ))}
</div>

              </div>

              <div className="flex-1 flex items-center justify-center">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt="Main Product"
                    className="w-full h-auto md:h-full object-cover border"
                    style={{ maxHeight: "500px" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="col-span-1 space-y-4">
            <h1 className="text-xl md:text-2xl font-semibold">
              {variantData?.name}
            </h1>
            <p className="text-lg md:text-xl font-bold">
              MRP: ₹ {variantData?.price?.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-gray-400">Incl. of taxes</p>
            {descriptionHtml && (
              <div
                className="text-sm text-gray-500"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              ></div>
            )}
            <div className="space-y-4">
              {/* Variant Selector */}
              {isClient && (
                <Select
                  options={variantOptions}
                  onChange={(selectedOption) => {
                    const selectedVariant = product.variants.find(
                      (variant) => variant.id === selectedOption.value
                    );
                    setVariantData(selectedVariant);
                    setMainImage(selectedVariant.images[0].url);
                  }}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  components={{ Option }}
                  value={variantOptions.find(
                    (option) => option.value === variantData?.id
                  )}
                  placeholder="Select a variant"
                  className="basic-single"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid #ccc",
                      borderRadius: "0.375rem",
                      boxShadow: "none",
                      padding: "0.375rem",
                      "&:hover": {
                        borderColor: "#000",
                      },
                    }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused
                        ? "#f9fafb"
                        : "white",
                      color: isFocused ? "#000" : "#374151",
                      cursor: "pointer",
                      padding: "0.5rem",
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: "0.375rem",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      fontSize: "0.875rem",
                    }),
                  }}
                />
              )}
                  {variantData && (
                <div className="mt-4  items-center">
                  {variantData.attributes.color
                    ?.split("/")
                    .map((color, index) => (
                      <span
                        key={index}
                        className="mr-2 px-2 py-1 border rounded text-sm"
                      >
                        {color}
                      </span>
                    ))}
                  <div className="ml-4">
                    <b>Size: </b>
                    {variantData.attributes.size ||
                      variantData.attributes.Size ||
                      "No size specified"}
                  </div>

                  <div className="ml-4">
                    <b>Color: </b>
                    {variantData.attributes.color ||
                      variantData.attributes.Color ||
                      "No size specified"}
                  </div>
                </div>
              )}
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 rounded"
              >
                Add to Bag
              </button>
              <button className="w-full border py-3 rounded flex items-center justify-center space-x-2">
                <span>Favourite</span>
                <span>♡</span>
              </button>
            </div>

            <ul className="text-gray-700 list-disc pl-4">
              <li>Colour Shown: Multi-Colour/Multi-Colour</li>
              <li>Style: FZ8753-900</li>
              <li>Country/Region of Origin: Vietnam</li>
            </ul>
            <div className="space-y-2">
              <p className="text-black font-semibold cursor-pointer">
                View Product Details
              </p>
              <p className="text-black font-semibold cursor-pointer">
                Delivery & Returns
              </p>
              <p className="text-black font-semibold cursor-pointer">
                Reviews (1)
              </p>
              <p className="text-black font-semibold cursor-pointer">
                Product Information
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
