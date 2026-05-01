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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, firstName, lastName, age } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const updatedPlayer = await prisma.player.update({
      where: { id: id }, // Ensure this matches your schema (id is a string/uuid)
      data: {
        firstName,
        lastName,
        age: Number(age),
      },
    });

    // We MUST return a JSON object so the frontend .json() doesn't fail
    return NextResponse.json(updatedPlayer, { status: 200 });
  } catch (error: any) {
    console.error("PUT Error:", error.message);
    return NextResponse.json(
      { error: "Failed to update", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    // Prisma deletes the record where the ID matches
    await prisma.player.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete player:", error.message);
    return NextResponse.json(
      { error: "Failed to delete player", details: error.message },
      { status: 500 },
    );
  }
}
