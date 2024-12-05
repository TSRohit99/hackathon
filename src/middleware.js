import verifyToken from '@/helper/verifyToken';
import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    if (!token) {
        if (pathname === '/signin' || pathname === '/signup') {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/signup', request.url));
    }

    const decodedToken = verifyToken(token);

    if (decodedToken) {
        if (pathname === '/signin' || pathname === '/signup') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();

    } else {
        if (pathname !== '/signin' && pathname !== '/signup') {
            return NextResponse.redirect(new URL('/signup', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/signin', '/signup'],
};