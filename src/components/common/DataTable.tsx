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

type Props = {
  headers: string[];
  data: any[];
  isDetailTable?: boolean;
};

export const DataTable = ({ headers, data, isDetailTable = false }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index} className="text-center">
              <div className="flex flex-row gap-x-1 justify-center">
                <div className="my-auto">{header}</div>
                <div className="flex flex-col justify-center">
                  <Triangle size={12} />
                  <Triangle size={12} className="rotate-180" />
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
        {data.map((row, index) => {
          return (
            <TableRow
              key={index}
              className={classNames((index + 1) % 2 === 0 && "bg-gray-50")}
            >
              {HEADERS.map((cell, index) => (
                <TableCell key={index} className="text-center"></TableCell>
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
