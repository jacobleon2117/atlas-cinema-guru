import { fetchWatchLaters } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * GET /api/watch-later
 */
export const GET = auth(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const page = params.get("page") ? Number(params.get("page")) : 1;
  const minYear = params.get("minYear") ? Number(params.get("minYear")) : undefined;
  const maxYear = params.get("maxYear")
    ? Number(params.get("maxYear"))
    : undefined;
  const query = params.get("query") ?? undefined;

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

  const watchLater = await fetchWatchLaters(page, email, minYear, maxYear, query);

  return NextResponse.json({ watchLater });
});