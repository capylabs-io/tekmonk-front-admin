"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLoadingStore } from "@/store/LoadingStore";
import { Button } from "@/components/common/button/Button";
import { Input } from "@/components/common/Input";
import { z } from "zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "qs";
import { getResultSearchContestSubmisson } from "@/requests/contest-submission";
import { first, get } from "lodash";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { ROUTE } from "@/contants/router";

type TSearchResultsProps = {
  id?: number;
  QualifiedExam: boolean | null;
  fullName: string;
  contest_group_stage: string;
  category: string;
  group_member: string[];
  title?: string;
  description?: string;
  score?: string;
  topUser?: string;
};

const phoneRegex = /^(\+84|0)\d{9,10}$/;
const candidateNumberRegex = /^(A|B|C|D\d{1})-\d{10}$/;
const searchResultScheme = z.object({
  candidateNumber: z
    .string({ required_error: "Số báo danh không được để trống" })
    .regex(candidateNumberRegex, "Vui lòng nhập chính xác số báo danh"),
  phoneNumber: z
    .string({ required_error: "Số điện thoại của phụ huynh là bắt buộc" })
    .regex(phoneRegex, "Số điện thoại không hợp lệ"),
});

export default function SearchResults() {
  const router = useRouter();
  //define state
  const method = useForm({
    resolver: zodResolver(searchResultScheme),
    mode: "onChange",
    defaultValues: {
      candidateNumber: "",
      phoneNumber: "",
    },
  });

  //use state
  const [searchResults, setSearchResults] = useState<any | undefined>(
    undefined
  );
  const [showResult, setShowResult] = useState<TSearchResultsProps>({
    id: undefined,
    QualifiedExam: null,
    fullName: "",
    contest_group_stage: "",
    category: "",
    group_member: [],
    title: undefined,
    description: undefined,
    score: undefined,
    topUser: undefined,
  });

  //use store
  const [hideLoading, showLoading, loading] = useLoadingStore((state) => [
    state.hide,
    state.show,
    state.isShowing,
  ]);

  //onClick functions
  const handleSearch = async (data: any) => {
    showLoading();
    try {
      showLoading();
      const query = {
        filters: {
          contest_entry: {
            candidateNumber: { $eq: data.candidateNumber },
            user: {
              parentPhoneNumber: { $eq: data.phoneNumber },
            },
          },
        },
        populate: {
          contest_entry: {
            populate: {
              user: true,
            },
          },
        },
      };
      const result = await getResultSearchContestSubmisson(
        qs.stringify(query, { encodeValuesOnly: true })
      );
      console.log(result);
      if (result && first(result)) {
        console.log(first(result));
        setSearchResults(first(result));
        hideLoading();
      } else {
        console.log("No result");
        setSearchResults(null);
        hideLoading();
      }
    } catch (error) {
      console.log(error);
      hideLoading();
    } finally {
      hideLoading();
    }
  };

  const handleClick = () => {
    try {
      if (!router) return;
      const contestSubmissionId = get(searchResults, "id");
      if (!contestSubmissionId) return;
      router.push(`${ROUTE.CONTEST_SUBMISSION}/${contestSubmissionId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchResults) {
      const group_stage = searchResults.contest_entry.candidateNumber
        .toString()
        .split("-")[0];
      let category = "";
      if (group_stage == "D2") {
        category = "Thi nhóm";
      } else {
        category = "Thi cá nhân";
      }
      setShowResult({
        QualifiedExam: searchResults.QualifiedExam,
        fullName: searchResults.contest_entry.user.fullName,
        contest_group_stage: group_stage,
        category: category,
        group_member: [],
        title: get(searchResults, "title"),
        description: get(searchResults, "description"),
        score: get(searchResults, "score"),
        topUser: get(searchResults, "topUser"),
      });
      const members: string[] = [];
      if (searchResults.contest_entry.groupMemberInfo != null) {
        searchResults.contest_entry.groupMemberInfo.map((member: any) => {
          members.push(member.name);
        });
        setShowResult((prev) => ({ ...prev, group_member: members }));
      }
    }
  }, [searchResults]);

  return (
    <div
      className="mx-auto max-w-[720px] border-gray-200 bg-white min-h-[calc(100vh-64px-4px)] 
        shadow-md border-l border-r border-b border-b-gray-300 rounded-none rounded-b-xl border-t-0 
        mb-3 pb-3"
    >
      <div className="space-y-6">
        <Image
          src={`/image/contest/tong-hop-bai-du-thi.jpg`}
          alt={`Banner`}
          width={720}
          height={480}
          priority
          style={{ objectFit: "contain" }}
          quality={100}
        />
      </div>

      <div className="mt-8 text-bodyLg">
        <div className="text-center px-16">
          Thí sinh nhập số báo danh và số điện thoại vào các ô dưới đây để tra
          cứu thông tin
        </div>
        <div className="text-center mt-4 px-16">
          Nếu quá trình thực hiện không thành công, Quý phụ huynh và thí sinh
          vui lòng liên hệ Ban tổ chức cuộc thi theo số{" "}
          <span className="font-bold">085 851 4499</span> để được hỗ trợ.
        </div>
        <div
          className={classNames(
            "w-full flex sm:flex mt-8 px-4 gap-x-2 max-sm:h-[255px]",
            Object.keys(method.formState.errors).length > 0
              ? "items-center"
              : "items-end"
          )}
        >
          <FormProvider {...method}>
            <div className="sm:w-11/12 sm:flex gap-x-3 ">
              <div className={`sm:w-[45%]`}>
                <div className="text-gray-950 text-SubheadSm">
                  Số báo danh <span className="text-red-500">*</span>
                </div>
                <Controller
                  name="candidateNumber"
                  control={method.control}
                  render={({ field: { value, onChange }, fieldState }) => (
                    <Input
                      value={value}
                      onChange={onChange}
                      type="text"
                      placeholder="Nhập số báo danh"
                      customClassNames="w-[264px] mt-2"
                      error={fieldState && fieldState.error?.message}
                    />
                  )}
                />
              </div>
              <div className={`sm:w-[45%] max-sm:mt-3`}>
                <div className="text-gray-950 text-SubheadSm">
                  Số điện thoại <span className="text-red-500">*</span>
                </div>
                <Controller
                  control={method.control}
                  name="phoneNumber"
                  render={({ field: { value, onChange }, fieldState }) => (
                    <Input
                      type="text"
                      value={value}
                      onChange={onChange}
                      placeholder="Nhập số điện thoại"
                      customClassNames="mt-2 w-[264px] mt-2"
                      error={fieldState && fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </div>
            <Button
              className={`!rounded-[3rem] h-[48px] sm:w-2/12 sm:max-w-[106px] max-sm:mt-3 max-sm:w-full items-center`}
              onClick={method.handleSubmit(handleSearch)}
            >
              Tra cứu
            </Button>
          </FormProvider>
        </div>
        <div className={`mt-8 w-full border border-gray-300`}></div>

        {searchResults ? (
          <div>
            {/*
             * show result here
             */}
            <div className={`flex h-14 items-center justify-between px-4`}>
              <div className={`text-SubheadLg text-gray-950`}>
                Thông tin thí sinh
              </div>
              {/* only show this button when in group D */}
              {!!showResult.title &&
                false &&
                get(showResult, ["contest_group_stage"], "").includes("D") && (
                  <Button
                    outlined={true}
                    className={classNames(
                      `border border-gray-300 !rounded-[3rem] w-[132px] h-10 text-gray-400`,
                      showResult.QualifiedExam == true
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                    onClick={handleClick}
                  >
                    Xem bài thi
                  </Button>
                )}
            </div>
            <div className={`mt-4 px-4 grid sm:grid-cols-2 grid-cols-1`}>
              <div>
                <div className="text-bodyLg text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <div className="w-[30%] flex-shrink-0">Họ tên:</div>
                    <div className="text-SubheadMd text-gray-800 flex-grow">
                      {get(showResult, ["fullName"], "")}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-[30%] flex-shrink-0">Bảng thi:</div>
                    <div className="text-SubheadMd text-gray-800 flex-grow">
                      {get(showResult, ["contest_group_stage"], "")}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-[30%] flex-shrink-0">Hạng mục:</div>
                    <div className="text-SubheadMd text-gray-800 flex-grow">
                      {get(showResult, ["category"], "")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-sm:mt-3 text-bodyLg text-gray-600 space-y-3">
                <div className="flex items-center">
                  <div className=" w-[30%] flex-shrink-0">Kết quả:</div>
                  <div
                    className={classNames(
                      "text-SubheadMd flex-grow",
                      showResult.QualifiedExam === true
                        ? "text-green-500"
                        : showResult.QualifiedExam === false
                        ? "text-red-500"
                        : "text-gray-800"
                    )}
                  >
                    {showResult.QualifiedExam != null
                      ? showResult.QualifiedExam == true
                        ? "Đạt"
                        : "Không đạt"
                      : "Chưa chấm"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-8 text-bodyLg mb-3">
            <Image
              src={`/image/contest/Social-02.png`}
              alt={`Empty`}
              width={300}
              height={300}
              priority
              quality={100}
              className="mx-auto"
            />
            {searchResults === null && (
              <div className="text-red-700">Không có kết quả trùng khớp</div>
            )}
          </div>
        )}

        {!!searchResults && showResult.group_member.length > 0 && (
          <div className="mb-3">
            <div className={`mt-8 w-full border border-gray-300`}></div>
            <div className="mt-4 px-4">
              {/**
               * show group member info here
               */}
              <div
                className={`text-SubheadLg text-gray-950 h-14 flex items-center`}
              >
                <div>Thành viên cùng nhóm</div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 grid-cols-1 text-bodyLg text-gray-600 gap-2">
                {Array.isArray(showResult.group_member) &&
                  showResult.group_member.map((member) => {
                    return (
                      <div key={member}>
                        <div className="flex items-center">
                          <div className="w-[30%] flex-shrink-0">Họ tên:</div>
                          <div className="text-SubheadMd text-gray-800 flex-grow">
                            {member}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {!!searchResults && showResult.QualifiedExam && (
          <div className="text-center mt-8 text-SubheadMd text-primary-950">
            Chúc mừng bạn đã thuộc nhóm {get(showResult, "topUser")}% thí sinh
            có điểm thi Vòng loại cao nhất
          </div>
        )}
        {!!searchResults && showResult.QualifiedExam === false && (
          <div className="text-justify mt-8 text-SubheadMd text-primary-950 mx-4">
            Ban Tổ chức hy vọng cuộc thi đã mang lại cho con những trải nghiệm
            thú vị và bổ ích. Chúc con giữ vững đam mê với lập trình và hẹn gặp
            lại con trong Giải đấu Lập trình Tekmonk Coding Olympiad 2025!
          </div>
        )}
      </div>
    </div>
  );
}
