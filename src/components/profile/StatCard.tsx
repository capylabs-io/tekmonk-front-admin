"use client";
import { Dela_Gothic_One } from "next/font/google";
import React from "react";
import localFont from "next/font/local";

const delaGothicOne = localFont({
  src: "../.././assets/fonts/DelaGothicOne-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-dela",
});
type Props = {
  value: string;
  title: string;
};
export const StatCard = ({ value, title }: Props) => {
  return (
    <div className="py-4 w-[200px] shadow-[1px_3px_0_0_#E4E7EC] rounded-2xl bg-[#FCFCFD] text-center border border-gray-200">
      <p className={`${delaGothicOne.className} text-2xl text-primary-900`}>
        {value}
      </p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
};
