"use client";
import { ArrowLeft, MessageCircle, Share } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/hooks/useProject";
import { Project } from "@/types/common-types";
import WithAuth from "@/components/hoc/WithAuth";

const Page: React.FC = () => {
  const projects: Project[] = useProjects();
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  return (
    <div className="mt-3">
      <div className="text-primary-900 flex gap-x-2 px-6 items-center">
        <ArrowLeft
          size={24}
          className="text-gray-600"
          onClick={() => router.back()}
        />
      </div>
      <div className="mt-8 flex flex-wrap gap-x-2 items-center px-6">
        {projects &&
          projects[0]?.projectCategories.map((category, index) => {
            return (
              <div
                key={index}
                className="px-2 py-1 text-black text-xs bg-primary-100 rounded-3xl"
              >
                {category}
              </div>
            );
          })}
      </div>
      <div className="mt-3 px-6">
        <div>
          <p className="text-SubheadLg text-gray-800">
            DỰ ÁN GAME INTO THE BREACH
          </p>
          <p className="text-base text-gray-800">
            Đây là một dự án game mà mình tự code trong 3 tháng bằng Unity dựa
            trên game Fortnite mà cháu hay chơi. Mong nhận được sự ủng hộ của
            mọi người
          </p>
        </div>
        <Image
          src="/image/new/new-pic.png"
          alt="thumbnail"
          height={340}
          width={604}
          className="rounded-xl w-full mt-3"
        />
        <div className="flex gap-3 mt-2">
          {projects[0]?.imageUrls.map((image, index) => {
            return (
              <Image
                key={index}
                src={image}
                alt="thumbnail"
                height={148}
                width={212}
                className="rounded-xl w-full"
              />
            );
          })}
        </div>

        {/* <div className="bg-[url('/image/new/new-pic.png')] bg-no-repeat bg-cover h-[340px] rounded-xl" /> */}
        <div className="mt-3 flex gap-x-20">
          <div
            className={classNames(
              "flex items-center gap-x-1 font-bold ",
              liked ? "text-red-500" : "text-gray-500"
            )}
          >
            <button onClick={() => setLiked((prev) => !prev)}>
              <Image
                src="/image/new/selected.png"
                alt="liked"
                width={20}
                height={20}
              />
            </button>
            {/* <Heart size={24}  /> */}
            <span>6.2K</span>
          </div>
          <div className="flex items-center gap-x-1 font-bold text-gray-500">
            <button>
              <MessageCircle size={20} />
            </button>
            <span>61</span>
          </div>
          <Share size={20} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default WithAuth(Page);
