import { ImageResponse } from "next/og";

export const alt = "Kodalic — Engineering What Businesses Become Next";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#080c1e",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#080c1e",
              fontSize: "22px",
              fontWeight: 800,
            }}
          >
            K
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px", fontWeight: 600, letterSpacing: "-0.02em" }}>Kodalic</span>
            <span style={{ fontSize: "12px", opacity: 0.6, letterSpacing: "0.2em" }}>ESTD 2019</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          <div style={{ fontSize: "58px", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", display: "flex" }}>
            Engineering What
          </div>
          <div style={{ fontSize: "58px", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", display: "flex" }}>
            Businesses Become Next
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "24px", fontSize: "20px", opacity: 0.7, maxWidth: "720px" }}>
          Intelligent technology solutions — websites, AI, automation, and digital products.
        </div>
        <div style={{ display: "flex", marginTop: "32px", fontSize: "14px", opacity: 0.5 }}>www.kodalic.com</div>
      </div>
    ),
    { ...size }
  );
}
