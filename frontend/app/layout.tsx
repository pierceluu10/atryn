import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Compass",
  description:
    "Discover labs, professors, services, and opportunities tailored to your interests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
