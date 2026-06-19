#!/usr/bin/env python3
"""
Publica las 7 noticias de tendencia de CARROS ELÉCTRICOS (marca propia).
- Convierte las imágenes web (1536x1024) a WebP y las sube a R2 (carroselecticos/blog/).
- Genera un .sql con los INSERT (texto ampliado, categorías, fechas escalonadas).

Las de "Revista Motors" NO se publican aquí (no son de esta marca).

Programación: post 1 sale YA (fecha = ahora); luego 1 por día a las 14:00 UTC
(09:00 Ecuador). El sitio muestra cada post solo cuando su fecha llega.
"""
import io, os
from pathlib import Path
import boto3
from botocore.config import Config
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent  # carpeta del proyecto
UNZIP = Path("/tmp/archivo_unzip/02 - Imagenes Web (limpias)/Carros Electricos")
PREFIX = "carroselecticos/blog/"
PUBLIC = "https://pub-25cde2184a5249da96fa022aae951321.r2.dev/"

def load_env():
    env = {}
    for line in (ROOT / ".env.local").read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env

E = load_env()
s3 = boto3.client(
    "s3",
    endpoint_url=E["R2_ENDPOINT"],
    aws_access_key_id=E["R2_ACCESS_KEY_ID"],
    aws_secret_access_key=E["R2_SECRET_ACCESS_KEY"],
    config=Config(signature_version="s3v4", region_name="auto", max_pool_connections=16),
)
BUCKET = E["R2_BUCKET_NAME"]

