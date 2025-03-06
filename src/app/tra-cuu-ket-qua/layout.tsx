"use client";

import ContestLayout from "@/components/layout/ContestLayout";
import DotPattern from "@/components/ui/dot-pattern";
import { LAYERS } from "@/contants/layer";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
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
