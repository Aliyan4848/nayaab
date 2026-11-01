import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-content px-5 md:px-10", className)} {...props} />;
}

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-14 md:py-24", className)} {...props} />;
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "sale" | "new" | "neutral";
}

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  sale: "bg-ink text-ivory",
  new: "bg-emerald text-ivory",
  neutral: "border border-border text-ink",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-[11px] uppercase tracking-wide2 font-sans",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
