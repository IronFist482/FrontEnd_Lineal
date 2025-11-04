"use client";
import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cva } from "class-variance-authority";
import '../../styles/collapsible.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const collapsibleVariants = cva(
  "collapsible",
  {
    variants: {
      variant: {
        default: "collapsible-default",
        outline: "collapsible-outline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Collapsible({
  className,
  variant,
  ...props
}) {
  return <CollapsiblePrimitive.Root 
    data-slot="collapsible" 
    className={cn(collapsibleVariants({ variant }), className)} 
    {...props} />;
}

const collapsibleTriggerVariants = cva("collapsible-trigger");

function CollapsibleTrigger({
  className,
  ...props
}) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      className={cn(collapsibleTriggerVariants(), className)}
      {...props}
    />
  );
}

const collapsibleContentVariants = cva("collapsible-content");

function CollapsibleContent({
  className,
  ...props
}) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(collapsibleContentVariants(), className)}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
