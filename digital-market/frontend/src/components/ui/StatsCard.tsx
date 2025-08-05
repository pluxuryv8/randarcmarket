import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  delay?: number;
  icon?: string;
}

export default function StatsCard({ title, value, subtitle, color = '#fff', delay = 0, icon }: StatsCardProps) {
  return (
    <div 
      className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {icon && (
        <div className="text-4xl mb-3">
          {icon}
        </div>
      )}
      <div 
        className="text-3xl font-bold mb-2"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-gray-400 text-sm">
        {title}
      </div>
      {subtitle && (
        <div className="text-gray-500 text-xs mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
} 