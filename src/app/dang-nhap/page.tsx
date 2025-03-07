"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/UserStore";
import "react-toastify/dist/ReactToastify.css";
import { Role } from "@/contants/role";
import { get } from "lodash";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { HandleReturnMessgaeErrorLogin } from "@/requests/return-message-error";
import { Input } from "@/components/common/Input";
import { CommonButton } from "@/components/common/button/CommonButton";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { postLogin } from "@/requests/login";
import { ROUTE } from "@/contants/router";

// Define validation schema using zod
const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập tên tài khoản hoặc email"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isClient, setIsClient] = useState(false);
  const [login, clear] = useUserStore((state) => [state.login, state.clear]);
  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [error, success, warn] = useSnackbarStore((state) => [
    state.error,
    state.success,
    state.warn,
  ]);

  const router = useCustomRouter();

  // Initialize react-hook-form
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const handleForgotPassword = () => {
    router.push("/doi-mat-khau-moi");
  };

  const onSubmit = async (data: LoginFormValues) => {
    show();

    try {
      // Call the login API
      await postLogin({
        identifier: data.identifier,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      const resUserInfo = await login({
        identifier: data.identifier,
        password: data.password,
      });

      const roleName = get(resUserInfo, ["role", "code"], "");

      switch (roleName) {
        case Role.TEACHER:
          success("Xong!", "Chúc mừng bạn đã đăng nhập thành công");
          router.push(ROUTE.MY_CLASS);
          break;
        case Role.CLASSMANAGEMENT:
          success("Xong!", "Chúc mừng bạn đã đăng nhập thành công");
          router.push(ROUTE.MANAGE_CLASS);
          break;
        case Role.MODERATOR:
          success("Xong!", "Chúc mừng bạn đã đăng nhập thành công");
          router.push(ROUTE.LOGIN);
          break;
        case Role.STUDENT:
          warn("Lỗi", "Bạn không có quyền truy cập vào hệ thống");
          clear();
          break;
        default:
          error("Lỗi", "Đăng nhập thất bại, vui lòng thử lại sau");
          break;
      }
    } catch (err) {
      const message = HandleReturnMessgaeErrorLogin(err);
      error("Lỗi", message);
    } finally {
      hide();
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <div className="mx-auto min-h-[calc(100vh-64px)] flex justify-center items-center p-2">
        <div
          className="w-[368px] min-h-[430px] mx-auto flex flex-col gap-6 border border-gray-20 p-6 bg-gray-00 rounded-2xl"
          style={{
            boxShadow: "0px 4px 0px #DDD0DD",
          }}
        >
          <div className="w-full">
            <div className="text-HeadingSm text-gray-95">Đăng nhập</div>
            <div className="text-BodySm text-gray-60">
              Tham gia ngay vào cộng đồng Tekmonk
            </div>
          </div>
          <FormProvider {...methods}>
            <form className="flex flex-col gap-4">
              <div className="w-full flex flex-col gap-2">
                <div className="text-SubheadSm text-gray-60">
                  Tên tài khoản hoặc email
                </div>
                <Controller
                  name="identifier"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      customClassNames="h-[48px]"
                      placeholder="Tên tài khoản hoặc email"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.identifier?.message}
                    />
                  )}
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <div className="text-SubheadSm text-gray-60">Mật khẩu</div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="password"
                      customClassNames="h-[48px]"
                      placeholder="Mật khẩu"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.password?.message}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <CommonButton className="h-12" onClick={handleSubmit(onSubmit)}>
                  Đăng Nhập
                </CommonButton>
                <CommonButton
                  className="h-12"
                  variant="secondary"
                  onClick={handleForgotPassword}
                >
                  Quên mật khẩu
                </CommonButton>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    )
  );
}
