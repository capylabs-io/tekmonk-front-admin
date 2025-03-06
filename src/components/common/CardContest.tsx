"use client";
import React from "react";

interface CardContestProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContest({
  children,
  className,
  ...prop
}: CardContestProps) {
  return (
    <div
      {...prop}
      className={`bg-white rounded-3xl ${className || ""}`}
      // style={{
      //   boxShadow :"0px 5px 0px #E4E7EC"
      // }}
    >
      {children}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContestContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <div className={`${className || ""}`} {...props}>
      {children}
    </div>
  );
}
