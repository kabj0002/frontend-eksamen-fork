// Katinka
//Mainlayout

import { Montserrat, Work_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollBar from "@/components/ScrollBar";

/* Google fonts */
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

/* Favicon */
export const metadata = {
  title: "Modernia Curators",
  icons: {
    icon: "../imgs/favicon-32x32.png", //OBS pga fejl mappe-sti blev denne ikke vist i Netlify, kun i localhost ved aflevering da jeg ryddede op inden aflevering :()
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={` ${workSans.variable} ${montserrat.variable} antialiased`}
        >
          <ScrollBar />
          <Header />
          <main className="scroll-smooth px-8 sm:px-12 md:px-20 lg:px-30">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
