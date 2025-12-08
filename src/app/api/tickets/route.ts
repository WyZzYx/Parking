import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Define the allowed durations in minutes
const ALLOWED_DURATIONS = [30, 60, 120, 360, 1440];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const { plate, durationMinutes } = await request.json();

    // Validate duration
    if (!ALLOWED_DURATIONS.includes(durationMinutes)) {
      return new NextResponse(JSON.stringify({ message: "Invalid duration" }), { status: 400 });
    }

    let finalPlate = (plate as string)?.trim().toUpperCase();

    // If the plate is not provided, use the user's default car plate from the session
    if (!finalPlate) {
      finalPlate = session.user.carPlate?.trim().toUpperCase() || '';
    }

    // If there's still no plate, return an error
    if (!finalPlate) {
      return new NextResponse(JSON.stringify({ message: "Plate is required and no default is set" }), { status: 400 });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    const ticket = await prisma.ticket.create({
      data: {
        userId: session.user.id,
        plate: finalPlate,
        durationMinutes,
        startTime,
        endTime,
      },
    });

    return NextResponse.json(ticket);
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    return new NextResponse(
      JSON.stringify({ message: "An internal server error occurred." }),
      { status: 500 }
    );
  }
}
