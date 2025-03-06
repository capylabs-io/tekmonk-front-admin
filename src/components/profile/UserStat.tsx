import React from "react";
import { StatCard } from "./StatCard";

export const UserStat = () => {
  return (
    <div className="py-4 flex flex-wrap justify-center gap-4">
      <StatCard value="10" title="Số huy hiệu" />
      <StatCard value="6" title="Sản phẩm tải lên" />
      <StatCard value="10000" title="Điểm sở hữu" />
      <StatCard value="3" title="Số chứng chỉ" />
      <StatCard value="24" title="Số thành tích" />
      <StatCard value="5" title="Trang bị đã mua" />
    </div>
  );
};
