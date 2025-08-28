import React from 'react';

export default function Input({ className='', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`bg-[var(--panel)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text)] placeholder-[var(--muted)] focus:border-[var(--accent-2)] focus:outline-none transition ${className}`}
      {...props}
    />
  );
}
