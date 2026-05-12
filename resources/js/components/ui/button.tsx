import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-hmif-green-700 text-white hover:bg-hmif-green-800 shadow-sm",
        accent:
          "bg-hmif-yellow-500 text-hmif-green-950 hover:bg-hmif-yellow-600 shadow-sm",
        info:
          "bg-hmif-blue-700 text-white hover:bg-hmif-blue-800 shadow-sm",
        outline:
          "border-border bg-white text-foreground hover:bg-muted hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        link:
          "text-hmif-green-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4 py-2",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
        lg: "h-12 gap-2 rounded-xl px-6 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