# fecha futura -> "PROGRAMADO:<iso>"; el primero usa datetime('now') literal.
POSTS = [
    {
        "slug": "lynk-co-10-plus-925-cv-sedan-electrico",
        "img": "01 - Lynk and Co 10+ (925 CV).png",
        "fecha": "AHORA",
        "cats": ["Noticias", "Destacado"],
        "tags": ["lynk-co", "sedan-electrico", "geely", "lanzamiento"],
        "titulo": "Lynk & Co 10+: el sedán eléctrico de 925 CV que desafía a los alemanes",
        "extracto": "La marca premium de Geely entrega 925 CV con arquitectura de 900 V y un precio de salida agresivo. El deportivo accesible ahora es eléctrico y habla con acento chino.",
        "html": """<p>La marca premium del grupo Geely vuelve a sacudir el mercado con el <strong>Lynk &amp; Co 10+</strong>, un sedán 100% eléctrico que entrega hasta <strong>925 CV</strong> gracias a su moderna arquitectura de <strong>900 voltios</strong>. Con prestaciones que se miden de tú a tú con un BMW M5 y un precio de salida que en China parte alrededor de los <strong>26.300 euros</strong>, el 10+ redefine lo que entendíamos por «deportivo accesible».</p>
<h2>Potencia de superdeportivo, etiqueta de sedán familiar</h2>
<p>Hasta hace pocos años, cifras como 925 CV estaban reservadas a hypercars de seis dígitos. El Lynk &amp; Co 10+ las pone en una carrocería de cuatro puertas, con espacio real para cinco pasajeros y maletero de uso diario. La plataforma de 900 V no solo libera esa potencia: también permite cargas mucho más rápidas y una entrega de par instantánea que aplasta contra el asiento.</p>
<h2>El respaldo de un gigante</h2>
<p>Detrás del 10+ está Geely, el conglomerado dueño de <em>Volvo, Polestar y Lotus</em>. Esa ingeniería compartida explica el salto de calidad: diseño elegante de inspiración europea, un interior tecnológico dominado por pantallas y una puesta a punto pensada tanto para la ciudad como para la carretera abierta.</p>
<p>El mensaje para los fabricantes alemanes es claro: el futuro del sedán deportivo es eléctrico, y por primera vez llega con una relación valor-precio difícil de igualar. El Lynk &amp; Co 10+ no es solo otro eléctrico más: es una declaración de intenciones sobre quién marcará el ritmo de la próxima década.</p>""",
    },
    {
        "slug": "carga-ultrarrapida-10-minutos-900-voltios",
        "img": "07 - Carga ultrarrapida 10 min.png",
        "fecha": "PROGRAMADO:2026-06-20T14:00:00Z",
        "cats": ["Tecnología"],
        "tags": ["carga-rapida", "900-voltios", "infraestructura", "geely"],
        "titulo": "Carga ultrarrápida: la era de recargar en 10 minutos ya llegó",
        "extracto": "Las plataformas de 900 V recargan del 10% al 80% en unos diez minutos y la carga de hasta 1 MW se acerca a la calle. Repostar electricidad empieza a tardar lo mismo que llenar gasolina.",
        "html": """<p>Uno de los mayores obstáculos del auto eléctrico está desapareciendo. Las nuevas plataformas de <strong>900 voltios</strong> permiten recargar del <strong>10% al 80% en torno a diez minutos</strong>, y los sistemas de carga ultrarrápida de hasta <strong>1 MW</strong> están cada vez más cerca de la calle.</p>
<h2>El mito del «tiempo de carga» se cae</h2>
<p>Durante años, la principal excusa para no dar el salto al eléctrico fue la misma: «tarda demasiado en cargar». Esa frase ya tiene fecha de caducidad. Con una arquitectura de alto voltaje y un cargador rápido, detenerse a recargar empieza a tardar casi lo mismo que llenar un tanque de gasolina: el tiempo de un café.</p>
<h2>Por qué importa el voltaje</h2>
<p>Subir de 400 a 900 voltios permite mover más energía con menos calor y menos pérdidas. El resultado es una recarga más veloz, baterías que sufren menos y una experiencia de uso que por fin se parece a la del auto de combustión, sin sus emisiones.</p>
<p>Ecosistemas como el de <strong>Geely</strong>, del que nace Lynk &amp; Co, están a la vanguardia de esta tecnología. A medida que la red de carga ultrarrápida se expande por las ciudades y las carreteras, la última gran barrera psicológica para comprar un eléctrico se desvanece. La transición, literalmente, acelera.</p>""",
    },
    {
        "slug": "byd-tesla-lynk-co-mapa-electrico-2026",
        "img": "06 - BYD vs Tesla vs Lynk and Co.png",
        "fecha": "PROGRAMADO:2026-06-21T14:00:00Z",
        "cats": ["Noticias"],
        "tags": ["byd", "tesla", "lynk-co", "mercado-electrico"],
        "titulo": "BYD, Tesla y Lynk & Co: el nuevo mapa del auto eléctrico en 2026",
        "extracto": "BYD lidera en volumen, Tesla mantiene su ventaja de marca y Lynk & Co gana terreno como la opción premium racional. En 2026 ya no se gana solo con innovación, sino con valor.",
        "html": """<p>El mercado eléctrico vive su año más competitivo. <strong>BYD</strong> lidera en volumen global, <strong>Tesla</strong> mantiene su ventaja tecnológica y de marca, y un tercer actor gana terreno entre quienes buscan lujo sin pagar de más: <strong>Lynk &amp; Co</strong>.</p>
<h2>Tres estrategias, un mismo objetivo</h2>
<p>BYD ataca por escala y precio: produce sus propias baterías y vende en todos los segmentos. Tesla apuesta por el software, la conducción asistida y una marca con un imán cultural difícil de replicar. Lynk &amp; Co, respaldada por Geely, elige un camino distinto: diseño europeo, autonomía real y precios inteligentes para el comprador que hace cuentas.</p>
<h2>La opción «racional»</h2>
<p>Para muchos conductores, la decisión de 2026 no es entre el más barato y el más tecnológico, sino entre el que ofrece más por su dinero. Ahí es donde Lynk &amp; Co se posiciona como la alternativa sensata: prestaciones premium, equipamiento completo y una etiqueta de precio que no obliga a renunciar a nada.</p>
<p>La conclusión del nuevo mapa es clara: el año del auto eléctrico ya no se gana solo con innovación, sino con <strong>valor</strong>. Y en esa batalla, el tablero está más abierto que nunca.</p>""",
    },
    {
        "slug": "baterias-estado-solido-fin-ansiedad-autonomia",
        "img": "05 - Baterias de estado solido.png",
        "fecha": "PROGRAMADO:2026-06-22T14:00:00Z",
        "cats": ["Tecnología"],
        "tags": ["baterias", "estado-solido", "autonomia", "geely"],
        "titulo": "Baterías de estado sólido: la revolución que acabará con la «ansiedad de autonomía»",
        "extracto": "Más densas, seguras y rápidas de cargar, las baterías de estado sólido ya se prueban en autos reales, con recargas del 0 al 100% en cinco minutos. El fin de la ansiedad de autonomía.",
        "html": """<p>La tecnología que promete transformar el auto eléctrico ya salió del laboratorio. Las <strong>baterías de estado sólido</strong> —más densas, seguras y rápidas de cargar— comienzan a probarse en vehículos reales, con promesas de recargas del <strong>0 al 100% en apenas cinco minutos</strong> y mayor autonomía.</p>
<h2>Qué cambia frente a las baterías actuales</h2>
<p>Las baterías de litio convencionales usan un electrolito líquido. Las de estado sólido lo reemplazan por un material sólido: eso reduce el riesgo de incendio, soporta mejor el frío y el calor, y permite almacenar más energía en el mismo espacio. Traducido al día a día: más kilómetros por carga y mucha menos espera.</p>
<h2>El fin de la «ansiedad de autonomía»</h2>
<p>Para el consumidor, el impacto es enorme. Desaparece el miedo a quedarse sin batería en mitad de un viaje —la famosa <em>ansiedad de autonomía</em>— y se elimina la última excusa para no comprar un eléctrico.</p>
<p>Los grupos tecnológicamente más fuertes, como <strong>Geely</strong>, ya trabajan para integrar estos avances en sus próximas generaciones de vehículos. Cuando la producción a gran escala llegue, marcará un antes y un después en la adopción masiva del auto eléctrico.</p>""",
    },
    {
        "slug": "lynk-co-02-suv-electrico-ciudad",
        "img": "04 - Lynk and Co 02.png",
        "fecha": "PROGRAMADO:2026-06-23T14:00:00Z",
        "cats": ["Reseñas"],
        "tags": ["lynk-co", "lynk-co-02", "suv-electrico", "ciudad"],
        "titulo": "Lynk & Co 02: el SUV eléctrico pensado para la ciudad",
        "extracto": "Compacto por fuera y espacioso por dentro, el Lynk & Co 02 es la propuesta 100% eléctrica para el día a día urbano: ágil, conectado y con mantenimiento mínimo.",
        "html": """<p>Compacto por fuera y sorprendentemente espacioso por dentro, el <strong>Lynk &amp; Co 02</strong> es la propuesta 100% eléctrica de la marca para el día a día urbano. Ágil, conectado y con la tecnología que se espera de un producto premium, este SUV apunta a quienes buscan moverse de forma limpia y sin complicaciones.</p>
<h2>Hecho para la rutina</h2>
<p>El 02 entiende cómo se vive la ciudad: tamaño manejable para aparcar sin estrés, buena altura para ver el tráfico y un interior que aprovecha cada centímetro. Sin gasolina, sin ruido y con un mantenimiento mínimo, convierte los trayectos diarios —al trabajo, al colegio, al supermercado— en algo silencioso y económico.</p>
<h2>Premium sin complicaciones</h2>
<p>Donde el 02 marca diferencia es en la experiencia: conectividad permanente, asistentes de conducción y una puesta a punto suave que hace fácil olvidarse de que vas en un eléctrico. La aceleración instantánea ayuda en los adelantamientos y en las salidas de semáforo, mientras la recarga en casa o en el trabajo elimina las visitas a la gasolinera.</p>
<p>Es una muestra clara de que la electrificación ya está lista para la rutina de la ciudad: no es el coche del futuro, es el que tiene sentido hoy.</p>""",
    },
    {
        "slug": "lynk-co-gt-time-to-shine-concepto",
        "img": "02 - Lynk and Co GT Time to Shine.png",
        "fecha": "PROGRAMADO:2026-06-24T14:00:00Z",
        "cats": ["Noticias"],
        "tags": ["lynk-co", "concepto", "gran-turismo", "beijing-2026"],
        "titulo": "Lynk & Co GT «Time to Shine»: el concepto que adelanta el futuro de la marca",
        "extracto": "En el Salón de Beijing 2026, Lynk & Co presentó su primer gran turismo conceptual: electrificación total, diseño europeo y una apuesta clara por el segmento premium.",
        "html": """<p>En el <strong>Salón de Beijing 2026</strong>, Lynk &amp; Co presentó su primer gran turismo conceptual, el <strong>«Time to Shine»</strong>. Más que un ejercicio de estilo, este GT eléctrico de líneas fluidas y proporciones deportivas marca la dirección que tomará la marca en los próximos años.</p>
<h2>Un anticipo, no un capricho</h2>
<p>Los concept cars suelen quedarse en el escaparate, pero el Time to Shine funciona como hoja de ruta. Sus formas estiradas, su trompa baja y su cabina retrasada hablan de una marca que quiere jugar en la liga de los gran turismo europeos, pero con motorización 100% eléctrica y un lenguaje de diseño propio.</p>
<h2>Hacia el premium global</h2>
<p>La apuesta es transparente: <em>electrificación total, diseño de inspiración europea y segmento premium</em>. Lynk &amp; Co es una de las marcas chinas que más rápido crece a nivel mundial, y conceptos como este le sirven para fijar expectativas y mostrar que sus próximos modelos de serie no se conformarán con competir solo en precio.</p>
<p>El «Time to Shine» es, en definitiva, un adelanto de hacia dónde se dirige una marca con prisa por brillar en el escenario global.</p>""",
    },
    {
        "slug": "lynk-co-expansion-latinoamerica",
        "img": "03 - Lynk and Co llega a Latam.png",
        "fecha": "PROGRAMADO:2026-06-25T14:00:00Z",
        "cats": ["Noticias"],
        "tags": ["lynk-co", "latinoamerica", "ecuador", "expansion"],
        "titulo": "Lynk & Co acelera su expansión en Latinoamérica",
        "extracto": "La movilidad eléctrica premium ya no es exclusiva de Europa o Asia. Lynk & Co refuerza su presencia en Latinoamérica con SUVs y sedanes a precios competitivos.",
        "html": """<p>La movilidad eléctrica premium ya no es exclusiva de Europa o Asia. <strong>Lynk &amp; Co</strong> continúa su ofensiva internacional y refuerza su presencia en <strong>Latinoamérica</strong> con una gama de SUVs y sedanes que combinan diseño, tecnología y electrificación a precios competitivos.</p>
<h2>La región también se electrifica</h2>
<p>Durante mucho tiempo, las novedades del auto eléctrico llegaban tarde a nuestros mercados. Eso está cambiando. Cada nuevo país conquistado por marcas como Lynk &amp; Co confirma una tendencia imparable: la transición hacia el auto eléctrico también avanza con fuerza en Latinoamérica, impulsada por una clase media que busca tecnología y ahorro a largo plazo.</p>
<h2>Qué significa para Ecuador</h2>
<p>Para conductores de países como <strong>Ecuador</strong>, la llegada de más opciones premium se traduce en precios más competitivos, mejor postventa y una red de carga que crece junto a la demanda. La combinación de diseño europeo y costos de uso bajos hace que el cambio al eléctrico sea cada vez más fácil de justificar.</p>
<p>La conclusión es clara: la electrificación dejó de ser una promesa lejana para convertirse en una realidad que ya rueda por las calles de la región.</p>""",
    },
]


