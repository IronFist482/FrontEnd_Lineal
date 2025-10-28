"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import '../../styles/badge.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Lógica simulada de cva. En el CSS puro se definirán estas clases.
const getBadgeClasses = (variant) => {
  const baseClasses = "badge-base";
  let variantClass = "";

  switch (variant) {
    case "secondary":
      variantClass = "badge-secondary";
      break;
    case "destructive":
      variantClass = "badge-destructive";
      break;
    case "outline":
      variantClass = "badge-outline";
      break;
    case "default":
    default:
      variantClass = "badge-default";
      break;
  }

  return `${baseClasses} ${variantClass}`;
};

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(getBadgeClasses(variant), className)}
      {...props}
    />
  );
}

export { Badge, getBadgeClasses as badgeVariants };