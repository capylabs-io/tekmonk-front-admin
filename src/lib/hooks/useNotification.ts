"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Notification } from "@/types/common-types";

const API_URL = "http://localhost:3500/notifications";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(API_URL);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notification cards:", error);
      }
    };

    fetchNotifications();
  }, []);

  return notifications;
};
