"use client";
import classNames from "classnames";
import { ArrowRight } from "lucide-react";
import React from "react";
import { EventCard } from "./EventCard";
import { Event } from "@/types/common-types";

type Props = {
  customClassName?: string;
  listEvent?: Event[];
};
const BASE_CLASS = "rounded-xl border border-gray-200 py-4 text-primary-900";
export const EventList = ({ customClassName, listEvent }: Props) => {
  return (
    <div className={classNames(BASE_CLASS, customClassName)}>
      <div className="flex justify-between px-4">
        <div className="text-sm">SỰ KIỆN</div>
        <ArrowRight size={20} />
      </div>
      <hr className="border-t border-gray-200 my-4" />
      {listEvent?.map((event, index) => {
        return (
          <div key={index}>
            <EventCard
              day={event?.day}
              month={event?.month}
              weekday={event?.weekday}
              timeRange={event?.timeRange}
              title={event?.title}
            />
            {index + 1 !== listEvent.length && (
              <hr className="border-t border-gray-200 my-4" />
            )}
          </div>
        );
      })}
    </div>
  );
};
