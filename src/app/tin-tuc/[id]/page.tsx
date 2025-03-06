"use client";
import Image from "next/image";
import { CommonTag } from "@/components/common/CommonTag";
import { CommonCard } from "@/components/common/CommonCard";
import { Facebook, Linkedin } from "lucide-react";
import { RelatedInfo } from "@/components/new/RelatedInfo";
import { LandingFooter } from "@/components/new/NewsFooter";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ReqGetNewsById, ReqGetRamdomNews } from "@/requests/news";
import Loading from "@/app/loading";
import { get } from "lodash";
export default function Page() {
  //get id from url
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["news", id],
    queryFn: async () => {
      try {
        const res = await ReqGetNewsById(id as string);
        return res.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
  });

  const { data: randomNews } = useQuery({
    queryKey: ["news/random"],
    queryFn: async () => {
      try {
        return await ReqGetRamdomNews("news");
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
            {data?.tags &&
              data.tags
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
        <div className="flex flex-col items-center gap-2">
          <div className="text-HeadingMd text-gray-95">
            {data && data.title}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="text-BodySm text-gray-70">
              {data && data.startTime}
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="text-BodySm text-gray-70">Đăng tải bởi:</div>
              <div className="text-SubheadSm text-gray-95">Admin</div>
            </div>
          </div>
          <div
            className="text-BodyMd text-gray-95"
            dangerouslySetInnerHTML={{
              __html: (data && data.content) || "",
            }}
          ></div>
        </div>
      </div>
      <RelatedInfo
        type="news"
        data={get(randomNews, "data", [])}
        title="TIN TỨC LIÊN QUAN"
      />
      <LandingFooter />
    </div>
  );
}
