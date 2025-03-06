"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tabs = [
  { id: 1, label: "Bảng A" },
  { id: 2, label: "Bảng B" },
  { id: 3, label: "Bảng C" },
  { id: 4, label: "Bảng D" },
];

export const ExamTableOnMobile = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
  };
  const TableA = () => {
    return (
      <Card className="w-full">
        <CardContent className="p-4 space-y-4 text-base">
          <div className="space-y-1">
            {/* <h3 className="font-semibold text-sm text-muted-foreground">Lớp</h3> */}
            <p className="text-base">Tiểu học: Lớp 3 - lớp 5</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-muted-foreground">
              Hình thức thi
            </h3>
            <Badge variant="outline">Thi cá nhân</Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-muted-foreground">
              Ngôn ngữ lập trình thi đấu
            </h3>
            <p className="text-base">
              Thí sinh vận dụng kiến thức và kĩ năng lập trình để thực hiện các
              thử thách trên nền tảng CodeCombat (
              <a
                href="https://codecombat.com/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://codecombat.com/
              </a>
              )
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TableB = () => {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            {/* <h3 className="font-semibold text-sm text-muted-foreground">Lớp</h3> */}
            <p className="text-base">THCS: Lớp 6 - lớp 9</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-muted-foreground">
              Hình thức thi
            </h3>
            <Badge variant="outline">Thi cá nhân</Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-muted-foreground">
              Ngôn ngữ lập trình thi đấu
            </h3>
            <p className="text-base">
              Thí sinh vận dụng kiến thức và kĩ năng lập trình để thực hiện các
              thử thách trên nền tảng CodeCombat (
              <a
                href="https://codecombat.com/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://codecombat.com/
              </a>
              )
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TableC = () => {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            {/* <h3 className="font-semibold text-sm text-muted-foreground">Lớp</h3> */}
            <p className="text-base">THPT: Lớp 10 - lớp 12</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-muted-foreground">
              Hình thức thi
            </h3>
            <Badge variant="outline">Thi cá nhân</Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-muted-foreground">
              Ngôn ngữ lập trình thi đấu
            </h3>
            <p className="text-base">
              Thí sinh vận dụng kiến thức và kĩ năng lập trình để thực hiện các
              thử thách trên nền tảng CodeCombat (
              <a
                href="https://codecombat.com/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://codecombat.com/
              </a>
              )
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TableD = () => {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            {/* <h3 className="font-semibold text-sm text-muted-foreground">Lớp</h3> */}
            <p className="text-base">
              THCS, THPT (Lớp 6 - lớp 12): Bảng sáng tạo
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-muted-foreground">
              Hình thức thi
            </h3>
            <Badge variant="outline">
              Thi cá nhân hoặc thi theo đội, tối đa 03 thành viên
            </Badge>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-muted-foreground">
              Ngôn ngữ lập trình thi đấu
            </h3>
            <p className="text-base">
              Thi sản phẩm phần mềm sáng tạo phù hợp với chủ đề của giải đấu (sử
              dụng Scratch hoặc Python). Sản phẩm sáng tạo dự thi chưa từng đạt
              giải các cuộc thi, hội thi cấp Quốc gia, quốc tế.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };
  return (
    <>
      <div className="w-full h-full min-h-[250px] mix-w-[400px] max-w-4xl mx-auto mt-0">
        <nav className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                handleTabChange(tab.id);
              }}
              className={`flex-1 py-2 px-1 text-center text-sm font-medium text-SubheadMd ${
                activeTab === tab.id
                  ? "text-primary-950 border-b-2 border-primary-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="mt-2">
          {activeTab === 1 && <TableA />}
          {activeTab === 2 && <TableB />}
          {activeTab === 3 && <TableC />}
          {activeTab === 4 && <TableD />}
        </div>
      </div>
    </>
  );
};
