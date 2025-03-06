"use client";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Link from "next/link";
import { CONTEST_RULES_DETAILS } from "@/contants/contest/tekmonk";
import { ContactInfo } from "@/components/contest/ContactInfo";

export const Step4 = ({ updateStatus }: { updateStatus: any }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(false);
    setIsChecked(!isChecked);
    updateStatus();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-950">
          Quý phụ huynh và thí sinh xác nhận đã đọc kỹ thông tin về giải đấu
          <span className="text-red-500 ml-0.5">*</span>
        </h2>
        <p className="text-base text-gray-700">
          Thông tin chi tiết xem{" "}
          <Link
            href={CONTEST_RULES_DETAILS}
            target="_blank"
            className="text-primary-700 underline hover:text-primary-800 transition-colors"
          >
            tại đây
          </Link>
        </p>
      </div>

      <RadioGroup className="pt-2">
        <div
          className="flex items-center space-x-3 hover:cursor-pointer group"
          onClick={handleCheckboxChange}
        >
          <RadioGroupItem
            value="1"
            id="category-A"
            checked={isChecked}
            className="group-hover:border-primary-600"
          />
          <div className="text-base font-medium text-gray-900 cursor-pointer">
            Tôi đã đọc, nắm bắt thông tin về giải đấu
          </div>
        </div>
      </RadioGroup>

      <ContactInfo />
    </div>
  );
};
