import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-slate-200 border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-slate-50 [a&]:hover:bg-slate-900/90",
        secondary: "bg-slate-100 text-slate-900 [a&]:hover:bg-slate-100/90",
        destructive:
          "bg-red-500 text-white focus-visible:ring-red-500/20 [a&]:hover:bg-red-500/90",
        outline:
          "border border-slate-200 bg-white text-slate-950 [a&]:hover:bg-slate-100 [a&]:hover:text-slate-900",
        ghost: "[a&]:hover:bg-slate-100 [a&]:hover:text-slate-900",
        link: "text-slate-900 underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
