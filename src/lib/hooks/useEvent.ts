"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Event } from "@/types/common-types";

const API_URL = "http://localhost:3500/events";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching event cards:", error);
      }
    };

    fetchEvents();
  }, []);

  return events;
};
