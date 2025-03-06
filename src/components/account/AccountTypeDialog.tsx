"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { StudentRegistrationDialog } from "./StudentRegistrationDialog";
import { TeacherRegistrationDialog } from "./TeacherRegistrationDialog";
import { ManagerRegistrationDialog } from "./ManagerRegistrationDialog";
import { AdminRegistrationDialog } from "./AdminRegistrationDialog";
import Image from "next/image";
import { CommonButton } from "../common/button/CommonButton";
import { ReqRegister } from "@/requests/login";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { HandleReturnMessgaeErrorAxios } from "@/requests/return-message-error";

type AccountType = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconSelected: React.ReactNode;
};

const listImagesAccount = {
  student: "/admin/account/student.png",
  studentSelected: "/admin/account/student-selected.png",
  teacher: "/admin/account/teacher.png",
  teacherSelected: "/admin/account/teacher-selected.png",
  manager: "/admin/account/manager.png",
  managerSelected: "/admin/account/manager-selected.png",
};

const CustomImageCreateAccount = ({ src }: { src: string }) => {
  return <Image src={src} alt="" width={128} height={128} />;
};

const accountTypes: AccountType[] = [
  {
    id: "student",
    title: "HỌC VIÊN",
    description: "Tài khoản cho học sinh",
    icon: <CustomImageCreateAccount src={listImagesAccount.student} />,
    iconSelected: (
      <CustomImageCreateAccount src={listImagesAccount.studentSelected} />
    ),
  },
  {
    id: "teacher",
    title: "GIẢNG VIÊN",
    description: "Tài khoản dành cho giảng viên và trợ giảng",
    icon: <CustomImageCreateAccount src={listImagesAccount.teacher} />,
    iconSelected: (
      <CustomImageCreateAccount src={listImagesAccount.teacherSelected} />
    ),
  },
  {
    id: "manager",
    title: "QUẢN LÝ LỚP",
    description: "Tài khoản dành cho nhân viên quản lý lớp học",
    icon: <CustomImageCreateAccount src={listImagesAccount.manager} />,
    iconSelected: (
      <CustomImageCreateAccount src={listImagesAccount.managerSelected} />
    ),
  },
  {
    id: "admin",
    title: "QUẢN TRỊ VIÊN",
    description: "Tài khoản quản lý hệ thống, duyệt và phê duyệt",
    icon: <CustomImageCreateAccount src={listImagesAccount.teacher} />,
    iconSelected: (
      <CustomImageCreateAccount src={listImagesAccount.teacherSelected} />
    ),
  },
];

interface AccountTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (accountType: string) => void;
}

export const AccountTypeDialog = ({
  open,
  onOpenChange,
  onSelect,
}: AccountTypeDialogProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store hooks
  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (selectedType === "student") {
      setShowStudentForm(true);
    } else if (selectedType === "teacher") {
      setShowTeacherForm(true);
    } else if (selectedType === "manager") {
      setShowManagerForm(true);
    } else if (selectedType === "admin") {
      setShowAdminForm(true);
    }
  };

  const handleRegister = async (data: any) => {
    try {
      setIsSubmitting(true);
      show();
      await ReqRegister(data);
      success(
        "Thành công",
        `Đăng ký tài khoản ${
          data.user_role === 1
            ? "học viên"
            : data.user_role === 2
            ? "giảng viên"
            : data.user_role === 3
            ? "quản lý"
            : "quản trị viên"
        } thành công`
      );
      onSelect(selectedType!);
      onOpenChange(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      const message = await HandleReturnMessgaeErrorAxios(err);
      error("Lỗi", message);
    } finally {
      setIsSubmitting(false);
      hide();
    }
  };

  if (showManagerForm) {
    return (
      <ManagerRegistrationDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowManagerForm(false);
            setSelectedType(null);
          }
          onOpenChange(true);
        }}
        onRegister={handleRegister}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (showAdminForm) {
    return (
      <AdminRegistrationDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowAdminForm(false);
            setSelectedType(null);
          }
          onOpenChange(true);
        }}
        onRegister={handleRegister}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (showTeacherForm) {
    return (
      <TeacherRegistrationDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowTeacherForm(false);
            setSelectedType(null);
          }
          onOpenChange(true);
        }}
        onRegister={handleRegister}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (showStudentForm) {
    return (
      <StudentRegistrationDialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowStudentForm(false);
            setSelectedType(null);
          }
          onOpenChange(true);
        }}
        onRegister={handleRegister}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[896px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="text-HeadingSm text-gray-95">
            Tạo tài khoản mới
          </DialogTitle>
          <div className="text-gray-60 mb-4 text-BodyMd">
            Lựa chọn loại tài khoản
          </div>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 p-4">
          {accountTypes.map((type) => (
            <div
              key={type.id}
              className={cn(
                "flex flex-col items-center justify-center h-[220px] rounded-xl border-2",
                selectedType === type.id
                  ? "border-primary-60 bg-gray-00 border-4"
                  : "border-gray-20",
                "hover:border-primary-25  hover:bg-primary-25 cursor-pointer transition-all"
              )}
              onClick={() => handleTypeSelect(type.id)}
              role="button"
              tabIndex={0}
            >
              <div className="w-full h-4/6 flex items-center justify-center">
                {selectedType === type.id ? type.iconSelected : type.icon}
              </div>
              <div className="flex flex-col items-center w-full h-2/6">
                <h3 className="text-SubheadMd text-gray-95">{type.title}</h3>
                <p className="text-BodyXs text-gray-600 text-center">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 border-t pt-4 px-4">
          <CommonButton
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors h-[44px] w-[83px]"
            variant="secondary"
            onClick={() => {
              setSelectedType(null);
              onOpenChange(false);
            }}
          >
            Thoát
          </CommonButton>
          <CommonButton
            className={cn(
              "h-11 w-[122px] flex items-center justify-center gap-2"
            )}
            onClick={handleContinue}
            disabled={!selectedType}
          >
            <div>Tiếp tục</div> <ArrowRight className="mt-1" />
          </CommonButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
