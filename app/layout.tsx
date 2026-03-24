import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import ToastProvider from "@/components/Toast";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Freshroot Farms — Farm Fresh, From Soil to Fork",
		template: "%s | Freshroot Farms",
	},
	description:
		"Farm-fresh organic produce delivered from soil to your fork. Grow your own kitchen garden with our expert guidance.",
	metadataBase: new URL("https://freshrootfarms.com"),
	icons: {
		icon: "/FRF_logo.svg",
		apple: "/FRF_logo.svg",
	},
	openGraph: {
		type: "website",
		siteName: "Freshroot Farms",
		locale: "en_IN",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-white text-gray-900">
				<QueryProvider>
					<ToastProvider>{children}</ToastProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
