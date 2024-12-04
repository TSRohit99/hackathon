import { jwtVerify } from 'jose';

const verifyToken = async (token) => {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET));
        return payload;
    } catch (error) {
        console.error("JWT verification error:", error);
        return null;
    }
};

export default verifyToken;