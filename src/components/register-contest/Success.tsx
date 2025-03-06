"use client";

import Image from "next/image";
import React from "react";

export const SuccessComponent = ({
  candidateNumber,
}: {
  candidateNumber: string;
}) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-[84px] h-[84px] bg-pink-500 rounded-full flex items-center justify-center">
          <Image
            alt=""
            src={"/image/icon/done-progress.png"}
            width={84}
            height={84}
          />
        </div>
      </div>
      <div className="text-bodyLg mx-auto">
        Cảm ơn bạn đã đăng ký tham gia{" "}
        <b>&quot;Giải vô địch Tekmonk Coding Olympiad.&quot;!</b> Bạn vui lòng
        kiểm tra email và làm theo hướng dẫn để hoàn tất thủ tục dự thi.
      </div>
      <div className="text-bodyLg mx-auto">
        Số báo danh của bạn là:
        <span className="font-bold"> {candidateNumber}</span>
      </div>
      <div className="italic text-bodyLg mx-auto">
        Xin vui lòng lưu lại số báo danh để tham gia cuộc thi
      </div>
    </div>
  );
};
