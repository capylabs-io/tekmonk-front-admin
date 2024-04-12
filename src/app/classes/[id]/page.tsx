"use client";
import { UserInfoContainer } from "@/components/home/UserInfoContainer";
import { ArrowLeft, Clock4, MapPin, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { ClassesModalForm } from "@/components/classes/ClassesModalForm";
import { Button } from "@/components/common/Button";
import LeaderboardMock from "@/mock/leaderboard-mock.json";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/common/Dialog";
import { InputWithIcon } from "@/components/common/InputWithIcon";
import { StudentDataTable } from "@/components/student/StudentDataTable";
import { Pagination } from "@/components/common/Pagination";
import { AddStudentModalForm } from "@/components/student/AddStudentModalForm";
export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const handleBackRoute = () => {
    router.back();
  };
  const handleNextPage = () => {};
  const handlePrevPage = () => {};
  return (
    <>
      <div className="w-full text-xl text-primary-900 px-8  flex justify-between items-center">
        <div
          className="text-primary-900 flex gap-x-2 items-center cursor-pointer"
          onClick={handleBackRoute}
        >
          <ArrowLeft size={18} className="text-gray-600" />
          <span>Chi tiết lớp học</span>
        </div>
        <UserInfoContainer />
      </div>
      <hr className="bg-gray-200 w-full my-4" />
      <Tabs defaultValue="info" className="mt-5 px-8">
        <TabsList className="rounded-t-xl">
          <TabsTrigger
            value="info"
            className="rounded-tl-xl border-r border-gray-300"
          >
            Thông tin chung
          </TabsTrigger>
          <TabsTrigger value="student" className="border-r border-gray-300">
            Học viên
          </TabsTrigger>
          <TabsTrigger value="misson" className="border-r border-gray-300">
            Nhiệm vụ
          </TabsTrigger>
          <TabsTrigger value="progress" className="rounded-tr-xl">
            Tiến trình
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="info"
          className="overflow-y-auto text-sm p-4 border border-gray-300 rounded-b-xl rounded-tr-xl w-2/3"
        >
          <div className="flex justify-end">
            <div className="flex gap-x-6">
              <Button className="bg-transparent !text-black text-SubheadSm !p-0">
                Xoá
              </Button>
              <Button className="bg-transparent !text-primary-600 text-SubheadSm !p-0">
                Cập nhật
              </Button>
            </div>
          </div>
          <ClassesModalForm customClassname="mt-4" />
        </TabsContent>
        <TabsContent
          value="student"
          className="overflow-y-auto text-sm p-4 border border-gray-300 rounded-b-xl rounded-tr-xl"
        >
          <div className="w-full flex justify-between items-center">
            <InputWithIcon
              type="text"
              value=""
              customClassNames="!w-[300px] h-[40px]"
              customInputClassNames="text-sm"
              placeHolder="Tìm kiếm từ khoá"
              iconElement={<Search size={16} />}
            />
            <div className="flex gap-x-6 items-center">
              <div className="text-primary-950 text-sm">
                Tổng số: {LeaderboardMock.length} học viên
              </div>
              <Dialog>
                <DialogTrigger className="text-xs h-max px-4 py-2 text-white rounded-lg bg-primary-600 flex items-center">
                  <Plus size={16} className="mr-2" />
                  Thêm học sinh
                </DialogTrigger>
                <DialogContent className="sm:min-w-md">
                  <div className="w-full text-center text-SubheadLg text-primary-900">
                    Thêm học sinh
                  </div>
                  <hr className="bg-gray-200" />
                  <AddStudentModalForm />
                  <hr className="bg-gray-200" />
                  <DialogFooter className="sm:justify-end px-6">
                    <DialogClose className="!rounded-xl text-sm !py-2">
                      Huỷ
                    </DialogClose>
                    <Button className="!rounded-xl text-sm !py-2">
                      Thêm học sinh
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-gray-300">
            <StudentDataTable data={LeaderboardMock} isDetailTable />
          </div>
          <div className="mt-4 flex justify-end ">
            <Pagination
              currentPage={1}
              totalPages={2}
              onClickNextPage={handleNextPage}
              onClickPrevPage={handlePrevPage}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="misson"
          className="overflow-y-auto text-sm p-4 border border-gray-300 rounded-b-xl rounded-tr-xl"
        ></TabsContent>
        <TabsContent
          value="progress"
          className="overflow-y-auto text-sm p-4 border border-gray-300 rounded-b-xl rounded-tr-xl"
        ></TabsContent>
      </Tabs>
    </>
  );
}
