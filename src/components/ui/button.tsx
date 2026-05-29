import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[0_10px_40px_-6px_hsl(var(--primary)/0.7)] hover:brightness-110",
        gradient:
          "text-white shadow-[0_8px_34px_-8px_hsl(var(--brand-violet)/0.7)] bg-[linear-gradient(110deg,hsl(var(--brand-blue)),hsl(var(--brand-violet))_55%,hsl(var(--brand-pink)))] bg-[length:200%_100%] hover:bg-[position:100%_0] hover:shadow-[0_12px_44px_-6px_hsl(var(--brand-violet)/0.8)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent border border-border/70",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-border",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        glass:
          "glass text-foreground hover:bg-card/80 hover:border-border",
        destructive:
          "bg-destructive text-white hover:brightness-110 shadow-[0_8px_30px_-10px_hsl(var(--destructive)/0.7)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px] rounded-md",
        default: "h-10 px-5",
        lg: "h-12 px-7 text-[15px] rounded-xl",
        xl: "h-14 px-9 text-base rounded-xl",
        icon: "size-10 rounded-lg",
        "icon-sm": "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
