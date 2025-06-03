"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export const TechnicalRegulations = () => {
  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 space-y-12">
        <div>
          <div className="text-2xl font-bold mb-4">Quy định kỹ thuật</div>
          <ul className="list-disc list-inside mt-2">
            <li>
              Tại các vòng thi, thí sinh tự trang bị theo laptop, đảm bảo các
              yêu cầu kỹ thuật (cài sẵn các môi trường làm việc tự chọn), cổng
              chuyển và ổ cắm điện
            </li>
            <li>
              Thí sinh được phép sử dụng các môi trường lập trình tương ứng với
              các ngôn ngữ lập trình quy định như sau:
            </li>
          </ul>

          <div className="border rounded-lg overflow-x-auto mt-3">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="font-bold text-black border-r whitespace-nowrap">
                    Môi trường lập trình
                  </TableHead>
                  <TableHead className="font-bold text-black border-r whitespace-nowrap">
                    Đường dẫn truy cập
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b">
                  <TableCell className="font-medium border-r whitespace-nowrap">
                    Scratch 3.0
                  </TableCell>
                  <TableCell>
                    <div>https://scratch.mit.edu/</div>
                    <div>https://scratch.mit.edu/download</div>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b">
                  <TableCell className="font-medium border-r whitespace-nowrap">
                    IDLE Python
                  </TableCell>
                  <TableCell>
                    https://www.python.org/downloads/release/python-390/
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium border-r whitespace-nowrap">
                    CodeCombat
                  </TableCell>
                  <TableCell>https://codecombat.com/home</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            Thí sinh không được phép sử dụng các công cụ trí tuệ nhân tạo để hỗ
            trợ quá trình làm bài thi. Căn cứ ý kiến của Hội đồng Giám khảo, Ban
            Tổ chức xem xét hủy các bài nộp có sử dụng các câu lệnh/công cụ hỗ
            trợ đã được lưu ý phía trên (Điểm của thí sinh sẽ chỉ được tính
            những bài nộp còn lại).
          </div>
        </div>
      </div>
    </>
  );
};
