"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContactInfo } from "@/components/contest/ContactInfo";

export const CardContactInfo = () => {
  return (
    <>
      <Card className="border-none">
        <CardHeader className="p-0">
          <div className="text-2xl font-bold mb-4">Thông tin liên hệ</div>
        </CardHeader>
        <CardContent className="space-y-4 p-0">
          <ContactInfo />
        </CardContent>
      </Card>
    </>
  );
};
