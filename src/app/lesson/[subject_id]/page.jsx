'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import { Roboto } from '@next/font/google';
import LessonSlider from '@/components/LessonSlider';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const Lesson = () => {
  const { subject_id } = useParams();
  const { subjects } = useAppSelector(state => state.subjectStore);
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    if (subjects) {
      const SelectedSubject = subjects.find((subject) => subject._id === subject_id);
      setSubject(SelectedSubject);
    }
  }, [subjects, subject_id]);

  if (!subject) return <div className={`h-screen flex justify-center items-center bg-blue-100 ${roboto.className} text-slate-600 text-3xl font-medium`} >No lesson found!!</div>

  return (
    <section className='min-h-screen bg-slate-50 py-2'>
      <h3 className={`text-center text-cyan-700 font-semibold text-3xl ${roboto.className}`}>{subject.title}</h3>
      <LessonSlider subject={subject} />
    </section>
  )
}

export default Lesson;