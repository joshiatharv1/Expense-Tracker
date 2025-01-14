import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner"
const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: neobrutalism,
    }}
    >
    <html lang="en">
      <body className={outfit.className}>
        <Toaster />
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
