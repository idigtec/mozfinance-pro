import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft, 
  Wallet, 
  Tag, 
  PieChart, 
  HandCoins, 
  Share2, 
  Calculator, 
  FileText, 
  Users, 
  ShoppingBag, 
  UserCheck, 
  Factory, 
  Truck, 
  Briefcase, 
  CalendarDays, 
  StickyNote, 
  CheckSquare, 
  Settings, 
  BarChart, 
  BrainCircuit, 
  HardDrive, 
  User, 
  LogOut, 
  Wifi, 
  WifiOff, 
  UploadCloud, 
  ChevronRight,
  RefreshCw,
  Building,
  Laptop,
  HardHat,
  UtensilsCrossed,
  Pill,
  Bike
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { useSync } from '../context/SyncContext';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { currentUser, logout, switchUser, users } = useAuth();
  const { companies, activeCompanyId, setActiveCompanyId } = useFinance();
  const { effectiveOnline, isSimulatedOffline, setSimulatedOffline, pendingCount, syncNow, isSyncing } = useSync();
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  if (!isOpen) return null;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navSections = [
    {
      title: 'Principal & Tesouraria',
      items: [
        { label: 'Dashboard Executivo', path: '/', icon: LayoutDashboard },
        { label: 'Receitas (Entradas)', path: '/receitas', icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Despesas & Pagamentos', path: '/despesas', icon: TrendingDown, color: 'text-red-500' },
        { label: 'Lançamentos (Razão Geral)', path: '/transactions', icon: ArrowRightLeft },
        { label: 'Contas & Bancos', path: '/accounts', icon: Wallet },
        { label: 'Categorias Personalizadas', path: '/categorias', icon: Tag }
      ]
    },
    {
      title: 'Gestão Colaborativa & Orçamentos',
      items: [
        { label: 'Finanças Compartilhadas', path: '/compartilhadas', icon: Share2, color: 'text-blue-500' },
        { label: 'Orçamentos Mensais', path: '/budget', icon: PieChart },
        { label: 'Dívidas & A Receber', path: '/debts', icon: HandCoins }
      ]
    },
    {
      title: 'Fiscal & Vendas',
      items: [
        { label: 'Módulo Fiscal (DGI/IVA)', path: '/fiscal', icon: Calculator },
        { label: 'Cotações & Facturas', path: '/quotes', icon: FileText },
        { label: 'Base de Clientes', path: '/customers', icon: Users },
        { label: 'Ponto de Venda (POS)', path: '/pos', icon: ShoppingBag }
      ]
    },
    {
      title: 'Operações Sectoriais',
      items: [
        { label: 'Tecnologia & Dev', path: '/tech', icon: Laptop },
        { label: 'Construção & Obras', path: '/construction', icon: HardHat },
        { label: 'Restaurante & KDS', path: '/restaurant', icon: UtensilsCrossed },
        { label: 'Farmácia & FEFO', path: '/pharmacy', icon: Pill },
        { label: 'Delivery & Estafetas', path: '/delivery', icon: Bike },
        { label: 'RH & Salários', path: '/hr', icon: UserCheck },
        { label: 'Produção & Stock', path: '/production', icon: Factory },
        { label: 'Gestão de Frotas', path: '/fleet', icon: Truck },
        { label: 'Gestão ERP (CRM)', path: '/erp', icon: Briefcase }
      ]
    },
    {
      title: 'Sistema, Sincronização & Segurança',
      items: [
        { 
          label: 'Fila de Sincronização', 
          path: '/sincronizacao', 
          icon: UploadCloud, 
          badge: pendingCount > 0 ? `${pendingCount} pendente${pendingCount > 1 ? 's' : ''}` : 'Sincronizado',
          badgeColor: pendingCount > 0 ? 'bg-amber-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
        },
        { label: 'Meu Perfil', path: '/perfil', icon: User },
        { label: 'Gestão de Utilizadores', path: '/usuarios', icon: Users },
        { label: 'Configurações & Backup Local', path: '/configuracoes', icon: Settings },
        { label: 'Minhas Empresas', path: '/settings', icon: Building }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-950">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/30">
                MZ
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                  microMoney Pro
                </h2>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Navegação & Controlo Central
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Session Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'Utilizador'}
                  className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {currentUser?.name || 'Sessão Convidado'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser?.email || 'offline@idigtec.co.mz'}
                  </p>
                  <span className="inline-block mt-0.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {currentUser?.role === 'ADMIN' ? 'Administrador' : currentUser?.role === 'FINANCIAL_MANAGER' ? 'Gestora Financeira' : currentUser?.role === 'OPERATOR' ? 'Operador Caixa' : 'Auditor'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 items-end">
                <button
                  onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                >
                  Trocar
                </button>
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="h-3 w-3" />
                  Sair
                </button>
              </div>
            </div>

            {/* Quick Switch Dropdown */}
            {showUserSwitcher && (
              <div className="mt-3 p-2 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1">
                  Mudar Utilizador Imediatamente
                </p>
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => { switchUser(u.id); setShowUserSwitcher(false); }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-all ${
                      currentUser?.id === u.id 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' 
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{u.name} ({u.role})</span>
                    {currentUser?.id === u.id && <span className="text-[10px] text-emerald-500 font-mono">Activo</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Offline / Online Control Banner */}
          <div className="px-4 py-3 bg-gray-50/70 dark:bg-slate-950/70 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {effectiveOnline ? (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Conexão Online
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <WifiOff className="h-3.5 w-3.5" />
                  Modo Offline
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSimulatedOffline(!isSimulatedOffline)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  isSimulatedOffline 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-600' 
                    : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-700'
                }`}
                title="Alternar simulação de modo offline para testes"
              >
                {isSimulatedOffline ? 'Simulando Offline' : 'Testar Offline'}
              </button>

              <button
                onClick={() => syncNow()}
                disabled={isSyncing || !effectiveOnline}
                className="p-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 disabled:opacity-40 cursor-pointer"
                title="Sincronizar agora"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {navSections.map((sec, idx) => (
              <div key={idx}>
                <h3 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
                  {sec.title}
                </h3>
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                          active
                            ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${active ? 'text-white' : item.color || 'text-gray-400 dark:text-gray-500'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white text-emerald-700' : item.badgeColor || 'bg-gray-200 text-gray-700'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-center text-[10px] text-gray-400">
            microMoney MozFinance Pro • Sincronização & Persistência Local v2.4
          </div>
        </div>
      </div>
    </div>
  );
};
