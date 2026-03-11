import { NextRequest, NextResponse } from "next/server";

const QURAN_API_BASE = "https://api.quran.com/api/v4";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  // Build the upstream URL, forwarding all params except "path"
  const upstream = new URL(`${QURAN_API_BASE}/${path}`);
  searchParams.forEach((value, key) => {
    if (key !== "path") upstream.searchParams.set(key, value);
  });

  try {
    const res = await fetch(upstream.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch from Quran API" }, { status: 502 });
  }
}
