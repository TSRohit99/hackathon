"use client";

import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const LessonSlider = () => {
  //   const dispatch = useDispatch();

  // Retrieve the current slide from Redux
  //   const currentSlide = useSelector((state) => state.slider.currentSlide);
  const [currentSlide, setCurrentSlide] = useState(1);

  const handleSlideChange = (swiper) => {
    const newSlideIndex = swiper.activeIndex + 1;
    setCurrentSlide(swiper.activeIndex + 1);

    // Dispatch the updated slide number to Redux
    // dispatch({ type: "SET_CURRENT_SLIDE", payload: newSlideIndex });
  };

  return (
    <section>
      {/* swiper section */}
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Swiper Component */}
        <Swiper
          modules={[Navigation]}
          initialSlide={currentSlide - 1} // Start from the Redux slide index
          onSlideChange={handleSlideChange}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={true}
          onSwiper={(swiper) => swiper.navigation.init()}
          className="relative w-full"
        >
          {/* Slides */}
          <SwiperSlide className="flex items-center justify-center bg-blue-500 h-64">
            Slide 1
          </SwiperSlide>
          <SwiperSlide className="flex items-center justify-center bg-green-500 h-64">
            Slide 2
          </SwiperSlide>
          <SwiperSlide className="flex items-center justify-center bg-red-500 h-64">
            Slide 3
          </SwiperSlide>
        </Swiper>

        {/* Navigation Buttons */}
        <button
          className="swiper-button-prev absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full"
          aria-label="Previous Slide"
        >
          Prev
        </button>
        <button
          className="swiper-button-next absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full"
          aria-label="Next Slide"
        >
          Next
        </button>

        {/* Current Slide Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full">
          Slide {currentSlide}
        </div>
      </div>

      {/* pagination */}
      
    </section>
  );
};

export default LessonSlider;
