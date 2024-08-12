import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const secretkey = process.env.SECRETKEY;
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const findUser = await prisma.user.findUnique({
            where: { email },
        });

        if (findUser == null) {
            return NextResponse.json({ message: 'User not Found' }, { status: 200 });
        }

        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if (!passwordMatch) {
            return NextResponse.json({ message: 'Credential is Incorrect' }, { status: 401 });
        }
        const token = jwt.sign(
            { userId: findUser.id },
            secretkey,
            { expiresIn: '10h' }
        );
        return NextResponse.json({ result: "success", message: 'User Login Successfully', token }, { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


