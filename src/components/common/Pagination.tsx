import classNames from "classnames";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  customClassName?: string;
  onClickPrevPage: () => void;
  onClickNextPage: () => void;
  onPageClick: (pageNumber: number) => void;
};

const BASE_CLASS = "flex items-center gap-x-1";

export const Pagination = ({
  currentPage = 1,
  totalPages,
  customClassName,
  onClickPrevPage,
  onClickNextPage,
  onPageClick,
}: Props) => {
  const handlePageClick = (pageNumber: number) => {
    onPageClick(pageNumber);
  };

  return (
    <nav className={classNames(BASE_CLASS, customClassName)}>
      <button
        type="button"
        onClick={onClickPrevPage}
        disabled={currentPage === 1}
        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:opacity-0"
      >
        <ChevronsLeft size={14} />
      </button>
      <div className="flex items-center gap-x-1">
        {Array.from({ length: totalPages }, (_, index) => (
          <span
            key={index + 1}
            className={`flex cursor-pointer min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-400 hover:text-white
            ${
              index + 1 === currentPage
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-500"
            }`}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onClickNextPage}
        disabled={currentPage === totalPages}
        className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:opacity-0"
      >
        <ChevronsRight size={14} />
      </button>
    </nav>
  );
};
