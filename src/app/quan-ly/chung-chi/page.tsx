"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { Edit, PanelLeft, Trash2 } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { AchievementFormData } from "@/components/achievement/CreateAchievementModal";
import { Input } from "@/components/common/Input";
import { useState } from "react";
import { useCertificate } from "@/hooks/useCertificate";
import { CreateCertificateModal } from "@/components/certificate/CreateCertificateModal";


export default function Page() {
  const { totalPage,
    totalDocs,
    limit,
    page,
    isOpenCreateModal,
    setLimit,
    setPage,
    setIsOpenCreateModal } = useCertificate()

  const [searchQuery, setSearchQuery] = useState("");
  const [textSearch, setTextSearch] = useState("");
  const handleSearch = () => {
    setSearchQuery(textSearch);
  };
  const columns: ColumnDef<AchievementFormData>[] =
    [
      {
        header: 'STT',
        cell: ({ row }) => <span>{row.index + 1}</span>,

      },
      {
        header: 'Mã',
        cell: ({ row }) => (
          <div className="bg-center bg-no-repeat bg-cover h-[80px] rounded-xl w-[130px]"
            style={{
              backgroundImage: `url(${row.original?.icon})`
            }}>

          </div>
        ),
      },
      {
        header: 'Tên chứng chỉ',
        cell: ({ row }) => <span>{row.original.title}</span>,
      },
      {
        header: 'Thuộc khoá học',
        cell: ({ row }) => <div>
          {
            row.original.type
          }
        </div>
      },
      {
        id: 'action',
        header: '',
        cell: ({ row }) => {
          return (
            <div className="flex gap-2">
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add edit handler here
                }}
              >
                <Edit className="h-4 w-4" color="#7C6C80" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add edit handler here
                }}
              >
                <Trash2 className="h-4 w-4" color="#7C6C80" />
              </button>
            </div>
          );
        },
      },
    ]


  return (
    <>
      <div className="w-full h-screen border-r border-gray-20">
        <div className="w-full h-[68px] flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 border-b border-gray-20">
          <div className="text-SubheadLg text-gray-95 mb-2 sm:mb-0 flex items-center justify-center gap-2">
            <CommonCard
              size="small"
              className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
            >
              <PanelLeft width={17} height={17} />
            </CommonCard>
            Chứng chỉ
          </div>
        </div>
        {/* <div className="w-full flex flex-col py-2">
        <div className="h-9 w-[265px] flex items-center justify-center text-gray-95 gap-3"> */}
        <div className="w-full h-[calc(100%-40px-12px)] overflow-y-auto p-4">
          <div className="flex justify-between items-center">
            <Input
              type="text"
              isSearch={true}
              value={textSearch}
              onChange={setTextSearch}
              placeholder="Tìm kiếm chứng chỉ theo từ khoá"
              customClassNames="max-w-[410px] h-10 mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              onSearch={handleSearch}
            />
            <CommonButton
              variant="primary"
              className="h-9 !w-max px-6"
              onClick={() => setIsOpenCreateModal(true)}
            >
              Tạo mới
            </CommonButton>
          </div>
          <CommonTable
            data={[]}
            isLoading={false}
            columns={columns}
            page={page}
            totalPage={totalPage}
            totalDocs={totalDocs}
            onPageChange={setPage}
            docsPerPage={limit}
            onPageSizeChange={setLimit}
          />
        </div>
      </div>
      <CreateCertificateModal open={isOpenCreateModal} onOpenChange={(value) => { setIsOpenCreateModal(value) }} onSubmit={() => { }} />

    </>
  );
}
