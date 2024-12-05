export const stringToJsonObj = (str) => {
  const cleanedString = str
    .replace(/^```json\s*/, "")
    .replace("```", "")
    .trim();
  const objectArray = JSON.parse(cleanedString);
  return objectArray;
};
