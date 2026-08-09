"use client";

import { forwardRef } from "react";

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
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
  };

const variants = {
  primary:
    "bg-pink-500 text-white hover:bg-pink-600 border-pink-500",

  secondary:
    "bg-gray-900 text-white hover:bg-black border-gray-900",

  outline:
    "bg-white text-pink-500 border-pink-300 hover:bg-pink-50",

  success:
    "bg-green-600 text-white border-green-600 hover:bg-green-700",

  danger:
    "bg-red-600 text-white border-red-600 hover:bg-red-700",
};

const sizes = {
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
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-current
                border-t-transparent
              "
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