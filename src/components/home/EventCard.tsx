"use client";
import React from "react";

type Props = {
  month: string;
  day: string;
  weekday: string;
  timeRange: string;
  title: string;
  onClick?: () => void;
};

export const EventCard = ({
  month,
  day,
  weekday,
  timeRange,
  title,
  onClick,
}: Props) => {
  const handleOnClick = () => {
    onClick && onClick();
  };
  return (
    <div className="flex gap-x-3 px-4 items-center" onClick={handleOnClick}>
      <div className="!rounded-[4px] border border-gray-200 shadow-[0_3px_0_0_#E4E7EC] text-center">
        <div className="bg-primary-600 text-white px-5 py-1 text-[10px] font-medium !rounded-t-[4px]">
          {month}
        </div>
        <div className="px-2 py-1 !rounded-b-[4px]">
          <div className="text-2xl text-primary-900 font-bold">{day}</div>
          <div className="text-gray-600 text-[10px]">{weekday}</div>
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-600">{timeRange}</div>
        <div className="text-lg text-primary-950 font-medium">{title}</div>
      </div>
    </div>
  );
};
