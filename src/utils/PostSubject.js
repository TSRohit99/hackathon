import { showToastWithCloseButton } from "@/hooks/showToast";
import axios from "axios";

export const PostSubject = async (subject) => {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/subjects`, subject );
        return res.data;
    } catch (error) {
        showToastWithCloseButton(error.response.data.message || error.message, 'error');
        throw new Error("Error posting subject");
    }
};