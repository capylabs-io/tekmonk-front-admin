import {CONTEST_SHARE_IMAGE_LINK, SHARE_TEXT, SHARE_TITLE} from "@/contants/contest/tekmonk";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SHARE_TITLE,
  description: SHARE_TEXT,
  openGraph: {
    type: "website",
    url: process.env.NEXT_PUBLIC_BASE_URL + "/tong-hop-bai-du-thi/[id]",
    title: SHARE_TITLE,
    description: SHARE_TEXT,
    siteName: "Tekmonk",
    images: [
      {
        url: CONTEST_SHARE_IMAGE_LINK,
        width: 1200,
        height: 630,
        alt: SHARE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tekmonk",
    title: SHARE_TITLE,
    description: SHARE_TEXT,
    images: [
      CONTEST_SHARE_IMAGE_LINK,
    ],
  },
  other: {
    "fb:app_id": "1234567890",
    "og:image:alt": SHARE_TITLE,
    "og:locale": "vi_VN",
    "og:site_name": "Tekmonk",
    "twitter:image:alt": SHARE_TITLE,
    "twitter:creator": "@tekmonk",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
