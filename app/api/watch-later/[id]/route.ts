import {
  deleteWatchLater,
  insertWatchLater,
  watchLaterExists,
} from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// app/api/watch-later/[id]/route.ts
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

    const exists = await watchLaterExists(id, email);
    if (exists) {
      return NextResponse.json({ message: "Already added to Watch Later" });
    }

    await insertWatchLater(id, email);
    return NextResponse.json({ message: "Watch Later Added" });
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

    await deleteWatchLater(id, email);
    return NextResponse.json({ message: "Watch Later removed" });
  }
);