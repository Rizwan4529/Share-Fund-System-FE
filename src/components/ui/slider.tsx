import * as React from "react";

import { cn } from "@/lib/utils";

function Slider({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  value: number[];
  onValueChange: (value: number[]) => void;
}) {
  const v = value[0] ?? min;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-gold-dark [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export { Slider };
