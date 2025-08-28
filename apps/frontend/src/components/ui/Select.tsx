import React from 'react';

export default function Select({ className='', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`bg-[var(--panel)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text)] focus:border-[var(--accent-2)] focus:outline-none transition ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
