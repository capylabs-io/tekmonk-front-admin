import React, { ReactNode } from "react";
import Image from "next/image";
import classNames from "classnames";

type Props = {
  imageUrl: string;
  userName: string;
  userRank: ReactNode;
  specialName: string;
};
export const ProfileInfoBox = ({
  imageUrl,
  userName,
  userRank,
  specialName,
}: Props) => {
  return (
    <div className="flex items-center gap-x-2">
      {/* <div className='h-10 w-10 rounded-full flex flex-col bg-yellow-100 items-center justify-center'>
                <Image src={imageUrl} alt='profile pic' width={32} height={32} />
            </div> */}
      <div
        className={classNames(
          "h-10 w-10 rounded-full flex flex-col bg-yellow-100 items-center justify-center",
          imageUrl && imageUrl
        )}
      />

      <div>
        <div className="truncate flex gap-x-2 items-center">
          <span className="text-base font-bold">{userName}</span>
        </div>
        <div className="text-sm text-gray-500 inline-flex gap-1 items-center">{userRank} {specialName}</div>
      </div>
    </div>
  );
};
