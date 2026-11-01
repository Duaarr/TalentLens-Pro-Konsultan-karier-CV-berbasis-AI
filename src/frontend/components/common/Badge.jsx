import React from 'react';

const BADGE_VARIANTS = {
  blue: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
  sky: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
  amber: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
  rose: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800',
  slate: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800',
};

export default function Badge({ children, variant = 'blue', className = '', icon: Icon = null }) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.blue;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${variantClass} ${className}`}>
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
      {children}
    </span>
  );
}
