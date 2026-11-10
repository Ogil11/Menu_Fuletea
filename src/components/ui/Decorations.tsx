/* Elementos gráficos urbanos: pinceladas, salpicaduras y cinta. */

export function BrushUnderline({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 18"
      preserveAspectRatio="none"
      className={className}
      fill="currentColor"
    >
      <path d="M2 11c34-6 78-9 124-8 52 1 106 3 172-1-14 4-36 7-60 9-50 4-110 5-170 5-28 0-52-1-66-2Z" />
    </svg>
  );
}

export function BrushStroke({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 120"
      preserveAspectRatio="none"
      className={className}
      fill="currentColor"
    >
      <path d="M12 64c40-30 120-46 220-48 110-2 230 6 352 18 8 1 8 10 0 11-60 4-102 4-130 10 40 4 92 6 120 12 6 2 4 10-2 10-150 4-300 10-450 22-40 4-84 0-108-10-14-6-16-14-2-25Z" />
    </svg>
  );
}

export function Splatter({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="currentColor">
      <circle cx="100" cy="100" r="42" />
      <circle cx="152" cy="62" r="9" />
      <circle cx="170" cy="118" r="5" />
      <circle cx="44" cy="58" r="7" />
      <circle cx="38" cy="140" r="11" />
      <circle cx="120" cy="168" r="6" />
      <circle cx="74" cy="30" r="4" />
      <path d="M126 70c16-14 30-20 40-18-12 6-22 16-30 26z" />
      <path d="M66 132c-12 12-24 22-38 24 10-8 20-20 28-32z" />
    </svg>
  );
}

/** Cinta tipo marquesina con los eslóganes de la marca. */
export function SloganTape({ words }: { words: readonly string[] }) {
  const row = [...words, ...words, ...words];
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-ink bg-brand py-3 text-ink -rotate-1"
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-xl uppercase tracking-wider sm:text-2xl motion-reduce:animate-none">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            {w}
            <span className="text-ink/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
