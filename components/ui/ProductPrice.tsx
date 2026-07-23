import { formatarMoeda } from "@/lib/formatadores";

type ProductPriceProps = {
  value: number;

  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl";

  color?:
    | "default"
    | "primary"
    | "success"
    | "danger";

  align?:
    | "left"
    | "center"
    | "right";

  className?: string;
};

export default function ProductPrice({
  value,
  size = "lg",
  color = "primary",
  align = "left",
  className = "",
}: ProductPriceProps) {
  const sizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const colors = {
    default: "text-gray-800",
    primary: "text-pink-500",
    success: "text-green-600",
    danger: "text-red-500",
  };

  const aligns = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <p
      className={`
        font-bold
        ${sizes[size]}
        ${colors[color]}
        ${aligns[align]}
        ${className}
      `}
    >
      {formatarMoeda(value)}
    </p>
  );
}