"use client";
import { CommonButton } from "@/components/common/button/CommonButton";
import { PanelLeft, Trash, Plus, Pencil } from "lucide-react";
import { CommonCard } from "@/components/common/CommonCard";
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/common/Input";
import { useEffect, useState, useRef, useCallback } from "react";
import { useCertificate } from "@/hooks/useCertificate";
import { CertificateFormData, CreateCertificateModal } from "@/components/certificate/CreateCertificateModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import qs from "qs";
import { findCertificatePdfConfig, getCertificate, getCertificatePdfConfig, postCertificate, postCertificatePdfConfig, postCertificatePdfConfigField } from "@/requests/certificate";
import { Certificate, CertificatePdfFieldConfig, CertificatePdfConfig } from "@/types/certificate";
import { get } from "lodash";
import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { appendFormData } from "@/lib/utils";
import CertificateEditor, { CertificateField } from "@/components/certificate/CustomCertificateEditor";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";

// Mở rộng kiểu CertificateFormData để thêm các trường thiếu
interface ExtendedCertificateFormData extends CertificateFormData {
  type?: string;
}

// Hàm chuyển đổi từ CertificatePdfFieldConfig sang CertificateField
const convertToCertificateField = (fieldConfig: CertificatePdfFieldConfig): CertificateField => {
  return {
    id: String(fieldConfig.id || Date.now()),
    label: fieldConfig.label || "",
    value: fieldConfig.value || "",
    htmlContent: fieldConfig.value || "",
    position: {
      x: fieldConfig.positionX || 0,
      y: fieldConfig.positionY || 0
    },
    fontSize: Number(fieldConfig.fontSize) || 18,
    fontWeight: fieldConfig.fontWeight || "normal",
    color: fieldConfig.color || "#000000",
    fontFamily: fieldConfig.fontFamily || "Roboto",
    textAlign: fieldConfig.textAlign || "center",
  };
};

