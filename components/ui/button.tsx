import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md transition-all duration-200 ease-out",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active shadow-sm hover:shadow-md transition-all duration-200 ease-out",
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent-active shadow-sm hover:shadow-md transition-all duration-200 ease-out",
        outline: "border border-outline bg-surface hover:bg-surface-container-highest hover:border-outline-variant shadow-sm hover:shadow-md transition-all duration-200 ease-out",
        ghost: "hover:bg-surface-container-high active:bg-surface-container-highest transition-all duration-150 ease-out",
        link: "text-primary underline-offset-4 hover:underline transition-colors duration-150",
      },
      size: {
        sm: "h-9 px-3 text-label rounded-md",
        default: "h-10 px-4 text-label-large rounded-lg",
        lg: "h-12 px-6 text-label-large rounded-xl",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }