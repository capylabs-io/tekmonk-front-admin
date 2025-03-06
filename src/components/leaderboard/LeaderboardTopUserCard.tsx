import React from "react";
import Image from "next/image";
import classNames from "classnames";

type Props = {
  rank: "first" | "second" | "third";
  imageUrl: string;
  name: string;
  specialName: string;
  score: string;
  customClassNames?: string;
};

export const LeaderboardTopUserCard = ({
  rank,
  imageUrl,
  name,
  specialName,
  score,
  customClassNames
}: Props) => {
  const BACKGROUND = (value: string) => {
    switch (value) {
      case "first":
        return "/image/leaderboard/gold-background.png";
      case "second":
        return "/image/leaderboard/silver-background.png";
      case "third":
        return "/image/leaderboard/bronze-background.png";
      default:
        return;
    }
  };
  const CARD_ASSETS = (value: string) => {
    switch (value) {
      case "first":
        return "bg-[#F9FFCA] border-[#F2E370]";
      case "second":
        return "bg-gray-10 border-gray-30";
      case "third":
        return "bg-[#FFEAD9] border-[#EE9F48]";
      default:
        return;
    }
  };
  const IMAGE = (value: string) => {
    switch (value) {
      case "first":
        return "border-[#F2E370] h-[80px] w-[80px]";
      case "second":
        return "border-gray-10 h-[80px] w-[80px]";
      case "third":
        return "border-[#EE9F48] h-[80px] w-[80px]";
      default:
        return;
    }
  };
  const BOX_SHADOW = (value: string) => {
    switch (value) {
      case "first":
        return "0px 8px 0px #DAC20F";
      case "second":
        return "0px 8px 0px #AC9FB1";
      case "third":
        return "0px 8px 0px #D67A17";
      default:
        return;
    }
  };
  const CARD_SHADOW = (value: string) => {
    switch (value) {
      case "first":
        return "shadow-[0px_6px_0px_#DAC20F] before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0px_4px_0px_#DAC20F]";
      case "second":
        return "shadow-[0px_6px_0px_#AC9FB1] before:absolute before:inset-0 before:rounded-full shadow-[inset_0px_4px_0px_#AC9FB1]";
      case "third": ``
        return "shadow-[0px_6px_0px_#D67A17] before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0px_4px_0px_#D67A17]";
      default:
        return;
    }
  };
  const userImage = IMAGE(rank);
  const backgroundImage = BACKGROUND(rank);
  const cardAssets = CARD_ASSETS(rank);
  const boxShadow = BOX_SHADOW(rank);
  const cardShadow = CARD_SHADOW(rank);
  // const cardMedal = MEDAL(rank);
  return (
    <div className={classNames("flex flex-col w-[200px]", customClassNames)}>
      <div
        style={{
          boxShadow: boxShadow,
        }}
        className={classNames(
          "border-2 relative flex flex-col justify-center items-center rounded-2xl", cardAssets
        )}
      >
        <Image
          src={backgroundImage || ""}
          alt="avatar pic"
          width={200}
          height={116}
          className="rounded-t-xl"
        />
        <div
          className={classNames(
            "rounded-full justify-center bg-no-repeat bg-cover border-[5px] absolute mb-16",
            !!imageUrl && imageUrl,
            userImage, cardShadow
          )}
        />
        <div className="flex flex-col justify-center items-center w-full h-[100%-116px] p-5">
          <div className="text-gray-95 text-SubheadMd">{name}</div>
          <div className="text-gray-50 text-BodyXs">{specialName}</div>
          <div className="text-gray-95 text-HeadingMd">{score}</div>
        </div>
      </div>
    </div>
  );
};
