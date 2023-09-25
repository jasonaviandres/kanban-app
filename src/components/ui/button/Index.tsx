/* eslint-disable prefer-const */
import React, { type ForwardedRef, type ReactNode, forwardRef } from "react";
import { Box, type Props as BoxProps } from "../box";
import { type SizeStyleProps } from "../types";
import { twMerge } from "tailwind-merge";
import { Icon } from "../icon";
import { CgSpinner as SpinnerIcon } from "react-icons/cg";

export type Variant =
  | "primary"
  | "secondary"
  | "outlined-primary"
  | "transparent"
  | "black"
  | "borderless";

export interface Props extends BoxProps {
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
  loading?: boolean;
  variant?: Variant;
}

const SIZE_STYLES: SizeStyleProps = {
  small: "px-4 py-1.5 text-sm",
  medium: "px-6 py-2.5 text-base",
  large: "px-6 py-3 text-lg",
  tiny: "px-4 py-1 text-xs",
};

const VARIANTS_STYLES: Record<Variant, string> = {
  primary:
    "bg-primary-500 transition ease-in-out hover:bg-primary-900 disabled:hover:bg-primary-500/60 text-neutral-white active:bg-primary-700",
  secondary:
    "bg-secondary-500 transition ease-in-out text-primary-500 disabled:hover:bg-opacity-60 hover:bg-primary-100 active:bg-primary-700",
  "outlined-primary":
    "border border-primary-300 transition ease-in-out hover:bg-primary-50 active:bg-primary-500 active:text-white text-primary-500 disabled:text-opacity-60 disabled:hover:text-opacity-60 disabled:hover:bg-inherit font-medium disabled:border-opacity-60",
  transparent:
    "bg-transparent border border-gray-200 hover:border-gray-300 text-black transition ease-in-out hover:text-ui-main-400 disabled:text-ui-main-400 disabled:hover:text-brand-gray disabled:hover:bg-opacity-75 font-medium",
  black: "border-2 border-black text-black text-medium",
  borderless:
    "bg-transparent text-primary-900 transition ease-in-out hover:text-primary-500 disabled:text-opacity-60 disabled:hover:text-opacity-60 disabled:hover:bg-opacity-60 font-medium p-0",
};

export const Button = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLButtonElement>) => {
    let {
      children,
      size = "medium",
      variant = "primary",
      loading,
      iconLeft,
      iconRight,
      className,
      disabled,
      as = "button",
      ...restProps
    } = props;

    // if loading, disable the button
    if (loading) {
      disabled = true;
    }

    const buttonClass = twMerge(
      "rounded-lg flex justify-center box-border cursor-pointer font-semibold items-center gap-2 disabled:bg-opacity-60  disabled:cursor-not-allowed",
      SIZE_STYLES[size],
      VARIANTS_STYLES[variant],
      className,
    );

    return (
      <Box
        as={as}
        className={buttonClass}
        {...restProps}
        disabled={disabled}
        ref={ref}
      >
        {loading ? (
          <Icon
            icon={SpinnerIcon}
            size={size}
            className="animate-spin motion-reduce:invisible"
          />
        ) : (
          iconLeft
        )}
        <span>{children}</span>
        {!loading && iconRight}
      </Box>
    );
  },
);

Button.displayName = "Button";
