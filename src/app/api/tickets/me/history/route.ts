import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        userId: session.user.id,
        endTime: {
          lte: new Date(),
        },
      },
      orderBy: {
        endTime: "desc",
      },
    });
    return NextResponse.json(tickets);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "An unexpected error occurred" }),
      { status: 500 }
    );
  }
}
