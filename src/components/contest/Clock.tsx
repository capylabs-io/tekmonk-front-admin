"use client";

import { memo, useEffect, useState } from "react";
import { CardContest } from "../common/CardContest";
import { Button } from "../common/button/Button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/UserStore";
import { Link as LinkToScroll } from "react-scroll";
import { getContestGroupStageByCandidateNumber } from "@/requests/contestEntry";
import GroupStageDialog from "./GroupStageDialog";
import { Contest, ContestGroupStage } from "@/types/common-types";
import DateTimeDisplay from "./DateTimeDisplay";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { CONTEST_QUESTION_AND_ANSWER } from "@/contants/contest/tekmonk";

type StateTime = {
  started: boolean;
  ended: boolean;
};

const Clock = ({ contestData }: { contestData: Contest }) => {
  const router = useRouter();
  //ENV
  const is_show_full = process.env.NEXT_PUBLIC_SHOW_FULL_CONTEST == "true";

  // => use state
  const [isContestStarted, setIsContestStarted] = useState<StateTime>({
    started: false,
    ended: false,
  });

  const [isGroupStageStarted, setIsGroupStageStarted] = useState<StateTime>({
    started: false,
    ended: false,
  });

  const [groupStage, setGroupStage] = useState<ContestGroupStage>();

  const [timeLeft, setTimeLeft] = useState<string>(contestData.startTime);
  const [textShowContest, setTextShowContest] = useState<string>(
    "Thời gian đăng ký bắt đầu sau:"
  );

  // => use store
  const isConnected = useUserStore((state) => state.isConnected);
  const candidateNumber = useUserStore((state) => state.candidateNumber);

  // => handle function

  const handleTimeOver = () => {
    if (!isContestStarted.started) {
      setIsContestStarted({ started: true, ended: false });
      setTextShowContest("Thời gian đăng ký kết thúc sau:");
      setTimeLeft(contestData.endTime);
      return;
    }
    if (!isContestStarted.ended) {
      setIsContestStarted({ started: true, ended: true });
      if (!groupStage && !isConnected()) {
        setTextShowContest("Đã hết thời gian đăng ký !");
        return;
      }
      if (groupStage && new Date() < new Date(groupStage.startTime)) {
        // có lẽ lỗi do contestGroupStageData chưa load kịp thì đã skip logic rồi => thêm isConnected()
        setTextShowContest("Cuộc thi sắp diễn ra! bắt đầu sau:");
        setTimeLeft(groupStage.startTime); // => gọi api bất chấp =>  holy sh*t => fix later
        return;
      }
      if (groupStage && !isGroupStageStarted.started) {
        setIsGroupStageStarted({ started: true, ended: false });
        setTextShowContest("Cuộc thi đang diễn ra! kết thúc sau:");
        setTimeLeft(groupStage.endTime);
        return;
      }
      if (groupStage && !isGroupStageStarted.ended) {
        setIsGroupStageStarted({ started: true, ended: true });
        setTextShowContest("Cuộc thi đã kết thúc!");
        return;
      }
    }
    //if user is not connected => return => fix later
  };

  const fetchContestGroupStageData = async () => {
    try {
      if (!candidateNumber) {
        return;
      }
      const response = await getContestGroupStageByCandidateNumber(
        candidateNumber
      );
      if (!response) {
        return;
      }
      setGroupStage(response);
      return;
    } catch (err) {
      console.error(err);
      return;
    }
  };

  useEffect(() => {
    fetchContestGroupStageData();
  }, [candidateNumber]);

  return (
    <div className="text-center mb-12">
      <TooltipProvider>
        <div
          className={`mt-[52px] w-[75%] mx-auto grid grid-cols-1
           items-center justify-center gap-y-4 gap-x-20 flex-col place-items-center
        `}
        >
          {/* {!isConnected() ? (
            <Button
              className="w-[312px] h-[52px] max-[460px]:w-[280px] rounded-[4rem]  shadow-custom-primary text-SubheadLg

              max-[460px]:text-[16px]
                max-[460px]:h-[50px]
              "
              outlined={false}
              onClick={() => router.push("register-contest")}
              disabled={!isContestStarted.started || isContestStarted.ended}
            >
              Đăng ký
            </Button>
          ) : (
            groupStage && <GroupStageDialog groupStageData={groupStage} />
          )} */}
          {groupStage && <GroupStageDialog groupStageData={groupStage} />}

          <LinkToScroll to="rules" smooth={true} duration={500}>
            <Button
              className="w-[312px] h-[52px] max-[460px]:w-[280px] border border-gray-200 shadow-custom-gray text-SubheadLg 
              max-[460px]:text-[16px]
                max-[460px]:h-[50px]
              
              "
              outlined={true}
            >
              Thể lệ
            </Button>
          </LinkToScroll>
        </div>

        <div className="mt-[52px] text-2xl font-bold text-gray-600 max-md:text-xl">
          {textShowContest}
        </div>

        <div className="mt-[26px] flex justify-center gap-4">
          {/* {timeLeftComponents.map(({ label, value }, index) => (
          <div key={index} className="flex flex-col items-center">
            <CardContest
              className=" w-[200px] h-[168px] flex flex-col items-center justify-center border border-gray-200 relative shadow-custom-gray bg-white
                        max-[865px]:w-[120px] max-[865px]:h-[120px] 
                        max-[545px]:w-[80px] max-[545px]:h-[80px] "
            >
              <div className="text-SubheadLg max-[865px]:text-sm max-[865px]:font-bold max-mobile:text-bodyXs text-gray-500">
                {label}
              </div>
              <div className="text-primary-700 font-dela max-[865px]:text-4xl max-mobile:text-2xl text-[64px]">
                {value !== undefined ? value.toString().padStart(2, "0") : "00"}
              </div>
            </CardContest>
          </div>
        ))} */}
          <div className="flex flex-col items-center">
            <CardContest
              className=" w-[200px] h-[168px] flex flex-col items-center justify-center border border-gray-200 relative shadow-custom-gray bg-white
                        max-[865px]:w-[120px] max-[865px]:h-[120px] 
                        max-[545px]:w-[80px] max-[545px]:h-[80px] "
            >
              <div className="text-SubheadLg max-[865px]:text-sm max-[865px]:font-bold max-mobile:text-bodyXs text-gray-500">
                NGÀY
              </div>
              <div className="text-primary-700 font-dela max-[865px]:text-4xl max-mobile:text-2xl text-[64px]">
                {timeLeft && (
                  <DateTimeDisplay dataTime={timeLeft} type={"days"} />
                )}
              </div>
            </CardContest>
          </div>

          <div className="flex flex-col items-center">
            <CardContest
              className=" w-[200px] h-[168px] flex flex-col items-center justify-center border border-gray-200 relative shadow-custom-gray bg-white
                        max-[865px]:w-[120px] max-[865px]:h-[120px] 
                        max-[545px]:w-[80px] max-[545px]:h-[80px] "
            >
              <div className="text-SubheadLg max-[865px]:text-sm max-[865px]:font-bold max-mobile:text-bodyXs text-gray-500">
                GIỜ
              </div>
              <div className="text-primary-700 font-dela max-[865px]:text-4xl max-mobile:text-2xl text-[64px]">
                {timeLeft && (
                  <DateTimeDisplay dataTime={timeLeft} type={"hours"} />
                )}
              </div>
            </CardContest>
          </div>

          <div className="flex flex-col items-center">
            <CardContest
              className=" w-[200px] h-[168px] flex flex-col items-center justify-center border border-gray-200 relative shadow-custom-gray bg-white
                        max-[865px]:w-[120px] max-[865px]:h-[120px] 
                        max-[545px]:w-[80px] max-[545px]:h-[80px] "
            >
              <div className="text-SubheadLg max-[865px]:text-sm max-[865px]:font-bold max-mobile:text-bodyXs text-gray-500">
                PHÚT
              </div>
              <div className="text-primary-700 font-dela max-[865px]:text-4xl max-mobile:text-2xl text-[64px]">
                {timeLeft && (
                  <DateTimeDisplay dataTime={timeLeft} type={"minutes"} />
                )}
              </div>
            </CardContest>
          </div>

          <div className="flex flex-col items-center">
            <CardContest
              className=" w-[200px] h-[168px] flex flex-col items-center justify-center border border-gray-200 relative shadow-custom-gray bg-white
                        max-[865px]:w-[120px] max-[865px]:h-[120px] 
                        max-[545px]:w-[80px] max-[545px]:h-[80px] "
            >
              <div className="text-SubheadLg max-[865px]:text-sm max-[865px]:font-bold max-mobile:text-bodyXs text-gray-500">
                GIÂY
              </div>
              <div className="text-primary-700 font-dela max-[865px]:text-4xl max-mobile:text-2xl text-[64px]">
                {timeLeft && (
                  <DateTimeDisplay
                    dataTime={timeLeft}
                    type={"seconds"}
                    onTimeOver={handleTimeOver}
                  />
                )}
              </div>
            </CardContest>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default memo(Clock);
