"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function AllContestEntriesHeader() {
  const router = useRouter();
  return (
    <>
      <div className="h-16 w-full flex items-center justify-between pl-12 pr-12 border-b ">
        <Image
          src="/image/app-logox2.png"
          alt="app logo"
          width={159}
          height={32}
          className="hover:cursor-pointer h-8 w-40"
          onClick={() => router.push("/home")}
        />
        <div className="flex w-[464px] h-full items-center justify-around text-gray-950">
          <div className="text-gray-950 text-bodyLg">Thể lệ</div>
          <div className="text-gray-950 text-bodyLg">Danh sách bài dự thi</div>
          <div className="text-gray-950 text-bodyLg">Bài dự thi của tôi</div>
          <div className="text-gray-950 text-bodyLg">Đăng nhập</div>
        </div>
      </div>
    </>
  );
}
