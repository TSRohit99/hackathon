export const stringToJsonObj = (str) => {
  let cleanedString = str
    .replace(/^```json\s*/, "")
    .replace("```", "")
    .trim();
  while (cleanedString.includes('```')) {
    cleanedString = cleanedString.replace(/\s*```$/, '').trim();
  }
  const objectArray = JSON.parse(cleanedString);
  return objectArray;
};
