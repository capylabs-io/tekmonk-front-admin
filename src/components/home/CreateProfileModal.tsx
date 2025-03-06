import { useProfileStore } from "@/store/ProfileStore";
import { X } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../common/Input";
import { TextArea } from "../common/TextArea";
import { Button } from "../common/button/Button";
import { InputFileUpdload } from "../common/InputFileUpload";
import { InputTags } from "../contest/InputTags";

export const CreateProfileModal = () => {
  const [isShowing, hide] = useProfileStore((state) => [
    state.isShowing,
    state.hide,
  ]);
  const [tags, setTags] = useState("");
  return isShowing ? (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/60">
      <div className="relative mx-auto flex w-[688px] flex-col justify-center gap-y-5 rounded-3xl bg-white py-6">
        <button
          type="button"
          onClick={hide}
          className="absolute right-4 top-4 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <X size={16} className="" />
        </button>

        <div className="w-full text-start px-6">
          <div className="text-HeadingSm font-bold text-gray-95">Đăng bài</div>
          <div className="text-BodyMd text-gray-60">
            Khoe ngay dự án mới của mình cho các đồng môn nhé!{" "}
          </div>
        </div>
        <hr className="border-t border-gray-200" />
        <div className="px-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-60 text-SubheadMd">Tiêu đề dự án</span>
            <Input
              type="text"
              placeholder="Nhập thông tin"
              customClassNames="max-w-[424px]"
              customInputClassNames="text-sm"
            />
          </div>
          <div className="flex justify-between mt-5">
            <span className="text-gray-60">
              <div className="flex flex-col gap-y-1">
                <div className="text-SubheadMd">Đường dẫn website</div>
                <div className="text-BodyMd">(không bắt buộc)</div>
              </div>
            </span>
            <Input
              type="text"
              placeholder="Nhập thông tin"
              customClassNames="max-w-[424px]"
              customInputClassNames="text-sm"
            />
          </div>
          <div className="flex justify-between text-sm mt-5">
            <InputTags
              value={tags}
              onValueChange={(tagsString) => {
                setTags(tagsString);
              }}
              isTooltip={true}
              isRequired
              customInputClassNames="text-sm placeholder:text-BodyMd placeholder:text-gray-70"
              customClassNames="!max-w-[424px] border border-grey-300 bg-grey-50"
              placeholder="Thêm tag mới"
              tooltipContent="Vui lòng nhập tag và ấn Enter"
            />
          </div>
          <div className="flex justify-between text-sm mt-5">
            <span className="text-gray-60">Hình ảnh</span>
            <InputFileUpdload
              customClassNames="max-w-[424px]"
              customInputClassNames="text-sm"
            />
          </div>

          <div className="flex justify-between text-sm mt-5">
            <span className="text-gray-60">Nội dung bài viết</span>
            <TextArea
              placeholder="Viết vài dòng giới thiệu tổng quan dự án"
              customClassName="max-w-[424px]"
              customInputClassName="w-full !text-sm placeholder:text-BodyMd placeholder:text-gray-70"
            />
          </div>
        </div>

        <hr className="border-t border-gray-200" />
        <div className="flex justify-between w-ful px-6">
          <Button className=" !bg-gray-00 border border-gray-20 !text-primary-95 w-[100px]"
            style={{
              boxShadow:
                "0px 4px 0px #ebe4ec"
            }}
            onClick={hide}>
            <div className="!text-sm !font-normal"> Thoát</div>
          </Button>
          <Button className="w-[150px] !font-medium border border-primary-70" style={{
            boxShadow:
              "0px 4px 0px #9a1595"
          }}>
            <div className="!text-sm !font-normal"> Đăng dự án</div>
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
