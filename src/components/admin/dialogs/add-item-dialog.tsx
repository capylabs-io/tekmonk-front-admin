"use client";

import { useState } from "react";
import { CommonTag } from "../../common/CommonTag";
import StudentTablePagination from "../student-table-pagination";
import { Input } from "../../common/Input";
import { get } from "lodash";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonButton } from "@/components/common/button/CommonButton";

/**
 * AddItemDialogProps interface
 */
interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  items: any[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  searchPlaceholder?: string;
  nameKey?: string;
  descriptionKey?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export const AddItemDialog = ({
  open,
  onOpenChange,
  title,
  description,
  items,
  selectedItems,
  setSelectedItems,
  searchPlaceholder = "Search items",
  nameKey = "name",
  descriptionKey = "description",
  onSubmit,
  onCancel,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange = () => {},
  onItemsPerPageChange = () => {},
}: AddItemDialogProps) => {
  /** UseState */
  const [searchQuery, setSearchQuery] = useState("");

  /** Handle Functions */
  const handleItemSelect = (itemId: string) => {
    setSelectedItems(
      selectedItems.includes(itemId)
        ? selectedItems.filter((id) => id !== itemId)
        : [...selectedItems, itemId]
    );
  };

  const filteredItems = items
    ? items.filter((item) =>
        get(item, nameKey, "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
            {title}
          </DialogTitle>
          {description && (
            <div className="text-BodyMd text-gray-60 mb-4">{description}</div>
          )}
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div className="flex flex-wrap gap-2 rounded-md min-h-[48px]">
            {selectedItems.map((selectedId) => {
              const item = items.find((i) => i.id.toString() === selectedId);
              return item ? (
                <CommonTag
                  key={item.id}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {get(item, nameKey, "")}
                  <button
                    onClick={() => handleItemSelect(item.id.toString())}
                    className="text-gray-500 hover:text-gray-700 ml-1"
                  >
                    ×
                  </button>
                </CommonTag>
              ) : null;
            })}
          </div>

          <div className="relative">
            <Input
              isSearch={true}
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              customClassNames="w-full"
              customInputClassNames="w-full pl-8"
            />
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="space-y-0 max-h-[300px] overflow-y-auto custom-scrollbar">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 hover:bg-primary-10 border-b last:border-b-0"
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {get(item, nameKey, "")}
                    </div>
                    {get(item, descriptionKey) && (
                      <div className="text-sm text-gray-500">
                        {get(item, descriptionKey, "")}
                      </div>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id.toString())}
                    onChange={() => handleItemSelect(item.id.toString())}
                    className="h-4 w-4 rounded cursor-pointer border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
            {totalItems > 0 && (
              <div className="border-t bg-white">
                <StudentTablePagination
                  showDetails={false}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onPageChange={onPageChange}
                  onItemsPerPageChange={onItemsPerPageChange}
                  showEllipsisThreshold={7}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <CommonButton
              variant="secondary"
              onClick={() => {
                if (onCancel) {
                  onCancel();
                }
                onOpenChange(false);
              }}
            >
              Cancel
            </CommonButton>
            <CommonButton
              onClick={() => {
                if (onSubmit) {
                  onSubmit();
                }
                onOpenChange(false);
              }}
            >
              Save
            </CommonButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
