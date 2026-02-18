import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-orange-600 text-white shadow-sm hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
        outline:
          "border border-border bg-card hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-green-600 text-white shadow-sm hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-orange-600 underline-offset-4 hover:underline dark:text-orange-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
