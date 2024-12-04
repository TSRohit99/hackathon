import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import connectDB from "@/config/connectDB";
import userModel from "@/models/userModel";

export const POST = async (request) => {
    try {
        const body = await request.json();
        if (!body.email || !body.password) {
            return NextResponse.json({ success: false, message: 'Email and password are required!' }, { status: 400 });
        }

        await connectDB();
        const user = await userModel.findOne({ email: body.email }).select("+password");
        if (!user) {
            return NextResponse.json({ success: false, message: 'Email not found!' }, { status: 400 });
        }

        const isValidPassword = await bcrypt.compare(body.password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ success: false, message: 'Invalid password!' }, { status: 400 });
        }

        // Create token payload
        const tokenPayload = {
            id: user._id,
            email: user.email,
        };

        // Generate JWT token
        const token = jwt.sign(tokenPayload, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '30d' });

        // Set response with token in cookies
        const response = NextResponse.json({ message: 'Sign-in successful.' });
        response.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return response;

    } catch (error) {
        console.error("Error during sign-in:", error); // More detailed logging
        return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
    }
};