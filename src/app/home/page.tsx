"use client";
import WithAuth from "@/components/hoc/WithAuth";
import React from "react";

const home: React.FC = () => {
  return (
    <>
      <div className="text-xl text-primary-900 px-8">Trang chủ</div>
    </>
  );
};

export default WithAuth(home);
