"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import '../../styles/aspect-ratio.css';

function AspectRatio({
  ...props
}) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };