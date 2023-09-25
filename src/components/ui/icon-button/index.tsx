import {
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
} from "react";
import { type Size, type SizeStyleProps } from "../types";
import { twMerge } from "tailwind-merge";

export interface Props
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "size" | "children" | "ref"
  > {
  size?: Size;
  icon: ReactNode;
  label: string;
}

const SIZE_STYLES: SizeStyleProps = {
  small: "p-1",
  medium: "p-2",
  large: "p-3",
};

export const IconButton = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
    const buttonClass = twMerge(
      "rounded hover:fill-gray-500",
      props.size ? SIZE_STYLES[props.size] : SIZE_STYLES.medium,
      props.className,
    );
    return (
      <button
        className={buttonClass}
        {...props}
        ref={ref}
        aria-label={props.label}
      >
        {props.icon}
      </button>
    );
  },
);

IconButton.displayName = "Icon button";
