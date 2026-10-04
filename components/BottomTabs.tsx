import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  Menu,
  UploadCloud
} from 'lucide-react';
import { useSync } from '../context/SyncContext';

interface BottomTabsProps {
  onOpenDrawer: () => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({ onOpenDrawer }) => {
  const location = useLocation();
  const { pendingCount } = useSync();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
      label: 'Receitas',
      path: '/receitas',
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      label: 'Despesas',
      path: '/despesas',
      icon: TrendingDown,
      color: 'text-red-500'
    },
    {
      label: 'Lançamentos',
      path: '/transactions',
      icon: ArrowRightLeft,
      badge: pendingCount > 0 ? pendingCount : null
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800 px-2 py-1 shadow-2xl print:hidden safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                active 
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {active && (
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* Drawer Trigger */}
        <button
          onClick={onOpenDrawer}
          type="button"
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer relative"
          aria-label="Abrir menu completo"
        >
          <div className="relative">
            <Menu className="h-5 w-5 stroke-2" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-amber-500 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Mais</span>
        </button>
      </div>
    </div>
  );
};
