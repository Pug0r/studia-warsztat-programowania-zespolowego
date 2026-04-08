import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-slate-900 selection:text-slate-50 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-slate-950 focus-visible:ring-[3px] focus-visible:ring-slate-950/50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
