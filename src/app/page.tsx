import { Metadata } from 'next';
import HomePage from '@/components/HomePage';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Coinday - Latest News & Updates',
  description: 'Stay updated with the latest news and trending stories from around the world. Your trusted source for breaking news, analysis, and insights.',
  openGraph: {
    title: 'Coinday - Latest News & Updates',
    description: 'Stay updated with the latest news and trending stories from around the world.',
    url: 'https://coinday.com',
    siteName: 'Coinday',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Coinday News',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Home() {
  return <HomePage />;
}