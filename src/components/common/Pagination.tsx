import classNames from "classnames";
import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  customClassName?: string;
  onClickPrevPage: () => void;
  onClickNextPage: () => void;
};

const BASE_CLASS = "flex items-center w-max border border-gray-300 rounded-xl";

export const Pagination: React.FC<Props> = ({
  currentPage = 1,
  totalPages,
  customClassName,
  onClickPrevPage,
  onClickNextPage,
}) => {
  return (
    <nav className={classNames(BASE_CLASS, customClassName)}>
      <button
        type="button"
        onClick={onClickPrevPage}
        // disabled={currentPage === 1}
        className="inline-flex min-h-[38px] rounded-l-xl min-w-[38px] items-center justify-center gap-x-2 px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:opacity-0"
      >
        <ArrowLeft size={14}/> Trước
      </button>
      <div className="flex items-center gap-x-2">
        <span className="flex min-h-[38px] min-w-[38px] items-center justify-center bg-primary-600 px-1.5 py-2 text-sm text-white focus:bg-gray-50 focus:outline-none border-r border-l border-gray-200">
          {currentPage}
        </span>
        <span className="flex min-h-[38px] max-w-[38px] items-center justify-center px-1.5 py-2 text-sm text-gray-500">
          of
        </span>
        <span className="flex min-h-[38px] min-w-[38px] items-center justify-center px-1.5 py-2 text-sm text-gray-500 border-r border-l border-gray-200">
          {totalPages}
        </span>
      </div>
      <button
        type="button"
        onClick={onClickNextPage}
        // disabled={currentPage === totalPages}
        className="inline-flex min-h-[38px] min-w-[38px] rounded-r-xl items-center justify-center gap-x-2 px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:opacity-0"
      >
        Sau <ArrowRight size={14}/>
      </button>
    </nav>
  );
};
