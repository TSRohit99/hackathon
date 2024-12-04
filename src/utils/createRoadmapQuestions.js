import toast from "react-hot-toast";
import { getRoadmapPrompt, getQuestionsPrompt } from "./prompt";
import { stringToJsonObj } from "@/helper/jsonObjConverter";

const { GoogleGenerativeAI } = require("@google/generative-ai");

export const createData = async (title, topics) => {
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const rdPrompt = getRoadmapPrompt(title, topics);
    let toastId = toast.loading("Creating the best Roadmap....");
    let roadmapContent = await model.generateContent(rdPrompt);
    if (roadmapContent) {
      toast.dismiss(toastId);
      toast.success("Successfully created the roadmap!");
      toastId = toast.loading("Creating Questions....");
    }
    const roadmap = stringToJsonObj(
      roadmapContent.response.candidates[0].content.parts[0].text
    );
    const qsPrompt = getQuestionsPrompt(title, topics);
    let questionsContent = await model.generateContent(qsPrompt);
    if (questionsContent) {
      toast.dismiss(toastId);
      toast.success("Successfully created the question set!");
    }
    const questions = stringToJsonObj(
      questionsContent.response.candidates[0].content.parts[0].text
    );

    const mergeRoadmapAndQuestions = (roadmap, questions) => {
      return roadmap.map((section, index) => {
        const sectionQuestions = questions
          .filter((q) => q.title === section.heading)
          .slice(0, 3);

        return {
          ...section,
          questions: sectionQuestions,
        };
      });
    };

    const updatedRoadmap = {
      title: title,
      roadmap: mergeRoadmapAndQuestions(roadmap.roadmap, questions.questions),
    };
    console.log("Final Version for DB", updatedRoadmap);

    //Add this data object to the Mongodb

    return true;
  } catch (err) {
    console.error(err);
  }
  return null;
};
