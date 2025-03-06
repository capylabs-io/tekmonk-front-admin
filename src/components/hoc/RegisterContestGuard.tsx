"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getContest } from "@/requests/contest";
import { get } from "lodash";

const RegisterContestGuard = (WrappedComponent: React.FC) => {
  const Comp: React.FC = () => {
    const router = useRouter();
    const [canRegister, setCanRegister] = useState<boolean | null>(null);

    const fetchContest = async () => {
      try {
        const data = await getContest();
        if (data) {
          const currentTime = new Date();
          const contestStartTime = new Date(get(data, ["startTime"]));
          const contestEndTime = new Date(get(data, ["endTime"]));
          if (currentTime > contestStartTime && currentTime < contestEndTime) {
            setCanRegister(true);
          } else {
            setCanRegister(false);
          }
        }
      } catch (error) {
        setCanRegister(false);
      }
    };

    useEffect(() => {
      fetchContest();
    }, []);

    useEffect(() => {
      if (canRegister === false) {
        router.push("/");
      }
    }, [canRegister]);

    if (canRegister === null) {
      return <></>; // or a spinner/loading component
    }

    return canRegister ? <WrappedComponent /> : null;
  };

  return Comp;
};

export default RegisterContestGuard;
