import React from 'react';

export default function Card({ className='', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 ${className}`} {...props} />;
}
