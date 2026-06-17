// Sonidos de interfaz sutiles, generados con Web Audio (sin archivos = 0 descargas).
// Estado de silencio guardado en localStorage. Todo es no-op en el servidor.

let ctx: AudioContext | null = null;
let muted = false;
let cargado = false;

function init() {
  if (typeof window === "undefined") return null;
  if (!cargado) {
    muted = localStorage.getItem("sfx-muted") === "1";
    cargado = true;
  }
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (AC) {
      try {
        ctx = new AC();
      } catch {
        ctx = null;
      }
    }
  }
  return ctx;
}

export function isMuted(): boolean {
  init();
  return muted;
}

export function setMuted(m: boolean) {
  muted = m;
  if (typeof window !== "undefined") {
    localStorage.setItem("sfx-muted", m ? "1" : "0");
  }
}

export function toggleMuted(): boolean {
  setMuted(!isMuted());
  return muted;
}

/** Un tono corto con envolvente suave (evita clicks/pops). */
function tono(freq: number, dur = 0.06, type: OscillatorType = "sine", vol = 0.04) {
  const c = init();
  if (!c || muted) return;
  if (c.state === "suspended") c.resume();
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

export const sfx = {
  // Click suave (botones y enlaces).
  click: () => tono(523, 0.05, "triangle", 0.035),
  // Tic muy ligero al pasar el cursor por la navegación.
  hover: () => tono(740, 0.025, "sine", 0.015),
  // Apertura del menú móvil (dos notas ascendentes).
  open: () => {
    tono(440, 0.07, "sine", 0.035);
    setTimeout(() => tono(660, 0.07, "sine", 0.03), 60);
  },
};
