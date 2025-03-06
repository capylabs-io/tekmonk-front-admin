"use client";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/common/button/Button";
import { ArrowRight } from "lucide-react";
import { LandingCard } from "@/components/landing/LandingCard";
import { useRouter } from "next/navigation";
import { Dela_Gothic_One } from "next/font/google";
import localFont from "next/font/local";

const delaGothicOne = localFont({
  src: "../.././assets/fonts/DelaGothicOne-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-dela",
});

function Landing() {
  const router = useRouter();
  const handleOnClick = () => {
    router.push("/home");
  };
  return (
    <>
      <nav className="w-full flex justify-between p-4">
        <Image
          src="/image/app-logo.png"
          alt="app logo"
          width={159}
          height={32}
        />
      </nav>
      <div className="w-full relative flex justify-center bg-[url('/image/landing/landing-banner.png')] bg-no-repeat bg-cover max-h-[300px]">
        <Image
          src="/image/landing/left-banner-pic.png"
          alt="left banner"
          className="absolute left-0 mt-32"
          width={280}
          height={200}
        />
        <Image
          src="/image/landing/right-banner-pic.png"
          alt="right banner"
          className="absolute right-0 mt-32"
          width={280}
          height={200}
        />
        <div className="z-50 flex flex-col items-center mt-[210px]">
          <Image
            src="/image/landing/text-logo.png"
            alt="right banner"
            width={390}
            height={129}
          />
          <div className={`text-2xl text-gray-500 ${delaGothicOne.className}`}>
            HỌC VIỆN CỦA NHỮNG GIẤC MƠ
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center gap-x-8 mt-28">
        <LandingCard
          imageUrl="/image/landing/landing-pic-1.png"
          title="cửa hàng"
          subTitle="Cá nhân hoá hồ sơ của bản thân với những phụ kiện đặc sắc chỉ có tại TekDojo"
          name="left"
        />
        <LandingCard
          imageUrl="/image/landing/landing-pic-2.png"
          title="xếp hạng"
          subTitle="Vinh danh những code thủ tay to nhất tại TekMonk và TekDojo"
          name="middle"
        />
        <LandingCard
          imageUrl="/image/landing/landing-pic-3.png"
          title="phòng lab"
          subTitle="Chia sẻ và trải nghiệm các sản phẩm với tất cả đồng môn ở TekDojo"
          name="right"
        />
      </div>
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleOnClick}
          className="uppercase px-8 !rounded-3xl text-sm"
          iconElement={
            <div className="ml-2">
              <ArrowRight size={16} className="text-white" />
            </div>
          }
        >
          Đến Trang Chủ
        </Button>
      </div>
    </>
  );
}

export default Landing;
