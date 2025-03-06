/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_DOCS_PER_PAGE } from '@/contants/defaults';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import { ReactTableScroll } from 'react-table-scroll';
// import { NoData } from './NoData';
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
// import { LoadingSpinner } from '@/components/common/Loading';
type Props = {
  data: any[];
  columns: any[];
  page: number;
  totalPage: number;
  totalDocs?: number;
  docsPerPage?: number;
  selectedRow?: { [key: number]: boolean };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowClick?: (row: any) => void;
  onRowDoubleClick?: (row: any) => void;
  onRowSelection?: (row: any) => void;
  enableRowSelection?: boolean;
  enableIndexColumn?: boolean;
  disableFooter?: boolean;
  disableBorder?: boolean;
  manualPagination?: boolean;
  disableDefaultRowSelection?: boolean;
  onSelect?: (row: any) => void;
  customTableClassname?: string;
  isLoading?: boolean;
};

export function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={classNames(
        'cursor-pointer',
        className,
        rest.checked && '!accent-blue-50'
      )}
      {...rest}
    />
  );
}

export const CommonTable = ({
  columns,
  data,
  docsPerPage = DEFAULT_DOCS_PER_PAGE,
  totalPage,
  totalDocs,
  page = 1,
  // rowSelection,
  selectedRow,
  enableRowSelection = false,
  enableIndexColumn = false,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  onRowSelection,
  onRowDoubleClick,
  disableFooter = false,
  disableBorder = false,
  disableDefaultRowSelection = false,
  manualPagination = true,
  customTableClassname,
  onSelect,
  isLoading,
}: Props) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: docsPerPage,
  });
  const [rowSelection, setRowSelection] = useState({});
  const isEmpty = !data || data.length === 0;
  const startItem = (page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(page * pagination.pageSize, totalDocs || 0);
  const rowSelectionColumn = {
    id: 'select',
    header: ({ table }: any) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }: any) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
    size: 36,
  };

  const indexColumn = {
    header: 'STT',
    cell: ({ row }: any) => <span>{row.index + 1}</span>,
  };

  const renderedColumns = (): any[] => {
    const clone = cloneDeep(columns);
    if (enableIndexColumn) {
      clone.unshift(indexColumn);
    }
    if (
      enableRowSelection &&
      !disableDefaultRowSelection &&
      data &&
      data.length > 0
    ) {
      clone.unshift(rowSelectionColumn);
    }
    return clone;
  };

  const handleOnRowSelection = (row: any) => {
    setRowSelection(row);
    onRowSelection?.(row);
  };

  const table = useReactTable({
    data,
    columns: renderedColumns(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: handleOnRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      rowSelection,
      pagination,
    },
    manualPagination: manualPagination,
  });

  const isFirstPage = useMemo(() => {
    return manualPagination ? page === 1 : !table.getCanPreviousPage();
  }, [manualPagination, page, table, totalPage, pagination]);

  const isLastPage = useMemo(() => {
    return manualPagination ? page === totalPage : !table.getCanNextPage();
  }, [manualPagination, page, table, totalPage, pagination]);


  const headerCount = table
    .getHeaderGroups()
    .reduce((count, group) => count + group.headers.length, 0);

  const handleNextPage = () => {
    if (!isLastPage) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      manualPagination ? onPageChange!(page! + 1) : table.nextPage();
    }
  };

  const handlePrevPage = () => {
    if (!isFirstPage) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      manualPagination ? onPageChange!(page! - 1) : table.previousPage();
    }
  };
  const handlePageChange = (page: number) => {
    onPageChange?.(page);
  };

  const handleRowClick = (row: any) => {
    onRowClick?.(row);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onSelect && onSelect?.(row.original);
  };

  // const pageOptions = useMemo(() => {
  //   const options = createArrayFrom1ToN(
  //     manualPagination ? (totalPage ?? 1) : table.getPageCount()
  //   );
  //   return options.map((option: any) => (
  //     <SelectItem key={option} value={option.toString()}>
  //       {option}
  //     </SelectItem>
  //   ));
  // }, [manualPagination, table, totalPage, pagination]);˜

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    selectedRow && setRowSelection(selectedRow ?? {});
  }, [selectedRow]);

  const tableFooter = (
    <div className="mt-4 flex w-full justify-between text-sm font-normal text-gray-95">
      <div
        className={classNames(
          "flex items-center gap-2 w-full "
        )}
      >
        <span className="text-sm">Hiển thị</span>
        <Select
          value={pagination.pageSize.toString()}
          onValueChange={(value) => onPageSizeChange?.(Number(value))}
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
        <span className="text-BodySm text-gray-95">{`${startItem}-${endItem} trong số ${totalDocs} kết quả`}</span>
      </div>
      <Pagination className="bg-transparent !text-base !mx-0 !justify-end">
        <PaginationContent>
          <PaginationItem className='inline-flex items-center gap-1 cursor-pointer' onClick={handlePrevPage}>
            <ChevronLeft
              size={20}
            ></ChevronLeft>
            <span className='text-BodySm'>Trước</span>
          </PaginationItem>
          {page > 1 && (
            <PaginationItem className='!ml-4'>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
                className='hover:bg-purple-100 border border-gray-20 shadow-custom-gray rounded-lg'
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}
          {page > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {page > 2 && (
            <PaginationItem className=''>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page - 1);
                }}
                className='hover:bg-purple-100 border border-gray-20 shadow-custom-gray rounded-lg'
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem >
            <PaginationLink
              href="#"
              isActive
              onClick={(e) => e.preventDefault()}
              className={classNames('bg-primary-10 border-none text-primary-70', page === 1 && '!ml-4')}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          {page < totalPage - 1 && (
            <PaginationItem >
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                className='hover:bg-purple-100 border border-gray-20 shadow-custom-gray rounded-lg'
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {page < totalPage - 2 && (
            <PaginationItem >
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {page !== totalPage && (
            <PaginationItem className='!mr-4'>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPage);
                }}
                className='hover:bg-purple-100 border border-gray-20 shadow-custom-gray rounded-lg'
              >
                {totalPage}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem className='inline-flex items-center gap-1 cursor-pointer' onClick={handleNextPage}>
            <span className='text-BodySm'>Sau</span>
            <ChevronRight
              size={20}
            ></ChevronRight>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );

  const buildTable = (
    <>
      <div
        className={classNames(
          !disableBorder && 'rounded-lg',
          'w-full overflow-x-auto rounded-2xl border',
          customTableClassname
        )}
      >
        <ReactTableScroll>
          <table className="w-full text-sm text-white">
            {!table
              .getHeaderGroups()
              .every((headerGroup) =>
                headerGroup.headers.every(
                  (header) =>
                    !header.column.columnDef.header ||
                    header.column.columnDef.header === ''
                )
              ) && (
                <>
                  <thead className="bg-card border-b">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        className="!rounded-lg text-sm text-gray-95"
                      >
                        {headerGroup.headers.map((header) => (
                          <th
                            className="px-4 py-3 text-start text-sm font-medium text-gray-95"
                            key={header.id}
                            style={{
                              width:
                                header.getSize() !== 150
                                  ? header.getSize()
                                  : 'auto',
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                </>
              )}
            {isLoading != undefined && !isLoading && !isEmpty && (
              <tbody className="w-full text-gray-95">
                {table.getRowModel().rows.map((row) => (
                  <>
                    <tr
                      className={classNames(
                        'hover:bg-blue-5 cursor-pointer !rounded-lg bg-card'
                        // row.index === table.getRowCount() - 1 && 'border-b-0',
                        // row.original.isError && 'bg-red-100 py-2 box-content',
                      )}
                      key={row.id}
                      onClick={() => handleRowClick(row)}
                      onDoubleClick={() => onRowDoubleClick?.(row)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td className="px-4 py-3" key={cell.id}>
                          <div className="line-clamp-1 flex items-center justify-between">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                            {selectedRow && selectedRow[row.original.id] && (
                              <CheckCircle
                                className="ml-2"
                                fill="white"
                                stroke="blue"
                                size={18}
                              />
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </>
                ))}
              </tbody>
            )}
          </table>
        </ReactTableScroll>
        {isLoading != undefined && !isLoading && isEmpty && (
          <div className="my-12 flex items-center justify-center">
            <span className="text-lg text-gray-500">No Data Available</span>
          </div>
        )}
      </div>
      {!disableFooter &&
        !isEmpty &&
        isLoading != undefined &&
        !isLoading &&
        tableFooter}
      {isLoading && (
        <div className="flex h-[100px] w-full items-center justify-center">
          {/* <LoadingSpinner color="white" size={24} /> */}
        </div>
      )}
    </>
  );

  return buildTable;
};
