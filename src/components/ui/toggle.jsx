"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle@1.1.2";
import { cva } from "class-variance-authority@0.7.1";
import '../../styles/toggle.css';

import { cn } from "./utils";

const toggleVariants = cva(
  "toggle",
  {
    variants: {
      variant: {
        default: "toggle--default",
        outline: "toggle--outline",
      },
      size: {
        default: "toggle--size-default",
        sm: "toggle--size-sm",
        lg: "toggle--size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };