"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../common/Input";
import { Controller, useFormContext } from "react-hook-form";
import { WizardSchema } from "@/validation/ContestRegister";
import { useEffect, useState } from "react";
import { useSnackbarStore } from "@/store/SnackbarStore";
type InvalidCodeCombat = {
  username: boolean;
  email: boolean;
  other: boolean;
  reload: boolean; // for reload Step 2 when create user fail
};

export const Step2 = ({
  stateCodeCombat,
}: {
  stateCodeCombat: InvalidCodeCombat;
}) => {
  //use state
  const [isvalidCodeCombat, setIsvalidCodeCombat] = useState(stateCodeCombat);

  const [error] = useSnackbarStore((state) => [state.error]);
  const {
    control,
    formState: { errors },
  } = useFormContext<WizardSchema>();

  //use Effect
  useEffect(() => {
    setIsvalidCodeCombat(stateCodeCombat);
    if (stateCodeCombat.other) {
      //show snackbar here
      error("lỗi", "Có lỗi xảy ra khi tạo tài khoản code combat");
    }
  }, [stateCodeCombat.reload]);

  //custom className
  const customInputClassNames = "max-mobile:placeholder:text-base";
  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-950 text-SubheadSm">
              Email đăng ký dự thi <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="stepTwo.email"
              render={({ field: { value, onChange }, fieldState }) => (
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    setIsvalidCodeCombat({ ...stateCodeCombat, email: false });
                  }}
                  placeholder="Câu trả lời"
                  customClassNames="mt-2 mb-0"
                  customInputClassNames={customInputClassNames}
                  error={fieldState && fieldState.error?.message}
                />
              )}
            />
            {isvalidCodeCombat.email && (
              <p className="text-red-500">Email đã tồn tại</p>
            )}
          </div>
          <div>
            <Label className="text-gray-950 text-SubheadSm">
              Tên đăng nhập <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="stepTwo.username"
              render={({ field: { value, onChange }, fieldState }) => (
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    setIsvalidCodeCombat({
                      ...stateCodeCombat,
                      username: false,
                    });
                  }}
                  placeholder="Câu trả lời"
                  customClassNames="mt-2 mb-0"
                  customInputClassNames={customInputClassNames}
                  error={fieldState && fieldState.error?.message}
                />
              )}
            />
            {isvalidCodeCombat.username && (
              <p className="text-red-500">Tên đăng nhập đã tồn tại</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Label className="text-gray-950 text-SubheadSm">
              Mật khẩu <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                control={control}
                name="stepTwo.password"
                render={({ field: { value, onChange }, fieldState }) => (
                  <Input
                    type="password"
                    value={value}
                    onChange={onChange}
                    placeholder="Câu trả lời"
                    customClassNames="mt-2 mb-0"
                    customInputClassNames={customInputClassNames}
                    error={fieldState && fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
          <div className="relative">
            <Label className="text-gray-950 text-SubheadSm">
              Nhập lại mật khẩu <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Controller
                control={control}
                name="stepTwo.confirmPassword"
                render={({ field: { value, onChange }, fieldState }) => (
                  <Input
                    type="password"
                    value={value}
                    onChange={onChange}
                    placeholder="Câu trả lời"
                    customClassNames="mt-2 mb-0"
                    customInputClassNames={customInputClassNames}
                    error={fieldState && fieldState.error?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm mt-4 font-bold">
        Lưu ý: Email chưa từng tạo tài khoản trên nền tảng CodeCombat.
      </div>
    </>
  );
};
