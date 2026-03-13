import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Atryn - Research Discovery at U of T",
  description:
    "Discover research labs and connect with professors at the University of Toronto, tailored to your interests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
