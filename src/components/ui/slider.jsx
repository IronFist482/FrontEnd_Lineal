"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider@1.2.3";
import '../../styles/slider.css';

import { cn } from "./utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("slider", className)}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn("slider-track")}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn("slider-range")}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="slider-thumb"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };