import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata = {
  title: "建築物地図サービス",
  description: "日本全国の有名建築家の建物を地図から閲覧できるWebサービス",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
