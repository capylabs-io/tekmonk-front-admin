"use client";
import Image from "next/image";
export const LandingFooter = () => {
  return (
    <div className="bg-[#320130] text-white px-4 py-8 md:px-8 w-full">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="space-y-4 mb-6 md:mb-0">
            {/* Logo */}
            <Image alt="" src="/image/app-logox2.png" width={159} height={32} />

            {/* Contact Information */}
            <div className="space-y-2 text-sm">
              <p className="max-w-md">
                <span className="font-semibold">Địa chỉ:</span> Tầng 3, Tháp B,
                Tòa Việt Đức Complex, Ngõ 187 Nguyễn Tuân, P. Nhân Chính, Q.
                Thanh Xuân,Tp. Hà Nội
              </p>
              <p>
                <span className="font-semibold">Hotline:</span> 0378 247 797
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                tekmonk.academy@gmail.com
              </p>
            </div>
          </div>

          {/* Certification Badge */}
          <div className="w-40 h-auto">
            <img
              src=""
              alt="Đã đăng ký Bộ Công Thương"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center text-BodySm">
          <p>© 2021 TekMonk Academy. All right reserved.</p>
        </div>
      </div>
    </div>
  );
};