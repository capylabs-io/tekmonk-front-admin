import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface StudentTablePaginationProps {
  className?: string;
  showDetails?: boolean;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  showEllipsisThreshold?: number; // Add this parameter
}

const generatePaginationItems = (
  totalPages: number,
  currentPage: number,
  onPageChange: (page: number) => void,
  showEllipsisThreshold: number // Add this parameter
) => {
  const pages = [];
  const showEllipsis = totalPages > showEllipsisThreshold;

  const createPaginationLink = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        onClick={() => onPageChange(page)}
        isActive={currentPage === page}
        className={cn(
          "cursor-pointer",
          currentPage === page
            ? "bg-primary-10 border-none text-primary-70"
            : "hover:bg-purple-100 border border-gray-20 shadow-custom-gray rounded-lg"
        )}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  pages.push(createPaginationLink(1));

  if (showEllipsis) {
    if (currentPage <= showEllipsisThreshold - 3) {
      for (let i = 2; i <= showEllipsisThreshold - 2; i++)
        pages.push(createPaginationLink(i));
      pages.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    } else if (currentPage >= totalPages - (showEllipsisThreshold - 4)) {
      pages.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
      for (
        let i = totalPages - (showEllipsisThreshold - 3);
        i < totalPages;
        i++
      )
        pages.push(createPaginationLink(i));
    } else {
      pages.push(
        <PaginationItem key="ellipsis3">
          <PaginationEllipsis />
        </PaginationItem>
      );
      for (let i = currentPage - 1; i <= currentPage + 1; i++)
        pages.push(createPaginationLink(i));
      pages.push(
        <PaginationItem key="ellipsis4">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    pages.push(createPaginationLink(totalPages));
  } else {
    for (let i = 2; i <= totalPages; i++) pages.push(createPaginationLink(i));
  }

  return pages;
};

export default function StudentTablePagination({
  showDetails = true,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showEllipsisThreshold = 7, // Add this parameter with a default value
  className,
}: StudentTablePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col xl:flex-row gap-3 items-center !xl:justify-between justify-center py-4 w-full",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 w-full xl:w-auto justify-center xl:justify-start",
          !showDetails && "hidden"
        )}
      >
        <span className="text-sm">Hiển thị</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-00">
            {[10, 20, 50].map((value) => (
              <SelectItem
                key={value}
                value={value.toString()}
                className="hover:cursor-pointer hover:bg-primary-10"
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-BodySm text-gray-95">{`${startItem}-${endItem} trong số ${totalItems} kết quả`}</span>
      </div>
      <Pagination className="!max-w-[200px]  ">
        <PaginationContent className="flex justify-center xl:justify-end">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={cn(
                currentPage === 1 ? "pointer-events-none opacity-50" : "",
                "cursor-pointer"
              )}
            >
              Trước
            </PaginationPrevious>
          </PaginationItem>

          {generatePaginationItems(
            totalPages,
            currentPage,
            onPageChange,
            showEllipsisThreshold
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={cn(
                currentPage === 1 ? "pointer-events-none opacity-50" : "",
                "cursor-pointer"
              )}
            >
              Sau
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
