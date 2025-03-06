"use client";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/common/Input";
import { CommonButton } from "@/components/common/button/CommonButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCustomRouter } from "@/components/common/router/CustomRouter";

export default function ResetPassword() {
  const router = useCustomRouter();

  const [text, setText] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("hieu123123@gmail.com");
  const handleOnChange = (text: string) => {
    setText(text);
  };

  const handleResetPassword = () => {
    console.log("Resetting password for:", text);
    if (step == 3) {
      router.push("/");
    }
    if (step == 2) {
      console.log("Sending reset password request for:", email);
    }
    setStep(step + 1);
  };

  const handleBackStep = () => {
    if (step == 1) {
      router.back();
    }
    setStep(step - 1);
  };
  useEffect(() => {
    // Handle extract email to kh*********@gmail.com form
    const maskedEmail = email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => {
      return gp2 + "*".repeat(gp3.length);
    });
    setEmail(maskedEmail);
  }, [email]);

  return (
    <>
      <div className="w-full min-h-[calc(100vh-64px)] flex justify-center items-center overflow-y-auto p-2">
        <div
          className="mt-10 w-[368px] h-[340px] mx-auto flex flex-col gap-6 border-[2px] border-gray-20 p-6 bg-gray-00 rounded-2xl"
          style={{
            boxShadow: "0px 4px 0px #DDD0DD",
          }}
        >
          <CommonButton
            className="w-9 h-9 flex items-center justify-center"
            variant="secondary"
            onClick={handleBackStep}
          >
            <ArrowLeft color="#000000" size={13} />
          </CommonButton>
          <div className="flex flex-col gap-1">
            <div className="text-HeadingSm text-gray-95">Quên mật khẩu</div>
            <div className="text-BodySm text-gray-60">
              {step == 1 ? (
                <div>
                  Nhập email, tên tài khoản hoặc số điện thoại để có thể bắt đầu
                  tìm kiếm mật khẩu.
                </div>
              ) : step == 2 ? (
                <div>
                  Tài khoản mà bạn đã quên mật khẩu được xác định là
                  <span className="!text-gray-95 font-medium">
                    {" "}
                    {email}
                  </span>{" "}
                  Gửi yêu cầu đặt lại mật khẩu đến admin hệ thống để có thể tiến
                  hành đặt lại mật khẩu.
                </div>
              ) : (
                <div>
                  {" "}
                  Yêu cầu reset mật khẩu của tài khoản
                  <span className="!text-gray-95 font-medium"> {email}</span> đã
                  được gửi đến hệ thống. Hãy chờ email phản hồi và làm theo
                  hướng dẫn.
                </div>
              )}
            </div>
          </div>
          {step == 1 && (
            <Input
              type="text"
              customClassNames="h-[48px]"
              placeholder="Nhập thông tin"
              onChange={handleOnChange}
            />
          )}
          <CommonButton
            className="h-[52px] w-full"
            variant={step > 2 ? "secondary" : "primary"}
            onClick={handleResetPassword}
          >
            {step == 1 ? (
              <div>Reset Password</div>
            ) : step == 2 ? (
              <div className="flex items-center justify-center gap-2">
                <div>Gưi yêu cầu</div>
                <ArrowRight />
              </div>
            ) : (
              <div>Trở lại trang chủ</div>
            )}
          </CommonButton>
        </div>
      </div>
    </>
  );
}
