import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URL not configured" },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/vehicle-types`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: 502 }
      );
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Unable to reach backend" },
      { status: 502 }
    );
  }
}
