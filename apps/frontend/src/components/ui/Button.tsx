import React from 'react';

export default function Button({ className='', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`px-4 py-2 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-2)] text-white transition ${className}`}
      {...props}
    />
  );
}
