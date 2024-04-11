"use client";
import { Button } from "@/components/common/Button";
import React from "react";
import { InputWithIcon } from "@/components/common/InputWithIcon";
import { Plus, Search } from "lucide-react";
import LeaderboardMock from "@/mock/leaderboard-mock.json";
import { StudentDataTable } from "@/components/student/StudentDataTable";
import { Pagination } from "@/components/common/Pagination";
import { UserInfoContainer } from "@/components/home/UserInfoContainer";
import { Role } from "../contants/role";
import WithAuth from "@/components/hoc/WithAuth";

const Student: React.FC = () => {
  const handleOnClick = () => {};
  const handleNextPage = () => {};
  const handlePrevPage = () => {};
  return (
    Role.TEACHER && (
      <>
        <div className="text-xl text-primary-900 px-8 w-full flex justify-between items-center">
          <div>Học viên</div>
          <UserInfoContainer />
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
          <div className="flex gap-x-6 items-center">
            <div className="text-primary-950 text-sm">
              Tổng số: {LeaderboardMock.length} học viên
            </div>
            <Button size="small" className="text-xs h-max !py-3">
              <Plus size={16} className="mr-2" />
              Thêm học sinh
            </Button>
          </div>
        </div>
        <div className="mx-8 mt-4 rounded-xl border border-gray-300">
          <StudentDataTable data={LeaderboardMock} />
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
    )
  );
};

export default WithAuth(Student);
