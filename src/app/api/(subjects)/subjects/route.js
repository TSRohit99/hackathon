import connectDB from "@/config/connectDB";
import verifyToken from "@/helper/verifyToken";
import subjectModel from "@/models/subjectModel";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) {
            console.warn('No token provided in the request.');
            return NextResponse.json({ message: 'Token not provided!' }, { status: 401 });
        }

        const user = await verifyToken(token);
        if (!user) {
            console.warn('Invalid or expired token:', token);
            return NextResponse.json({ message: 'Invalid or expired token!' }, { status: 401 });
        }

        console.log('User after verification:', user);

        const userSubjects = await subjectModel.find({ user_id: user._id });
        return NextResponse.json(userSubjects);
        
    } catch (error) {
        console.error('Error in GET /subjects:', error);
        return NextResponse.json({ message: 'Failed to fetch subjects.', error: error.message }, { status: 500 });
    }
};


export const POST = async (request) => {
    try {
        await connectDB();
        const body = await request.json();


        const token = request.cookies.get('token')?.value;
        const user = await verifyToken(token);

        if (!user) return NextResponse.json({ message: 'Invalid user token!' }, { status: 401 });

        const subjectBody = {
            ...body,
            user_id: user._id,
            page_history: { lesson: 0, page: 0 }
        };

        const newSubject = await new subjectModel(subjectBody);
        const subjectResponse = await newSubject.save();

        return NextResponse.json(subjectResponse);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};