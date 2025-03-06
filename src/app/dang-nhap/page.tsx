"use client";
import { useState } from "react";
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

export default function Login() {
  const [user, setUser] = useState({
    identifier: "",
    password: "",
  });

  const [login] = useUserStore((state) => [state.login]);

  const [isShowing, show, hide] = useLoadingStore((state) => [
    state.isShowing,
    state.show,
    state.hide,
  ]);
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);

  const router = useCustomRouter();

  const handleChangeUsername = (identifier: string) => {
    setUser((prevState) => ({
      ...prevState,
      identifier,
    }));
  };

  const handChangePassword = (password: string) => {
    setUser((prevState) => ({
      ...prevState,
      password,
    }));
  };

  const handleForgotPassword = () => {
    router.push("/doi-mat-khau-moi");
  };

  const handleLogin = async () => {
    show();

    try {
      const resUserInfo = await login(user);

      const roleName = get(resUserInfo, "role.name", "").toLowerCase();

      if (roleName === Role.STUDENT) {
        success("Xong!", "Chúc mừng bạn đã đăng nhập thành công");
        router.push("/");
      } else {
        useUserStore.getState().clear();
        setUser({
          identifier: "",
          password: "",
        });
        error("Lỗi", "Đăng nhập thất bại, vui lòng thử lại sau");
      }
    } catch (err) {
      // setUser({
      //   identifier: "",
      //   password: "",
      // });
      const message = HandleReturnMessgaeErrorLogin(err);
      error("Lỗi", message);
    } finally {
      hide();
    }
  };

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] flex justify-center items-center p-2">
      <div
        className="w-[368px] h-[468px] mx-auto flex flex-col gap-6 border border-gray-20 p-6 bg-gray-00 rounded-2xl"
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
        <div className="flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2">
            <div className="text-SubheadSm text-gray-60">
              Tên tài khoản hoặc email
            </div>
            <Input
              type="text"
              customClassNames="h-[48px]"
              placeholder="Tên tài khoản hoặc email"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="text-SubheadSm text-gray-60">Mật khẩu</div>
            <Input
              type="password"
              customClassNames="h-[48px]"
              placeholder="Mật khẩu"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-[20px] h-[20px] text-red-500 accent-primary-80 
             appearance-none bg-white border border-gray-20 rounded-[4px] outline-none 
             focus:ring-0 focus:outline-none checked:appearance-auto"
            />

            <div>Lưu trạng thái đăng nhập</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <CommonButton className="h-12" onClick={handleLogin}>
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
      </div>
    </div>
  );
}
