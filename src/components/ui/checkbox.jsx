"use client";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import '../../styles/checkbox.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const checkboxVariants = cva(
  "checkbox-root",
  {
    variants: {
      size: {
        default: "checkbox-default",
        sm: "checkbox-sm",
        lg: "checkbox-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const checkboxIndicatorVariants = cva("checkbox-indicator");

const checkboxIconVariants = cva("checkbox-icon");

function Checkbox({
  className,
  size,
  ...props
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        checkboxVariants({ size }),
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={checkboxIndicatorVariants()}
      >
        <CheckIcon className={checkboxIconVariants()} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
