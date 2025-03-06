import { useEffect, useState } from "react";
import { TimeLeft } from "@/types/common-types";

const DateTimeDisplay = ({
  dataTime,
  type,
  onTimeOver,
}: {
  dataTime: string;
  type: string;
  onTimeOver?: (validCountDown: boolean) => void; // Callback function from parent component
}) => {
  const [timeValue, setTimeValue] = useState<string>("0");
  const countDownDate = new Date(dataTime).getTime();
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
    if (new Date() > new Date(dataTime)) {
      if (onTimeOver) {
        onTimeOver(false); // callback from parent component
        return;
      }
    }
    const interval = setInterval(() => {
      const newCountDown = countDownDate - new Date().getTime();
      setCountDown(newCountDown);

      // if the count down is over, call the callback function
      if (newCountDown <= 0) {
        clearInterval(interval);
        if (onTimeOver) {
          onTimeOver(true); // callback from parent component
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate, onTimeOver]);

  useEffect(() => {
    const values = getReturnValues();
    switch (type) {
      case "days":
        values.days < 10
          ? setTimeValue(`0${values.days}`)
          : setTimeValue(values.days.toString());

        break;
      case "hours":
        values.hours < 10
          ? setTimeValue(`0${values.hours}`)
          : setTimeValue(values.hours.toString());
        break;
      case "minutes":
        values.minutes < 10
          ? setTimeValue(`0${values.minutes}`)
          : setTimeValue(values.minutes.toString());
        break;
      case "seconds":
        values.seconds < 10
          ? setTimeValue(`0${values.seconds}`)
          : setTimeValue(values.seconds.toString());
        break;
    }
  }, [countDown, type]);

  return getReturnValues().days +
    getReturnValues().hours +
    getReturnValues().minutes +
    getReturnValues().seconds >
    0 ? (
    <>{timeValue}</>
  ) : (
    <>00</>
  );
};

export default DateTimeDisplay;
