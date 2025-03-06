"use client";
import { Button } from "@/components/common/button/Button";
import {
  Dialog,
  DialogContent,
  DialogContentNoClose,
  DialogDescription,
  DialogTrigger,
} from "@/components/common/Dialog";
import { DataContestSubmission } from "@/types/contestSubmit";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/contest/InputField";
import {
  createContestSubmission,
  getContestSubmissionByContestEntry,
  uploadAssets,
  uploadSource,
  uploadThumbnail,
} from "@/requests/contestSubmit";
import { InputFileUploadContest } from "@/components/contest/InputFileUploadContest";
import { InputImgUploadContest } from "@/components/contest/InputImgUploadContest";
import { DialogTitle } from "@radix-ui/react-dialog";
import { InputMulImgUploadContest } from "./InputMulImgUploadContest";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/UserStore";
import {
  getContestGroupStageByCandidateNumber,
  getOneContestEntry,
} from "@/requests/contestEntry";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useLoadingStore } from "@/store/LoadingStore";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { getProgress } from "@/requests/code-combat";
import { get } from "lodash";
import { InputTags } from "./InputTags";
import { ContestGroupStage } from "@/types/common-types";

const submissionSchema = z.object({
  title: z
    .string({ required_error: "Tên dự án không được để trống" })
    .min(1, "Tên dự án phải có ít nhất 1 ký tự"),
  tags: z
    .string()
    // .regex(
    //   /^\s*([a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿđĐ\s]+)(\s*,\s*[a-zA-Z0-9ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿđĐ\s]+)*\s*$/,
    //   'Tags phải được phân tách bằng dấu phẩy, không chứa ký tự đặc biệt'
    // )
    .optional(), // Cho phép bỏ trống // Đánh dấu là tùy chọn
  url: z.string(),
  description: z.string().min(1, "Mô tả không được để trống"),
});

