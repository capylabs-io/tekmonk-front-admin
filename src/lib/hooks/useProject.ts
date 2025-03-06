"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Project } from "@/types/common-types";

const API_URL = "http://localhost:3500/projects";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_URL);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProjects();
  }, []);

  return projects;
};
