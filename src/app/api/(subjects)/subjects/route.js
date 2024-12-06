import connectDB from "@/config/connectDB";
import verifyToken from "@/helper/verifyToken";
import subjectModel from "@/models/subjectModel";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
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


export const DELETE = async (request) => {
    try {
        await connectDB();
        const url = new URL(request.url);
        const _id = url.searchParams.get("_id");

        if (!_id) {
            throw new Error("Subject ID is required");
        }

        const deletedSubject = await subjectModel.findByIdAndDelete({ _id: _id });
        if (!deletedSubject) {
            return NextResponse.json({ message: 'Subject not found or unauthorized!' }, { status: 404 });
        }

        return NextResponse.json(_id);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}