"use client"

import React, { useState } from "react";
import { Wand2, XIcon } from "lucide-react";
import { getResponse } from "@/utils/getAI";
import toast from "react-hot-toast";
import { getSuggestionsPrompt } from "@/utils/prompt";
import { createData } from "@/utils/createRoadmapQuestions";
import { generateIndepth, generateRoadmap } from "@/utils/Prompts";
import { PostSubject } from "@/utils/PostSubject";

const CreateSubjectModal = ({ isOpen, onClose, setSub }) => {
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState("");

  const handleCreate = async () => {
    if (!title || !topics) {
      toast.error("Title and topics are required to create a subject!");
      return;
    }


    try {
      console.log("Creating subject:", { title, topics });

      // const res = await createData(title, topics);
      // if (!res) throw new Error("Failed to create data.");
      const loadingToast1 = toast.loading("Be patient. We are making the best roadmap for your journey.");

      let initialRoadmap = null;
      let finalRoadmap = null;

      const MakeFinalRoadMap = async () => {
        initialRoadmap = await generateRoadmap(title, topics);
        console.log(initialRoadmap);

        toast.dismiss(loadingToast1);

        const loadingToast2 = toast.loading("We are writing an in-depth roadmap. This could take a couple of minutes.");
        finalRoadmap = await generateIndepth(initialRoadmap);
        console.log(finalRoadmap);

        toast.dismiss(loadingToast2);
      };

      // Loop until finalRoadmap is not null or empty
      while (!finalRoadmap || finalRoadmap.length === 0) {
        await MakeFinalRoadMap();
      }

      const insertedNewSubject = await PostSubject({ roadmap: finalRoadmap, title: title });
      console.log(insertedNewSubject);

      // Proceed only after the finalRoadmap is generated
      setSub((prev) => [
        ...prev,
        {
          id: prev.length ? prev[prev.length - 1].id + 1 : 10, // Ensure unique IDs
          title: title || "Untitled",
          progress: 0,
        },
      ]);

      toast.success("Successfully created the subject and roadmap!");

      // Clear inputs and close
      setTitle("");
      setTopics("");
      onClose();
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error("An error occurred while creating the subject. Please try again.");
    }
  };

  const handleAI = async () => {
    if (!title) {
      toast.error("Please enter a title to get AI suggestions.");
      return;
    }

    const aiToastId = toast.loading("Generating AI suggestions...");
    try {
      const prompt = getSuggestionsPrompt(title);
      const res = await getResponse(prompt);
      if (res) {
        setTopics(res);
        toast.dismiss(aiToastId);
        toast.success("Successfully fetched AI suggestions!");
      } else {
        throw new Error("Failed to fetch AI suggestions.");
      }
    } catch (error) {
      toast.dismiss(aiToastId);
      console.error(error);
      toast.error("An error occurred while generating AI suggestions.");
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
