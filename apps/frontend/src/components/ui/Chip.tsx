import React from 'react';

interface ChipProps {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  count,
  active = false,
  onClick,
  onRemove,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer';
  
  const stateClasses = active
    ? 'bg-accent-red text-white border border-accent-red'
    : 'bg-surface-800 text-text-300 border border-line-700 hover:border-accent-red-2 hover:text-accent-red-2';
  
  const classes = `${baseClasses} ${stateClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      <span>{label}</span>
      {count !== undefined && (
        <span className="ml-2 px-1.5 py-0.5 bg-black bg-opacity-20 rounded-full text-xs">
          {count}
        </span>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 w-4 h-4 rounded-full bg-black bg-opacity-20 flex items-center justify-center hover:bg-opacity-40 transition-all"
        >
          ×
        </button>
      )}
    </div>
  );
};
