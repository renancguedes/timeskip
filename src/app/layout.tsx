import type { Metadata } from 'next';
import { Fira_Sans } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'TimeSkip',
  description: 'Acompanhe seus objetivos e metas com o TimeSkip',
};

const fonts = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={fonts.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
