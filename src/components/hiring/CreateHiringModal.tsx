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
import { ImagePlus, Plus } from "lucide-react";
import Image from "next/image";
import { createNews } from "@/requests/news";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../common/Dialog";
import { Button } from "../common/Button";
import { useLoadingStore } from "@/store/LoadingStore";
import { ToastContainer } from "react-toastify";

type Props = {
  customClassname?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const CreateHiringModal = ({
  customClassname,
  open,
  setOpen,
}: Props) => {
  const [selectedFile, setSelectedFile] = useState<Blob>();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);

  const handleOpen = (open: boolean) => {
    setOpen && setOpen(open);
  };

  const handleChangeTitle = (value: string) => {
    setTitle(value);
  };

  const handleChangeFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChangeTime = (value: string) => {
    setTime(value);
  };

  const handleChangeSalary = (value: string) => {
    setSalary(value);
  };

  const handleChangeLocation = (value: string) => {
    setLocation(value);
  };

  const handleChangeContent = (e: any) => {
    setContent(e.target.value);
  };

  const handleSumbmit = async () => {
    try {
      // @TODO: show loading
      show();
      const formData = new FormData();
      const [startTime, endTime] = time.split(" - ");
      const metadata = {
        salary: salary,
      };
      formData.append("title", title);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("metadata", JSON.stringify(metadata));
      formData.append("location", location);
      formData.append("locationName", location);
      formData.append("content", content);
      if (selectedFile) {
        formData.append("background", selectedFile);
      }
      formData.append("type", "hiring");
      // Call API here
      await createNews(formData);
      handleOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      hide();
    }
  };

  const modalContent = (
    <div className={classNames("flex flex-col gap-y-4", customClassname)}>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Tên bài tuyển dụng</div>
        <div className="col-span-3">
          <Input
            type="text"
            placeholder="VD: Tuyển dụng giáo viên UI/UX"
            customInputClassNames="text-sm"
            onChange={handleChangeTitle}
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
            onChange={(e) => handleChangeFile(e)}
          ></Inputcn>
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Thời gian tuyển dụng</div>
        <div className="col-span-3">
          <Input
            type="text"
            placeholder="VD: 12/08/2023 - 20/10/2023"
            customInputClassNames="text-sm"
            onChange={(e) => handleChangeTime(e)}
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
            onChange={handleChangeSalary}
          />
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2 my-auto">Khu vực tuyển dụng</div>
        <div className="col-span-3">
          <Select onValueChange={(value) => handleChangeLocation(value)}>
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
          <Textarea
            className="resize-none"
            placeholder="Nội dung tuyển dụng"
            onChange={handleChangeContent}
          />
        </div>
      </div>
    </div>
  );

  // @TODO: form validation
  return (
    <>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogTrigger className="text-xs h-max px-4 py-2 text-white rounded-lg bg-primary-600 flex items-center">
          <Plus size={16} className="mr-2" />
          <div>Thêm bài viết</div>
        </DialogTrigger>
        <DialogContent className="sm:min-w-md">
          <div className="w-full text-center text-SubheadLg text-primary-900">
            Thông tin
          </div>
          <hr className="bg-gray-200" />
          {modalContent}
          <hr className="bg-gray-200" />
          <DialogFooter className="sm:justify-end px-6">
            <DialogClose className="!rounded-xl text-sm px-6 py-3 border">
              Huỷ
            </DialogClose>
            <Button
              type="submit"
              className="!rounded-xl text-sm !py-2"
              onClick={handleSumbmit}
            >
              Thêm bài viết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};
