"use client";

import { cn } from "@/lib/utils";
import { CommonCard } from "../common/CommonCard";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  day: string;
  month: string;
  week: string;
  className?: string;
}

export const CalendarCard = ({
  day,
  month,
  week,
  className,
  ...props
}: Props) => {
  return (
    <CommonCard
      size="small"
      className={cn(
        "w-16 h-[74px] flex flex-col items-center justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="h-[22px] w-full rounded-t-[4px] text-SubheadXs text-gray-00 bg-[#BC4CAC] text-center flex items-center justify-center">
        TH.{month}
      </div>
      <div className="w-full flex-1 flex flex-col items-center justify-between bg-gray-00 py-1">
        <div className="text-HeadingSm text-[#5A0057] text-center">{day}</div>
        <div className="text-[10px] leading-[12px] text-gray-70 text-center">
          {week}
        </div>
      </div>
    </CommonCard>
  );
};
