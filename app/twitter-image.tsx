import { ImageResponse } from "next/og";

export const alt = "Saipavan Veeravalli | Full-Stack Developer & SEO Specialist";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 80px",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "rgba(56, 189, 248, 0.15)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "150px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.15)",
            filter: "blur(80px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              SV
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#38bdf8",
                letterSpacing: "-0.5px",
              }}
            >
              @im-shadowpool
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "9999px",
              background: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              color: "#4ade80",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            devshadow.space
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            maxWidth: "960px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              color: "#f8fafc",
              margin: 0,
            }}
          >
            Saipavan Veeravalli
          </h1>
          <p
            style={{
              fontSize: "30px",
              fontWeight: 600,
              lineHeight: 1.3,
              color: "#38bdf8",
              margin: 0,
            }}
          >
            Full-Stack Developer &amp; SEO Specialist
          </p>
          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.4,
              color: "#94a3b8",
              margin: "6px 0 0 0",
            }}
          >
            Next.js • React • Node.js • TypeScript • Technical SEO
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            width: "100%",
          }}
        >
          {[
            "Next.js",
            "React",
            "TypeScript",
            "Node.js",
            "Technical SEO",
            "Cloud Architecture",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                background: "rgba(30, 41, 59, 0.8)",
                border: "1px solid rgba(51, 65, 85, 0.8)",
                fontSize: "17px",
                fontWeight: 500,
                color: "#e2e8f0",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
