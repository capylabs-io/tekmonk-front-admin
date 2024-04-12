import React, { useState } from "react";
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
import { ImagePlus } from "lucide-react";
import Image from "next/image";

type Props = {
  customClassname?: string;
};

export const CreateNewsModal = ({ customClassname }: Props) => {
  const [selectedFile, setSelectedFile] = useState();

  const handleChangeFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className={classNames("flex flex-col gap-y-4", customClassname)}>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Tiêu đề</div>
        <div className="col-span-3">
          <Input
            type="text"
            placeholder="VD: Lớp học vui vẻ tại Tekmonk"
            customInputClassNames="text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Thumbnail</div>
        <div className="col-span-3 flex gap-x-2">
          <div className="border rounded-lg h-full min-w-[48px] flex justify-center">
            {!selectedFile ? (
              <ImagePlus className="flex justify-center my-auto" />
            ) : (
              <Image
                className="rounded-md object-cover"
                src={URL.createObjectURL(selectedFile)}
                alt="image"
                width={48}
                height={48}
              />
            )}
          </div>
          <Inputcn
            type="file"
            accept="images/*"
            onChange={handleChangeFile}
          ></Inputcn>
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
