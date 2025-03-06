// "use client";
// import { useState, useEffect } from "react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/common/Button";
// import FormSubmitContest from "@/components/contest/FormSubmitContest";
// import { useRouter } from "next/navigation";
// import GroupStageGuard from "@/components/hoc/GroupStageGuard";
// import { ContestGroupStage, TProgressResult } from "@/types/common-types";
// import DateTimeDisplay from "@/components/contest/DateTimeDisplay";
// import { getOneContestEntry } from "@/requests/contestEntry";
// import { useUserStore } from "@/store/UserStore";
// import {
//   createContestSubmission,
//   getContestSubmissionByContestEntry,
// } from "@/requests/contestSubmit";
// import { getProgress } from "@/requests/code-combat";
// import { get } from "lodash";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const ContestGroupStageEntry = ({
//   contestGroupStage,
//   isSubmitted: isSubmitted,
// }: {
//   contestGroupStage: ContestGroupStage;
//   isSubmitted: boolean;
// }) => {
//   const router = useRouter();
//   //use state
//   const [timeOver, setTimeOver] = useState(false);
//   const [groupStageTimeLeft, setGroupStageTimeLeft] = useState<string>(
//     contestGroupStage.endTime
//   );
//   const [isClient, setIsClient] = useState(false);
//   const [progress, setProgress] = useState<TProgressResult[]>([]);
//   const [course, setCourse] = useState<string>("");
//   const [showResult, setShowResult] = useState({
//     currentLevel: 0,
//     totalLevel: 0,
//   });
//   const [showProgress, setShowProgress] = useState(false);
//   // use store
//   const candidateNumber = useUserStore((state) => state.candidateNumber);
//   const codeCombatId = useUserStore((state) => state.codeCombatId);
//   const fullNameUser = useUserStore((state) => state.userInfo?.fullName);
  
//   const handleTimeOver = (validCountDown: boolean) => {
//     setTimeOver(true);
    
//   };
//   // const handleRedirectToMyContest = async () => {
//   //   try {
//   //     if (!candidateNumber) return;
//   //     const contestEntry = await getOneContestEntry(candidateNumber);
//   //     const contestSubmission = await getContestSubmissionByContestEntry(
//   //       contestEntry.id
//   //     );
//   //     if (contestSubmission.data.length === 0) {
//   //       return;
//   //     }
//   //     router.push(`/tong-hop-bai-du-thi/${contestSubmission.data[0].id}`);
//   //   } catch (err) {
//   //     //console.error(err);
//   //     return;
//   //   }
//   // };

//   const handleGetProgress = async () => {
//     try {
//       const firstChar = candidateNumber?.charAt(0);
//       if (firstChar != "A" && firstChar != "B" && firstChar != "C") {
//         setShowProgress(false);
//         return;
//       }
//       setShowProgress(true);
//       if (!codeCombatId) return;
//       const res: any = await getProgress(
//         codeCombatId,
//         Number(get(contestGroupStage, "id", 0))
//       );
      
//       if (res) {
//         setProgress(res);
//       }
//     } catch (error) {
//       return;
//     }
//   };

//   useEffect(() => {
//     setIsClient(true);
//     //check if start time is less than current time
//     if (new Date(contestGroupStage.startTime) > new Date()) {
//       router.push("/");
//     }

//     handleGetProgress();
//     setGroupStageTimeLeft(contestGroupStage.endTime);
//   }, [isSubmitted]);

//   useEffect(() => {
//     if (!isSubmitted && !timeOver) {
//       const interval = setInterval(() => {
//         handleGetProgress();
//       }, 30000);

//       return () => clearInterval(interval);
//     }
//   }, [showResult.currentLevel, showResult.totalLevel]);
//   return (
//     isClient && (
//       <div className="min-h-screen max-w-[768px] mx-auto bg-white mb-10">
//         <Card className="max-w-4xl mx-auto p-0">
//           <CardContent className="p-0">
//             <div className="">
//               <div className="flex justify-between items-center h-[64px] px-8 py-5">
//                 <Button
//                   outlined={true}
//                   style={{ borderRadius: "4rem" }}
//                   className="w-[110px] h-[40px] rounded-[3rem] border"
//                   onClick={() => router.push("/")}
//                 >
//                   Quay lại
//                 </Button>
//                 {!isSubmitted && (
//                   <FormSubmitContest>
//                     <Button
//                       style={{ borderRadius: "4rem" }}
//                       className="w-[110px] h-[40px] rounded-[3rem]"
//                       disabled={timeOver || isSubmitted}
//                     >
//                       Nộp bài
//                     </Button>
//                   </FormSubmitContest>
//                 )}
//               </div>
//               <div className="w-full border-t border-gray-300 "></div>
//               <div className="flex justify-between items-center h-[48px] px-8">
//                 <div className="text-SubheadLg text-primary-900">
//                   BẢNG {contestGroupStage.code}
//                 </div>
//                 <div className="text-SubheadLg text-primary-900">
//                   {!timeOver
//                     ? contestGroupStage.endTime && (
//                         <>
//                         <DateTimeDisplay
//                             dataTime={groupStageTimeLeft}
//                             type="days"
//                           />
//                           <span>:</span>
//                           <DateTimeDisplay
//                             dataTime={groupStageTimeLeft}
//                             type="hours"
//                           />
//                           <span>:</span>
//                           <DateTimeDisplay
//                             dataTime={groupStageTimeLeft}
//                             type="minutes"
//                           />
//                           <span>:</span>
//                           <DateTimeDisplay
//                             dataTime={groupStageTimeLeft}
//                             type="seconds"
//                             onTimeOver={handleTimeOver}
//                           />
//                         </>
//                       )
//                     : "Hết giờ"}
//                 </div>
//               </div>
//               {showProgress && (
//                 <div className="flex justify-between items-center h-[56px] px-8 gap-x-1">
//                   <div className="text-gray-950 text-bodyLg flex items-center gap-x-3">
//                     {/* <div>Tiến trình</div> */}
//                     <Select
//                       value={course}
//                       onValueChange={(e) => {
//                         setCourse(e);
//                         const selectedCourse = progress.find(
//                           (item) => item.name === e
//                         );
//                         if (selectedCourse) {
//                           setShowResult({
//                             currentLevel: selectedCourse.currentLevel,
//                             totalLevel: selectedCourse.totalLevel,
//                           });
//                         }
//                       }}
//                     >
//                       <SelectTrigger className="w-[150px]">
//                         <SelectValue placeholder="Chọn khóa học" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectGroup className="bg-white">
//                           {progress.length &&
//                             progress.map(
//                               (item: TProgressResult, index: number) => {
//                                 return (
//                                   <>
//                                     <SelectItem key={index} value={item.name}>
//                                       <SelectLabel>{item.name}</SelectLabel>
//                                     </SelectItem>
//                                   </>
//                                 );
//                               }
//                             )}
//                         </SelectGroup>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="font-semibold">
//                     {showResult.currentLevel} / {showResult.totalLevel}
//                   </div>
//                 </div>
//               )}
//               <div
//                 className="bg-white overflow-hidden"
//                 style={{ height: "calc(100vh - 50px)" }}
//               >
//                 <iframe
//                   src={
//                     contestGroupStage?.contestEntryFile?.[0].url
//                       ? contestGroupStage?.contestEntryFile?.[0].url
//                       : "/pdf-test.pdf"
//                   }
//                   className="w-full h-full"
//                   title="Exam PDF"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   );
// };
// export default ContestGroupStageEntry;
"use client";
export default function Home() {
  return <div>Home</div>
}
