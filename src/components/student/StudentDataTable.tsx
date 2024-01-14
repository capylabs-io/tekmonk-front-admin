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
import { Delete, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import classNames from "classnames";
import { LeaderboardData } from "@/types/common-types";
import { Button } from "../common/Button";
type Props = {
    data: LeaderboardData[];
    isDetailTable?: boolean
};
export const StudentDataTable = ({ data, isDetailTable = false }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-center">STT</TableHead>
                    <TableHead className="w-[250px] text-center">TÀI KHOẢN</TableHead>
                    <TableHead className="w-[200px] text-center">ĐỊA CHỈ</TableHead>
                    <TableHead className="text-center">SỐ ĐIỆN THOẠI</TableHead>
                    <TableHead className="text-center">LỚP</TableHead>
                    <TableHead className="text-center">ĐIỂM SỐ</TableHead>
                    <TableHead className="text-center">HÀNH ĐỘNG</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, index) => {
                    return (
                        <TableRow
                            key={row?.user.username}
                            className={classNames((index + 1) % 2 === 0 && "bg-gray-50")}
                        >
                            <TableCell className="font-medium text-center">
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-x-2 items-center">
                                    <div className="text-SubheadSm !font-medium">
                                        {row?.user.username}
                                    </div>
                                    <div className="text-gray-500">@{row?.user.twitterName}</div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                HANOI
                            </TableCell>
                            <TableCell className="text-center">
                                0912442456
                            </TableCell>
                            <TableCell className="text-center">
                                CSS-1
                            </TableCell>
                            <TableCell className="text-center">9500</TableCell>
                            <TableCell className="text-center flex gap-x-3 justify-center">
                                {
                                    !isDetailTable &&
                                    <Button className="h-max bg-transparent !p-0 !text-black">
                                        <Edit size={16} />
                                    </Button>
                                }
                                <Button className="h-max bg-transparent !p-0 !text-black">
                                    <Trash size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table >
    );
};
