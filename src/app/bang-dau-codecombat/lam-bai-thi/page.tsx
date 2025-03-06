"use client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContestGroupStage,
  TListCourse,
  TProgressResult,
} from "@/types/common-types";
import Link from "next/link";
import { Button } from "@/components/common/button/Button";
import DateTimeDisplay from "@/components/contest/DateTimeDisplay";
import { useCallback, useEffect, useState } from "react";
import { get, round, set } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getContestGroupStageByCandidateNumber,
  getOneContestEntry,
  updateEndTimeContestEntry,
} from "@/requests/contestEntry";
import {
  createContestSubmission,
  getContestSubmissionByContestEntry,
} from "@/requests/contestSubmit";
import { useUserStore } from "@/store/UserStore";
import { getProgress } from "@/requests/code-combat";
import { CheckCircle } from "lucide-react";
import _ from "lodash";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useRouter } from "next/navigation";
import GroupStageGuard from "@/components/hoc/GroupStageGuard";
import AuthFinalGuard from "@/components/hoc/AuthFinalGuard";
type TDialogSubmit = {
  isOpen: boolean;
  onClose: () => void;
  handleSubmid: () => void;
};

type TCourseRender = {
  slug: string;
  courseId: string;
  courseInstanceId: string;
  name: string;
};