def to_webp(path: Path) -> bytes:
    im = Image.open(path).convert("RGB")
    buf = io.BytesIO()
    im.save(buf, format="WEBP", quality=82, method=6)
    return buf.getvalue()


def sql_str(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def main():
    import json
    lines = ["-- Publicación programada: 7 noticias Carros Eléctricos (marca propia)"]
    for p in POSTS:
        src = UNZIP / p["img"]
        data = to_webp(src)
        key = f"{PREFIX}web-{p['slug']}.webp"
        s3.put_object(
            Bucket=BUCKET, Key=key, Body=data, ContentType="image/webp",
            CacheControl="public, max-age=31536000, immutable",
        )
        portada = PUBLIC + key
        print(f"  subida {key}  ({len(data)//1024} KB)")

        fecha_sql = "datetime('now')" if p["fecha"] == "AHORA" else sql_str(p["fecha"].split("PROGRAMADO:")[1])
        vals = ", ".join([
            sql_str(p["slug"]),
            sql_str(p["titulo"]),
            fecha_sql,
            sql_str(portada),
            sql_str(p["extracto"]),
            sql_str(p["html"]),
            sql_str(json.dumps(p["cats"], ensure_ascii=False)),
            sql_str(json.dumps(p["tags"], ensure_ascii=False)),
        ])
        lines.append(
            "INSERT OR REPLACE INTO articulos "
            "(slug, titulo, fecha, portada, extracto, html, categorias, tags) "
            f"VALUES ({vals});"
        )

    out = ROOT / "scripts" / "publicar_tendencias.sql"
    out.write_text("\n".join(lines) + "\n")
    print(f"\nSQL generado: {out}")


if __name__ == "__main__":
    main()
