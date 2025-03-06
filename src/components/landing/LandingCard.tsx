"use client";
import React from "react";
import Image from "next/image";
import classNames from "classnames";
import { Dela_Gothic_One } from "next/font/google";
import localFont from "next/font/local";

const delaGothicOne = localFont({
  src: "../../assets/fonts/DelaGothicOne-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-dela",
});
type Props = {
  imageUrl: string;
  title: string;
  subTitle: string;
  name: string;
};

export const LandingCard = ({ imageUrl, title, subTitle, name }: Props) => {
  const COLOR_BG = (value: string) => {
    switch (value) {
      case "left":
        return "bg-[#C0FEE7]";
      case "middle":
        return "bg-[#FDF7AE]";
      case "right":
        return "bg-[#C6F1FE]";
    }
  };
  const COLOR_SHADOW = (value: string) => {
    switch (value) {
      case "left":
        return "shadow-[3px_6px_0_0_#A1D9C4]";
      case "middle":
        return "shadow-[3px_6px_0_0_#D9D175]";
      case "right":
        return "shadow-[3px_6px_0_0_#8ED7ED]";
    }
  };
  const ROTATE_ATTIBUTE = (value: string) => {
    switch (value) {
      case "left":
        return "rotate-[-5.772deg]";
      case "middle":
        return "";
      case "right":
        return "rotate-[3deg]";
    }
  };
  const backgroundColor = COLOR_BG(name);
  const shadowColor = COLOR_SHADOW(name);
  const rotate = ROTATE_ATTIBUTE(name);
  return (
    <div
      className={classNames(
        `relative flex flex-col items-center justify-center rounded-3xl ${backgroundColor} w-[332px] min-h-[212px] text-center p-6 gap-y-2 ${shadowColor} ${rotate}`
      )}
    >
      <Image
        src={imageUrl}
        alt="landing pic 1"
        width={120}
        height={120}
        className="absolute -top-10"
      />
      <div
        className={`${delaGothicOne.className} font-bold text-2xl uppercase mt-10`}
      >
        {title}
      </div>
      <div>{subTitle}</div>
    </div>
  );
};
