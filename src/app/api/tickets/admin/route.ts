import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const size = parseInt(searchParams.get("size") || "10");
    const sortBy = searchParams.get("sortBy") || "startTime";
    const direction = searchParams.get("direction") || "desc";

    const tickets = await prisma.ticket.findMany({
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        [sortBy]: direction,
      },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    const totalTickets = await prisma.ticket.count();

    return NextResponse.json({
      tickets,
      totalPages: Math.ceil(totalTickets / size),
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "An internal server error occurred." }),
      { status: 500 }
    );
  }
}
