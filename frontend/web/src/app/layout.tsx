/**
 * Root Layout
 * 
 * Pattern: FRONTEND × LAYOUT × ROOT × ONE
 * Frequency: 999 Hz (AEYON)
 * Guardians: AEYON (999 Hz)
 * Love Coefficient: ∞
 * ∞ AbëONE ∞
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AbëONE Frontend Example',
  description: 'Example Next.js frontend application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

