import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { json } from "@remix-run/cloudflare";
import { useEffect, useState } from "react";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { addToCart } from "../utils/cartutils";
import { fetchProductById } from "../utils/api";

export const loader = async ({ params }) => {
  try {
    const productId = params.productId;
    const product = await fetchProductById(productId);
    return json({ product });
  } catch (error) {
    return json(
      { error: "Product not found from API, showing default product" },
      { status: 500 }
    );
  }
};

const Option = ({ innerProps, isFocused, data }) => (
  <div
    {...innerProps}
    className={`flex items-center p-2 cursor-pointer ${
      isFocused ? "bg-gray-100" : "bg-white"
    }`}
  >
    <img
      src={data.image}
      alt={data.label}
      className="w-8 h-8 object-cover rounded mr-2"
    />
    <span className="text-gray-700">{data.label}</span>
  </div>
);

Option.propTypes = {
  innerProps: PropTypes.object.isRequired,
  isFocused: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    image: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

const ProductDetails = () => {
  const { product, error } = useLoaderData();
  const { token } = useOutletContext();

  const [variantData, setVariantData] = useState(product?.variants[0] || null);
  const [mainImage, setMainImage] = useState(
    product?.variants[0]?.images?.[0]?.url || ""
  );
  const [descriptionHtml, setDescriptionHtml] = useState(null);

  useEffect(() => {
    setDescriptionHtml(product?.description);
  }, [product]);

  useEffect(() => {
    if (variantData) {
      setMainImage(variantData?.images?.[0]?.url || "");
    }
  }, [variantData]);

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
      await addToCart(data.productVariantId, data.quantity, token);
      notify();
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };

  if (error) return <div>{error}</div>;

  const variantOptions =
    product?.variants?.map((variant) => ({
      value: variant.id,
      label: variant.name,
      image: variant.images[0]?.url,
    })) || [];

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto px-4 py-6 md:px-18">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Images */}
          <div className="col-span-1">
            <div className="flex flex-row md:flex-row md:space-x-4">
              <div className="relative md:w-1/6 flex-shrink-0 flex flex-col">
                <div
                  className="flex flex-col h-full w-full space-y-2 overflow-hidden"
                  style={{ maxHeight: "500px" }}
                >
                  {variantData?.images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image.url)}
                      onKeyDown={(e) => e.key === "Enter" && setMainImage(image.url)}
                      className={`w-16 h-16 md:w-20 md:h-20 border ${
                        mainImage === image.url ? "border-red-500" : ""
                      } cursor-pointer object-cover`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index}`}
                        className="object-cover w-full h-full"
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
              <Select
                options={variantOptions}
                onChange={(selectedOption) => {
                  const selectedVariant = product.variants.find(
                    (variant) => variant.id === selectedOption.value
                  );
                  setVariantData(selectedVariant);
                  setMainImage(selectedVariant.images[0].url);
                }}
                components={{ Option }}
                value={variantOptions.find(
                  (option) => option.value === variantData?.id
                )}
                placeholder="Select a variant"
                className="basic-single"
                classNamePrefix="select"
              />
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
