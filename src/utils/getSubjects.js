import axios from "axios";

const { showToastWithCloseButton } = require("@/hooks/showToast");

const GetSubjects = async () => {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/api/subjects`);
        return res.data;
    } catch (error) {
        console.log(error);
        showToastWithCloseButton(error.message, 'error');
        return [];
    }
};

export default GetSubjects;