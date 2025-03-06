"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { Navbar } from "@/components/common/Navbar";
import { ChevronRight, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import DotPattern from "@/components/ui/dot-pattern";
import { LAYERS } from "@/contants/layer";
import { BannerCard } from "@/components/new/BannerCard";
import { LandingFooter } from "@/components/new/NewsFooter";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import Link from "next/link";

type TCourseSection = {
  title: string;
  description: string;
  imageSrc: string;
  connectSrc: string;
  state?: boolean;
};

const listReview = [
  "/image/profile/avatar-x2.png",
  "/image/profile/avatar-x2.png",
  "/image/profile/avatar-x2.png",
  "/image/profile/avatar-x2.png",
  "/image/profile/avatar-x2.png",
];

const accordionData = [
  {
    title: "Sáng tạo",
    content:
      "Tại TekMonk, chúng tôi khuyến khích mọi người vượt ra ngoài vùng an toàn của mình để thử nghiệm những ý tưởng mới, dù là khác biệt và chưa từng có tiền lệ. Chúng tôi không ngừng cải tiến sản phẩm và dịch vụ để mang lại giá trị tốt nhất cho học viên, đối tác, nhà đầu tư và cộng đồng.",
  },
  {
    title: "Dũng cảm",
    content: "Content for Dũng cảm section...",
  },
  {
    title: "Năng động",
    content: "Content for Năng động section...",
  },
  {
    title: "Tư duy",
    content: "Content for Tư duy section...",
  },
];

const CoreValueComponent = () => {
  return (
    <div className="w-full min-h-[912px] flex flex-col items-center justify-center gap-12 p-2 bg-gray-10">
      <div className="flex flex-col items-center gap-2">
        <Heart size={25} color="#BC4CAC" fill="#BC4CAC" />
        <div className="text-DisplayXs text-[#320130]">Giá trị cốt lõi</div>
      </div>
      <div className="grid lg:grid-cols-2 grid-col-1 gap-8 items-start w-full">
        <div className="w-full space-y-2">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="space-y-4 w-full"
          >
            {accordionData.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-2xl bg-white shadow-sm w-full px-6"
              >
                <AccordionTrigger className="hover:no-underline group h-20 w-full">
                  <div className="flex items-center gap-3">
                    <Zap
                      className="w-8 h-8 rounded-[100px] bg-primary-60"
                      color="#BC4CAC"
                      fill="#ffffff"
                    />
                    <span className="text-gray-95 !text-HeadingSm">
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2 !text-BodyLg text-gray-95">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {/* <div className="bg-[url('/image/landing/demo1.png')] lg:w-1/2 w-full h-full rounded-2xl bg-cover bg-no-repeat"></div> */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src="/image/landing/demo1.png"
            alt="Students learning"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
};

const CourseSection = ({
  imageSrc,
  connectSrc,
  title,
  description,
  state = true,
}: TCourseSection) => {
  return (
    <div className="w-full min-h-[512px] grid grid-cols-1 lg:grid-cols-2 items-center relative">
      {/* Text Section - Always First on Mobile */}
      <div
        className={cn(
          "flex flex-col gap-4 mx-auto z-20 order-1",
          state ? "lg:order-1" : "lg:order-2"
        )}
      >
        <Zap
          className="w-16 h-16 rounded-[100px] bg-primary-60"
          color="#BC4CAC"
          fill="#ffffff"
        />
        <div className="text-HeadingMd text-gray-95">{title}</div>
        <div className="text-BodyLg text-gray-60">{description}</div>
      </div>

      {/* Image Section - Ordered Dynamically */}
      <Image
        src={imageSrc}
        alt=""
        width={424}
        height={318}
        className={cn(
          "object-cover mx-auto z-20 rounded-[100%] order-2",
          state ? "lg:order-2" : "lg:order-1"
        )}
      />

      {/* Background Connection Image (Optional) */}
      {connectSrc && (
        <Image
          alt=""
          src={connectSrc}
          width={527}
          height={364}
          className="absolute -bottom-1/2 left-1/2 transform -translate-x-1/2 z-0 lg:block hidden"
        />
      )}
    </div>
  );
};

const AboutCourseComponent = () => {
  return (
    <div className="w-full min-h-[2236px] flex flex-col items-center justify-start py-4 px-8">
      <div className="flex flex-col items-center gap-2">
        <Heart size={25} color="#BC4CAC" fill="#BC4CAC" />
        <div className="text-DisplayXs text-[#320130] text-center">
          Sự đặc biệt của khóa học
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col items-center justify-start lg:gap-20 gap-14">
        <CourseSection
          imageSrc="/image/landing/course1.png"
          connectSrc="/image/landing/connect1.png"
          title="Game hoá quá trình học tập"
          description="Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
        />
        <CourseSection
          imageSrc="/image/landing/course2.png"
          connectSrc="/image/landing/connect2.png"
          title="Bài giảng được thiết kế trực quan"
          description="Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
          state={false}
        />
        <CourseSection
          imageSrc="/image/landing/course3.png"
          connectSrc="/image/landing/connect3.png"
          title="Thế giới quan độc đáo của từng học viên"
          description="Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
        />
        <CourseSection
          imageSrc="/image/landing/course4.png"
          connectSrc=""
          title="Đồng hành cùng con trong quá trình học"
          description="Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos."
          state={false}
        />
      </div>
    </div>
  );
};

const ImageIntroduce = () => {
  return (
    <div className="w-full min-h-[912px] flex flex-col items-center justify-center gap-12 bg-[#F5F4F5]">
      <div className="flex flex-col items-center gap-2">
        <Heart size={25} color="#BC4CAC" fill="#BC4CAC" />
        <div className="text-DisplayXs text-[#320130] max-w-[579px] text-center">
          Vì một thế hệ trẻ năng động với công nghệ
        </div>
      </div>
      <div className="w-full h-[512px] flex flex-col">
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover className="[--duration:20s]">
            {listReview.map((review) => (
              <Image
                key={review}
                alt=""
                src={review}
                width={400}
                height={248}
                className="rounded-[8px]"
              />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {listReview.map((review) => (
              <Image
                key={review}
                alt=""
                src={review}
                width={400}
                height={248}
                className="rounded-[8px]"
              />
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

const ReviewFromCommunity = () => {
  return (
    <div className="w-full min-h-[600px] flex flex-col items-center justify-center lg:gap-24 gap-10 relative">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(200%_circle_at_center,white,transparent)]",
          `absolute top-0 h-full z-[${LAYERS.BACKGROUND_1}]`
        )}
      />
      <div className="flex flex-col items-center gap-2 z-0">
        <MessageCircle size={25} color="#BC4CAC" fill="#BC4CAC" />
        <div className="text-DisplayXs text-[#320130] text-center">
          Lời khen ngợi từ cộng đồng
        </div>
      </div>
      <Marquee pauseOnHover className="[--duration:20s] w-full z-0 bg-white">
        {listReview.map((review) => (
          <div
            key={review}
            className="lg:w-[560px] w-[320px] h-[256px] border-[2px] border-gray-30 rounded-3xl flex flex-col "
            style={{
              boxShadow: "0px 8px 0px #DDD0DD",
            }}
          >
            <div className="flex items-center gap-4 p-4">
              <Image
                alt=""
                src="/image/profile/avatar-x2.png"
                width={48}
                height={48}
                className="rounded-[100%]"
              />
              <div className="flex flex-col gap-2">
                <div className="text-lg leading-[24px] font-medium">
                  Chị Minh Tâm
                </div>
                <div className="text-sm leading-[20px] font-normal text-gray-50">
                  Mẹ cháu Gia Khang (10 tuổi)
                </div>
              </div>
            </div>
            <div className="lg:p-4 px-4 text-gray-95 text-BodyMd text-ellipsis h-[120px] overflow-hidden">
              Tôi rất tin tưởng khi cho con học tại Tekmonk. Mặc dù sợ rằng con
              sẽ chơi game và dùng máy tính vào mục đích ngoài học tập nhưng con
              rất tự giác. Tôi thấy con thực sự đam mê với môn học này. Gia đình
              không ép buộc con phải học ngành nào mà muốn tự con trải nghiệm.
              Những gì học được ở Tekmonk là cơ hội để định hướng tương lai của
              con. Tôi rất tin tưởng khi cho con học tại Tekmonk. Mặc dù sợ rằng
              con sẽ chơi game và dùng máy tính vào mục đích ngoài học tập nhưng
              con rất tự giác. Tôi thấy con thực sự đam mê với môn học này. Gia
              đình không ép buộc con phải học ngành nào mà muốn tự con trải
              nghiệm. Những gì học được ở Tekmonk là cơ hội để định hướng tương
              lai của con.
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

const BannerBottom = () => {
  return (
    <div className="overflow-hidden w-full h-[560px] relative">
      <div className="bg-[url('/image/contest/Frame-43.png')] h-full bg-cover bg-no-repeat flex flex-col items-center justify-center gap-9 overflow-hidden ">
        <div className="absolute left-0 top-0 w-full h-full bg-black bg-opacity-50 mix-blend-multiply" />
        <div className="text-gray-10 sm:text-DisplayMd text-DisplayXs text-center max-w-[500px] z-10 p-2">
          Phát triển cùng chúng tôi
        </div>
        <div className="flex flex-col items-center gap-7 z-10">
          <CommonButton
            className="text-white border-[2px] w-[203px] h-[52px]"
            childrenClassName="flex items-center justify-center gap-2"
          >
            <Link href={ROUTE.HOME}>Khám phá ngay</Link>
            <ChevronRight size={24} color="#ffffff" className="mt-1" />
          </CommonButton>
        </div>
      </div>
      {/* Show icon, character here */}
    </div>
  );
};

export default function Page() {
  const router = useCustomRouter();
  const handleRedirectMainPage = () => {
    router.push(`${ROUTE.HOME}`);
  };
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] mt-16 container mx-auto flex flex-col items-center justify-center">
        <div className="overflow-hidden w-full h-[560px] relative">
          <BannerCard>
            <div className="text-gray-10 lg:text-DisplayXl md:text-DisplayLg sm:text-DisplayMd text-DisplayXs text-center max-w-[800px] z-10 p-2">
              Vui chơi, sáng tạo và kết nối cộng đồng
            </div>
            <div className="flex flex-col items-center gap-7 z-10">
              <div className="text-center text-gray-10 md:text-HeadingSm text-HeadingXs">
                Được tin dùng bởi hơn 1 triệu phụ huynh và học sinh tại Việt Nam
              </div>
              <CommonButton
                className="text-white border-[2px] w-[175px] h-[52px]"
                onClick={handleRedirectMainPage}
              >
                Khám phá ngay
              </CommonButton>
            </div>
          </BannerCard>
        </div>
        <CoreValueComponent />
        <AboutCourseComponent />
        <ImageIntroduce />
        <ReviewFromCommunity />
        <BannerBottom />
        <LandingFooter />
      </div>
    </>
  );
}
