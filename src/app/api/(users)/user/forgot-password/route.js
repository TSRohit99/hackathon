import connectDB from "@/config/connectDB";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { emailAuthentication } from "@/config/emailAuth";
import userModel from "@/models/userModel";
import bcrypt from "bcrypt";


export const POST = async (request) => {
    try {
        const body = await request.json();

        await connectDB();
        const isUserExist = await userModel.findOne({ email: body.email });
        if (!isUserExist)
            return NextResponse.json(
                { success: false, message: "Email not found!" },
                { status: 400 }
            );

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(body.password, salt);

        const token = jwt.sign(
            { name: body.name, email: body.email, password: password },
            process.env.NEXT_PUBLIC_JWT_SECRET,
            { expiresIn: '5m' }
        );

        const confirmationLink = `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/forgot-password/?token=${token}`;

        const html = `
            <h1>Rest the password.</h1>
            <h2>Confirm your email: <a href="${confirmationLink}">Click Here</a></h2>
            <p>This link will expire in <strong>5 minutes</strong>.</p>
        `;

        const emailSent = await emailAuthentication(body.email, 'Email Confirmation', html);

        if (emailSent) {
            return NextResponse.json({ message: 'Email Confirmation Sent please reset the password.' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to send email confirmation' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred" },
            { status: 500 }
        );
    }
};


export const GET = async (request) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
        const updatedUser = await userModel.findOneAndUpdate(
            { email: decoded.email },
            { $set: { password: decoded.password } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found!' }, { status: 404 });
        }

       const redirectUrl = new URL("/signin", request.url);
       redirectUrl.searchParams.set("message", "Password updated successfully");

       return NextResponse.redirect(redirectUrl);

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return new NextResponse(
                `<div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
                    <h1>Reset email link expired!!</h1>
                    <script>
                        setTimeout(() => {
                            document.querySelector('h1').textContent = "This link is no longer valid.";
                        }, 300000); // 5 minutes
                    </script>
                </div>`,
                { status: 400, headers: { 'Content-Type': 'text/html' } }
            );
        } else {
            console.error(error);
            return NextResponse.json(
                { message: 'Invalid or malformed token. Please try again later' },
                { status: 400 }
            );
        }
    }
};