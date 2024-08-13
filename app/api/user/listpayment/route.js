import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateToken } from "../../middleware/validateauth";


export async function GET(request) {
    try {
        const headers = request.headers;
        const token = headers.get('token');
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const rowsPerPage = searchParams.get('rowsPerPage');

        try {
            await validateToken(token);
            const totalRecords = await prisma.payments.count();
            const payments = await prisma.payments.findMany({
                skip: (page - 1) * rowsPerPage,
                take: parseInt(rowsPerPage),
            });
            const paymentsWithUserDetails = await Promise.all(
                payments.map(async (payment) => {
                    const user = await prisma.user.findUnique({
                        where: { id: payment.userId },
                    });
                    return {
                        createdAt: payment.createdAt,
                        user: user
                    };
                })
            );
            return NextResponse.json({ result: "success", data: paymentsWithUserDetails ,total :totalRecords}, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: "Token is Invalid" || error.message }, { status: 401 });
        }
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}