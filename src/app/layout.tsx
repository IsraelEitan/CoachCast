import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoachCast | AI Content Production for Trainers",
  description:
    "CoachCast turns one short trainer recording into scripts, branded Reels, captions, B-roll, and scheduled posts for fitness businesses."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
