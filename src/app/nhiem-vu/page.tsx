"use client";
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { Dela_Gothic_One } from "next/font/google";
import { MissionCard } from "@/components/mission/MissionCard";
import WithAuth from "@/components/hoc/WithAuth";

const delaGothicOne = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-delo",
});

const Mission: React.FC = () => {
  return (
    <>
      <div className="text-xl text-primary-900 px-8">Nhiệm vụ</div>
      <Tabs defaultValue="mission" className="w-full mt-5">
        <TabsList className="w-full border-b border-gray-200">
          <TabsTrigger value="mission">Nhiệm vụ</TabsTrigger>
          <TabsTrigger value="achievement">Thành tựu</TabsTrigger>
        </TabsList>
        <TabsContent value="mission" className="overflow-y-auto mt-0">
          <div className="flex flex-wrap gap-6 px-[36px] py-6 items-start">
            <MissionCard
              imageUrl="/image/mission/achievement4.png"
              missionDescription="Hoàn thành 5 bài tập về nhà đúng hạn (1/5)"
              missionName="CHÚ ONG CHĂM CHỈ"
              score="10"
              status="inprogress"
            />
            <MissionCard
              imageUrl="/image/mission/achievement5.png"
              missionDescription="Hoàn thành 5 bài tập về nhà đúng hạn (1/5)"
              missionName="CHÚ ONG CHĂM CHỈ"
              score="10"
              status="inprogress"
            />
            <MissionCard
              imageUrl="/image/mission/achievement3.png"
              missionDescription="Hoàn thành 5 bài tập về nhà đúng hạn (1/5)"
              missionName="CHÚ ONG CHĂM CHỈ"
              score="10"
              status="inprogress"
            />
          </div>
        </TabsContent>
        <TabsContent
          value="achievement"
          className="overflow-y-auto mt-0"
        ></TabsContent>
      </Tabs>
    </>
  );
};

// export default WithAuth(Mission);
export default Mission;
