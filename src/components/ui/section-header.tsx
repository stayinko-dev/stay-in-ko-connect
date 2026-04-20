import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeaderProps) => {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div
      className={cn(
        "flex flex-col gap-3 mb-10 md:mb-12",
        align === "center" ? alignment : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-3", alignment)}>
        {eyebrow && (
          <Badge variant="soft" className="px-3 py-1 text-[11px] uppercase tracking-wider">
            {eyebrow}
          </Badge>
        )}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-balance">
          {title}
        </h2>
        {description && (
          <p className="text-base text-muted-foreground max-w-2xl text-pretty font-body">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;