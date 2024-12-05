
import { GoogleGenerativeAI } from '@google/generative-ai';
import pLimit from 'p-limit';

const API_KEYS = [process.env.NEXT_PUBLIC_GEMINI_API_KEY_1, process.env.NEXT_PUBLIC_GEMINI_API_KEY_2, process.env.NEXT_PUBLIC_GEMINI_API_KEY_3];
let currentKeyIndex = 0;

function getNextAPIKey() {
    const apiKey = API_KEYS[currentKeyIndex];
    if (!apiKey) {
        throw new Error(`API Key at index ${currentKeyIndex} is not set properly.`);
    }
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return apiKey;
}

// Exponential backoff function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (model, prompt, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await model.generateContent(prompt);
            return res;
        } catch (error) {
            if (error.message.includes('429') && attempt < retries) {
                console.log(`Rate limit exceeded. Retrying... Attempt ${attempt}/${retries}`);
                await sleep(delay * Math.pow(2, attempt)); // Exponential backoff
            } else {
                throw error; // Rethrow the error if it's not a 429 or if retries are exhausted
            }
        }
    }
    throw new Error('Max retries reached for API request');
}


const PromptGenerateRoadmap = (title) => {
    return `
    Generate a detailed roadmap for ${title}. Structure it into:
    1. Main headings ( it depends on the topic).
    2. Subheadings for each heading ( Again it depends on topic).
    3. A list of topics under each subheading with an in-depth explanation for each topic.
    Format the roadmap as a JSON string, where each heading has:
    - A 'heading' field (string).
    - A 'subhead' field (string).
    - A 'list' field, which is an array of objects with 'name' (string)  (string) fields. exactly like this. In list field just add name and nothing else.

    The returned value always should be in object form.
    Example of returned data:
  "roadmap": [
    {
      "heading": "Fundamentals of JavaScript",
      "subhead": "Basics of JavaScript",
      "list": [
        {
          "name": "Variables and Data Types",
        },
        {
          "name": "Functions",
        }
      ]
    },
    {
      "heading": "Intermediate JavaScript",
      "subhead": "Advanced Features of ES6",
      "list": [
        {
          "name": "Promises and Async/Await",
        },
        {
          "name": "Destructuring and Spread Syntax",
        }
      ]
    }
  ]



    follow this schema -> 
  
        roadmap: [
            {
                heading: {
                    type: String,
                    required: [true, "Heading is required"],
                    trim: true,
                },
                subhead: {
                    type: String,
                    required: [true, "Sub-heading is required"],
                    trim: true,
                },
                list: [
                    {
                        name: {
                            type: String,
                            required: [true, "List item name is required"],
                            trim: true,
                        }
                    },
                ],
            },
            ]
            `
};

const PromptGenerateDescription = (title) => {
    return `give me a string of indepth description for ${title}`;
};

const PromptGenerateQuestions = (title) => {
    return `
        Generate 10 multiple-choice questions for the topic " ${title} ". Each question should have:
- 'Question no' (numeric index starting from 1).
- 'Question' (the text of the question).
- 'Options' (an object with four options: 'a', 'b', 'c', 'd').
- 'Correct_Ans' (the correct option as a single character: 'a', 'b', 'c', or 'd').
- 'Given_Ans' (leave empty).
- 'Dificulty_Level' (one of: Easy, Medium, Hard).
Format your response as an array of objects, where each object follows this schema.
    `;
};



export const generateRoadmap = async (title) => {
    try {
        const GEMINI_API_KEY = getNextAPIKey();
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let res = await fetchWithRetry(model, PromptGenerateRoadmap(title)); // Use retry function
        const cleanedString = res.response.candidates[0].content.parts[0].text
            .replace(/^```json\s*/, "")
            .replace("```", "")
            .trim();

        let objectArray = {};
        try {
            objectArray = JSON.parse(cleanedString);
        } catch (parseError) {
            console.error("Failed to parse the roadmap:", parseError);
        }

        console.log(objectArray);
        return objectArray;

    } catch (err) {
        console.error(err);
        return {};
    }
};

export const generateIndepth = async (roadmapObj) => {
    try {
        let UpdatedRoadMap = [...roadmapObj.roadmap];
        const limit = pLimit(3);

        //* Generate in-depth descriptions and questions in parallel with limited concurrency
        const indepthPromises = roadmapObj.roadmap.map(async (level, index_1) => {
            const updatedListPromises = level.list.map(list =>
                limit(async () => {
                    const apiKey = getNextAPIKey();
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                    try {
                        const IndepthDescription = await fetchWithRetry(model, PromptGenerateDescription(list.name)); // Use retry function
                        const description = IndepthDescription.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        if (!description) {
                            throw new Error(`Failed to get valid description for ${list.name}`);
                        }
                        return { ...list, indepth: description };
                    } catch (error) {
                        console.error(`Error generating description for ${list?.name || 'Unknown list'}:`, error);
                        return list;
                    }
                })
            );

            const updatedList = await Promise.all(updatedListPromises);

            //* Generate questions for the heading
            const questionApiKey = getNextAPIKey();
            const genAI = new GoogleGenerativeAI(questionApiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            try {
                const questionResponse = await fetchWithRetry(model, PromptGenerateQuestions(level.heading)); // Use retry function
                const questions = questionResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                if (!questions) {
                    throw new Error(`Failed to generate questions for ${level.heading}`);
                }
                const cleanedString = questions.replace(/^```json\s*/, "").replace("```", "").trim();
                return { ...UpdatedRoadMap[index_1], list: updatedList, questions: JSON.parse(cleanedString) };
            } catch (error) {
                console.error(`Error generating questions for ${level.heading}:`, error);
                return { ...UpdatedRoadMap[index_1], list: updatedList, questions: [] };
            }
        });

        UpdatedRoadMap = await Promise.all(indepthPromises);
        console.log(UpdatedRoadMap);
        return UpdatedRoadMap;

    } catch (error) {
        console.error("Error generating in-depth descriptions:", error);
        return [];
    }
};