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
import "react-quill/dist/quill.snow.css";
import { CommonTable } from "@/components/common/CommonTable";
import { ColumnDef } from "@tanstack/react-table";
import { get } from "lodash";
import { PostType, PostVerificationType } from "@/types";
import { Post } from "@/components/home/Post";
import { ConvertoStatusPostToText } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import moment from "moment";
import { CommonSelect } from "@/components/common/CommonSelect";
import {
  useInfiniteLatestPost,
  useVerifiedPost,
} from "@/hooks/useVerifiedPost";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/common/Input";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/hooks/useDebounceValue";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export default function Page() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchTermDebounce = useDebounce(searchTerm, 1000);

  const {
    data: currentPageData,
    isLoading, 
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteLatestPost({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    isVerified: PostVerificationType.PENDING,
    searchTerm: searchTermDebounce,
  });
  const { ref, inView } = useInView();
  const [rejectReason, setRejectReason] = useState<string>("");

  // Flatten the infinite query data into a single array of posts
  const listPost = useMemo(() => {
    if (!currentPageData?.pages) return [];
    return currentPageData.pages.flatMap((page) => page?.data || []);
  }, [currentPageData]);

  const columns: ColumnDef<PostType>[] = [
    {
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Ảnh bìa",
      cell: ({ row }) => (
        <div
          className="bg-center bg-no-repeat bg-cover h-[80px] rounded-xl w-[130px]"
          style={{
            backgroundImage: `url(${row.original?.thumbnail})`,
          }}
        ></div>
      ),
    },
    {
      header: "Tiêu đề dự án",
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      header: "Trạng thái",
      cell: ({ row }) => (
        <span>{ConvertoStatusPostToText(row.original.isVerified || "")}</span>
      ),
    },
    {
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.tags &&
            row.original.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== "")
              .map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-gray-20 text-gray-95 rounded-md text-BodyXs"
                >
                  <span className="px-2 py-1">{tag}</span>
                </div>
              ))}
        </div>
      ),
    },
    {
      id: "action",
      header: "",
      cell: ({ row }) => (
        <button
          className="p-2 hover:bg-gray-100 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setTogglePostDialog(true);
            setCurrentPost(row.original);
          }}
        >
          <Eye className="h-4 w-4" color="#7C6C80" />
        </button>
      ),
    },
  ];

  const optionSelect = [
    {
      value: "all",
      label: "Tất cả",
    },
    {
      value: PostVerificationType.ACCEPTED,
      label: "Đã chấp nhận",
    },
    {
      value: PostVerificationType.DENIED,
      label: "Từ chối",
    },
    {
      value: PostVerificationType.PENDING,
      label: "Chờ duyệt",
    },
  ];

  const {
    page,
    totalPage,
    totalDocs,
    togglePostDialog,
    toggleConfirmDialog,
    currentPost,
    selectedType,
    limit,
    listPostHistory,
    setLimit,
    handleSelectChange,
    setPage,
    setCurrentPost,
    setTogglePostDialog,
    setToggleConfirmDialog,
    handleVerifiedPost,
    handleVerified,
  } = useVerifiedPost(refetch);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="w-full h-full border-r border-gray-20">
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
        <Input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          customClassNames="max-w-[320px]"
          value={searchTerm}
          onChange={handleSearch}
          isSearch={true}
        />
      </div>
      <Tabs defaultValue="verified" className="w-full !h-[calc(100%-68px)]">
        <TabsList className="w-full border-b border-gray-200 !justify-start">
          <TabsTrigger value="verified">Phê duyệt</TabsTrigger>
          <TabsTrigger value="history">Lịch sử phê duyệt</TabsTrigger>
        </TabsList>
        <TabsContent
          value="verified"
          className="overflow-y-auto !h-[calc(100%-40px)] p-4"
        >
          {isLoading && listPost.length === 0 ? (
            // Show loading skeletons for initial load
            <div className="border rounded-2xl w-[720px] mx-auto pb-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="px-8" key={`skeleton-${index}`}>
                  <Post
                    isLoading={true}
                    imageUrl=""
                    thumbnailUrl=""
                    userName=""
                    specialName=""
                    createdAt=""
                    likedCount=""
                    commentCount=""
                  />
                  {index !== 2 && (
                    <hr className="border-t border-gray-200 my-4" />
                  )}
                </div>
              ))}
            </div>
          ) : listPost.length > 0 ? (
            <div className="border rounded-2xl w-[720px] mx-auto pb-5">
              {listPost.map((item: PostType, index: number) => (
                <div
                  className="px-8"
                  key={
                    item?.name ? item?.name + index + "post" : index + "post"
                  }
                >
                  <Post
                    showButton
                    data={item}
                    onVerifiedPost={handleVerifiedPost}
                    imageUrl="bg-[url('/image/home/profile-pic.png')]"
                    thumbnailUrl={get(item, "thumbnail") || ""}
                    userName={get(item, "postedBy.username", "") || "User"}
                    specialName={get(item, "postedBy.skills", "")}
                    hideSocial
                    postContent={get(item, "content", "")}
                    postName={get(item, "name", "")}
                    createdAt={get(item, "createdAt", "")}
                    likedCount="6.2"
                    commentCount="61"
                  />
                  {index !== listPost.length - 1 && (
                    <hr className="border-t border-gray-200 my-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Show empty state when no posts are available
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">
                Không có bài viết nào
              </h3>
              <p className="text-sm">
                Hiện tại không có bài viết nào cần phê duyệt
              </p>
            </div>
          )}
          <div ref={ref} className="p-4 text-center">
            {isFetchingNextPage
              ? "Đang tải thêm bài viết..."
              : !hasNextPage && listPost.length > 0
              ? "Đã hiển thị tất cả bài viết"
              : ""}
          </div>
        </TabsContent>
        <TabsContent
          value="history"
          className="overflow-y-auto !h-[calc(100%-40px)] p-4"
        >
          <div>
            <CommonSelect
              options={optionSelect}
              value={selectedType}
              onChange={handleSelectChange}
            />
          </div>
          <div className="w-full h-[calc(100%-40px-12px)] ov erflow-y-auto mt-3">
            <CommonTable
              data={
                listPostHistory && selectedType !== "all"
                  ? listPostHistory?.data.filter(
                      (item) => item.isVerified === selectedType
                    )
                  : listPostHistory?.data || ([] as any[])
              }
              isLoading={false}
              columns={columns}
              page={page}
              totalPage={totalPage}
              totalDocs={totalDocs}
              onPageChange={setPage}
              docsPerPage={limit}
              onPageSizeChange={setLimit}
            />
          </div>
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
            <DialogTitle className="text-xl">Từ chối bài đăng</DialogTitle>
            <DialogDescription>
              <div className="text-gray-60 text-BodySm">
                Nhập lý do từ chối bài viết
              </div>
              <Input
                placeholder="Nhập lý do từ chối"
                className="w-full"
                value={rejectReason}
                onChange={(e) => setRejectReason(e)}
                type="textarea"
              />
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
                handleVerified(currentPost, rejectReason);
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
        <DialogContent className="max-w-[700px] h-[90vh] bg-gray-00 ">
          <Tabs
            defaultValue="verified"
            className="w-full h-full mt-2 overflow-y-auto"
          >
            <TabsList className="w-full border-b border-gray-200 !justify-start">
              <TabsTrigger value="post">Bài viết</TabsTrigger>
              <TabsTrigger value="note">Ghi chú</TabsTrigger>
            </TabsList>
            <TabsContent
              value="post"
              className="!h-[calc(100%-100px)] px-4 custom-scrollbar overflow-y-auto"
            >
              <Post
                isVerified
                hideSocial
                data={currentPost}
                onVerifiedPost={handleVerifiedPost}
                imageUrl="bg-[url('/image/home/profile-pic.png')]"
                thumbnailUrl={get(currentPost, "thumbnail") || ""}
                userName="Andy Lou"
                specialName={get(currentPost, "postedBy.skills", "")}
                userRank={
                  <span
                    className={`bg-[url('/image/user/silver-rank.png')] bg-no-repeat h-6 w-6 flex flex-col items-center justify-center text-xs`}
                  >
                    IV
                  </span>
                }
                postContent={get(currentPost, "content", "")}
                postName={get(currentPost, "name", "")}
                createdAt={moment(
                  get(currentPost, "createdAt", ""),
                  "dd/mm/yyyy hh:mm:ss"
                ).toString()}
                likedCount="6.2"
                commentCount="61"
              />
            </TabsContent>
            <TabsContent value="note" className="overflow-y-auto p-4">
              {/* {
                currentPost?.isVerified === PostVerificationType.DENIED &&
                <>
                  <div className="text-SubheadLg text-gray-95">Lý do từ chối</div>
                  <div className="text-gray-60 text-BodyMd">Nội dung bài viết không phù hợp, bài viết này sẽ không được đănng tải</div>
                </>
              } */}
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between sm:justify-between mt-2">
            <CommonButton
              variant="secondary"
              className="h-[48px]"
              childrenClassName="text-SubheadMd"
              onClick={() => {
                setTogglePostDialog(false);
                // reset();
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
                  // reset();
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
                  // reset();
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
