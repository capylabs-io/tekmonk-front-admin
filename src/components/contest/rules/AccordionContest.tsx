"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CommonInfo } from "./CommonInfo";
import { CompetitionContent } from "./CompetitionContent";
import { CompetitionInstructions } from "./CompetitionInstructions";
import { TechnicalRegulations } from "./TechnicalRegulations";
import { CardContactInfo } from "@/components/contest/rules/CardContactInfo";

const tabs = [
  { id: "1", label: "Thông tin chung", value: <CommonInfo /> },
  { id: "2", label: "Nội dung thi đấu", value: <CompetitionContent /> },
  { id: "3", label: "Hướng dẫn thi đấu", value: <CompetitionInstructions /> },
  { id: "4", label: "Quy định kỹ thuật", value: <TechnicalRegulations /> },
  { id: "5", label: "Thông tin liên hệ", value: <CardContactInfo /> },
];
export const AccordionContest = () => {
  return (
    <>
      <Accordion type="single" collapsible>
        {tabs.map((item: any, index: number) => {
          return (
            <AccordionItem key={index} value={index.toString()}>
              <AccordionTrigger className="text-gray-950 text-base">
                {item.label}
              </AccordionTrigger>
              <AccordionContent>{item.value}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};
