"use client";

import { TNews } from "@/types/common-types";
import { CommonCard } from "../common/CommonCard";
import Image from "next/image";
import { useCustomRouter } from "../common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { get } from "lodash";

export const RelatedInfo = ({
  type,
  data,
  title,
}: {
  type: "news" | "hiring" | "event";
  data?: TNews[];
  title: string;
}) => {
  const router = useCustomRouter();
  const handleRedirectToNewsDetail = (id: string) => {
    switch (type) {
      case "news":
        router.push(`${ROUTE.NEWS}/${id}`);
        break;
      case "hiring":
        router.push(`${ROUTE.HIRING}/${id}`);
        break;
      case "event":
        router.push(`${ROUTE.EVENTS}/${id}`);
        break;
    }
  };
  return (
    <div className="w-full flex items-start flex-col gap-4 border-t border-gray-20 py-12">
      <div
        className="text-HeadingSm text-[#320130]"
        dangerouslySetInnerHTML={{
          __html: title
            .replace(/<[^>]+>/g, "")
            .trim()
            .slice(0, 50)
            .concat(title.length > 50 ? "..." : ""),
        }}
      ></div>
      {data ? (
        <div className="flex items-center gap-4 lg:flex-row flex-col w-full">
          {data.map((item, index) => {
            return (
              <CommonCard
                key={index}
                size="medium"
                className="h-[124px] w-full flex items-center justify-center"
                onClick={() => handleRedirectToNewsDetail(item.id.toString())}
              >
                <Image
                  src={
                    get(item, "thumbnail", "") == null
                      ? ""
                      : get(item, "thumbnail", "")
                  }
                  alt=""
                  width={108}
                  height={220}
                  className="h-full object-cover rounded-l-2xl"
                />
                <div className="flex-1 flex flex-col gap-2 p-4">
                  <time className="text-BodySm text-gray-70">
                    {item.startTime}
                  </time>
                  <div
                    className="text-SubheadMd text-gray-95 max-h-16 overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: (get(item, "title", "") || "")
                        .replace(/<[^>]+>/g, "")
                        .trim()
                        .slice(0, 40)
                        .concat(
                          get(item, "title", "").length > 40 ? "..." : ""
                        ),
                    }}
                  ></div>
                </div>
              </CommonCard>
            );
          })}
        </div>
      ) : (
        <div>Khong co du lieu</div>
      )}
    </div>
  );
};
