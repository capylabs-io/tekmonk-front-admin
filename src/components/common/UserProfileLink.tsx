import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { useUserStore } from "@/store/UserStore";
import { LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

type UserProfileLinkProps = {
  userName: string;
  userRank: string;
};

const UserProfileLink: React.FC<UserProfileLinkProps> = ({
  userName,
  userRank,
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    useUserStore.getState().clear();
    router.push("/dang-nhap");
  };

  return (
    <div className="flex items-center mt-8 w-full xl:justify-between justify-center relative">
      <div className="flex items-center gap-x-2 cursor-pointer hover:text-primary-600">
        <div
          className="xl:h-10 xl:w-10 h-8 w-8 rounded-full flex flex-col bg-[url('/image/home/profile-pic.png')] bg-yellow-100 items-center justify-center bg-cover"
          onClick={toggleMenu}
        />
        <div className="xl:block hidden">
          <p className="text-sm truncate">{userName}</p>
          <p className="text-sm text-gray-500">{userRank}</p>
        </div>
      </div>

      <Dialog open={isMenuOpen} onOpenChange={toggleMenu}>
        <DialogTrigger
          onClick={toggleMenu}
          className="hover:text-primary-600 xl:block hidden "
        >
          <MoreHorizontal size={20} />
        </DialogTrigger>
        <DialogContent className=" z-[999] absolute -translate-x-1/2 -top-[70px] left-1/2 rounded-lg pl-4 bg-white shadow-md flex gap-2 items-center">
          <LogOut size={18} className="text-red-600" />
          <button
            className="w-max text-gray-600 font-normal p-4 pl-2"
            onClick={handleLogout}
          >
            Đăng xuất tài khoản
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfileLink;
