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
};
export const ClassesDataTable = ({ data }: Props) => {
    return (
        <Table className="text-primary-950">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px] text-center">CƠ SỞ</TableHead>
                    <TableHead className="w-[250px] text-center">TÊN LỚP HỌC</TableHead>
                    <TableHead className="text-center">SỐ HỌC SINH</TableHead>
                    <TableHead className="w-[200px] text-center">GV PHỤ TRÁCH</TableHead>
                    <TableHead className="text-center">TRẠNG THÁI</TableHead>
                    <TableHead className="text-center">HÀNH ĐỘNG</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, index) => {
                    return (
                        <TableRow
                            key={row?.user.username}
                            className={classNames((index + 1) % 2 !== 0 && "bg-gray-50")}
                        >
                            <TableCell className="font-medium text-center">
                                Lê Văn Lương kéo dài
                            </TableCell>
                            <TableCell>
                                Lớp học Code JS cho người mù
                            </TableCell>
                            <TableCell className="text-center">
                                100
                            </TableCell>
                            <TableCell className="text-center">
                                Phùng Thanh Độ Tên Dài Tám Chữ
                            </TableCell>
                            <TableCell className="text-center">Đang hoạt động</TableCell>
                            <TableCell className="text-center flex gap-x-3 justify-center">
                                <Button className="h-max bg-transparent !p-0 !text-black">
                                    <Edit size={16} />
                                </Button>
                                <Button className="h-max bg-transparent !p-0 !text-black">
                                    <Trash size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
