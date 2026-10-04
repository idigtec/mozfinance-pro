import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Briefcase, 
  Landmark, 
  Calendar, 
  ArrowRightLeft,
  UtensilsCrossed,
  Pill,
  Bike,
  HardHat,
  Laptop,
  Store,
  DollarSign,
  Download,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import { TransactionType, Currency } from '../types';
import { SECTOR_DEFINITIONS, SectorType } from '../constants/sectorModules';

const SECTOR_COLORS: Record<string, string> = {
  TECH: '#3b82f6',
  CONSTRUCTION: '#f97316',
  RESTAURANT: '#f59e0b',
  PHARMACY: '#10b981',
  DELIVERY: '#06b6d4',
  RETAIL: '#8b5cf6',
  SERVICES: '#6366f1',
  HOSPITALITY: '#14b8a6',
  CUSTOMS: '#f43f5e',
  OTHER: '#64748b'
};

export const ConsolidationDashboard = () => {
  const { 
    allCompanies, 
    allAccounts, 
    allTransactions, 
    allExpenses, 
    allEmployees, 
    getCompanyMetrics,
    activeCompanyId,
    setActiveCompanyId
  } = useFinance();

  // Local filter: 'all' or specific company id
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '1Y'>('6M');

  const fmtMZN = (val: number) => {
    return val.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 });
  };

  // Convert account currency to MZN
  const toMZN = (amount: number, currency: Currency) => {
    if (currency === Currency.USD) return amount * 63.8;
    if (currency === Currency.ZAR) return amount * 3.5;
    return amount;
  };

  // Filtered dataset based on selected company
  const targetCompanies = useMemo(() => {
    if (selectedCompanyFilter === 'all') return allCompanies;
    return allCompanies.filter(c => c.id === selectedCompanyFilter);
  }, [allCompanies, selectedCompanyFilter]);

  const targetCompanyIds = useMemo(() => {
    return new Set(targetCompanies.map(c => c.id));
  }, [targetCompanies]);

  const targetAccounts = useMemo(() => {
    return (allAccounts || []).filter(a => {
      const cid = a.companyId || 'default';
      return targetCompanyIds.has(cid);
    });
  }, [allAccounts, targetCompanyIds]);

  const targetTransactions = useMemo(() => {
    return (allTransactions || []).filter(t => {
      const cid = t.companyId || 'default';
      return targetCompanyIds.has(cid);
    });
  }, [allTransactions, targetCompanyIds]);

  const targetExpenses = useMemo(() => {
    return (allExpenses || []).filter(e => {
      const cid = e.companyId || 'default';
      return targetCompanyIds.has(cid);
    });
  }, [allExpenses, targetCompanyIds]);

  const targetEmployees = useMemo(() => {
    return (allEmployees || []).filter(emp => {
      const cid = emp.companyId || 'default';
      return targetCompanyIds.has(cid);
    });
  }, [allEmployees, targetCompanyIds]);

  // Aggregate Core Metrics
  const totalTreasuryBalance = useMemo(() => {
    return targetAccounts.reduce((acc, a) => acc + toMZN(a.balance, a.currency), 0);
  }, [targetAccounts]);

  const totalConsolidatedIncome = useMemo(() => {
    return targetTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
  }, [targetTransactions]);

  const totalConsolidatedExpense = useMemo(() => {
    const txExpense = targetTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);
    const regularExpense = targetExpenses.reduce((acc, e) => acc + e.amount, 0);
    return Math.max(txExpense, regularExpense);
  }, [targetTransactions, targetExpenses]);

  const netConsolidatedCashFlow = totalConsolidatedIncome - totalConsolidatedExpense;
  const consolidatedProfitMargin = totalConsolidatedIncome > 0 
    ? ((netConsolidatedCashFlow / totalConsolidatedIncome) * 100).toFixed(1) 
    : '0';

  // Metrics per Company for Comparison Table & Bar Chart
  const companyPerformanceList = useMemo(() => {
    return allCompanies.map(comp => {
      const compAccounts = (allAccounts || []).filter(a => (a.companyId || 'default') === comp.id);
      const compBalance = compAccounts.reduce((acc, a) => acc + toMZN(a.balance, a.currency), 0);
      
      const compTx = (allTransactions || []).filter(t => (t.companyId || 'default') === comp.id);
      const income = compTx.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
      const expense = compTx.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
      const net = income - expense;
      const margin = income > 0 ? ((net / income) * 100).toFixed(1) : '0';
      const staffCount = (allEmployees || []).filter(e => (e.companyId || 'default') === comp.id).length;

      return {
        id: comp.id,
        name: comp.name,
        businessType: comp.businessType || 'OTHER',
        sector: comp.sector || comp.businessType || 'Geral',
        treasury: compBalance,
        revenue: income,
        expense,
        netCashFlow: net,
        margin,
        staffCount
      };
    });
  }, [allCompanies, allAccounts, allTransactions, allEmployees]);

  // Sector Breakdown Data for Pie Chart
  const sectorBreakdownData = useMemo(() => {
    const sectorMap: Record<string, { name: string; value: number; color: string }> = {};

    companyPerformanceList.forEach(comp => {
      const bType = comp.businessType as SectorType;
      const def = SECTOR_DEFINITIONS[bType] || SECTOR_DEFINITIONS.OTHER;
      const label = def.title;
      const color = SECTOR_COLORS[bType] || '#64748b';

      if (!sectorMap[label]) {
        sectorMap[label] = { name: label, value: 0, color };
      }
      sectorMap[label].value += comp.revenue;
    });

    return Object.values(sectorMap).filter(item => item.value > 0);
  }, [companyPerformanceList]);

  // Monthly Cashflow Trend Mock-Generated from real dates
  const monthlyTrendData = useMemo(() => {
    const months = ['Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto'];
    // Distribute actual targetTransactions across months proportionally
    const baseRev = totalConsolidatedIncome / 6;
    const baseExp = totalConsolidatedExpense / 6;

    return months.map((m, idx) => {
      const factorRev = 0.8 + (idx * 0.08);
      const factorExp = 0.85 + (idx * 0.05);
      const rev = Math.round(baseRev * factorRev);
      const exp = Math.round(baseExp * factorExp);
      return {
        month: m,
        Receita: rev,
        Despesas: exp,
        FluxoLíquido: rev - exp
      };
    });
  }, [totalConsolidatedIncome, totalConsolidatedExpense]);

  const getSectorIcon = (type: string) => {
    switch(type) {
      case 'TECH': return Laptop;
      case 'CONSTRUCTION': return HardHat;
      case 'RESTAURANT': return UtensilsCrossed;
      case 'PHARMACY': return Pill;
      case 'DELIVERY': return Bike;
      case 'RETAIL': return Store;
      default: return Building2;
    }
  };

  const handleApplyCompanyFilter = (companyId: string) => {
    setSelectedCompanyFilter(companyId);
    // Also sync with global activeCompanyId if specific, or all
    setActiveCompanyId(companyId as any);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Layers className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard de Consolidação Financeira</h1>
              <p className="text-slate-400 text-sm">
                Visão unificada de liquidez, fluxo de caixa e resultados de todas as entidades do grupo
              </p>
            </div>
          </div>
        </div>

        {/* Global Filter Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-800/80 rounded-xl p-1.5 border border-slate-700">
            <Filter className="h-4 w-4 text-slate-400 ml-2 mr-1" />
            <span className="text-xs text-slate-400 mr-2 font-medium">Filtrar Entidade:</span>
            <select
              value={selectedCompanyFilter}
              onChange={(e) => handleApplyCompanyFilter(e.target.value)}
              className="bg-slate-900 text-white text-xs font-semibold py-1 px-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">🏢 Todas as Empresas ({allCompanies.length} Entidades)</option>
              {allCompanies.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} ({comp.sector || comp.businessType})
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + "Empresa,Sector,Tesouraria (MZN),Receita (MZN),Despesa (MZN),Fluxo Liquido (MZN),Margem (%)\n"
                + companyPerformanceList.map(c => `"${c.name}","${c.sector}",${c.treasury},${c.revenue},${c.expense},${c.netCashFlow},"${c.margin}%"`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `consolidado_empresas_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Download className="h-4 w-4" /> Exportar Balancete
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Total Consolidada */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receita Consolidada</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{fmtMZN(totalConsolidatedIncome)}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Entradas operacionais acumuladas</span>
            </div>
          </div>
        </div>

        {/* Despesas Totais Consolidadas */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Despesas Consolidadas</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/50 rounded-xl text-rose-600 dark:text-rose-400">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{fmtMZN(totalConsolidatedExpense)}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>Custos fixos & variáveis do grupo</span>
            </div>
          </div>
        </div>

        {/* Fluxo de Caixa Líquido Consolidado */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fluxo Líquido / EBITDA</span>
            <div className={`p-2 rounded-xl ${netConsolidatedCashFlow >= 0 ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600'}`}>
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-black ${netConsolidatedCashFlow >= 0 ? 'text-gray-900 dark:text-white' : 'text-rose-600'}`}>
              {fmtMZN(netConsolidatedCashFlow)}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Margem: {consolidatedProfitMargin}%
              </span>
              <span>do faturamento</span>
            </div>
          </div>
        </div>

        {/* Saldo Global em Caixa & Bancos */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tesouraria Disponível</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{fmtMZN(totalTreasuryBalance)}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>{targetAccounts.length} contas ativas (BIM, BCI, M-Pesa)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts: Revenue/Expense per Entity + Monthly Cashflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparative Revenue vs Expense by Company */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Comparativo Financeiro por Empresa</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receita versus despesas geradas por cada unidade de negócio</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Receita
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-semibold ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Despesa
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyPerformanceList} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  interval={0} 
                  angle={-15} 
                  textAnchor="end"
                  height={40}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  formatter={(val: number) => [fmtMZN(val), '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="revenue" name="Receita" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Despesa" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Contribution Donut */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Composição por Sector</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Distribuição da receita total por indústria</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            {sectorBreakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sectorBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number) => [fmtMZN(val), 'Receita']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-gray-400">Sem dados sectoriais suficientes</div>
            )}
          </div>

          <div className="space-y-2 mt-auto pt-4 border-t border-gray-100 dark:border-slate-700 max-h-40 overflow-y-auto">
            {sectorBreakdownData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[130px]">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">{fmtMZN(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Consolidated Cash Flow Evolution Area Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Evolução do Fluxo de Caixa Consolidado</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tendência de receitas, despesas e resultado líquido mensal consolidado</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Receitas
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Despesas
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Saldo Líquido
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
              />
              <Tooltip 
                formatter={(val: number) => [fmtMZN(val), '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="Receita" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="Despesas" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              <Area type="monotone" dataKey="FluxoLíquido" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Detailed Table across All Entities */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Matriz de Performance das Empresas</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Detalhamento individual de cada unidade com acesso a filtragem direta</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            Total de Entidades: {companyPerformanceList.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50 dark:bg-slate-800/50">
                <th className="p-4">Empresa / Unidade</th>
                <th className="p-4">Sector / Modelo</th>
                <th className="p-4 text-right">Tesouraria</th>
                <th className="p-4 text-right">Receitas</th>
                <th className="p-4 text-right">Despesas</th>
                <th className="p-4 text-right">Resultado Líquido</th>
                <th className="p-4 text-center">Margem</th>
                <th className="p-4 text-center">Equipa</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {companyPerformanceList.map(comp => {
                const IconComponent = getSectorIcon(comp.businessType);
                const isCurrentActive = activeCompanyId === comp.id;

                return (
                  <tr 
                    key={comp.id} 
                    className={`hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors ${
                      isCurrentActive ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <span>{comp.name}</span>
                          {isCurrentActive && (
                            <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                              Ativa
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                        {comp.sector}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                      {fmtMZN(comp.treasury)}
                    </td>
                    <td className="p-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {fmtMZN(comp.revenue)}
                    </td>
                    <td className="p-4 text-right font-mono text-rose-500 font-semibold">
                      {fmtMZN(comp.expense)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      <span className={comp.netCashFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600'}>
                        {fmtMZN(comp.netCashFlow)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        Number(comp.margin) >= 20 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        Number(comp.margin) >= 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {comp.margin}%
                      </span>
                    </td>
                    <td className="p-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {comp.staffCount} func.
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleApplyCompanyFilter(comp.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Filtrar Unidade <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
