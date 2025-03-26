"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../common/button/Button";
import { Check } from "lucide-react";
import { CommonCard } from "../common/CommonCard";

type Props = {
  missionName: string;
  missionDescription: string;
  imageUrl: string;
  score: string;
  status: string;
  onClick?: () => void;
};
export const MissionCard = ({
  missionName,
  missionDescription,
  imageUrl,
  score,
  status,
  onClick,
}: Props) => {
  const [missionStatus, setMissionStatus] = useState("inprogress");
  const handleMissionOnClick = () => {
    setMissionStatus((prev) =>
      prev === "inprogress"
        ? "complete"
        : prev === "complete"
          ? "claimded"
          : "inprogress"
    );
  };
  return (
    <CommonCard isActive={missionStatus !== "complete"} className="flex flex-col items-center justify-center w-[200px] text-center p-4 !bg-white border-2 border-gray-30 place-self-stretch">
      <Image
        src={imageUrl || ""}
        alt="mission"
        width={120}
        height={120}
      />

      <span className="text-SubheadSm mt-2 text-gray-95">{missionName}</span>
      <span className="text-BodyXs text-gray-70">{missionDescription}</span>

      {missionStatus === "inprogress" ? (
        <Button
          onClick={handleMissionOnClick}
          urlIcon="/image/home/coin.png"
          className="mt-2 text-SubheadXs !py-[6px] !px-[12px] !font-normal !border !border-gray-30 !bg-white !text-primary-900"
        >
          {score}
        </Button>
      ) : missionStatus === "complete" ? (
        <Button urlIcon="/image/home/coin.png"
          style={{
            boxShadow:
              "0px 2px 0px #9a1595"
          }} onClick={handleMissionOnClick} className="mt-2 text-SubheadXs border-2 border-primary-70 !py-[6px] !px-[12px] !font-normal">
          {score}
        </Button>
      ) : (
        <Button
          onClick={handleMissionOnClick}
          className="!bg-green-50 !text-green-400 mt-2 !text-SubheadXs !font-normal !py-[6px] !px-[12px]"
        >
          <Check size={18} className="mr-2" fontWeight={800} /> Đã nhận
        </Button>
      )
      }
    </CommonCard >
  );
};
