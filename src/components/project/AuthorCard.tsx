"use client";
import React, { ReactNode, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { Button } from "../common/button/Button";
import { ProfileInfoBox } from "../home/ProfileInfoBox";

type Props = {
  imageUrl: string;
  userName: string;
  userRank: ReactNode;
  specialName: string;
  likedCount: string;
  projectCount: string;
  customClassName?: string;
};
const BASE_CLASS =
  "rounded-xl border border-gray-200 py-4 flex flex-col text-primary-900";
export const AuthorCard = ({
  imageUrl,
  userName,
  userRank,
  specialName,
  likedCount,
  projectCount,
  customClassName,
}: Props) => {
  return (
    <div className={classNames(BASE_CLASS, customClassName)}>
      <div className="w-full flex justify-between px-4 items-center">
        <span className="text-SubheadMd">TÁC GIẢ</span>
        <Button size="small" outlined className="!text- !text-black">
          Xem hồ sơ
        </Button>
      </div>
      <hr className="border-t border-gray-200 my-4" />
      <div className="w-full px-4">
        <ProfileInfoBox
          imageUrl={imageUrl}
          userName={userName}
          userRank={userRank}
          specialName={specialName}
        />
        <div className="flex w-full mt-4 gap-x-4">
          <div className="w-full">
            <div className="text-Heading3xl text-primary-900">{likedCount}</div>
            <div className="text-bodySm text-gray-500">Lượt yêu thích</div>
          </div>
          <div className="w-full">
            <div className="text-Heading3xl text-primary-900">
              {projectCount}
            </div>
            <div className="text-bodySm text-gray-500">Dự án</div>
          </div>
        </div>
      </div>
    </div>
  );
};
