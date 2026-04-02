import type { Metadata } from 'next';
import { Fira_Sans } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'timeskip',
  description: 'Objectives and goals tracker with timeskip',
};

const fonts = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fonts.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
