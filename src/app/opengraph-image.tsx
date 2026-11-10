import { ImageResponse } from "next/og";
import { business } from "@/data/business";

export const alt = `${business.name} · ${business.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen Open Graph generada (se puede reemplazar por una foto real). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 85% 15%, rgba(255,121,0,0.45), transparent 55%), #101010",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: 6 }}>
          <span>FULLE</span>
          <span style={{ color: "#FF7900" }}>TIAO</span>
          <span style={{ marginLeft: 18, color: "#A3A3A3", fontWeight: 600 }}>FAST FOOD</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase" }}>
            El sabor que
          </div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase" }}>
            <span style={{ color: "#FF7900" }}>manda</span>
            <span style={{ marginLeft: 28 }}>en la calle</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#A3A3A3" }}>
            {`${business.secondarySlogan} · Pide por WhatsApp`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
