
const { GoogleGenerativeAI } = require("@google/generative-ai");


export const getResponse = async (prompt) => {
<<<<<<< HEAD
=======

>>>>>>> 1f48907baf709aeee264805a0cb2d90a68fdf1ed
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 

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