import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import LenisProvider from "@/provider/ScrollWraper";
import Cursor from "@/components/Cursor";
import { Toaster } from "react-hot-toast";
import { Orbitron } from "next/font/google";
import { Poppins} from "next/font/google";

// Local fonts
const gellixRegular = localFont({
  src: "../fonts/gellixRegular.ttf",
  variable: "--font-gellix-regular",
  weight: "400",
  style: "normal",
});



const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"], // the weights you need
  variable: "--font-orbitron", // creates a CSS variable
});

const sharpSansMedium = localFont({
  src: "../fonts/Sharp-Sans-Medium.otf",
  variable: "--font-sharp-sans-medium",
  weight: "500",
  style: "normal",
});

const sharpSansSemibold = localFont({
  src: "../fonts/Sharp-Sans-Semibold.otf",
  variable: "--font-sharp-sans-semibold",
  weight: "600",
  style: "normal",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Summr",
  description: "Meet the Next Generation of Sweat and Body care!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gellixRegular.variable} ${sharpSansMedium.variable} ${poppins.variable} ${orbitron.variable} ${sharpSansSemibold.variable} antialiased`}
      >
        <LenisProvider>
          <Cursor />
          <Toaster />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
