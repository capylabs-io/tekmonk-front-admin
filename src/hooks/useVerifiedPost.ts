import { getListPost, getListPostCustom, updatePost } from "@/requests/post";
import { useLoadingStore } from "@/store/LoadingStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { PostType, PostTypeEnum, PostVerificationType } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { get } from "lodash";
import qs from "qs";
import { useMemo, useState } from "react";

export const useVerifiedPost = () => {
  // const [listPost, setListPost] = useState<PostType[]>()
  const [showLoading, hideLoading] = useLoadingStore((state) => [
    state.show,
    state.hide,
  ]);
  const [showSuccess, showError] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const [totalPage, setTotalPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(100);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [togglePostDialog, setTogglePostDialog] = useState(false);
  const [toggleConfirmDialog, setToggleConfirmDialog] = useState(false);
  const [selectedType, setSelectedType] = useState("all");

  const { data, isLoading, isError, refetch } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const queryString = qs.stringify(
          {
            sort: ["id:asc"],
            populate: "*",
          },
          { encodeValuesOnly: true }
        );
        const res = await getListPostCustom(queryString);
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
  });
  const { data: listPostHistory } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["historyPosts", page, limit],
    queryFn: async () => {
      try {
        const queryString = qs.stringify(
          {
            pagination: {
              page: page,
              pageSize: limit,
            },
            sort: ["id:asc"],
            populate: "*",
          },
          { encodeValuesOnly: true }
        );
        const res = await getListPost(queryString);
        if (res) {
          setPage(get(res, "meta.pagination.page", 1));
          setTotalPage(get(res, "meta.pagination.pageCount", 1));
          setTotalDocs(get(res, "meta.pagination.total", 0));
          setLimit(get(res, "meta.pagination.pageSize", 10));
        }
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    },
  });
  const listPost = useMemo(() => {
    return data
      ? data?.data?.filter(
          (item: PostType) => item.isVerified === PostVerificationType.PENDING
        )
      : [];
  }, [data]);

  const handleSelectChange = (value: string) => {
    setSelectedType(value);
  };
  const handleVerified = async (
    data: PostType | null,
    rejectReason: string
  ) => {
    try {
      showLoading();
      if (!data) return;
      const { id, ...form } = data;
      const payload = {
        ...form,
        rejectReason,
      };
      if (!id) return;
      const res = await updatePost(id, payload);
      if (res) {
        showSuccess("Thành công", "Phê duyệt bài viết thành công!");
      }
    } catch (error) {
      console.log("error", error);
      showError("Thất bại", "Phê duyệt bài viết thất bại!");
    } finally {
      hideLoading();
      refetch();
    }
  };
  const handleVerifiedPost = async (data: PostType) => {
    if (data.isVerified === PostVerificationType.DENIED) {
      setCurrentPost(data);
      setToggleConfirmDialog(true);
    } else {
      handleVerified(data, "");
    }
  };

  return {
    page,
    limit,
    totalPage,
    totalDocs,
    togglePostDialog,
    toggleConfirmDialog,
    listPost,
    currentPost,
    selectedType,
    listPostHistory,
    setLimit,
    handleSelectChange,
    setPage,
    setCurrentPost,
    setTogglePostDialog,
    setToggleConfirmDialog,
    handleVerifiedPost,
    handleVerified,
  };
};

type UseInfiniteLatestPostProps = {
  page: number;
  limit: number;
  type?: PostTypeEnum;
  isVerified: PostVerificationType;
  authorId?: number;
};

export const useInfiniteLatestPost = ({
  page,
  limit,
  type,
  isVerified = PostVerificationType.ACCEPTED,
  authorId,
}: UseInfiniteLatestPostProps) => {
  return useInfiniteQuery({
    queryKey: ["latest-sell-post", page, limit, type, isVerified, authorId],
    queryFn: async ({ pageParam = page }) => {
      try {
        const queryString = qs.stringify(
          {
            page: pageParam,
            limit,
            sort: "desc",
            isVerified: isVerified,
            type: type,
            authorId: authorId,
          },
          { encodeValuesOnly: true }
        );
        const result = await getListPostCustom(queryString);

        return result;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage: any) => {
      const currentPage = lastPage?.meta?.pagination?.page ?? 1;
      const pageCount = lastPage?.meta?.pagination?.pageCount ?? 1;
      const nextPage = currentPage < pageCount ? currentPage + 1 : undefined;
      return nextPage;
    },
    initialPageParam: page,
    refetchOnWindowFocus: false,
  });
};
