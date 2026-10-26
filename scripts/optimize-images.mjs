// Runs before every build: makes small, fast WebP copies of /public/headshot.jpg.
// Just replace headshot.jpg and rebuild; these are regenerated automatically.
import sharp from "sharp";

const src = "public/headshot.jpg";
for (const width of [480, 640, 960]) {
  await sharp(src).resize({ width }).webp({ quality: 80 }).toFile(`public/headshot-${width}.webp`);
}
console.log("Optimized headshot");
