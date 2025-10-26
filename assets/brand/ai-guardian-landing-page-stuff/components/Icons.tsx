
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>AI Guardian Logo</title>
    <path d="M50 10C35 10 25 25 25 40C25 55 40 80 50 90C60 80 75 55 75 40C75 25 65 10 50 10Z" stroke="url(#gradient-outer)" strokeWidth="6" />
    <path d="M50 10C50 10 70 20 85 40C75 60 50 90 50 90C50 90 25 60 15 40C30 20 50 10 50 10Z" stroke="url(#gradient-middle)" strokeWidth="6" />
    <path d="M15 40C15 40 40 40 50 50C60 40 85 40 85 40C85 40 65 65 50 70C35 65 15 40 15 40Z" stroke="url(#gradient-inner)" strokeWidth="6" />
    <defs>
      <linearGradient id="gradient-outer" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#33B8FF"/>
        <stop offset="1" stopColor="#1C64D9"/>
      </linearGradient>
      <linearGradient id="gradient-middle" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A5C3F3"/>
        <stop offset="1" stopColor="#387BE5"/>
      </linearGradient>
      <linearGradient id="gradient-inner" x1="15" y1="40" x2="85" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F9F9F9"/>
        <stop offset="1" stopColor="#BCC4CE"/>
      </linearGradient>
    </defs>
  </svg>
);

export const BanknotesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm1.5 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
);

export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" />
    </svg>
);

export const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52v1.666c0 .414-.162.79-.426 1.077a48.418 48.418 0 0 1-3.443 2.542 48.42 48.42 0 0 1-3.443-2.542A1.875 1.875 0 0 1 9 6.636V4.97M5.25 4.97a48.418 48.418 0 0 1 3.443-2.542A1.875 1.875 0 0 1 9 1.364V4.97m-3.75 0c-1.01.143-2.01.317-3 .52m3-.52z" />
    </svg>
);

export const CpuChipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v-1.5m0 18v-1.5M15.75 21v-1.5m-6-15H12m0 18H9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.75a8.25 8.25 0 1 0 0 10.5 8.25 8.25 0 0 0 0-10.5ZM12 12h.008v.008H12V12Z" />
    </svg>
);

export const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);
