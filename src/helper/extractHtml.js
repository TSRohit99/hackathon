const extractHtml = (response) => {
    if (response.startsWith("```html") && response.endsWith("```")) {
        return response.slice(7, -3).trim();
    }
    return response;
};

export default extractHtml;