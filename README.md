# brandonzeller.co

Personal site, laid out like a magazine issue. Next.js (static export) + Tailwind. Animations are plain CSS.

## Edit content
Everything lives in `content/site.ts`. To rename the main app, change `MAIN_PROJECT_NAME`.
The /resume page reads `content/resume.ts`; keep it in sync with `public/Brandon_Zeller_Resume.pdf`.

## Swap assets (in /public)
- `headshot.jpg`: WebP versions are generated automatically on `npm run dev` / `npm run build`
- `Brandon_Zeller_Resume.pdf`: **remove your phone number before replacing it**
- `projects/*.png`: then set `image: "/projects/name.png"` on the project in `site.ts`

## Commands
- `npm run dev`: local preview at http://localhost:3000
- `npm run build`: production build into `/out`
