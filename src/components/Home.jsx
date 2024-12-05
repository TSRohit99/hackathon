"use client";
import React, { useState } from "react";
import { Trash2, Plus, Search } from "lucide-react";
import CreateSubjectModal from "./CreateSubject";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

const SubjectModal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null); // Track ID to delete
  const [subjects, setSubjects] = useState([
    { id: 1, title: "Mathematics", progress: 20 },
    { id: 3, title: "Java", progress: 75 },
    { id: 4, title: "Python", progress: 75 },
    { id: 5, title: "economics", progress: 75 },
  ]);
  const demofun = () => {
    return "testing conflict";
  };
  const handleModal = () => {
    setIsModalOpen(true);
  };
  //hi there
  const handleDelete = (id) => {
    setIsAlertModalOpen(true);
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    setSubjects((prev) =>
      prev.filter((subject) => subject.id !== pendingDeleteId)
    );
    setPendingDeleteId(null);
    toast.success("Successfully  deleted!");
    setIsAlertModalOpen(false);
  };

  return (
    <div className="bg-black/50 flex justify-center items-center min-h-screen p-4">
      <div className="w-full md:w-1/2 lg:w-3/4 xl:w-1/2 bg-white shadow-lg rounded-lg p-4 sm:p-6 max-h-96 overflow-y-scroll">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-0">
            Subjects
          </h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                size={20}
              />
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
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors w-full sm:w-auto"
            >
              <Plus className="mr-2" /> Create Subject
            </button>
          </div>
        </div>

        <hr className="border-t-2 border-blue-100 my-4" />

        <div className="overflow-y-auto max-h-[500px]">
          {subjects
            .filter((subject) =>
              subject.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((subject) => (
              <div
                key={subject.id}
                className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-lg mb-2 hover:bg-blue-100 transition-colors"
              >
                <span className="text-blue-800 font-semibold mb-2 sm:mb-0">
                  {subject.title}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {subject.progress}%
                  </span>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <AlertDialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
        <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              subject and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsAlertModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setSub={setSubjects}
      />
    </div>
  );
};

export default SubjectModal;
