import React from 'react';

export default function Switch({ className='', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={`w-4 h-4 text-[var(--accent)] bg-[var(--panel)] border-[var(--border)] rounded focus:ring-[var(--accent-2)] focus:ring-2 ${className}`}
      {...props}
    />
  );
}
