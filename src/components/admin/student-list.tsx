import { useState } from "react";
import StudentTablePagination from "./student-table-pagination";
import { Input } from "../common/Input";
import { ChevronRight, Trash } from "lucide-react";
import { StrapiResponse } from "@/requests/strapi-response-pattern";
import { EnRollment } from "@/types/common-types";

interface Student {
  id: number;
  name: string;
  username: string;
  isAllowDeleteStudent?: boolean;
  handleRemoveStudentFromClass?: (studentId: number) => void;
}

export default function StudentList({
  data,
  currentPage,
  onPageChange,
  isAllowDeleteStudent = false,
  handleRemoveStudentFromClass,
}: {
  data: StrapiResponse<EnRollment[]>;
  currentPage: number;
  onPageChange: (page: number) => void;
  isAllowDeleteStudent?: boolean;
  handleRemoveStudentFromClass?: (studentId: number) => void;
}) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="w-full px-4">
      <div className="flex items-center py-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Tìm kiếm học viên"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e)}
            className="w-[411px]"
          />
        </div>
      </div>

      <div className="overflow-hidden border-none">
        <table className="min-w-full divide-y divide-gray-20 border !rounded-lg">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                STT
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                Tên học viên
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                Tên tài khoản
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((student, index) => (
              <tr key={student.id} className="">
                <td className="px-6 py-4 whitespace-nowrap text-BodySm text-gray-95">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-BodySm text-gray-95">
                  {student.student?.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-BodySm text-gray-95">
                  {student.student?.username}
                </td>
                <td className="px-6 py-4 flex items-center h-full justify-end whitespace-nowrap text-BodySm text-gray-95">
                  {isAllowDeleteStudent ? (
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full"
                      onClick={() => handleRemoveStudentFromClass?.(student.id)}
                    >
                      <Trash width={16} height={16} />
                    </button>
                  ) : (
                    <ChevronRight
                      color="#AC9EB1"
                      className="my-auto mt-3 cursor-pointer"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <StudentTablePagination
          showDetails={false}
          totalItems={data.meta.pagination.total}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => onPageChange(page)}
          onItemsPerPageChange={setItemsPerPage}
          showEllipsisThreshold={7}
        />
      </div>
    </div>
  );
}
