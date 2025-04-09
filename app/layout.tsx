import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Career Guidance Chatbot',
  description: 'Get personalized career suggestions based on your interests and education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
} 