"use client";

import Tag from "@/components/contest/Tag";
import { Dock, DockIcon } from "@/components/ui/dock";
import { getOneContestSubmission } from "@/requests/contestSubmit";
import { ContestSubmission, TResultCodeCombat } from "@/types/contestSubmit";
import {
  ArrowLeft,
  Download,
  Facebook,
  Mail,
  Send,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  EmailShareButton,
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import { EmptySearch } from "@/components/common/EmptySearch";
import { Button } from "@/components/common/button/Button";
import { useEffect, useState } from "react";
import { useTagStore } from "@/store/TagStore";
import { get, round } from "lodash";
import { ImageCustom } from "@/components/common/ImageCustom";
import { Certificate } from "@/components/contest/Certificate";

const ContestDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [contestDetail, setContestDetail] = useState<ContestSubmission | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const setSelectedTag = useTagStore((state) => state.setSelectedTag);
  const [isShowCodeCombatCert, setIsShowCodeCombatCert] = useState(false);

  const mergeCourses = (courses: TResultCodeCombat[]): TResultCodeCombat[] => {
    const mergedMap = new Map<string, TResultCodeCombat>();

    for (const course of courses) {
      if (mergedMap.has(course.name)) {
        const existing = mergedMap.get(course.name)!;

        existing.currentLevel += course.currentLevel;
        existing.totalLevel += course.totalLevel;
      } else {
        mergedMap.set(course.name, { ...course });
      }
    }

    return Array.from(mergedMap.values());
  };

  const fetchContestDetail = async () => {
    setIsLoading(true);
    try {
      const response = await getOneContestSubmission(id as string);
      if (response && response.data) {
        setContestDetail(response.data);
        if (response.data.resultCodeCombat) {
          const courses = mergeCourses(response.data.resultCodeCombat);
          setContestDetail((prevState) => {
            if (!prevState) return prevState;
            return {
              ...prevState,
              resultCodeCombat: courses,
            };
          });
        }
        const firstChar = get(
          response.data,
          "contest_entry.candidateNumber",
          ""
        ).charAt(0);
        if (firstChar === "A" || firstChar === "B" || firstChar === "C") {
          setIsShowCodeCombatCert(true);
        }
      } else {
        setContestDetail(null);
      }
    } catch (error) {
      setContestDetail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchContestDetail();
    if (contestDetail?.resultCodeCombat) {
      const courses = mergeCourses(contestDetail.resultCodeCombat);
      setContestDetail((prevState) => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          resultCodeCombat: courses,
        };
      });
    }
  }, [id]);
  const handleClickTag = (tag: string) => {
    // Store the tag in Zustand store
    setSelectedTag(tag);
    // Navigate to the all contest entries page
    // router.push("/tong-hop-bai-du-thi");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image
          src={"/image/contest/Hourglass.gif"}
          alt="loading gif"
          width={64}
          height={64}
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </div>
    );
  }

  if (!contestDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <EmptySearch
          buttonText="Trở về"
          message="Không tìm thấy bài thi"
          // onAction={() => router.push("/tong-hop-bai-du-thi")}
        />
      </div>
    );
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/tong-hop-bai-du-thi/${id}`;
  const shareTitle = contestDetail?.title || "Check out this contest entry!";
  const shareDescription =
    contestDetail?.description || "An amazing contest submission";
  const shareImage =
    contestDetail?.assets?.[selectedImageIndex]?.url ||
    `${process.env.NEXT_PUBLIC_BASE_URL}/image/contest/Saly-12.png`;

  return (
    <>
      <div className="min-h-[calc(100vh-64px)]">
        <div className="max-w-[720px] mx-auto mb-2 border-r border-l border-b border-gray-200 bg-white shadow-md">
          <div className="">
            <div className="flex justify-between items-center w-full px-8 ">
              <div className="h-12 mobile:h-16 flex items-center">
                <ArrowLeft
                  size={24}
                  onClick={() => router.back()}
                  className="cursor-pointer"
                />
                <span className="text-grey-500 text-sm font-medium ml-2 select-none max-mobile:hidden">
                  Quay lại
                </span>
              </div>
              {contestDetail.source && (
                <Button
                  outlined={true}
                  className="border border-gray-300 !rounded-[3rem] w-[168px] h-[40px]
               shadow-custom-gray flex items-center 
               max-mobile:w-[50px] max-mobile:h-[36px] max-mobile:rounded-[2rem]
               "
                >
                  <Download
                    className="mr-2 mb-1 max-mobile:mr-0"
                    size={17}
                    strokeWidth="2"
                  />
                  <a
                    className="text-SubheadSm text-primary-900"
                    href={contestDetail?.source?.[0]?.url}
                    target="_blank"
                  >
                    <div className="max-mobile:hidden">Tải xuống</div>
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-4">
              <section className="px-1">
                <header className="px-8 border-b border-grey-200 pb-4">
                  <p className="mb-3">
                    <span className="text-SubheadSm !font-medium mr-2">
                      {get(contestDetail, "contest_entry.user.fullName", "")}
                    </span>
                    <span className="text-grey-500 text-sm">
                      Số báo danh:{" "}
                      {get(contestDetail, "contest_entry.candidateNumber", "")}
                    </span>
                  </p>
                  <h1 className="text-SubheadLg text-grey-700 uppercase">
                    {contestDetail.title}
                  </h1>
                  <div className="py-2">
                    {contestDetail.tags?.map((tag, index) => (
                      <Tag
                        key={index}
                        text={tag}
                        className="mr-2 cursor-pointer"
                        size="medium"
                        type="secondary"
                        onClick={() => handleClickTag(tag)}
                      />
                    ))}
                  </div>
                </header>
                <div className="py-4 px-8 font-bold text-gray-800 text-lg">
                  {get(contestDetail, "title", "")}
                </div>
                <div
                  className="py-4 px-8 ql-viewer"
                  dangerouslySetInnerHTML={{
                    __html: contestDetail.description || "",
                  }}
                ></div>
                <div className="">
                  {contestDetail.url && (
                    <p className="px-8">
                      <span className="text-grey-500 text-sm">
                        Link bài thi:{" "}
                      </span>
                      <a
                        className="text-blue-500 text-sm "
                        target="_blank"
                        href={contestDetail.url}
                      >
                        {contestDetail.url}
                      </a>
                    </p>
                  )}
                </div>
                {isShowCodeCombatCert ? (
                  <>
                    {contestDetail.resultCodeCombat &&
                      contestDetail.resultCodeCombat?.length > 0 && (
                        <Carousel className="w-[85%] mx-auto h-full mb-8">
                          <CarouselContent className="m-0">
                            {contestDetail.resultCodeCombat?.map(
                              (item, index) => (
                                <CarouselItem key={index}>
                                  <Certificate
                                    name={contestDetail.title} //default with stage A, B, C title is fullName user
                                    progress={round(
                                      (item.currentLevel / item.totalLevel) *
                                        100,
                                      1
                                    )}
                                    course={item.name}
                                  />
                                </CarouselItem>
                              )
                            )}
                          </CarouselContent>

                          <CarouselPrevious className="mr-0 max-[450px]:hidden" />
                          <CarouselNext className="ml-0 max-[450px]:hidden" />
                        </Carousel>
                      )}
                  </>
                ) : (
                  <>
                    {contestDetail.thumbnail && (
                      <div className="w-full mx-auto pt-4 sm:px-8">
                        <div className="sm:block">
                          <AspectRatio ratio={16 / 9}>
                            {contestDetail.thumbnail.url && (
                              <div className="relative w-full h-full">
                                <ImageCustom
                                  src={contestDetail.thumbnail.url}
                                  alt={`Selected image for ${contestDetail.title}`}
                                  className="rounded-md object-contain"
                                  quality={80}
                                  fill
                                />
                              </div>
                            )}
                          </AspectRatio>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
          <hr />

          {/* share components */}
          <div className="py-4">
            <Dock
              direction="middle"
              className="m-0 mx-auto px-3 sm:flex border-none"
            >
              <DockIcon className="bg-black/10 dark:bg-white/10">
                <FacebookShareButton
                  url={shareUrl}
                  hashtag={contestDetail.tags?.map((tag) => `#${tag}`).join("")}
                  className="h-full w-full flex justify-center items-center"
                  about={shareTitle}
                  aria-description={shareDescription}
                  content={shareDescription}
                >
                  <Facebook size={16} />
                </FacebookShareButton>
              </DockIcon>
              <DockIcon className="bg-black/10 dark:bg-white/10">
                <TwitterShareButton
                  url={shareUrl}
                  title={shareTitle}
                  via="montek"
                  hashtags={contestDetail.tags?.map((tag) => `${tag}`)}
                  className="h-full w-full flex justify-center items-center"
                >
                  <Twitter size={16} />
                </TwitterShareButton>
              </DockIcon>
              <DockIcon className="bg-black/10 dark:bg-white/10">
                <TelegramShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="h-full w-full flex justify-center items-center"
                >
                  <Send size={16} className="!fill-none" />
                </TelegramShareButton>
              </DockIcon>
              <DockIcon className="bg-black/10 dark:bg-white/10">
                <EmailShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="h-full w-full flex justify-center items-center"
                >
                  <Mail size={16} />
                </EmailShareButton>
              </DockIcon>
            </Dock>
            {/* <div className="flex justify-center items-center mt-6 sm:hidden">
            <Button
              className="w-fit !bg-blue-600"
              onClick={() =>
                shareOnMobile({
                  text: shareDescription,
                  url: shareUrl,
                  title: shareTitle,
                })
              }
            >
              Chia sẻ
            </Button>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContestDetail;
