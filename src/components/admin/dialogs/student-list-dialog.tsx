"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonButton } from "@/components/common/button/CommonButton";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Mission } from "@/types/mission";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { TAchievement } from "@/types/achievement";

interface StudentListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  mission?: Mission | TAchievement | null; // Could be a mission or achievement
  queryFn: (queryString: string) => Promise<any>;
  queryKey: string;
}

export const StudentListDialog = ({
  open,
  onOpenChange,
  title,
  mission,
  queryFn,
  queryKey,
}: StudentListDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Query to get students based on the provided query function
  const { data: studentData } = useQuery({
    queryKey: [queryKey, mission?.id, currentPage, itemsPerPage],
    queryFn: async () => {
      if (!mission && queryKey.includes("mission")) return null;

      try {
        const filter: any = {};

        // Use the correct filter key based on the queryKey
        if (mission) {
          if (queryKey.includes("Achievement")) {
            filter.achievement = mission.id;
          } else {
            filter.mission = mission.id;
          }
        }

        const queryString = qs.stringify({
          filters: filter,
          populate: ["user"],
          pagination: {
            page: currentPage,
            pageSize: itemsPerPage,
          },
        });

        return await queryFn(queryString);
      } catch (error) {
        console.error(`Error fetching students in ${queryKey}:`, error);
        return null;
      }
    },
    enabled: open,
    refetchOnWindowFocus: false,
  });

  // Process the data based on the structure received
  const processedData = studentData?.data
    ? studentData.data.map((item: any) => {
        // Extract user data from the response
        const userData =
          item.attributes?.user?.data?.attributes ||
          (item.user ? item.user : item.attributes);
        return {
          ...userData,
          id: item.id,
          userId: item.attributes?.user?.data?.id || item.id,
        };
      })
    : [];

  const columns: ColumnDef<any>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Tên học viên",
      accessorKey: "fullName",
      cell: ({ row }) => (
        <span>{row.original.fullName || row.original.username || "N/A"}</span>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      header: "Số điện thoại",
      accessorKey: "phoneNumber",
      cell: ({ row }) => <span>{row.original.phoneNumber || "N/A"}</span>,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px] max-w-[90vw] bg-white max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-4">
          <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
            {title} {mission?.title ? `: ${mission.title}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-4 flex-grow overflow-hidden">
          {studentData && (
            <CommonTable
              data={processedData}
              isLoading={false}
              columns={columns}
              page={currentPage}
              totalPage={studentData.meta?.pagination?.pageCount || 1}
              totalDocs={studentData.meta?.pagination?.total || 0}
              onPageChange={setCurrentPage}
              docsPerPage={itemsPerPage}
              onPageSizeChange={setItemsPerPage}
              customTableClassname="!h-[calc(100%-50px)]"
            />
          )}

          <div className="flex justify-end mt-auto pt-4">
            <CommonButton
              variant="secondary"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Đóng
            </CommonButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
