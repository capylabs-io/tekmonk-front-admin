"use client";
import React, { ReactNode, useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { Button } from "../common/button/Button";
import { ArrowRight } from "lucide-react";
import { Project } from "@/types/common-types";

type Props = {
  projects: Project[];
  customClassName?: string;
};

const BASE_CLASS =
  "rounded-xl border border-gray-200 py-4 flex flex-col text-primary-900";
export const AuthorProjectsCard = ({ projects, customClassName }: Props) => {
  return (
    <div className={classNames(BASE_CLASS, customClassName)}>
      <div className="w-full flex justify-between px-4 items-center">
        <span className="text-SubheadMd">CÙNG TÁC GIẢ</span>
        <Button size="small" outlined className="!text- !text-black">
          Xem hồ sơ
        </Button>
      </div>
      <hr className="border-t border-gray-200 my-4" />
      <div className="w-full">
        {projects.map((project, index) => {
          return (
            <>
              <div
                key={index}
                className="w-full px-3 py-1 flex justify-between items-center"
              >
                <div className="flex gap-x-3 items-center">
                  <Image
                    src={project?.thumbnailUrl}
                    alt="pic"
                    width={68}
                    height={68}
                    className="rounded-xl"
                  />
                  <div>
                    <div className="text-SubheadMd text-gray-800">
                      {project?.name}
                    </div>
                    <div className="text-bodyMd text-gray-500">
                      {project?.createdAt}
                    </div>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-800" />
              </div>
              {index + 1 !== projects.length && (
                <hr className="border-t border-gray-200 my-2" />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};
