import { delay } from "./ui";

// Illustrative figure for the feature story. Bars draw in when the figure scrolls into view
// (the parent InView sets data-shown; the .bar styles live in globals.css).
export function WaitChart({ rows }: { rows: { name: string; minutes: number }[] }) {
  const max = Math.max(...rows.map((r) => r.minutes));
  return (
    <ol className="space-y-3">
      {rows.map((r, i) => (
        <li key={r.name} className="grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-3 font-sans text-sm">
          <span className="font-medium">{r.name}</span>
          <span className="h-5 bg-paper">
            <span
              className={`bar block h-full ${i === 0 ? "bg-marker ring-1 ring-ink" : "bg-ink"}`}
              style={{ width: `${(r.minutes / max) * 100}%`, ...delay(200 + i * 110) }}
            />
          </span>
          <span className="text-right font-semibold tabular-nums">{r.minutes} min</span>
        </li>
      ))}
    </ol>
  );
}
