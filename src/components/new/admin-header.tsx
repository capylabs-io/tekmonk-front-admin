"use client";

import { ArrowLeft, PanelLeft } from "lucide-react";
import { CommonCard } from "../common/CommonCard";
import { CommonButton } from "../common/button/CommonButton";

type Props = {
  title: string;
  buttonTitle?: string;
  onBack?: () => void;
  onClickButton?: () => void;
};
export const AdminHeader = ({
  title,
  buttonTitle,
  onBack,
  onClickButton,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b">
      <div className="flex items-center gap-2">
        <CommonCard
          size="small"
          className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
        >
          <PanelLeft width={17} height={17} />
        </CommonCard>

        {onBack && (
          <ArrowLeft
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={onBack}
          />
        )}
        <div className="flex items-center justify-center">
          <div className="text-SubheadLg text-gray-95">{title}</div>
        </div>
      </div>
      {buttonTitle ? (
        <CommonButton className="ml-auto h-9" onClick={onClickButton}>
          {buttonTitle}
        </CommonButton>
      ) : (
        <></>
      )}
    </div>
  );
};
