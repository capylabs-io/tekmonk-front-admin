import React from "react";
import Image from "next/image";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function Login() {
  return (
    <div className="w-full grid grid-cols-2 h-screen">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/image/app-logox2.png"
          alt="app logo"
          width={318}
          height={64}
        />
        <div className="text-primary-900 text-2xl text-center mt-16">
          Đăng nhập
        </div>
        <div className="w-[348px] mt-8 flex flex-col gap-y-4">
          <Input
            type="text"
            placeholder="Tên tài khoản, email hoặc số điện thoại"
            customClassNames="w-full"
          />
          <Input type="password" placeholder="Mật khẩu" />
          <Button>Đăng nhập</Button>
        </div>
        <div className="text-gray-600 text-sm text-center mt-5">
          Quên mật khẩu?
        </div>
      </div>
      <div className="bg-[url('/image/login/login-banner.png')] bg-no-repeat !bg-right"></div>
    </div>
  );
}
