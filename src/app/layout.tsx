import type { Metadata } from 'next';
import { Fira Sans } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'timeskip', 
  description: 'Objectives and goals tracker with timeskip',
};

const fonts = Fila Sans({
  subsets: ['latin'],
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
