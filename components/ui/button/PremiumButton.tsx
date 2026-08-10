"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "success";

type Size =
  | "sm"
  | "md"
  | "lg";

type PremiumButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
  };

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover border-primary",

  secondary:
    "bg-gray-900 text-white hover:bg-black border-gray-900",

  outline:
    "bg-white text-primary border-primary/40 hover:bg-primary-soft",

  success:
    "bg-green-600 text-white border-green-600 hover:bg-green-700",

  danger:
    "bg-red-600 text-white border-red-600 hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",

  md: "h-11 px-5 text-sm",

  lg: "h-12 px-7 text-base",
};

const PremiumButton =
  forwardRef<
    HTMLButtonElement,
    PremiumButtonProps
  >(
    (
      {
        children,
        className = "",
        variant = "primary",
        size = "md",
        loading = false,
        disabled,
        ...props
      },
      ref,
    ) => {
      return (
        <button
          ref={ref}
          disabled={
            disabled || loading
          }
          className={`
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            border
            font-black
            transition-all
            duration-300
            active:scale-95
            hover:-translate-y-0.5
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${variants[variant]}
            ${sizes[size]}
            ${className}
          `}
          {...props}
        >
          {loading && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          )}

          {children}
        </button>
      );
    },
  );

PremiumButton.displayName =
  "PremiumButton";

export default PremiumButton;