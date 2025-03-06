"use client";
import Image from "next/image";
import { CommonTag } from "@/components/common/CommonTag";
import { CommonCard } from "@/components/common/CommonCard";
import { Banknote, Facebook, Linkedin, MapPin } from "lucide-react";
import { RelatedInfo } from "@/components/new/RelatedInfo";
import { LandingFooter } from "@/components/new/NewsFooter";
import { useParams } from "next/navigation";
import { ReqGetNewsById, ReqGetRamdomNews } from "@/requests/news";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { get } from "lodash";
import { useEffect } from "react";
export default function Page() {
  const router = useCustomRouter();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      return await ReqGetNewsById(id as string);
    },
  });

  const { data: randomNews, isLoading: isLoadingRandomNews } = useQuery({
    queryKey: ["news/random"],
    queryFn: async () => {
      try {
        return await ReqGetRamdomNews("hiring");
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
        <Image
          alt="Demo image"
          src="/image/landing/demo1.png"
          width={100}
          height={360}
          className="w-full h-[360px] object-cover rounded-2xl"
        />
        <div className="flex items-center justify-between w-full md:flex-row flex-col gap-2">
          <div className="flex items-start justify-center gap-2 ">
            {data?.data.tags &&
              data.data.tags
                .split(",")
                .map((tag, index) => (
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
            <Banknote className="text-gray-70" size={16} />
            <div>{data && data.data.salary}</div>
          </div>
          <div className="flex items-start text-BodyMd text-gray-95 gap-2">
            <MapPin className="text-gray-70 mt-1" size={16} />
            <div>{data && data.data.location}</div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-HeadingMd text-gray-95">
            {data && data.data.title}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="text-BodySm text-gray-70">
              {data && data.data.createdAt}
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="text-BodySm text-gray-70">Đăng tải bởi:</div>
              <div className="text-SubheadSm text-gray-95">Admin</div>
            </div>
          </div>
          <div className="text-BodyMd text-gray-95">
            <div>{data && data.data.content}</div>
          </div>
        </div>
      </div>
      <RelatedInfo
        type="hiring"
        data={get(randomNews, "data", [])}
        title="TIN TUYỂN DỤNG MỚI"
      />
      <LandingFooter />
    </div>
  );
}
