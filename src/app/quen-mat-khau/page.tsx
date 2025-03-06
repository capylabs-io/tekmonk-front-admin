"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/validation/ForgotPassword";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/button/Button";
import { forgotPasswordRequest } from "@/requests/forgot-password";
import { MoveRight } from "lucide-react";
import { get } from "lodash";

export default function ForgotPassword() {
  const router = useRouter();

  const [isSendMail, setIsSendMail] = useState(false);
  const [error] = useSnackbarStore((state) => [state.error]);
  const [email, setEmail] = useState("");
  const handleSendEmail = async (data: any) => {
    setEmail(data.email);
    try {
      const res = await forgotPasswordRequest(get(data, "email", email));
      if (res) {
        setIsSendMail(true);
        return;
      }
      error("Lỗi!", "Email không tồn tại");
    } catch (err) {
      error("Lỗi!", "Lỗi không xác định, vui lòng thử lại sau");
    }
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });
  return (
    <div className="w-full overflow-x-hidden grid grid-cols-2 max-[819px]:grid-cols-1 h-screen black">
      <div className="relative flex flex-col items-center h-screen">
        <div className="flex w-full gap-2.5 absolute top-10 left-10">
          <svg
            className="w-2 fill-primary-700"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <div
            className="text-primary-700 font-semibold text-base hover:cursor-pointer"
            onClick={() => router.back()}
          >
            Quay lại
          </div>
        </div>
        <div className="max-w-[372px] flex flex-col justify-center items-center mt-[180px]">
          {!isSendMail ? (
            <div className="max-mobile:p-2">
              <div className="text-primary-900 text-2xl font-bold text-center">
                Quên mật khẩu?
              </div>
              <div className="text-bodyLg text-base text-gray-800 mt-3">
                Nhập email mà bạn đã dùng để đăng ký tham dự cuộc thi để tiếp
                tục
              </div>
              <Controller
                name="email"
                control={control}
                render={({ field: { value, onChange }, fieldState }) => (
                  <Input
                    type="text"
                    placeholder="Tài khoản email"
                    customClassNames="w-full mt-8 "
                    value={value}
                    onChange={onChange}
                    error={fieldState && fieldState.error?.message}
                  />
                )}
              />

              <Button
                className="mt-8 w-full !rounded-[3rem]"
                onClick={handleSubmit(handleSendEmail)}
              >
                <div className="flex items-center gap-x-2">
                  Tiếp theo{" "}
                  <MoveRight className="mt-0.5" size={16} strokeWidth={4} />
                </div>
              </Button>
            </div>
          ) : (
            <>
              <div className="max-w-[372px] max-mobile:p-3">
                <div className="text-SubheadXl text-primary-900">
                  Làm theo hướng dẫn
                </div>
                <div className="mt-2 text-bodyLg">
                  Chúng tôi đã gửi hướng dẫn để thiết lập lại mật khẩu tài khoản
                  của bạn tới email: <div className="font-bold">{email}.</div>{" "}
                  Vui lòng kiểm tra email và làm theo hướng dẫn.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-[url('/login.jpg')] bg-no-repeat !bg-center bg-cover"></div>
    </div>
  );
}
