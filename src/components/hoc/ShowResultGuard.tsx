// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useUserStore } from "@/store/UserStore";
// import {
//   getContestGroupStageByCandidateNumber,
//   getOneContestEntry,
// } from "@/requests/contestEntry";
// import { ContestGroupStage, TListCourse } from "@/types/common-types";
// import { getProgress } from "@/requests/code-combat";
// import { get } from "lodash";

// export type TTimeContest = {
//   startTime: string;
//   endTime: string;
// }

// interface WrappedComponentProps {
//   resultData: TResultCodeCombatFinal[];
//   timeContest: TTimeContest
// }

// export type TResultCodeCombatFinal = {
//     slug: string;
//     playtime: number;
//     isCompleted: boolean;
// }

// const ShowResultGuard = (WrappedComponent: React.FC<WrappedComponentProps>) => {
//   const Comp: React.FC = (props) => {
//     const router = useRouter();
//     const [progress, setProgress] = useState<any>();
//     const [listCourse, setListCourse] = useState<TListCourse[]>();
//     const [result, setResult] = useState<TResultCodeCombatFinal[]>();
//     const [timeContest, setTimeContest] = useState<TTimeContest>();
//     //use state
    
//     //
//     const [contestGroupStage, setContestGroupStage] =
//       useState<ContestGroupStage | null>(null);

//     //use store
//     const candidateNumber = useUserStore((state) => state.candidateNumber);
//     const codeCombatId = useUserStore((state) => state.codeCombatId);

//     const fetchContestGroupStage = async () => {
//       if (!candidateNumber) {
//         router.push("/");
//         return;
//       }
//       try {
//         const data = await getContestGroupStageByCandidateNumber(
//           candidateNumber
//         );
//         data && setContestGroupStage(data);
//         data && setListCourse(data.listCourses);
//       } catch (error) {
//         return;
//       }
//     };

//     const handleGetProgress = async () => {
//         try {
//           const firstChar = candidateNumber?.charAt(0);
//           if(firstChar == "D") return;
//           if (!codeCombatId) return;
//           const res: any = await getProgress(
//             codeCombatId,
//             Number(get(contestGroupStage, "id", 6))
//           );
          
//           if (res) {
//             setProgress(res);
//           }
//         } catch (error) {
//           return;
//         }
//     };

//     function transformData(progress: any[], listcourse: any[]): TResultCodeCombatFinal[] {
//         const result: TResultCodeCombatFinal[] = [];
      
//         for (const course of listcourse) {
//           // Tìm thông tin progress tương ứng với course hiện tại
//           const courseProgress = progress.find(
//             (p) => p.courseId === course.courseId && p.courseInstanceId === course.courseInstanceId
//           );
      
//           // Tạo một Map từ listSlug của progress để dễ dàng tra cứu playtime
//           const playtimeMap = new Map<string, number>(
//             courseProgress?.listSlug.map((slugObj: { name: string; playtime: number }) => [
//               slugObj.name,
//               slugObj.playtime,
//             ])
//           );
      
//           // Lấy currentLevel từ progress để đánh dấu các slug đã hoàn thành
//           const currentLevel = courseProgress?.currentLevel || 0;
      
//           for (let i = 0; i < course.slugs.length; i++) {
//             const slug = course.slugs[i];
//             const playtime = playtimeMap.get(slug) || 0;
//             const isCompleted = i < currentLevel;
      
//             result.push({
//               slug,
//               playtime,
//               isCompleted,
//             });
//           }
//         }
      
//         return result;
//     }

//     const handleGetContestEntry = async () => {
//       try {
//         if(!candidateNumber) return;
//         const contestEntry = await getOneContestEntry(candidateNumber);
//         if(contestEntry) {
//           return contestEntry;
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     const handleGetTimeResultContest = async () => {
//       try {
//         const data = await handleGetContestEntry();
//         setTimeContest({
//           startTime: get(data, "startTime", ""),
//           endTime: get(data, "endTime", "")
//         })
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     const fetAllData = async () => {
//       await fetchContestGroupStage();
//       await handleGetProgress();
//       await handleGetTimeResultContest();
//     }
    
//     useEffect(() => {
//       fetAllData();
//     }, [candidateNumber]);

//     useEffect(() => {
//         if (listCourse && progress) {
//             const transformedResult = transformData(progress, listCourse);
//             setResult(transformedResult);
//         }
//     }, [listCourse, progress]);
//     // progress && console.log(progress);

//     if (contestGroupStage === null) {
//       return <div>Loading...</div>; // or any loading indicator
//     }
//     if (contestGroupStage.startTime > new Date().toISOString()) {
//       router.push("/");
//     }else if (result == null) {
//         return <div>Loading result ....</div>; // or any loading indicator
//     }
//      else
//       return (
//         <WrappedComponent
//           resultData={result}
//           timeContest={timeContest}
//         />
//       );
//   };

//   return Comp;
// };

// export default ShowResultGuard;
