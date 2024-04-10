///not page
"use client";
import WithAuth from "@/components/hoc/WithAuth";
import React from "react";

const Product: React.FC = () => {
  return (
    <>
      <div className="text-xl text-primary-900 px-8">Product</div>
    </>
  );
};

export default WithAuth(Product);
