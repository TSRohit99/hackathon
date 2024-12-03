import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try {
        const response = NextResponse.json({
            message: 'Sign Out successfully.',
            success: true
        });

        response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
};