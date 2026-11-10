import Image from "next/image";
import { categoryById } from "@/data/catalog";
import { cn } from "@/lib/cn";
import type { CategoryId, ProductImage as ProductImageType } from "@/types";
import { CategoryIllustration } from "./CategoryIllustration";

interface ProductImageProps {
  image: ProductImageType | null;
  name: string;
  categoryId: CategoryId;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Muestra el nombre dentro del placeholder (tarjetas grandes / modal). */
  showName?: boolean;
}

/**
 * Foto real del producto o, si falta, un placeholder de marca con el nombre
 * y la categoría. Nunca muestra la foto de otro plato.
 */
export function ProductImage({
  image,
  name,
  categoryId,
  sizes,
  priority,
  className,
  showName = true,
}: ProductImageProps) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden bg-ink-3", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  const category = categoryById[categoryId];
  return (
    <div
      role="img"
      aria-label={`${name}: foto próximamente`}
      className={cn(
        "grain relative isolate flex flex-col items-center justify-center overflow-hidden bg-ink-3 text-center",
        className,
      )}
    >
      {/* Iluminación y pincelada */}
      <div className="absolute -right-1/4 -top-1/3 -z-10 size-[90%] rounded-full bg-brand/25 blur-3xl" />
      <div className="absolute -bottom-1/2 -left-1/4 -z-10 size-[80%] rounded-full bg-brand-deep/20 blur-3xl" />
      <svg
        aria-hidden="true"
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
        className="absolute left-[8%] top-[58%] -z-10 h-[18%] w-[84%] text-brand/15"
      >
        <path
          d="M4 22c40-14 90-16 140-10s100 8 152-6c-30 18-90 26-150 22S30 30 4 22Z"
          fill="currentColor"
        />
      </svg>

      <CategoryIllustration
        categoryId={categoryId}
        className="size-[34%] max-h-24 text-brand transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
      />
      {showName && (
        <div className="mt-2 px-4">
          <p className="font-display text-[clamp(1.05rem,3.6vw,1.45rem)] uppercase leading-none tracking-wide text-paper/90">
            {name}
          </p>
          <p className="mt-1.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted">
            {category.singular} · Foto próximamente
          </p>
        </div>
      )}
    </div>
  );
}
