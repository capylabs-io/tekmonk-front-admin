"use client";

import Tag from "@/components/contest/Tag";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  thumbnail: string;
  title: string;
  status: boolean;
  startDate: string;
  endDate: string;
};

export default function CardContestItem({
  id,
  thumbnail,
  title,
  status,
  startDate,
  endDate,
}: Props) {
  const router = useRouter();

  const handleOnClick = () => {
    router.push(`/listContest/${id}`);
  };

  return (
    <div className="flex flex-col items-center">
      <Image
        src={thumbnail ? thumbnail : "/image/contest/tienphongbanner.png"}
        alt="Banner contest"
        width={480}
        height={240}
        quality={80}
        style={{ borderRadius: "8px", cursor: "pointer" }}
        onClick={handleOnClick}
      />
      <Tag
        text={status ? "Đang diễn ra" : "Đã kết thúc"}
        className="mt-2 mb-1"
        size="small"
        type={status ? "primary" : "secondary"}
      />
      <p
        className="text-SubheadSm line-clamp-3 flex-1 cursor-pointer w-full text-center"
        style={{ maxWidth: "480px" }}
        onClick={handleOnClick}
      >
        {title}
      </p>
      <p className="text-bodySm">
        <span>{startDate}</span> - <span>{endDate}</span>
      </p>
    </div>
  );
}
