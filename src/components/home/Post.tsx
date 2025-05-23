"use client";
import React, { ReactNode, useMemo, useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
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
import { motion } from "framer-motion";
import Image from "next/image";
import { PostImageGallery } from "./post-detail";

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
  isLoading?: boolean;
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
  isLoading,
}: Props) => {
  const [isDetail, setIsDetail] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
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

  const postImages = useMemo(() => {
    // For now, we'll use the thumbnail as the first image
    // In a real implementation, you would get all images from the post data
    const images = [];
    if (thumbnailUrl) {
      images.push(thumbnailUrl);
    }

    // Add more images if available in the post data
    if (data?.images) {
      // Handle images which are objects with url property
      const imageUrls = (data.images as { url: string }[]).map(
        (img) => img.url
      );
      images.push(...imageUrls);
    }

    return images;
  }, [thumbnailUrl, data]);

  const displayImages =
    postImages.length > 5 ? postImages.slice(0, 5) : postImages;
  const remainingCount = postImages.length - 5;

  const getGridLayout = () => {
    switch (postImages.length) {
      case 0:
        return "";
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2 md:grid-cols-4";
      case 4:
        return "grid-cols-2 md:grid-cols-3";
      default:
        return "grid-cols-2 md:grid-cols-4";
    }
  };

  // Generate specific class for each item based on its position
  const getItemClass = (index: number) => {
    if (postImages.length === 1) {
      return "col-span-1";
    } else if (postImages.length === 2) {
      return "col-span-1";
    } else if (postImages.length === 3) {
      return index === 0
        ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2"
        : "col-span-1 md:col-span-1";
    } else if (postImages.length === 4) {
      return index === 0
        ? "col-span-2 row-span-2 md:col-span-1 md:row-span-2"
        : "col-span-1";
    } else {
      return index === 0
        ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2"
        : "col-span-1";
    }
  };

  const handleOpenGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  // Show loading state if isLoading is true
  if (isLoading) {
    return (
      <div className={classNames("relative animate-pulse", customClassname)}>
        <div className="flex items-center mt-8 w-full justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
        <div className="pl-10 mt-3">
          <div className="w-full h-[300px] bg-gray-200 rounded-xl"></div>
          <div className="mt-3">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* {!isVerified && (
          <div
            className={`w-full h-[300px] rounded-xl bg-center bg-cover bg-no-repeat`}
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
            }}
          ></div>
        )} */}
        {postImages.length > 0 && (
          <div className={`grid gap-2 ${getGridLayout()} mt-3`}>
            {displayImages.map((imageUrl, index) => {
              const isLastWithMore = index === 4 && remainingCount > 0;

              return (
                <motion.div
                  key={index}
                  className={`relative rounded-lg overflow-hidden ${getItemClass(
                    index
                  )}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleOpenGallery(index)}
                >
                  <Image
                    src={imageUrl}
                    alt={`Post image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />

                  {/* Type indicator */}
                  {index === 0 && (
                    <div className="absolute left-4 top-4">
                      {data?.type === PostTypeEnum.PROJECT ? (
                        <div className="bg-primary-70 text-white px-2 py-1 rounded-md">
                          <span className="font-medium">Dự án</span>
                        </div>
                      ) : (
                        <div className="bg-primary-70 text-white px-2 py-1 rounded-md">
                          <span className="font-medium">Bài viết</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Remaining Count Overlay */}
                  {isLastWithMore && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-white text-2xl font-bold flex items-center">
                        <Plus className="h-6 w-6 mr-1" />
                        {remainingCount}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
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
        {data?.tags && (
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {data.tags.split(", ").map((tag: string, index: number) => (
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
            {data?.tags && (
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {data.tags.split(", ").map((tag: string, index: number) => (
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
      {data && (
        <PostImageGallery
          data={data}
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
          images={postImages}
          currentIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          userName={userName}
          imageUrl={imageUrl}
          specialName={specialName}
          postName={postName}
          postContent={postContent}
          createdAt={createdAt}
          likedCount={likedCount}
          commentCount={commentCount}
          tags={data?.tags?.split(", ")}
          isLiked={data?.isLiked}
          onLike={() => data && onLikedPostClick?.(data)}
          postId={data.id}
          onUpdateComment={() => {}}
        />
      )}
    </div>
  );
};
