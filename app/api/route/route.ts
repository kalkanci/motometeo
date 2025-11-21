import { NextRequest, NextResponse } from "next/server";

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

interface Coordinate {
  lat: number;
  lon: number;
}

function haversineDistance(a: Coordinate, b: Coordinate) {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function boundingBox(coords: [number, number][]) {
  let minLat = 90,
    maxLat = -90,
    minLon = 180,
    maxLon = -180;
  coords.forEach(([lon, lat]) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
  });
  return { minLat, maxLat, minLon, maxLon };
}

async function fetchWeatherSegments(polyline: [number, number][], totalKm: number) {
  if (!polyline.length) return [];
  const segments: any[] = [];
  const stepKm = Math.max(10, totalKm / 4);
  for (let i = 0; i < totalKm; i += stepKm) {
    const idx = Math.min(polyline.length - 1, Math.floor((i / totalKm) * polyline.length));
    const [lon, lat] = polyline[idx];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,wind_speed_10m,visibility&forecast_days=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const precip = data.hourly?.precipitation_probability?.[0] ?? 0;
      const wind = data.hourly?.wind_speed_10m?.[0] ?? 0;
      const visibility = data.hourly?.visibility?.[0] ?? 0;
      const summary = precip > 60 ? "heavy_rain" : precip > 30 ? "light_rain" : wind > 40 ? "strong_wind" : visibility < 10000 ? "fog" : "clear";
      segments.push({
        from_km: i,
        to_km: Math.min(i + stepKm, totalKm),
        summary,
        details: {
          avg_precip_prob: precip,
          avg_wind_speed: wind,
          avg_visibility: visibility,
        },
      });
    } catch (error) {
      console.error("Weather fetch error", error);
    }
  }
  return segments;
}

async function fetchBadSegments(polyline: [number, number][], totalKm: number) {
  if (!polyline.length) return [];
  const { minLat, maxLat, minLon, maxLon } = boundingBox(polyline);
  const query = `[out:json];way["highway"](${minLat},${minLon},${maxLat},${maxLon})["surface"~"unpaved|gravel|dirt|ground|sand|paving_stones"] ;out geom;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const points: Coordinate[] = [];
    (data.elements || []).forEach((el: any) => {
      if (el.geometry) {
        el.geometry.forEach((g: any) => points.push({ lat: g.lat, lon: g.lon }));
      }
    });
    if (!points.length) return [];

    const cumulative: number[] = [0];
    for (let i = 1; i < polyline.length; i++) {
      const prev = { lat: polyline[i - 1][1], lon: polyline[i - 1][0] };
      const curr = { lat: polyline[i][1], lon: polyline[i][0] };
      cumulative[i] = cumulative[i - 1] + haversineDistance(prev, curr);
    }

    const badSegments: { from_km: number; to_km: number; reason: string }[] = [];
    let current: { start: number; end: number } | null = null;

    polyline.forEach(([lon, lat], idx) => {
      const near = points.some((p) => haversineDistance({ lat, lon }, p) < 0.05);
      const km = cumulative[idx];
      if (near) {
        if (!current) current = { start: km, end: km };
        current.end = km;
      } else if (current) {
        badSegments.push({ from_km: current.start, to_km: current.end + 0.2, reason: "unpaved" });
        current = null;
      }
    });
    if (current) badSegments.push({ from_km: current.start, to_km: current.end + 0.2, reason: "unpaved" });
    return badSegments;
  } catch (error) {
    console.error("Overpass error", error);
    return [];
  }
}

export async function POST(req: NextRequest) {
  if (!GEOAPIFY_API_KEY) {
    return NextResponse.json({ error: "GEOAPIFY_API_KEY eksik" }, { status: 500 });
  }

  const body = await req.json();
  const { from, to } = body;
  if (!from || !to) return NextResponse.json({ error: "Eksik koordinat" }, { status: 400 });

  const routingUrl = `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lon}|${to.lat},${to.lon}&mode=drive&lang=tr&apiKey=${GEOAPIFY_API_KEY}`;

  try {
    const res = await fetch(routingUrl);
    if (!res.ok) throw new Error("Routing hatası");
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return NextResponse.json({ error: "Rota bulunamadı" }, { status: 404 });

 codex/review-current-repository-du94j2

codex/review-current-repository-n83hdn
main
    const rawCoords = feature.geometry.coordinates as [number, number][] | [number, number][][];
    // Geoapify bazen LineString yerine MultiLineString dönebiliyor; tek listeye düzleştiriyoruz
    const geometry: [number, number][] = Array.isArray(rawCoords[0]?.[0])
      ? (rawCoords as [number, number][][]).flat()
      : (rawCoords as [number, number][]);
 codex/review-current-repository-du94j2


    const geometry = feature.geometry.coordinates as [number, number][];
 main
 main
    const props = feature.properties;
    const distanceKm = (props.distance || 0) / 1000;
    const durationMinutes = (props.time || 0) / 60;

    const maneuvers = (props.legs?.[0]?.steps || []).map((s: any) => ({
      lat: s.start_location?.lat ?? s.from?.lat ?? feature.geometry.coordinates[0][1],
      lon: s.start_location?.lon ?? s.from?.lon ?? feature.geometry.coordinates[0][0],
      distance: s.distance,
      instruction: s.instruction?.text || s.instruction || "devam et",
    }));

    const weather_segments = await fetchWeatherSegments(geometry, distanceKm);
    const bad_segments = await fetchBadSegments(geometry, distanceKm);

    return NextResponse.json({
      polyline: geometry,
      maneuvers,
      distance_km: distanceKm,
      duration_minutes: durationMinutes,
      weather_segments,
      bad_segments,
    });
  } catch (error) {
    console.error("Route error", error);
    return NextResponse.json({ error: "Rota hesaplanamadı" }, { status: 500 });
  }
}
