import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import classNames from "classnames";
import { LeaderboardData } from "@/types/common-types";
import { Pagination } from "../common/Pagination";
import { get } from "lodash";
type Props = {
  data: LeaderboardData[];
};
export const LeaderboardTable = ({ data }: Props) => {
  const handleNextPage = () => {};
  const handlePrevPage = () => {};
  const handlePageClick = () => {};
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] text-center">THỨ HẠNG</TableHead>
            <TableHead className="w-[400px] text-center">TÀI KHOẢN</TableHead>
            <TableHead className="text-center">TƯỚC VỊ</TableHead>
            <TableHead className="text-center">ĐIỂM SỐ</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            return (
              <TableRow
                key={row?.user.username}
                className={classNames((index + 1) % 2 !== 0 && "bg-[#F9FAFB]")}
              >
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex gap-x-2 items-center">
                    <Image
                      src="/image/gem/diamond-gem.png"
                      alt="gem pic"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/image/leaderboard/user1.png"
                      alt="avatar pic"
                      width={26}
                      height={26}
                      className="rounded-full"
                    />
                    <div className="text-SubheadSm !font-medium">
                      {row?.user.username}
                    </div>
                    <div className="text-gray-500">
                      @{get(row?.user, "twitterName")}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {row?.user.username}
                </TableCell>
                <TableCell className="text-center">9500</TableCell>
                <TableCell className="text-center">
                  <MoreHorizontal size={20} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {/* <TableRow className="h-[80px] flex items-center">
      
      </TableRow> */}
        {/* your rank display if you are not in the top 10 */}
        {/* <TableBody className="bg-primary-100"> */}
        {/* <TableRow className="">
          <TableCell className="font-medium text-center">108</TableCell>
          <TableCell>
            <div className="flex gap-x-2 items-center">
              <div className="h-4 w-4">
                <Image
                  src="/image/gem/bronze-gem.png"
                  alt="gem pic"
                  width={16}
                  height={16}
                />
              </div>
              <Image
                src="/image/leaderboard/user1.png"
                alt="avatar pic"
                width={26}
                height={26}
                className="rounded-full"
              />
              <div className="text-SubheadSm !font-medium">Andy Nguyễn</div>
              <div className="text-gray-500">@andyng(you)</div>
            </div>
          </TableCell>
          <TableCell className="text-center">Gà con</TableCell>
          <TableCell className="text-center">100</TableCell>
          <TableCell className="text-center">
            <MoreHorizontal size={20} />
          </TableCell>
        </TableRow> */}
        {/* </TableBody> */}
      </Table>
      <div className="p-4">
        <Pagination
          customClassName="mx-auto"
          currentPage={1}
          totalPages={2}
          onClickNextPage={handleNextPage}
          onClickPrevPage={handlePrevPage}
          onPageClick={handlePageClick}
        />
      </div>
    </>
  );
};
