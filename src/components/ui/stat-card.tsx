import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  hint?: string;
  className?: string;
}

const StatCard = ({ label, value, icon: Icon, trend, hint, className }: StatCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-soft transition-base hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl md:text-3xl font-display font-bold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              trend.direction === "up" && "text-success",
              trend.direction === "down" && "text-destructive",
              trend.direction === "flat" && "text-muted-foreground",
            )}
          >
            {trend.direction === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
            {trend.direction === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};

export default StatCard;