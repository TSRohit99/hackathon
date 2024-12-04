export const getRoadmapPrompt = (title, topics) => {
    const prompt = `I want you to generate educational content for a roadmap on ${title} topics in the following JSON format. I am providing the title and heading names.  
    title : ${title}  
    Heading names : ${topics}  
    You will generate:  

    A sub-heading (short description) for each heading, explaining the main idea of the topic.  
    A list under each heading, where each item has a name and an indepth explanation a big text to elaborate on key concepts of the topic, and Reference link where users can go through and study more.  
    
    Follow this exact JSON structure for the output:  

    {  
      "title": "[Provided Title]",  
      "roadmap": [  
        {  
          "heading": "[Provided Heading]",  
          "sub-heading": "[Generated Sub-Heading]",  
          "list": [  
            {  
              "name": "[Concept Name]",  
              "indepth": "[Detailed Explanation]"  
            }  
          ],
          "Reference": "[URL Link]"  
        }  
      ]  
    }  

    Additional Instructions:  

    Ensure the sub-heading provides a clear and concise overview of the topic.  
    The list items should include essential concepts related to the heading, with clear and concise explanations and proper Reference website.  
    The generated content must be accurate, relevant, and follow the JSON format strictly. make sure to send the response fully.`;
    return prompt;
};

export const getQuestionsPrompt = (title, topics) => {
    const prompt = `I want you to generate questions content for each ${title} headings in the following JSON format. I am providing the title and heading names.  
     title : ${title}
     Heading names : ${topics} 
     You will generate:
    
    Multiple-choice questions under questions, with the following details:
    Exactly 3 questions per heading.
    1 Easy, 1 Medium, and 1 Hard questions.
    Each question should include:
    title
    Question text.
    Options with four choices labeled a, b, c, and d.
    Correct_Ans as the correct option.
    Given_Ans left blank.
    Difficulty_Level as Easy, Medium, or Hard.
    Follow this exact JSON structure for the output:
    
    
    {
    
          "questions": [
            title : "",
            {
              "Question no": 1,
              "Question": "[Generated Question]",
              "Options": {
                "a": "[Option A]",
                "b": "[Option B]",
                "c": "[Option C]",
                "d": "[Option D]"
              },
              "Correct_Ans": "[Correct Option]",
              "Given_Ans": "",
              "Difficulty_Level": "[Easy/Medium/Hard]"
            }
          ]
    }
    
    Additional Instructions:
    Ensure the questions are diverse and test key aspects of the topic. Maintain the specified difficulty distribution (1 Easy, 1Medium, 1 Hard).
    The generated content must be accurate, relevant, and follow the JSON format strictly.
    `;
    return prompt;
};

export const getSuggestionsPrompt = (title) => {
    const prompt = `send me 4 interview based topics  on ${title}, make it to send the topics with comma separted and only topics no extra texts`;

    return prompt;
}