const DialogAcceptSubmit = (data: TDialogSubmit) => {
  const handleSubmid = () => {
    data.handleSubmid();
    data.onClose();
  };
  return (
    <>
      <Dialog open={data.isOpen} onOpenChange={data.onClose}>
        <DialogContent
          className="sm:max-w-[480px] bg-white p-0"
          style={{ borderRadius: "16px" }}
        >
          <DialogHeader className="pt-6">
            <DialogTitle className="text-center text-SubheadLg text-primary-900 m-0 p-0">
              Xác nhận nộp bài
            </DialogTitle>
          </DialogHeader>
          <div className="w-full border-t border-gray-300 "></div>

          <div className="flex flex-col items-center justify-center h-[120px]">
            <div className="py-4 px-[33px]">
              <div className="text-gray-700 text-lg text-center">
                Mỗi thí sinh chỉ được nộp bài một lần duy nhất. Bạn không thể
                chỉnh sửa sau khi đã nộp bài. Bạn đã chắc chắn muốn nộp bài thi
                chưa?
              </div>
            </div>
          </div>
          <div className="w-full border-t border-gray-300 "></div>
          <DialogFooter className="p-0 m-0 pb-3">
            <div className="flex items-center justify-center gap-4 w-full">
              <Button
                outlined={true}
                className="w-[156px] h-[48px] !rounded-[3rem] border"
                onClick={data.onClose}
              >
                Quay lại
              </Button>
              <Button
                className="w-[156px] h-[48px] !rounded-[3rem]"
                onClick={handleSubmid}
              >
                Nộp bài
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const GroupStageCodeCombat = () => {
  const router = useRouter();
  //use state
  const [timeOver, setTimeOver] = useState(false);
  const [groupStageTimeLeft, setGroupStageTimeLeft] = useState<string>();
  const candidateNumber = useUserStore((state) => state.candidateNumber);
  const codeCombatId = useUserStore((state) => state.codeCombatId);

  const [progress, setProgress] = useState<number>(0);
  const [totalProgress, setTotalProgress] = useState<number>(0);
  const [diaLogOpen, setDialogOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState<TProgressResult[]>([]);
  const [listSlugs, setListSlugs] = useState<TCourseRender[]>([]);
  const [reloadProgress, setReloadProgress] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contestGroupStage, setContestGroupStage] =
    useState<ContestGroupStage>();
  //random a number 10000 - 20000
  const [randomTimeTofetch, setRandomTimeToFetch] = useState(
    Math.floor(Math.random() * 10000) + 10000
  );
  //use store
  const fullNameUser = useUserStore((state) => state.userInfo?.fullName);
  const [success, error, warn] = useSnackbarStore((state) => [
    state.success,
    state.error,
    state.warn,
  ]);

  //handle function
  const handleRedirectToCodeCombat = (data: TCourseRender) => {
    const url = `https://codecombat.com/play/level/${data.slug}?course=${data.courseId}&course-instance=${data.courseInstanceId}`;
    window.open(url, "_blank");
  };
  const isExistContestSubmission = async () => {
    if (!candidateNumber) return false;
    const contestEntry = await getOneContestEntry(candidateNumber);
    const contestSubmission = await getContestSubmissionByContestEntry(
      contestEntry.id
    );
    return contestSubmission.data.length > 0;
  };
  const handleAutoSubmit = async () => {
    try {
      //check if user already submitted => return
      useLoadingStore.getState().show();
      if ((await isExistContestSubmission()) || isSubmitted) {
        warn("Không thành công", "Bạn đã nộp bài rồi");
        return;
      }
      //check if contestGroupStage is not D1 or D2 => auto submit
      const firstChar = candidateNumber?.charAt(0);
      if (firstChar != "D") {
        const contestEntry = await getOneContestEntry(
          useUserStore.getState().candidateNumber || ""
        );
        //update endTime
        const endTime = new Date().toISOString();
        localStorage.setItem("endTime", endTime);
        await updateEndTimeContestEntry(contestEntry.id, endTime);
        const contestResult = {
          title: fullNameUser || "",
          tags: { data: ["codecombat"] },
          contest_entry: contestEntry.id,
          classIndex: get(contestGroupStage, "id", ""),
          memberId: codeCombatId || "",
          data: null,
        };
        await createContestSubmission(contestResult);
        success("xong", "Nộp bài thành công");
        useUserStore.setState({ isSubmitted: true });
        router.push(`/bang-dau-codecombat/nop-bai-thanh-cong`);
      }
      return;
    } catch (err) {
      //console.error(err);
      error("Lỗi", "Nộp bài không thành công");
      return;
    } finally {
      useLoadingStore.getState().hide();
    }
  };
  const handleGetProgress = useCallback(async () => {
    try {
      if (!contestGroupStage) return;
      const firstChar = candidateNumber?.charAt(0);
      if (firstChar == "D") return;
      if (!codeCombatId) return;
      const res = await getProgress(
        codeCombatId,
        Number(contestGroupStage.id)
        // Number(get(contestGroupStage, "id", 6))
      );

      if (res) {
        setCurrentResult(res);
        setReloadProgress(!reloadProgress);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [contestGroupStage]);

  const handleTimeOver = (validCountDown: boolean) => {
    setTimeOver(true);
    if (!isSubmitted && validCountDown) {
      handleAutoSubmit();
    }
  };
  const fetchContestGroupStage = async () => {
    if (!candidateNumber) {
      warn("Không thành công", "Vui lòng đăng nhập lại");
      router.push("/");
      return;
    }
    try {
      const data = await getContestGroupStageByCandidateNumber(candidateNumber);
      if (data) {
        setContestGroupStage(data);
        setGroupStageTimeLeft(data.endTime);
        if (data && data.listCourses) {
          setListSlugs(handleRenderSlugs(data.listCourses));
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // const handleRedirectToMyContest = async () => {
  //   try {
  //     if (!candidateNumber) return;
  //     const contestEntry = await getOneContestEntry(candidateNumber);
  //     const contestSubmission = await getContestSubmissionByContestEntry(
  //       contestEntry.id
  //     );
  //     if (contestSubmission.data.length === 0) {
  //       return;
  //     }
  //     router.push(`/tong-hop-bai-du-thi/${contestSubmission.data[0].id}`);
  //   } catch (err) {
  //     //console.error(err);
  //     return;
  //   }
  // };

  const handleRenderSlugs = (listCourse: TListCourse[]): TCourseRender[] => {
    return listCourse.flatMap((item) =>
      item.slugs.map((slug) => ({
        slug,
        courseId: item.courseId,
        courseInstanceId: item.courseInstanceId,
        name: item.name,
      }))
    );
  };
  const fetchAllData = async () => {
    await fetchContestGroupStage();
    // await handleGetProgress();
  };
  //use effect
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    let total = 0;
    let current = 0;
    currentResult &&
      currentResult.forEach((item: TProgressResult) => {
        total += item.totalLevel;
        current += item.currentLevel;
      });
    setTotalProgress(total);
    setProgress(current);
  }, [currentResult]);

  useEffect(() => {
    if (!isSubmitted && !timeOver) {
      const interval = setInterval(() => {
        handleGetProgress();
      }, randomTimeTofetch);

      return () => clearInterval(interval);
    }
  }, [isSubmitted, timeOver, contestGroupStage]);

  return (
    <AuthFinalGuard>
      <GroupStageGuard>
        {" "}
        {contestGroupStage ? (
          <div className="max-w-3xl mx-auto">
            <div
              className="text-[35px] text-center mb-12 mt-3 text-primary-700 font-dela 
            max-md:text-[30px] max-sm:text-[25px]
        "
            >
              Đề thi Chính thức Vòng Chung Kết Bảng{" "}
              {get(contestGroupStage, "code")}
            </div>
            <div className=" mx-auto border border-gray-300 rounded-xl space-y-6 bg-white mt-3 mb-3">
              <div className={``}>
                <div
                  className={`w-full flex item-center justify-between px-8 py-3`}
                >
                  <div></div>
                  {!isSubmitted && (
                    <Button
                      className={`!rounded-[3rem] w-[120px] h-[44px]`}
                      onClick={() => setDialogOpen(true)}
                      disabled={timeOver}
                    >
                      Nộp bài
                    </Button>
                  )}
                  <DialogAcceptSubmit
                    isOpen={diaLogOpen}
                    onClose={() => setDialogOpen(false)}
                    handleSubmid={handleAutoSubmit}
                  />
                </div>
                <div className={`border w-full border-gray-300`}></div>
                <div className="space-y-2 block">
                  <div className="flex justify-between items-center h-[48px] px-8">
                    <div className="text-SubheadLg text-primary-900">
                      BẢNG {get(contestGroupStage, "code")}
                    </div>
                    <div className="text-SubheadLg text-primary-900">
                      {!timeOver
                        ? contestGroupStage &&
                          groupStageTimeLeft && (
                            <>
                              <DateTimeDisplay
                                dataTime={groupStageTimeLeft}
                                type="hours"
                              />
                              <span>:</span>
                              <DateTimeDisplay
                                dataTime={groupStageTimeLeft}
                                type="minutes"
                              />
                              <span>:</span>
                              <DateTimeDisplay
                                dataTime={groupStageTimeLeft}
                                type="seconds"
                                onTimeOver={handleTimeOver}
                              />
                            </>
                          )
                        : "Hết giờ"}
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-primary-700 font-semibold max-md:hidden">
                      Tiến độ
                    </div>
                    <Progress
                      value={round(
                        (progress / (totalProgress != 0 ? totalProgress : 1)) *
                          100,
                        1
                      )}
                      className="h-3 bg-gray-100 w-3/4"
                    />
                    <div className="text-primary-700 font-semibold">
                      {progress}/{totalProgress != 0 ? totalProgress : 1}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`border border-gray-300 w-full`}></div>
              <div className="px-6 border-none">
                <div className="">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {Array.isArray(listSlugs) &&
                      listSlugs.map((item: TCourseRender, index: number) => {
                        //handle function check if slug is match with current slug
                        let isCompleted = false;
                        for (const result of currentResult) {
                          for (const slug of result.listSlug) {
                            if (slug.name === item.slug) {
                              isCompleted = true;
                              break;
                            }
                          }
                          if (isCompleted) break;
                        }
                        return (
                          <Button
                            key={index}
                            outlined={true}
                            className={`h-12 border font-bold text-lg hover:bg-primary-100
                    
                     `}
                            onClick={() => handleRedirectToCodeCombat(item)}
                            disabled={isSubmitted}
                          >
                            <div className={`flex items-center gap-x-3`}>
                              {isCompleted && (
                                <CheckCircle className="text-primary-900" />
                              )}
                              {!isCompleted && index + 1}
                            </div>
                          </Button>
                        );
                      })}
                  </div>

                  <div className="mt-6 mb-10 space-y-4 text-base text-gray-600 font-nutito">
                    <div className="!p-0 !m-0 custom_li">
                      • Hiện tại thí sinh đang ở{" "}
                      <span className="font-bold">Trang thi</span>
                    </div>
                    <div>• Các câu hỏi được sắp xếp theo độ khó tăng dần.</div>
                    <div>• Thí sinh nhấn vào từng thử thách để làm bài.</div>
                    <div>
                      • Mỗi câu hỏi sẽ mở ra thử thách CodeCombat tương ứng,
                      trong một tab mới. Thí sinh làm bài trong tab này.
                    </div>
                    <div>
                      • Khi làm xong 1 thử thách, thí sinh nhấn nút{" "}
                      <span className="font-bold"> Done </span>, đóng tab
                      CodeCombat, sau đó quay trở lại{" "}
                      <span className="font-bold"> Trang thi </span> để tiếp
                      tục.
                    </div>
                    <div>
                      • Tiến độ làm bài sẽ được cập nhật mỗi 01 phút ở{" "}
                      <span className="font-bold"> Trang thi </span>.
                    </div>
                    <div>
                      • Khi hoàn thành hết các thử thách, thí sinh nhấn nút{" "}
                      <span className="font-bold"> Nộp bài </span>.
                    </div>
                    <div>
                      • Trong trường hợp hết giờ mà thí sinh{" "}
                      <span className="text-red-500 font-bold"> chưa </span> ấn{" "}
                      <span className="font-bold"> Nộp bài, </span> hệ thống sẽ
                      tự động nộp bài, kết quả được ghi nhận ở thời điểm hết
                      giờ.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading . . .</div>
        )}
      </GroupStageGuard>
    </AuthFinalGuard>
  );
};

export default GroupStageCodeCombat;
