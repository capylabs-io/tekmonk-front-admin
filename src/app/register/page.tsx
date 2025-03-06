"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/button/Button";
import { useUserStore } from "@/store/UserStore";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { Role } from "@/contants/role";
import { get } from "lodash";
import { Loading } from "@/components/common/Loading";
import { useLoadingStore } from "@/store/LoadingStore";
import { RadioGroup } from "@/components/common/RadioGroup";

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [register] = useUserStore((state) => [state.register]);

  const [isShowing, show, hide] = useLoadingStore((state) => [
    state.isShowing,
    state.show,
    state.hide,
  ]);

  const router = useRouter();

  const handleChangeUsername = (username: string) => {
    setUser((prevState) => ({
      ...prevState,
      username,
    }));
  };

  const handleChangeEmail = (email: string) => {
    setUser((prevState) => ({
      ...prevState,
      email,
    }));
  };

  const handChangePassword = (password: string) => {
    setUser((prevState) => ({
      ...prevState,
      password,
    }));
  };

  const handleRegister = async () => {
    show();
    try {
      const userInfo = await register(user);
      const roleName = get(userInfo, "username", "").toLowerCase();

      if (roleName !== "") {
        router.push("/home");
      } else {
        useUserStore.getState().clear();
        toast.error("Register Fail");
      }
    } catch (error) {
      toast.error("Register Fail");
    } finally {
      hide();
    }
  };

  return (
    <div className="w-full grid grid-cols-2 h-screen">
      <div className="flex flex-col justify-center items-center h-screen relative">
        <div className="w-11/12 -mt-5 absolute top-10 left-2 ">
          <Image
            src="/image/app-logox2.png"
            alt="app logo"
            width={159}
            height={32}
          />
        </div>
        <div className="w-[372px]">
          <div className="flex w-full gap-2.5">
            <svg
              className="w-2 fill-primary-700"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            <div
              className="text-primary-700 font-semibold text-base hover:cursor-pointer"
              onClick={() => router.push("/dang-nhap")}
            >
              Quay lại
            </div>
          </div>
          <div className="text-primary-900 text-center mt-7 text-Subhead3Xl">
            Đăng ký
          </div>

          <div className="text-gray-800 text-center mt-3 text-bodyLg ">
            Chỉ cần 30s là đã có ngay tài khoản TekMonk
          </div>
          <div
            className="w-[348px] text-gray-950 text-SubheadMd mt-8"
            style={{}}
          >
            Họ tên
          </div>
          <div className="w-full mt-2 flex flex-col gap-y-2">
            <Input
              type="text"
              placeholder="Nhập họ tên tên của bạn"
              customClassNames="w-full"
              value={user.username}
              onChange={handleChangeUsername}
            />
            <div className=" text-gray-950 text-SubheadMd mt-4">Email</div>
            <Input
              type="text"
              placeholder="Nhập tên tài khoản email của bạn"
              customClassNames="w-full min-h-[25px]"
              value={user.email}
              onChange={handleChangeEmail}
            />
            <div className="text-gray-950 text-SubheadMd mt-4">Mật khẩu</div>
            <Input
              type="password"
              placeholder="Nhập mật khẩu"
              value={user.password}
              onChange={handChangePassword}
            />
            <div className="flex mt-4">
              {/*handle button check box here*/}
              <input
                type="checkbox"
                className="w-5 h-5 rounded-3xl bg-gray-100 border-gray-300 mr-2 font-semibold"
              />
              <div className="text-bodyLg text-gray-950">
                Tôi đồng ý với các điều khoản
              </div>
            </div>
            <Button
              className="mt-8 rouned-[3rem]"
              style={{
                borderRadius: "3rem",
              }}
              onClick={handleRegister}
            >
              Tạo tài khoản
            </Button>
          </div>
        </div>

        {/* @TODO: forget passwork function */}
        {/* <div className="text-gray-600 text-sm text-center mt-5">
          Quên mật khẩu?
        </div> */}
      </div>
      <div className="bg-[url('/image/login/login-banner.png')] bg-no-repeat !bg-right bg-cover"></div>
      {/* <ToastContainer /> */}
      {isShowing && <Loading />}
    </div>
  );
}
