import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { CSSLoader } from '@/components/css-loader';
import { CSSPreloader } from '@/components/css-preloader';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata = {
  title: 'திவ்யுகா (Dhivyuga) - Sacred Mantra Search Engine',
  description: 'திவ்யுகா - Discover and explore sacred mantras for spiritual growth, prosperity, and well-being. दिव्युगा - Divine mantras for spiritual seekers.',
  keywords: 'mantras, spiritual, meditation, hinduism, sanskrit, devotion, திவ்யுகா, दिव्युगा, dhivyuga',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <CSSPreloader />
        <CSSLoader>
          <AuthProvider>
            {children}
          </AuthProvider>
        </CSSLoader>
      </body>
    </html>
  );
}
