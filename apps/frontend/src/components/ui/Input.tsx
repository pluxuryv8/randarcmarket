import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 bg-surface-800 border border-line-700 rounded-lg
          text-text-100 placeholder-text-300
          focus:outline-none focus:border-accent-red-2 focus:ring-2 focus:ring-accent-red-2 focus:ring-opacity-20
          transition-all duration-200
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
