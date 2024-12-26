import  { useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick"
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import PropTypes from 'prop-types';
const SlickSliderComponent = ({ data }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
        }
      }
    ]
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-center mb-6">Classics Spotlight</h2>
      <div className="relative">
        {data?.length > 0 ? (
          <Slider ref={sliderRef} {...settings}>
            {data.map((item, index) => (
              <div key={index} className="px-2">
                <div className="relative">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-auto rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-center text-gray-500">No data available</div>
        )}
        <button
          onClick={() => sliderRef.current.slickPrev()}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black p-2 rounded md:left-2 lg:left-4 xl:left-6"
          aria-label="Previous Slide"
        >
          <IoIosArrowBack className="h-10 w-10" />
        </button>
        <button
          onClick={() => sliderRef.current.slickNext()}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black p-2 rounded md:right-2 lg:right-4 xl:right-6"
          aria-label="Next Slide"
        >
          <IoIosArrowForward className="h-10 w-10" />
        </button>
      </div>
    </div>
  );
};
// Define PropTypes for the component
SlickSliderComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      // Add any other properties that might be present in the item
    })
  ).isRequired,
};
export default SlickSliderComponent;
