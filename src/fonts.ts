import localFont from "next/font/local";

export const localKanitFont = localFont({
  src: [
    {
      path: "./assets/fonts/Kanit-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/fonts/Kanit-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/Kanit-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-kanit",
});
