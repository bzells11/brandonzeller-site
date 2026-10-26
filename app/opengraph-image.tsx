import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const dynamic = "force-static";
export const alt = `${site.name}: ${site.hero.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const paper = "#F6F2EA";
const paper2 = "#EEE8DD";
const ink = "#1C1915";
const muted = "#5E584F";
const marker = "#F2E33A";

// Link preview (iMessage, LinkedIn, Slack…): a mini version of the site's magazine cover.
export default async function Image() {
  const [display, sans, serif, photo] = await Promise.all([
    readFile(join(process.cwd(), "assets/BodoniModa-Bold.ttf")),
    readFile(join(process.cwd(), "assets/Archivo-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/Newsreader-Italic.ttf")),
    readFile(join(process.cwd(), "public/headshot.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const caps = { fontFamily: "Archivo", textTransform: "uppercase" as const, letterSpacing: "0.12em" };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: paper2, color: ink, padding: "0 80px" }}>
        {/* Left: the pitch */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingRight: 40 }}>
          <div style={{ ...caps, fontSize: 20, color: muted }}>Personal magazine portfolio</div>
          <div style={{ fontFamily: "Bodoni Moda", fontSize: 92, lineHeight: 0.95, marginTop: 18, letterSpacing: "-0.03em" }}>
            Brandon Zeller
          </div>
          <div style={{ fontFamily: "Newsreader", fontSize: 40, marginTop: 22 }}>{site.hero.tagline}</div>
          <div style={{ display: "flex", ...caps, fontSize: 20, marginTop: 40, borderTop: `3px solid ${ink}`, paddingTop: 14 }}>
            brandonzeller.co
          </div>
        </div>

        {/* Right: the cover */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 400,
              background: paper,
              border: `2px solid ${ink}`,
              transform: "rotate(2.5deg)",
              boxShadow: "0 30px 50px -20px rgba(28,25,21,0.45)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", padding: "14px 16px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", ...caps, fontSize: 11 }}>
                <span>No. {site.issue.number}</span>
                <span>{site.issue.season}</span>
                <span>{site.hero.location}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", fontFamily: "Bodoni Moda", fontSize: 100, lineHeight: 0.85, marginTop: 6, letterSpacing: "-0.04em" }}>
                ZELLER
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  ...caps,
                  letterSpacing: "0.25em",
                  fontSize: 11,
                  borderTop: `1px solid ${ink}`,
                  borderBottom: `1px solid ${ink}`,
                  padding: "4px 0",
                  marginTop: 8,
                }}
              >
                The founder issue
              </div>
            </div>
            <div style={{ display: "flex", position: "relative", marginTop: 12, height: 330, overflow: "hidden" }}>
              <img src={photoSrc} alt="" width={400} height={468} style={{ objectFit: "cover", marginTop: -20 }} />
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 96,
                  height: 96,
                  borderRadius: 999,
                  background: marker,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(12deg)",
                }}
              >
                <span style={{ fontFamily: "Bodoni Moda", fontSize: 26 }}>New</span>
                <span style={{ ...caps, fontSize: 11 }}>App</span>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  bottom: 18,
                  display: "flex",
                  flexDirection: "column",
                  background: paper,
                  padding: "8px 10px",
                }}
              >
                <span style={{ fontFamily: "Bodoni Moda", fontSize: 26 }}>{site.projects[0].name}</span>
                <span style={{ fontFamily: "Archivo", fontSize: 12 }}>The app that finds the shortest wait.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bodoni Moda", data: display, style: "normal", weight: 700 },
        { name: "Archivo", data: sans, style: "normal", weight: 600 },
        { name: "Newsreader", data: serif, style: "italic", weight: 400 },
      ],
    },
  );
}
