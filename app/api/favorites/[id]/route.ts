import { deleteFavorite, favoriteExists, insertFavorite } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// app/api/favorites/[id]/route.ts
export const POST = auth(
  //@ts-ignore
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    // Await params to access id
    const apiParams = await params;
    const id = apiParams.id;

    //@ts-ignore
    if (!req.auth) {
      return NextResponse.json(
        { error: "Unauthorized - Not logged in" },
        { status: 401 }
      );
    }

    const {
      user: { email }, //@ts-ignore
    } = req.auth;

    const exists = await favoriteExists(id, email);
    if (exists) {
      return NextResponse.json({ message: "Already favorited" });
    }

    await insertFavorite(id, email);
    return NextResponse.json({ message: "Favorite Added" });
  }
);

export const DELETE = auth(
  //@ts-ignore
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    // Await params to access id
    const apiParams = await params;
    const id = apiParams.id;

    const {
      user: { email }, //@ts-ignore
    } = req.auth;

    await deleteFavorite(id, email);
    return NextResponse.json({ message: "Favorite removed" });
  }
);