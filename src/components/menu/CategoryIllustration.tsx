import type { CategoryId } from "@/types";

/**
 * Ilustraciones lineales por categoría para placeholders. Son genéricas a
 * propósito: representan la categoría, nunca un plato concreto.
 */
export function CategoryIllustration({
  categoryId,
  className,
}: {
  categoryId: CategoryId;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  switch (categoryId) {
    case "perros-calientes":
      return (
        <svg {...common}>
          <path d="M8 34c0-5 4-8 9-8h30c5 0 9 3 9 8s-4 8-9 8H17c-5 0-9-3-9-8Z" />
          <path d="M5 33c0-3 3-5 6-5h42c3 0 6 2 6 5" />
          <path d="M14 31c4 2 6-2 10 0s6-2 10 0 6-2 10 0 5-1 7 0" />
        </svg>
      );
    case "salchipapas":
      return (
        <svg {...common}>
          <path d="M16 26h32l-4 28H20l-4-28Z" />
          <path d="M22 26 19 10M28 26l-1-18M34 26l2-17M40 26l4-14M25 26l7-12" />
          <path d="M22 38c3-2 6 2 10 0s7 2 10 0" />
        </svg>
      );
    case "salvajadas":
      return (
        <svg {...common}>
          <ellipse cx="32" cy="42" rx="24" ry="9" />
          <path d="M14 39c2-6 6-10 10-8s5-6 9-5 6 4 9 2 7 3 8 9" />
          <path d="M22 30 18 20M30 27l-1-11M38 27l3-10M46 31l5-7" />
        </svg>
      );
    case "hamburguesas":
      return (
        <svg {...common}>
          <path d="M12 30c0-10 9-16 20-16s20 6 20 16H12Z" />
          <path d="M10 36h44" />
          <path d="M10 36c3 3 6-1 9 1s6-1 9 1 6-1 9 1 6-1 9 1 5-2 8-3" />
          <path d="M13 42h38c0 5-4 8-9 8H22c-5 0-9-3-9-8Z" />
          <path d="M24 21h.01M32 19h.01M40 21h.01" strokeWidth={3} />
        </svg>
      );
    case "bebidas":
      return (
        <svg {...common}>
          <path d="M27 6h10v7c0 3 6 6 6 13v28c0 2-2 4-4 4H25c-2 0-4-2-4-4V26c0-7 6-10 6-13V6Z" />
          <path d="M21 32h22v12H21z" />
          <path d="M27 10h10" />
        </svg>
      );
    case "adicionales":
      return (
        <svg {...common}>
          <path d="M18 28h28l-3 26H21l-3-26Z" />
          <path d="M24 28l-2-14M30 28V12M36 28l2-15M42 28l3-11" />
          <circle cx="50" cy="16" r="6" />
          <path d="M50 13v6M47 16h6" />
        </svg>
      );
  }
}
