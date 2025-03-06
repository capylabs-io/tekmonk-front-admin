"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Step1 } from "@/components/register-contest/Step1";
import { Step2 } from "@/components/register-contest/Step2";
import { Step3 } from "@/components/register-contest/Step3";
import { Step4 } from "@/components/register-contest/Step4";
import { useContestRegisterStore } from "@/store/ContestRegisterStore";
import { SuccessComponent } from "@/components/register-contest/Success";
import { Button } from "@/components/common/button/Button";
import { useRouter } from "next/navigation";
import { get } from "lodash";
import { useLoadingStore } from "@/store/LoadingStore";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wizardSchema, WizardSchema } from "@/validation/ContestRegister";
import { HandleReturnMessgaeErrorAxios } from "@/requests/return-message-error";
import { useSnackbarStore } from "@/store/SnackbarStore";
import RegisterContestGuard from "@/components/hoc/RegisterContestGuard";
import moment from "moment";

const steps = [
  {
    title: "Thông tin",
    titleHeader: "THÔNG TIN CÁ NHÂN",
    icon: "1",
    description: "Lưu lại thông tin cá nhân dùng để xác nhận khi dự thi",
  },
  {
    title: "Tài khoản",
    titleHeader: "TẠO TÀI KHOẢN",
    icon: "2",
    description: "Dùng để đăng nhập vào hệ thống thi đấu",
  },
  {
    title: "Bảng thi",
    titleHeader: "LỰA CHỌN BẢNG ĐẤU",
    icon: "3",
    description:
      "Lựa chọn bảng đấu phù hợp với bạn (Lưu ý: nếu chọn thi nhóm ở bảng D thì bạn phải nhập thông tin thành viên của mình)",
  },
  {
    title: "Xác nhận",
    titleHeader: "XÁC NHẬN ĐĂNG KÝ THAM GIA",
    icon: "4",
    description:
      "Lưu ý xác nhận kĩ thông tin của mình trước khi xác nhận đăng ký",
  },
];

