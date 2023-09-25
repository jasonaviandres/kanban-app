import { type IconType } from "react-icons";
import { type IconBaseProps } from "react-icons/lib";
import { type Size } from "../types";
export interface Props extends IconBaseProps {
  size?: Size | number;
  icon: IconType;
}

const ICON_SIZE: Record<Size, number> = {
  tiny: 14,
  small: 16,
  medium: 18,
  large: 20,
};

export const Icon = ({ className, size = "small", icon, ...rest }: Props) => {
  const IconComponent = icon;

  // make conditions whether the size provided is string or not
  const iconSize: number = typeof size === "string" ? ICON_SIZE[size] : size;
  return <IconComponent className={className} size={iconSize} {...rest} />;
};
