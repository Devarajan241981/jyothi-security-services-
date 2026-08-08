import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B5ED7",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.16), transparent 45%), radial-gradient(circle at 80% 85%, rgba(224,168,37,0.28), transparent 40%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            backgroundColor: "#ffffff",
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 56 }}>🛡️</span>
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, color: "#ffffff" }}>
          JSS
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#EEF3FB", marginTop: 8 }}>
          Jyothi Security Services
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#E0A825", marginTop: 20, fontWeight: 600 }}>
          Protecting People. Securing Businesses.
        </div>
      </div>
    ),
    { ...size },
  );
}
