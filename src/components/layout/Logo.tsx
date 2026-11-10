import Image from "next/image";
import { business } from "@/data/business";
import { cn } from "@/lib/cn";

/**
 * Muestra el logo ORIGINAL si está configurado en `business.logo`
 * (sin recortes ni deformación: object-contain y proporción real).
 * Mientras no exista el archivo, usa un wordmark tipográfico provisional.
 */
export function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  const { logo } = business;

  if (logo) {
    return (
      <Image
        src={logo.src}
        alt={business.name}
        width={logo.width}
        height={logo.height}
        priority={priority}
        className={cn("h-11 w-auto object-contain", className)}
      />
    );
  }

  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="font-display text-[1.6rem] uppercase tracking-wide text-paper">
        Fulle<span className="text-brand">tiao</span>
      </span>
      <span className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.42em] text-muted">
        Fast food
      </span>
    </span>
  );
}
