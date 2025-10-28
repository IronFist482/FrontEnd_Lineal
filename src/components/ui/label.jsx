"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label@2.1.2";

import '../../styles/label.css';

function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={`label ${className || ""}`.trim()}
      {...props}
    />
  );
}

export { Label };