"use client";

import { Class } from "@/types/common-types";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const TeacherList = ({ data }: { data: Class }) => {
  const [imageError, setImageError] = useState(false);
  const defaultImageSrc = "/image/home/profile-pic.png";

  // Use teacher image if available, otherwise use default
  const imageSrc =
    data.teacher?.avatar && !imageError ? data.teacher.avatar : defaultImageSrc;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-6">
        <div className="relative min-w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-primary-40 shadow-md">
          <Image
            alt={`${data.teacher?.fullName || "Teacher"}'s profile picture`}
            src={imageSrc}
            width={120}
            height={120}
            className="object-cover"
            onError={() => setImageError(true)}
            priority
          />
        </div>
        <div className="flex flex-col items-start justify-center space-y-2">
          <h3
            className={cn(
              "text-xl font-semibold text-gray-900",
              !data.teacher?.fullName && "text-gray-500"
            )}
          >
            {data.teacher?.fullName || "Teacher Name Not Available"}
          </h3>
          <div className="grid grid-cols-1 gap-1.5 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Email:</span>
              <span>{data.teacher?.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">ID:</span>
              <span>{data.teacher?.id || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Phone:</span>
              <span>{data.teacher?.phoneNumber || "N/A"}</span>
            </div>
          </div>
          {data.name && (
            <div className="mt-2 px-3 py-1 bg-primary-10 text-primary-70 rounded-full text-xs font-medium">
              Class: {data.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
