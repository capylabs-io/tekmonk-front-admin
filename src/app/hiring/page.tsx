"use client";
import { Button } from "@/components/common/Button";
import React, { use, useEffect, useState } from "react";
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
import { useFetchNews } from "@/lib/hook/useFetchNews";

const Hiring: React.FC = () => {
  const initFilter = "filters[type][$eq]=hiring&populate[0]=user";
  const [filter, setFilter] = useState(initFilter);
  const [open, setOpen] = useState(false);
  // @TODO: refetch hiring when create done!
  const hiringNews = useFetchNews(filter);

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
        <CreateHiringModal
          customClassname="px-6 mt-4"
          open={open}
          setOpen={setOpen}
        />
      </div>
      <div className="mx-8 mt-4 rounded-xl border border-gray-300">
        <DataTable data={hiringNews} headers={HEADERS} isDetailTable />
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
