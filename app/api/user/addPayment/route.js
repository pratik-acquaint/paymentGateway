

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateToken } from "../../middleware/validateauth";

export async function POST(request) {
    try {
        const headers = request.headers;
        const token = headers.get('token');

        let validateUser;
        try {
            validateUser = validateToken(token);
        } catch (error) {
            return  NextResponse.json({message : "Token is Invalid" || error.message }, { status: 401 });
        }

        const { paymentId, userId } = await request.json();
        console.log('paymentId,userId', paymentId, userId)


        const data = {
            paymentId: paymentId || 1,
            userId: validateUser?.userId,
        };

        // Save Payment data to the database
        await prisma.payments.create({ data });

        return NextResponse.json({ result: "success", message: 'Payment Added Successfully' }, { status: 200 });
    }
    catch (error) {
        console.error('Error:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}