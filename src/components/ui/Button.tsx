import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,box-shadow,transform,border-color] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-ink hover:bg-brand-strong shadow-[0_10px_30px_-12px_rgb(255_121_0/0.8)] hover:shadow-[0_14px_36px_-12px_rgb(255_121_0/0.95)]",
  secondary:
    "border border-white/15 bg-white/[0.04] text-paper hover:border-white/30 hover:bg-white/[0.08]",
  ghost: "text-paper hover:bg-white/[0.07]",
  whatsapp: "bg-[#25D366] text-[#06210f] hover:bg-[#3be07a]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />
  );
});

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, className, type = "button", children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-white/10 disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
