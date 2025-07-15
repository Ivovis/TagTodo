import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Metadata } from "next";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TagTodo",
  description: "Task manager organised with tags",
};

export default function RootLayout({ children }) {
  return (
    <>
      <ClerkProvider appearance={{ cssLayerName: "clerk" }}>
        <html lang="en">
          <body
            className={`flex flex-col h-screen overflow-hidden ${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Header />
            {children}
            <Footer />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
