import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
type Props = {
  title: string;
  imageUrl: string;
  onClick?: () => void;
};
export const FunnelCard = ({ title, imageUrl, onClick }: Props) => {
  const handleFunnelCardClick = () => {
    onClick && onClick();
  };
  return (
    <div
      className="rounded-xl shadow-[0_8px_0_0_#E4E7EC] p-6 bg-white z-20 hover:bg-white/90 hover:cursor-pointer"
      onClick={handleFunnelCardClick}
    >
      <div className="w-full px-4">
        <div className="p-5 bg-gradient-to-r from-primary-50 to-[#FBF3FA] rounded-full flex justify-center items-center">
          <Image src={imageUrl} alt="card pic" width={88} height={88} />
        </div>
      </div>
      <div className="flex gap-x-2 justify-center w-full items-center mt-6 px-2">
        <span className="text-xl font-bold">{title}</span>
        <ArrowRight size={20} className="text-primary-500" />
      </div>
    </div>
  );
};
