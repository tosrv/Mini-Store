import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json({ data: [] });
  }

  try {
    const res = await fetch(
      `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${search}&limit=999&offset=0`,
      {
        headers: {
          key: process.env.RAJAONGKIR_KEY!,
        },
        cache: "no-store",
      },
    );

    const json = await res.json();

    return NextResponse.json(json);
  } catch (err) {
    console.error("Proxy error", err);
    return NextResponse.json({ data: [] });
  }
}
