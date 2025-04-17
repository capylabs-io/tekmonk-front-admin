"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import { PanelLeft } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/common/Input";
import { useEffect, useState } from "react";
import { useCertificate } from "@/hooks/useCertificate";
import { CertificateFormData, CreateCertificateModal } from "@/components/certificate/CreateCertificateModal";
import { useQuery } from "@tanstack/react-query";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import qs from "qs";
import { getCertificate, postCertificate } from "@/requests/certificate";
import { Certificate } from "@/types/certificate";
import { get } from "lodash";
import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { appendFormData } from "@/lib/utils";
import CertificateEditor from "@/components/certificate/CustomCertificateEditor";

export default function Page() {
  const { totalPage,
    totalDocs,
    limit,
    page,
    isOpenCreateModal,
    setLimit,
    setPage,
    setIsOpenCreateModal,
    setTotalDocs,
    setTotalPage
  } = useCertificate()

  const [searchQuery, setSearchQuery] = useState("");
  const [textSearch, setTextSearch] = useState("");



  const [isMounted, setIsMounted] = useState(false);

  const [isOpenChooseCertificateForm, setIsOpenChooseCertificateForm] = useState(false)

  const [showLoading, hideLoading] = useLoadingStore((state) => [state.show, state.hide]);
  const [showError, showSuccess] = useSnackbarStore((state) => [state.error, state.success])

  const { data: certificates, refetch: refetchCertificates } = useQuery({
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

  const handleSearch = () => {
    setSearchQuery(textSearch);
  };
  const handlePostCertificate = async (data: CertificateFormData) => {
    try {
      showLoading()
      const formData = new FormData()
      appendFormData(formData, data)
      if (data.imgUrl) {
        formData.append("imgUrl", data.imgUrl)
      }
      const res = await postCertificate(formData)
      if (res) {
        showSuccess('Tạo mới', 'Nhiệm vụ tạo mới thành công!')
      }
    } catch (error) {
      console.log('error', error);
      showError('Tạo mới', 'Nhiệm vụ tạo mới thất bại!')
      hideLoading()
    } finally {
      hideLoading()
      refetchCertificates()
      setIsOpenCreateModal(false)
    }
  }


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columnsCustomList: ColumnDef<Certificate>[] =
    [
      {
        header: 'STT',
        cell: ({ row }) => <span>{row.index + 1}</span>,

      },
      {
        header: 'Hình nền',
        cell: ({ row }) => (
          <div className="bg-center bg-no-repeat bg-cover h-[80px] rounded-xl w-[130px]"
            style={{
              backgroundImage: `url(${row.original?.imgUrl})`
            }}>
          </div>
        ),
      },
      {
        header: 'Tên chứng chỉ',
        cell: ({ row }) => <span>{row.original.name}</span>,
      },
      {
        header: 'Mô tả',
        cell: ({ row }) => <div
          dangerouslySetInnerHTML={{
            __html: row.original.description || "",
          }}
        ></div>
      },
      {
        header: 'Thuộc khoá học',
        cell: ({ row }) => <div>
          {-
            get(row, 'original.course.name', '')
          }
        </div>
      },
      {
        id: 'action',
        header: '',
        cell: ({ row }) => {
          return (
            <div className="flex gap-2">
              {/* <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpenCreateModal(true)
                  // Add edit handler here
                }}
              >
                <Edit className="h-4 w-4" color="#7C6C80" />
              </button> */}
              {/* <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add edit handler here
                }}
              >
                <Trash2 className="h-4 w-4" color="#7C6C80" />
              </button> */}
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
            Cấu hình chứng chỉ
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
            <CommonButton
              variant="primary"
              className="h-9 !w-max px-6"
              onClick={() => setIsOpenCreateModal(true)}
            >
              Tạo mới
            </CommonButton>
          </div>
          <CommonTable
            data={certificates ? certificates.data : []}
            isLoading={false}
            columns={columnsCustomList}
            page={page}
            totalPage={totalPage}
            totalDocs={totalDocs}
            onPageChange={setPage}
            docsPerPage={limit}
            onPageSizeChange={setLimit}
          />
        </div>

      </div>
      <CreateCertificateModal open={isOpenCreateModal} onOpenChange={(value) => { setIsOpenCreateModal(value) }} onSubmit={handlePostCertificate} onChooseCertificateForm={() => { setIsOpenChooseCertificateForm(true) }} />
      <Dialog open={isOpenChooseCertificateForm} onOpenChange={setIsOpenChooseCertificateForm}>
        <DialogContent className="w-[calc(100vw-20%)] h-[calc(100vh-10%)] bg-white flex flex-col">
          <DialogHeader className="h-full !overflow-y-auto grow">
            <DialogTitle className="text-2xl">Chọn form chứng chỉ</DialogTitle>
            <CertificateEditor />
          </DialogHeader>
          <DialogFooter className="h-[50px]">
            <CommonButton
              variant="secondary"
              onClick={() => setIsOpenChooseCertificateForm(false)}
            >
              Hủy
            </CommonButton>
            <CommonButton onClick={() => { setIsOpenChooseCertificateForm(false) }}>Xác nhận</CommonButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
