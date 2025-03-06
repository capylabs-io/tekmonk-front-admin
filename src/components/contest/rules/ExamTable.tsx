"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export const ExamTable = () => {
  return (
    <>
      <Table className="border-collapse border border-slate-400 min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead className="border border-slate-300 bg-slate-50 p-2 text-slate-900 font-semibold text-left">
              Bảng
            </TableHead>
            <TableHead className="border border-slate-300 bg-slate-50 p-2 text-slate-900 font-semibold text-left">
              Lớp
            </TableHead>
            <TableHead className="border border-slate-300 bg-slate-50 p-2 text-slate-900 font-semibold text-left">
              Hình thức thi
            </TableHead>
            <TableHead className="border border-slate-300 bg-slate-50 p-2 text-slate-900 font-semibold text-left">
              Nội dung thi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border border-slate-300 p-2">
              Bảng A
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              Tiểu học: Lớp 3 - lớp 5
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              Thi cá nhân
            </TableCell>
            <TableCell className="border border-slate-300 p-2" rowSpan={3}>
              Thí sinh vận dụng kiến thức và kĩ năng lập trình để thực hiện các
              thử thách trên nền tảng CodeCombat{" "}
              <Link
                href="https://codecombat.com/"
                target="_blank"
                className="hover:text-primary-600"
              >
                (https://codecombat.com/)
              </Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border border-slate-300 p-2">
              Bảng B
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              THCS: Lớp 6 - lớp 9
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              Thi cá nhân
            </TableCell>
            {/* <TableCell className="border border-slate-300 p-2">
              Lập trình bằng CodeCombat (Python hoặc JavaScript)
            </TableCell> */}
          </TableRow>
          <TableRow>
            <TableCell className="border border-slate-300 p-2">
              Bảng C
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              THPT: Lớp 10 - lớp 12
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              Thi cá nhân
            </TableCell>
            {/* <TableCell className="border border-slate-300 p-2">
              Lập trình bằng CodeCombat (Python hoặc JavaScript)
            </TableCell> */}
          </TableRow>
          <TableRow>
            <TableCell className="border border-slate-300 p-2">
              Bảng D
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              Tiểu học, THCS, THPT (Lớp 3 - 12): Bảng sáng tạo
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              Thi cá nhân hoặc thi theo đội, tối đa 03 thành viên
            </TableCell>
            <TableCell className="border border-slate-300 p-2">
              <div>
                Thi sản phẩm phần mềm sáng tạo phù hợp với chủ đề của giải đấu
                (sử dụng Scratch hoặc Python).
              </div>
              <div className="mt-2">
                Sản phẩm sáng tạo dự thi chưa từng đạt giải các cuộc thi, hội
                thi cấp Quốc gia, quốc tế.
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
