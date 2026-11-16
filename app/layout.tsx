import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "BeamLab — Structural Analysis, Made Visual",
  description: "An interactive learning tool for beam reactions, shear force and bending moment diagrams."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
