"use client";
import { Button } from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContestGroupStage } from "@/types/common-types";
import { useUserStore } from "@/store/UserStore";
import {
  getContestGroupStageByCandidateNumber,
  getOneContestEntry,
  updateContestEntry,
} from "@/requests/contestEntry";
import DateTimeDisplay from "@/components/contest/DateTimeDisplay";
import { get } from "lodash";
import Link from "next/link";
import GroupStageGuard from "@/components/hoc/GroupStageGuard";
import CheckContestStartGuard from "@/components/hoc/CheckContestStartGuard";

type TDialogAccept = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contestGroupStage: ContestGroupStage;
};

const DialogAccept = ({
  isOpen,
  onOpenChange,
  contestGroupStage,
}: TDialogAccept) => {
  const router = useRouter();
  const [isGroupStageStarted, setIsGroupStageStarted] = useState(false);
  const [isShowMessage, setIsShowMessage] = useState(false);

  //use store
  const candidateNumber = useUserStore((state) => state.candidateNumber);
  const handleGetContestEntry = async () => {
    try {
      if (!candidateNumber) return;
      const data = await getOneContestEntry(candidateNumber);
      if (data) {
        return data;
      }
      return undefined;
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateContestEntry = async () => {
    try {
      const entry = await handleGetContestEntry();
      if (!entry) return;
      if (entry.isContestStarted) return;
      const startTimeToStore = new Date().toISOString();
      localStorage.setItem("startTime", startTimeToStore);
      await updateContestEntry(entry.id, startTimeToStore, true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleExam = async () => {
    if (!isGroupStageStarted) {
      setIsShowMessage(true);
    } else {
      if (router) {
        await handleUpdateContestEntry();
        router.push(`/bang-dau-codecombat/lam-bai-thi`);
      }
    }
  };
  const handleTimeOver = () => {
    setIsGroupStageStarted(true);
  };
  useEffect(() => {
    const hasStarted = new Date(contestGroupStage.startTime) <= new Date();
    setIsGroupStageStarted(hasStarted);
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] bg-white p-0"
        style={{ borderRadius: "16px" }}
      >
        <DialogHeader className="pt-6">
          <DialogTitle className="text-center text-SubheadLg text-primary-900 m-0 p-0">
            Xác nhận làm bài
          </DialogTitle>
        </DialogHeader>
        <div className="w-full border-t border-gray-300 "></div>

        <div className="flex flex-col items-center justify-center h-[120px]">
          {isGroupStageStarted ? (
            <div className="py-4 px-[33px]">
              <div className="w-full px-3 text-center">
                Thí sinh chỉ được phép làm bài và nộp bài một lần duy nhất. Một
                khi đã nhấn nút &quot;Làm bài&quot;, thời gian sẽ tự động đếm
                ngược trong vòng 75 phút.
              </div>

              <div></div>
            </div>
          ) : (
            <>
              <div className="text-bodyLg">Mở cổng thi sau</div>
              <div className="text-gray-700">
                <span className="text-SubheadLg text-gray-950 flex items-center justify-center gap-x-2">
                  {
                    <DateTimeDisplay
                      dataTime={contestGroupStage.startTime}
                      type={"days"}
                    />
                  }{" "}
                  <span className="mt-1 text-bodyLg">Ngày</span>{" "}
                  {
                    <DateTimeDisplay
                      dataTime={contestGroupStage.startTime}
                      type={"hours"}
                    />
                  }{" "}
                  <span className="mt-1 text-bodyLg">Giờ</span>{" "}
                  {
                    <DateTimeDisplay
                      dataTime={contestGroupStage.startTime}
                      type={"minutes"}
                    />
                  }{" "}
                  <span className="mt-1 text-bodyLg">Phút</span>{" "}
                  {
                    <DateTimeDisplay
                      dataTime={contestGroupStage.startTime}
                      type={"seconds"}
                      onTimeOver={handleTimeOver}
                    />
                  }{" "}
                  <span className="mt-1 text-bodyLg">Giây</span>
                </span>
              </div>
              {isShowMessage && (
                <div className="text-bodyLg text-red-700 text-center">
                  Chưa đến giờ cuộc thi diễn ra, vui lòng truy cập sau bạn nhé!
                </div>
              )}
            </>
          )}
        </div>
        <div className="w-full border-t border-gray-300 "></div>
        <DialogFooter className="p-0 m-0 pb-3">
          <div className="flex items-center justify-center gap-4 w-full">
            <Button
              outlined={true}
              className="w-[156px] h-[48px] !rounded-[3rem] border"
              onClick={() => {
                onOpenChange(false);
                setIsShowMessage(false);
              }}
            >
              Quay lại
            </Button>
            {isGroupStageStarted && (
              <Button
                className="w-[156px] h-[48px] !rounded-[3rem]"
                onClick={handleExam}
              >
                Vào thi
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const GroupStageCodeCombatInfo = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const [contestGroupStage, setContestGroupStage] =
    useState<ContestGroupStage | null>(null);
  const candidateNumber = useUserStore((state) => state.candidateNumber);
  const email = useUserStore((state) => state.userInfo?.email);
  const fetchContestGroupStage = async () => {
    if (!candidateNumber) {
      router.push("/");
      return;
    }
    try {
      const data = await getContestGroupStageByCandidateNumber(candidateNumber);
      data && setContestGroupStage(data);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    fetchContestGroupStage();
  }, [candidateNumber]);
  return (
    <CheckContestStartGuard>
      <div className="max-w-[720px] mx-auto mb-2">
        <div
          className="text-[35px] text-center mb-12 mt-3 text-primary-700 font-dela 
      max-md:text-[30px] max-sm:text-[25px]
      "
        >
          Quy chế thi Vòng Chung Kết - Bảng A, B, C
        </div>
        <div className="mx-auto  bg-white border border-gray-300 rounded-2xl ">
          <div className="">
            <div className=" text-lg font-bold items-center text-primary-800 w-full h-[60px] py-3 px-8">
              <p>Vui lòng đọc thật kỹ Quy chế thi</p>
            </div>

            <div className={`border border-gray-300 w-full `}></div>
            <div className={`p-6 px-8`}>
              <div className="space-y-4 text-base font-normal">
                <p></p>

                <p>
                  1. Thí sinh tự đăng nhập vào{" "}
                  <Link
                    href={`https://codecombat.com/`}
                    target="_blank"
                    className="text-primary-800"
                  >
                    https://codecombat.com{" "}
                  </Link>
                  với email đăng ký dự thi là{" "}
                  <span className={`text-primary-800`}>{email}</span>.
                </p>
                <p>
                  2. Thí sinh tự chuẩn bị máy tính cá nhân có thể kết nối
                  Internet ổn định (có dây hoặc không dây) và hoạt động bình
                  thường.
                </p>

                <p>3. Thời gian làm bài là 75 phút.</p>

                <p>
                  4. Thí sinh chỉ được phép làm bài và nộp bài 1 lần duy nhất.
                </p>

                <p>
                  5. Thí sinh làm bài trực tiếp trên website
                  <Link
                    href="https://olympiad.tekmonk.edu.vn/"
                    target="_blank"
                    className="text-primary-800"
                  >
                    {" "}
                    olympiad.tekmonk.edu.vn.{" "}
                  </Link>{" "}
                  Website cuộc thi sẽ tự động điều hướng sang CodeCombat trong
                  tab mới. Thí sinh không trực tiếp mở CodeCombat khi chưa có sự
                  đồng ý của giám thị coi thi.
                </p>

                <p>
                  6. Thí sinh hoàn thành 30 thử thách theo yêu cầu của đề thi.
                  Thí sinh không bắt buộc hoàn thành các thử thách theo thứ tự.
                  Thí sinh có thể bỏ qua một vài thử thách để tiếp tục làm các
                  thử thách khác sao cho hoàn thành nhiều nhất có thể.
                </p>

                <p>
                  7. Tiến độ làm bài sẽ được cập nhật mỗi 1 phút và hiển thị
                  trên trang làm bài thi. Nếu thí sinh đã hoàn thiện thử thách
                  sau 5 phút mà tiến độ làm bài chưa được cập nhập, vui lòng
                  thông báo với giám thị coi thi tại khu vực.
                </p>

                <p>
                  8. Tiêu chí xếp hạng Vòng Quốc gia là thí sinh hoàn thiện
                  nhiều thử thách nhất trong thời gian ngắn nhất. Thời gian làm
                  bài của thí sinh được tính bằng tổng thời gian thực hiện thử
                  thách trên CodeCombat, không tính theo thời gian nộp bài.
                </p>

                <p>
                  9. Nếu thí sinh vô tình đóng cửa sổ hay thoát trang làm bài
                  thì, vui lòng truy cập lại vào trang làm bài thi, tiến độ làm
                  bài sẽ không bị ảnh hưởng.
                </p>

                <p>
                  10. Thí sinh không được quay, chụp, sao chép, in, chia sẻ hình
                  ảnh hay nội dung trang làm bài, đề thi trên website
                  <Link
                    href="https://olympiad.tekmonk.edu.vn/"
                    target="_blank"
                    className="text-primary-800"
                  >
                    {" "}
                    olympiad.tekmonk.edu.vn.{" "}
                  </Link>{" "}
                  hay thử thách trên CodeCombat.
                </p>

                <p className="">
                  11. Khi gặp vấn đề kỹ thuật hoặc có thắc mắc, vui lòng liên hệ
                  với giám thị khu vực.
                </p>
              </div>

              <div className="mt-8 space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-bold">
                    Quý phụ huynh và thí sinh xác nhận đã đọc kỹ thông tin về
                    giải đấu <span className={`text-red-500`}>*</span>
                  </div>
                </div>
                <RadioGroup className="pt-2">
                  <div
                    className="flex items-center space-x-3 hover:cursor-pointer group"
                    onClick={handleCheckboxChange}
                  >
                    <RadioGroupItem
                      value="1"
                      id="category-A"
                      checked={isChecked}
                      className="group-hover:border-primary-600"
                    />
                    <div className="text-base font-medium text-gray-900 cursor-pointer">
                      Tôi đã đọc kỹ quy chế thi Vòng Chung kết.
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className={`border border-gray-300 w-full `}></div>
            <div className="flex items-center justify-between h-[60px] py-3 px-8">
              <Button
                outlined={true}
                className=" w-[120px] h-[44px] !rounded-[3rem] border border-gray-300"
              >
                Quay lại
              </Button>
              <Button
                className=" bg-primary-600 h-[44px] w-[120px] !rounded-[3rem]"
                onClick={() => setIsOpen(true)}
                disabled={!isChecked}
              >
                Làm bài
              </Button>
              {contestGroupStage && (
                <DialogAccept
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                  contestGroupStage={contestGroupStage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </CheckContestStartGuard>
  );
};

export default GroupStageCodeCombatInfo;
