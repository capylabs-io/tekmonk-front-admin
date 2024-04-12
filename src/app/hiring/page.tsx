"use client";
import { Button } from "@/components/common/Button";
import React, { useState } from "react";
import { InputWithIcon } from "@/components/common/InputWithIcon";
import { Plus, Search } from "lucide-react";
import LeaderboardMock from "@/mock/leaderboard-mock.json";
import { StudentDataTable } from "@/components/student/StudentDataTable";
import { Pagination } from "@/components/common/Pagination";
import { UserInfoContainer } from "@/components/home/UserInfoContainer";
import { Role } from "../contants/role";
import WithAuth from "@/components/hoc/WithAuth";
import { DataTable } from "@/components/common/DataTable";
import { HEADERS } from "@/const/hiring";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { DialogFooter } from "@/components/common/Dialog";
import { CreateHiringModal } from "@/components/hiring/CreateHiringModal";

const Hiring: React.FC = () => {
  const handleOnClick = () => {};
  const handleNextPage = () => {};
  const handlePrevPage = () => {};

  return (
    <>
      <div className="text-xl text-primary-900 px-8 w-full flex justify-between items-center">
        <div>Tuyển dụng</div>
        <UserInfoContainer />
      </div>
      <hr className="bg-gray-200 w-full my-4" />
      <div className="w-full flex justify-end items-center px-8">
        <Dialog>
          <DialogTrigger className="text-xs h-max px-4 py-2 text-white rounded-lg bg-primary-600 flex items-center">
            <Plus size={16} className="mr-2" />
            <div>Thêm bài viết</div>
          </DialogTrigger>
          <DialogContent className="sm:min-w-md">
            <div className="w-full text-center text-SubheadLg text-primary-900">
              Thông tin
            </div>
            <hr className="bg-gray-200" />
            <CreateHiringModal customClassname="px-6 mt-4" />
            <hr className="bg-gray-200" />
            <DialogFooter className="sm:justify-end px-6">
              <DialogClose className="!rounded-xl text-sm px-6 py-3 border">
                Huỷ
              </DialogClose>
              <Button className="!rounded-xl text-sm !py-2">
                Thêm bài viết
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mx-8 mt-4 rounded-xl border border-gray-300">
        <DataTable data={LeaderboardMock} headers={HEADERS} isDetailTable />
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
};

export default WithAuth(Hiring);