// Hàm chuyển đổi từ CertificateField sang CertificatePdfFieldConfig
const convertToPdfFieldConfig = (field: CertificateField): CertificatePdfFieldConfig => {
  return {
    label: field.label,
    value: field.htmlContent,
    fontSize: String(field.fontSize),
    fontWeight: field.fontWeight,
    color: field.color,
    fontFamily: field.fontFamily,
    positionX: field.position.x,
    positionY: field.position.y,
    textAlign: field.textAlign
  };
};

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

  // Thêm state để lưu trữ giá trị từ CertificateEditor
  const [certificateFields, setCertificateFields] = useState<CertificateField[]>([]);
  const [certificateBackground, setCertificateBackground] = useState<File | null>(null);
  const [certificateBackgroundUrl, setCertificateBackgroundUrl] = useState<string | null>(null);

  // Thêm refs để tránh vòng lặp vô hạn
  const fieldsChangeRef = useRef<string | null>(null);
  const backgroundChangeRef = useRef<string | null>(null);

  // Thêm state để theo dõi chứng chỉ đang chỉnh sửa
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  const [isOpenChooseCertificateForm, setIsOpenChooseCertificateForm] = useState(false)

  const [showLoading, hideLoading] = useLoadingStore((state) => [state.show, state.hide]);
  const [showError, showSuccess] = useSnackbarStore((state) => [state.error, state.success])

  const { handleSubmit } = useForm();

  // Handler cho việc cập nhật fields từ CertificateEditor
  const handleCertificateFieldsChange = (fields: CertificateField[]) => {
    setCertificateFields(fields);
    console.log("Fields updated:", fields);
  };

  // Handler cho việc cập nhật background từ CertificateEditor
  const handleCertificateBackgroundChange = (file: File | null, imageUrl: string | null) => {
    if (file) {
      setCertificateBackground(file);
    }
    if (imageUrl) {
      setCertificateBackgroundUrl(imageUrl);
    }
    console.log("Background updated:", { file, imageUrl });
  };

  // Handler khi xác nhận form chứng chỉ để truyền dữ liệu vào modal tạo chứng chỉ
  const handleConfirmWithCertificateModal = (modal: any) => {
    if (modal && typeof modal.updateFormWithCertificateData === 'function') {
      modal.updateFormWithCertificateData(certificateFields, certificateBackground);
    }
  };

  const { data: certificates, refetch: refetchCertificates } = useQuery({
    queryKey: ["certificates", page, limit, textSearch],
    queryFn: async () => {
      try {
        let queryString = "";
        if (textSearch !== "") {
          queryString = qs.stringify(
            {
              filters: {
                name: {
                  $containsi: textSearch
                }
              },
              populate: ['course', 'certificatePdfConfig', 'certificatePdfConfig.fields'],
              pagination: {
                page: page,
                pageSize: limit,
              },
            }
          )
        } else {
          queryString = qs.stringify(
            {
              populate: ['course', 'certificatePdfConfig', 'certificatePdfConfig.fields'],
            }
          )
        }
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
  const { data: CertificatePdfFieldConfig, refetch: refetchCertificatePdfFieldConfig } = useQuery({
    queryKey: ["CertificatePdfFieldConfig"],
    queryFn: async () => {
      try {
        const queryString = qs.stringify(
          {
            filters: {
              certificate: {
                id: {
                  $eq: editingCertificate?.certificatePdfConfig?.id
                }
              }
            },
            populate: ['fields'],
          }
        )
        const res = await findCertificatePdfConfig(queryString)
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

  const { mutate: createCertificateMutation } = useMutation({
    mutationFn: async (data: CertificateFormData) => {
      try {
        // Chuẩn bị dữ liệu cơ bản cho certificate
        const certificateData: any = {
          name: data.name,
          description: data.description,
          // Thêm các trường khác nếu cần từ data
          isHasValidation: data.isHasValidation
        };

        // Thêm course nếu có
        if (data.course) {
          certificateData.course = data.course;
        }

        // Kiểm tra xem có dữ liệu từ CertificateEditor không
        if (certificateFields.length > 0) {
          // BƯỚC 1: Tạo các trường config PDF
          const pdfFieldConfigs = certificateFields.map(convertToPdfFieldConfig);
          const createdFieldsPromises = pdfFieldConfigs.map(async (field) => {
            // Tạm thời loại bỏ id nếu có (vì đang tạo mới)
            const fieldData = { ...field };
            delete fieldData.id;

            const response = await postCertificatePdfConfigField(fieldData);
            return response.data;
          });

          // Chờ tất cả các trường được tạo
          const createdFields = await Promise.all(createdFieldsPromises);
          console.log("Created field configs:", createdFields);

          // BƯỚC 2: Tạo cấu hình PDF với danh sách trường đã tạo
          const pdfConfigFormData = new FormData();

          // Strapi yêu cầu dữ liệu dưới dạng JSON trong trường "data"
          pdfConfigFormData.append("name", data.name || "");
          // Sửa cách gửi fields để đảm bảo là mảng số
          const fieldIds = createdFields.map(field => Number(field.id));
          pdfConfigFormData.append("fields", JSON.stringify(fieldIds));

          // Thêm hình ảnh nền cho PDF Config nếu có
          if (certificateBackground) {
            pdfConfigFormData.append("backgroundUrl", certificateBackground);
          }

          // Tạo cấu hình PDF
          const pdfConfigResponse = await postCertificatePdfConfig(pdfConfigFormData);
          const createdPdfConfig = pdfConfigResponse;
          console.log("Created PDF config:", createdPdfConfig);

          // BƯỚC 3: Liên kết cấu hình PDF với certificate
          certificateData.certificatePdfConfig = createdPdfConfig.id;
          console.log("Certificate data with PDF config:", certificateData);
        }

        // BƯỚC 4: Tạo certificate
        // const certificateFormData = new FormData();
        // certificateFormData.set("name", get(certificateData, 'name', ''));
        // certificateFormData.set("description", get(certificateData, 'description', ''));
        // certificateFormData.set("isHasValidation", get(certificateData, 'isHasValidation', false));
        // if (get(certificateData, 'course')) {
        //   certificateFormData.set("course", get(certificateData, 'course'));
        // }
        // certificateFormData.set("certificatePdfConfig", get(certificateData, 'certificatePdfConfig', null));
        // Log data để debug
        const certificateFormData = {
          name: get(certificateData, 'name', ''),
          description: get(certificateData, 'description', ''),
          isHasValidation: get(certificateData, 'isHasValidation', false),
          course: Number(get(certificateData, 'course', null)),
          certificatePdfConfig: get(certificateData, 'certificatePdfConfig', null)
        }
        console.log("Final certificate data being sent:", certificateData);

        // Tạo chứng chỉ
        const result = await postCertificate(certificateFormData);
        return result;
      } catch (error) {
        console.error("Error in mutation function:", error);
        throw error; // Đảm bảo lỗi được chuyển tiếp cho onError handler
      }
    },
    onSuccess: (data) => {
      console.log("Certificate created successfully:", data);
      showSuccess('Tạo mới', 'Tạo chứng chỉ thành công!');
      refetchCertificates();
      setIsOpenCreateModal(false);
      // Reset các state
      setCertificateFields([]);
      setCertificateBackground(null);
      setCertificateBackgroundUrl(null);
    },
    onError: (error) => {
      console.error('Lỗi khi tạo chứng chỉ:', error);
      showError('Tạo mới', 'Tạo chứng chỉ thất bại!');
    },
    onSettled: () => {
      hideLoading();
    }
  });

  const handlePostCertificate = async (data: CertificateFormData) => {
    showLoading();
    createCertificateMutation(data);
  }

  const handleConfirmCertificateForm = () => {
    setIsOpenChooseCertificateForm(false);

    // Truyền dữ liệu cho modal tạo chứng chỉ nếu đang mở
    // @ts-ignore
    if (typeof window !== 'undefined' && window.currentCertificateModal) {
      // @ts-ignore
      handleConfirmWithCertificateModal(window.currentCertificateModal);
    }

    // Nếu đang chỉnh sửa chứng chỉ hiện có, cập nhật trực tiếp
    // if (editingCertificate) {
    //   try {
    //     showLoading();

    //     // Cập nhật chứng chỉ với quy trình tương tự
    //     const updateCertificate = async () => {
    //       // Chuẩn bị dữ liệu cơ bản
    //       const certificateData: any = {
    //         name: editingCertificate.name,
    //         description: editingCertificate.description
    //       };

    //       // Chuyển đổi các trường thành cấu trúc PdfFieldConfig
    //       const pdfFieldConfigs = certificateFields.map(convertToPdfFieldConfig);

    //       // Chuẩn bị formData cho việc tải lên
    //       const formData = new FormData();

    //       if (editingCertificate.certificatePdfConfig?.id) {
    //         // Nếu đã có certificatePdfConfig, cập nhật các trường và cấu hình

    //         // Tạo các trường config mới
    //         const createdFieldsPromises = pdfFieldConfigs.map(async (field) => {
    //           // Loại bỏ id để tạo mới
    //           const fieldData = { ...field };

    //           // Liên kết với config hiện có

    //           const response = await postCertificatePdfConfigField(fieldData);
    //           return response.data;
    //         });

    //         // Chờ tất cả các trường được tạo
    //         const createdFields = await Promise.all(createdFieldsPromises);
    //         console.log("Updated field configs:", createdFields);

    //         // 2. Cập nhật cấu hình PDF
    //         const pdfConfigData = {
    //           id: existingConfigId,
    //           name: editingCertificate.name,
    //           backgroundUrl: certificateBackgroundUrl,
    //           fields: createdFields.map(field => field.id)
    //         };

    //         // Cập nhật cấu hình PDF
    //         try {
    //           await postCertificatePdfConfig(pdfConfigData);
    //           console.log("Updated PDF config successfully");

    //           // Liên kết với certificate (sử dụng đúng kiểu)
    //           certificateData.certificatePdfConfig = { id: existingConfigId };
    //         } catch (configError) {
    //           console.error("Lỗi khi cập nhật config PDF:", configError);

    //           // Fallback: lưu dưới dạng JSON
    //           certificateData.certificateFields = JSON.stringify(certificateFields);
    //         }
    //       } else {
    //         // Nếu chưa có, tạo mới theo quy trình tương tự như tạo chứng chỉ mới

    //         // 1. Tạo các trường config trước
    //         const createdFieldsPromises = pdfFieldConfigs.map(async (field) => {
    //           const fieldData = { ...field };
    //           delete fieldData.id;

    //           const response = await postCertificatePdfConfigField(fieldData);
    //           return response.data;
    //         });

    //         // Chờ tất cả các trường được tạo
    //         const createdFields = await Promise.all(createdFieldsPromises);

    //         // 2. Tạo cấu hình PDF với các trường đã tạo
    //         const pdfConfigData = {
    //           name: editingCertificate.name,
    //           backgroundUrl: certificateBackgroundUrl,
    //           fields: createdFields.map(field => field.id)
    //         };

    //         try {
    //           const pdfConfigResponse = await postCertificatePdfConfig(pdfConfigData);
    //           const createdConfig = pdfConfigResponse.data;

    //           // 3. Liên kết với certificate (sử dụng đúng kiểu)
    //           certificateData.certificatePdfConfig = { id: createdConfig.id };
    //         } catch (configError) {
    //           console.error("Lỗi khi tạo config PDF:", configError);

    //           // Fallback: lưu dưới dạng JSON
    //           certificateData.certificateFields = JSON.stringify(certificateFields);
    //         }
    //       }

    //       // Thêm dữ liệu vào formData
    //       formData.append("data", JSON.stringify(certificateData));

    //       // Thêm file ảnh nền nếu có
    //       if (certificateBackground) {
    //         formData.append("files.imgUrl", certificateBackground);
    //       }

    //       // TODO: Thêm hàm updateCertificate vào certificate.ts và gọi ở đây
    //       // const result = await updateCertificate(editingCertificate.id, formData);

    //       hideLoading();
    //       showSuccess('Cập nhật', 'Cập nhật chứng chỉ thành công!');
    //       setEditingCertificate(null);
    //     };

    //     // Gọi hàm cập nhật
    //     updateCertificate().catch(error => {
    //       console.error('Lỗi khi cập nhật chứng chỉ:', error);
    //       hideLoading();
    //       showError('Lỗi', 'Không thể cập nhật chứng chỉ');
    //       setEditingCertificate(null);
    //     });
    //   } catch (error) {
    //     console.error('Lỗi xử lý:', error);
    //     hideLoading();
    //     showError('Lỗi', 'Không thể xử lý yêu cầu');
    //     setEditingCertificate(null);
    //   }
    // }

    // Xử lý logic hiện tại
    console.log("Certificate fields:", certificateFields);
    console.log("Certificate background:", certificateBackground);
  };

  const handleConfirmData = () => {
    // Xử lý logic khi nhấn nút xác nhận
    handleConfirmCertificateForm();
  };

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
          {
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
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // Chuẩn bị dữ liệu cho việc chỉnh sửa
                  const certificateData = row.original;

                  // Lưu chứng chỉ đang chỉnh sửa
                  setEditingCertificate(certificateData);

                  // Kiểm tra và tải thông tin cấu hình PDF nếu có
                  if (certificateData.certificatePdfConfig) {
                    // Nếu có certificatePdfConfig, sử dụng nó
                    const { certificatePdfConfig } = certificateData;

                    // Lấy URL ảnh nền
                    setCertificateBackgroundUrl(certificatePdfConfig.backgroundUrl || null);
                    setCertificateBackground(null); // Reset file

                    // Chuyển đổi các trường
                    if (certificatePdfConfig.fields && Array.isArray(certificatePdfConfig.fields)) {
                      const convertedFields = certificatePdfConfig.fields.map(convertToCertificateField);
                      setCertificateFields(convertedFields);
                    } else {
                      setCertificateFields([]);
                    }
                  } else {
                    // Backup plan: sử dụng certificateFields như trước nếu không có certificatePdfConfig
                    try {
                      // Tải thông tin trường nếu có
                      const certificateFieldsData = certificateData.certificateFields ?
                        JSON.parse(certificateData.certificateFields) : [];
                      setCertificateFields(certificateFieldsData);
                    } catch (error) {
                      console.error('Không thể phân tích dữ liệu trường:', error);
                      setCertificateFields([]);
                    }

                    // Đặt URL ảnh nền
                    setCertificateBackground(null); // Reset file
                  }

                  // Mở form chỉnh sửa
                  setIsOpenChooseCertificateForm(true);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" color="#7C6C80">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
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
      <CreateCertificateModal open={isOpenCreateModal} onOpenChange={(value) => { setIsOpenCreateModal(value) }} onSubmit={handlePostCertificate} onChooseCertificateForm={() => {
        // Mở cửa sổ chọn form chứng chỉ và sử dụng dữ liệu hiện tại
        setIsOpenChooseCertificateForm(true)
      }} />
      {isOpenChooseCertificateForm && (
        <Dialog open={isOpenChooseCertificateForm} onOpenChange={setIsOpenChooseCertificateForm}>
          <DialogContent className="max-w-[80%] h-[80vh] overflow-y-auto !bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Tùy chỉnh mẫu chứng chỉ</DialogTitle>
              <DialogDescription>
                Thiết kế mẫu chứng chỉ của bạn với các trường tùy chỉnh.
              </DialogDescription>
            </DialogHeader>

            <CertificateEditor
              initialFields={certificateFields}
              initialBackgroundImage={certificateBackgroundUrl}
              onFieldsChange={handleCertificateFieldsChange}
              onBackgroundChange={handleCertificateBackgroundChange}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpenChooseCertificateForm(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleConfirmData}>Xác nhận</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
