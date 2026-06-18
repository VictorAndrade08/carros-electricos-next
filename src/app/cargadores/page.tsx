import type { Metadata } from "next";
import MapaCargadores from "@/components/MapaCargadores";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Cargadores de autos eléctricos en Ecuador — Mapa",
  description:
    "Mapa de estaciones de carga para autos eléctricos en Ecuador: Quito, Guayaquil, Cuenca, Ambato y más. Encuentra dónde cargar tu vehículo eléctrico.",
  alternates: { canonical: "/cargadores/" },
  openGraph: {
    title: "Mapa de cargadores de autos eléctricos en Ecuador",
    description:
      "Encuentra dónde cargar tu auto eléctrico en Ecuador. Mapa con los puntos de carga del país.",
    type: "website",
  },
};

export default function CargadoresPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-12">
      <h1 className="text-4xl font-black uppercase tracking-tight text-ink md:text-5xl">
        Cargadores<span className="text-brand">.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600">
        Encuentra estaciones de carga para tu auto eléctrico en Ecuador. Toca un
        punto del mapa para ver el operador y el tipo de acceso.
      </p>
      <div className="mt-8">
        <MapaCargadores />
      </div>
    </div>
  );
}
