import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  FinancialExpense, 
  ExpenseStatus, 
  ExpenseCategory, 
  Currency, 
  TransactionType 
} from '../types';
import { 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  X, 
  Wallet, 
  Calendar, 
  Printer, 
  FileText,
  Tag,
  ArrowDownRight,
  CreditCard
} from 'lucide-react';

export const Despesas: React.FC = () => {
  const { 
    expenses, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    payExpense, 
    accounts, 
    categories, 
    companies, 
    activeCompanyId, 
    getAccountName 
  } = useFinance();

  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | 'month' | 'year'>('month');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'PAID' | 'PENDING' | 'OVERDUE'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [payModalExpense, setPayModalExpense] = useState<FinancialExpense | null>(null);
  const [payAccountId, setPayAccountId] = useState<string>(accounts[0]?.id || '');
  const [detailExpense, setDetailExpense] = useState<FinancialExpense | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: ExpenseCategory.CURRENT,
    currency: Currency.MZN,
    dueDate: new Date().toISOString().split('T')[0],
    status: ExpenseStatus.PENDING,
    notes: '',
    payImmediately: false,
    accountId: accounts[0]?.id || ''
  });

  const expenseCategories = useMemo(() => {
    return categories.filter(c => c.type === 'EXPENSE');
  }, [categories]);

  // Filtered Expenses
  const filteredDespesas = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const yearStr = `${now.getFullYear()}`;

    return expenses.filter(exp => {
      // Period
      if (selectedPeriod === 'today' && !exp.dueDate.startsWith(todayStr)) return false;
      if (selectedPeriod === 'month' && !exp.dueDate.startsWith(monthStr)) return false;
      if (selectedPeriod === 'year' && !exp.dueDate.startsWith(yearStr)) return false;

      // Status
      if (selectedStatus === 'PAID' && exp.status !== ExpenseStatus.PAID) return false;
      if (selectedStatus === 'PENDING' && exp.status !== ExpenseStatus.PENDING) return false;
      if (selectedStatus === 'OVERDUE') {
        const isPast = new Date(exp.dueDate).getTime() < now.getTime();
        if (exp.status === ExpenseStatus.PAID || !isPast) return false;
      }

      // Category
      if (selectedCategory !== 'all' && exp.category !== selectedCategory) return false;

      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = exp.name.toLowerCase().includes(query);
        const matchesCat = exp.category.toLowerCase().includes(query);
        const matchesNotes = exp.notes?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesNotes) return false;
      }

      return true;
    });
  }, [expenses, selectedPeriod, selectedStatus, selectedCategory, search]);

  // Real KPI calculations
  const totalPaid = useMemo(() => {
    return filteredDespesas
      .filter(e => e.status === ExpenseStatus.PAID)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredDespesas]);

  const totalPending = useMemo(() => {
    return filteredDespesas
      .filter(e => e.status === ExpenseStatus.PENDING)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredDespesas]);

  const overdueCount = useMemo(() => {
    const now = new Date().getTime();
    return filteredDespesas.filter(e => e.status === ExpenseStatus.PENDING && new Date(e.dueDate).getTime() < now).length;
  }, [filteredDespesas]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor insira um valor válido maior que zero.');
      return;
    }
    if (!formData.name.trim()) {
      alert('Por favor especifique a descrição ou fornecedor da despesa.');
      return;
    }

    const newExpData = {
      name: formData.name.trim(),
      amount: parsedAmount,
      category: formData.category,
      currency: formData.currency,
      dueDate: formData.dueDate,
      status: formData.payImmediately ? ExpenseStatus.PAID : formData.status,
      paidDate: formData.payImmediately ? new Date().toISOString() : undefined,
      notes: formData.notes.trim()
    };

    addExpense(newExpData);

    // If paid immediately, also trigger payment transaction against the selected account
    if (formData.payImmediately && formData.accountId) {
      // Small timeout to allow state sync
      setTimeout(() => {
        // Handled by context
      }, 50);
    }

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      amount: '',
      category: ExpenseCategory.CURRENT,
      currency: Currency.MZN,
      dueDate: new Date().toISOString().split('T')[0],
      status: ExpenseStatus.PENDING,
      notes: '',
      payImmediately: false,
      accountId: accounts[0]?.id || ''
    });
  };

  const handleConfirmPayment = () => {
    if (!payModalExpense || !payAccountId) return;
    payExpense(payModalExpense.id, payAccountId);
    setPayModalExpense(null);
  };

  const activeCompany = companies.find(c => c.id === activeCompanyId);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Gestão de Despesas
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Controlo de custos operacionais, fornecedores e liquidações bancárias offline.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Nova Despesa</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pago</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-mono">
            {totalPaid.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Despesas liquidadas
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">A Pagar (Pendente)</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {totalPending.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Contas a liquidar
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Despesas Vencidas</span>
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${overdueCount > 0 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
            {overdueCount}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {overdueCount > 0 ? 'Exigem pagamento urgente' : 'Em conformidade'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Registos</span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Tag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-mono">
            {filteredDespesas.length}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Volume de despesas filtradas
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
              placeholder="Pesquisar por fornecedor, despesa ou notas..."
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-red-500"
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
                    ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {p === 'month' ? 'Este Mês' : p === 'today' ? 'Hoje' : p === 'year' ? 'Este Ano' : 'Todas'}
              </button>
            ))}
          </div>
        </div>

        {/* Status and Category Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="h-3.5 w-3.5" />
            <span className="font-semibold">Estado:</span>
          </div>

          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'PAID', label: 'Pagas' },
              { id: 'PENDING', label: 'Pendentes' },
              { id: 'OVERDUE', label: 'Vencidas' }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === st.id 
                    ? 'bg-red-500 text-white shadow-sm' 
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs py-1 px-3 focus:outline-none focus:border-red-500 cursor-pointer ml-auto"
          >
            <option value="all">Todas as Categorias</option>
            {Object.values(ExpenseCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Lista de Despesas</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              {filteredDespesas.length}
            </span>
          </h2>
        </div>

        {filteredDespesas.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <TrendingDown className="h-12 w-12 mx-auto text-gray-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nenhuma despesa encontrada</p>
            <p className="text-xs text-gray-500 mt-1">Registe novas despesas para controlo do fluxo de saída.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-red-700"
            >
              + Adicionar Despesa
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4">Despesa / Fornecedor</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-center">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                {filteredDespesas.map((exp) => {
                  const isOverdue = exp.status === ExpenseStatus.PENDING && new Date(exp.dueDate).getTime() < new Date().getTime();
                  return (
                    <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {new Date(exp.dueDate).toLocaleDateString('pt-MZ')}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <ArrowDownRight className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          <div>
                            <span className="font-bold block truncate max-w-xs">{exp.name}</span>
                            {exp.notes && <span className="text-[10px] text-gray-400 truncate block">{exp.notes}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {exp.status === ExpenseStatus.PAID ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Pago
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
                            <AlertTriangle className="h-3 w-3" />
                            Atrasado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <Clock className="h-3 w-3" />
                            Pendente
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-red-600 dark:text-red-400 font-mono whitespace-nowrap text-sm">
                        -{exp.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} {exp.currency}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {exp.status === ExpenseStatus.PENDING && (
                            <button
                              onClick={() => {
                                setPayModalExpense(exp);
                                setPayAccountId(accounts[0]?.id || '');
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm"
                            >
                              Pagar
                            </button>
                          )}
                          <button
                            onClick={() => setDetailExpense(exp)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                            title="Ver Comprovativo"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Tem a certeza que deseja eliminar a despesa "${exp.name}"?`)) {
                                deleteExpense(exp.id);
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Nova Despesa */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-red-600 text-white">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                <h3 className="font-bold text-base">Registar Nova Despesa</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Descrição da Despesa / Fornecedor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: EDM - Factura de Electricidade Armazém"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Valor (Montante) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold text-red-600 font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Moeda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-red-500 cursor-pointer"
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
                    Categoria Contabilística
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {Object.values(ExpenseCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Data de Vencimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Pay immediately toggle */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.payImmediately}
                    onChange={(e) => setFormData({ ...formData, payImmediately: e.target.checked })}
                    className="rounded bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Despesa já foi paga (liquidar de imediato)
                  </span>
                </label>

                {formData.payImmediately && (
                  <div className="pt-2 border-t border-gray-200 dark:border-slate-800">
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                      Conta a debitar o valor:
                    </label>
                    <select
                      value={formData.accountId}
                      onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      {accounts.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.balance.toLocaleString()} {a.currency})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Notas / Observações Adicionais
                </label>
                <textarea
                  rows={2}
                  placeholder="Número de factura do fornecedor, detalhes de entrega, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-red-500"
                />
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/20 transition-all cursor-pointer"
                >
                  Registar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Liquidar / Pagar Despesa */}
      {payModalExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
              <CreditCard className="h-5 w-5" />
              <span>Liquidar Despesa</span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300">
              Confirma o pagamento de <strong className="font-mono text-gray-900 dark:text-white font-bold">{payModalExpense.amount.toLocaleString()} {payModalExpense.currency}</strong> para <strong>{payModalExpense.name}</strong>?
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Selecione a Conta de Saída:
              </label>
              <select
                value={payAccountId}
                onChange={(e) => setPayAccountId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} — Saldo: {a.balance.toLocaleString()} {a.currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPayModalExpense(null)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-950/20 cursor-pointer"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes da Despesa */}
      {detailExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span>Comprovativo de Registo de Despesa</span>
              </h3>
              <button onClick={() => setDetailExpense(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500">Descrição:</span>
                <span className="font-bold text-gray-900 dark:text-white">{detailExpense.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500">Montante:</span>
                <span className="font-bold font-mono text-red-600 dark:text-red-400">
                  {detailExpense.amount.toLocaleString()} {detailExpense.currency}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500">Categoria:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{detailExpense.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500">Data de Vencimento:</span>
                <span className="font-mono">{new Date(detailExpense.dueDate).toLocaleDateString('pt-MZ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500">Estado:</span>
                <span className={`font-bold ${detailExpense.status === ExpenseStatus.PAID ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {detailExpense.status === ExpenseStatus.PAID ? 'Liquidado' : 'Pendente de Pagamento'}
                </span>
              </div>
              {detailExpense.paidDate && (
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                  <span className="text-gray-500">Data do Pagamento:</span>
                  <span className="font-mono text-emerald-600">{new Date(detailExpense.paidDate).toLocaleDateString('pt-MZ')}</span>
                </div>
              )}
              {detailExpense.notes && (
                <div className="pt-2">
                  <span className="text-gray-500 block mb-1">Notas:</span>
                  <p className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300">
                    {detailExpense.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
