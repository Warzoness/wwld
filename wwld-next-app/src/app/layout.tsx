import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "@/style/global.css"; // CSS toàn cục
import Footer from "@/components/Footer";
import Header from "@/components/Header";


export const metadata = {
  title: "Wuthering Waves Lore Data",
  description: "Mô tả",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />

        <main className=" container-all-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
