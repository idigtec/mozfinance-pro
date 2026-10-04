import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { BottomTabs } from './BottomTabs';
import { NavigationDrawer } from './NavigationDrawer';
import { ThemeToggle } from './ThemeToggle';
import { PWAInstallButton } from './PWAInstallButton';
import { Tooltip } from './ui/Tooltip';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  PieChart, 
  Menu, 
  X,
  CreditCard,
  CalendarDays,
  CheckSquare,
  HandCoins,
  Bell,
  StickyNote,
  FileText,
  User,
  Briefcase,
  Users,
  Settings,
  BarChart,
  XCircle,
  Clock,
  Landmark,
  AlertTriangle,
  BrainCircuit,
  Factory,
  Package,
  ShoppingBag,
  UserCheck,
  Truck,
  Bed,
  Heart,
  Globe,
  Calculator,
  Receipt,
  UtensilsCrossed,
  Pill,
  Bike,
  Layers,
  Sparkles,
  ChevronRight,
  Laptop,
  HardHat,
  TrendingUp,
  TrendingDown,
  Tag,
  Share2,
  UploadCloud,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { ExpenseStatus } from '../types';
import { SECTOR_DEFINITIONS, SectorType } from '../constants/sectorModules';

interface NavItemData {
  name: string;
  href: string;
  icon: React.ElementType;
  section: string;
  moduleId?: string | string[];
}

