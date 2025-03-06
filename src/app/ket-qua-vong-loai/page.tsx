"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar, SearchOption } from "@/components/common/SearchBar";
import { getContestSubmissionResult } from "@/requests/contestSubmit";
import { ContestSubmission } from "@/types/contestSubmit";
import get from "lodash/get";
import { useDebounce } from "@/hooks/useDebounceValue";
import { EmptySearch } from "@/components/common/EmptySearch";

const searchOptions: SearchOption[] = [
  { value: "candidateNumber", label: "Số báo danh" },
  { value: "name", label: "Tên thí sinh" },
  { value: "project", label: "Dự án" },
];

export default function CompetitionResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchType, setSearchType] = useState(searchOptions[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<ContestSubmission[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const fetchData = async () => {
    try {
      const response = await getContestSubmissionResult(
        currentPage,
        itemsPerPage,
        searchType === "name" ? searchTerm : "",
        searchType === "candidateNumber" ? searchTerm : "",
        searchType === "project" ? searchTerm : ""
      );

      //sort data by QualifiedExam with type is true | false | null
      response.data.sort((a: any, b: any) => {
        const priority = (val: boolean | null): number => {
          if (val === null) return 1;
          return val ? 2 : 0;
        };
        return priority(b.QualifiedExam) - priority(a.QualifiedExam);
      });
      setData(response.data);
      setTotalPages(Math.ceil(response.meta.pagination.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearchTerm, searchType]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, searchType]);

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-[720px] mx-auto bg-white border-l border-r border-b rounded-none border-t-0 flex flex-col justify-between">
      <div className="w-full mx-auto !border-none">
        <div className="w-full h-16 p-5">
          <div className="w-full h-16 text-2xl sm:text-SubheadLg text-primary-900 p-0">
            KẾT QUẢ
          </div>
        </div>
        <div className="w-full p-0 min-h-full">
          <div
            className="w-full h-64 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/image/contest/result-contest.png')",
            }}
          ></div>
          <SearchBar
            searchOptions={searchOptions}
            searchType={searchType}
            placeholder="Tìm kiếm kết quả"
            searchValue={searchTerm}
            onSearchValueChange={handleSearchChange}
            onSearchTypeChange={handleSearchTypeChange}
            customStyle="my-4"
          />
          {data.length == 0 ? (
            <>
              <div className="min-h-[100%]">
                <EmptySearch
                  message="Chưa có kết quả, vui lòng chờ"
                  customClassName="!border-none"
                />
              </div>
            </>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="p-4">
                    <TableRow>
                      <TableHead className="w-[20%] text-SubheadXs text-gray-700 text-center">
                        STT
                      </TableHead>
                      <TableHead className="text-SubheadXs text-gray-700 text-center">
                        THÍ SINH
                      </TableHead>
                      <TableHead className="text-center text-SubheadXs text-gray-700">
                        KẾT QUẢ
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((contestant, index) => (
                      <TableRow
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <TableCell className="text-SubheadSm text-gray-500 text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="text-SubheadMd text-primary-950">
                              {get(
                                contestant,
                                "contest_entry.user.fullName",
                                ""
                              )}
                            </span>{" "}
                            <span className="text-bodyMd text-gray-500">
                              {get(
                                contestant,
                                "contest_entry.candidateNumber",
                                ""
                              )}
                            </span>
                          </div>
                          <div className="text-bodyMd text-gray-950">
                            {get(contestant, "title", "")}
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-SubheadMd text-gray-950">
                          {get(contestant, "QualifiedExam", null) === null ? (
                            "CHƯA CHẤM"
                          ) : get(contestant, "QualifiedExam") ? (
                            <div className="flex items-center justify-evenly">
                              <p>ĐẠT</p>
                              <CheckCircle color="#03f701" />
                            </div>
                          ) : (
                            <div className="flex item-center justify-evenly">
                              <p>KHÔNG ĐẠT</p>{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-circle-x"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  color="#f70000"
                                />
                                <path d="m15 9-6 6" color="#f70000" />
                                <path d="m9 9 6 6" color="#f70000" />
                              </svg>
                              {/* <CircleX /> */}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center px-2 pb-1">
        <div className="text-sm text-gray-500">
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
