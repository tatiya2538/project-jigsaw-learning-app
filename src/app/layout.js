import { Sarabun } from "next/font/google";

import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Buddhist Learning Card | Jigsaw Learning",
  description:
    "สื่อการเรียนรู้แบบ Jigsaw Learning สำหรับนักเรียนมัธยมต้น เรียนรู้บุคคลสำคัญทางพระพุทธศาสนาภายใน 2–3 นาที",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${sarabun.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-text">{children}</body>
    </html>
  );
}
