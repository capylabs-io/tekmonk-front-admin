"use client";

import Link from "next/link";

export const ContactInfo = () => {
  return (
    <>
      <div className="space-y-6 pt-4">
        <p className="text-base leading-relaxed text-gray-800">
          Mọi thắc mắc hoặc cần tư vấn vui lòng liên hệ với Ban tổ chức Giải Vô
          địch Tekmonk Coding Olympiad theo một trong các cách sau:
        </p>

        <div className="space-y-4 pl-1">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 min-w-[80px]">
              Kênh liên hệ ưu tiên:
            </span>
            <span className="text-gray-900">
              Qua email: tekmonk.olympiad@gmail.com
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-700 min-w-[80px]">
              Kênh liên hệ trong trường hợp khẩn cấp:
            </span>
            <span className="text-gray-900">
              Qua các số điện thoại: 0858514499 / 0378247797
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-700 min-w-[80px]">Facebook:</span>
            <Link
              href="https://www.facebook.com/profile.php?id=61567929749914"
              className="text-primary-700 hover:text-primary-800 font-medium underline transition-colors"
              target="_blank"
            >
              Tekmonk Coding Olympiad - Giải vô địch lập trình
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-700 min-w-[80px]">Website:</span>
            <Link
              href="https://olympiad.tekmonk.edu.vn"
              className="text-primary-700 hover:text-primary-800 font-medium underline transition-colors"
              target="_blank"
            >
              olympiad.tekmonk.edu.vn
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
