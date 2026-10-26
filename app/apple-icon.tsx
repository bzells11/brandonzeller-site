import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon for iPhone ("Add to Home Screen").
export default async function AppleIcon() {
  const display = await readFile(join(process.cwd(), "assets/BodoniModa-Bold.ttf"));
  return (
    new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F6F2EA",
            color: "#1C1915",
            fontFamily: "Bodoni Moda",
            fontSize: 132,
            paddingBottom: 8,
          }}
        >
          Z
        </div>
      ),
      { ...size, fonts: [{ name: "Bodoni Moda", data: display, style: "normal", weight: 700 }] },
    )
  );
}
