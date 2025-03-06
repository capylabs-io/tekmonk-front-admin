"use client";
import React, { use, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Post } from "@/components/home/Post";
import WithAuth from "@/components/hoc/WithAuth";
import { useRouter } from "next/navigation";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { CreateProfileModal } from "@/components/home/CreateProfileModal";

const Home = () => {
  //set for contest page
  const router = useCustomRouter();
  return (
    <>
      <div className="text-xl text-primary-900 px-8">Trang chủ</div>
      <Tabs defaultValue="all" className="w-full mt-5">
        <TabsList className="w-full border-b border-gray-200">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="play">Sân chơi</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="overflow-y-auto">
          <Post
            imageUrl="bg-[url('/image/home/profile-pic.png')]"
            thumbnailUrl="/image/new/new-pic.png"
            userName="Andy Lou"
            specialName="Bá Vương Học Đường"
            userRank={
              <span
                className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
              >
                IV
              </span>
            }
            createdAt="23s"
            likedCount="6.2"
            commentCount="61"
          />
          <hr className="border-t border-gray-200 my-4" />
          <Post
            imageUrl="bg-[url('/image/user/profile-pic-2.png')]"
            thumbnailUrl="/image/new/new-pic-2.png"
            userName="Lauren Linh"
            specialName="Học Bá Thanh Xuân"
            userRank={
              <span
                className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
              >
                IV
              </span>
            }
            createdAt="23s"
            likedCount="6.2"
            commentCount="61"
          />
          <hr className="border-t border-gray-200 my-4" />
          <Post
            imageUrl="bg-[url('/image/user/profile-pic-2.png')]"
            thumbnailUrl="/image/new/new-pic-2.png"
            userName="Lauren Linh"
            specialName="Học Bá Thanh Xuân"
            userRank={
              <span
                className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
              >
                V
              </span>
            }
            createdAt="23s"
            likedCount="6.2"
            commentCount="61"
          />
        </TabsContent>
        <TabsContent value="play" className="overflow-y-auto">
          Play
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Home;
