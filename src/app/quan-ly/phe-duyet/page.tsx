"use client";

import { CommonButton } from "@/components/common/button/CommonButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, PanelLeft } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/Tabs";
import { CommonCard } from "@/components/common/CommonCard";
import {
  ReqGetAllNews,
} from "@/requests/news";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import qs from "qs";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { get } from "lodash";
import { PostType, PostVerificationType } from "@/types";
import { Post } from "@/components/home/Post";
import { ConvertoStatusPostToText } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";

const newsSchema = z.object({
  title: z
    .string({ required_error: "Tên bài viết không được để trống" })
    .min(1, "Tên bài viết phải có ít nhất 1 ký tự"),
  tags: z.string().optional(),
  image: z.any(),
  content: z.string().min(1, "Mô tả không được để trống"),
});

const modules = {
  toolbar: [
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ header: [1, 2, 3, false] }],
    ["link", "image"],
  ],
};

const formats = [
  "list",
  "bullet",
  "ordered",
  "bold",
  "italic",
  "underline",
  "header",
  "link",
  "image",
];

export default function Page() {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const [togglePostDialog, setTogglePostDialog] = useState(false);
  const [toggleConfirmDialog, setToggleConfirmDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const methods = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      tags: "",
      image: null,
      content: "",
    },
  });
  const { control, getValues, setValue, reset } = methods;

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(100);

  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  // const queryClient = useQueryClient();

  // const { data, isLoading, isError } = useQuery({
  //   refetchOnWindowFocus: false,
  //   queryKey: ["news", page, limit, activeTab],
  //   queryFn: async () => {
  //     try {
  //       const queryString = qs.stringify({
  //         pagination: {
  //           page: page,
  //           pageSize: limit,
  //         },
  //         filters: {
  //           type: "news",
  //           status: activeTab,
  //         },
  //         sort: ["id:asc"],
  //         populate: "*",
  //       });
  //       return await ReqGetAllNews(queryString);
  //     } catch (error) {
  //       return Promise.reject(error);
  //     }
  //   },
  // });

  const handleImageUpload = (file: File | null) => {
    if (file) setValue("image", file as any);
  };

  const prepareFormData = (newsStatus: string) => {
    const formData = new FormData();
    const values = getValues();

    Object.entries({
      title: values.title,
      tags: values.tags,
      content: values.content,
      type: "news",
      status: newsStatus,
    }).forEach(([key, value]) => formData.append(key, value));

    if (values.image) {
      formData.append("image", values.image);
    }

    return { formData, values: { ...values, status: newsStatus } };
  };

  const handleVerifiedPost = (status: PostVerificationType) => {
    if (status === PostVerificationType.DENIED) {
      setToggleConfirmDialog(true)
    }
  }

  const mockData = [
    {
      id: 1,
      media: '/image/new/new-pic.png',
      content: 'Into the Breach',
      description: '',
      name: 'test',
      url: '',
      postedBy: 'long',
      type: 'long',
      isVerified: PostVerificationType.PENDING
    },
    {
      id: 2,
      media: '/image/new/new-pic-2.png',
      content: 'Into the Breach',
      description: '',
      name: 'test',
      url: '',
      postedBy: 'long',
      type: 'long',
      isVerified: PostVerificationType.PENDING
    },
    {
      id: 3,
      media: '/image/new/new-pic.png',
      content: 'Into the Breach',
      description: '',
      name: 'test',
      url: '',
      postedBy: 'long',
      type: 'long',
      isVerified: PostVerificationType.PENDING
    },
  ]
  const columns: ColumnDef<PostType>[] =
    [
      {
        header: 'STT',
        cell: ({ row }) => <span>{row.index + 1}</span>,

      },
      {
        header: 'Ảnh bìa',
        cell: ({ row }) => (
          <div className="flex items-center">
            <Image
              src={row.original?.media || ''}
              alt="thumbnail"
              height={64}
              width={130}
              className="rounded-xl w-full"
            />
          </div>
        ),
      },
      {
        header: 'Tiêu đề dự án',
        cell: ({ row }) => <span>{row.original.content}</span>,
      },
      {
        header: 'Trạng thái',
        cell: ({ row }) => <span>{ConvertoStatusPostToText(row.original.isVerified || '')}</span>,
      },
      {
        header: 'Ghi chú',
        cell: ({ row }) => (
          <span>
            {get(row, 'original.description', '')}
          </span>
        ),
      },
      {
        id: 'action',
        header: '',
        cell: ({ row }) => (
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              // Add edit handler here
              setTogglePostDialog(true)
            }}
          >
            <Eye className="h-4 w-4" color="#7C6C80" />
          </button>
        ),
      },
    ]

  // if (isLoading) return <Loading />;

  // if (isError)
  //   return (
  //     <div>
  //       Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ admin để biết thêm chi
  //       tiết
  //     </div>
  //   );

  return (
    <div className="w-full h-screen border-r border-gray-20">
      <div className="w-full h-[68px] flex flex-col sm:flex-row items-start sm:items-center justify-between px-2 border-b border-gray-20">
        <div className="text-SubheadLg text-gray-95 mb-2 sm:mb-0 flex items-center justify-center gap-2">
          <CommonCard
            size="small"
            className="w-8 h-8 !rounded-[6px] flex items-center justify-center"
          >
            <PanelLeft width={17} height={17} />
          </CommonCard>
          Phê duyệt
        </div>
      </div>
      {/* <div className="w-full flex flex-col py-2">
        <div className="h-9 w-[265px] flex items-center justify-center text-gray-95 gap-3"> */}
      <Tabs defaultValue="verified" className="w-full !h-[calc(100%-68px-2px)] overflow-y-auto">
        <TabsList className="w-full border-b border-gray-200 !justify-start">
          <TabsTrigger value="verified">Phê duyệt</TabsTrigger>
          <TabsTrigger value="history">Lịch sử phê duyệt</TabsTrigger>
        </TabsList>
        <TabsContent value="verified" className="p-4 overflow-y-auto">
          <div className="border rounded-2xl w-[720px] mx-auto ">
            <Post
              showButton
              onVerifiedPost={handleVerifiedPost}
              imageUrl="bg-[url('/image/home/profile-pic.png')]"
              thumbnailUrl="/image/new/new-pic.png"
              userName="Andy Lou"
              specialName="Bá Vương Học Đường"
              userRank={
                <span
                  className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
                >
                  IV
                </span>
              }
              createdAt="23s"
              likedCount="6.2"
              commentCount="61"
            />
            <hr className="border-t border-gray-200 my-4" />
            <Post
              showButton
              imageUrl="bg-[url('/image/user/profile-pic-2.png')]"
              thumbnailUrl="/image/new/new-pic-2.png"
              userName="Lauren Linh"
              specialName="Học Bá Thanh Xuân"
              userRank={
                <span
                  className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
                >
                  IV
                </span>
              }
              createdAt="23s"
              likedCount="6.2"
              commentCount="61"
            />
            <hr className="border-t border-gray-200 my-4" />
            <Post
              showButton
              imageUrl="bg-[url('/image/user/profile-pic-2.png')]"
              thumbnailUrl="/image/new/new-pic-2.png"
              userName="Lauren Linh"
              specialName="Học Bá Thanh Xuân"
              userRank={
                <span
                  className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
                >
                  V
                </span>
              }
              createdAt="23s"
              likedCount="6.2"
              commentCount="61"
            />

          </div>
        </TabsContent>
        <TabsContent value="history" className="overflow-y-auto p-4">
          <CommonTable
            data={mockData}
            isLoading={false}
            columns={columns}
            page={page}
            totalPage={totalPage}
            totalDocs={totalDocs}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>
      <Dialog
        open={toggleConfirmDialog}
        onOpenChange={(open) => {
          if (!open) {
            setToggleConfirmDialog(false);
          }
        }}
      >
        <DialogContent className="max-w-[500px] max-h-full bg-gray-00 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Từ chối bài đăng
            </DialogTitle>
            <DialogDescription>
              <div className="text-gray-60 text-BodySm">
                Yêu cầu reset mật khẩu của tài khoản <span className="text-gray-95 font-bold">kh*********@gmail.com</span> đã được gửi đến hệ thống. Hãy chờ email phản hồi và làm theo hướng dẫn.
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <CommonButton
              variant="secondary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                setToggleConfirmDialog(false);
              }}
            >
              Thoát
            </CommonButton>
            <CommonButton
              variant="primary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                setToggleConfirmDialog(false);
              }}
            >
              Từ chối
            </CommonButton>

          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={togglePostDialog}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentPost(null);
            setTogglePostDialog(false);
          }
        }}
      >
        <DialogContent className="max-w-[500px] bg-gray-00 overflow-y-auto">
          <Tabs defaultValue="verified" className="w-full overflow-y-auto">
            <TabsList className="w-full border-b border-gray-200 !justify-start">
              <TabsTrigger value="post">Bài viết</TabsTrigger>
              <TabsTrigger value="note">Ghi chú</TabsTrigger>
            </TabsList>
            <TabsContent value="post" className="overflow-y-auto">
              <Post
                isVerified
                hideSocial
                customClassname="!p-0"
                imageUrl="bg-[url('/image/user/profile-pic-2.png')]"
                thumbnailUrl="/image/new/new-pic-2.png"
                userName="Lauren Linh"
                specialName="Học Bá Thanh Xuân"
                userRank={
                  <span
                    className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
                  >
                    V
                  </span>
                }
                createdAt="23s"
                likedCount="6.2"
                commentCount="61"
              />
            </TabsContent>
            <TabsContent value="note" className="overflow-y-auto p-4">
              <div className="text-SubheadLg text-gray-95">Lý do từ chối</div>
              <div className="text-gray-60 text-BodyMd">Nội dung bài viết không phù hợp, bài viết này sẽ không được đănng tải</div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between sm:justify-between mt-2">
            <CommonButton
              variant="secondary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                setTogglePostDialog(false);
                reset();
              }}
            >
              Thoát
            </CommonButton>
            <div className="flex gap-2">
              <CommonButton
                variant="destructive"
                className="h-[48px]"
                childrenClassName="text-SubheadMd"
                onClick={() => {
                  setTogglePostDialog(false);
                  reset();
                }}
              >
                Xoá
              </CommonButton>
              <CommonButton
                variant="secondary"
                className="h-[48px]"
                childrenClassName="text-SubheadMd"
                onClick={() => {
                  setTogglePostDialog(false);
                  reset();
                }}
              >
                Khôi phục
              </CommonButton>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