const FormSubmitContest = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  const SIZE_FILE_LIMIT = parseInt(
    process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "100"
  );
  const router = useRouter();
  //use state
  // const [progress, setProgress] = useState({
  //   currentProgress: 0,
  //   totalProgress: 1
  // });
  const [isOpen, setIsOpen] = useState(false);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [imgProject, setImgProject] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [canSubmitZipFile, setCanSubmitZipFile] = useState(false);
  const [showDialogAccept, setShowDialogAccept] = useState(false);
  const [contestGroupStage, setContestGroupStage] =
    useState<ContestGroupStage>();
  //use store
  const candidateNumber = useUserStore((state) => state.candidateNumber);
  const fullNameUser = useUserStore((state) => state.userInfo?.fullName);
  const codeCombatId = useUserStore((state) => state.codeCombatId);

  const { success, error, warn } = useSnackbarStore();

  //define form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: "",
      tags: "",
      url: "",
      description: "",
    },
  });

  //handle function
  const handleGetProgress = async () => {
    try {
      if (canSubmitZipFile) return;
      if (!codeCombatId || !candidateNumber) {
        return;
      }
      const data = await getContestGroupStageByCandidateNumber(candidateNumber);
      if (!data) {
        return;
      }
      setContestGroupStage(data);
      const res = await getProgress(codeCombatId, Number(get(data, "id", 0)));
      // if (res) {
      //   setProgress(res);
      // }
    } catch (error) {
      return;
    }
  };
  const isExistContestSubmission = async () => {
    const contestEntry = await getOneContestEntry(
      useUserStore.getState().candidateNumber || ""
    );
    const contestSubmission = await getContestSubmissionByContestEntry(
      contestEntry.id
    );
    return contestSubmission.data.length > 0;
  };

  const onSubmit = async (data: any) => {
    try {
      if (!projectFile) {
        warn("Không thành công", "Vui lòng tải lên file dự án!");
        closeDialog();
        return;
      }

      if (projectFile && projectFile.size > SIZE_FILE_LIMIT * 1024 * 1024) {
        warn(
          "Không thành công",
          `Dung lượng file dự án không được vượt quá ${SIZE_FILE_LIMIT}MB!`
        );
        closeDialog();
        return;
      }

      if (await isExistContestSubmission()) {
        warn("Không thành công", "Bạn đã nộp bài thi rồi!");
        closeDialog();
        return;
      }

      // warn("Warning", "Vui lòng chờ trong giây lát...\n không load lại trình duyệt");
      closeDialog();
      useLoadingStore.getState().show();

      const tags = data.tags.split(",").map((tag: string) => tag.trim());

      const contestEntry = await getOneContestEntry(
        useUserStore.getState().candidateNumber || ""
      );

      const contestObj: DataContestSubmission = {
        title: canSubmitZipFile ? data.title : fullNameUser || "",
        description: data.description,
        tags: { data: tags },
        url: data.url,
        contest_entry: contestEntry.id,
        classIndex: get(contestGroupStage, "id", ""),
        memberId: codeCombatId != "" ? codeCombatId : null,
        data: null,
      };

      const result = await createContestSubmission(contestObj);

      const uploadPromises = [];

      if (projectFile) {
        uploadPromises.push(uploadSource(result.id, projectFile));
      }

      if (thumbnail) {
        uploadPromises.push(uploadThumbnail(result.id, thumbnail));
      }

      uploadPromises.push(
        ...imgProject.map((img) => uploadAssets(result.id, img))
      );

      await Promise.all(uploadPromises);

      success("Xong", "Nộp bài thi thành công!");
      useUserStore.setState({ isSubmitted: true });
      router.push("/");
    } catch (err) {
      error("Lỗi", "Có lỗi xảy ra khi nộp bài thi");
    } finally {
      useLoadingStore.getState().hide();
    }
  };

  const closeDialog = () => {
    // warn("Warning", "Bạn đã nộp bài thi rồi!");
    setIsOpen(false);
  };

  const handleFileChange = (file: File | null) => {
    setProjectFile(file);
  };

  const handleImgChange = (newImages: File[]) => {
    setImgProject(newImages);
  };

  const onValueTagChange = (value: string) => {
    setValue("tags", value);
  };
  useEffect(() => {
    //if candidate number is null, redirect to home page
    if (!candidateNumber) {
      router.push("/");
    }
    const firstChar = candidateNumber?.charAt(0);
    console.log("firstChar", firstChar);
    if (firstChar != "A" && firstChar != "B" && firstChar != "C") {
      setCanSubmitZipFile(true);
    } else {
      setCanSubmitZipFile(false);
      setValue("title", fullNameUser || "user");
    }
    handleGetProgress();
  }, [candidateNumber, canSubmitZipFile]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div ref={ref} onClick={() => setIsOpen(true)}>
          {children}
        </div>
      </DialogTrigger>
      <DialogTitle className="hidden">Nộp bài thi</DialogTitle>
      <DialogDescription className="hidden">
        Lưu ý: Mỗi thí sinh chỉ được nộp bài thi một lần. Bài dự thi không thể
        xoá hoặc chỉnh sửa sau khi đã nộp. Vui lòng kiểm tra kĩ trước khi đăng
        tải.
      </DialogDescription>
      <DialogContent aria-describedby="dialog-description"></DialogContent>
      <DialogContentNoClose
        className="max-w-[688px] sm:rounded-[32px] max-mobile:overflow-y-auto pt-2 pb-0 max-h-screen overflow-y-auto flex flex-col"
        aria-describedby="dialog-description"
      >
        <div id="dialog-description" className="sr-only">
          Form để nộp bài thi cuộc thi. Bao gồm các trường thông tin như tên dự
          án, ảnh thumbnail, ảnh mô tả, file dự án, URL, tags, và mô tả.
        </div>
        <div className="px-2 sm:px-14 text-center">
          <h4 className="text-SubheadXl text-primary-900 mb-1 md:text-xl sm:text-lg text-base">
            Nộp bài thi
          </h4>
          <p className="text-bodyXl sm:text-bodyLg w-full mt-1 mb-2 sm:mb-5 md:text-base sm:text-sm text-xs">
            Lưu ý: Mỗi thí sinh chỉ được nộp bài thi một lần. Bài dự thi không
            thể xoá hoặc chỉnh sửa sau khi đã nộp. Vui lòng kiểm tra kĩ trước
            khi đăng tải.
          </p>
        </div>
        <section className="px-6 h-full overflow-y-auto hide-scrollbar">
          {canSubmitZipFile ? (
            <>
              <InputField
                title="Tên dự án"
                type="text"
                name="title"
                isRequired
                control={control}
                error={errors.title?.message}
                customClassNames="mb-2 sm:mb-5"
                placeholder="VD: Chatbot Miracle"
              />
            </>
          ) : (
            <>
              <div
                className={`mb-2 flex flex-wrap sm:flex-nowrap items-center`}
              >
                <label className="text-SubheadSm text-primary-950 w-1/4">
                  Tên dự án
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex w-full max-w-[500px] rounded-xl overflow-hidden gap-x-1">
                  Bài dự thi của:{" "}
                  <span className="font-bold">{fullNameUser}</span>
                </div>
              </div>
            </>
          )}
          <div className="w-full pb-2 sm:pb-5">
            {canSubmitZipFile && (
              <InputImgUploadContest
                title="Ảnh dự án"
                value={thumbnail}
                onChange={setThumbnail}
                customClassNames="mt-b "
              />
            )}

            {canSubmitZipFile && (
              <InputFileUploadContest
                title="Hồ sơ dự án"
                onChange={handleFileChange}
                value={projectFile}
              />
            )}
          </div>
          <div className="flex flex-col gap-[18px]">
            {/* <InputField
              title="Tags"
              type="text"
              name="tags"
              isRequired
              isTooltip
              tooltipContent="Tags phải được phân tách bởi dấu phẩy và không có khoảng trắng thừa"
              control={control}
              error={errors.tags?.message}
              placeholder="VD: B2C, AI, design...."
            /> */}

            <InputTags
              error={errors.tags?.message}
              onValueChange={onValueTagChange}
              isTooltip={true}
              isRequired
              // tooltipContent="Để nhập một tag, hãy viết tên tag sau đó ấn enter trên bàn phím"
              tooltipContent="Thí sinh bổ sung thêm tag để có thể tìm kiếm bài dự thi của mình dễ dàng hơn!"
            />

            <InputField
              title="Mô tả"
              name="description"
              control={control}
              error={errors.description?.message}
              type="text-area"
              isRequired
              customClassNames="transition-all ease-linear min-h-[100px]"
              placeholder="- Mô tả ngắn gọn về dự án                                                                    
                          - Đính kèm link Youtube hoặc Google Drive của video thuyết trình"
            />
          </div>
        </section>
        <footer className="flex flex-wrap items-center sm:justify-between p-2 pb-4 pt-0 gap-1 sm:px-6 justify-center">
          <Button
            className="rounded-[4rem] border border-gray-300 sm:w-[280px]"
            outlined={true}
            style={{ borderRadius: "4rem" }}
            onClick={closeDialog}
          >
            Huỷ
          </Button>
          <Dialog open={showDialogAccept} onOpenChange={setShowDialogAccept}>
            <DialogTrigger>
              <Button
                className="w-[260px]"
                outlined={false}
                style={{ borderRadius: "4rem" }}
                // onClick={handleSubmit(onSubmit)}
              >
                Nộp bài
              </Button>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <div className="text-SubheadLg text-primary-900 mx-auto">
                  Xác nhận nộp bài
                </div>
              </DialogHeader>
              <div className="w-full border-t border-gray-300"></div>
              <div className="px-6 py-4 text-xl text-gray-700">
                Mỗi thí sinh chỉ được nộp bài một lần duy nhất. Bạn không thể
                chỉnh sửa bài thi sau khi đã nộp bài. Bạn đã chắc chắn muốn nộp
                bài thi chưa?{" "}
              </div>
              <div className="w-full border-t border-gray-300"></div>
              <DialogFooter>
                <div className="w-full flex justify-center items-center gap-x-3">
                  <Button
                    outlined={true}
                    className="w-[156px] border border-gray-300 !rounded-[3rem]"
                    onClick={() => {
                      setShowDialogAccept(false);
                    }}
                  >
                    Quay lại
                  </Button>
                  <Button
                    className="w-[156px] !rounded-[3rem]"
                    onClick={async () => {
                      const isValid = await trigger();
                      if (isValid) {
                        setShowDialogAccept(false);
                        await handleSubmit(onSubmit)();
                      }
                      setShowDialogAccept(false);
                    }}
                  >
                    Xác nhận
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </footer>
      </DialogContentNoClose>
    </Dialog>
  );
});

FormSubmitContest.displayName = "SubmitContestDialog";

export default FormSubmitContest;
