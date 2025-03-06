import classNames from "classnames";
import { MoreHorizontal } from "lucide-react";
import React from "react";
type Props = {
  isUnread: boolean;
  title: string;
  createdAt: string;
};
export const NotiCard = ({ isUnread = true, title, createdAt }: Props) => {
  return (
    <div
      className={classNames(
        "pl-6 pr-4 py-4 flex justify-between items-center relative",
        isUnread && "bg-primary-50"
      )}
    >
      <div className="flex gap-x-3 items-center">
        {isUnread && (
          <div className="absolute left-2 h-2 w-2 rounded-full bg-primary-600" />
        )}
        <div className="bg-[url('/image/user/profile-pic-2.png')] bg-yellow-100 h-12 w-12 bg-center bg-contain rounded-full" />
        <div className="text-base">
          <span className="font-bold">Gojo Satoru</span>
          <span className="ml-2">{title}</span>
        </div>
      </div>
      <div>
        <div className="text-bodySm">{createdAt}</div>
        <MoreHorizontal size={20} />
      </div>
    </div>
  );
};
