import React, { useEffect, useState } from 'react'
import { Input } from "@/components/common/Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useForm,
  FormProvider,
  Controller,
} from "react-hook-form";
import { ShopItem, ShopItemEnum } from '@/types/shop';
import { quillFormats, quillModules } from '@/contants/config/react-quill';
import { CommonSelect } from '../common/CommonSelect';
import { CommonButton } from '../common/button/CommonButton';
import { useQuery } from '@tanstack/react-query';
import { ReqGetCategory } from '@/requests/category';
import { useSnackbarStore } from '@/store/SnackbarStore';
import { SHOP_ITEM_TYPE } from '@/contants/shop';
import { InputFileUpdload } from '../common/InputFileUpload';
import { ImagePlus } from 'lucide-react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-[600px] min-h-[200px] bg-gray-100 rounded-xl animate-pulse" />
  ),
});
type Props = {
  open: boolean;
  isEdit: boolean;
  initialData?: ShopItem;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any, image?: File | null) => void;
};

export const CreateShopItem = ({
  open,
  isEdit,
  onOpenChange,
  onSubmit,
  initialData
}: Props) => {
  const form = useForm<ShopItem>({
    // resolver: zodResolver(misionFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      image: initialData?.image || '',
      price: initialData?.price || 0,
      description: initialData?.description || '',
      category: initialData?.category || undefined,
      type: initialData?.type || '' as ShopItemEnum,
      quantity: initialData?.quantity || 0,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    trigger, // Add trigger to manually validate fields
    formState: { errors, isValid, isDirty, isSubmitting },
  } = form;
  const [isMounted, setIsMounted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const [isStationery, setIsStationery] = useState(false);
  const [error, success] = useSnackbarStore((state) => [
    state.error,
    state.success,
  ]);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return await ReqGetCategory();
      } catch (err) {
        error("Lỗi", "Không thể lấy danh mục vật phẩm");
      }
    },
  });
  const handleSelectChange = (value: string) => {
    const category = categories?.data?.find((category) => category.id?.toString() === value);
    if (!category?.id) {
      return
    }
    setValue('category', category);
  }
  const handleImageUpload = (file: File | null) => {
    console.log("file", file as any);
    setUploadedImage(file);
    // Update the form value for validation
    setValue("image", file ? "has-new-file" : (initialData?.image ? "existing-image" : ""), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSelectItemTypeChange = (value: string) => {
    if (value === ShopItemEnum.VIRTUAL) {
      setValue('quantity', 0);
      setIsStationery(true);
    } else {
      setIsStationery(false);
    }
    setValue('type', value as ShopItemEnum);
  }
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        price: initialData.price || 0,
        image: initialData.image || '',
        description: initialData.description || '',
        category: initialData.category || undefined,
        type: initialData.type || ShopItemEnum.VIRTUAL,
        quantity: initialData.quantity || 0,
      });

    }
  }, [initialData]);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[680px] !h-[90vh] bg-white overflow-y-auto">
        <DialogHeader className="px-4">
          <DialogTitle className="!text-HeadingSm !font-semibold text-gray-95">
            {isEdit ? "Chỉnh sửa vật phẩm" : "Tạo vật phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form className="space-y-4 p-4 overflow-y-auto hide-scrollbar">
            <div className="space-y-6">
              {/* Course Name Field */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">Tên vật phẩm</div>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="Nhập dữ liệu"
                        customClassNames="flex-1"
                        error={errors.name?.message}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">Hình nền</div>
                  <InputFileUpdload
                    value={uploadedImage}
                    onChange={handleImageUpload}
                    customClassNames="max-w-[424px]"
                    customInputClassNames="text-sm"
                    contentImageUpload={
                      <>
                        {initialData?.image ? (
                          <img src={initialData.image} alt="ảnh" className="w-[100px] h-[100px] object-cover" />
                        )
                          :
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
                      </>
                    }
                  />
                </div>
              </div>
              {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image.message}</span>}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">Giá tiền</div>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        value={field.value?.toString() || ""}
                        onChange={(e) => field.onChange(Number(e) || 0)}
                        placeholder="Nhập dữ liệu"
                        customClassNames="flex-1"
                        error={errors.price?.message}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-[160px] text-SubheadMd">Số lượng yêu cầu</div>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        value={field.value?.toString() || ""}
                        onChange={(e) => field.onChange(Number(e) || 0)}
                        placeholder="Nhập dữ liệu"
                        customClassNames="flex-1"
                        disabled={isStationery}
                        error={errors.quantity?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="min-w-[160px] text-SubheadMd">Loại vật phẩm</div>
                  <CommonSelect className="w-full" selectClassName="rounded-xl h-[50px] bg-grey-50 border border-grey-300" placeholder="Chọn loại vật phẩm" options={SHOP_ITEM_TYPE} value={getValues('type')} onChange={handleSelectItemTypeChange} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="min-w-[160px] text-SubheadMd">Danh mục</div>
                  <CommonSelect className="w-full" selectClassName="rounded-xl h-[50px] bg-grey-50 border border-grey-300" placeholder="Chọn danh mục" options={categories ? categories?.data?.map((category) => ({ label: category.name || "", value: category.id?.toString() || "" })) : []} value={getValues('category.name')} onChange={handleSelectChange} />
                </div>
              </div>
              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-col gap-2">
                          <ReactQuill
                            theme="snow"
                            className="w-full rounded-xl border-grey-300 bg-grey-50 outline-none !text-[20px] min-h-[200px] transition-all ease-linear overflow-y-auto"
                            placeholder="Nhập mô tả vật phẩm"
                            modules={quillModules}
                            formats={quillFormats}
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {errors.description && (
                            <p className="text-red-500 text-BodySm">
                              {errors.description.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Category Field */}

            </div>
          </form>
        </FormProvider>
        <DialogFooter>
          <div className="flex justify-between items-center mt-6 border-t pt-4 w-full">
            <CommonButton
              variant="secondary"
              className="h-11"
              onClick={() => handleDialogChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </CommonButton>
            <CommonButton
              className="h-11 w-[139px]"
              disabled={isSubmitting}
              onClick={() => {
                onSubmit(getValues(), uploadedImage)
                reset()
                setUploadedImage(null)
              }}
            >
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
