import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get("plate")?.toUpperCase();

  if (!plate) {
    return new NextResponse(JSON.stringify({ message: "Plate is required" }), { status: 400 });
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      plate,
      endTime: {
        gt: new Date(),
      },
    },
    orderBy: {
      endTime: "desc",
    },
  });

  if (!ticket) {
    return new NextResponse(JSON.stringify({ message: "No active ticket found" }), { status: 404 });
  }

  return NextResponse.json(ticket);
}
