"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TNews } from "@/types/common-types";
import { CommonCard } from "@/components/common/CommonCard";
import { CommonTag } from "@/components/common/CommonTag";
import { Input } from "@/components/common/Input";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import qs from "qs";
import { ReqGetAllNews, ReqGetRamdomNews } from "@/requests/news";
import { get } from "lodash";

const ShowCarouselItemsComponent = ({ data }: { data: TNews[] }) => {
  console.log(data);
  const router = useCustomRouter();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [api, setApi] = useState<CarouselApi>();

  const handleRedirect = (id: number) => {
    router.push(`${ROUTE.NEWS}/${id}`);
  };

  // //use effect
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCarouselIndex(api.selectedScrollSnap());
    };

    setCarouselIndex(api.selectedScrollSnap());
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  return (
    <>
      <Carousel
        className="w-full min-h-[400px] "
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        setApi={setApi}
        onSelect={() => setCarouselIndex(api?.selectedScrollSnap() ?? 0)}
      >
        <CarouselContent>
          {data &&
            data.map((item, index) => (
              <CarouselItem key={index}>
                <div
                  className="w-full h-full relative flex flex-col items-center justify-center gap-4 cursor-pointer"
                  onClick={() => handleRedirect(item.id)}
                >
                  <Image
                    alt=""
                    src={item.thumbnail ? item.thumbnail : ""}
                    width={100}
                    height={360}
                    layout="responsive"
                    className="w-full h-full max-h-[360px] object-cover rounded-2xl"
                  />
                  <div className="w-full flex flex-col items-start justify-center gap-4">
                    <div className="flex items-center justify-center gap-2">
                      {item.tags?.split(",").map((tag, indexTag) => (
                        <CommonTag key={indexTag}>{tag.trim()}</CommonTag>
                      ))}
                    </div>
                    <div className="text-[#320130] text-HeadingSm">
                      {item.title}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
      <div
        className="flex justify-center gap-2 pt-4"
        role="tablist"
        aria-label="Article slides"
      >
        {data.map((article, index) => (
          <button
            key={article.id}
            className={`h-2 min-w-2 rounded-full p-0 transition-all hover:scale-125 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              index === carouselIndex
                ? "bg-primary-60"
                : "bg-primary-30 hover:cursor-pointer"
            }`}
            onClick={() => {
              setCarouselIndex(index);
              api?.scrollTo(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === carouselIndex}
            role="tab"
          />
        ))}
      </div>
    </>
  );
};

const FeaturedNewsComponent = ({
  data,
  onLoadMore,
  isFetchingNextPage,
}: {
  data: TNews[];
  onLoadMore: () => void;
  isFetchingNextPage: boolean;
}) => {
  const router = useCustomRouter();
  const handleRedirect = (id: number) => {
    router.push(`${ROUTE.NEWS}/${id}`);
  };
  return (
    <div className="w-full mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="text-HeadingMd text-[#320130]">TIN TỨC NỔI BẬT</div>
        <div className="flex gap-1">
          <CommonCard
            size="small"
            isActive={true}
            className="h-6 rounded-[4px] px-2 py-1 flex items-center !text-SubheadXs"
          >
            Tất cả
          </CommonCard>
          <CommonCard
            size="small"
            className="h-6 rounded-[4px] px-2 py-1 flex items-center !text-SubheadXs"
          >
            Tin tức
          </CommonCard>
          <CommonCard
            size="small"
            className="h-6 rounded-[4px] px-2 py-1 flex items-center !text-SubheadXs"
          >
            Hướng dẫn
          </CommonCard>
          <CommonCard
            size="small"
            className="h-6 rounded-[4px] px-2 py-1 flex items-center !text-SubheadXs"
          >
            Tutorial
          </CommonCard>
          <CommonCard
            size="small"
            className="h-6 rounded-[4px] px-2 py-1 flex items-center !text-SubheadXs"
          >
            Khóa học
          </CommonCard>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {data &&
          data.map((newsItem) => (
            <CommonCard
              key={newsItem.id}
              size="medium"
              className="h-[220px] w-full flex items-center justify-center"
              onClick={() => handleRedirect(newsItem.id)}
            >
              <div className="flex-1 flex flex-col gap-2 p-6 overflow-hidden">
                <div className="flex gap-2">
                  {newsItem.tags?.split(",").map((tag, index) => (
                    <CommonTag key={index}>{tag.trim()}</CommonTag>
                  ))}
                </div>

                <div
                  className="text-HeadingSm text-gray-95 max-h-16 w-full overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: (get(newsItem, "title", "") || "")
                      .replace(/<[^>]+>/g, "")
                      .trim()
                      .slice(0, 80)
                      .concat(
                        get(newsItem, "title", "").length > 80 ? "..." : ""
                      ),
                  }}
                ></div>

                <div
                  className="text-BodyMd text-gray-95 max-h-12 overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html:
                      get(newsItem, "content", "")
                        .replace(/<[^>]+>/g, "")
                        .substring(0, 100) + "...",
                  }}
                ></div>

                <time className="text-BodySm text-gray-70">
                  {newsItem.startTime}
                </time>
              </div>

              <Image
                src={newsItem.thumbnail ? newsItem.thumbnail : ""}
                alt=""
                width={220}
                height={220}
                className="h-[220px] object-cover rounded-r-2xl"
              />
            </CommonCard>
          ))}
      </div>

      {isFetchingNextPage ? (
        <div className="text-center">Loading . . .</div>
      ) : (
        <CommonCard
          size="medium"
          className="w-[122px] h-12 flex items-center justify-center text-SubheadMd text-primary-95 mx-auto mt-2"
          onClick={onLoadMore}
        >
          Xem thêm
        </CommonCard>
      )}
    </div>
  );
};

const SuggestComponent = ({ data }: { data: TNews[] }) => {
  const router = useCustomRouter();
  const handleRedirect = (id: number) => {
    router.push(`${ROUTE.NEWS}/${id}`);
  };
  return (
    <div className="flex flex-col gap-2">
      {data.map((newsItem) => (
        <CommonCard
          key={newsItem.id}
          size="medium"
          className="h-[124px] w-full flex items-center justify-center"
          onClick={() => handleRedirect(newsItem.id)}
        >
          <Image
            src={newsItem.thumbnail ? newsItem.thumbnail : ""}
            alt=""
            width={108}
            height={220}
            className="h-full object-cover rounded-l-2xl"
          />
          <div className="flex-1 flex flex-col gap-2 p-4">
            <time className="text-BodySm text-gray-70">
              {newsItem.startTime}
            </time>
            <div
              className="text-SubheadMd text-gray-95 max-h-16 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: (get(newsItem, "title", "") || "")
                  .replace(/<[^>]+>/g, "")
                  .trim()
                  .slice(0, 50)
                  .concat(get(newsItem, "title", "").length > 50 ? "..." : ""),
              }}
            ></div>
          </div>
        </CommonCard>
      ))}
    </div>
  );
};
export default function News() {
  //use state

  const handleLoadMoreContentt = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // use query
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      refetchOnWindowFocus: false,
      queryKey: ["news"],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          const queryString = qs.stringify({
            pagination: {
              page: pageParam,
              pageSize: 4,
            },
            filters: {
              type: "news",
            },
            populate: "*",
          });
          return await ReqGetAllNews(queryString);
        } catch (error) {
          return Promise.reject(error);
        }
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.meta?.pagination.pageCount
          ? allPages.length + 1
          : undefined;
      },
    });

  const { data: randomNews, isLoading: isLoadingRandomNews } = useQuery({
    queryKey: ["news/random"],
    queryFn: async () => {
      try {
        return await ReqGetRamdomNews("news");
      } catch (error) {
        return Promise.reject(error);
      }
    },
  });

  randomNews && console.log("randomNews data: ", randomNews.data);

  return (
    <>
      <div className="w-full min-h-[100vh] mt-16 grid grid-cols-3 gap-4 p-2">
        <div className="lg:col-span-2 col-span-3">
          <ShowCarouselItemsComponent data={randomNews?.data || []} />
          <FeaturedNewsComponent
            data={(data ? data.pages.flatMap((page) => page.data) : []) || []}
            onLoadMore={handleLoadMoreContentt}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
        <div className="col-span-1 flex-col gap-8 lg:flex hidden">
          <Input
            type="text"
            placeholder="Tìm kiếm article theo từ khoá"
            isSearch={true}
          />
          <SuggestComponent data={randomNews?.data || []} />
          <Image
            src="/image/home/banner-layout.png"
            alt="Default"
            width={220}
            height={456}
            className="w-full object-cover"
          />
          <Image
            src="/image/home/banner-layout.png"
            alt="Default"
            width={220}
            height={456}
            className="w-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
