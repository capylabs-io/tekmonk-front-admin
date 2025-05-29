"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { CheckCircle, PanelLeft, Trash2 } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/common/Input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCertificate } from "@/hooks/useCertificate";
import { Tabs } from "@/components/new/tabs";
import { useQuery } from "@tanstack/react-query";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import qs from "qs";
import {
  deleteCertificateHistory,
  getCertificateHistory,
  updateCertificateHistory,
} from "@/requests/certificate";
import { CertificateHistory } from "@/types/certificate";
import { get } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import moment from "moment";
import CustomCertificateEditor from "@/components/certificate/CustomCertificateEditor";

export default function Page() {
  const {
    totalPage,
    totalDocs,
    limit,
    page,
    setLimit,
    setPage,
    setTotalDocs,
    setTotalPage,
  } = useCertificate();

  const [searchQuery, setSearchQuery] = useState("");
  const [textSearch, setTextSearch] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [certificateHistorySelected, setCertificateHistorySelected] =
    useState<CertificateHistory>();
  const [activeTab, setActiveTab] = useState<{ id: string; label: string }>({
    id: "pending",
    label: "Đợi phê duyệt",
  });
  const [showLoading, hideLoading] = useLoadingStore((state) => [
    state.show,
    state.hide,
  ]);
  const [showError, showSuccess] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);
  const tabs = [
    { id: "pending", label: "Đợi phê duyệt" },
    { id: "verified", label: "Đã phê duyệt" },
  ];
  const { data: certificateHistory, refetch: refetchCertificateHistory } =
    useQuery({
      queryKey: ["certificateHistories", page, limit, textSearch],
      queryFn: async () => {
        try {
          const queryString = qs.stringify({
            filters: {
              certificate: {
                name: {
                  $containsi: textSearch,
                },
              },
            },
            populate: [
              "certificate",
              "student",
              "certificate.course",
              "certificate.certificatePdfConfig",
              "certificate.certificatePdfConfig.fields",
            ],
            pagination: {
              page: page,
              pageSize: limit,
            },
          });
          const res = await getCertificateHistory(queryString);
          if (res) {
            setLimit(res.meta.pagination.pageSize);
            setPage(res.meta.pagination.page);
            setTotalDocs(res.meta.pagination.total);
            setTotalPage(res.meta.pagination.pageCount);
          }
          return res;
        } catch (err) {
          showError("Lỗi", "Không thể lấy thông tin Lịch sử chứng chỉ");
        }
      },
      refetchOnWindowFocus: false,
      enabled: isMounted, // Only run query when component is mounted
    });

  const listCertificateUnVerified = useMemo(() => {
    if (!certificateHistory) return [];
    return certificateHistory.data.filter(
      (item: CertificateHistory) => !item.isVerified
    );
  }, [certificateHistory]);

  const listCertificateVerified = useMemo(() => {
    if (!certificateHistory) return [];
    return certificateHistory.data.filter(
      (item: CertificateHistory) => item.isVerified
    );
  }, [certificateHistory]);

  const handleSearch = () => {
    setSearchQuery(textSearch);
  };

  const handleConfirmVerified = useCallback(async () => {
    try {
      showLoading();
      if (!certificateHistorySelected) return;
      const res = await updateCertificateHistory(
        certificateHistorySelected?.id || 0,
        {
          isVerified: true,
        }
      );
      if (res) {
        showSuccess("Cập nhật", "Chứng chỉ cập nhật thành công!");
      }
    } catch (error) {
      console.log("error", error);
      showError("Cập nhật", "Chứng chỉ cập nhật thất bại!");
    } finally {
      hideLoading();
      setIsConfirmOpen(false);
      refetchCertificateHistory();
    }
  }, [certificateHistorySelected]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      showLoading();
      if (!certificateHistorySelected) return;
      const res = await deleteCertificateHistory(
        certificateHistorySelected?.id || 0
      );
      if (res) {
        showSuccess("Xóa", "Chứng chỉ đã được xóa thành công!");
      }
    } catch (error) {
      console.log("error", error);
      showError("Xóa", "Chứng chỉ đã được xóa thất bại!");
    } finally {
      hideLoading();
      setIsDeleteOpen(false);
      refetchCertificateHistory();
    }
  }, [certificateHistorySelected]);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columnsCertificateHistories: ColumnDef<CertificateHistory>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Tên chứng chỉ",
      cell: ({ row }) => <span>{row.original.certificate.name}</span>,
    },
    {
      header: "Mô tả",
      cell: ({ row }) => (
        <div
          dangerouslySetInnerHTML={{
            __html: row.original.certificate.description || "",
          }}
        ></div>
      ),
    },
    {
      header: "Thuộc khoá học",
      cell: ({ row }) => (
        <div>{get(row, "original.certificate.course.name", "")}</div>
      ),
    },
    {
      header: "Học viên",
      cell: ({ row }) => <div>{get(row, "original.student.username", "")}</div>,
    },
    {
      header: "Ngày tạo",
      cell: ({ row }) => (
        <div>
          {moment(get(row, "original.createdAt", "")).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-full flex justify-center items-center"
            onClick={() => {
              setIsConfirmOpen(true);
              setCertificateHistorySelected(row.original);
            }}
          >
            <CheckCircle className="h-5 w-5" color="#7C6C80" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full flex justify-center items-center"
            onClick={() => {
              setCertificateHistorySelected(row.original);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="h-5 w-5" color="#7C6C80" />
          </button>
        </div>
      ),
    },
  ];
  const columnsCertificateHistoriesVerified: ColumnDef<CertificateHistory>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Tên chứng chỉ",
      cell: ({ row }) => <span>{row.original.certificate.name}</span>,
    },
    {
      header: "Mô tả",
      cell: ({ row }) => (
        <div
          dangerouslySetInnerHTML={{
            __html: row.original.certificate.description || "",
          }}
        ></div>
      ),
    },
    {
      header: "Thuộc khoá học",
      cell: ({ row }) => (
        <div>{get(row, "original.certificate.course.name", "")}</div>
      ),
    },
    {
      header: "Học viên",
      cell: ({ row }) => <div>{get(row, "original.student.username", "")}</div>,
    },
    {
      header: "Ngày tạo",
      cell: ({ row }) => (
        <div>
          {moment(get(row, "original.createdAt", "")).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => <span></span>,
    },
  ];
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
            Quản lý chứng chỉ
          </div>
        </div>

        <Tabs
          tabs={tabs}
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
          className="w-full !justify-start space-x-5 px-4 border-b border-gray-20"
        />

        {activeTab.id === "pending" && (
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
              data={listCertificateUnVerified}
              isLoading={false}
              columns={columnsCertificateHistories}
              page={page}
              totalPage={totalPage}
              totalDocs={totalDocs}
              onPageChange={setPage}
              docsPerPage={limit}
              onPageSizeChange={setLimit}
            />
          </div>
        )}
        {activeTab.id === "verified" && (
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
              data={listCertificateVerified}
              isLoading={false}
              columns={columnsCertificateHistoriesVerified}
              page={page}
              totalPage={totalPage}
              totalDocs={totalDocs}
              onPageChange={setPage}
              docsPerPage={limit}
              onPageSizeChange={setLimit}
            />
          </div>
        )}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="w-[1300px] h-[800px] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Xác nhận phê duyệt chứng chỉ</DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2  gap-x-4 max-w-[500px]">
                  <div className="text-base font-medium text-gray-60">
                    Tên chứng chỉ:
                  </div>
                  <div className="text-base">
                    {certificateHistorySelected?.certificate.name}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 max-w-[500px]">
                  <div className="text-base font-medium text-gray-60">
                    Khoá học:
                  </div>
                  <div className="text-base">
                    {certificateHistorySelected?.certificate.course?.name}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 max-w-[500px]">
                  <div className="text-base font-medium text-gray-60">
                    Ngày tạo:
                  </div>
                  <div className="text-base">
                    {moment(
                      get(certificateHistorySelected, "createdAt", "")
                    ).format("DD/MM/YYYY")}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-base font-medium text-gray-60">
                    Xem trước chứng chỉ:
                  </div>
                  <div>
                    <CustomCertificateEditor
                      initialFields={
                        certificateHistorySelected?.certificate
                          .certificatePdfConfig?.fields
                          ? certificateHistorySelected?.certificate.certificatePdfConfig?.fields.map(
                              (field) => ({
                                id: String(field.id || Date.now()),
                                label: field.label || "",
                                value: field.value || "",
                                htmlContent: field.value || "",
                                position: {
                                  x: field.positionX || 0,
                                  y: field.positionY || 0,
                                },
                                fontSize: Number(field.fontSize) || 18,
                                fontWeight: field.fontWeight || "normal",
                                color: field.color || "#000000",
                                fontFamily: field.fontFamily || "Roboto",
                                textAlign: field.textAlign || "center",
                              })
                            )
                          : []
                      }
                      initialBackgroundImage={
                        certificateHistorySelected?.certificate
                          .certificatePdfConfig?.backgroundUrl || null
                      }
                      isPreviewCertificate={true}
                    />
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <CommonButton
              variant="secondary"
              onClick={() => setIsConfirmOpen(false)}
            >
              Hủy
            </CommonButton>
            <CommonButton onClick={handleConfirmVerified}>
              Xác nhận
            </CommonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="w-[480px] bg-white">
          <DialogHeader>
            <DialogTitle>Từ chối phê duyệt chứng chỉ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn từ chối phê duyệt chứng chỉ này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <CommonButton
              variant="secondary"
              onClick={() => setIsDeleteOpen(false)}
            >
              Hủy
            </CommonButton>
            <CommonButton onClick={handleConfirmDelete}>Xác nhận</CommonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
