
import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Link, useNavigate } from 'react-router-dom';
import { TransactionModal } from '../components/TransactionModal';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Tooltip as UITooltip } from '../components/ui/Tooltip';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  AlertTriangle,
  Plus,
  Wallet,
  Briefcase,
  Users,
  User,
  TrendingUp,
  FileText,
  CalendarDays,
  ArrowRight,
  PiggyBank,
  HandCoins,
  LineChart,
  Target,
  Package,
  AlertCircle,
  Factory,
  UserCheck,
  Landmark,
  Clock,
  Filter,
  ShoppingBag,
  Building2,
  Layers,
  HardHat,
  Store,
  Laptop,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Truck,
  Receipt,
  UtensilsCrossed,
  Pill,
  Bike,
  Settings,
  Bed,
  Globe,
  Calculator
} from 'lucide-react';
import { TransactionType, DebtType, QuoteStatus, ExpenseStatus } from '../types';

type DateFilter = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME' | 'CUSTOM';

export const Dashboard = () => {
  const { 
    totalBalanceMZN, transactions, debts, expenses, materials, netProfit, auditLogs,
    leads, projects, fixedAssets,
    companies, allCompanies, activeCompanyId, setActiveCompanyId, getCompanyMetrics, allAccounts
  } = useFinance();
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  
  const today = new Date();

  // Company selection helper
  const activeCompany = useMemo(() => {
    if (activeCompanyId === 'all') return null;
    return companies.find(c => c.id === activeCompanyId) || null;
  }, [companies, activeCompanyId]);

  // Consolidated group total treasury calculation
  const consolidatedGroupBalance = useMemo(() => {
    return (allAccounts || []).reduce((acc, c) => acc + (c.balance * (c.currency === 'USD' ? 63.8 : c.currency === 'ZAR' ? 3.5 : 1)), 0);
  }, [allAccounts]);

  const getSectorIcon = (businessType?: string, sector?: string) => {
    if (businessType === 'RESTAURANT') return UtensilsCrossed;
    if (businessType === 'PHARMACY') return Pill;
    if (businessType === 'DELIVERY') return Bike;
    if (businessType === 'RETAIL') return Store;
    if (businessType === 'CONSTRUCTION') return HardHat;
    if (businessType === 'TECH') return Laptop;
    if (businessType === 'SERVICES') return Briefcase;
    if (businessType === 'HOSPITALITY') return Bed;
    if (businessType === 'CUSTOMS') return Globe;
    
    const s = (sector || '').toLowerCase();
    if (s.includes('restauran') || s.includes('comida') || s.includes('bar')) return UtensilsCrossed;
    if (s.includes('farmácia') || s.includes('medicament') || s.includes('saúde')) return Pill;
    if (s.includes('delivery') || s.includes('entrega') || s.includes('estafeta')) return Bike;
    if (s.includes('constru') || s.includes('obra') || s.includes('engenhar')) return HardHat;
    if (s.includes('retalh') || s.includes('comércio') || s.includes('supermercado') || s.includes('loja')) return Store;
    if (s.includes('tecnolog') || s.includes('software') || s.includes('digit') || s.includes('inform')) return Laptop;
    return Building2;
  };
  
  // --- Date Filtering Logic ---
  const isWithinFilter = (dateStr: string) => {
    if (dateFilter === 'ALL_TIME') return true;
    const d = new Date(dateStr);
    
    if (dateFilter === 'DAILY') {
      return d.toDateString() === today.toDateString();
    }
    if (dateFilter === 'WEEKLY') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return d >= weekAgo && d <= today;
    }
    if (dateFilter === 'MONTHLY') {
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }
    if (dateFilter === 'CUSTOM') {
      if (!startDate && !endDate) return true;
      if (startDate && !endDate) return d >= new Date(startDate);
      if (!startDate && endDate) return d <= new Date(endDate);
      return d >= new Date(startDate) && d <= new Date(endDate);
    }
    return true;
  };

  // --- Metrics ---
  const filteredTransactions = transactions.filter(t => isWithinFilter(t.date));
  
  const income = filteredTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);
    
  const expense = filteredTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  // Liabilities (Tudo acoplado)
  const debtsToPay = debts
    .filter(d => d.type === DebtType.BORROWED && !d.isPaid)
    .reduce((acc, d) => acc + d.amount, 0);

  const pendingExpenses = expenses
    .filter(e => e.status === ExpenseStatus.PENDING)
    .reduce((acc, e) => acc + e.amount, 0);

  // Total Passivo Imediato (Dívidas + Despesas Pendentes como Aluguel)
  const totalImmediateLiabilities = debtsToPay + pendingExpenses;

  const netWorth = totalBalanceMZN; 

  // Alarms
  const lowStockMaterials = materials.filter(m => m.stock <= m.minStock);

  const fmtMoney = (val: number) => val.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' });

  // --- Charts Data ---
  const expensesByCategory = expenses.filter(e => e.status === ExpenseStatus.PAID && isWithinFilter(e.paidDate || e.dueDate)).reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Trend Data (Last 7 days or based on filter)
  const trendData = useMemo(() => {
     const days = 7;
     const data = [];
     for(let i=days-1; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayTxs = transactions.filter(t => t.date.startsWith(dateStr));
        const inc = dayTxs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const exp = dayTxs.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        data.push({ date: d.toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' }), Receitas: inc, Despesas: exp });
     }
     return data;
  }, [transactions]);

  return (
    <div className="space-y-6 pb-12">

      {/* Multi-Company Group Cards Section (Adjustable based on company count) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                Entidades do Grupo Empresarial
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                {companies.length} {companies.length === 1 ? 'Empresa' : 'Empresas'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Clique no cartão de uma empresa para abrir o seu relatório e funcionalidades específicas, ou veja o relatório consolidado de todas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeCompanyId !== 'all' ? (
              <button
                onClick={() => setActiveCompanyId('all')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Ver Consolidado de Todas</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-gray-200 dark:border-slate-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Consolidado Global Ativo</span>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Grid of Company Cards - auto adapts to quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
          {/* Consolidated Group Card */}
          <div
            onClick={() => setActiveCompanyId('all')}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left relative overflow-hidden flex flex-col justify-between ${
              activeCompanyId === 'all'
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50/70 dark:from-emerald-950/40 dark:to-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700 hover:shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shadow-sm">
                  <Layers className="h-5 w-5 text-emerald-400" />
                </div>
                {activeCompanyId === 'all' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    Consolidado
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Todas
                  </span>
                )}
              </div>

              <h3 className="font-black text-sm text-gray-900 dark:text-white leading-tight">
                Grupo Consolidado
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
                Relatório Geral de Todas as Empresas
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-gray-400">Tesouraria Global</span>
              <p className="text-base font-black text-gray-900 dark:text-white">
                {fmtMoney(consolidatedGroupBalance)}
              </p>
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                <span>{companies.length} Entidades</span>
                <span>{(allAccounts || []).length} Contas</span>
              </div>
            </div>
          </div>

          {/* Cards for each individual company */}
          {companies.map((comp) => {
            const isSelected = activeCompanyId === comp.id;
            const metrics = getCompanyMetrics(comp.id);
            const SectorIcon = getSectorIcon(comp.businessType, comp.sector);

            const sectorLabel = comp.businessType === 'RESTAURANT' ? 'Restaurante' :
                                comp.businessType === 'PHARMACY' ? 'Farmácia' :
                                comp.businessType === 'DELIVERY' ? 'Delivery' :
                                comp.businessType === 'RETAIL' ? 'Retalho' :
                                comp.businessType === 'CONSTRUCTION' ? 'Construção' :
                                comp.businessType === 'TECH' ? 'Tecnologia' :
                                comp.sector || comp.city || 'Geral';

            return (
              <div
                key={comp.id}
                onClick={() => setActiveCompanyId(comp.id)}
                className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-left relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                    }`}>
                      <SectorIcon className="h-5 w-5" />
                    </div>

                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        Ativa
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 truncate max-w-[110px]">
                        {comp.city || 'Moçambique'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm text-gray-900 dark:text-white leading-tight truncate" title={comp.name}>
                    {comp.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 mb-2">
                    <span className="font-mono font-medium">NUIT: {comp.nuit || '---'}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-full mb-3">
                    <SectorIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    {sectorLabel}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Saldo em Contas</span>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {fmtMoney(metrics.totalBalance)}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                    <span>{metrics.accountsCount} {metrics.accountsCount === 1 ? 'Conta' : 'Contas'}</span>
                    <span>{metrics.employeesCount} Colab.</span>
                    <span>{comp.enabledModules?.length || 6} Mods</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Company Card */}
          <Link
            to="/settings"
            className="rounded-2xl p-4 border-2 border-dashed border-gray-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-all flex flex-col items-center justify-center text-center group min-h-[160px] bg-gray-50/50 dark:bg-slate-900/40 cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 group-hover:border-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 flex items-center justify-center transition-all mb-2 shadow-sm">
              <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-black">Registar Nova Empresa</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Adicionar ao Grupo</span>
          </Link>
        </div>
      </section>

      {/* Selected Company Action Center / Quick Feature Navigation */}
      {activeCompany ? (
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg border border-slate-700/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Módulos Operacionais da Empresa
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  NUIT: {activeCompany.nuit || '---'}
                </span>
                {activeCompany.businessType && (
                  <span className="text-xs text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded font-bold border border-amber-800/50">
                    Sector: {activeCompany.businessType}
                  </span>
                )}
                {activeCompany.taxRegime && (
                  <span className="text-xs text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
                    {activeCompany.taxRegime}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-white">
                {activeCompany.name}
              </h3>
              <p className="text-xs text-slate-300">
                Os relatórios do dashboard estão agora filtrados para esta entidade. Utilize os atalhos abaixo para abrir as funcionalidades específicas da empresa:
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/settings"
                className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Settings className="h-3.5 w-3.5 text-blue-400" />
                <span>Gerir Funcionalidades</span>
              </Link>
              <button
                onClick={() => setActiveCompanyId('all')}
                className="text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                <span>Voltar ao Consolidado</span>
              </button>
            </div>
          </div>

          {/* Direct quick links to that company's specific functionalities */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mt-4 pt-4 border-t border-slate-700/60">
            {activeCompany.businessType === 'RESTAURANT' ? (
              <>
                <Link
                  to="/restaurant"
                  className="bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400 border border-amber-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <UtensilsCrossed className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Mesas & Bar</span>
                  <span className="text-[9px] text-amber-300 mt-0.5">Atendimento</span>
                </Link>

                <Link
                  to="/restaurant"
                  className="bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400 border border-amber-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Factory className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Cozinha KDS</span>
                  <span className="text-[9px] text-amber-300 mt-0.5">Pedidos Real-Time</span>
                </Link>

                <Link
                  to="/restaurant"
                  className="bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400 border border-amber-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Calculator className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Ficha Técnica</span>
                  <span className="text-[9px] text-amber-300 mt-0.5">Engenharia Pratos</span>
                </Link>

                <Link
                  to="/pos"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <ShoppingBag className="h-5 w-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">POS Balcão</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Caixa Rápido</span>
                </Link>

                <Link
                  to="/production"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Package className="h-5 w-5 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Estoque</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Alimentos & Bebidas</span>
                </Link>

                <Link
                  to="/fiscal"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <FileText className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facturação</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">IVA 16% & SAF-T</span>
                </Link>

                <Link
                  to="/financial-expenses"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Receipt className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Despesas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Compras & Fornec.</span>
                </Link>

                <Link
                  to="/settings"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Settings className="h-5 w-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Mais Módulos</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Personalizar</span>
                </Link>
              </>
            ) : activeCompany.businessType === 'PHARMACY' ? (
              <>
                <Link
                  to="/pharmacy"
                  className="bg-emerald-950/50 hover:bg-emerald-900/60 hover:border-emerald-400 border border-emerald-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Pill className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Dispensário</span>
                  <span className="text-[9px] text-emerald-300 mt-0.5">Balcão & Busca</span>
                </Link>

                <Link
                  to="/pharmacy"
                  className="bg-emerald-950/50 hover:bg-emerald-900/60 hover:border-emerald-400 border border-emerald-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Clock className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Lotes & FEFO</span>
                  <span className="text-[9px] text-emerald-300 mt-0.5">Semáforo Validade</span>
                </Link>

                <Link
                  to="/pharmacy"
                  className="bg-emerald-950/50 hover:bg-emerald-900/60 hover:border-emerald-400 border border-emerald-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Receitas Médicas</span>
                  <span className="text-[9px] text-emerald-300 mt-0.5">ANARME</span>
                </Link>

                <Link
                  to="/pos"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <ShoppingBag className="h-5 w-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Caixa POS</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Venda Directa</span>
                </Link>

                <Link
                  to="/production"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Package className="h-5 w-5 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Estoque</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Medicamentos</span>
                </Link>

                <Link
                  to="/fiscal"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <FileText className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facturação</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Faturas & Recibos</span>
                </Link>

                <Link
                  to="/financial-expenses"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Receipt className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Despesas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Laboratórios</span>
                </Link>

                <Link
                  to="/settings"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Settings className="h-5 w-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Mais Módulos</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Personalizar</span>
                </Link>
              </>
            ) : activeCompany.businessType === 'DELIVERY' ? (
              <>
                <Link
                  to="/delivery"
                  className="bg-sky-950/50 hover:bg-sky-900/60 hover:border-sky-400 border border-sky-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Truck className="h-5 w-5 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Central Despacho</span>
                  <span className="text-[9px] text-sky-300 mt-0.5">Pedidos Ativos</span>
                </Link>

                <Link
                  to="/delivery"
                  className="bg-sky-950/50 hover:bg-sky-900/60 hover:border-sky-400 border border-sky-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Bike className="h-5 w-5 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Estafetas & Motas</span>
                  <span className="text-[9px] text-sky-300 mt-0.5">Comissões & Rotas</span>
                </Link>

                <Link
                  to="/delivery"
                  className="bg-sky-950/50 hover:bg-sky-900/60 hover:border-sky-400 border border-sky-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Globe className="h-5 w-5 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Zonas & Tarifas</span>
                  <span className="text-[9px] text-sky-300 mt-0.5">Bairros & Preços</span>
                </Link>

                <Link
                  to="/pos"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <ShoppingBag className="h-5 w-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">POS Pedidos</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Caixa Delivery</span>
                </Link>

                <Link
                  to="/fleet"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Truck className="h-5 w-5 text-orange-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Frotas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Motos & Viaturas</span>
                </Link>

                <Link
                  to="/fiscal"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <FileText className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facturação</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Guias de Remessa</span>
                </Link>

                <Link
                  to="/financial-expenses"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Receipt className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Despesas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Combustível & PGC</span>
                </Link>

                <Link
                  to="/settings"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Settings className="h-5 w-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Mais Módulos</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Personalizar</span>
                </Link>
              </>
            ) : activeCompany.businessType === 'TECH' ? (
              <>
                <Link
                  to="/tech?tab=sprints"
                  className="bg-indigo-950/50 hover:bg-indigo-900/60 hover:border-indigo-400 border border-indigo-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Laptop className="h-5 w-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Sprints & Dev</span>
                  <span className="text-[9px] text-indigo-300 mt-0.5">Kanban Board</span>
                </Link>

                <Link
                  to="/tech?tab=saas"
                  className="bg-indigo-950/50 hover:bg-indigo-900/60 hover:border-indigo-400 border border-indigo-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <TrendingUp className="h-5 w-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">SaaS & MRR</span>
                  <span className="text-[9px] text-indigo-300 mt-0.5">Recorrente</span>
                </Link>

                <Link
                  to="/tech?tab=tickets"
                  className="bg-indigo-950/50 hover:bg-indigo-900/60 hover:border-indigo-400 border border-indigo-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <ShieldCheck className="h-5 w-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">SLA & Suporte</span>
                  <span className="text-[9px] text-indigo-300 mt-0.5">Helpdesk</span>
                </Link>

                <Link
                  to="/tech?tab=cloud"
                  className="bg-indigo-950/50 hover:bg-indigo-900/60 hover:border-indigo-400 border border-indigo-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Globe className="h-5 w-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Cloud Infra</span>
                  <span className="text-[9px] text-indigo-300 mt-0.5">AWS & Custos</span>
                </Link>

                <Link
                  to="/fiscal"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <FileText className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facturação</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Software & IVA</span>
                </Link>

                <Link
                  to="/customers"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Users className="h-5 w-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Clientes B2B</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Contratos TI</span>
                </Link>

                <Link
                  to="/financial-expenses"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Receipt className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Despesas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Licenças & PGC</span>
                </Link>

                <Link
                  to="/settings"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Settings className="h-5 w-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Mais Módulos</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Personalizar</span>
                </Link>
              </>
            ) : activeCompany.businessType === 'CONSTRUCTION' ? (
              <>
                <Link
                  to="/construction?tab=measurements"
                  className="bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400 border border-amber-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <HardHat className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Autos Medição</span>
                  <span className="text-[9px] text-amber-300 mt-0.5">Avanço Físico</span>
                </Link>

                <Link
                  to="/construction?tab=rdo"
                  className="bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400 border border-amber-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <FileText className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Diário RDO</span>
                  <span className="text-[9px] text-amber-300 mt-0.5">Estaleiro Hoje</span>
                </Link>

                <Link
                  to="/construction?tab=budget"
                  className="bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400 border border-amber-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Calculator className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Preços CPU</span>
                  <span className="text-[9px] text-amber-300 mt-0.5">BDI & Custos</span>
                </Link>

                <Link
                  to="/construction?tab=equipment"
                  className="bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400 border border-amber-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Truck className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Maquinaria</span>
                  <span className="text-[9px] text-amber-300 mt-0.5">Horímetros & Gasóleo</span>
                </Link>

                <Link
                  to="/construction?tab=safety"
                  className="bg-amber-950/50 hover:bg-amber-900/60 hover:border-amber-400 border border-amber-800/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">Segurança HST</span>
                  <span className="text-[9px] text-emerald-300 mt-0.5">EPIs & Sinistros</span>
                </Link>

                <Link
                  to="/hr"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <UserCheck className="h-5 w-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Folha Obra</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Pedreiros & MOP</span>
                </Link>

                <Link
                  to="/fiscal"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <FileText className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facturação</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Autos Aprovados</span>
                </Link>

                <Link
                  to="/settings"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Settings className="h-5 w-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Mais Módulos</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Personalizar</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/quotes"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <FileText className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Facturação</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Cotações & Faturas</span>
                </Link>

                <Link
                  to="/pos"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <ShoppingBag className="h-5 w-5 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">POS Vendas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Balcão Caixa</span>
                </Link>

                <Link
                  to="/financial-expenses"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Receipt className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Despesas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Plano PGC</span>
                </Link>

                <Link
                  to="/hr"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <UserCheck className="h-5 w-5 text-indigo-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Folha & RH</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">INSS / IRPS</span>
                </Link>

                <Link
                  to="/erp"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Users className="h-5 w-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Projetos & CRM</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Contratos & Obras</span>
                </Link>

                <Link
                  to="/production"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Package className="h-5 w-5 text-cyan-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Estoque</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Armazém & Materiais</span>
                </Link>

                <Link
                  to="/fleet"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Truck className="h-5 w-5 text-orange-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Frotas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Viaturas</span>
                </Link>

                <Link
                  to="/settings"
                  className="bg-slate-800/90 hover:bg-emerald-600/30 hover:border-emerald-500 border border-slate-700/80 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all group"
                >
                  <Settings className="h-5 w-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">Módulos</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Personalizar</span>
                </Link>
              </>
            )}
          </div>
        </section>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black">
                Relatório Consolidado do Grupo Ativo
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                O dashboard principal apresenta os dados e relatórios de todas as {companies.length} empresas integradas. Clique em qualquer empresa acima para filtrar e abrir os seus módulos dedicados.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <span className="text-xs font-bold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
              {companies.length} Entidades Ativas
            </span>
          </div>
        </div>
      )}

      {/* Main Dashboard Header & Filter Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {activeCompany ? `Relatório: ${activeCompany.name}` : 'Relatório Consolidado do Grupo'}
            </h2>
            {activeCompany && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Individual
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {activeCompany 
              ? `Demonstrações financeiras, produção, RH e indicadores de ${activeCompany.name} (NUIT: ${activeCompany.nuit}).`
              : 'Visão agregada de fluxo de caixa, tesouraria, despesas e património de todas as empresas.'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             {/* Date Filter Controls */}
             <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800">
                <UITooltip content="Filtrar dados financeiros por período">
                  <select 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    className="bg-transparent border-none text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer pl-2 pr-8"
                  >
                    <option value="DAILY">Diário</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="MONTHLY">Mensal</option>
                    <option value="ALL_TIME">Todo o Período</option>
                    <option value="CUSTOM">Personalizado</option>
                  </select>
                </UITooltip>
                
                {dateFilter === 'CUSTOM' && (
                  <div className="flex items-center gap-1 px-2 border-l border-gray-200 dark:border-slate-800">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-xs border-none bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded p-1" />
                    <span className="text-gray-400 text-xs">até</span>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-xs border-none bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded p-1" />
                  </div>
                )}
             </div>

             <UITooltip content="Registar nova receita, despesa ou transferência">
               <button 
                  onClick={() => setIsTransactionModalOpen(true)}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none flex items-center justify-center space-x-2 text-sm font-bold transition-transform active:scale-95 cursor-pointer"
               >
                  <Plus className="h-5 w-5" />
                  <span>Nova Transação</span>
               </button>
             </UITooltip>
             <UITooltip content="Abrir Terminal de Ponto de Venda rápido (POS)">
               <Link to="/pos" className="bg-slate-900 dark:bg-slate-800 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 shadow-lg flex items-center justify-center space-x-2 text-sm font-bold">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Abrir POS</span>
               </Link>
             </UITooltip>
        </div>
      </div>

      {/* Main Financial View */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <UITooltip content="Soma de todos os saldos em conta mais imobilizados menos dívidas">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 cursor-help">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-black uppercase mb-1">Património Líquido</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{fmtMoney(netWorth)}</p>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    <TrendingUp className="h-3 w-3" /> Saldo em tempo real
                </div>
            </div>
          </UITooltip>

          <UITooltip content="Lucro operacional real deduzindo custos fixos e variáveis">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 cursor-help">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-black uppercase mb-1">Lucro Real Disponível</p>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-400">{fmtMoney(netProfit)}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4">Líquido após despesas fixas</p>
            </div>
          </UITooltip>

          <UITooltip content="Total de despesas pendentes, salários e empréstimos imediatos">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 cursor-help">
                <p className="text-xs text-red-500 dark:text-rose-400 font-black uppercase mb-1">Compromissos Totais</p>
                <p className="text-2xl font-black text-red-600 dark:text-rose-400">{fmtMoney(totalImmediateLiabilities)}</p>
                <div className="mt-4 flex gap-2">
                    <span className="text-[9px] bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded text-red-600 dark:text-rose-300 font-bold">Aluguer</span>
                    <span className="text-[9px] bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded text-red-600 dark:text-rose-300 font-bold">Salários</span>
                    <span className="text-[9px] bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded text-red-600 dark:text-rose-300 font-bold">Dívidas</span>
                </div>
            </div>
          </UITooltip>

          <UITooltip content="Total de receitas faturadas e recebidas no período">
            <div className="bg-emerald-600 p-6 rounded-2xl shadow-xl text-white cursor-help">
                <p className="text-xs text-emerald-100 font-black uppercase mb-1">Entradas ({dateFilter === 'ALL_TIME' ? 'Total' : dateFilter === 'CUSTOM' ? 'Período' : 'Mês'})</p>
                <p className="text-2xl font-black">{fmtMoney(income)}</p>
                <p className="text-[10px] text-emerald-100 mt-4 opacity-80">Previsão: {fmtMoney(income * 1.2)}</p>
            </div>
          </UITooltip>
      </section>

      {/* Integrated Modules Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CRM & Projetos */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Users className="h-5 w-5 text-emerald-500" /> CRM & Projetos</h3>
                  <Link to="/erp" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Ver ERP</Link>
              </div>
              <div className="space-y-4">
                  <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Pipeline (Leads)</span>
                      <span className="text-sm font-black text-gray-900 dark:text-white">{fmtMoney(leads.reduce((acc, l) => acc + (l.value || 0), 0))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Projetos Ativos</span>
                      <span className="text-sm font-black text-gray-900 dark:text-white">{projects.filter(p => p.status === 'ACTIVE').length}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Ativos Imobilizados</p>
                      <p className="text-lg font-black text-slate-700 dark:text-slate-200">{fmtMoney(fixedAssets.reduce((acc, a) => acc + a.currentValue, 0))}</p>
                  </div>
              </div>
          </div>

          {/* RH Impact */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><UserCheck className="h-5 w-5 text-blue-500" /> Impacto de RH</h3>
                  <Link to="/hr" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">Ver Folha</Link>
              </div>
              <div className="space-y-4">
                  <div className="flex justify-between items-end">
                      <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Custo de Pessoal (Mês)</p>
                          <p className="text-xl font-black text-gray-900 dark:text-white">
                              {expenses.filter(e => e.category.includes('Pessoal') && e.status === ExpenseStatus.PAID).reduce((acc, e) => acc + e.amount, 0).toLocaleString()} MT
                          </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-1 rounded">Pago</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">O RH representa 35% das suas despesas totais.</p>
              </div>
          </div>

          {/* Dívidas Impact */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Landmark className="h-5 w-5 text-orange-500" /> Serviço de Dívida</h3>
                  <Link to="/debts" className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline">Ver Dívidas</Link>
              </div>
              <div className="space-y-4">
                  <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Total a Pagar (Passivo)</p>
                      <p className="text-xl font-black text-red-600 dark:text-rose-400">{fmtMoney(debtsToPay)}</p>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/40 rounded-xl border border-orange-100 dark:border-orange-900/60 text-[10px] text-orange-800 dark:text-orange-300 font-bold">
                      <AlertTriangle className="h-4 w-4" /> Alerta: 2 parcelas vencem esta semana.
                  </div>
              </div>
          </div>

          {/* Fixed Assets / Rent */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2"><Briefcase className="h-5 w-5 text-slate-700 dark:text-slate-300" /> Custos Fixos</h3>
                  <Link to="/financial-expenses" className="text-xs text-slate-600 dark:text-slate-400 font-bold hover:underline">Ver Despesas</Link>
              </div>
              <div className="space-y-3">
                  {expenses.filter(e => e.category.includes('Fixa')).slice(0, 2).map(e => (
                      <div key={e.id} className="flex justify-between items-center border-b border-gray-50 dark:border-slate-800 pb-2">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{e.name}</span>
                          <span className="text-xs font-black text-gray-900 dark:text-white">{e.amount.toLocaleString()} MT</span>
                      </div>
                  ))}
                  <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Próximo Aluguer: 01/{String(today.getMonth() + 2).padStart(2, '0')}</p>
              </div>
          </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><LineChart className="h-5 w-5 text-indigo-500" /> Tendência de Fluxo de Caixa (7 Dias)</h3>
              <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} tickFormatter={(val) => `${val/1000}k`} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff' }} />
                          <Line type="monotone" dataKey="Receitas" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                          <Line type="monotone" dataKey="Despesas" stroke="#ef4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      </RechartsLineChart>
                  </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2"><PieChart className="h-5 w-5 text-blue-500" /> Distribuição de Despesas</h3>
              <div className="h-64 flex items-center justify-center">
                  {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                              </Pie>
                              <Tooltip formatter={(value: number) => fmtMoney(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff' }} />
                          </PieChart>
                      </ResponsiveContainer>
                  ) : (
                      <p className="text-gray-400 text-sm">Sem dados de despesas no período selecionado.</p>
                  )}
              </div>
              {pieData.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {pieData.map((entry, index) => (
                          <div key={index} className="flex items-center gap-1 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                              {entry.name}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      </div>

      {/* Audit Logs / Recent Activities */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" /> 
            Registo de Atividades do Sistema
          </h3>
          <span className="text-xs font-bold text-gray-400 uppercase bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded">Últimas 50 ações</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/60 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">
                  <UITooltip content="Data e hora exatas do evento auditado">
                    <span className="cursor-help">Data & Hora</span>
                  </UITooltip>
                </th>
                <th className="p-4 font-bold">
                  <UITooltip content="Tipo de operação registada no livro razão">
                    <span className="cursor-help">Ação</span>
                  </UITooltip>
                </th>
                <th className="p-4 font-bold">
                  <UITooltip content="Discriminação detalhada do evento executado">
                    <span className="cursor-help">Detalhes</span>
                  </UITooltip>
                </th>
                <th className="p-4 font-bold">
                  <UITooltip content="Identificador único do objeto movimentado">
                    <span className="cursor-help">ID Referência</span>
                  </UITooltip>
                </th>
                <th className="p-4 font-bold">
                  <UITooltip content="Conta de utilizador ou subsistema responsável">
                    <span className="cursor-help">Utilizador</span>
                  </UITooltip>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {auditLogs.slice(0, 50).map(log => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors text-sm">
                  <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-MZ')}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-gray-800 dark:text-slate-200 font-medium">
                    {log.details}
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-xs">
                    {log.relatedId || '-'}
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">
                    {log.userId}
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Nenhuma atividade registada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </div>
  );
};
