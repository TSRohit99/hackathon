
const { GoogleGenerativeAI } = require("@google/generative-ai");


export const getResponse = async (prompt) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Replace with your Gemini API Key

    try {

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


    let res = await model.generateContent(prompt);
  //  console.log(response.response.candidates[0].content.parts[0].text)
  const cleanedString = await res.response.candidates[0].content.parts[0].text;

  return cleanedString;

} catch(err) {
    console.error(err)
}
return null;

}