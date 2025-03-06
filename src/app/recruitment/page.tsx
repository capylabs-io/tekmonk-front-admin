"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/common/button/Button";
import { RecruitmentCard } from "@/components/recruitment/RecruitmentCard";
import { Dela_Gothic_One } from "next/font/google";
// import { Recruitment } from "@/types/common-types";
import { Pagination } from "@/components/common/Pagination";
import axios from "axios";
import { API_POST } from "@/contants/api-url";
import localFont from "next/font/local";

const delaGothicOne = localFont({
  src: "../.././assets/fonts/DelaGothicOne-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-dela",
});

const itemsPerPage = 12;

function Recruitment() {
  const [recruitments, setRecruitments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        const response = await axios.get(`${API_POST}`);
        const data = response.data;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentRecruitments = data.slice(startIndex, endIndex);
        setRecruitments(currentRecruitments);

        const totalPages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRecruitments();
  }, [currentPage]);

  return (
    <div className="h-screen relative">
      <nav className="w-full flex justify-between p-4">
        <Image
          src="/image/app-logo.png"
          alt="app logo"
          width={159}
          height={32}
        />
      </nav>

      <div className="w-full flex items-center justify-center gap-x-48 relative bg-[url('/image/recruitment/recruitment-banner.png')] bg-no-repeat bg-cover h-[300px]">
        <div className="text-white">
          <div
            className={`${delaGothicOne.className} text-5xl !leading-[64px]`}
          >
            TUYỂN DỤNG TEKMONK
          </div>
          <div className="text-bodyLg mt-5">
            Tham gia trở thành giáo viên của Tekmonk ngay hôm nay.
          </div>
          <div className="flex gap-x-2 mt-5">
            <Button className="text-sm !rounded-3xl px-6">
              Tải mô tả công việc
            </Button>
            <Button className="text-sm !bg-transparent !border !border-white !rounded-3xl !px-16">
              Liên hệ
            </Button>
          </div>
        </div>

        <Image
          src="/image/recruitment/recruitment-pic.png"
          alt="left banner"
          className=""
          width={222}
          height={200}
        />
      </div>

      <div className="w-full flex flex-wrap gap-x-4 gap-y-6 justify-around mt-5 px-5">
        {recruitments.map((recruitment, index) => (
          <RecruitmentCard
            key={index}
            imageUrl={recruitment.imageUrl}
            title={recruitment.title}
            description={recruitment.description}
            tags={recruitment.tags}
          />
        ))}
      </div>

      <Pagination
        onPageClick={handlePageClick}
        customClassName="flex justify-center pb-5 pt-10"
        currentPage={currentPage}
        totalPages={totalPages}
        onClickNextPage={handleNextPage}
        onClickPrevPage={handlePrevPage}
      />
    </div>
  );
}
export default Recruitment;
