"use client";
import React, { ReactNode, useState } from "react";
import { MessageCircle } from "lucide-react";
import classNames from "classnames";
import { ProfileInfoBox } from "./ProfileInfoBox";
import { PostType, PostTypeEnum, PostVerificationType } from "@/types";
import { CommonButton } from "../common/button/CommonButton";
import { get } from "lodash";
import { ConvertoStatusPostToText } from "@/lib/utils";
import { useCustomRouter } from "../common/router/CustomRouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonTag } from "../common/CommonTag";

type Props = {
  data?: PostType | null;
  imageUrl: string;
  thumbnailUrl: string;
  userName: string;
  userRank?: ReactNode;
  specialName: string;
  createdAt: string;
  likedCount: string;
  commentCount: string;
  postName?: string;
  postContent?: string;
  customClassname?: string;
  isVerified?: boolean;
  isAllowClickDetail?: boolean;
  showButton?: boolean;
  hideSocial?: boolean;
  onVerifiedPost?: (data: PostType) => void;
  onLikedPostClick?: (data: PostType) => void;
};

export const Post = ({
  imageUrl,
  thumbnailUrl,
  userName,
  userRank,
  specialName,
  createdAt,
  likedCount,
  commentCount,
  showButton,
  hideSocial,
  customClassname,
  isVerified,
  postName,
  postContent,
  data,
  isAllowClickDetail,
  onVerifiedPost,
  onLikedPostClick,
}: Props) => {
  const [isDetail, setIsDetail] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useCustomRouter();
  const handleOnClick = (value: any) => {
    onVerifiedPost?.(value);
  };
  const handleClickPostCard = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/bai-viet/${data?.id}`);
  };

  return (
    <div
      className={classNames("relative", customClassname)}
      onDoubleClick={(e) => {
        isAllowClickDetail && handleClickPostCard(e);
      }}
    >
      {showButton && (
        <div className="flex gap-2 absolute top-0 right-0">
          <CommonButton
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleOnClick({
                ...data,
                isVerified: PostVerificationType.ACCEPTED,
              });
            }}
          >
            Chấp thuận
          </CommonButton>
          <CommonButton
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleOnClick({
                ...data,
                isVerified: PostVerificationType.DENIED,
              });
            }}
          >
            Từ chối
          </CommonButton>
        </div>
      )}
      <div className="flex items-center mt-8 w-full justify-between">
        <ProfileInfoBox
          imageUrl={imageUrl}
          userName={userName}
          userRank={userRank}
          specialName={specialName}
        />

        {isVerified && (
          <div className="inline-flex items-center bg-gray-20 text-gray-95 rounded-md text-BodyXs">
            <span className="px-2 py-1">
              {ConvertoStatusPostToText(get(data, "isVerified", ""))}
            </span>
          </div>
        )}
      </div>

      <div className="pl-10 mt-3">
        {!isVerified && (
          <div
            className={`w-full h-[300px] rounded-xl bg-center bg-cover bg-no-repeat`}
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
            }}
          ></div>
        )}
        <div className="mt-2">
          {data?.type === PostTypeEnum.PROJECT ? (
            <div>
              <span className="font-medium">Loại: Dự án</span>
            </div>
          ) : (
            <div>
              <span className="font-medium">Loại: Bài viết</span>
            </div>
          )}
        </div>
        {data?.tags && data?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {data?.tags.split(", ").map((tag: string, index: number) => (
              <CommonTag key={index}>{tag}</CommonTag>
            ))}
          </div>
        )}

        <div className="mt-3">
          <p className="text-xl font-bold text-gray-800">{postName}</p>
          <div className="relative">
            <div
              className={classNames(
                "text-base text-gray-800",
                isDetail ? "line-clamp-none" : "line-clamp-3"
              )}
              dangerouslySetInnerHTML={{
                __html: postContent || "",
              }}
            ></div>
            {data?.id && !isDetail && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDialogOpen(true);
                }}
                className="text-primary-70 hover:text-primary-80 font-medium mt-2 hover:underline"
              >
                Xem thêm
              </button>
            )}
          </div>
        </div>
        {isVerified && (
          <div
            className={`w-full h-[300px] rounded-xl bg-center bg-cover bg-no-repeat mt-3`}
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
            }}
          ></div>
        )}

        {!hideSocial && (
          <div className="mt-3 flex gap-x-10">
            <div className={classNames("flex items-center gap-x-1 font-bold ")}>
              <button
                onClick={() => {
                  data && onLikedPostClick?.(data);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={data?.isLiked ? "#ef4444" : "none"}
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className={classNames(
                    "cursor-pointer",
                    data?.isLiked ? "text-red-500" : ""
                  )}
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
              {/* <Heart size={24} /> */}
              <span>{likedCount}</span>
            </div>
            <div className="flex items-center gap-x-1 font-bold text-gray-500">
              <button>
                <MessageCircle size={20} />
              </button>
              <span>{commentCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Post Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{postName}</DialogTitle>
            <div className="ml-1">
              {data?.type === PostTypeEnum.PROJECT ? (
                <div>
                  <span className="font-medium">Dự án</span>
                </div>
              ) : (
                <div>
                  <span className="font-medium">Bài viết</span>
                </div>
              )}
            </div>
            <div className="flex items-center mt-4">
              <ProfileInfoBox
                imageUrl={imageUrl}
                userName={userName}
                userRank={userRank}
                specialName={specialName}
              />
            </div>
          </DialogHeader>

          <div className="mt-6">
            {thumbnailUrl && (
              <div
                className="w-full h-[300px] rounded-xl bg-center bg-cover bg-no-repeat mb-6"
                style={{
                  backgroundImage: `url(${thumbnailUrl})`,
                }}
              ></div>
            )}
            {data?.tags && data?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {data?.tags.split(", ").map((tag: string, index: number) => (
                  <CommonTag key={index}>{tag}</CommonTag>
                ))}
              </div>
            )}

            <div
              className="text-base text-gray-800"
              dangerouslySetInnerHTML={{
                __html: postContent || "",
              }}
            ></div>
          </div>

          {!hideSocial && (
            <div className="mt-6 flex gap-x-10">
              <div className="flex items-center gap-x-1 font-bold">
                <button
                  onClick={() => {
                    data && onLikedPostClick?.(data);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={data?.isLiked ? "#ef4444" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={classNames(
                      "cursor-pointer",
                      data?.isLiked ? "text-red-500" : ""
                    )}
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>
                <span>{likedCount}</span>
              </div>
              <div className="flex items-center gap-x-1 font-bold text-gray-500">
                <MessageCircle size={20} />
                <span>{commentCount}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
