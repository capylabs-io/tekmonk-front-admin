"use client";
import { Button } from "../common/button/Button";
import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContestGroupStage } from "@/types/common-types";
import DateTimeDisplay from "./DateTimeDisplay";
import { useUserStore } from "@/store/UserStore";
import { getOneContestEntry } from "@/requests/contestEntry";
import { getContestSubmissionByContestEntry } from "@/requests/contestSubmit";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useLoadingStore } from "@/store/LoadingStore";

const GroupStageDialog = ({
  groupStageData,
}: {
  groupStageData: ContestGroupStage;
}) => {
  //import others
  const router = useRouter();

  //useState
  const [isClient, setIsClient] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isShowButtonResult, setIsShowButtonResult] = useState(false);
  const [isAccountForFinal, setIsAccountForFinal] = useState(false);

  //use store
  const candidateNumber = useUserStore((state) => state.candidateNumber);
  const data = useUserStore((state) => state.userInfo?.data);
  const warning = useSnackbarStore((state) => state.warn);
  const getMe = useUserStore((state) => state.getMe);
  const [isShowing, show, hide] = useLoadingStore((state) => [
    state.isShowing,
    state.show,
    state.hide,
  ]);
  //arrow function

  const redirectGroupStageCodeCombat = () => {
    if (!data) {
      warning(
        "Không thành công",
        "Tài khoản của bạn không thuộc vòng chung kết"
      );
      router.push("/");
      return;
    }
    if (router) {
      router.push(`/bang-dau-codecombat`);
    }
  };

  const checkExistContestSubmission = async () => {
    if (!candidateNumber) {
      router.push("/");
      return;
    }
    const contestEntry = await getOneContestEntry(candidateNumber);
    const contestSubmission = await getContestSubmissionByContestEntry(
      contestEntry.id
    );
    setIsSubmitted(contestSubmission.data.length > 0);
    return contestSubmission.data.length > 0;
  };

  const checkShowButtonResult = async () => {
    try {
      show();
      await getMe();
      if (!data) {
        router.push("/");
        return;
      }
      setIsAccountForFinal(true);
      const checkIsSubmited = await checkExistContestSubmission();
      if (checkIsSubmited) {
        setIsShowButtonResult(true);
      }
    } catch (error) {
      warning("Không thành công", "Lỗi lấy dữ liệu cho cuộc thi");
      console.error(error);
    } finally {
      hide();
    }
  };

  const fetchAll = async () => {
    await checkShowButtonResult();
  };

  useEffect(() => {
    fetchAll();
    setIsClient(true);
  }, [groupStageData.startTime]);
  isShowButtonResult && console.log("isShowButtonResult", isShowButtonResult);
  return (
    isClient &&
    isAccountForFinal && (
      <>
        <>
          {!isSubmitted && (
            <Button
              className="w-[312px] h-[52px] max-[460px]:w-[280px] rounded-[4rem] shadow-custom-primary text-SubheadLg 
            max-[460px]:text-[16px]
              max-[460px]:h-[50px]
            "
              outlined={false}
              onClick={redirectGroupStageCodeCombat}
            >
              Vào thi Chung kết
            </Button>
          )}

          {isShowButtonResult && (
            <Button
              className="w-[312px] h-[52px] max-[460px]:w-[280px] rounded-[4rem] shadow-custom-primary text-SubheadLg 
            max-[460px]:text-[16px]
              max-[460px]:h-[50px]
            "
              outlined={false}
              onClick={() =>
                router.push("/bang-dau-codecombat/nop-bai-thanh-cong")
              }
            >
              Xem kết quả thi
            </Button>
          )}
        </>
      </>
    )
  );
};

export default memo(GroupStageDialog);
