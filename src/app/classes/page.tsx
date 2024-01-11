"use client"
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/common/Dialog";
import { InputWithIcon } from "@/components/common/InputWithIcon";
import { Plus, Search } from "lucide-react";
import { StudentDataTable } from "@/components/student/StudentDataTable";
import LeaderboardMock from "@/mock/leaderboard-mock.json";
import { Pagination } from "@/components/common/Pagination";
import { ClassesDataTable } from "@/components/classes/ClassesDataTable";
export default function Classes() {
  const handleOnClick = () => {
  };
  const handleNextPage = () => { };
  const handlePrevPage = () => { };
  return (
    <>
      <div className="text-xl text-primary-900 px-8">Lớp Học
      </div>
      <hr className="bg-gray-200 w-full my-4" />
      <div className="w-full flex justify-between items-center px-8">
        <InputWithIcon
          type="text"
          value=""
          customClassNames="!w-[300px] h-[40px]"
          customInputClassNames="text-sm"
          placeHolder="Tìm kiếm từ khoá"
          iconElement={<Search size={16} />}
        />
        <Button size="small" className="text-xs h-max !py-3"><Plus size={16} className="mr-2" />Thêm lớp học</Button>
      </div>
      <div className="mx-8 mt-4 rounded-md border">
        <ClassesDataTable data={LeaderboardMock} />
      </div>
      <div className="px-8 mt-4 flex justify-end">
        <Pagination
          currentPage={1}
          totalPages={2}
          onClickNextPage={handleNextPage}
          onClickPrevPage={handlePrevPage}
        />
      </div>
    </>
  );
}