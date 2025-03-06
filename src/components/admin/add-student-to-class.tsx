"use client";

import { useState } from "react";
import { CommonTag } from "../common/CommonTag";
import StudentTablePagination from "./student-table-pagination";
import { ReqGetClassUserRemaining, ReqGetUsers } from "@/requests/user";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Input } from "../common/Input";
type Props = {
  selectedStudents: string[];
  setSelectedStudents: (students: any) => void;
  classId?: string;
};

export const AddStudentToClass = ({
  selectedStudents,
  setSelectedStudents,
  classId,
}: Props) => {
  /** UseState */
  //   const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  /** UseQuery */
  const { data: studentList } = useQuery({
    queryKey: ["studentList"],
    queryFn: async () => {
      try {
        if (classId) {
          const queryString = qs.stringify({
            classId: classId,
            page: currentPage,
            limit: itemsPerPage,
          });
          return await ReqGetClassUserRemaining(queryString);
        }
        const queryString = qs.stringify({
          filters: {
            user_role: {
              code: {
                $eq: "STUDENT",
              },
            },
          },
          populate: "user_role",
          pagination: {
            page: currentPage,
            pageSize: itemsPerPage,
          },
        });
        return await ReqGetUsers(queryString);
      } catch (error) {
        console.log("error when fetching student list", error);
      }
    },
    refetchOnWindowFocus: false,
  });

  /** Handle Function */
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev: string[]) =>
      prev.includes(studentId)
        ? prev.filter((id: string) => id !== studentId)
        : [...prev, studentId]
    );
  };
  const filteredStudents = studentList?.data?.length
    ? studentList.data?.filter((student) =>
        student.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 rounded-md min-h-[48px]">
          {selectedStudents.map((selectedId) => {
            const student = studentList?.data?.find(
              (s) => s.id.toString() === selectedId
            );
            return student ? (
              <CommonTag
                key={student.id}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
              >
                {student.username}
                <button
                  onClick={() => handleStudentSelect(student.id.toString())}
                  className="text-gray-500 hover:text-gray-700 ml-1"
                >
                  ×
                </button>
              </CommonTag>
            ) : null;
          })}
        </div>

        <div className="relative">
          <Input
            isSearch={true}
            type="text"
            placeholder="Tìm kiếm học viên"
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            customClassNames="w-full"
            customInputClassNames="w-full pl-8"
          />
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="space-y-0 max-h-[300px] overflow-y-auto custom-scrollbar">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 hover:bg-primary-10 border-b last:border-b-0"
              >
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {student.username}
                  </div>
                  <div className="text-sm text-gray-500">{student.email}</div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id.toString())}
                  onChange={() => handleStudentSelect(student.id.toString())}
                  className="h-4 w-4 rounded cursor-pointer border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>
            ))}
          </div>
          {studentList?.meta && (
            <div className="border-t bg-white">
              <StudentTablePagination
                showDetails={false}
                totalItems={studentList.meta.pagination.total}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                onItemsPerPageChange={setItemPerPage}
                showEllipsisThreshold={7}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
