"use client";

import GroupStageGuard from "@/components/hoc/GroupStageGuard";
import ContestLayout from "@/components/layout/ContestLayout";
import DotPattern from "@/components/ui/dot-pattern";
import { LAYERS } from "@/contants/layer";
import { cn } from "@/lib/utils";
import { Dela_Gothic_One, Nunito_Sans } from "next/font/google";
const delaGothicOne = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dela",
});
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="relative">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(200%_circle_at_center,white,transparent)]",
            `absolute top-0 h-full z-[${LAYERS.BACKGROUND_1}]`
          )}
        />
        <ContestLayout>{children}</ContestLayout>
      </div>
  );
}
