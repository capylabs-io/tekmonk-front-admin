"use client";

import { PanelLeft, UserPlus } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/common/Input";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useCertificate } from "@/hooks/useCertificate";
import { SelectStudentListDialog } from "@/components/class/SelectStudentListDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import qs from "qs";
import { deleteCertificateHistory, getCertificate, getCertificateHistory, postCertificateHistory } from "@/requests/certificate";
import { Certificate, CertificateHistory } from "@/types/certificate";
import { get } from "lodash";

export default function Page() {
  const { totalPage,
    totalDocs,
    limit,
    page,
    setLimit,
    setPage,
    setIsOpenCreateModal,
    setTotalDocs,
    setTotalPage
  } = useCertificate()

  const [searchQuery, setSearchQuery] = useState("");
  const [textSearch, setTextSearch] = useState("");

  const [showStudentListDialog, setShowStudentListDialog] = useState(false)

  const [isMounted, setIsMounted] = useState(false);
  const [certificateSelected, setCertificateSelected] = useState<Certificate>()
  const [showLoading, hideLoading] = useLoadingStore((state) => [state.show, state.hide]);
  const [showError, showSuccess] = useSnackbarStore((state) => [state.error, state.success])
  const { data: certificates } = useQuery({
    queryKey: ["certificates", page, limit, textSearch],
    queryFn: async () => {
      try {
        const queryString = qs.stringify(
          {
            filters: {
              name: {
                $containsi: textSearch
              }
            },
            populate: '*',
            pagination: {
              page: page,
              pageSize: limit,
            },
          }
        )
        const res = await getCertificate(queryString)
        if (res) {
          setLimit(res.meta.pagination.pageSize)
          setPage(res.meta.pagination.page)
          setTotalDocs(res.meta.pagination.total)
          setTotalPage(res.meta.pagination.pageCount)
        }
        return res;
      } catch (err) {
        showError("Lỗi", "Không thể lấy thông tin chứng chỉ");
      }
    },
    refetchOnWindowFocus: false,
    enabled: isMounted, // Only run query when component is mounted
  });
  const { data: certificateHistory, refetch: refetchCertificateHistory } = useQuery({
    queryKey: ["certificateHistories", page, limit],
    queryFn: async () => {
      try {
        const queryString = qs.stringify(
          {
            populate: ['certificate', 'student', 'certificate.course'],
            pagination: {
              page: page,
              pageSize: limit,
            },
          }
        )
        const res = await getCertificateHistory(queryString)
        if (res) {
          setLimit(res.meta.pagination.pageSize)
          setPage(res.meta.pagination.page)
          setTotalDocs(res.meta.pagination.total)
          setTotalPage(res.meta.pagination.pageCount)
        }
        return res;
      } catch (err) {
        showError("Lỗi", "Không thể lấy thông tin Lịch sử chứng chỉ");
      }
    },
    refetchOnWindowFocus: false,
    enabled: isMounted, // Only run query when component is mounted
  });

  const listStudentHasCertificateSelected = useMemo(() => {
    if (!certificateHistory || !certificateSelected)
      return []
    return certificateHistory.data.filter((item: CertificateHistory) => item.certificate.id === certificateSelected?.id)
  }, [certificateHistory, certificateSelected])

  const { mutate: addStudentMutation } = useMutation({
    mutationFn: async (studentIds: string[]) => {
      const certificateData = studentIds.map((studentId) => ({
        student: Number(studentId),
        certificate: certificateSelected && Number(certificateSelected.id),
      }));
      const res = certificateData.map(async (item) => {
        return await postCertificateHistory({ ...item });
      })
      return await Promise.all(res)
    },
    onSuccess: () => {
      showSuccess("Thành công", "Đã thêm học viên vào chứng chỉ");
      refetchCertificateHistory()
      setShowStudentListDialog(false);
    },
    onError: (err) => {
      console.error("Error adding students:", err);
      showError("Lỗi", "Có lỗi xảy ra khi thêm học viên vào chứng chỉ");
    },
    onSettled: () => {
      hideLoading();
    },
  });
  const { mutate: deleteStudentMutation } = useMutation({
    mutationFn: async (studentIds: string[]) => {
      const certificateData = studentIds.map((studentId) => ({
        student: Number(studentId),
      }));
      const res = certificateData.map(async (item) => {
        return await deleteCertificateHistory(item.student);
      })
      return await Promise.all(res)
    },
    onSuccess: () => {
      showSuccess("Thành công", "Đã thêm học viên vào chứng chỉ");
      refetchCertificateHistory()
      setShowStudentListDialog(false);
    },
    onError: (err) => {
      console.error("Error adding students:", err);
      showError("Lỗi", "Có lỗi xảy ra khi thêm học viên vào chứng chỉ");
    },
    onSettled: () => {
      hideLoading();
    },
  });
  const handleSearch = () => {
    setSearchQuery(textSearch);
  };
  const handleAddStudents = useCallback((data: string[]) => {
    const StudentHasCertificateSelected = listStudentHasCertificateSelected.map((item: CertificateHistory) => item.student?.id)
    let dataFilter = data.filter((item: string) => !StudentHasCertificateSelected.includes(item))
    let dataDelete = data.filter((item: string) => StudentHasCertificateSelected.includes(item))
    if (dataFilter.length === 0) {
      showError("Lỗi", "Vui lòng chọn ít nhất một học viên");
      return;
    }
    showLoading();
    addStudentMutation(dataFilter);
    deleteStudentMutation(dataDelete);
  }, [addStudentMutation, listStudentHasCertificateSelected])

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columnsRequestList: ColumnDef<Certificate>[] =
    [
      {
        header: 'STT',
        cell: ({ row }) => <span>{row.index + 1}</span>,

      },
      {
        header: 'Tên chứng chỉ',
        cell: ({ row }) => <span>{row.original.name}</span>,
      },
      {
        header: 'Mô tả',
        cell: ({ row }) => (
          <div
            dangerouslySetInnerHTML={{
              __html: row.original.description || "",
            }}
          ></div>
        )
      },
      {
        header: 'Thuộc khoá học',
        cell: ({ row }) => <div>
          {
            get(row, 'original.course.name', '')
          }
        </div>
      },
      {
        id: 'action',
        header: '',
        cell: ({ row }) => (
          <button
            className="p-2 hover:bg-gray-100 rounded-full flex justify-center items-center"
            onClick={() => {
              setCertificateSelected(row.original)
              setShowStudentListDialog(true)
            }}
          >
            <UserPlus className="h-5 w-5" color="#7C6C80" />
          </button>
        )
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
            Xin cấp chứng chỉ
          </div>
        </div>

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
          </div>
          <CommonTable
            data={certificates?.data || []}
            isLoading={false}
            columns={columnsRequestList}
            page={page}
            totalPage={totalPage}
            totalDocs={totalDocs}
            onPageChange={setPage}
            docsPerPage={limit}
            onPageSizeChange={setLimit}
          />
        </div>

      </div>
      <SelectStudentListDialog
        isOpen={showStudentListDialog}
        title="Học viên hoàn thành chứng chỉ"
        openDialogClick={setShowStudentListDialog}
        closeDialogClick={() => setShowStudentListDialog(false)}
        handleAddStudent={handleAddStudents}
        listStudentHasCertificateSelected={listStudentHasCertificateSelected}
      />
    </>
  );
}
