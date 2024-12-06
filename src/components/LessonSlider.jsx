"use client";

import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import extractHtml from "@/helper/extractHtml";
import { useAppDispatch } from "@/lib/hooks";
import { setPage } from "@/lib/features/subjects/subjectSlice";
import { useRouter } from "next/navigation";

const LessonSlider = ({ subject }) => {
  const swiperRef = useRef(null);
  const dispatch = useAppDispatch();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [currentPage, setCurrPage] = useState(null);
  const router = useRouter();

  const [CurrLesson, setCurrLesson] = useState(null);

  useEffect(() => {
    if (
      subject &&
      subject.page_history &&
      subject.page_history.lesson != null &&
      subject.page_history.page != null &&
      subject.roadmap[subject.page_history.lesson]
    ) {
      console.log(subject.roadmap[subject.page_history.lesson]);
      console.log(subject.page_history.page);
      setCurrLesson(subject.roadmap[subject.page_history.lesson]);
      setCurrPage(subject.page_history.page + 1);
    }
  }, [subject, subject?.page_history?.lesson, subject?.page_history?.page, subject?.roadmap]);

  useEffect(() => {
    if (swiperRef.current) {
      updateNavigationState(swiperRef.current);
    }
  }, [CurrLesson]);

  const updateNavigationState = (swiper) => {
    if (!swiper.slides || swiper.slides.length === 0) return;

    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setCurrPage(swiper.activeIndex + 1);
    dispatch(setPage({
      _id: subject._id,
      page_history: {
        page: swiper.activeIndex,
        lesson: subject.page_history.lesson
      }
    }));
  };

  const goToPreviousLesson = () => {
    if (subject.page_history.lesson > 0) {
      const previousLesson = subject.roadmap[subject.page_history.lesson - 1];
      setCurrLesson(previousLesson);
      setCurrPage(1);
      dispatch(setPage({ _id: subject._id, page_history: { page: 0, lesson: previousLesson } }));
    }
  };


  return (
    <section className="flex flex-col justify-center items-center gap-2 p-3">
      <div className="w-full text-center">
        <h2 className="text-cyan-600 text-2xl font-medium">Lesson - {subject.page_history.lesson + 1}</h2>
        <h3 className="text-cyan-600 text-xl font-medium">{CurrLesson ? CurrLesson.heading : ''} - {CurrLesson ? CurrLesson.subhead : ''}</h3>
      </div>
      <div className="relative w-full">
        {/* Swiper Slider */}
        {CurrLesson && CurrLesson.list && CurrLesson.list.length > 0 && (
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              updateNavigationState(swiper); // Initialize state
            }}
            onSlideChange={(swiper) => updateNavigationState(swiper)}
            spaceBetween={30}
            slidesPerView={1}
            loop={false}
          >
            {CurrLesson.list.map((topic, index) => (
              <SwiperSlide key={index}>
                <div className="w-full">
                  <span className="text-cyan-800 text-xl font-medium">{topic.name}</span>
                  <div dangerouslySetInnerHTML={{ __html: extractHtml(topic.indepth) }} className="html-container text-slate-800 font-medium" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Current Slide Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sky-800 px-4 py-2 rounded-full z-10">
          {currentPage}
        </div>

        {/* Give Test Button (Only visible on last slide) */}
        {CurrLesson && isEnd && (
          <button
            onClick={() => {
              router.push(`/lesson-test/${subject._id}/${subject.page_history.lesson}`)
            }}
            className="absolute bottom-5 right-5 bg-blue-900 text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center hover:bg-blue-500 transition z-10"
          >
            Give Test
          </button>

        )}
        {/* Previous Lesson Button (Only visible if not the first lesson) */}
        {CurrLesson && subject.page_history.lesson > 0 && (
          <button
            onClick={goToPreviousLesson}
            className="absolute bottom-5 left-5 bg-blue-900 text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center hover:bg-blue-500 transition z-10"
          >
            Previous Lesson
          </button>
        )}
      </div>
    </section>
  );
};

export default LessonSlider;
