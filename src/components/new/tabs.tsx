"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { HTMLAttributes } from "react";

type TTab = {
  id: string;
  label: string;
};

type Props = {
  tabs: TTab[];
  currentTab: TTab;
  setCurrentTab: (tab: TTab) => void;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export const Tabs = ({
  tabs,
  currentTab,
  setCurrentTab: setTab,
  className,
  ...props
}: Props) => {
  const handleSetActiveTab = (tab: TTab) => {
    setTab(tab);
  };

  return (
    <div
      className={cn(
        "h-9 flex items-center justify-center text-gray-95 gap-3",
        className
      )}
      {...props}
    >
      {tabs.map((tab, index) => (
        <div
          key={index}
          onClick={() => handleSetActiveTab(tab)}
          className={cn(
            "w-full h-full flex items-center justify-center rounded-t-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 cursor-pointer",
            currentTab.id === tab.id
              ? "border-b-4 border-primary-60 text-primary-95"
              : "text-gray-600 hover:text-gray-900"
          )}
          role="tab"
          aria-selected={currentTab.id === tab.id}
          aria-controls={`${index}-panel`}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};
