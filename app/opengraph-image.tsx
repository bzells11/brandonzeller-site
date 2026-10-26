import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";

export const dynamic = "force-static";
export const alt = `${site.name}: ${site.hero.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const paper = "#F6F2EA";
const ink = "#1C1915";
const muted = "#6B655D";
const marker = "#F2E33A";

export default async function Image() {
  const [display, sans, serif, photo] = await Promise.all([
    readFile(join(process.cwd(), "assets/BodoniModa-Bold.ttf")),
    readFile(join(process.cwd(), "assets/Archivo-SemiBold.ttf")),
    readFile(join(process.cwd(), "assets/Newsreader-Italic.ttf")),
    readFile(join(process.cwd(), "public/headshot.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: paper, color: ink, padding: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 56 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: `6px solid ${ink}`,
              paddingTop: 12,
              fontFamily: "Archivo",
              fontSize: 20,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            <span>No. {site.issue.number}</span>
            <span>{site.issue.season}</span>
          </div>
          <div style={{ fontFamily: "Bodoni Moda", fontSize: 196, lineHeight: 0.9, letterSpacing: "-0.04em", marginTop: 40 }}>
            ZELLER
          </div>
          <div
            style={{
              display: "flex",
              borderTop: `2px solid ${ink}`,
              borderBottom: `2px solid ${ink}`,
              padding: "10px 0",
              marginTop: 20,
              fontFamily: "Archivo",
              fontSize: 20,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            The founder issue
          </div>
          <div style={{ fontFamily: "Newsreader", fontSize: 44, lineHeight: 1.2, marginTop: "auto" }}>{site.hero.tagline}</div>
          <div style={{ fontFamily: "Archivo", fontSize: 22, color: muted, marginTop: 12 }}>brandonzeller.co</div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 430, border: `2px solid ${ink}` }}>
          <img src={photoSrc} alt="" width={430} height={518} style={{ objectFit: "cover", objectPosition: "50% 20%" }} />
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 120,
              height: 120,
              borderRadius: 999,
              background: marker,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Bodoni Moda",
              fontSize: 30,
              transform: "rotate(12deg)",
            }}
          >
            New app
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
