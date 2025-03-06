import type { Metadata } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Loading } from "@/components/common/Loading";
import { Snackbar } from "@/components/common/Snackbar";
import { Suspense } from "react";
import { localKanitFont } from "@/fonts";
import {
  CONTEST_SHARE_IMAGE_LINK,
  SHARE_TEXT,
  SHARE_TITLE,
} from "@/contants/contest/tekmonk";

import TopLoader from "nextjs-toploader";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

const delaGothicOne = localFont({
  src: ".././assets/fonts/DelaGothicOne-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-dela",
});

const nunitoSans = Nunito_Sans({
  // weight: "600",
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://olympiad.tekmonk.edu.vn"),
  title: SHARE_TITLE,
  description: SHARE_TEXT,
  icons: {
    icon: "/favicon.ico?v=4",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    title: SHARE_TITLE,
    description: SHARE_TEXT,
    siteName: SHARE_TITLE,
    images: [
      {
        url: CONTEST_SHARE_IMAGE_LINK,
        width: 1200,
        height: 630,
        alt: SHARE_TITLE,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: "@tekmonk",
    title: SHARE_TITLE,
    description: SHARE_TEXT,
    images: [CONTEST_SHARE_IMAGE_LINK],
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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${delaGothicOne.variable} ${localKanitFont.variable}`}
    >
      <body>
        <Snackbar />
        <TopLoader showSpinner={false} color="#bc4cac" />
        <Suspense fallback={<Loading />}>
          <Providers>
            <div className="relative">{children}</div>
          </Providers>
        </Suspense>
        <Loading />
      </body>
    </html>
  );
}
