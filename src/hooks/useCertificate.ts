"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Achievement } from "@/types/common-types";

export const useCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)
  const [totalPage, setTotalPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(100);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);


  return {
    totalPage,
    totalDocs,
    limit,
    page,
    isOpenCreateModal,
    setIsOpenCreateModal,
    setLimit,
    setPage
  }
};
