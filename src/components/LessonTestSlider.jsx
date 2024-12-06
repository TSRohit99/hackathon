"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LessonTestSlider = ({ Questions, setTestMode, SetAnswers }) => {
    const [answers, setAnswers] = useState({});
    const [isLastSlide, setIsLastSlide] = useState(false);

    // Initialize answers when Questions are loaded or updated
    useEffect(() => {
        if (Questions) {
            const initialAnswers = Questions.reduce((acc, question) => {
                acc[question.Question_no] = {
                    given_answer: "",
                    correct_answer: question.Correct_Ans,
                };
                return acc;
            }, {});
            setAnswers(initialAnswers);
        }
    }, [Questions]);

    const handleAnswerChange = (questionNo, selectedAnswer) => {
        setAnswers((prev) => ({
            ...prev,
            [questionNo]: {
                ...prev[questionNo],
                given_answer: selectedAnswer,
            },
        }));
    };

    const handleSlideChange = (swiper) => {
        // Check if the active slide is the last one
        setIsLastSlide(swiper.activeIndex === Questions.length - 1);
    };

    const handleSubmit = () => {
        setTestMode(true);
        SetAnswers(answers);
    };

    const generateQuestion = (question) => (
        <section key={question.Question_no}>
            <h3 className="text-lg font-semibold mb-4">{question.Question}</h3>
            <div>
                {Object.entries(question.Options).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3 mb-3">
                        <input
                            type="radio"
                            id={key}
                            name={`question-${question.Question_no}`}
                            value={key}
                            checked={answers[question.Question_no]?.given_answer === key}
                            onChange={() => handleAnswerChange(question.Question_no, key)}
                            className="h-6 w-6 text-blue-600 border-gray-300 rounded-full"
                        />
                        <label htmlFor={key} className="text-gray-700 text-sm">
                            {value}
                        </label>
                    </div>
                ))}
            </div>
        </section>
    );

    return (
        <section>
            <div className="w-full max-w-xl mx-auto mt-8">
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Pagination]} // Remove Navigation module
                    onSlideChange={handleSlideChange}
                >
                    {/* Iterate over the Questions prop */}
                    {Questions?.map((question, index) => (
                        <SwiperSlide
                            key={index}
                            className="bg-gray-100 p-8 rounded-xl shadow-sm"
                        >
                            {generateQuestion(question)}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Submit button shown only on the last slide */}
                {isLastSlide && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleSubmit}
                            className="bg-slate-800 text-white px-6 py-2 rounded-md shadow-md hover:bg-slate-500"
                        >
                            Submit Answers
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LessonTestSlider;