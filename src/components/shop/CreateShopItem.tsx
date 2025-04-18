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
  useFormContext,
} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { ShopItem, ShopItemEnum } from '@/types/shop';
import ReactQuill from 'react-quill';
import { quillFormats, quillModules } from '@/contants/config/react-quill';
import { CommonSelect } from '../common/CommonSelect';
import { CommonButton } from '../common/button/CommonButton';
import { useQuery } from '@tanstack/react-query';
import { ReqGetCategory } from '@/requests/category';
import { useSnackbarStore } from '@/store/SnackbarStore';
import { SHOP_ITEM_TYPE } from '@/contants/shop';
type Props = {
  open: boolean;
  isEdit: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
};

export const CreateShopItem = ({
  open,
  isEdit,
  onOpenChange,
  onSubmit
}: Props) => {
  const form = useForm<ShopItem>({
    // resolver: zodResolver(misionFormSchema),
    defaultValues: {
      name: '',
      image: '',
      price: 0,
      description: '',
      category: undefined,
      type: ShopItemEnum.VIRTUAL,
      quantity: 0,
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
  const handleSelectItemTypeChange = (value: string) => {
    if (value === ShopItemEnum.STATIONERY) {
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
    setIsMounted(true);
  }, []);
  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="!text-HeadingSm !font-semibold text-gray-95">
            {isEdit ? "Chỉnh sửa vật phẩm" : "Tạo vật phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form className="space-y-4 p-4 h-[500px] overflow-y-auto hide-scrollbar">
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
                  <CommonSelect disabled={isEdit} className="w-full" selectClassName="rounded-xl h-[50px] bg-grey-50 border border-grey-300" placeholder="Chọn loại vật phẩm" options={SHOP_ITEM_TYPE} value={getValues('type')} onChange={handleSelectItemTypeChange} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="min-w-[160px] text-SubheadMd">Danh mục</div>
                  <CommonSelect disabled={isEdit} className="w-full" selectClassName="rounded-xl h-[50px] bg-grey-50 border border-grey-300" placeholder="Chọn danh mục" options={categories ? categories?.data?.map((category) => ({ label: category.name || "", value: category.id?.toString() || "" })) : []} value={getValues('category.name')} onChange={handleSelectChange} />
                </div>
              </div>
              {/* Description Field */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
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
                handleSubmit(onSubmit)
                reset()
              }}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo mới"}
            </CommonButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
