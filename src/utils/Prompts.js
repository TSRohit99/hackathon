
import { stringToJsonObj } from '@/helper/jsonObjConverter';
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


const PromptGenerateRoadmap = (title, topics) => {
    return ` I want to learn ${title}.
    Generate a detailed roadmap for ${title} with the topics : ${topics}. Structure it into:
    1. headings ( name of the different topics ).
    2. Subheadings for each heading ( Again it depends on topic heading).
    3. A list of topics under each subheading with an in-depth explanation for each topic.
    Format the roadmap as a JSON string, where each heading has:
    - A 'heading' field (string).
    - A 'subhead' field (string).
    - A 'list' field, which is an array of objects with 'name' (string)  (string) fields. exactly like this. In list field just add name and nothing else.

    The returned value always should be in object form.
    Example of returned data:
    "roadmap": [
  {  
      "title": "[Provided Title]",  
      "roadmap": [  
        {  
          "heading": "[Provided Heading]",  
          "sub-heading": "[Generated Sub-Heading]",  
          "list": [  
            {  
              "name": "[Concept Name]",  
            }  
          ],
          "reference_link": "[URL Link]"  
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
                 reference_link: {
                    type: String,
                    required: [true, "Reference link is required"],
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

const PromptGenerateDescription = (topic, heading) => {
    return `Provide a detailed description for the topic "${heading}" under the subject "${topic}". Return the response as a well-structured HTML string, including appropriate tags such as <h1>, <p>, <ul>, <li>, or any other necessary tags to format the content effectively. Ensure proper indentation and semantic structure.`;
};

const PromptGenerateQuestions = (heading, topics) => {
    return `
    Generate 10 multiple-choice questions for the " ${heading} " and it's topics are : ${topics}. The question should relevant with the topics. Each question should have:
    - 'Question no' (numeric index starting from 1).
    - 'Question' (the text of the question).
    - 'Options' (an object with four options: 'a', 'b', 'c', 'd').
    - 'Correct_Ans' (the correct option as a single character: 'a', 'b', 'c', or 'd').
    - 'Given_Ans' (leave empty).
    - 'Dificulty_Level' (one of: Easy, Medium, Hard).
    Format your response as string of json of an array of objects, where each object follows this schema.
    `;
};


export const generateRoadmap = async (title, topics) => {
    try {
        console.log(`Title: ${title} and Topic: ${topics}`);
        const GEMINI_API_KEY = getNextAPIKey();
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let res = await fetchWithRetry(model, PromptGenerateRoadmap(title, topics));
        let objectArray = {};
        try {
            objectArray = stringToJsonObj(res.response.candidates[0].content.parts[0].text);
        } catch (parseError) {
            console.error("Failed to parse the roadmap:", parseError);
        }
        return objectArray;

    } catch (err) {
        console.error(err);
        return {};
    }
};


const retryOperation = async (operation, retries = 3, delay = 1000) => {
    let attempt = 0;
    let error;

    while (attempt < retries) {
        try {
            return await operation(); // Try the operation
        } catch (err) {
            attempt++;
            error = err;
            console.error(`Attempt ${attempt} failed:`, err);
            if (attempt < retries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retry
            }
        }
    }

    throw new Error(`Operation failed after ${retries} attempts: ${error.message}`);
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

                    const operation = async () => {
                        const IndepthDescription = await fetchWithRetry(model, PromptGenerateDescription(list.name, level.heading));
                        const description = IndepthDescription.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                        if (!description) {
                            throw new Error(`Failed to get valid description for ${list.name}`);
                        }
                        return { ...list, indepth: description};
                    };

                    try {
                        return await retryOperation(operation); // Retry if error occurs
                    } catch (error) {
                        console.error(`Error generating description for ${list?.name || 'Unknown list'}:`, error);
                        return list; // Return the list with no description if retry fails
                    }
                })
            );

            const updatedList = await Promise.all(updatedListPromises);

            //* Generate questions for the heading
            const questionApiKey = getNextAPIKey();
            const genAIForQuestions = new GoogleGenerativeAI(questionApiKey);
            const questionModel = genAIForQuestions.getGenerativeModel({ model: "gemini-1.5-flash" });

            const operationForQuestions = async () => {
                const HeadingTopics = level.list.map((item) => item.name).join(', ');
                const questionResponse = await fetchWithRetry(questionModel, PromptGenerateQuestions(level.heading, HeadingTopics));
                const questions = questionResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!questions) {
                    throw new Error(`Failed to generate questions for ${level.heading}`);
                }
                return stringToJsonObj(questions);
            };

            let questions = '';
            try {
                questions = await retryOperation(operationForQuestions); // Retry if error occurs
            } catch (error) {
                console.error(`Error generating questions for ${level.heading}:`, error);
                questions = []; // Return empty questions array if retry fails
            }

            return { ...UpdatedRoadMap[index_1], list: updatedList, questions };
        });

        UpdatedRoadMap = await Promise.all(indepthPromises);
        return UpdatedRoadMap;

    } catch (error) {
        console.error("Error generating in-depth descriptions:", error);
        return []; // Return empty array if something fails globally
    }
};