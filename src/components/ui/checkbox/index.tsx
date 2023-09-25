import { twMerge } from "tailwind-merge";
import { type Size, type SizeStyleProps } from "../types";
import { HiCheck as CheckIcon } from "react-icons/hi2";
import { Icon } from "../icon";

interface Props {
  size: Extract<Size, "small" | "medium">;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

const SIZE_STYLES: SizeStyleProps = {
  small: "w-4 h-4",
  medium: "h-5 w-5",
};

const TEXT_SIZE_STYLES: SizeStyleProps = {
  small: "text-sm",
  medium: "text-base",
};

const ICON_SIZE_STYLES: SizeStyleProps = {
  small: "12",
  medium: "14",
};

export const Checkbox = ({
  size = "small",
  checked,
  onCheck,
  disabled,
  label,
}: Props) => {
  const checkboxClass = twMerge(
    "appearance-none peer border rounded-full cursor-pointer relative border-primary-500 bg-white hover:bg-primary-50 shrink-0 checked:bg-primary-500 checked:border-0 disabled:bg-gray-300 disabled:border-gray-500 checked:hover:bg-primary-600",
    SIZE_STYLES[size],
  );
  return (
    <label className="flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        className={checkboxClass}
        onChange={(e) => onCheck(e.target.checked)}
        disabled={disabled}
      />
      <Icon
        icon={CheckIcon}
        size={parseInt(ICON_SIZE_STYLES[size]!)}
        color="white"
        className="absolute hidden peer-checked:block"
      />
      <span className={TEXT_SIZE_STYLES[size]}>{label}</span>
    </label>
  );
};
