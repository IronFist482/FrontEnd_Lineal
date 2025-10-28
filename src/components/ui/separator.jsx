"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator@1.1.2";
import '../../styles/separator.css';

import { cn } from "./utils";

function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "separator",
        orientation === "horizontal" && "separator-horizontal",
        orientation === "vertical" && "separator-vertical",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };