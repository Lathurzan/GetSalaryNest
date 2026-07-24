import type { Metadata, Viewport } from "next";
import AuthProvider from "@/components/providers/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SalaryNest — Personal salary and expense tracker",
    template: "%s · SalaryNest",
  },
  description:
    "Track your salary, expenses, and savings in one place. Set savings goals, categorise spending, and see monthly reports.",
  metadataBase: new URL("https://getsalarynest.com"),
  openGraph: {
    title: "SalaryNest",
    description: "Know where your salary goes, before it's gone.",
    url: "https://getsalarynest.com",
    siteName: "SalaryNest",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0f2b2b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}