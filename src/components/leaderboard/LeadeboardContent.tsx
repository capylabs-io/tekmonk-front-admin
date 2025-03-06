import { LeaderboardTopUserCard } from "./LeaderboardTopUserCard";
import { LeaderboardTable } from "./LeaderboardTable";
import { useLeaderboardDatas } from "@/lib/hooks/useLeaderboardData";
import { get } from "lodash";

export const LeadeboardContent = () => {
  const leaderboardDatas = useLeaderboardDatas();
  const dataMockData = [
    {
      user: {
        username: 'Long',
        specialName: 'BÁ VƯƠNG HỌC ĐƯỜNG',
      },
      score: "20000"
    },
    {
      user: {
        username: 'Hải',
        specialName: 'BÁ VƯƠNG HỌC ĐƯỜNG',
      },
      score: "30000"
    },
    {
      user: {
        username: 'Phong',
        specialName: 'BÁ VƯƠNG HỌC ĐƯỜNG',
      },
      score: "10000"
    },
  ]
  return (
    <div>
      <div className="w-full flex justify-center items-center bg-[url('/image/leaderboard/leaderboard-banner.png')] bg-no-repeat bg-cover h-[400px] gap-x-12 pb-7">
        <LeaderboardTopUserCard
          customClassNames="mt-4"
          rank="second"
          name={dataMockData[1]?.user?.username ?? ""}
          specialName={get(dataMockData[1]?.user, "specialName", "")}
          score={dataMockData[1]?.score ?? 0}
          imageUrl={
            // dataMockData[1]?.user?.imageURL ??
            "bg-[url('/image/leaderboard/user1.png')]"
          }
        />

        <LeaderboardTopUserCard
          customClassNames="mb-4"

          rank="first"
          name={
            dataMockData[0]?.user?.username &&
            dataMockData[0]?.user?.username
          }
          specialName={dataMockData[0]?.user?.specialName}
          score={dataMockData[0]?.score}
          imageUrl={
            // dataMockData[0]?.user?.imageURL ??
            "bg-[url('/image/leaderboard/user3.png')]"
          }
        />
        <LeaderboardTopUserCard
          customClassNames="mt-4"
          rank="third"
          name={dataMockData[2]?.user?.username}
          specialName={dataMockData[1]?.user?.specialName}
          score={dataMockData[2]?.score}
          imageUrl={
            // dataMockData[2]?.user?.imageURL ??
            "bg-[url('/image/leaderboard/user2.png')]"
          }
        />
      </div>

      <LeaderboardTable data={dataMockData as any} />
    </div>
  );
};
