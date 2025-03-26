"use client"

import { useProfileStore } from "@/store/ProfileStore"
import { ImagePlus, X } from "lucide-react"
import { useMemo } from "react"
import { Input } from "../common/Input"
import { Button } from "../common/button/Button"
import { InputFileUpdload } from "../common/InputFileUpload"
import { InputTags } from "@/components/contest/InputTags"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, FormProvider, useForm } from "react-hook-form"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import { uploadPost } from "@/requests/post"
import { PostVerificationType } from "@/types"
import { useSnackbarStore } from "@/store/SnackbarStore"
import { useLoadingStore } from "@/store/LoadingStore"
import { profileFormSchema, ProfileFormValues } from "@/validation/post"

export const CreateProfileModal = () => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), [])
  const [isShowing, hide] = useProfileStore((state) => [state.isShowing, state.hide])
  const [showLoading, hideLoading] = useLoadingStore((state) => [state.show, state.hide])
  const [showSuccess, showError] = useSnackbarStore((state) => [state.success, state.error])
  const method = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      url: "",
      image: null,
      tags: "",
      content: "",
    },
  })
  const modules = {
    toolbar: [
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ header: [1, 2, 3, false] }],
      ["link", "image"],
    ],
  }

  const formats = ["list", "bullet", "ordered", "bold", "italic", "underline", "header", "link", "image"]
  const {
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = method
  const appendFormData = (formData: FormData, data: any, parentKey = "") => {
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || value instanceof File) return // Skip empty values
      const newKey = parentKey ? `${parentKey}[${key}]` : key
      if (typeof value === "object" && !(value instanceof File || value instanceof Blob)) {
        appendFormData(formData, value, newKey) // Recursively append nested objects
      } else {
        formData.append(newKey, String(value))
      }
    })
  }
  const handleCreatePost = async () => {
    try {
      showLoading()
      const formData = new FormData()
      const data = getValues()
      appendFormData(formData, data)
      formData.append("isVerified", PostVerificationType.PENDING)
      if (data.image) {
        formData.append("image", data.image)
      }
      const res = await uploadPost(formData)
      if (res) {
        showSuccess("Thành công", "Tạo bài viết thành công")
        reset()
        hide()
      }
    } catch (error) {
      console.log("error", error)
      showError("Thất bại", "Tạo bài viết Thất bại")
    } finally {
      hideLoading()
    }
  }
  const handleImageUpload = (file: File | null) => {
    if (file) setValue("image", file as any)
  }
  return isShowing && (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/60">
      <div className="relative mx-auto w-[688px] flex flex-col h-[80%] rounded-3xl bg-white overflow-y-auto">
        <button
          type="button"
          onClick={hide}
          className="absolute right-4 top-4 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <X size={16} className="" />
        </button>

        <div className="w-full text-start p-6">
          <div className="text-HeadingSm font-bold text-gray-95">Đăng bài</div>
          <div className="text-BodyMd text-gray-60">Khoe ngay dự án mới của mình cho các đồng môn nhé! </div>
        </div>
        <hr className="border-t border-gray-200" />
        <FormProvider {...method}>
          <div className="p-6 space-y-5 grow">
            <div className="flex justify-between text-sm">
              <span className="text-gray-60 text-SubheadMd">Tiêu đề dự án</span>
              <div className="flex flex-col w-[424px]">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      value={value}
                      onChange={(e) => onChange(e)}
                      type="text"
                      placeholder="Nhập thông tin"
                      customClassNames="max-w-[424px]"
                      customInputClassNames="text-sm"
                    />
                  )}
                />
                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-60">
                <div className="flex flex-col gap-y-1">
                  <div className="text-SubheadMd">Đường dẫn website</div>
                  <div className="text-BodyMd">(không bắt buộc)</div>
                </div>
              </span>
              <div className="flex flex-col w-[424px]">
                <Controller
                  control={control}
                  name="url"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      value={value}
                      onChange={onChange}
                      type="text"
                      placeholder="Nhập thông tin"
                      customClassNames="max-w-[424px]"
                      customInputClassNames="text-sm"
                    />
                  )}
                />
                {errors.url && <span className="text-red-500 text-xs mt-1">{errors.url.message}</span>}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-60 text-SubheadMd">Tags</span>
              <Controller
                control={control}
                name="tags"
                render={({ field: { value, onChange }, fieldState }) => (
                  <div className="w-[424px]">
                    <InputTags
                      hideTitle
                      value={value}
                      error={fieldState?.error?.message}
                      onValueChange={(tagsString) => {
                        onChange(tagsString)
                      }}
                      customInputClassNames="text-sm"
                      tooltipContent="Vui lòng nhập tag và ấn Enter"
                    />
                  </div>
                )}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-60">Hình ảnh</span>
              <div className="flex flex-col w-[424px]">
                <InputFileUpdload
                  value={getValues("image")}
                  onChange={handleImageUpload}
                  customClassNames="max-w-[424px]"
                  customInputClassNames="text-sm"
                  contentImageUpload={
                    <>
                      <div
                        className="rounded-full p-5 w-max mx-auto flex items-center justify-center relative bg-gray-20"
                      >
                        <ImagePlus size={20} className="absolute text-gray-50" />
                      </div>
                      <div className="mt-2 text-gray-70 text-SubheadSm">
                        Tải lên ảnh/video
                      </div>
                      <p className="text-gray-70 !text-xs font-normal">Hoặc kéo và thả</p>
                    </>
                  }
                />
                {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image.message}</span>}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-60">Nội dung bài viết</span>
              <div className="flex flex-col w-[424px]">
                <Controller
                  control={control}
                  name="content"
                  render={({ field: { value, onChange }, fieldState }) => (
                    <ReactQuill
                      theme="snow"
                      className="w-[424px] rounded-xl border border-grey-300 bg-grey-50 outline-none !text-[20px] h-[400px] transition-all ease-linear overflow-y-auto"
                      value={value}
                      onChange={onChange}
                      placeholder="Viết vài dòng giới thiệu tổng quan dự án"
                      modules={modules}
                      formats={formats}
                    />
                  )}
                />
                {errors.content && <span className="text-red-500 text-xs mt-1">{errors.content.message}</span>}
              </div>
            </div>
          </div>
        </FormProvider>

        <hr className="border-t border-gray-200" />
        <div className="flex justify-between w-ful p-6">
          <Button
            className=" !bg-gray-00 border border-gray-20 !text-primary-95 w-[100px]"
            style={{
              boxShadow: "0px 4px 0px #ebe4ec",
            }}
            onClick={hide}
          >
            <div className="!text-sm !font-normal"> Thoát</div>
          </Button>
          <Button
            className="w-[150px] !font-medium border border-primary-70"
            style={{
              boxShadow: "0px 4px 0px #9a1595",
            }}
            onClick={method.handleSubmit(handleCreatePost)}
          >
            <div className="!text-sm !font-normal"> Đăng dự án</div>
          </Button>
        </div>
      </div>
    </div>
  )
}

