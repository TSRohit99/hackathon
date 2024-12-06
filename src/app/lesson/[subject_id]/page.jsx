'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Lesson = () => {
  const { subject_id } = useParams();
  const { subjects } = useAppSelector(state => state.subjectStore);
  const dispatch = useAppDispatch();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (subjects) {
      const SelectedLesson = subjects.filter((subject) => subject._id === subject_id);
      console.log(SelectedLesson);
      setLesson(SelectedLesson);
    }
  }, [subjects, subject_id]);

  if(!lesson) return <div className='h-screen flex justify-center items-center'>No lesson found!!</div>

  return (
    <div>Lesson: {subject_id}</div>
  )
}

export default Lesson;