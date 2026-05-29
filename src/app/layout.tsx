import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "AdmitFlow — Your AI mentor for global university admissions",
    template: "%s · AdmitFlow",
  },
  description:
    "AdmitFlow is the AI admission mentor that helps students get into top universities abroad — chance estimates, personalized roadmaps, essay feedback and scholarship discovery.",
  keywords: [
    "university admissions",
    "AI mentor",
    "study abroad",
    "admission chance estimator",
    "scholarships",
    "college application",
  ],
  authors: [{ name: "AdmitFlow" }],
  openGraph: {
    title: "AdmitFlow — Your AI mentor for global university admissions",
    description:
      "Get into top universities abroad with an AI mentor that estimates your chances, builds your roadmap and reviews your essays.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06070d" },
    { media: "(prefers-color-scheme: light)", color: "#fafbff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
