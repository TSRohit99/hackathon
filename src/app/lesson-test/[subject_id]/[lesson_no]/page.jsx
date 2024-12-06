"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Roboto } from "@next/font/google";
import LessonTestSlider from "@/components/LessonTestSlider";
import { useAppSelector } from "@/lib/hooks";
import TestAnswers from "@/components/TestAnswers";

const roboto = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

const LessonTest = () => {
    const { subject_id, lesson_no } = useParams();
    const [questions, setQuestions] = useState([]);
    const [subject, setSubject] = useState('');

    const { subjects } = useAppSelector((state) => state.subjectStore);
    const [testMode, setTestMode] = useState(true);
    const [answers, SetAnswers] = useState();

    useEffect(() => {
        if (subjects && subject_id) {
            const subject = subjects.find((item) => item._id === subject_id);
            setSubject(subject);
            console.log(subject);
            const UpdatedQuestions = subject.roadmap[lesson_no].questions;
            setQuestions(UpdatedQuestions);
        }
    }, [subjects]);

    return (
        <section className={`h-screen bg-slate-50 ${roboto.className}`}>
            <h3 className={`text-center text-cyan-700 font-semibold text-3xl ${roboto.className}`}>
                {subject.title}
            </h3>
            <div className="w-full text-center">
                <h3 className="text-cyan-600 text-xl font-medium">{subject ? subject.roadmap[lesson_no].heading : ''} - {subject ? subject.roadmap[lesson_no].subhead : ''}</h3>
            </div>
            <section className="flex justify-center items-center">
                {testMode ?
                    <LessonTestSlider Questions={questions} setTestMode={setTestMode} SetAnswers={SetAnswers} />
                    : <TestAnswers subject_id={subject_id} lesson_no={lesson_no} questions={questions} answers={answers} />}
            </section>

        </section>
    );
};

export default LessonTest;
