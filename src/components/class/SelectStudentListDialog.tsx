import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommonButton } from "@/components/common/button/CommonButton";
import { AddStudentToClass } from "../admin/add-student-to-class";
import { useClassStore } from "@/store/class-store";
import { AddItemDialog } from "../admin/dialogs/add-item-dialog";
import { ReqGetUsers } from "@/requests/user";
import { get } from "lodash";
import { Certificate, User } from "@/types/common-types";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";

type Props = {
  title: string;
  isOpen: boolean;
  openDialogClick: (status: boolean) => void;
  closeDialogClick: () => void;
  handleAddStudent: (data: string[]) => void;
  listStudentHasCertificateSelected?: User[];
};
export const SelectStudentListDialog = ({
  title,
  isOpen,
  openDialogClick,
  closeDialogClick,
  handleAddStudent,
  listStudentHasCertificateSelected,
}: Props) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentClass] = useClassStore((state) => [state.currentClass]);
  const handleAddStudents = () => {
    handleAddStudent(selectedStudents);
    setSelectedStudents([]);
  };
  const [step, setStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);

  // Theo dõi danh sách học viên đã được chọn trước đó
  useEffect(() => {
    if (
      listStudentHasCertificateSelected &&
      listStudentHasCertificateSelected.length > 0
    ) {
      console.log(
        "listStudentHasCertificateSelected",
        listStudentHasCertificateSelected
      );
      const selectedIds = listStudentHasCertificateSelected.map((student) =>
        String(student.id)
      );
      setSelectedStudents(selectedIds);
    }
  }, [listStudentHasCertificateSelected]);

  const { data: studentList } = useQuery({
    queryKey: ["studentList", currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            user_role: {
              code: {
                $eq: "STUDENT",
              },
            },
          },
          populate: "user_role",
          pagination: {
            page: currentPage,
            pageSize: itemsPerPage,
          },
        });
        return await ReqGetUsers(queryString);
      } catch (error) {
        console.log("error when fetching student list", error);
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <AddItemDialog
      open={isOpen}
      onOpenChange={openDialogClick}
      title={title}
      description=""
      items={get(studentList, "data", []) || []}
      selectedItems={selectedStudents}
      setSelectedItems={setSelectedStudents}
      searchPlaceholder="Tìm kiếm học viên"
      nameKey="username"
      descriptionKey="email"
      totalItems={get(studentList, "meta.pagination.total", 0)}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      onItemsPerPageChange={setItemPerPage}
      onSubmit={handleAddStudents}
      onCancel={closeDialogClick}
    />
  );
};
