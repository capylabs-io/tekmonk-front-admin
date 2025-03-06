"use client";

export const TimeConvert = ({ time }: { time: string | Date }) => {
  return (
    <div>
      {new Date(time).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  );
};
