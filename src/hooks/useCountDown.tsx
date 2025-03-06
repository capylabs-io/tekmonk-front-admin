"use client";
import { TimeLeft } from "@/types/common-types";
import { useEffect, useState } from "react";

export const useCountDown = (targetDate: Date) => {
  const countDownDate = new Date(targetDate).getTime();

  //get distance between now and the count down date
  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  const getReturnValues = (): TimeLeft => {
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return {
    getReturnValues,
  };
};

// const useCountdown = (targetDate: Date) => {
//   const countDownDate = new Date(targetDate).getTime();

//   const [countDown, setCountDown] = useState(
//     countDownDate - new Date().getTime()
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCountDown(countDownDate - new Date().getTime());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [countDownDate]);

//   return getReturnValues(countDown);
// };

// const getReturnValues = (countDown: number) => {
//   // calculate time left
//   const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
//   const hours = Math.floor(
//     (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//   );
//   const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

//   return [days, hours, minutes, seconds];
// };

// export default  useCountdown;
