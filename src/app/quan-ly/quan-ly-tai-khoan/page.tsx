"use client";

import { AccountTypeDialog } from "@/components/account/AccountTypeDialog";
import { AccountTable } from "@/components/admin/account-table";
import { CommonButton } from "@/components/common/button/CommonButton";
import { useState } from "react";

export default function Admin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleAccountTypeSelect = (type: string) => {
    console.log("Selected account type:", type);
    // Here you can add logic to handle the selected account type
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="w-full h-full border-r border-gray-20 overflow-y-auto">
        <div className="w-full h-auto min-h-[68px] flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border-b border-gray-20">
          <div className="text-SubheadLg text-gray-95 mb-2 sm:mb-0">
            Học viên
          </div>
          <CommonButton
            className="h-9"
            variant="primary"
            onClick={handleOpenDialog}
          >
            Tạo tài khoản
          </CommonButton>
        </div>
        <div className="p-4 flex-1">
          <AccountTable />
        </div>
      </div>
      <AccountTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSelect={handleAccountTypeSelect}
      />
    </>
  );
}
