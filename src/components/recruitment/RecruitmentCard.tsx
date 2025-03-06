import React from "react";
import Image from "next/image";

type Props = {
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
};
export const RecruitmentCard = ({
  imageUrl,
  title,
  description,
  tags,
}: Props) => {
  return (
    <div className="w-[337px]">
      <Image
        src={imageUrl}
        alt="new pic"
        width={337}
        height={100}
        className="rounded-xl"
      />
      <div className="w-full mt-2 text-base">{title}</div>
      <div className="w-full mt-2 text-sm text-primary-900">{description}</div>
      <div className="flex flex-wrap gap-x-2 items-center mt-2">
        {tags &&
          tags.map((tag, index) => {
            return (
              <div
                key={index}
                className="px-2 py-1 bg-gray-200 text-xs text-gray-500 rounded-md"
              >
                {tag}
              </div>
            );
          })}
      </div>
    </div>
  );
};
