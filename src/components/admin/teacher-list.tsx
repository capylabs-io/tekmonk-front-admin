"use client";

import { Class } from "@/types/common-types";
import Image from "next/image";
export const TeacherList = ({ data }: { data: Class }) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <Image
          alt={"teacher Image"}
          src={""}
          width={100}
          height={100}
          className=""
        />
        <div className="flex flex-col items-start justify-center">
          <div className="text-SubheadLg text-gray-95">
            {data.teacher?.fullName}
          </div>
          <div className="text-BodySm text-gray-95">
            D.O.B: {data.teacher?.email}
          </div>
          <div className="text-BodySm text-gray-95">
            Mã số: {data.teacher?.id}
          </div>
          <div className="text-BodySm text-gray-95">
            SĐT: {data.teacher?.phoneNumber}
          </div>
        </div>
      </div>
    </div>
  );
};
