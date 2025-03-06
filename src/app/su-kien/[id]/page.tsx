"use client";
import Image from "next/image";
import { CommonTag } from "@/components/common/CommonTag";
import { CommonCard } from "@/components/common/CommonCard";
import { Clock8, Facebook, Linkedin, MapPin } from "lucide-react";
import { RelatedInfo } from "@/components/new/RelatedInfo";
import { LandingFooter } from "@/components/new/NewsFooter";
import { CalendarCard } from "@/components/event/CalendarCard";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ReqGetNewsById, ReqGetRamdomNews } from "@/requests/news";
import Loading from "@/app/loading";
import { get } from "lodash";
export default function Page() {
  const { id } = useParams();
  const { data: news, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const res = await ReqGetNewsById(id.toString());
      return res.data;
    },
  });

  const { data: randomNews } = useQuery({
    queryKey: ["news/random"],
    queryFn: async () => {
      try {
        return await ReqGetRamdomNews("event");
      } catch (error) {
        return Promise.reject(error);
      }
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full max-w-[628px] mt-16 p-2 flex flex-col items-center justify-center gap-4 ">
        <div className="w-full h-[360px] rounded-2xl relative">
          <Image
            alt="Demo image"
            src="/image/landing/demo1.png"
            width={100}
            height={360}
            className="w-full h-[360px] object-cover rounded-2xl"
          />
          <CalendarCard
            day="03"
            month="12"
            week="Chủ nhật"
            className="absolute right-2 top-2"
          />
        </div>
        <div className="flex items-center justify-between w-full md:flex-row flex-col gap-2">
          <div className="flex items-start justify-center gap-2 ">
            {news?.tags &&
              news?.tags
                ?.split(",")
                .map((tag: string, index: number) => (
                  <CommonTag key={index}>{tag.trim()}</CommonTag>
                ))}
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="text-BodySm text-gray-70 md:block hidden">
              Chia sẻ bài đăng:{" "}
            </div>
            <CommonCard
              size="small"
              className="w-9 h-9 flex items-center justify-center"
            >
              <Facebook
                size={24}
                color="#ffffff"
                fill="#ffffff"
                className="bg-primary-70 rounded-[100%] p-1"
              />
            </CommonCard>
            <CommonCard
              size="small"
              className="w-9 h-9 flex items-center justify-center"
            >
              <Linkedin
                size={24}
                color="#ffffff"
                fill="#ffffff"
                className="bg-primary-70 rounded-sm p-1"
              />
            </CommonCard>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <div className="flex items-center text-SubheadMd text-gray-95 gap-2">
            <Clock8 className="text-gray-70" size={16} />
            <div>{news?.startTime}</div>
          </div>
          <div className="flex items-start text-BodyMd text-gray-95 gap-2">
            <MapPin className="text-gray-70 mt-1" size={16} />
            <div>{news?.location}</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-HeadingMd text-gray-95">{news?.title}</div>
          <div className="flex items-center justify-between w-full">
            <div className="text-BodySm text-gray-70">{news?.createdAt}</div>
            <div className="flex items-center justify-center gap-1">
              <div className="text-BodySm text-gray-70">Đăng tải bởi:</div>
              <div className="text-SubheadSm text-gray-95">Admin</div>
            </div>
          </div>
          <div className="text-BodyMd text-gray-95">
            <div>{news?.content}</div>
          </div>
        </div>
      </div>
      {randomNews?.data && (
        <RelatedInfo
          type="event"
          data={get(randomNews, "data", [])}
          title="SỰ KIỆN GẦN ĐÂY"
        />
      )}
      <LandingFooter />
    </div>
  );
}
