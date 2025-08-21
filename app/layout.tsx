import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata = {
  title: 'Dhivyuga - Sacred Mantra Search Engine',
  description: 'Discover and explore sacred mantras for spiritual growth, prosperity, and well-being',
  keywords: 'mantras, spiritual, meditation, hinduism, sanskrit, devotion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
