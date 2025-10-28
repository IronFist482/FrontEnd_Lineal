import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import '../../styles/button.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Lógica simulada de cva. En el CSS puro se definen todas estas clases.
const getButtonClasses = (variant, size) => {
  const baseClasses = "btn-base";
  let variantClass = "";
  let sizeClass = "";

  switch (variant) {
    case "destructive":
      variantClass = "btn-destructive";
      break;
    case "outline":
      variantClass = "btn-outline";
      break;
    case "secondary":
      variantClass = "btn-secondary";
      break;
    case "ghost":
      variantClass = "btn-ghost";
      break;
    case "link":
      variantClass = "btn-link";
      break;
    case "default":
    default:
      variantClass = "btn-default";
      break;
  }

  switch (size) {
    case "sm":
      sizeClass = "btn-sm";
      break;
    case "lg":
      sizeClass = "btn-lg";
      break;
    case "icon":
      sizeClass = "btn-icon";
      break;
    case "default":
    default:
      sizeClass = "btn-default-size";
      break;
  }

  return `${baseClasses} ${variantClass} ${sizeClass}`;
};

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(getButtonClasses(variant, size), className)}
      {...props}
    />
  );
}

export { Button, getButtonClasses as buttonVariants };