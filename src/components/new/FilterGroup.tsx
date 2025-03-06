"use client";
import React from "react";
import Image from "next/image";
import classNames from "classnames";
import { Label } from "@/components/common/Label";
import { RadioGroup, RadioGroupItem } from "@/components/common/RadioGroup";

type Props = {
  customClassName?: string;
};
const BASE_CLASS = "rounded-xl border border-gray-200 p-4 text-primary-900";
export const FilterGroup = ({ customClassName }: Props) => {
  return (
    <div className={classNames(BASE_CLASS, customClassName)}>
      <div className="text-base font-bold">BỘ LỌC</div>
      <RadioGroup defaultValue="new" className="w-full mt-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="new" className="text-sm font-normal">
            Mới nhất
          </Label>
          <RadioGroupItem value="new" id="new" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="old" className="text-sm font-normal">
            Tin cũ nhất
          </Label>
          <RadioGroupItem value="old" id="new" />
        </div>
      </RadioGroup>
    </div>
  );
};
