"use client"
import React, { useState } from 'react';
import { Trash2, Plus, Search } from 'lucide-react';
import CreateSubjectModal from './CreateSubject';

const SubjectModal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState('');
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      title: 'Mathematics',
      progress: 20
    },
    {
      id: 2,
      title: 'JAVA',
      progress: 65
    },
    {
      id: 3,
      title: 'C++',
      progress: 75
    }
    ,
    {
      id: 4,
      title: 'python',
      progress: 75
    },

  ]);

  const handleModal = () => {
    setIsModalOpen(true);
  }

  const handleDelete = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  return (
    <div className='bg-black/50 flex justify-center items-center min-h-screen p-4'>
      <div className="w-full md:w-1/2 lg:w-3/4 xl:w-1/2 bg-white shadow-lg rounded-lg p-4 sm:p-6 max-h-96 overflow-y-scroll">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-0">Subjects</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              <input
                type="text"
                placeholder="Search subjects"
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleModal}
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors w-full sm:w-auto">
              <Plus className="mr-2" /> Create Subject
            </button>
          </div>
        </div>

        <hr className="border-t-2 border-blue-100 my-4" />

        <div className="overflow-y-auto max-h-[500px]">
          {subjects
            .filter(subject =>
              subject.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((subject) => (
              <div
                key={subject.id}
                className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-lg mb-2 hover:bg-blue-100 transition-colors"
              >
                <span className="text-blue-800 font-semibold mb-2 sm:mb-0">{subject.title}</span>

                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{subject.progress}%</span>

                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <CreateSubjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setSub={setSubjects} />
    </div>
  );
};

export default SubjectModal;