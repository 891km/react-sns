import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useId } from "react";

function FloatingLabelInput({
  label,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
}) {
  const id = useId();

  return (
    <div className="group relative w-full">
      <label
        htmlFor={id}
        className="text-muted-foreground group-focus-within:text-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm transition-all duration-200 group-focus-within:top-4 group-focus-within:text-xs group-has-[input:not(:placeholder-shown)]:top-4 group-has-[input:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>

      <Input
        id={id}
        placeholder=""
        className={cn(className, "pt-9.5 pb-4.5")}
        {...props}
      />
    </div>
  );
}

export { FloatingLabelInput };
