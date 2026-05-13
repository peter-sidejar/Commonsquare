import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { CS } from "@/lib/cs";

type Variant = "primary" | "ink" | "ghost";
type Size = "sm" | "md" | "lg";

interface CSButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  asChildPaddingless?: boolean;
}

export const CSButton = forwardRef<HTMLButtonElement, CSButtonProps>(
  function CSButton(
    { children, variant = "primary", size = "md", style, ...rest },
    ref,
  ) {
    const sizeStyle =
      size === "lg"
        ? { padding: "14px 22px", fontSize: 15 }
        : size === "sm"
          ? { padding: "8px 14px", fontSize: 13 }
          : { padding: "11px 18px", fontSize: 14 };
    const variantStyle =
      variant === "ghost"
        ? {
            background: "transparent",
            color: CS.ink,
            border: `1px solid ${CS.rule2}`,
          }
        : variant === "ink"
          ? {
              background: CS.ink,
              color: CS.paper,
              border: `1px solid ${CS.ink}`,
            }
          : {
              background: CS.violet,
              color: CS.paper,
              border: `1px solid ${CS.violet}`,
            };
    return (
      <button
        ref={ref}
        className="font-sans transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          ...variantStyle,
          ...sizeStyle,
          borderRadius: 999,
          cursor: "pointer",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          ...style,
        }}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
