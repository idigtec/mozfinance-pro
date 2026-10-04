import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, Currency, Transaction } from '../types';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Wallet, 
  FileText, 
  CheckCircle2, 
  Printer, 
  Download, 
  Eye, 
  X, 
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  Briefcase,
  DollarSign,
  Tag
} from 'lucide-react';

export const Receitas: React.FC = () => {
  const { 
    transactions, 
    accounts, 
    categories, 
    addTransaction, 
    removeTransaction,
    companies, 
    activeCompanyId, 
    getAccountName 
  } = useFinance();

  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | 'month' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReceitaDetail, setSelectedReceitaDetail] = useState<Transaction | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Vendas de Mercadorias & Produtos',
    accountId: accounts[0]?.id || '',
    currency: Currency.MZN,
    date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: ''
  });

  // Filter only Income transactions
  const incomeTransactions = useMemo(() => {
    return transactions.filter(t => t.type === TransactionType.INCOME);
  }, [transactions]);

  const incomeCategories = useMemo(() => {
    return categories.filter(c => c.type === 'INCOME');
  }, [categories]);

  // Apply filters
  const filteredReceitas = useMemo(() => {
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const todayStr = now.toISOString().split('T')[0];
    const currentYearStr = `${now.getFullYear()}`;

    return incomeTransactions.filter(item => {
      // Period
      if (selectedPeriod === 'today' && !item.date.startsWith(todayStr)) return false;
      if (selectedPeriod === 'month' && !item.date.startsWith(currentMonthStr)) return false;
      if (selectedPeriod === 'year' && !item.date.startsWith(currentYearStr)) return false;

      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // Account
      if (selectedAccount !== 'all' && item.accountId !== selectedAccount) return false;

      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesRef = item.reference?.toLowerCase().includes(query);
        if (!matchesDesc && !matchesCat && !matchesRef) return false;
      }

      return true;
    });
  }, [incomeTransactions, selectedPeriod, selectedCategory, selectedAccount, search]);

  // Real KPIs
  const totalReceitas = useMemo(() => {
    return filteredReceitas.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredReceitas]);

  const allTimeTotal = useMemo(() => {
    return incomeTransactions.reduce((sum, item) => sum + item.amount, 0);
  }, [incomeTransactions]);

  const averagePerReceipt = useMemo(() => {
    if (filteredReceitas.length === 0) return 0;
    return totalReceitas / filteredReceitas.length;
  }, [filteredReceitas, totalReceitas]);

  // Category breakdown for insights
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredReceitas.forEach(r => {
      map[r.category] = (map[r.category] || 0) + r.amount;
    });
    return Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalReceitas > 0 ? (amount / totalReceitas) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredReceitas, totalReceitas]);

  const handleCreateReceita = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor insira um valor válido maior que zero.');
      return;
    }
    if (!formData.description.trim()) {
      alert('Por favor descreva a origem da receita.');
      return;
    }
    if (!formData.accountId) {
      alert('Por favor selecione a conta de destino.');
      return;
    }

    addTransaction({
      description: formData.description.trim(),
      amount: parsedAmount,
      category: formData.category,
      accountId: formData.accountId,
      currency: formData.currency,
      date: formData.date,
      type: TransactionType.INCOME,
      reference: formData.reference.trim() || `REC-${Date.now().toString().slice(-6)}`
    });

    setIsAddModalOpen(false);
    setFormData({
      description: '',
      amount: '',
      category: incomeCategories[0]?.name || 'Vendas de Mercadorias & Produtos',
      accountId: accounts[0]?.id || '',
      currency: Currency.MZN,
      date: new Date().toISOString().split('T')[0],
      reference: '',
      notes: ''
    });
  };

  const activeCompany = companies.find(c => c.id === activeCompanyId);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Gestão de Receitas
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Controlo de facturação, entradas de caixa e comprovativos com persistência local.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Nova Receita</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Filtrado</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {totalReceitas.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {filteredReceitas.length} lançamentos contabilizados
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Média por Receita</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-mono">
            {averagePerReceipt.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Ticket médio de entrada
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Categoria</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Tag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-bold text-gray-900 dark:text-white truncate" title={categoryBreakdown[0]?.name || 'N/A'}>
            {categoryBreakdown[0]?.name || 'Sem dados'}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 font-mono">
            {categoryBreakdown[0] ? `${categoryBreakdown[0].amount.toLocaleString('pt-MZ')} MT (${categoryBreakdown[0].percentage.toFixed(0)}%)` : '0 MT'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Acumulado Histórico</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-mono">
            {allTimeTotal.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {incomeTransactions.length} receitas totais no banco
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por descrição, cliente ou ref. do recibo..."
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-950 p-1 rounded-xl border border-gray-200 dark:border-slate-800 overflow-x-auto">
            {(['month', 'today', 'year', 'all'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedPeriod === p 
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p === 'month' ? 'Este Mês' : p === 'today' ? 'Hoje' : p === 'year' ? 'Este Ano' : 'Todas'}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="h-3.5 w-3.5" />
            <span className="font-semibold">Filtrar por:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs py-1.5 px-3 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            {incomeCategories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Account Filter */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs py-1.5 px-3 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Todas as Contas / Bancos</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
            ))}
          </select>

          {(selectedCategory !== 'all' || selectedAccount !== 'all' || search) && (
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedAccount('all'); setSearch(''); }}
              className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer underline ml-auto"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Receipts Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Registos de Receita</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {filteredReceitas.length}
            </span>
          </h2>
        </div>

        {filteredReceitas.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nenhuma receita encontrada</p>
            <p className="text-xs text-gray-500 mt-1">Ajuste os filtros ou crie uma nova entrada para começar.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-emerald-700"
            >
              Registar Primeira Receita
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Descrição / Origem</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Conta de Entrada</th>
                  <th className="py-3 px-4">Referência</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                {filteredReceitas.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('pt-MZ')}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-xs">{tx.description}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 font-medium">
                      {getAccountName(tx.accountId)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-500 text-[11px]">
                      {tx.reference || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 dark:text-emerald-400 font-mono whitespace-nowrap text-sm">
                      +{tx.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} {tx.currency}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedReceitaDetail(tx)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                          title="Ver Recibo Digital"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Tem a certeza que deseja eliminar o lançamento "${tx.description}"?`)) {
                              removeTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Nova Receita */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-emerald-600 text-white">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <h3 className="font-bold text-base">Registar Nova Receita</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReceita} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Descrição / Origem do Valor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Factura #1089 - Prestação de Serviços de TI"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Valor da Receita *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold text-emerald-600 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Moeda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value={Currency.MZN}>Metical (MZN)</option>
                    <option value={Currency.USD}>Dólar (USD)</option>
                    <option value={Currency.ZAR}>Rand (ZAR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Categoria de Receita
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {incomeCategories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Conta de Entrada (Banco/Caixa) *
                  </label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.balance.toLocaleString()} {a.currency})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Data da Entrada
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    N.º do Recibo / Comprovativo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: REC-2026-0045"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
                >
                  Salvar e Creditar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Recibo / Comprovativo */}
      {selectedReceitaDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Recibo Digital de Entrada</h3>
              </div>
              <button 
                onClick={() => setSelectedReceitaDetail(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs" id="printable-receipt">
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-gray-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {activeCompany?.name || 'microMoney MozFinance'}
                </span>
                <h4 className="text-lg font-black text-gray-900 dark:text-white">
                  COMPROVATIVO DE RECEITA
                </h4>
                <p className="font-mono text-gray-500 text-[11px]">
                  Ref: {selectedReceitaDetail.reference || `REC-${selectedReceitaDetail.id}`}
                </p>
                <p className="text-[10px] text-gray-400">
                  NUIT: {activeCompany?.nuit || '400928172'} • Maputo, Moçambique
                </p>
              </div>

              {/* Amount Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl text-center">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">Valor Recebido</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  {selectedReceitaDetail.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} {selectedReceitaDetail.currency}
                </div>
              </div>

              {/* Receipt Data grid */}
              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                  <span className="text-gray-500 font-medium">Origem / Descrição:</span>
                  <span className="font-bold text-gray-900 dark:text-white text-right">{selectedReceitaDetail.description}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                  <span className="text-gray-500 font-medium">Categoria:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedReceitaDetail.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                  <span className="text-gray-500 font-medium">Conta Creditada:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{getAccountName(selectedReceitaDetail.accountId)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                  <span className="text-gray-500 font-medium">Data do Lançamento:</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">{new Date(selectedReceitaDetail.date).toLocaleDateString('pt-MZ')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">Estado da Sincronização:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Armazenado Localmente
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Imprimir Recibo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
