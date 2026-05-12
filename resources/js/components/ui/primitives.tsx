import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

// ── Badge ────────────────────────────────────────────────────────────────────
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-hmif-green-700 text-white hover:bg-hmif-green-800",
        accent: "border-transparent bg-hmif-yellow-500 text-hmif-green-950 hover:bg-hmif-yellow-600",
        info: "border-transparent bg-hmif-blue-700 text-white hover:bg-hmif-blue-800",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        success: "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
        warning: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        outline: "text-foreground border-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// ── Input ────────────────────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:border-hmif-green-500 focus-visible:ring-2 focus-visible:ring-hmif-green-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// ── Label ────────────────────────────────────────────────────────────────────
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

// ── Textarea ─────────────────────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-input bg-white px-3 py-2 text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:border-hmif-green-500 focus-visible:ring-2 focus-visible:ring-hmif-green-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

// ── Separator ────────────────────────────────────────────────────────────────
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Badge, badgeVariants, Input, Label, Textarea, Separator }
