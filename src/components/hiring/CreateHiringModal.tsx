import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";
import { Input } from "../common/Input";
import classNames from "classnames";
import { Textarea } from "../common/TextArea";
import { Inputcn } from "../common/Inputcn";

type Props = {
  customClassname?: string;
};

export const CreateHiringModal = ({ customClassname }: Props) => {
  return (
    <div className={classNames("flex flex-col gap-y-4", customClassname)}>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Tên bài tuyển dụng</div>
        <div className="col-span-3">
          <Input
            type="text"
            placeholder="VD: Tuyển dụng giáo viên UI/UX"
            customInputClassNames="text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Thumbnail</div>
        <div className="col-span-3">
          <Inputcn type="file"></Inputcn>
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Thời gian tuyển dụng</div>
        <div className="col-span-3">
          <Input
            type="text"
            placeholder="VD: 12/08/2023 - 20/10/2023"
            customInputClassNames="text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Mức lương</div>
        <div className="col-span-3">
          <Input
            type="text"
            placeholder="VD: 9,000,000 - 12,000,000"
            customInputClassNames="text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Khu vực tuyển dụng</div>
        <div className="col-span-3">
          <Select>
            <SelectTrigger>
              <SelectValue defaultValue="1" placeholder="Chọn khu vực" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1" className="text-green-500">
                Hà Nội
              </SelectItem>
              <SelectItem value="2" className="text-red-500">
                Hồ Chí Minh
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2">Mô tả</div>
        <div className="col-span-3">
          <Textarea className="resize-none" placeholder="Nội dung tuyển dụng" />
        </div>
      </div>
    </div>
  );
};
