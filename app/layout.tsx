import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PageOne",
  description: "5분 만에 내 디지털 상품 판매 시작",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
