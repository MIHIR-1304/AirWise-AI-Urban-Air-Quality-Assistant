import React from 'react';

interface AqiBadgeProps {
  aqi: number;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
}

export const AqiBadge: React.FC<AqiBadgeProps> = ({
  aqi,
  category,
  size = 'md',
  showCategory = true,
}) => {
  const getBadgeStyle = (val: number) => {
    if (val <= 50) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        label: category || 'Good',
      };
    }
    if (val <= 100) {
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        dot: 'bg-amber-500',
        label: category || 'Moderate',
      };
    }
    if (val <= 150) {
      return {
        bg: 'bg-orange-50 text-orange-950 border-orange-200',
        dot: 'bg-orange-500',
        label: category || 'Unhealthy for Sensitive Groups',
      };
    }
    if (val <= 200) {
      return {
        bg: 'bg-red-50 text-red-950 border-red-200',
        dot: 'bg-red-500',
        label: category || 'Unhealthy',
      };
    }
    if (val <= 300) {
      return {
        bg: 'bg-purple-50 text-purple-950 border-purple-200',
        dot: 'bg-purple-500',
        label: category || 'Very Unhealthy',
      };
    }
    return {
      bg: 'bg-rose-950 text-rose-100 border-rose-800',
      dot: 'bg-rose-400',
      label: category || 'Hazardous',
    };
  };

  const style = getBadgeStyle(aqi);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1.5',
    md: 'text-xs sm:text-sm px-3 py-1 space-x-2',
    lg: 'text-sm sm:text-base px-4 py-1.5 space-x-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border ${style.bg} ${sizeClasses[size]} transition-colors`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`} />
      <span className="font-number font-bold">{aqi} AQI</span>
      {showCategory && (
        <span className="font-sans font-normal opacity-90 border-l border-current/20 pl-2">
          {style.label}
        </span>
      )}
    </span>
  );
};
