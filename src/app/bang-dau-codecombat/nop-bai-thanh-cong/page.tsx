"use client";

import { Button } from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock9, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { divide, get } from "lodash";
import {
  getContestGroupStageByCandidateNumber,
  getOneContestEntry,
} from "@/requests/contestEntry";
import { useUserStore } from "@/store/UserStore";
import { ContestGroupStage, TListCourse } from "@/types/common-types";
import { getResultSearchContestSubmisson } from "@/requests/contest-submission";
import qs from "qs";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { getContestSubmissionByContestEntry } from "@/requests/contestSubmit";
import AuthFinalGuard from "@/components/hoc/AuthFinalGuard";
import Image from "next/image";

export type TTimeContest = {
  startTime: string;
  endTime: string;
};

export type TResultCodeCombatFinal = {
  slug: string;
  playtime: number;
  isCompleted: boolean;
};

const TableResult = ({ data }: { data: TResultCodeCombatFinal[] }) => {
  return (
    <div className="container mx-auto mt-4 overflow-auto !min-h-[calc(100%-295px-16px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%] text-center text-SubheadMd">
              Câu hỏi
            </TableHead>
            <TableHead className="w-[55%] text-left text-SubheadMd">
              Trạng thái
            </TableHead>
            <TableHead className="w-[30%] text-right text-SubheadMd">
              Thời gian làm câu hỏi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index: number) => (
            <TableRow key={index}>
              <TableCell className=" text-center text-bodyLg">
                {index + 1}
              </TableCell>
              <TableCell className="text-left">
                {row.isCompleted ? (
                  <div className="text-bodyLg flex gap-x-2">
                    <Image
                      src={"/image/contest/completed.png"}
                      alt=""
                      width={16}
                      height={16}
                    />
                    <div>Hoàn thành</div>
                  </div>
                ) : (
                  <div className="text-bodyLg text-red-700 flex gap-x-2">
                    <Image
                      src={"/image/contest/failed.png"}
                      alt=""
                      width={16}
                      height={16}
                    />
                    <div>Chưa hoàn thành</div>
                  </div>
                )}
              </TableCell>
              <TableCell className="md:table-cell text-right">
                {row.isCompleted ? (
                  <div className="text-SubheadM">
                    <div className="font-bold">
                      {row.playtime} <span className="font-normal">(s)</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-700">--</div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function NopBaiThanhCong() {
  const router = useRouter();
  //use state
  const [totalTime, setTotalTime] = useState<number>(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [totalNotCompleted, setTotalNotCompleted] = useState<number>(0);
  const [progress, setProgress] = useState<any>();
  const [listCourse, setListCourse] = useState<TListCourse[]>();
  const [result, setResult] = useState<TResultCodeCombatFinal[]>();
  const [timeContest, setTimeContest] = useState<TTimeContest>();
  const [contestGroupStage, setContestGroupStage] =
    useState<ContestGroupStage | null>(null);

  //use store
  const candidateNumber = useUserStore((state) => state.candidateNumber);
  const codeCombatId = useUserStore((state) => state.codeCombatId);
  const warning = useSnackbarStore((state) => state.warn);

  const fetchContestGroupStage = async () => {
    if (!candidateNumber) {
      warning(
        "Không thành công",
        "Không tìm thấy số báo danh, vui lòng đăng nhập lại"
      );
      router.push("/");
      return;
    }
    try {
      const data = await getContestGroupStageByCandidateNumber(candidateNumber);
      data && setContestGroupStage(data);
      data && setListCourse(data.listCourses);
    } catch (error) {
      return;
    }
  };

  const isExistContestSubmission = async () => {
    if (!candidateNumber) return false;
    const contestEntry = await getOneContestEntry(candidateNumber);
    const contestSubmission = await getContestSubmissionByContestEntry(
      contestEntry.id
    );
    return contestSubmission.data.length > 0;
  };

  const handleGetContestSubmission = async () => {
    try {
      const query = {
        filters: {
          contest_entry: {
            candidateNumber: { $eq: candidateNumber },
          },
        },
      };
      const result = await getResultSearchContestSubmisson(
        qs.stringify(query, { encodeValuesOnly: true })
      );
      if (result) {
        setProgress(result[0].resultCodeCombat);
        return result;
      }
      warning("Không tìm thấy dữ liệu", "Vui lòng thử lại sau");
      router.push("/");
      return;
    } catch (error) {
      console.error(error);
    }
  };

  // const handleGetProgress = async () => {
  //     try {
  //       const firstChar = candidateNumber?.charAt(0);
  //       if(firstChar == "D") return;
  //       if (!codeCombatId) return;
  //       const res: any = await getProgress(
  //         codeCombatId,
  //         Number(get(contestGroupStage, "id", 6))
  //       );

  //       if (res) {
  //         setProgress(res);
  //       }
  //     } catch (error) {
  //       return;
  //     }
  // };

  const transformData = (
    progress: any[],
    listcourse: any[]
  ): TResultCodeCombatFinal[] => {
    const result: TResultCodeCombatFinal[] = [];
    for (const course of listcourse) {
      // Tìm thông tin progress tương ứng với course hiện tại
      const courseProgress = progress.find(
        (p) =>
          p.courseId === course.courseId &&
          p.courseInstanceId === course.courseInstanceId
      );

      // Tạo một Map từ listSlug của progress để dễ dàng tra cứu playtime
      const playtimeMap = new Map<string, number>(
        courseProgress?.listSlug.map(
          (slugObj: { name: string; playtime: number }) => [
            slugObj.name,
            slugObj.playtime,
          ]
        )
      );
      // Lấy currentLevel từ progress để đánh dấu các slug đã hoàn thành
      const currentLevel = courseProgress?.currentLevel || 0;
      console.log("currentLevel", currentLevel);

      for (let i = 0; i < course.slugs.length; i++) {
        const slug = course.slugs[i];
        const playtime = playtimeMap.get(slug) || 0;
        const isCompleted = playtime > 0;

        result.push({
          slug,
          playtime,
          isCompleted,
        });
      }
    }
    return result;
  };

  const handleGetContestEntry = async () => {
    try {
      if (!candidateNumber) return;
      const contestEntry = await getOneContestEntry(candidateNumber);
      if (contestEntry) {
        return contestEntry;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleGetTimeResultContest = async () => {
    try {
      const localStartTime = localStorage.getItem("startTime");
      console.log("localStartTime", localStartTime);
      const data = await handleGetContestEntry();
      const startTime = new Date(
        data?.startTime || localStartTime || ""
      ).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const endTime = new Date(get(data, "endTime", "")).toLocaleTimeString(
        "en-GB",
        { hour: "2-digit", minute: "2-digit", second: "2-digit" }
      );
      setTimeContest({
        startTime,
        endTime,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetAllData = async () => {
    const checkIsSubmited = await isExistContestSubmission();
    if (!checkIsSubmited) {
      warning("Không thành công", "Bạn chưa nộp bài thi");
      router.push("/");
    }
    await handleGetContestSubmission();
    await fetchContestGroupStage();
    // await handleGetProgress();
    await handleGetTimeResultContest();
  };

  useEffect(() => {
    fetAllData();
  }, [candidateNumber]);

  useEffect(() => {
    if (listCourse && progress) {
      const transformedResult = transformData(progress, listCourse);
      setResult(transformedResult);
    }
  }, [listCourse, progress]);

  useEffect(() => {
    if (!result) return;
    const totalTime = result.reduce((acc, curr) => {
      return acc + curr.playtime;
    }, 0);
    setTotalTime(totalTime);
    const totalCompleted = result.filter((item) => item.isCompleted).length;
    setTotalCompleted(totalCompleted);
    const totalNotCompleted = result.filter((item) => !item.isCompleted).length;
    setTotalNotCompleted(totalNotCompleted);
  }, [result]);
  return (
    <AuthFinalGuard>
      {result && (
        <>
          <div className="h-full w-full max-md:p-2 py-4">
            <div className="md:w-[720px] h-full bg-white border border-gray-300 rounded-2xl mx-auto flex flex-col justify-between">
              <div className="w-full border-b border-b-gray-300 h-16 text-SubheadLg text-primary-900 px-8 pt-5">
                Nộp bài thành công
              </div>
              <div className="text-center w-full flex flex-col h-[calc(100%-64px-64px)] overflow-y-auto">
                <div className="flex flex-col gap-y-6 p-5 border-b border-gray-300">
                  <div className="text-xl text-[rgb(42,43,43)] text-SubheadXl mt-[14px]">
                    Thành tích của bạn
                  </div>
                  <div className="w-full h-[120px] rounded-lg grid grid-cols-3 gap-x-3">
                    <div className="flex flex-col items-center justify-center border border-gray-300 rounded-2xl px-3">
                      <Image
                        src={"/image/contest/completed.png"}
                        alt=""
                        width={32}
                        height={32}
                      />
                      <div className="text-bodyMd text-gray-500 mt-2">
                        Số câu đã làm
                      </div>
                      <div className="text-SubheadLg">{totalCompleted}</div>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-gray-300 rounded-2xl px-3">
                      <Image
                        src={"/image/contest/failed.png"}
                        alt=""
                        width={32}
                        height={32}
                      />
                      <div className="text-bodyMd text-gray-500 mt-2">
                        Số câu chưa làm
                      </div>
                      <div className="text-SubheadLg">{totalNotCompleted}</div>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-gray-300 rounded-2xl px-3">
                      <Image
                        src={"/image/contest/time_cc.png"}
                        alt=""
                        width={32}
                        height={32}
                      />
                      <div className="text-bodyMd text-gray-500 mt-2">
                        Thời gian thi trên Codecombat
                      </div>
                      <div className="text-SubheadLg">{totalTime} s</div>
                    </div>
                  </div>
                  <div className="flex w-[90%]">
                    {/* <div>Thời gian bắt đầu làm bài: </div>
                  <div className="font-bold">{timeContest?.startTime}</div> */}
                    <div className="flex flex-col items-start">
                      <div className="text-bodyMd text-gray-500">
                        Thời gian bắt đầu làm bài:
                      </div>
                      <div className="text-SubheadMd font-bold">
                        {timeContest?.startTime}
                      </div>
                    </div>
                    <div className="flex flex-col items-start ml-[62px]">
                      <div className="text-bodyMd text-gray-500">
                        Thời gian hoàn thành bài thi:
                      </div>
                      <div className="text-SubheadMd font-bold">
                        {timeContest?.endTime}
                      </div>
                    </div>
                  </div>
                </div>
                <TableResult data={result} />
              </div>
              <div className="w-full h-16 border-t border-gray-300 flex justify-between items-center px-14 max-tabletHeader:px-8 max-mobile:px-1">
                <Button
                  outlined={true}
                  className="border border-gray-300 h-10 !rounded-[3rem] max-tabletHeader:p-1 mx-auto"
                  onClick={() => router.push("/")}
                >
                  Quay lại trang chủ
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </AuthFinalGuard>
  );
}
