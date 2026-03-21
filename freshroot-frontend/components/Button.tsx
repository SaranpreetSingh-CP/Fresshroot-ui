import { cn } from "@/utils/cn";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-600",
  secondary:
    "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400",
  outline:
    "border-2 border-green-700 text-green-700 hover:bg-green-50 focus-visible:ring-green-600",
  ghost:
    "text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
