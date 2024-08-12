import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const { email, password, name } = await request.json();
        const findUser = await prisma.user.findUnique({
            where: { email },
        });

        if (findUser) {
            return NextResponse.json({ message: 'User has Already SignUp with this email Id' }, { status: 200 });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {
            name: name,
            password: hashedPassword,
            email: email
        };
        // Save user data to the database
        await prisma.user.create({ data });
        return NextResponse.json({ result: "success", message: 'Sign Up Successfully' },{status:200});
    }
    catch (error) {
        console.error('Error:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


