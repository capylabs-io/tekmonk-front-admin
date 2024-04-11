///not page
"use client";
import WithAuth from "@/components/hoc/WithAuth";
import React from "react";

const Teacher: React.FC = () => {
  return (
    <>
      <div className="text-xl text-primary-900 px-8">Teacher</div>
    </>
  );
};

export default WithAuth(Teacher);
