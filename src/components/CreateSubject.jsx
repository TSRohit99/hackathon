import React, { useState } from "react";
import { Wand2, XIcon } from "lucide-react";
import { getResponse } from "@/utils/getAI";
import toast from "react-hot-toast";
  

const CreateSubjectModal = ({ isOpen, onClose, setSub }) => {
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState("");

  const handleCreate = () => {
    console.log("Subject Created:", { title, topics });
  
    setSub((prev) => [
      ...prev,
      {
        id: prev.length ? prev.length + 2 : 10, // Ensure unique IDs, even if `prev` is initially empty
        title: title || "Untitled", // Fallback for empty titles
        progress: 0,
      },
    ]);
    
  
    setTitle(""); // Reset the title to an empty string instead of null for controlled inputs
    setTopics(""); // Reset topics similarly
    toast.success("Successfully created new Subject");
    onClose(); // Close the modal or dialog
  };

  const handleAI = async () => {
    const toastId = toast.loading("Generating the AI suggestion");
    const prompt = `send me 5 interview based topics  on ${title}, make it to send the topics with comma separted and only topics no extra texts`;
    const res = await getResponse(prompt);
    if (res) {
      setTopics(res);
      toast.dismiss(toastId);
      toast.success("Successfully fetched the suggestions");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={24} />
        </button>

        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          Create Subject
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subject title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Topics</label>
          <textarea
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter topics separated by commas"
            rows={4}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Create Subject
          </button>

          <div
            className="group cursor-pointer relative"
            title="Get more interview-based topics using AI"
          >
            <button
              onClick={() => handleAI()}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 shadow-lg"
            >
              <Wand2 size={24} />
            </button>
            <div className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
              Get AI-based interview topics
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CreateSubjectModal;
