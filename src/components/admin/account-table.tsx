"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import StudentTablePagination from "./student-table-pagination";
import { Edit, Pencil, Trash2 } from "lucide-react";
import { EditUserDialog } from "./dialogs/edit-user-dialog";
import { DeactivateUserDialog } from "./dialogs/deactivate-user-dialog";
import { DeleteUserDialog } from "./dialogs/delete-user-dialog";

import { useQuery, useMutation } from "@tanstack/react-query";
import { ReqGetUsers, ReqUpdateUser, ReqDeleteUser } from "@/requests/user";
import qs from "qs";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useLoadingStore } from "@/store/LoadingStore";
import { User } from "@/types/common-types";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div
      className="w-[300px] h-[200px] bg-contain bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/admin/empty-data.png')" }}
    />
    <p className="text-gray-500 mt-4">Không có dữ liệu</p>
    <p className="text-gray-500">Tạo tài khoản mới cho học viên để bắt đầu</p>
    <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
      Tạo tài khoản
    </button>
  </div>
);

export const AccountTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("STUDENT");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  /** UseStore */
  const [show, hide] = useLoadingStore((state) => [state.show, state.hide]);
  const [success, error] = useSnackbarStore((state) => [
    state.success,
    state.error,
  ]);
  /** UseQuery */
  const { data, refetch } = useQuery({
    queryKey: ["users", activeTab, currentPage, itemsPerPage, sortOrder],
    queryFn: async () => {
      try {
        const queryString = qs.stringify({
          filters: {
            user_role: {
              code: {
                $eq: activeTab.toUpperCase(),
              },
            },
          },
          populate: "user_role",
          page: currentPage,
          pageSize: itemsPerPage,
          sort: [`id:${sortOrder}`],
        });
        return await ReqGetUsers(queryString);
      } catch (error) {
        console.log(error);
      }
    },
    refetchOnWindowFocus: false,
  });

  /**
   * React Query Mutations
   */
  const { mutate: updateUserMutation } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ReqUpdateUser(id, data),
    onSuccess: () => {
      success("Thành công", "Cập nhật thông tin người dùng thành công");
      refetch();
      setEditDialogOpen(false);
      setEditingUser(null);
    },
    onError: (err) => {
      console.error("Error updating user:", err);
      error("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin người dùng");
    },
    onSettled: () => {
      hide();
    },
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: (userId: string) => ReqDeleteUser(userId),
    onSuccess: () => {
      success("Thành công", "Xóa người dùng thành công");
      refetch();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (err) => {
      console.error("Error deleting user:", err);
      error("Lỗi", "Có lỗi xảy ra khi xóa người dùng");
    },
    onSettled: () => {
      hide();
    },
  });

  const { mutate: resetPasswordMutation } = useMutation({
    mutationFn: (userId: string) =>
      ReqUpdateUser(userId, {
        password: "123123",
      }),
    onSuccess: () => {
      success("Thành công", "Đặt lại mật khẩu thành công");
      refetch();
    },
    onError: (err) => {
      console.error("Error resetting password:", err);
      error("Lỗi", "Có lỗi xảy ra khi đặt lại mật khẩu");
    },
    onSettled: () => {
      hide();
    },
  });

  /**
   * Function handler
   */
  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      show();
      deleteUserMutation(userToDelete.id.toString());
    } catch (err) {
      console.error("Error initiating delete:", err);
      hide();
    }
  };

  const handleResetPassword = (userId: number) => {
    try {
      show();
      updateUserMutation({
        id: userId.toString(),
        data: { password: "123123" },
      });
    } catch (err) {
      console.error("Error initiating password reset:", err);
      hide();
    }
  };

  const handleDeactivate = () => {
    try {
      show();
      if (!editingUser) return;
      updateUserMutation({
        id: editingUser.id.toString(),
        data: { blocked: !editingUser.blocked },
      });
    } catch (error) {
    } finally {
      setDeactivateDialogOpen(false);
      setEditDialogOpen(false);
      hide();
    }
  };

  const tabs = [
    { id: "STUDENT", label: "Học viên" },
    { id: "TEACHER", label: "Giảng viên" },
    { id: "CLASSMANAGEMENT", label: "Quản lý lớp" },
    { id: "MODERATOR", label: "Quản trị viên" },
  ];

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleEdit = (user: User) => {
    // Only pass the editable fields to the dialog
    const editableUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      phoneNumber: user.phoneNumber,
      parentName: user.parentName,
      parentPhoneNumber: user.parentPhoneNumber,
      studentAddress: user.studentAddress,
      className: user.className,
      parentEmail: user.parentEmail,
      blocked: user.blocked,
      user_role: user.user_role || {
        code: activeTab,
      },
    };
    setEditingUser(editableUser as User);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingUser) return;

    try {
      show();
      // Prepare data for API
      const {
        id,
        user_role,
        provider,
        password,
        resetPasswordToken,
        confirmationToken,
        resetPasswordExpires,
        createdAt,
        updatedAt,
        metadata,
        skills,
        data,
        ...updateData
      } = editingUser;

      // Call mutation
      updateUserMutation({
        id: id.toString(),
        data: {
          ...updateData,
        },
      });
    } catch (err) {
      console.error("Error initiating update:", err);
      hide();
    }
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const getTableHeaders = () => {
    switch (activeTab) {
      case "STUDENT":
        return [
          { label: "STT", sortable: true },
          { label: "Tên học viên" },
          { label: "Tên tài khoản" },
          { label: "Email" },
          { label: "Trạng thái" },
          { label: "Thao tác", align: "right" },
        ];
      case "TEACHER":
        return [
          { label: "STT", sortable: true },
          { label: "Tên giảng viên" },
          { label: "Tên tài khoản" },
          { label: "Email" },
          { label: "Trạng thái" },
          { label: "Thao tác", align: "right" },
        ];
      case "CLASSMANAGEMENT":
        return [
          { label: "STT", sortable: true },
          { label: "Tên người dùng" },
          { label: "Tên tài khoản" },
          { label: "Email" },
          { label: "Loại" },
          { label: "Thao tác", align: "right" },
        ];
      default:
        return [
          { label: "STT", sortable: true },
          { label: "Tên người dùng" },
          { label: "Tên tài khoản" },
          { label: "Email" },
          { label: "Trạng thái" },
          { label: "Thao tác", align: "right" },
        ];
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-wrap border-b border-gray-200 mb-4 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[120px] max-w-[144px] py-2 px-4 text-center text-sm font-medium ${
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {data && data.meta?.pagination.total === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-md border min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                {getTableHeaders().map((header, index) => (
                  <TableHead
                    key={index}
                    className={`${header.sortable ? "cursor-pointer" : ""} ${
                      header.align === "right" ? "text-right" : ""
                    } ${index === 0 ? "w-[100px]" : ""}`}
                    onClick={header.sortable ? handleSort : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {header.label}
                      {header.sortable && (
                        <span className="inline-block">
                          {sortOrder === "asc" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m18 15-6-6-6 6" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="text-BodySm">
              {data &&
                data.data.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{user.fullName || user.username}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div>{user.blocked ? "Đã khóa" : "Đang hoạt động"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full text-BodySm text-gray-95"
                        onClick={() => handleEdit(user)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-square-pen"
                        >
                          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                        </svg>
                      </button>

                      <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      {data && data.meta.pagination.total > 0 && (
        <StudentTablePagination
          totalItems={data.meta.pagination.total}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={editingUser}
        onUserChange={setEditingUser}
        onSubmit={handleEditSubmit}
        onDeactivate={() => setDeactivateDialogOpen(true)}
        onResetPassword={handleResetPassword}
      />

      <DeactivateUserDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        onConfirm={handleDeactivate}
        isBlocked={editingUser?.blocked}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
