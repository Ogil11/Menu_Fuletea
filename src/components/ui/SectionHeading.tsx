import { cn } from "@/lib/cn";
import { BrushUnderline } from "./Decorations";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      <p className="font-marker text-lg text-brand -rotate-2 inline-block">{eyebrow}</p>
      <h2
        id={id}
        className="relative mt-1 font-display text-[clamp(2.6rem,7vw,4.5rem)] uppercase leading-[0.92] tracking-tight"
      >
        <span className="relative inline-block">
          {title}
          <BrushUnderline className="absolute -bottom-2 left-0 h-3 w-full text-brand/80" />
        </span>
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      )}
    </div>
  );
}
