"use client";
import { useEffect, useState } from "react";
import { EventDetail } from "@/types/common-types";
import axios from "axios";

const API_URL = "http://localhost:3500/eventDetail";

export const useEventDetail = () => {
  const [eventDetail, setEventDetail] = useState<EventDetail>({
    title: "",
    eventTime: "",
    eventVenue: "",
    address: "",
    month: "",
    day: "",
    weekday: "",
    content: "",
  });

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(API_URL);

        setEventDetail(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetail();
  }, []);

  const updateEventDetail = (key: keyof EventDetail, value: string) => {
    const updatedDetail = { ...eventDetail };
    updatedDetail[key] = value;
    setEventDetail(updatedDetail);
  };

  return {
    eventDetail,
    updateEventDetail,
  };
};
