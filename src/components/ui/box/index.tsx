import {
  type AllHTMLAttributes,
  type ElementType,
  createElement,
  forwardRef,
} from "react";
import { type Size } from "../types";

type HTMLProps = Omit<AllHTMLAttributes<HTMLElement>, "as">;

// Overrides the size to our design system, and the Element type based on the provided "as"
export interface Props extends Omit<HTMLProps, "size"> {
  as?: ElementType;
  size?: Size;
}

export const Box = forwardRef<HTMLElement, Props>(
  ({ as = "div", ...props }: Props, ref) => {
    return createElement(as, {
      ...props,
      ref,
    });
  },
);

Box.displayName = "Box";
