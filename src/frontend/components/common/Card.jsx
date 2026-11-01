import React from 'react';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/80 backdrop-blur-md shadow-sm dark:shadow-xl text-slate-800 dark:text-slate-100 transition-all duration-200 ${
        hover ? 'hover:border-blue-500/50 hover:shadow-md dark:hover:bg-slate-900/90 dark:hover:shadow-blue-900/10' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

