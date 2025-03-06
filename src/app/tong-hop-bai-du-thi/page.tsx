"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getContestSubmissionPagination } from "@/requests/contestSubmit";
import { ContestSubmission } from "@/types/contestSubmit";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounceValue";
import { EmptySearch } from "@/components/common/EmptySearch";
import { ImageCustom } from "@/components/common/ImageCustom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLoadingStore } from "@/store/LoadingStore";
import { useTagStore } from "@/store/TagStore";
import { get } from "lodash";
import Tag from "@/components/contest/Tag";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { SearchBar, SearchOption } from "@/components/common/SearchBar";

enum SearchType {
  TAG = "tag",
  CANDIDATE_NUMBER = "candidateNumber",
}

// Define search options
const searchOptions: SearchOption[] = [
  { value: "tag", label: "Tag" },
  { value: "candidateNumber", label: "Số báo danh" },
];

export default function SearchInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tag, setTag] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);
  const debouncedTag = useDebounce(tag, 500);
  const [searchResults, setSearchResults] = useState<ContestSubmission[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchType, setSearchType] = useState<SearchType>(
    SearchType.CANDIDATE_NUMBER
  );

  const [hideLoading, showLoading, loading] = useLoadingStore((state) => [
    state.hide,
    state.show,
    state.isShowing,
  ]);
  const { selectedTag, setSelectedTag } = useTagStore();

  const fetchData = async () => {
    try {
      showLoading();
      const response = await getContestSubmissionPagination(
        page,
        12,
        searchType === SearchType.CANDIDATE_NUMBER ? debouncedSearch : "",
        searchType === SearchType.TAG ? debouncedTag : ""
      );
      setSearchResults(response.data);
      setTotalPages(Math.ceil(response.meta.pagination.total / 12));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      hideLoading();
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value as SearchType);
    setTag("");
    setSearch("");
  };

  const handleSearchValue = (value: string) => {
    if (searchType === SearchType.TAG) {
      setTag(value);
      setSearch("");
    } else {
      setSearch(value);
      setTag("");
    }
    setPage(1);
  };

  const navigateDetailItem = (id: string) => {
    router.push(`/tong-hop-bai-du-thi/${id}`);
  };

  const handleFilterByTag = (tag: string) => {
    setTag(tag);
    setSearchType(SearchType.TAG);
    setPage(1);
  };

  useEffect(() => {
    if (selectedTag) {
      setTag(selectedTag);
      setSearchType(SearchType.TAG);
      setSelectedTag(null);
    }
  }, [selectedTag, setSelectedTag]);

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, debouncedTag, searchType]);

  const SkeletonCard = () => (
    <div className="hover:cursor-pointer">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <Skeleton className="w-full h-48" />
        </CardHeader>
      </Card>
      <CardContent className="p-4">
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-4 w-1/3" />
      </CardFooter>
    </div>
  );

  return (
    <div className="mx-auto max-w-[720px] border-gray-200 bg-white min-h-[calc(100vh-64px-24px)] shadow-md border-l border-r border-b border-b-gray-300 rounded-none rounded-b-xl border-t-0 grid grid-cols-1 mb-3 mt-3 pb-3">
      <div className="space-y-6">
        <Image
          src={`/image/contest/tong-hop-bai-du-thi.jpg`}
          alt={`Banner`}
          width={720}
          height={480}
          priority
          style={{ objectFit: "contain" }}
          quality={100}
        />
        <SearchBar
          searchOptions={searchOptions}
          searchType={searchType}
          searchValue={searchType === SearchType.TAG ? tag : search}
          onSearchTypeChange={handleSearchTypeChange}
          onSearchValueChange={handleSearchValue}
          placeholder="Tìm kiếm bài thi"
        />
      </div>

      <div className="flex flex-col justify-start">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-5">
          {loading
            ? Array(12)
                .fill(0)
                .map((_, index) => <SkeletonCard key={index} />)
            : searchResults.map((card, _) => (
                <div key={card.id} className="flex flex-col">
                  <Card
                    className="overflow-hidden flex-1 items-center justify-center cursor-pointer"
                    onClick={() => navigateDetailItem(card.id)}
                  >
                    <CardHeader className="p-0 items-center w-full h-full min-h-[148px] justify-center">
                      <AspectRatio ratio={16 / 9}>
                        <ImageCustom
                          src={
                            card.thumbnail?.url
                              ? card?.thumbnail.url
                              : "/image/new/new-pic.png"
                          }
                          alt="Into the Breach"
                          fill
                          sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          quality={30}
                          className="object-contain"
                        />
                      </AspectRatio>
                    </CardHeader>
                  </Card>
                  <CardContent className="p-0 py-2">
                    {/* <div
                      className="text-bodySm cursor-pointer text-gray-800"
                      onClick={() => navigateDetailItem(card.id)}
                    >
                      {card.contest_entry?.candidateNumber}
                    </div> */}
                    <div
                      className="text-SubheadLg cursor-pointer text-gray-800 line-clamp-2"
                      onClick={() => navigateDetailItem(card.id)}
                    >
                      {card.title}
                    </div>
                    <Carousel className="mt-1">
                      <CarouselContent className="-ml-4 pl-2 flex">
                        {get(card, "tags", [])?.map((tag, index) => {
                          if(tag != "")
                            return (
                              <CarouselItem
                                key={index}
                                className="w-fit basis-auto select-none pl-2"
                              >
                                <div className="text-bodyXs cursor-pointer text-gray-800 whitespace-nowrap">
                                  <Tag
                                    text={tag}
                                    type="secondary"
                                    size="x-small"
                                    onClick={() => handleFilterByTag(tag)}
                                  />
                                </div>
                              </CarouselItem>
                            )
                        })
                        }
                      </CarouselContent>
                    </Carousel>
                  </CardContent>
                  <CardFooter className="p-0">
                    <div className="text-bodySm text-gray-800 flex gap-x-2">
                      {get(card, "contest_entry.user.fullName", "Unknown")}

                    <div
                      className="text-bodySm cursor-pointer text-gray-800"
                      onClick={() => navigateDetailItem(card.id)}
                    >
                      {card.contest_entry?.candidateNumber}
                    </div>
                    </div>
                  </CardFooter>
                </div>
              ))}
        </div>
        {searchResults.length === 0 && !loading && (
          <div className="h-[300px]">
            <EmptySearch message="Oops! Không thể tìm thấy bài thi nào" />
          </div>
        )}
        {searchResults.length != 0 &&
          <Pagination className="">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return <PaginationEllipsis key={pageNumber} />;
                }
                return null;
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        }
      </div>
    </div>
  );
}
