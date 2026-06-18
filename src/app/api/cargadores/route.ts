export const runtime = "edge";

// Estaciones de carga de Ecuador desde OpenStreetMap (Overpass API) — gratis, sin clave.
const QUERY = `[out:json][timeout:25];area["ISO3166-1"="EC"][admin_level=2]->.ec;node["amenity"="charging_station"](area.ec);out;`;

type OverpassEl = {
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
};

export async function GET() {
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(QUERY),
    });
    const data = (await res.json()) as { elements?: OverpassEl[] };
    const points = (data.elements || [])
      .filter((e) => typeof e.lat === "number" && typeof e.lon === "number")
      .map((e) => {
        const t = e.tags || {};
        return {
          lat: e.lat,
          lng: e.lon,
          title: t.name || t.operator || "Punto de carga",
          operator: t.operator || "",
          access: t.access || "",
          fee: t.fee || "",
        };
      });
    return Response.json(
      { points },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return Response.json({ points: [] });
  }
}
