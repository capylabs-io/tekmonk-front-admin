import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonButton } from "@/components/common/button/CommonButton";
import { AddStudentToClass } from '../admin/add-student-to-class';
import { useClassStore } from '@/store/class-store';
import { useLoadingStore } from '@/store/LoadingStore';
import { useSnackbarStore } from '@/store/SnackbarStore';
import { useMutation } from '@tanstack/react-query';

type Props = {
  title: string,
  isOpen: boolean
  openDialogClick: (status: boolean) => void
  closeDialogClick: () => void
  handleAddStudent: (data: string[]) => void
}
export const SelectStudentListDialog = ({ title, isOpen, openDialogClick, closeDialogClick, handleAddStudent }: Props) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentClass] = useClassStore((state) => [state.currentClass])
  const handleAddStudents = () => {
    handleAddStudent(selectedStudents);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={openDialogClick}
    >
      <DialogContent className="w-[680px] bg-white">
        <DialogHeader className="px-4">
          <DialogTitle className="text-HeadingSm font-semibold text-gray-95">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <AddStudentToClass
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
            classId={currentClass?.id.toString() as string}
          />

          {/* Actions */}
          <div className="flex justify-between mt-4">
            <div>
              <span className="text-sm text-gray-500">
                Đã chọn {selectedStudents.length} học viên
              </span>
            </div>
            <div className="flex gap-2">
              <CommonButton
                variant="secondary"
                onClick={closeDialogClick}
              >
                Hủy
              </CommonButton>
              <CommonButton
                variant="primary"
                onClick={handleAddStudents}
                disabled={selectedStudents.length === 0}
              >
                Thêm
              </CommonButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
