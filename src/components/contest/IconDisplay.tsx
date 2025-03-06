"use client";
import { LAYERS } from "@/contants/layer";
import Image from "next/image";

export const IconDisPlay = () => {
  return (
    <>
      <div className="">
        <Image
          src="/image/contest/Saly-12.png"
          alt="Stylized mobile phone"
          width={360}
          height={360}
          className={`absolute top-16 -left-[20%] -z-[${LAYERS.ICON_CONTEST}]
                     max-md:w-[200px]
                     max-md:-left-[25%]
                     `}
          style={{
            transform: `translateY(${scrollY * 0.9}px)`,
          }}
        />

        <Image
          src="/image/contest/Saly-43.png"
          alt="Cartoon rocket"
          width={360}
          height={360}
          className={`absolute top-16 -right-[30%] -z-[${LAYERS.ICON_CONTEST}]
                    max-md:w-[200px]
                     max-md:-right-[25%]`}
          style={{
            transform: `translateY(${scrollY * 0.9}px)`,
          }}
        />

        <Image
          src="/image/contest/gold.png"
          alt="gold"
          width={184}
          height={184}
          className={`absolute top-[600px] -left-[20%] -z-[${LAYERS.ICON_CONTEST}]`}
          style={{
            transform: `translateY(${scrollY * 0.8}px)`,
          }}
        />

        <Image
          src="/image/contest/img.png"
          alt="fire"
          width={272}
          height={272}
          className={`absolute top-[700px] -right-[20%] -z-[${LAYERS.ICON_CONTEST}]`}
          style={{
            transform: `translateY(${scrollY * 0.8}px)`,
          }}
        />

        <Image
          src="/image/contest/Group-10.png"
          alt="decor"
          width={60}
          height={77}
          className={`absolute top-10 -z-[${LAYERS.ICON_CONTEST}] max-md:hidden`}
          style={{
            transform: `translateY(${scrollY * 0.8}px)`,
          }}
        />
        <Image
          src="/image/contest/Group-11.png"
          alt="Cartoon rocket"
          width={60}
          height={53}
          className={`absolute top-0 right-[40%] -z-[${LAYERS.ICON_CONTEST}]`}
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />
        <Image
          src="/image/contest/Group-12.png"
          alt="Cartoon rocket"
          width={120}
          height={114}
          sizes="auto"
          className={`absolute top-10 right-0 -z-[${LAYERS.ICON_CONTEST}] max-md:hidden`}
          style={{
            transform: `translateY(${scrollY * 0.8}px)`,
          }}
        />
      </div>
    </>
  );
};
