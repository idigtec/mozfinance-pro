import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Tooltip } from './ui/Tooltip';

export const ThemeToggle: React.FC<{ className?: string; compact?: boolean }> = ({ 
  className = '',
  compact = false
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Tooltip content={isDark ? "Alternar para Modo Claro (Light Mode)" : "Alternar para Modo Escuro (Dark Mode)"}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
        className={`relative inline-flex items-center justify-center rounded-lg p-2 transition-colors duration-200 
          ${isDark 
            ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-amber-300 border border-slate-700' 
            : 'bg-gray-100 text-slate-700 hover:bg-gray-200 hover:text-slate-900 border border-gray-200'} 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
      >
        {isDark ? (
          <Sun className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="h-5 w-5 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
        {!compact && (
          <span className="sr-only">
            {isDark ? 'Modo Claro' : 'Modo Escuro'}
          </span>
        )}
      </button>
    </Tooltip>
  );
};