interface NavItemProps {
  item: NavItemData;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive, onClick }) => (
  <Tooltip content={`Ir para ${item.name}`} side="right">
    <Link
      to={item.href}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-emerald-600 text-white shadow-lg' 
          : 'text-gray-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      <span className="font-medium text-sm md:text-base truncate">{item.name}</span>
    </Link>
  </Tooltip>
);

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { debts, tasks, notes, expenses, materials, companies, activeCompanyId, setActiveCompanyId } = useFinance();
  const { currentUser } = useAuth();
  const { effectiveOnline, isSimulatedOffline, pendingCount, syncNow, isSyncing } = useSync();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeReminders, setActiveReminders] = useState<{id: string, title: string, time: string}[]>([]);
  const location = useLocation();

  const activeCompany = companies.find(c => c.id === activeCompanyId);
  const activeSectorDef = activeCompany?.businessType ? SECTOR_DEFINITIONS[activeCompany.businessType as SectorType] : null;

  const navigation: NavItemData[] = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, section: 'main', moduleId: 'main' },
    { name: 'Receitas (Entradas)', href: '/receitas', icon: TrendingUp, section: 'main', moduleId: 'main' },
    { name: 'Despesas & Contas', href: '/despesas', icon: TrendingDown, section: 'main', moduleId: 'main' },
    { name: 'Lançamentos (Razão)', href: '/transactions', icon: ArrowRightLeft, section: 'main', moduleId: 'main' },
    
    // Módulos Sectoriais Dinâmicos (Ativados conforme o Tipo de Negócio da Empresa)
    { 
      name: 'Tecnologia & Dev', 
      href: '/tech', 
      icon: Laptop, 
      section: 'sectorial', 
      moduleId: ['tech', 'tech_sprints', 'tech_saas_mrr', 'tech_sla_tickets', 'tech_cloud_infra', 'tech_team_repos'] 
    },
    { 
      name: 'Construção & Obras', 
      href: '/construction', 
      icon: HardHat, 
      section: 'sectorial', 
      moduleId: ['construction', 'construction_measurements', 'construction_rdo', 'construction_budget_cpu', 'construction_equipment', 'construction_safety_hst', 'construction_projects'] 
    },
    { 
      name: 'Restaurante & KDS', 
      href: '/restaurant', 
      icon: UtensilsCrossed, 
      section: 'sectorial', 
      moduleId: ['restaurant', 'restaurant_tables', 'kitchen_kds', 'recipes_bom'] 
    },
    { 
      name: 'Farmácia & FEFO', 
      href: '/pharmacy', 
      icon: Pill, 
      section: 'sectorial', 
      moduleId: ['pharmacy', 'pharmacy_dispensary', 'pharmacy_batches', 'pharmacy_prescriptions'] 
    },
    { 
      name: 'Delivery & Estafetas', 
      href: '/delivery', 
      icon: Bike, 
      section: 'sectorial', 
      moduleId: ['delivery', 'delivery_dispatch', 'delivery_couriers', 'delivery_zones'] 
    },

    // Módulo Fiscal
    { name: 'Fiscal (Facturação)', href: '/fiscal', icon: Calculator, section: 'fiscal', moduleId: 'fiscal' },
    { name: 'Cotações', href: '/quotes', icon: FileText, section: 'fiscal', moduleId: ['fiscal', 'quotes'] },
    { name: 'Clientes', href: '/customers', icon: Users, section: 'fiscal', moduleId: ['fiscal', 'crm', 'pos'] },
    { name: 'Ponto de Venda (POS)', href: '/pos', icon: ShoppingBag, section: 'fiscal', moduleId: 'pos' },

    // Módulo Financeiro
    { name: 'Contas & Bancos', href: '/accounts', icon: Wallet, section: 'finance', moduleId: 'finance' },
    { name: 'Categorias', href: '/categorias', icon: Tag, section: 'finance', moduleId: 'finance' },
    { name: 'Finanças Compartilhadas', href: '/compartilhadas', icon: Share2, section: 'finance', moduleId: 'finance' },
    { name: 'Despesas Financeiras', href: '/financial-expenses', icon: Landmark, section: 'finance', moduleId: ['finance', 'expenses'] },
    { name: 'Dívidas & Receber', href: '/debts', icon: HandCoins, section: 'finance', moduleId: 'finance' },
    { name: 'Orçamento', href: '/budget', icon: PieChart, section: 'finance', moduleId: 'finance' },

    // Recursos Humanos & Operações
    { name: 'RH & Salários', href: '/hr', icon: UserCheck, section: 'ops', moduleId: 'hr' },
    { name: 'Produção & Stock', href: '/production', icon: Factory, section: 'ops', moduleId: 'inventory' },
    { name: 'Gestão de Frotas', href: '/fleet', icon: Truck, section: 'ops', moduleId: 'fleet' },
    { name: 'Gestão ERP (CRM/Proj)', href: '/erp', icon: Briefcase, section: 'ops', moduleId: ['erp', 'construction_projects', 'crm'] },

    // Módulos Especializados
    { name: 'Hotelaria', href: '/hospitality', icon: Bed, section: 'special', moduleId: 'hospitality' },
    { name: 'Religioso', href: '/religious', icon: Heart, section: 'special', moduleId: 'religious' },
    { name: 'Aduaneiro', href: '/customs', icon: Globe, section: 'special', moduleId: 'customs' },
    
    // Pessoal
    { name: 'Agenda', href: '/agenda', icon: CalendarDays, section: 'personal', moduleId: 'personal' },
    { name: 'Notas & Ideias', href: '/notes', icon: StickyNote, section: 'personal', moduleId: 'personal' },
    { name: 'Tarefas', href: '/tasks', icon: CheckSquare, section: 'personal', moduleId: 'personal' },
    
    // Sistema
    { name: 'Fila de Sincronização', href: '/sincronizacao', icon: UploadCloud, section: 'system', moduleId: 'system' },
    { name: 'Perfil do Utilizador', href: '/perfil', icon: User, section: 'system', moduleId: 'system' },
    { name: 'Gestão de Usuários', href: '/usuarios', icon: Users, section: 'system', moduleId: 'system' },
    { name: 'Configurações Gerais', href: '/configuracoes', icon: Settings, section: 'system', moduleId: 'system' },
    { name: 'Minhas Empresas', href: '/settings', icon: Landmark, section: 'system', moduleId: 'system' },
    { name: 'Relatórios Gerais', href: '/reports', icon: Briefcase, section: 'system', moduleId: 'system' },
    { name: 'Relatórios Comerciais', href: '/commercial-reports', icon: BarChart, section: 'system', moduleId: 'system' },
    { name: 'Inteligência AI', href: '/intelligence', icon: BrainCircuit, section: 'system', moduleId: ['ai_insights', 'system'] },
  ];

  // Dynamic filter based on active company enabled modules
  const isItemVisible = (item: NavItemData) => {
    if (activeCompanyId === 'all') return true;
    if (!item.moduleId || item.moduleId === 'main' || item.moduleId === 'system' || item.moduleId === 'personal') return true;
    
    // For sectorial items, match active company businessType
    if (item.section === 'sectorial') {
      if (activeCompany?.businessType) {
        if (item.href === '/tech' && activeCompany.businessType !== 'TECH') return false;
        if (item.href === '/construction' && activeCompany.businessType !== 'CONSTRUCTION') return false;
        if (item.href === '/restaurant' && activeCompany.businessType !== 'RESTAURANT') return false;
        if (item.href === '/pharmacy' && activeCompany.businessType !== 'PHARMACY') return false;
        if (item.href === '/delivery' && activeCompany.businessType !== 'DELIVERY') return false;
      }
    }

    const enabled = activeCompany?.enabledModules;
    if (!enabled || enabled.length === 0) {
      const defaultMods = SECTOR_DEFINITIONS[activeCompany?.businessType as SectorType]?.defaultModules;
      if (defaultMods && defaultMods.length > 0) {
        if (Array.isArray(item.moduleId)) {
          return item.moduleId.some(m => defaultMods.includes(m));
        }
        return defaultMods.includes(item.moduleId);
      }
      return true;
    }

    if (Array.isArray(item.moduleId)) {
      return item.moduleId.some(m => enabled.includes(m));
    }
    return enabled.includes(item.moduleId);
  };

  const visibleNavItems = navigation.filter(isItemVisible);

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = today.toISOString().split('T')[0];
  
  const pendingTasks = tasks.filter(t => !t.isCompleted && t.dueDate && t.dueDate.startsWith(todayStr)).length;
  const pendingDebts = debts.filter(d => !d.isPaid && d.dueDate.startsWith(todayStr)).length;
  const lowStockCount = materials.filter(m => m.stock <= m.minStock).length;
  
  const expenseAlerts = expenses.filter(e => {
      if(e.status === ExpenseStatus.PAID) return false;
      const due = new Date(e.dueDate);
      due.setHours(0,0,0,0);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 5 && diffDays >= -100;
  });

  const totalNotifications = pendingTasks + pendingDebts + expenseAlerts.length + lowStockCount;

  useEffect(() => {
    const checkReminders = () => {
        const now = new Date();
        const newReminders: {id: string, title: string, time: string}[] = [];
        tasks.forEach(t => {
            if (!t.isCompleted && t.reminderDate) {
                const remDate = new Date(t.reminderDate);
                const diff = now.getTime() - remDate.getTime();
                if (diff >= 0 && diff < 60000) { 
                    newReminders.push({ id: t.id, title: `Tarefa: ${t.title}`, time: remDate.toLocaleTimeString() });
                }
            }
        });
        notes.forEach(n => {
            if (n.reminder) {
                const remDate = new Date(n.reminder);
                const diff = now.getTime() - remDate.getTime();
                if (diff >= 0 && diff < 60000) {
                     newReminders.push({ id: n.id, title: `Nota: ${n.title}`, time: remDate.toLocaleTimeString() });
                }
            }
        });
        if (newReminders.length > 0) {
            setActiveReminders(prev => {
                const existingIds = new Set(prev.map(r => r.id));
                const uniqueNew = newReminders.filter(r => !existingIds.has(r.id));
                if (uniqueNew.length > 0) {
                     try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {}); } catch(e) {}
                     return [...prev, ...uniqueNew];
                }
                return prev;
            });
        }
    };
    const interval = setInterval(checkReminders, 10000); 
    return () => clearInterval(interval);
  }, [tasks, notes]);

  const dismissReminder = (id: string) => setActiveReminders(prev => prev.filter(r => r.id !== id));

  const sections = [
    { 
      id: 'sectorial', 
      label: activeSectorDef 
        ? `Operações: ${activeSectorDef.title}` 
        : 'Módulos Operacionais' 
    },
    { id: 'fiscal', label: 'Módulo Fiscal' },
    { id: 'finance', label: 'Módulo Financeiro' },
    { id: 'ops', label: 'RH & Operações' },
    { id: 'special', label: 'Módulos Especializados' },
    { id: 'personal', label: 'Pessoal' },
    { id: 'system', label: 'Sistema & Análise' }
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800 print:hidden shadow-xl">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-900/50">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">microMoney</h1>
              <p className="text-xs text-emerald-400 font-semibold">MozFinance Pro</p>
            </div>
          </div>

          {/* Active Company Badge in Sidebar */}
          {activeCompany ? (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400 truncate max-w-[140px]">
                  {activeCompany.name}
                </span>
                <button
                  onClick={() => setActiveCompanyId('all')}
                  className="text-[9px] text-gray-400 hover:text-white underline cursor-pointer"
                  title="Ver todas as empresas"
                >
                  Todas
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {activeCompany.businessType === 'RESTAURANT' && <span className="text-xs">🍽️ Restaurante</span>}
                {activeCompany.businessType === 'PHARMACY' && <span className="text-xs">💊 Farmácia</span>}
                {activeCompany.businessType === 'DELIVERY' && <span className="text-xs">🛵 Delivery</span>}
                {activeCompany.businessType === 'RETAIL' && <span className="text-xs">🛍️ Retalho</span>}
                {activeCompany.businessType === 'CONSTRUCTION' && <span className="text-xs">🏗️ Construção</span>}
                {activeCompany.businessType === 'TECH' && <span className="text-xs">💻 Tecnologia</span>}
                {(!activeCompany.businessType || activeCompany.businessType === 'OTHER' || activeCompany.businessType === 'SERVICES') && (
                  <span className="text-xs">🏢 {activeCompany.city || 'Empresa Geral'}</span>
                )}
                <span className="text-[9px] text-emerald-400 ml-auto font-mono">
                  {activeCompany.enabledModules?.length || 6} mods
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 p-2 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                Grupo Consolidado
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">{companies.length} emp.</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto space-y-6">
          <div className="space-y-1">
             {visibleNavItems.filter(i => i.section === 'main').map(item => (
                <NavItem key={item.name} item={item} isActive={isActive(item.href)} onClick={() => setIsMobileMenuOpen(false)} />
             ))}
          </div>

          {sections.map(section => {
            const items = visibleNavItems.filter(i => i.section === section.id);
            if (items.length === 0) return null; // Don't show empty sections
            return (
              <div key={section.id}>
                <div className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">{section.label}</div>
                <div className="space-y-1">
                  {items.map(item => (
                    <NavItem key={item.name} item={item} isActive={isActive(item.href)} onClick={() => setIsMobileMenuOpen(false)} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
          <Link to="/perfil" className="flex items-center justify-between hover:bg-slate-900 p-1.5 -m-1.5 rounded-xl transition-colors">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'Utilizador'}
                className="h-9 w-9 rounded-full object-cover border border-emerald-500 shadow-md"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-200 truncate">{currentUser?.name || 'Utilizador Pro'}</p>
                <p className="text-[10px] text-emerald-400 font-medium truncate">{currentUser?.role || 'Maputo, MZ'}</p>
              </div>
            </div>
            <ThemeToggle compact />
          </Link>
          <div className="pt-1">
            <PWAInstallButton />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-3 md:p-4 flex justify-between items-center shadow-sm z-20 print:hidden transition-colors duration-200">
          <div className="flex items-center space-x-3 md:hidden">
            <button 
              onClick={() => setIsDrawerOpen(true)} 
              className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 p-1.5 rounded-lg cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">microMoney</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Pro</span>
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center gap-1.5 md:gap-3 mr-1 md:mr-3">
            {/* Online / Offline & Sync Outbox Badge */}
            <Link
              to="/sincronizacao"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                effectiveOnline
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse'
              }`}
              title={effectiveOnline ? 'Modo Online Activo' : 'Operando em Modo Offline Local'}
            >
              {effectiveOnline ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="hidden sm:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              )}
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-mono">
                  {pendingCount}
                </span>
              )}
            </Link>

            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-1 border border-gray-200 dark:border-slate-700 shadow-sm max-w-[190px] sm:max-w-xs md:max-w-none">
              <Tooltip content="Filtrar dados e funcionalidades por Empresa">
                <div className="flex items-center w-full">
                  <Briefcase className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600 dark:text-emerald-400 ml-1.5 mr-1 shrink-0" />
                  <select 
                    value={activeCompanyId}
                    onChange={(e) => setActiveCompanyId(e.target.value)}
                    className="bg-transparent border-none text-[11px] md:text-xs font-black text-slate-800 dark:text-slate-200 focus:ring-0 cursor-pointer py-1 md:py-1.5 pl-0.5 pr-6 truncate"
                  >
                    <option value="all">🏢 Todas (Consolidado)</option>
                    {companies.map(c => {
                      const iconPrefix = c.businessType === 'RESTAURANT' ? '🍽️ ' :
                                         c.businessType === 'PHARMACY' ? '💊 ' :
                                         c.businessType === 'DELIVERY' ? '🛵 ' :
                                         c.businessType === 'RETAIL' ? '🛍️ ' :
                                         c.businessType === 'CONSTRUCTION' ? '🏗️ ' :
                                         c.businessType === 'TECH' ? '💻 ' : '🏢 ';
                      return (
                        <option key={c.id} value={c.id}>
                          {iconPrefix}{c.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </Tooltip>
            </div>

            <div className="hidden md:block">
              <PWAInstallButton />
            </div>

            <ThemeToggle />
          </div>

          <div className="relative">
            <Tooltip content="Alertas e Notificações do Sistema">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all relative"
                aria-label="Notificações"
              >
                <Bell className="h-6 w-6" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-5 w-5 bg-red-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                    {totalNotifications}
                  </span>
                )}
              </button>
            </Tooltip>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-200 text-gray-900 dark:text-slate-100">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="font-bold text-gray-900 dark:text-white">Notificações</h3>
                    <button onClick={() => setIsNotificationsOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400">
                      <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {expenseAlerts.map(e => (
                        <div key={e.id} className="text-xs p-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block">Despesa a Vencer: {e.description}</span>
                                <span>Vence a {new Date(e.dueDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                    {lowStockCount > 0 && (
                        <div className="text-xs p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 flex items-start gap-2">
                            <Package className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block">{lowStockCount} itens em stock crítico</span>
                                <span>Verifique a reposição no armazém</span>
                            </div>
                        </div>
                    )}
                    {totalNotifications === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">Sem notificações pendentes</p>
                    )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="absolute top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
            {activeReminders.map(rem => (
                <div key={rem.id} className="pointer-events-auto bg-white dark:bg-slate-900 border-l-4 border-yellow-500 rounded-xl shadow-2xl p-4 w-80 animate-in slide-in-from-right duration-300 flex items-start justify-between border border-gray-100 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold text-sm mb-1"><Clock className="h-4 w-4" /> LEMBRETE - {rem.time}</div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">{rem.title}</p>
                    </div>
                    <button onClick={() => dismissReminder(rem.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="h-4 w-4" /></button>
                </div>
            ))}
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900 text-white z-30 border-b border-slate-800 shadow-2xl print:hidden overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Acesso Rápido</span>
                <PWAInstallButton />
              </div>
              <div className="flex items-center bg-slate-800 rounded-xl p-2 border border-slate-700">
                <Briefcase className="h-5 w-5 text-emerald-500 ml-2 mr-2" />
                <select 
                  value={activeCompanyId}
                  onChange={(e) => { setActiveCompanyId(e.target.value); setIsMobileMenuOpen(false); }}
                  className="bg-transparent border-none text-xs font-bold text-white focus:ring-0 cursor-pointer py-1 w-full"
                >
                  <option value="all">🏢 Todas as Empresas</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <nav className="p-4 space-y-6">
               <div className="space-y-1">
                 {visibleNavItems.filter(i => i.section === 'main').map((item) => (
                    <NavItem key={item.name} item={item} isActive={isActive(item.href)} onClick={() => setIsMobileMenuOpen(false)} />
                 ))}
               </div>
               {sections.map(section => {
                 const items = visibleNavItems.filter(i => i.section === section.id);
                 if (items.length === 0) return null;
                 return (
                  <div key={section.id}>
                    <div className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">{section.label}</div>
                    <div className="space-y-1">
                      {items.map(item => (
                        <NavItem key={item.name} item={item} isActive={isActive(item.href)} onClick={() => setIsMobileMenuOpen(false)} />
                      ))}
                    </div>
                  </div>
                 );
               })}
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-gray-100 dark:bg-slate-950 scroll-smooth print:p-0 transition-colors duration-200">
          {children}
        </main>

        {/* Mobile Bottom Navigation Tabs */}
        <BottomTabs onOpenDrawer={() => setIsDrawerOpen(true)} />

        {/* Global Slide-over Drawer Navigation */}
        <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    </div>
  );
};
