import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Header from "@/components/Header";
import Banner from "@/components/Banner";
import "@/style/global.css"; // CSS toàn cục
import Footer from "@/components/Footer";


export const metadata = {
  title: "Trang web của bạn",
  description: "Mô tả",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className=" container-all-content mb-4 mt-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
