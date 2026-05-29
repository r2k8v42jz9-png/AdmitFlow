"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
      <SliderPrimitive.Range className="absolute h-full bg-[linear-gradient(90deg,hsl(var(--brand-blue)),hsl(var(--brand-violet)))]" />
    </SliderPrimitive.Track>
    {props.value?.map?.((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block size-4 rounded-full border-2 border-primary bg-background shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none"
      />
    )) ?? (
      <SliderPrimitive.Thumb className="block size-4 rounded-full border-2 border-primary bg-background shadow-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25" />
    )}
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";

export { Slider };
