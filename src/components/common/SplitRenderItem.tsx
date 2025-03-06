"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeGroupProps {
  items: React.ReactNode[];
  maxVisible?: number;
  className?: string;
  remainingItemsClassName?: string;
  tooltipContentClassName?: string;
}

export const SplitRenderItem = ({
  items,
  maxVisible = 2,
  className,
  remainingItemsClassName,
  tooltipContentClassName,
}: BadgeGroupProps) => {
  const visibleItems = items.slice(0, maxVisible);
  const remainingItems = items.slice(maxVisible);
  const hasMoreItems = remainingItems.length > 0;

  return (
    <div className={cn("flex flex-wrap gap-2")}>
      {visibleItems.map((item, index) => (
        <div className={className} key={index}>
          {item}
        </div>
      ))}

      {hasMoreItems && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("cursor-pointer", remainingItemsClassName)}>
                +{remainingItems.length}
              </div>
            </TooltipTrigger>
            <TooltipContent className={cn("flex flex-wrap gap-2")}>
              {remainingItems.map((item, index) => (
                <div
                  className={tooltipContentClassName}
                  key={`remaining-${index}`}
                >
                  {item}
                </div>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
