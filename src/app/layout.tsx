import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/component/header';
import Footer from '@/component/footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Pollism',
  description: '어디서든 쉽게 쉽게 투표!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] flex flex-col`}
      >
        <Header />
        <main className="flex-1 pt-12 pb-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
