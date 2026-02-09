import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-orange-100 dark:bg-stone-700",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
