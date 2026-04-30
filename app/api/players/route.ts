import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
  // DEBUG: This will help us confirm Dockploy is injecting the right URL
  console.log(
    "Database connection attempt to:",
    process.env.DATABASE_URL?.split("@")[1],
  );

  try {
    const { searchParams } = new URL(request.url);
    const ageParam = searchParams.get("age");

    const query = ageParam ? { where: { age: Number(ageParam) } } : undefined;

    const players = await prisma.player.findMany(query);
    return NextResponse.json(players, { status: 200 });
  } catch (error: any) {
    console.error("Prisma Error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch players", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.firstName || !body.lastName || !body.age) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const player = await prisma.player.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        age: Number(body.age),
      },
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error("Failed to create player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 },
    );
  }
}
