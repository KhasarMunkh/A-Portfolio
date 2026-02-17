import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ThemeProvider";
import Footer from "@/components/Footer";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://kmunkh.com"),
    title: {
        default: "Khasar Munkh-Erdene",
        template: "%s | Khasar Munkh-Erdene",
    },
    description:
        "Full-stack developer and CS student at CU Denver. Building fast, clean software with TypeScript, Go, React, and Next.js.",
    openGraph: {
        title: "Khasar Munkh-Erdene",
        description:
            "Full-stack developer and CS student at CU Denver. Building fast, clean software with TypeScript, Go, React, and Next.js.",
        url: "https://kmunkh.com",
        siteName: "Khasar Munkh-Erdene",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Khasar Munkh-Erdene",
        description:
            "Full-stack developer and CS student at CU Denver. Building fast, clean software with TypeScript, Go, React, and Next.js.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <html lang="en" className="bg-base text-text">
                <body className={`${jetbrainsMono.className}`}>
                    <ThemeProvider>
                        <NavBar />
                        {children}
                        <Footer />
                    </ThemeProvider>
                </body>
            </html>
        </ViewTransitions>
    );
}
