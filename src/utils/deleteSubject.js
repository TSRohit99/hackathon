import { showToastWithCloseButton } from "@/hooks/showToast";
import axios from "axios";

export const DeleteSubject = async (_id) => {
    try {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/api/subjects?_id=${_id}`, { withCredentials: true, });
        return res.data;

    } catch (error) {
        console.log(error);
        showToastWithCloseButton(error.response.data.message || error.message, 'error');
        return '';
    }
};