import { Flame, Zap, Sparkles } from "lucide-react";
import { business } from "@/data/business";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ICONS = [Zap, Flame, Sparkles];

export function About() {
  const { about } = business;

  return (
    <section id="nosotros" aria-labelledby="about-title" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <SectionHeading id="about-title" eyebrow="Nosotros" title={about.title} />
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-paper/75">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <ul className="grid gap-4 self-end sm:grid-cols-3 lg:grid-cols-1">
          {about.pillars.map((pillar, i) => {
            const Icon = ICONS[i % ICONS.length]!;
            return (
              <li
                key={pillar.title}
                className="flex items-start gap-4 rounded-card border border-white/[0.07] bg-ink-2 p-5 sm:flex-col lg:flex-row lg:items-center"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-ink">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-2xl uppercase tracking-wide">{pillar.title}</p>
                  <p className="mt-0.5 text-muted">{pillar.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
