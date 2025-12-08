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
    const userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, carPlate: true, role: true },
    });
    return NextResponse.json(userProfile);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "An unexpected error occurred" }),
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const { name, carPlate } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        carPlate: carPlate?.toUpperCase() || undefined,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "An unexpected error occurred" }),
      {
        status: 500,
      }
    );
  }
}
