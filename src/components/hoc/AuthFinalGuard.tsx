"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/UserStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useLoadingStore } from "@/store/LoadingStore";



export default function AuthFinalGuard ({children}:any) {
    const router = useRouter();
    //use state
    const [isValid, setIsValid] = useState<boolean>(false);
    
    //use store
    const getMe = useUserStore((state) => state.getMe);
    const data = useUserStore((state) => state.userInfo?.data);
    const warning = useSnackbarStore((state) => state.warn);
    const [show, hide] = useLoadingStore((state) => [
        state.show,
        state.hide,
        ]);
    //fetch data function
    const checkAuth = async () => {
        await getMe();
        if(!data) {
            warning("Không thành công","Tài khoản của bạn không thuộc vòng chung kết");
            router.push("/");
            return;
        }
        setIsValid(true);
    }

    const fetchAll = async () => {
        try {
            show();
            checkAuth();
        } catch (error) {
            console.error(error);
        } finally {
            hide();
        }
    }
    //useEffect
    useEffect(() => {
        fetchAll();
    }, []);
    return isValid ? children : <div>Loading</div>;
  };

