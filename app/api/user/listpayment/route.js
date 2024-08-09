// pages/api/payments.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateToken } from "../../middleware/validateauth";

export async function GET(request) {
    try {
        const headers = request.headers;
        const token = headers.get('token');

        let validateUser;
        try {
            validateUser = validateToken(token);
        } catch (error) {
            return  NextResponse.json({message : "Token is Invalid" || error.message }, { status: 401 });
        }

        // Fetch payment data from the database
        const payments = await prisma.payments.findMany();

        return NextResponse.json({ result: "success", payments }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
