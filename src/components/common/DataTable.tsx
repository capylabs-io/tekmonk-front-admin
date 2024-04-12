"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import { Edit, Trash, Triangle } from "lucide-react";
import classNames from "classnames";
import { Button } from "../common/Button";
import { HEADERS } from "@/const/hiring";
import { get } from "lodash";
import { formatISODate, isISODate } from "@/lib/utils";

type Header = {
  key: string;
  name: string;
};

type Props = {
  headers: Header[];
  data: any[];
  isDetailTable?: boolean;
};

export const DataTable = ({ headers, data, isDetailTable = false }: Props) => {
  console.log(data);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index} className="text-center">
              <div className="flex flex-row gap-x-1 justify-center">
                <div className="my-auto">{header.name}</div>
                <div className="flex flex-col justify-center gap-y-1">
                  <Triangle size={10} color="#fff" fill="#CCC" className="" />
                  <Triangle
                    size={10}
                    color="#fff"
                    fill="#CCC"
                    className="rotate-180"
                  />
                </div>
              </div>
            </TableHead>
          ))}
          {isDetailTable && (
            <TableHead className="text-center">Hành động</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 &&
          data.map((row, index) => {
            return (
              <TableRow
                key={index}
                className={classNames((index + 1) % 2 === 0 && "bg-gray-50")}
              >
                {HEADERS.map((header, index) => (
                  <TableCell key={index} className="text-center">
                    {isISODate(get(row.attributes, header.key))
                      ? formatISODate(get(row.attributes, header.key))
                      : get(row.attributes, header.key)}
                  </TableCell>
                ))}
                {isDetailTable && (
                  <TableCell className="text-center flex gap-x-3 justify-center">
                    <Button className="h-max bg-transparent !p-0 !text-black">
                      <Edit size={16} />
                    </Button>
                    <Button className="h-max bg-transparent !p-0 !text-black">
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};
