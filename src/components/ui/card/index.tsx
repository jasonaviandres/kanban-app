import { twMerge } from "tailwind-merge";
import { type Size, type SizeStyleProps } from "../types";
import { type ComponentProps, type PropsWithChildren } from "react";

type CardVariant =
  | "simple"
  | "primary"
  | "secondary"
  | "danger"
  | "transparent";
const VARIANT_STYLES: Record<CardVariant, string> = {
  simple: "bg-white shadow-lg",
  primary: "bg-white border border-primary-200",
  secondary: "border border-secondary-600 bg-secondary-400",
  danger: "border border-red-300 bg-red-50",
  transparent: "border border-gray-500/30",
};

const PADDING_STYLES: SizeStyleProps = {
  small: "p-4 md:p-6",
  tiny: "p-4",
  medium: "p-4 md:p-8",
  large: "p-6 md:p-8",
};

const SHADOW_STYLES: SizeStyleProps = {
  tiny: "shadow-xs",
  small: "shadow-sm",
  medium: "shadow-md",
  large: "shadow-lg",
};

export interface CardBaseProps extends ComponentProps<"div"> {
  variant?: CardVariant;
  padding?: Size;
  shadow?: Size;
}

const CardTitle = ({ children }: PropsWithChildren) => {
  return <span className="text-black text-xl font-bold">{children}</span>;
};

const CardDescription = ({ children }: PropsWithChildren) => {
  return <span className="text-brand-dark text-base">{children}</span>;
};
interface CardLabelProps {
  title: string;
  description?: string;
}
const CardLabel = ({ title, description }: CardLabelProps) => {
  return (
    <div className="flex flex-col gap-2 md:col-span-2">
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </div>
  );
};

const Card = ({
  variant = "primary",
  padding = "small",
  shadow = "small",
  children,
  className,
  ...restProps
}: CardBaseProps) => {
  const cardBaseClass = twMerge(
    "w-full rounded-2xl",
    SHADOW_STYLES[shadow],
    PADDING_STYLES[padding],
    VARIANT_STYLES[variant],
    className,
  );
  return (
    <div className={cardBaseClass} {...restProps}>
      {children}
    </div>
  );
};

Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Label = CardLabel;

export { Card };
