"use client";
//it with user_role is 4
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonButton } from "../common/button/CommonButton";
import { Input } from "@/components/common/Input";

interface AdminRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (data: AdminFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const adminFormSchema = z.object({
  username: z.string().min(1, "Tên tài khoản là bắt buộc"),
  password: z.string().optional(),
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  fullName: z.string().min(1, "Tên quản trị viên là bắt buộc"),
  dateOfBirth: z.string().min(1, "Ngày sinh là bắt buộc"),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{10}$/.test(val),
      "Số điện thoại phải có 10 chữ số"
    ),
  user_role: z.number().optional(),
});

type AdminFormData = z.infer<typeof adminFormSchema>;

const FormInput = ({ name, error, value, onChange, ...props }: any) => (
  <div className="flex-1">
    <Input
      {...props}
      name={name}
      value={value || ""}
      onChange={onChange}
      customClassNames={error ? "border-red-500" : props.customClassNames}
    />
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
);

export const AdminRegistrationDialog = ({
  open,
  onOpenChange,
  onRegister,
  isSubmitting = false,
}: AdminRegistrationDialogProps) => {
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      dateOfBirth: "",
      phoneNumber: "",
      password: "123123", // default password
      user_role: 4, // admin role
    },
  });

  const values = watch();

  const handleInputChange = (name: keyof AdminFormData) => (value: string) => {
    setValue(name, value, { shouldValidate: true });
  };

  const onSubmit = async (data: AdminFormData) => {
    await onRegister(data);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
            Đăng ký tài khoản quản trị viên
          </DialogTitle>
          <div className="text-BodyMd text-gray-60 mb-4">
            Mật khẩu mặc định là 123123 cho đến khi người dùng tự thay đổi
          </div>
        </DialogHeader>

        <form className="space-y-4 p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">Tên tài khoản</div>
              <FormInput
                name="username"
                type="text"
                placeholder="Nhập thông tin"
                value={values.username}
                onChange={handleInputChange("username")}
                error={errors.username}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">Email</div>
              <FormInput
                name="email"
                type="email"
                placeholder="Nhập thông tin"
                value={values.email}
                onChange={handleInputChange("email")}
                error={errors.email}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">Tên quản trị viên</div>
              <FormInput
                name="fullName"
                type="text"
                placeholder="Nhập thông tin"
                value={values.fullName}
                onChange={handleInputChange("fullName")}
                error={errors.fullName}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">
                Ngày tháng năm sinh
              </div>
              <FormInput
                name="dateOfBirth"
                type="date"
                placeholder="DD/MM/YYYY"
                value={values.dateOfBirth}
                onChange={handleInputChange("dateOfBirth")}
                error={errors.dateOfBirth}
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[160px] text-SubheadMd">
                Số điện thoại{" "}
                <span className="text-BodyMd text-gray-60">
                  (Không bắt buộc)
                </span>
              </div>
              <FormInput
                name="phoneNumber"
                type="text"
                placeholder="Nhập thông tin"
                value={values.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
                error={errors.phoneNumber}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <CommonButton
              className="w-[83px] h-11"
              variant="secondary"
              onClick={handleClose}
            >
              Thoát
            </CommonButton>
            <CommonButton
              className="h-11 w-[139px]"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </CommonButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
