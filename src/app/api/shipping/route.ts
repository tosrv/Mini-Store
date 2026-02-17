import { NextResponse } from "next/server";

type shippingService = {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, itemCount } = body;

    if (!destination || !itemCount) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const weight = Math.max(itemCount, 1) * 1000;

    const response = await fetch(
      "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
      {
        method: "POST",
        headers: {
          key: process.env.RAJAONGKIR_KEY!,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          origin: "40147",
          destination: destination.toString(),
          weight: weight.toString(),
          courier: "jne",
        }),
      },
    );

    const result = await response.json();
    const services: shippingService[] = result?.data ?? [];

    const regService = services.find((item) => item.service === "REG");

    const cheapestService = services.sort((a, b) => a.cost - b.cost)[0];

    const shippingCost = regService
      ? Number(regService.cost)
      : cheapestService
        ? Number(cheapestService.cost)
        : 50000;

    return NextResponse.json({ shippingCost });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch shipping cost" },
      { status: 500 },
    );
  }
}