const RegisterContest = () => {
  //init data
  const initInvalidCodeCombat = {
    username: false,
    email: false,
    other: false,
    reload: false,
  };
  const router = useRouter();
  //use state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [candidateNumber, setCandidateNumber] = useState<string>("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isInvalidCodeCombat, setIsInvalidCodeCombat] = useState({
    username: false,
    email: false,
    other: false,
    reload: false,
  });

  //store
  const [register, clear] = useContestRegisterStore((state) => [
    state.register,
    state.clear,
  ]);
  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);

  //form
  const methods = useForm<WizardSchema>({
    mode: "onChange",
    resolver: zodResolver(wizardSchema),
  });

  //function
  const getStepName = (step: number) => {
    switch (step) {
      default:
      case 0:
        return "stepOne";
      case 1:
        return "stepTwo";
      case 2:
        return "stepThree";
    }
  };

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      const stepName = getStepName(currentStep);
      const isValid = await methods.trigger(stepName);
      if (isValid) setCurrentStep(currentStep + 1);
      // setCurrentStep(currentStep + 1);
    }
  };

  const handleNext = async (formData: any) => {
    try {
      show();
      //use momen to format date at step 3
      for (let i = 0; i < formData.stepThree.groupMemberInfo.length; i++) {
        formData.stepThree.groupMemberInfo[i].dob = moment(
          formData.stepThree.groupMemberInfo[i].dob,
          "DD/MM/YYYY",
          true
        ).format("DD-MM-YYYY");
      }

      const res = await register({
        ...get(formData, "stepOne", {}),
        ...get(formData, "stepTwo", {}),
        ...get(formData, "stepThree", {}),
      });

      setCandidateNumber(get(res, "candidateNumber", ""));
      success("Xong!", "Chúc mừng bạn đăng ký thành công");
      setIsSubmitted(true);
    } catch (err) {
      const message = HandleReturnMessgaeErrorAxios(err);

      error("Lỗi", message);
      setIsInvalidCodeCombat((prev) => ({
        ...initInvalidCodeCombat,
        username: true,
        reload: !prev.reload,
      }));
      setCurrentStep(1);
      return;
    } finally {
      hide();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 stateCodeCombat={isInvalidCodeCombat} />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 updateStatus={handleAccept} />;
      default:
        return null;
    }
  };

  const handleBackToLogin = () => {
    clear();
    router.push("/dang-nhap");
  };

  const handleBackToContest = () => {
    clear();
    //back to home page with new tab
    window.open("/", "_blank");
  };

  const handleAccept = () => {
    setIsAccepted(!isAccepted);
  };

  useEffect(() => {
    if (currentStep == 3) {
      setIsAccepted(false);
    }
  }, [currentStep]);
  return (
    <>
      <div className="h-full mt-4 overflow-auto">
        <div className="px-2">
          <div className="w-full text-[40px] text-primary-700 font-dela max-w-[720px] max-[580px]:text-[32px] max-[370px]:text-[28px] mx-auto rounded-2x text-center">
            Đăng ký thông tin dự thi
          </div>
        </div>

        <div className="p-2">
          <Card className="w-full max-w-[720px] mt-2 mx-auto rounded-2xl bg-white">
            <div className="w-full min-h-16 p-6 ">
              <div className=" text-SubheadLg text-primary-900 text-center">
                {steps[currentStep].titleHeader
                  ? steps[currentStep].titleHeader
                  : "Đăng ký tham gia thành công"}
              </div>
              <div className="text-bodyMd text-center">
                {steps[currentStep].description
                  ? steps[currentStep].description
                  : ""}
              </div>
            </div>
            <div className="w-full border-t border-gray-300"></div>

            <CardContent className="mt-6">
              {!isSubmitted ? (
                <>
                  <div className="mb-8">
                    <div className="flex justify-between items-center ml-[11%]">
                      {steps.map((step, index) => (
                        <div key={index} className="flex items-center flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index < currentStep
                                ? "bg-primary-600 text-white"
                                : index === currentStep
                                ? "bg-primary-50 text-gray-600 text-SubheadMd border-[2px] border-primary-600"
                                : "bg-white text-gray-600 border-[2px] border-gray-300"
                            }`}
                          >
                            {index < currentStep ? (
                              <Check className="w-6 h-6" />
                            ) : (
                              step.icon
                            )}
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={`h-[2px] flex-1 ${
                                index < currentStep
                                  ? "bg-primary-600"
                                  : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 w-[90%] ml-[1.7%] flex justify-between">
                      {steps.map((step, index) => (
                        <span
                          key={index}
                          className="text-xs text-gray-500 flex-1 text-center"
                        >
                          {step.title}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FormProvider {...methods}>
                    {renderStepContent()}
                  </FormProvider>
                </>
              ) : (
                <>
                  <SuccessComponent candidateNumber={candidateNumber} />
                </>
              )}
            </CardContent>
            {!isSubmitted ? (
              <>
                <div className="w-full border-t border-gray-300"></div>
                <div className="flex h-16 px-6 py-3 justify-between">
                  <Button
                    outlined={true}
                    onClick={handlePrevious}
                    className="rounded-[3rem] w-[108px] border-[1px] border-gray-300"
                  >
                    Quay lại
                  </Button>
                  <Button
                    onClick={
                      currentStep === steps.length - 1
                        ? methods.handleSubmit(handleNext)
                        : handleNextStep
                    }
                    className="rounded-[3rem] w-[108px]"
                    disabled={currentStep === 3 && !isAccepted}
                  >
                    {currentStep === steps.length - 1 ? "Xác nhận" : "Tiếp tục"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="w-full border-t border-gray-300"></div>
                <div className="flex h-16 px-6 py-3 gap-2 justify-between">
                  <Button
                    onClick={handleBackToContest}
                    className="rounded-[3rem] w-[178px] border-[1px] border-gray-300"
                    outlined={true}
                  >
                    Nội dung cuộc thi
                  </Button>
                  <Button
                    onClick={handleBackToLogin}
                    className="rounded-[3rem] w-[130px]"
                  >
                    Đăng nhập
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterContestGuard(RegisterContest);
