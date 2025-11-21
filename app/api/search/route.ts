import { NextRequest, NextResponse } from "next/server";

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 3) {
    return NextResponse.json([], { status: 200 });
  }

  if (!GEOAPIFY_API_KEY) {
    return NextResponse.json({ error: "GEOAPIFY_API_KEY eksik" }, { status: 500 });
  }

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(q)}&lang=tr&apiKey=${GEOAPIFY_API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geoapify hatası");
    const data = await res.json();
    const results = (data.features || []).map((f: any) => ({
      id: f.properties.place_id ?? `${f.properties.lat}-${f.properties.lon}`,
      name: f.properties.name || f.properties.formatted,
      formatted_address: f.properties.formatted,
      lat: f.properties.lat,
      lon: f.properties.lon,
    }));
    return NextResponse.json(results);
  } catch (error) {
    console.error("Arama hatası", error);
    return NextResponse.json({ error: "Arama başarısız" }, { status: 500 });
  }
}
